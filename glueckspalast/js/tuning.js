/* ================= Quoten-Regler =================
   Steuert je Automat:
     luck     Gewinnchance  -1 … +1   (0 = Standard). Positiv: verlorene Drehs werden mit dieser
                                       Wahrscheinlichkeit neu ausgelost. Negativ: gewonnene Drehs.
     feature  Bonus-Chance   0.25 … 5 (1 = Standard). Gewicht von Scatter bzw. Münzen auf den Walzen.
     gamble   Risikoleiter   0 … 1    (0.5 = Standard). Chance, eine Risikostufe zu gewinnen.
   Die Einstellungen gelten nur in DIESEM Browser (localStorage). Für alle Besucher ändert man
   die Gewichte in js/logic.js und prüft sie mit tools/simulate.js. */

const Tune = (() => {
  const KEY = 'glueckspalast-tuning-v1';
  const DEF = { luck: 0, feature: 1, gamble: 0.5 };
  let st = { machines: {}, until: 0 };
  try { const raw = localStorage.getItem(KEY); if (raw) st = Object.assign(st, JSON.parse(raw)); } catch (e) {}
  const force = {};
  const est = {};

  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const notify = () => document.dispatchEvent(new CustomEvent('gp:tuning'));
  const sig = t => `${t.luck}|${t.feature}`;

  function get(id) { return Object.assign({}, DEF, st.machines[id] || {}); }
  function isModified(id) { const t = get(id); return t.luck !== DEF.luck || t.feature !== DEF.feature || t.gamble !== DEF.gamble; }
  function anyModified() { return Object.keys(MACHINES).some(isModified); }

  function apply(m) {
    const t = get(m.id), keys = [m.scatter, m.coin].filter(Boolean);
    if (t.feature === 1 || !keys.length) { delete m.tuned; return; }
    m.tuned = m.reels.map(list => list.map(([id, w]) => [id, keys.includes(id) ? w * t.feature : w]));
  }
  function applyAll() { Object.values(MACHINES).forEach(apply); }

  function checkExpiry() {
    if (st.until && Date.now() > st.until) { st = { machines: {}, until: 0 }; persist(); applyAll(); notify(); }
  }
  function set(id, patch) {
    const t = Object.assign(get(id), patch);
    if (t.luck === DEF.luck && t.feature === DEF.feature && t.gamble === DEF.gamble) delete st.machines[id];
    else st.machines[id] = t;
    persist(); apply(MACHINES[id]); notify();
  }
  function reset(id) { delete st.machines[id]; persist(); apply(MACHINES[id]); notify(); }
  function resetAll() { st.machines = {}; st.until = 0; persist(); applyAll(); notify(); }
  function setDuration(minutes) { st.until = minutes ? Date.now() + minutes * 60000 : 0; persist(); notify(); }
  function untilTs() { return st.until; }

  const hasFeature = r => !!((r.scatter && r.scatter.spins) || r.coins);
  const isHit = r => r.total > 0 || hasFeature(r);

  // Ein Walzenbild unter Berücksichtigung der Gewinnchance
  function gen(m, bet, t) {
    let g = generate(m);
    if (t.luck > 0) {
      let tries = t.luck >= .67 ? 3 : t.luck >= .34 ? 2 : 1;
      while (tries-- > 0) {
        if (isHit(evaluate(m, g, bet)) || rnd() >= t.luck) break;
        g = generate(m);
      }
    } else if (t.luck < 0) {
      if (isHit(evaluate(m, g, bet)) && rnd() < -t.luck) g = generate(m);
    }
    return g;
  }
  function generateTuned(m, bet) {
    checkExpiry();
    if (force[m.id]) {
      delete force[m.id];
      for (let i = 0; i < 60000; i++) { const g = generate(m); if (hasFeature(evaluate(m, g, bet))) return g; }
    }
    return gen(m, bet, get(m.id));
  }
  function forceFeature(id) { force[id] = true; }
  function hasFeatureMachine(m) { return !!(m.scatter || m.coin); }

  function gambleP(id) { checkExpiry(); return get(id).gamble; }
  function gambleCard(id, guessRed) {
    const win = rnd() < gambleP(id);
    const red = win ? guessRed : !guessRed;
    const suits = red ? ['♥', '♦'] : ['♠', '♣'];
    return { s: suits[Math.floor(rnd() * 2)], red };
  }

  // ---------- Schätzung per Simulation (für Admin-Panel und Gewinnplan) ----------
  function simFree(m, spins, B, t) {
    let won = 0, left = spins, total = spins, mult = m.fsMultStart || m.fsMult || 1;
    const sym = m.expanding ? chooseExpand(m) : null;
    while (left > 0) {
      left--;
      const g = gen(m, B, t), r = evaluate(m, g, B);
      let w = r.total;
      if (sym) w += expandWin(m, g, B, sym).amt;
      won += w * mult;
      mult = fsMultNext(m, mult, w > 0);
      if (r.scatter && r.scatter.spins) { const add = Math.max(0, Math.min(r.scatter.spins, FS_CAP - total)); left += add; total += add; }
    }
    return won;
  }
  function simHW(m, g, B) {
    const locked = Array(m.cols * m.rows).fill(null);
    g.forEach((col, c) => col.forEach((cell, r) => { if (cell.id === m.coin) locked[c * m.rows + r] = cell; }));
    let respins = 3, won = 0;
    while (respins > 0 && locked.some(x => !x)) respins = respinStep(m, locked).length ? 3 : respins - 1;
    for (const cell of locked) if (cell) won += coinAmount(m, cell.v, B);
    if (locked.every(Boolean)) won += m.grandSeed || 0;
    return won;
  }
  // Läuft in Zeitscheiben von 8 ms, damit Animationen flüssig bleiben. onProgress(0…1)
  async function estimate(m, t, spins = 50000, onProgress) {
    const B = 100, saved = m.tuned;
    const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const keys = [m.scatter, m.coin].filter(Boolean);
    const tuned = t.feature === 1 || !keys.length ? undefined
      : m.reels.map(list => list.map(([id, w]) => [id, keys.includes(id) ? w * t.feature : w]));
    let won = 0, hits = 0, feats = 0, done = 0;
    while (done < spins) {
      const t0 = now();
      if (tuned) m.tuned = tuned; else delete m.tuned;
      try {
        while (done < spins) {
          const g = gen(m, B, t), r = evaluate(m, g, B);
          won += r.total;
          if (isHit(r)) hits++;
          if (r.scatter && r.scatter.spins) { feats++; won += simFree(m, r.scatter.spins, B, t); }
          if (r.coins) { feats++; won += simHW(m, g, B); }
          if (++done % 40 === 0 && now() - t0 > 8) break;
        }
      } finally {
        if (saved) m.tuned = saved; else delete m.tuned;
      }
      if (onProgress) onProgress(done / spins);
      await new Promise(res => setTimeout(res, 0));
    }
    return { rtp: won / (spins * B), hit: spins / Math.max(1, hits), feat: feats ? spins / feats : 0 };
  }
  async function estimateCached(m, t, onProgress) {
    const k = m.id + '|' + sig(t);
    if (!est[k]) est[k] = await estimate(m, t, 50000, onProgress);
    return est[k];
  }
  function cachedFor(m) { return est[m.id + '|' + sig(get(m.id))]; }

  const pct = x => (Math.round(x * 1000) / 10).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' %';
  function rtpLabel(m) {
    if (!isModified(m.id)) return m.rtp;
    const e = cachedFor(m);
    const t = get(m.id);
    if (t.luck === 0 && t.feature === 1) return `${m.rtp} (nur Risikoleiter angepasst)`;
    if (e) return `≈ ${pct(e.rtp)} (angepasst, Schätzung)`;
    // Noch nicht berechnet: im Hintergrund rechnen und die Anzeige danach aktualisieren
    estimateCached(m, t).then(r => document.querySelectorAll(`.rtp-live[data-m="${m.id}"]`)
      .forEach(el => { el.textContent = `≈ ${pct(r.rtp)} (angepasst, Schätzung)`; }));
    return `<span class="rtp-live" data-m="${m.id}">angepasst, wird berechnet …</span>`;
  }

  applyAll();
  return { get, set, reset, resetAll, isModified, anyModified, setDuration, untilTs, checkExpiry,
           generate: generateTuned, forceFeature, hasFeatureMachine, gambleP, gambleCard,
           estimate, estimateCached, cachedFor, rtpLabel, pct, DEF };
})();

/* ---------- SHA-256 (für das Admin-Passwort, ohne Abhängigkeiten) ---------- */
function sha256Hex(str) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes = new TextEncoder().encode(str);
  const len = bytes.length, bitLen = len * 8;
  const total = ((len + 9 + 63) >> 6) << 6;
  const buf = new Uint8Array(total);
  buf.set(bytes); buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000)); dv.setUint32(total - 4, bitLen >>> 0);
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i-15], 7) ^ rotr(w[i-15], 18) ^ (w[i-15] >>> 3);
      const s1 = rotr(w[i-2], 17) ^ rotr(w[i-2], 19) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h = h.map((v, i) => (v + [a, b, c, d, e, f, g, hh][i]) >>> 0);
  }
  return h.map(v => v.toString(16).padStart(8, '0')).join('');
}
