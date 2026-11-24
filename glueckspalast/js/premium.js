/* ================= Premium-Optik =================
   Erweitert main.js, ohne dessen Funktionen umzuschreiben: Die vorhandenen Funktionen
   werden "umhüllt" (erst das Original, dann die Zusatzeffekte). */
(() => {
  const isEmbed = new URLSearchParams(location.search).has('embed');
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  let curMachine = null;

  /* ---------- LED-Laufschrift ---------- */
  const cabIn = document.querySelector('.cab-in');
  const marquee = cabIn && cabIn.querySelector('.marquee');
  const led = document.createElement('div');
  led.className = 'ledbar';
  led.innerHTML = '<div class="ledtext" id="ledText" aria-live="polite"><span></span></div>';
  if (marquee) marquee.after(led);
  const ledText = led.querySelector('.ledtext'), ledSpan = ledText.querySelector('span');
  let idleTimer = null, idleIdx = 0, holdUntil = 0;

  function ledSet(text, mode = 'idle') {
    ledText.className = 'ledtext ' + mode;
    ledSpan.textContent = text;
    ledSpan.style.animation = 'none'; void ledSpan.offsetWidth; ledSpan.style.animation = '';
    requestAnimationFrame(() => {
      const over = ledSpan.scrollWidth > led.clientWidth - 16;
      ledText.classList.toggle('scroll', over && mode === 'idle');
      if (over) ledText.style.setProperty('--dur', Math.max(6, ledSpan.scrollWidth / 70) + 's');
    });
  }
  const xFmt = x => (Math.round(x * 10) / 10).toLocaleString('de-DE');
  function idleMessages(m) {
    const msgs = ['Viel Glück!'];
    if (UI.fs.left > 0 || UI.fs.active) return [`Freispiele · noch ${UI.fs.left} · ×${UI.fs.mult || 1}`];
    const top = Math.max(...Object.values(m.pays).flatMap(p => Object.values(p)));
    msgs.push(`${m.lines.length} Gewinnlinien`);
    msgs.push(`Topgewinn ${xFmt(top / m.lines.length)}× Einsatz`);
    if (m.scatter) msgs.push(`3 × ${(m.scatterPl || 'Scatter')} = Freispiele`);
    if (m.expanding) msgs.push('Spezialsymbol in den Freispielen');
    if (m.coin) msgs.push(`${m.coinTrigger} Münzen = Hold & Win`);
    if (m.gamble) msgs.push('Risikoleiter nach jedem Gewinn');
    return msgs;
  }
  function ledIdle() {
    clearInterval(idleTimer);
    if (!curMachine) return;
    const step = () => {
      if (Date.now() < holdUntil || document.body.classList.contains('gp-reeling')) return;
      const msgs = idleMessages(curMachine);
      ledSet(msgs[idleIdx++ % msgs.length], 'idle');
    };
    step();
    idleTimer = setInterval(step, 4200);
  }

  /* ---------- Freispiel-Multiplikator: Lampenreihe ×1 … ×10 ---------- */
  const multBar = document.createElement('div');
  multBar.className = 'multbar';
  multBar.hidden = true;
  multBar.setAttribute('aria-label', 'Freispiel-Multiplikator');
  led.after(multBar);
  let multMax = 0;
  function syncMult() {
    const m = curMachine;
    const on = !!(m && m.fsMultMax && (UI.fs.left > 0 || UI.fs.active));
    multBar.hidden = !on;
    if (!on) return;
    if (multMax !== m.fsMultMax) {
      multBar.innerHTML = Array.from({ length: m.fsMultMax }, (_, i) => `<span class="ml" data-v="${i + 1}">×${i + 1}</span>`).join('');
      multMax = m.fsMultMax;
    }
    const v = UI.fs.mult || 1;
    multBar.querySelectorAll('.ml').forEach(el => { const k = +el.dataset.v; el.classList.toggle('lit', k <= v); el.classList.toggle('cur', k === v); });
  }
  window.gpMultUp = v => {
    syncMult();
    const el = multBar.querySelector(`.ml[data-v="${v}"]`);
    if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); burstAt(el, 26); }
    holdUntil = Date.now() + 2600;
    ledSet(`Multiplikator ×${v}`, 'win');
  };

  /* ---------- Gewinnlinien-Markierungen ---------- */
  function buildMarkers(m) {
    win.querySelectorAll('.plm').forEach(e => e.remove());
    win.classList.add('has-markers');
    win.classList.toggle('many', m.lines.length > 10);
    for (const side of ['l', 'r']) {
      const byRow = {};
      m.lines.forEach((ln, i) => (byRow[side === 'l' ? ln[0] : ln[ln.length - 1]] ||= []).push(i));
      for (const [row, ids] of Object.entries(byRow)) {
        ids.forEach((i, k) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'plm ' + side;
          Object.assign(b.dataset, { line: i, row, k, n: ids.length });
          b.textContent = i + 1;
          b.style.setProperty('--lc', LINE_COLORS[i % LINE_COLORS.length]);
          b.setAttribute('aria-label', `Gewinnlinie ${i + 1} anzeigen`);
          win.appendChild(b);
        });
      }
    }
    requestAnimationFrame(() => placeMarkers(m));
  }
  function placeMarkers(m) {
    if (!m || UI.busy) return;
    const wr = win.getBoundingClientRect();
    win.querySelectorAll('.plm').forEach(b => {
      const row = +b.dataset.row, k = +b.dataset.k, n = +b.dataset.n;
      const cell = cellEl(b.classList.contains('l') ? 0 : m.cols - 1, row);
      if (!cell) return;
      const cr = cell.getBoundingClientRect();
      const step = cr.height * .9 / n;
      b.style.setProperty('--h', Math.min(18, step - 2) + 'px');
      b.style.top = (cr.top - wr.top + cr.height * .05 + step * (k + .5)) + 'px';
    });
  }
  function previewLine(m, i, on) {
    if (!svg) return;
    svg.querySelectorAll('.pv').forEach(e => e.remove());
    if (!on || UI.busy) return;
    const wr = win.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${wr.width} ${wr.height}`);
    const pts = m.lines[i].map((r, c) => {
      const b = cellEl(c, r).getBoundingClientRect();
      return `${(b.left - wr.left + b.width / 2).toFixed(1)},${(b.top - wr.top + b.height / 2).toFixed(1)}`;
    }).join(' ');
    svg.insertAdjacentHTML('beforeend', `<polyline class="pv" points="${pts}" stroke="${LINE_COLORS[i % LINE_COLORS.length]}"/>`);
  }
  win.addEventListener('pointerover', e => { const b = e.target.closest('.plm'); if (b && curMachine) previewLine(curMachine, +b.dataset.line, true); });
  win.addEventListener('pointerout', e => { if (e.target.closest('.plm') && curMachine) previewLine(curMachine, 0, false); });
  win.addEventListener('focusin', e => { const b = e.target.closest('.plm'); if (b && curMachine) previewLine(curMachine, +b.dataset.line, true); });
  win.addEventListener('focusout', e => { if (e.target.closest('.plm') && curMachine) previewLine(curMachine, 0, false); });
  let resizeT;
  addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => placeMarkers(curMachine), 120); });

  /* ---------- Lichtblitz, wenn eine Walze stoppt ---------- */
  const stripObserver = new MutationObserver(list => {
    if (!document.body.classList.contains('gp-reeling')) return;
    for (const rec of list) {
      const strip = rec.target;
      if (curMachine && strip.children.length === curMachine.rows) {
        const reel = strip.parentElement;
        reel.classList.remove('glint'); void reel.offsetWidth; reel.classList.add('glint');
      }
    }
  });
  function observeStrips() {
    stripObserver.disconnect();
    win.querySelectorAll('.strip').forEach(s => stripObserver.observe(s, { childList: true }));
  }

  /* ---------- Hinweis bei angepassten Quoten ---------- */
  function updateTuneChip() {
    let chip = document.getElementById('tuneChip');
    if (!chip) {
      chip = document.createElement('span');
      chip.id = 'tuneChip';
      chip.className = 'tune-chip';
      chip.textContent = 'Testmodus · Quoten angepasst';
      chip.title = 'Die Gewinnchancen dieses Automaten wurden im Admin-Panel verändert (nur in diesem Browser).';
      document.getElementById('mTitle').after(chip);
    }
    chip.hidden = !(UI.cur && Tune.isModified(UI.cur));
    document.querySelectorAll('.mcard [data-open]').forEach(btn => {
      const card = btn.closest('.mcard');
      let dot = card.querySelector('.tune-dot');
      const mod = Tune.isModified(btn.dataset.open);
      if (mod && !dot) { dot = document.createElement('span'); dot.className = 'tune-chip tune-dot'; dot.textContent = 'Quoten angepasst'; card.appendChild(dot); }
      if (!mod && dot) dot.remove();
    });
  }
  document.addEventListener('gp:tuning', updateTuneChip);

  /* ---------- Karten: 3D-Kippeffekt ---------- */
  let tiltCard = null;
  const resetTilt = c => { c.classList.remove('tilt'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); };
  if (fine && !reduced) {
    document.addEventListener('pointermove', e => {
      const card = e.target.closest && e.target.closest('.mcard');
      if (card !== tiltCard) { if (tiltCard) resetTilt(tiltCard); tiltCard = card; }
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - .5) * 9).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((.5 - py) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      card.classList.add('tilt');
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (tiltCard) resetTilt(tiltCard); tiltCard = null; });
  }

  /* ---------- Mini-Glücksrad im Bonus-Panel ---------- */
  let wheelLevel = 0;
  function updateWheelMini() {
    const panel = document.querySelector('.panel.bonus');
    if (!panel || typeof wheelSVG !== 'function') return;
    let wm = panel.querySelector('.wheel-mini');
    if (!wm) {
      wm = document.createElement('button');
      wm.type = 'button';
      wm.className = 'wheel-mini';
      wm.setAttribute('aria-label', 'Glücksrad öffnen');
      wm.addEventListener('click', () => { const b = document.getElementById('bonusBtn'); if (b && !b.disabled) b.click(); });
      panel.prepend(wm);
    }
    if (!wheelLevel) { wm.innerHTML = wheelSVG(); wheelLevel = 1; }
    const ready = !document.getElementById('bonusBtn').disabled;
    wm.classList.toggle('ready', ready);
    wm.tabIndex = ready ? 0 : -1;
  }

  /* ---------- Bestehende Funktionen umhüllen ---------- */
  const _buildWindow = buildWindow;
  buildWindow = function (m) { _buildWindow(m); buildMarkers(m); observeStrips(); };

  const _showWins = showWins;
  showWins = function (m, res, mult) {
    _showWins(m, res, mult);
    res.wins.forEach(w => win.querySelectorAll(`.plm[data-line="${w.line}"]`).forEach(b => b.classList.add('on')));
  };

  const _clearWins = clearWins;
  clearWins = function () { _clearWins(); win.querySelectorAll('.plm.on').forEach(b => b.classList.remove('on')); };

  const _animateGrid = animateGrid;
  animateGrid = async function (m, grid) {
    document.body.classList.add('gp-reeling');
    holdUntil = 0;
    ledSet(UI.fs.left > 0 || UI.fs.active ? `Freispiel · ×${UI.fs.mult || 1}` : '★ Viel Glück ★', 'spin');
    try { return await _animateGrid(m, grid); }
    finally {
      document.body.classList.remove('gp-reeling');
      setTimeout(() => { if (Date.now() >= holdUntil) ledIdle(); }, 1600);
    }
  };

  const _rollWin = rollWin;
  rollWin = function (to) {
    _rollWin(to);
    if (to > 0) { holdUntil = Date.now() + 3800; ledSet(`Gewinn ${fmt(to)}`, 'win'); }
  };

  const _updateControls = updateControls;
  updateControls = function () { _updateControls(); syncMult(); };

  const _openMachine = openMachine;
  openMachine = function (id) {
    multMax = 0;
    _openMachine(id);
    curMachine = MACHINES[id] || null;
    syncMult();
    updateTuneChip();
    idleIdx = 0;
    ledIdle();
  };

  const _showLobby = showLobby;
  showLobby = function () { curMachine = null; clearInterval(idleTimer); _showLobby(); };

  const _renderLobby = renderLobby;
  renderLobby = function () { _renderLobby(); updateWheelMini(); updateTuneChip(); };

  /* ---------- Einbettung in eine andere Webseite ---------- */
  if (isEmbed) {
    document.documentElement.classList.add('gp-embedded');
    const close = () => { try { parent.postMessage({ type: 'glueckspalast:close' }, '*'); } catch (e) {} };
    const btn = document.createElement('button');
    btn.className = 'tbtn gp-embed-close';
    btn.type = 'button';
    btn.textContent = '✕ Schließen';
    btn.addEventListener('click', close);
    document.querySelector('.topbar-in').appendChild(btn);
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const ov = document.getElementById('overlay');
      if ((ov && !ov.hidden) || document.querySelector('.gpa-panel, .gpa-veil')) return;
      close();
    });
  }

  // Erstes Zeichnen (main.js hat route() schon aufgerufen)
  if (UI.cur) { curMachine = MACHINES[UI.cur]; buildMarkers(curMachine); observeStrips(); ledIdle(); }
  updateWheelMini();
  updateTuneChip();
})();
