/* ================= Bestenliste =================
   Einträge entstehen bei Gewinnen (nach der Risikoleiter mit dem Endbetrag), nach Freispielrunden
   und nach Hold & Win. Ohne Online-Speicher gilt die Liste für alle Spieler dieses Geräts. */
const GPScores = (() => {
  const KEY = 'glueckspalast-scores-v1';
  let list = [];
  try { list = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = n => Math.round(n || 0).toLocaleString('de-DE');
  const xf = x => (Math.round(x * 10) / 10).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + '×';
  const df = t => new Date(t).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const me = () => window.GP_PROFILE;
  const online = () => typeof GPOnline !== 'undefined' && GPOnline.enabled;
  const sortBy = (arr, f) => [...arr].sort((a, b) => b[f] - a[f] || a.t - b.t);

  function prune() {
    const keep = new Set();
    for (const f of ['amount', 'x']) {
      sortBy(list, f).slice(0, 80).forEach(e => keep.add(e));
      Object.keys(MACHINES).forEach(id => sortBy(list.filter(e => e.m === id), f).slice(0, 20).forEach(e => keep.add(e)));
    }
    list = list.filter(e => keep.has(e));
  }
  const rank = (e, f, m) => sortBy(list.filter(x => !m || x.m === m), f).indexOf(e) + 1;

  function add({ m, amount, bet, type }) {
    amount = Math.round(amount || 0);
    if (amount <= 0 || !bet || !me() || !MACHINES[m]) return;
    const e = { name: me().name, pid: me().id, m, amount, bet, x: Math.round(amount / bet * 100) / 100, type: type || 'Gewinn', t: Date.now() };
    list.push(e); prune(); persist();
    if (list.includes(e) && list.length >= 2) {
      const r1 = rank(e, 'amount', ''), r2 = rank(e, 'amount', m), r3 = rank(e, 'x', '');
      const msg = r1 && r1 <= 3 ? `Platz ${r1} der Bestenliste!` : r2 && r2 <= 3 ? `Platz ${r2} bei ${MACHINES[m].name}!` : r3 && r3 <= 3 ? `Platz ${r3} beim Multiplikator!` : '';
      if (msg) { setTimeout(() => { toast(`🏆 ${msg}`); Sfx.tierUp(); }, 900); }
    }
    renderLobbyPanel();
    if (online() && (e.x >= 3 || e.type !== 'Gewinn')) GPProfiles.submitScore(e).then(() => { cache = {}; renderLobbyPanel(); });
  }

  /* ---------- Daten holen ---------- */
  let cache = {};
  async function rows(src, cat, machine, limit = 10) {
    if (cat === 'balance') {
      if (src === 'online') return (await GPOnline.topBalances(limit)).map(r => ({ name: r.name, balance: r.balance }));
      return GPProfiles.list().sort((a, b) => b.balance - a.balance).slice(0, limit).map(p => ({ name: p.name, balance: p.balance, pid: p.id }));
    }
    const f = cat === 'x' ? 'x' : 'amount';
    if (src === 'online') {
      const k = `${f}|${machine}|${limit}`;
      if (!cache[k] || Date.now() - cache[k].t > 30000) {
        const data = await GPOnline.scores({ order: f, machine, limit });
        cache[k] = { t: Date.now(), data: data.map(r => ({ name: r.name, m: r.machine, amount: +r.amount, bet: +r.bet, x: +r.x, type: r.type, t: Date.parse(r.created_at) })) };
      }
      return cache[k].data;
    }
    return sortBy(list.filter(e => !machine || e.m === machine), f).slice(0, limit);
  }
  const isMe = r => me() && (r.pid ? r.pid === me().id : r.name && r.name.toLowerCase() === me().name.toLowerCase());
  const medal = i => `<span class="sb-rank r${i < 3 ? i + 1 : 0}">${i + 1}</span>`;
  const mIcon = id => MACHINES[id] ? `<span class="mini" title="${esc(MACHINES[id].name)}">${(MACHINES[id].sym[{ alge: 'king', frucht: 'cherry', sterne: 'star', drache: 'dragon', buch: 'book' }[id]] || {}).svg || ''}</span>` : '';

  function tableHTML(cat, data) {
    if (!data.length) return `<p class="sb-empty">${cat === 'balance' ? 'Noch keine Spieler.' : 'Noch keine Einträge. Der erste Gewinn landet hier.'}</p>`;
    if (cat === 'balance') return `<table class="ptable sb-table"><thead><tr><th>#</th><th>Spieler</th><th class="n">Guthaben</th></tr></thead><tbody>${
      data.map((r, i) => `<tr class="${isMe(r) ? 'me' : ''}"><td>${medal(i)}</td><td class="sb-name">${esc(r.name)}</td><td class="n num">${nf(r.balance)}</td></tr>`).join('')}</tbody></table>`;
    return `<table class="ptable sb-table"><thead><tr><th>#</th><th>Spieler</th><th>Automat</th><th class="n">Gewinn</th><th class="n">× Einsatz</th><th class="sb-hide">Art</th><th class="n sb-hide">Datum</th></tr></thead><tbody>${
      data.map((r, i) => `<tr class="${isMe(r) ? 'me' : ''}"><td>${medal(i)}</td><td class="sb-name">${esc(r.name)}</td><td>${mIcon(r.m)}</td><td class="n num">${nf(r.amount)}</td><td class="n num">${xf(r.x)}</td><td class="sb-hide">${esc(r.type)}</td><td class="n sb-hide num">${df(r.t)}</td></tr>`).join('')}</tbody></table>`;
  }

  /* ---------- Bestenliste als Fenster ---------- */
  function open() {
    const st = { src: online() ? 'online' : 'local', cat: 'amount', machine: '' };
    const seg = (name, opts) => `<div class="sb-seg" role="tablist" data-seg="${name}">${opts.map(([v, l]) => `<button type="button" role="tab" data-v="${v}">${l}</button>`).join('')}</div>`;
    modal('Bestenliste', `
      <div class="sb-tools">
        ${online() ? seg('src', [['online', 'Online'], ['local', 'Dieses Gerät']]) : ''}
        ${seg('cat', [['amount', 'Größte Gewinne'], ['x', 'Höchster Multiplikator'], ['balance', 'Reichste Spieler']])}
        ${seg('machine', [['', 'Alle'], ...Object.values(MACHINES).map(m => [m.id, m.name.split(' – ')[0]])])}
      </div>
      <div id="sbTable" aria-live="polite"></div>
      <p class="rules" style="margin-top:12px">${online() ? 'Online: Einträge aller Spieler (Gewinne ab 3× Einsatz, Freispielrunden, Hold & Win). ' : 'Die Liste gilt für alle Spieler auf diesem Gerät. '}Nach der Risikoleiter zählt der Endbetrag. Spielgeld ohne Geldwert.</p>`);
    const box = document.querySelector('.modal .body');
    const render = async () => {
      box.querySelectorAll('.sb-seg').forEach(s => s.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(st[s.dataset.seg] === b.dataset.v))));
      const ms = box.querySelector('[data-seg="machine"]'); if (ms) ms.hidden = st.cat === 'balance';
      const t = box.querySelector('#sbTable');
      t.innerHTML = '<p class="sb-empty">Lädt …</p>';
      try { t.innerHTML = tableHTML(st.cat, await rows(st.src, st.cat, st.machine, 20)); }
      catch (e) { t.innerHTML = `<p class="sb-empty">${esc(e.message)}</p>`; }
    };
    box.querySelectorAll('.sb-seg').forEach(s => s.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      st[s.dataset.seg] = b.dataset.v; render();
    }));
    render();
  }

  /* ---------- Kurzfassung in der Lobby ---------- */
  async function renderLobbyPanel() {
    const el = document.getElementById('sbLobby'); if (!el) return;
    const src = online() ? 'online' : 'local';
    let data = [];
    try { data = await rows(src, 'amount', '', 5); } catch (e) { data = await rows('local', 'amount', '', 5); }
    const mine = me() ? sortBy(list.filter(e => e.pid === me().id), 'amount')[0] : null;
    el.innerHTML = (data.length ? `<ol class="sb-mini">${data.map((r, i) => `
        <li class="${isMe(r) ? 'me' : ''}">${medal(i)}<span class="sb-name">${esc(r.name)}</span>${mIcon(r.m)}<b class="num">${nf(r.amount)}</b><small class="num">${xf(r.x)}</small></li>`).join('')}</ol>`
      : '<p class="sb-empty">Noch keine Einträge. Dein erster Gewinn landet hier.</p>')
      + (mine ? `<p class="sb-mine">Dein Rekord: <b class="num">${nf(mine.amount)}</b> Chips (${xf(mine.x)}) bei ${esc(MACHINES[mine.m].name)}</p>` : '');
  }

  document.getElementById('scoreBtn')?.addEventListener('click', open);
  document.getElementById('sbMore')?.addEventListener('click', open);
  const _renderLobby = renderLobby;
  renderLobby = function () { _renderLobby(); renderLobbyPanel(); };
  renderLobbyPanel();

  return { add, open, list: () => list.slice() };
})();
window.GPScores = GPScores;
