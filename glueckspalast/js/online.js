/* ================= Online-Speicher (optional, Supabase) =================
   Ist in js/config.js unter "online" nichts eingetragen, bleibt alles im Browser.
   Die Datenbank wird mit supabase/setup.sql eingerichtet. */
const GPOnline = (() => {
  const cfg = (window.GP_CONFIG && window.GP_CONFIG.online) || {};
  const url = String(cfg.supabaseUrl || '').trim().replace(/\/+$/, '');
  const key = String(cfg.supabaseAnonKey || '').trim();
  const enabled = !!(url && key);
  const headers = () => ({ apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' });

  async function call(path, opt = {}) {
    let r;
    try {
      r = await fetch(url + path, Object.assign({ headers: headers() }, opt));
    } catch (e) {
      throw new Error('Keine Verbindung zum Online-Speicher.');
    }
    const txt = await r.text();
    let data = null;
    try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
    if (!r.ok) throw new Error((data && (data.message || data.hint)) || `Online-Speicher antwortet mit Fehler ${r.status}.`);
    return data;
  }
  // Ruft eine der Funktionen aus setup.sql auf. Fehler der Funktion kommen als {error: "..."} zurück.
  async function rpc(fn, args, keepalive) {
    const data = await call(`/rest/v1/rpc/${fn}`, { method: 'POST', body: JSON.stringify(args), keepalive: !!keepalive });
    if (data && data.error) throw new Error(data.error);
    return data;
  }
  function scores({ order = 'amount', machine = '', limit = 10 } = {}) {
    const q = new URLSearchParams({ select: 'name,machine,amount,bet,x,type,created_at', order: `${order}.desc`, limit: String(limit) });
    if (machine) q.set('machine', `eq.${machine}`);
    return call(`/rest/v1/gp_scores?${q}`, { method: 'GET' });
  }
  function topBalances(limit = 10) { return rpc('gp_top_balances', { p_limit: limit }); }

  return { enabled, rpc, scores, topBalances };
})();
window.GPOnline = GPOnline;
