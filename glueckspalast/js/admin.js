/* ================= Geheimes Admin-Panel =================
   Öffnen: 5× schnell auf das Logo klicken oder das geheime Wort tippen (siehe js/config.js).
   Wichtig: Das Passwort schützt nur vor Neugierigen. Alles läuft im Browser, und die
   Einstellungen gelten nur in DEM Browser, in dem sie gemacht wurden. */
(() => {
  const C = Object.assign({ secretLogoClicks: 5, secretWord: 'tresor', maxPasswordTries: 5, lockSeconds: 30 }, window.GP_CONFIG || {});
  const OK_KEY = 'gp-admin-ok', LOCK_KEY = 'gp-admin-lock';
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  const FEATURE_STOPS = [0.25, 0.33, 0.5, 0.67, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
  const ICON = { alge: 'king', frucht: 'cherry', sterne: 'star', drache: 'dragon', buch: 'book' };
  let tries = 0, tab = null, panel = null, runToken = 0;

  /* ---------- geheime Zugänge ---------- */
  let clicks = [];
  const logo = document.getElementById('home');
  if (logo) logo.addEventListener('click', () => {
    const now = Date.now();
    clicks = clicks.filter(t => now - t < 2500);
    clicks.push(now);
    if (clicks.length >= C.secretLogoClicks) { clicks = []; open(); }
  });
  let typed = '';
  document.addEventListener('keydown', e => {
    if (!C.secretWord || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
    typed = (typed + e.key.toLowerCase()).slice(-C.secretWord.length);
    if (typed === C.secretWord.toLowerCase()) { typed = ''; open(); }
  });

  function open() {
    if (document.querySelector('.gpa-veil, .gpa-panel')) return;
    if (ss.get(OK_KEY) === '1') showPanel(); else showLogin();
  }
  window.GPAdmin = { open };

  /* ---------- Passwort ---------- */
  function lockLeft() { const t = +(ss.get(LOCK_KEY) || 0); return Math.max(0, Math.ceil((t - Date.now()) / 1000)); }
  function showLogin() {
    const veil = document.createElement('div');
    veil.className = 'gpa-veil';
    veil.innerHTML = `
      <div class="gpa-login" role="dialog" aria-modal="true" aria-labelledby="gpaTitle">
        <svg class="gpa-dial" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="url(#gGold)" stroke="#7a4a08" stroke-width="2"/>
          <circle cx="50" cy="50" r="36" fill="#1a0a10" stroke="#f7c948" stroke-width="2"/>
          ${Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2; const r1 = i % 6 ? 31 : 27;
            return `<line x1="${(50 + Math.cos(a) * r1).toFixed(1)}" y1="${(50 + Math.sin(a) * r1).toFixed(1)}" x2="${(50 + Math.cos(a) * 34).toFixed(1)}" y2="${(50 + Math.sin(a) * 34).toFixed(1)}" stroke="#f7c948" stroke-width="1.6"/>`; }).join('')}
          <circle cx="50" cy="50" r="14" fill="url(#gGoldR)" stroke="#7a4a08" stroke-width="1.5"/>
          <rect x="47.5" y="22" width="5" height="16" rx="2.5" fill="#fff1a8"/>
        </svg>
        <h2 id="gpaTitle">Tresor</h2>
        <p>Admin-Bereich. Bitte Passwort eingeben.</p>
        <label class="sr-only" for="gpaPw" style="position:absolute;left:-9999px">Passwort</label>
        <input class="gpa-input" id="gpaPw" type="password" autocomplete="off" placeholder="Passwort">
        <p class="gpa-err" id="gpaErr" role="alert"></p>
        <div class="gpa-row">
          <button type="button" class="gpa-btn ghost" id="gpaCancel">Abbrechen</button>
          <button type="button" class="gpa-btn" id="gpaGo">Öffnen</button>
        </div>
      </div>`;
    document.body.appendChild(veil);
    const form = veil.querySelector('.gpa-login'), input = veil.querySelector('#gpaPw'), err = veil.querySelector('#gpaErr');
    const close = () => veil.remove();
    const tick = () => {
      const left = lockLeft();
      veil.querySelector('#gpaGo').disabled = left > 0;
      if (left > 0) { err.textContent = `Zu viele Fehlversuche. Bitte ${left} Sekunden warten.`; setTimeout(tick, 1000); }
      else if (err.textContent.startsWith('Zu viele')) err.textContent = '';
    };
    tick();
    setTimeout(() => input.focus(), 50);
    veil.querySelector('#gpaCancel').onclick = close;
    veil.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
    veil.addEventListener('click', e => { if (e.target === veil) close(); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    veil.querySelector('#gpaGo').addEventListener('click', check);
    function check() {
      if (lockLeft() > 0) return;
      if (sha256Hex(input.value) === String(C.adminPasswordSha256 || '').toLowerCase()) {
        ss.set(OK_KEY, '1'); tries = 0; close(); showPanel();
        return;
      }
      tries++;
      input.value = '';
      form.classList.remove('bad'); void form.offsetWidth; form.classList.add('bad');
      if (tries >= C.maxPasswordTries) {
        tries = 0; ss.set(LOCK_KEY, String(Date.now() + C.lockSeconds * 1000)); tick();
      } else err.textContent = `Falsches Passwort. Noch ${C.maxPasswordTries - tries} Versuch${C.maxPasswordTries - tries === 1 ? '' : 'e'}.`;
    }
  }

  /* ---------- Panel ---------- */
  const symFor = id => { const m = MACHINES[id]; const s = m.sym[ICON[id]] || Object.values(m.sym)[0]; return s.svg || ''; };
  const luckText = v => v === 0 ? 'Standard' : v > 0 ? `+${v} % Glück` : `${v} % Pech`;
  const featText = f => (f === 1 ? '×1 · Standard' : '×' + String(f).replace('.', ','));
  const gambleText = p => p === 50 ? '50 % · fair' : `${p} %`;
  const oneIn = x => x ? '1 von ' + (Math.round(x * 10) / 10).toLocaleString('de-DE') : '–';
  const every = x => x ? 'alle ' + Math.round(x).toLocaleString('de-DE') : 'keine';

  function showPanel() {
    tab = UI.cur || tab || Object.keys(MACHINES)[0];
    panel = document.createElement('aside');
    panel.className = 'gpa-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Admin-Panel: Quoten-Regler');
    panel.innerHTML = `
      <div class="gpa-head">
        <div style="flex:1"><div class="gpa-eyebrow">Admin · Tresor</div><h2>Quoten-Regler</h2></div>
        <button class="gpa-x" type="button" id="gpaClose" aria-label="Panel schließen">✕</button>
      </div>
      <nav class="gpa-tabs" role="tablist" id="gpaTabs"></nav>
      <div class="gpa-body" id="gpaBody"></div>
      <div class="gpa-foot">
        <label for="gpaDur">Änderungen gelten
          <select id="gpaDur">
            <option value="0">bis ich sie zurücksetze</option>
            <option value="10">10 Minuten</option>
            <option value="30">30 Minuten</option>
            <option value="60">1 Stunde</option>
          </select>
        </label>
        <p class="gpa-local" id="gpaUntil"></p>
        <div class="gpa-row">
          <button class="gpa-btn danger small" type="button" id="gpaResetAll">Alle Automaten zurücksetzen</button>
          <button class="gpa-btn ghost small" type="button" id="gpaLogout">Abmelden</button>
        </div>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector('#gpaClose').onclick = closePanel;
    panel.querySelector('#gpaLogout').onclick = () => { ss.del(OK_KEY); closePanel(); toast('Admin abgemeldet'); };
    panel.querySelector('#gpaResetAll').onclick = () => { Tune.resetAll(); renderTabs(); renderBody(); toast('Alle Quoten auf Standard'); };
    panel.querySelector('#gpaDur').onchange = e => { Tune.setDuration(+e.target.value); renderUntil(); };
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); closePanel(); } });
    renderTabs(); renderBody(); renderUntil();
    setTimeout(() => panel.querySelector('.gpa-tab[aria-selected="true"]')?.focus(), 60);
  }
  function closePanel() { runToken++; if (panel) panel.remove(); panel = null; }
  function renderUntil() {
    if (!panel) return;
    const u = Tune.untilTs();
    panel.querySelector('#gpaUntil').textContent = u
      ? `Automatisches Zurücksetzen um ${new Date(u).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr.`
      : 'Die Einstellungen gelten nur in diesem Browser. Andere Besucher spielen mit den Standardquoten.';
    if (!u) panel.querySelector('#gpaDur').value = '0';
  }
  function renderTabs() {
    const nav = panel.querySelector('#gpaTabs');
    nav.innerHTML = Object.values(MACHINES).map(m => `
      <button type="button" role="tab" class="gpa-tab${Tune.isModified(m.id) ? ' mod' : ''}" data-id="${m.id}" aria-selected="${m.id === tab}">
        <span class="ic">${symFor(m.id)}</span>${m.name.split(' – ')[0]}
      </button>`).join('');
    nav.querySelectorAll('.gpa-tab').forEach(b => b.onclick = () => { tab = b.dataset.id; renderTabs(); renderBody(); });
  }

  function renderBody() {
    const m = MACHINES[tab], t = Tune.get(tab);
    const feat = Tune.hasFeatureMachine(m);
    const fIdx = Math.max(0, FEATURE_STOPS.indexOf(t.feature));
    const body = panel.querySelector('#gpaBody');
    body.innerHTML = `
      <section class="gpa-sec">
        <h3><label for="gpaLuck">Gewinnchance</label><output id="gpaLuckOut">${luckText(Math.round(t.luck * 100))}</output></h3>
        <p class="d">Bei Glück werden verlorene Drehungen mit dieser Wahrscheinlichkeit neu ausgelost, bei Pech gewonnene.</p>
        <input class="gpa-range" id="gpaLuck" type="range" min="-100" max="100" step="5" value="${Math.round(t.luck * 100)}">
        <div class="gpa-scale"><span>Pech</span><span>Standard</span><span>Glück</span></div>
      </section>
      ${feat ? `<section class="gpa-sec">
        <h3><label for="gpaFeat">${m.coin ? 'Hold-&-Win-Chance' : 'Freispiel-Chance'}</label><output id="gpaFeatOut">${featText(t.feature)}</output></h3>
        <p class="d">Wie oft ${m.coin ? 'Goldmünzen' : (m.scatterPl || 'Scatter')} auf den Walzen erscheinen.</p>
        <input class="gpa-range neutral" id="gpaFeat" type="range" min="0" max="${FEATURE_STOPS.length - 1}" step="1" value="${fIdx}">
        <div class="gpa-scale"><span>×0,25</span><span>×1</span><span>×5</span></div>
      </section>` : ''}
      ${m.gamble ? `<section class="gpa-sec">
        <h3><label for="gpaGam">Risikoleiter &amp; Kartenrisiko</label><output id="gpaGamOut">${gambleText(Math.round(t.gamble * 100))}</output></h3>
        <p class="d">Standard 50 % = faire Leiter: Chance je Stufe = aktueller ÷ nächster Wert. Höher macht das Hochdrücken leichter. Beim Kartenrisiko ist es direkt die Trefferchance.</p>
        <input class="gpa-range" id="gpaGam" type="range" min="0" max="100" step="5" value="${Math.round(t.gamble * 100)}">
        <div class="gpa-scale"><span>0 %</span><span>50 %</span><span>100 %</span></div>
      </section>` : ''}
      <section class="gpa-sec" aria-live="polite">
        <h3>Auswirkung <button class="gpa-btn ghost small" type="button" id="gpaCalc">Neu berechnen</button></h3>
        <div class="gpa-est" id="gpaEst">
          <span></span><span class="h">Standard</span><span class="h">Jetzt</span>
          <span class="k">Auszahlungsquote</span><span class="v" id="eR0">…</span><span class="v now" id="eR1">…</span>
          <span class="k">Treffer</span><span class="v" id="eH0">…</span><span class="v now" id="eH1">…</span>
          ${feat ? `<span class="k">Bonus</span><span class="v" id="eF0">…</span><span class="v now" id="eF1">…</span>` : ''}
        </div>
        <div class="gpa-prog"><i id="gpaProg"></i></div>
        <p class="gpa-note">Schätzung aus 50.000 Testdrehungen inklusive Freispielen und Hold &amp; Win. Bei Automaten mit hoher Volatilität schwankt sie um einige Prozent.</p>
      </section>
      <section class="gpa-sec">
        <h3>Testwerkzeuge</h3>
        <div class="gpa-tools">
          ${feat ? `<button class="gpa-btn ghost small" type="button" id="gpaForce">Nächster Dreh löst Bonus aus</button>` : ''}
          <button class="gpa-btn ghost small" type="button" id="gpaReset">${m.name.split(' – ')[0]} zurücksetzen</button>
        </div>
        <div class="gpa-tools" style="margin-top:10px">
          <label for="gpaBal" style="font-size:13px;color:var(--muted)">Guthaben</label>
          <input id="gpaBal" type="number" min="0" step="100" value="${Math.round(S.balance)}">
          <button class="gpa-btn ghost small" type="button" id="gpaBalSet">Setzen</button>
        </div>
      </section>`;

    const luck = body.querySelector('#gpaLuck');
    luck.oninput = () => { const v = +luck.value; body.querySelector('#gpaLuckOut').textContent = luckText(v); Tune.set(tab, { luck: v / 100 }); afterChange(); };
    const fe = body.querySelector('#gpaFeat');
    if (fe) fe.oninput = () => { const f = FEATURE_STOPS[+fe.value]; body.querySelector('#gpaFeatOut').textContent = featText(f); Tune.set(tab, { feature: f }); afterChange(); };
    const ga = body.querySelector('#gpaGam');
    if (ga) ga.oninput = () => { const p = +ga.value; body.querySelector('#gpaGamOut').textContent = gambleText(p); Tune.set(tab, { gamble: p / 100 }); renderTabs(); };
    body.querySelector('#gpaCalc').onclick = () => runEstimate(true);
    const force = body.querySelector('#gpaForce');
    if (force) force.onclick = () => { Tune.forceFeature(tab); toast(`${m.name.split(' – ')[0]}: Der nächste Dreh löst den Bonus aus`); };
    body.querySelector('#gpaReset').onclick = () => { Tune.reset(tab); renderTabs(); renderBody(); };
    body.querySelector('#gpaBalSet').onclick = () => {
      const v = Math.max(0, Math.round(+body.querySelector('#gpaBal').value || 0));
      S.balance = v; save(); renderTop(); toast(`Guthaben auf ${fmt(v)} gesetzt`);
    };
    runEstimate(false);
  }

  let deb;
  function afterChange() {
    renderTabs();
    runToken++;   // laufende Berechnung verwerfen
    ['eR1', 'eH1', 'eF1'].forEach(id => { const el = panel.querySelector('#' + id); if (el) el.textContent = '…'; });
    const prog = panel.querySelector('#gpaProg'); if (prog) prog.style.width = '0%';
    clearTimeout(deb); deb = setTimeout(() => runEstimate(false), 450);
  }

  async function runEstimate() {
    if (!panel) return;
    const my = ++runToken, m = MACHINES[tab], t = Tune.get(tab);
    const prog = panel.querySelector('#gpaProg');
    const set = (id, v) => { const el = panel && panel.querySelector('#' + id); if (el) el.textContent = v; };
    const show = (sfx, e) => { set('eR' + sfx, '≈ ' + Tune.pct(e.rtp)); set('eH' + sfx, oneIn(e.hit)); set('eF' + sfx, every(e.feat)); };
    const step = (base, share) => p => { if (my === runToken && prog) prog.style.width = ((base + p * share) * 100).toFixed(0) + '%'; };
    if (prog) prog.style.width = '0%';
    const std = await Tune.estimateCached(m, Tune.DEF, step(0, Tune.isModified(tab) ? .5 : 1));
    if (my !== runToken) return;
    show(0, std);
    if (t.luck === 0 && t.feature === 1) { show(1, std); if (prog) prog.style.width = '100%'; document.dispatchEvent(new CustomEvent('gp:tuning')); return; }
    ['eR1', 'eH1', 'eF1'].forEach(id => set(id, '…'));
    const now = await Tune.estimateCached(m, t, step(.5, .5));
    if (my !== runToken) return;
    show(1, now);
    if (prog) prog.style.width = '100%';
    document.dispatchEvent(new CustomEvent('gp:tuning'));
  }
})();
