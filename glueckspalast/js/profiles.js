/* ================= Spielerprofile & Login =================
   Jeder Spieler hat Namen, 4-stellige PIN und einen eigenen Spielstand.
   Ohne Online-Speicher liegen die Profile in diesem Browser. Mit Online-Speicher (js/config.js)
   kann man sich auf jedem Gerät mit Namen und PIN einloggen.
   Muss VOR main.js geladen werden: main.js liest den Speicherplatz aus GP_PROFILE. */
const GPProfiles = (() => {
  const IDX_KEY = 'glueckspalast-profiles-v1', SESSION_KEY = 'gp-session', REMEMBER_KEY = 'gp-remember';
  const LEGACY_KEY = 'glueckspalast-v1', TRIES_KEY = 'gp-login-tries';
  const store = s => ({
    get(k) { try { return s().getItem(k); } catch (e) { return null; } },
    set(k, v) { try { s().setItem(k, v); } catch (e) {} },
    del(k) { try { s().removeItem(k); } catch (e) {} }
  });
  const ls = store(() => localStorage), ss = store(() => sessionStorage);
  const online = typeof GPOnline !== 'undefined' && GPOnline.enabled;

  let idx = { profiles: {}, last: null };
  try { const raw = ls.get(IDX_KEY); if (raw) idx = Object.assign(idx, JSON.parse(raw)); } catch (e) {}
  const saveIdx = () => ls.set(IDX_KEY, JSON.stringify(idx));

  const NAME_RE = /^[\p{L}\p{N} ._-]{2,16}$/u;
  const nameKey = n => String(n).trim().toLowerCase();
  const pinHash = (name, pin) => sha256Hex(nameKey(name) + ':' + pin + ':glueckspalast');
  const storageKey = id => 'glueckspalast-p-' + id;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const newId = () => { const a = new Uint32Array(2); crypto.getRandomValues(a); return a[0].toString(36) + a[1].toString(36); };
  const byName = name => Object.entries(idx.profiles).find(([, p]) => nameKey(p.name) === nameKey(name));

  /* ---------- aktive Sitzung (läuft sofort, vor main.js) ---------- */
  const activeId = ss.get(SESSION_KEY) || ls.get(REMEMBER_KEY);
  const me = activeId && idx.profiles[activeId] ? idx.profiles[activeId] : null;
  window.GP_PROFILE = me ? { id: activeId, name: me.name, key: storageKey(activeId), online: !!me.online && online } : null;
  if (me) ss.set(SESSION_KEY, activeId);

  function enter(id, remember) {
    ss.set(SESSION_KEY, id);
    if (remember) ls.set(REMEMBER_KEY, id); else if (ls.get(REMEMBER_KEY) === id) ls.del(REMEMBER_KEY);
    idx.last = id;
    idx.profiles[id].lastLogin = Date.now();
    saveIdx();
    ss.del(TRIES_KEY);
    location.reload();
  }
  function logout() {
    if (window.GP_PROFILE) flush();
    ss.del(SESSION_KEY);
    ls.del(REMEMBER_KEY);
    location.reload();
  }
  function createLocal(name, hash, state, isOnline) {
    const id = newId();
    idx.profiles[id] = { name: name.trim(), pinHash: hash, created: Date.now(), balance: state && state.balance || 5000, online: !!isOnline, savedAt: state && state.savedAt || 0 };
    if (state) ls.set(storageKey(id), JSON.stringify(state));
    saveIdx();
    return id;
  }
  function removeProfile(id) {
    delete idx.profiles[id];
    ls.del(storageKey(id));
    if (idx.last === id) idx.last = null;
    saveIdx();
  }
  function list() { return Object.entries(idx.profiles).map(([id, p]) => ({ id, name: p.name, balance: p.balance || 0, lastLogin: p.lastLogin || p.created })); }
  function legacyState() { try { const raw = ls.get(LEGACY_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }

  /* ---------- Speichern & Online-Abgleich ---------- */
  let syncTimer = null, pending = null;
  function onSave(S) {
    if (!window.GP_PROFILE) return;
    const p = idx.profiles[GP_PROFILE.id]; if (!p) return;
    p.balance = Math.round(S.balance);
    p.savedAt = Date.now();
    saveIdx();
    if (GP_PROFILE.online) {
      pending = Object.assign({}, S, { savedAt: p.savedAt });
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => flush(), 6000);
    }
  }
  function flush(keepalive) {
    if (!pending || !window.GP_PROFILE || !GP_PROFILE.online) return;
    const p = idx.profiles[GP_PROFILE.id], state = pending;
    pending = null; clearTimeout(syncTimer);
    GPOnline.rpc('gp_save', { p_name: p.name, p_pin_hash: p.pinHash, p_state: state }, keepalive)
      .catch(e => { pending = pending || state; console.warn('Online speichern:', e.message); });
  }
  addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });

  // Neueren Spielstand von einem anderen Gerät übernehmen
  async function syncDown() {
    if (!window.GP_PROFILE || !GP_PROFILE.online) return;
    const p = idx.profiles[GP_PROFILE.id];
    try {
      const r = await GPOnline.rpc('gp_login', { p_name: p.name, p_pin_hash: p.pinHash });
      const st = r && r.state;
      if (st && st.savedAt && st.savedAt > (p.savedAt || 0)) {
        ls.set(storageKey(GP_PROFILE.id), JSON.stringify(st));
        p.savedAt = st.savedAt; p.balance = st.balance || p.balance; saveIdx();
        ss.set('gp-synced-note', '1');
        location.reload();
      }
    } catch (e) { console.warn('Online laden:', e.message); }
  }
  function submitScore(e) {
    if (!window.GP_PROFILE || !GP_PROFILE.online) return Promise.resolve();
    const p = idx.profiles[GP_PROFILE.id];
    return GPOnline.rpc('gp_add_score', { p_name: p.name, p_pin_hash: p.pinHash, p_machine: e.m, p_amount: e.amount, p_bet: e.bet, p_type: e.type })
      .catch(err => console.warn('Bestenliste online:', err.message));
  }

  /* ---------- Login-Bildschirm ---------- */
  let veil = null;
  const triesLeft = () => { const t = JSON.parse(ss.get(TRIES_KEY) || '{"n":0,"until":0}'); return t; };
  function badTry(msgEl) {
    const t = triesLeft(); t.n++;
    if (t.n >= 5) { t.until = Date.now() + 30000; t.n = 0; }
    ss.set(TRIES_KEY, JSON.stringify(t));
    msgEl.textContent = t.until > Date.now() ? 'Zu viele Fehlversuche. Bitte 30 Sekunden warten.' : 'Falsche PIN.';
    const card = veil.querySelector('.gpl-card'); card.classList.remove('bad'); void card.offsetWidth; card.classList.add('bad');
  }
  const locked = () => triesLeft().until > Date.now();

  function showLogin() {
    if (veil) return;
    veil = document.createElement('div');
    veil.className = 'gpl-veil';
    veil.setAttribute('role', 'dialog');
    veil.setAttribute('aria-modal', 'true');
    veil.setAttribute('aria-labelledby', 'gplTitle');
    veil.innerHTML = `
      <div class="gpl-card">
        <svg class="gpl-crown" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 46 L4 16 L20 28 L32 8 L44 28 L60 16 L56 46Z" fill="url(#gGold)" stroke="#7a4a08" stroke-width="2" stroke-linejoin="round"/><rect x="8" y="44" width="48" height="10" rx="3" fill="url(#gGold)" stroke="#7a4a08" stroke-width="2"/><circle cx="32" cy="49" r="3.4" fill="#e3112d"/></svg>
        <h1 id="gplTitle">Glückspalast</h1>
        <div class="gpl-body" id="gplBody"></div>
        <p class="gpl-err" id="gplErr" role="alert"></p>
        <p class="gpl-note">Gespielt wird mit Spielgeld ohne Geldwert. Die PIN schützt dein Profil vor anderen${online ? '' : ' an diesem Gerät'}. Bitte keine echte PIN oder ein echtes Passwort verwenden.</p>
      </div>`;
    document.body.appendChild(veil);
    const profiles = list().sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
    if (profiles.length) stepChoose(profiles); else stepNew();
  }
  const body = () => veil.querySelector('#gplBody');
  const err = t => { veil.querySelector('#gplErr').textContent = t || ''; };
  const pinField = (id, label) => `<label class="gpl-label" for="${id}">${label}</label>
    <input class="gpl-input gpl-pin" id="${id}" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••">`;
  const rememberField = `<label class="gpl-check"><input type="checkbox" id="gplRemember" checked> Auf diesem Gerät angemeldet bleiben</label>`;
  const busy = (btn, on, label) => { btn.disabled = on; if (label) btn.textContent = on ? 'Einen Moment …' : label; };

  function stepChoose(profiles) {
    err('');
    body().innerHTML = `
      <p class="gpl-sub">Wer spielt?</p>
      <div class="gpl-players">${profiles.map(p => `
        <button type="button" class="gpl-player" data-id="${p.id}">
          <span class="gpl-avatar" aria-hidden="true">${esc(p.name.slice(0, 1).toUpperCase())}</span>
          <span class="gpl-pname">${esc(p.name)}</span>
          <span class="gpl-pbal num">${fmtN(p.balance)} Chips</span>
        </button>`).join('')}
      </div>
      <div class="gpl-actions">
        <button type="button" class="gpl-btn ghost" id="gplNew">Neuer Spieler</button>
        ${online ? '<button type="button" class="gpl-btn ghost" id="gplRemote">Von anderem Gerät einloggen</button>' : ''}
      </div>`;
    body().querySelectorAll('.gpl-player').forEach(b => b.onclick = () => stepPin(b.dataset.id));
    body().querySelector('#gplNew').onclick = stepNew;
    const rb = body().querySelector('#gplRemote'); if (rb) rb.onclick = stepRemote;
    setTimeout(() => body().querySelector('.gpl-player')?.focus(), 30);
  }

  function stepPin(id) {
    err('');
    const p = idx.profiles[id];
    body().innerHTML = `
      <p class="gpl-sub">Hallo, <b>${esc(p.name)}</b>!</p>
      ${pinField('gplPin', 'Deine PIN')}
      ${rememberField}
      <div class="gpl-actions">
        <button type="button" class="gpl-btn ghost" id="gplBack">Zurück</button>
        <button type="button" class="gpl-btn" id="gplGo">Einloggen</button>
      </div>`;
    const pin = body().querySelector('#gplPin'), go = body().querySelector('#gplGo');
    const tryLogin = () => {
      if (locked()) { err('Zu viele Fehlversuche. Bitte 30 Sekunden warten.'); return; }
      if (!/^\d{4}$/.test(pin.value)) { err('Die PIN hat 4 Ziffern.'); return; }
      if (pinHash(p.name, pin.value) === p.pinHash) { enter(id, body().querySelector('#gplRemember').checked); return; }
      pin.value = ''; badTry(veil.querySelector('#gplErr'));
    };
    go.onclick = tryLogin;
    pin.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
    pin.addEventListener('input', () => { if (pin.value.length === 4) tryLogin(); });
    body().querySelector('#gplBack').onclick = () => stepChoose(list());
    setTimeout(() => pin.focus(), 30);
  }

  function stepNew() {
    err('');
    const legacy = !list().length && legacyState();
    const others = list().length;
    body().innerHTML = `
      <p class="gpl-sub">${others ? 'Neuer Spieler' : 'Willkommen! Wie heißt du?'}</p>
      <label class="gpl-label" for="gplName">Dein Name (steht in der Bestenliste)</label>
      <input class="gpl-input" id="gplName" maxlength="16" autocomplete="nickname" placeholder="z. B. Flo">
      ${pinField('gplNewPin', 'Wähle eine 4-stellige PIN')}
      ${legacy && legacy.balance ? `<label class="gpl-check"><input type="checkbox" id="gplLegacy" checked> Bisherigen Spielstand übernehmen (${fmtN(legacy.balance)} Chips)</label>` : ''}
      ${rememberField}
      <div class="gpl-actions">
        ${others ? '<button type="button" class="gpl-btn ghost" id="gplBack">Zurück</button>' : (online ? '<button type="button" class="gpl-btn ghost" id="gplRemote">Ich habe schon ein Profil</button>' : '')}
        <button type="button" class="gpl-btn" id="gplGo">Los geht's</button>
      </div>`;
    const nm = body().querySelector('#gplName'), pin = body().querySelector('#gplNewPin'), go = body().querySelector('#gplGo');
    const create = async () => {
      const name = nm.value.trim();
      if (!NAME_RE.test(name)) { err('Der Name braucht 2 bis 16 Zeichen: Buchstaben, Zahlen, Leerzeichen, Punkt, _ oder -.'); nm.focus(); return; }
      if (!/^\d{4}$/.test(pin.value)) { err('Bitte genau 4 Ziffern als PIN wählen.'); pin.focus(); return; }
      if (byName(name)) { err('Diesen Namen gibt es auf diesem Gerät schon. Bitte einloggen oder einen anderen Namen wählen.'); return; }
      const hash = pinHash(name, pin.value);
      const useLegacy = body().querySelector('#gplLegacy')?.checked;
      const state = useLegacy ? Object.assign(legacy, { savedAt: Date.now() }) : null;
      if (online) {
        busy(go, true, "Los geht's");
        try { await GPOnline.rpc('gp_register', { p_name: name, p_pin_hash: hash, p_state: state || { balance: 5000, savedAt: Date.now() } }); }
        catch (e) { busy(go, false, "Los geht's"); err(e.message); return; }
      }
      const id = createLocal(name, hash, state, online);
      enter(id, body().querySelector('#gplRemember').checked);
    };
    go.onclick = create;
    [nm, pin].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') create(); }));
    const back = body().querySelector('#gplBack'); if (back) back.onclick = () => stepChoose(list());
    const rb = body().querySelector('#gplRemote'); if (rb) rb.onclick = stepRemote;
    setTimeout(() => nm.focus(), 30);
  }

  function stepRemote() {
    err('');
    body().innerHTML = `
      <p class="gpl-sub">Mit deinem Profil einloggen</p>
      <label class="gpl-label" for="gplRName">Name</label>
      <input class="gpl-input" id="gplRName" maxlength="16" autocomplete="username">
      ${pinField('gplRPin', 'PIN')}
      ${rememberField}
      <div class="gpl-actions">
        <button type="button" class="gpl-btn ghost" id="gplBack">Zurück</button>
        <button type="button" class="gpl-btn" id="gplGo">Einloggen</button>
      </div>`;
    const nm = body().querySelector('#gplRName'), pin = body().querySelector('#gplRPin'), go = body().querySelector('#gplGo');
    const login = async () => {
      const name = nm.value.trim();
      if (!NAME_RE.test(name) || !/^\d{4}$/.test(pin.value)) { err('Bitte Namen und 4-stellige PIN eingeben.'); return; }
      const hash = pinHash(name, pin.value);
      busy(go, true, 'Einloggen');
      try {
        const r = await GPOnline.rpc('gp_login', { p_name: name, p_pin_hash: hash });
        const found = byName(r.name);
        let id;
        if (found) {
          id = found[0];
          Object.assign(idx.profiles[id], { name: r.name, pinHash: hash, online: true, savedAt: r.state && r.state.savedAt || 0, balance: r.state && r.state.balance || 0 });
          if (r.state) ls.set(storageKey(id), JSON.stringify(r.state));
          saveIdx();
        } else id = createLocal(r.name, hash, r.state || null, true);
        enter(id, body().querySelector('#gplRemember').checked);
      } catch (e) { busy(go, false, 'Einloggen'); err(e.message); }
    };
    go.onclick = login;
    [nm, pin].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') login(); }));
    body().querySelector('#gplBack').onclick = () => list().length ? stepChoose(list()) : stepNew();
    setTimeout(() => nm.focus(), 30);
  }

  const fmtN = n => Math.round(n || 0).toLocaleString('de-DE');

  // Solange der Login offen ist, keine Tasten an das Spiel durchreichen
  addEventListener('keydown', e => {
    if (veil && !veil.contains(e.target)) { e.stopPropagation(); if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); }
  }, true);

  /* ---------- Spieler-Anzeige oben rechts ---------- */
  function renderChip() {
    const chip = document.getElementById('playerChip');
    if (!chip || !window.GP_PROFILE) return;
    chip.hidden = false;
    chip.innerHTML = `
      <button type="button" class="pc-btn" id="pcBtn" aria-haspopup="true" aria-expanded="false" title="Spieler">
        <span class="gpl-avatar sm" aria-hidden="true">${esc(GP_PROFILE.name.slice(0, 1).toUpperCase())}</span>
        <span class="pc-name">${esc(GP_PROFILE.name)}</span>${GP_PROFILE.online ? '<span class="pc-online" title="Online gespeichert">online</span>' : ''}
      </button>
      <div class="pc-menu" id="pcMenu" hidden>
        <button type="button" id="pcSwitch">Spieler wechseln</button>
        <button type="button" id="pcDelete" class="danger">Profil von diesem Gerät löschen</button>
        <div class="pc-confirm" id="pcConfirm" hidden>
          <p>${GP_PROFILE.online ? 'Das Profil wird nur von diesem Gerät entfernt. Online bleibt es erhalten.' : 'Profil und Spielstand werden gelöscht.'}</p>
          <button type="button" id="pcDelNo">Abbrechen</button><button type="button" id="pcDelYes" class="danger">Löschen</button>
        </div>
      </div>`;
    const btn = chip.querySelector('#pcBtn'), menu = chip.querySelector('#pcMenu');
    const toggle = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', open); if (!open) chip.querySelector('#pcConfirm').hidden = true; };
    btn.onclick = e => { e.stopPropagation(); toggle(menu.hidden); };
    document.addEventListener('click', e => { if (!chip.contains(e.target)) toggle(false); });
    chip.querySelector('#pcSwitch').onclick = logout;
    chip.querySelector('#pcDelete').onclick = () => { chip.querySelector('#pcConfirm').hidden = false; };
    chip.querySelector('#pcDelNo').onclick = () => { chip.querySelector('#pcConfirm').hidden = true; };
    chip.querySelector('#pcDelYes').onclick = () => { const id = GP_PROFILE.id; pending = null; removeProfile(id); ss.del(SESSION_KEY); ls.del(REMEMBER_KEY); location.reload(); };
  }

  function init() {
    if (!window.GP_PROFILE) showLogin();
    else {
      renderChip();
      if (ss.get('gp-synced-note')) { ss.del('gp-synced-note'); setTimeout(() => typeof toast === 'function' && toast('Neuerer Spielstand von einem anderen Gerät geladen'), 600); }
      syncDown();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);

  return { onSave, flush, list, submitScore, logout, current: () => window.GP_PROFILE, isOnline: () => !!(window.GP_PROFILE && GP_PROFILE.online), esc };
})();
window.GPProfiles = GPProfiles;
