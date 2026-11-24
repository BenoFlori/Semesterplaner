/* ================= Glückspalast: Einbau in eine beliebige Webseite =================
   Einbinden (am Ende von <body>):

     <script src="PFAD/ZUM/glueckspalast/embed.js" data-mode="secret" defer></script>

   data-mode     "button"  sichtbarer goldener Knopf (Standard)
                 "secret"  fast unsichtbarer Knopf in einer Ecke
                 "none"    kein Knopf; nur eigene Links mit data-glueckspalast öffnen das Kasino
   data-position "bottom-right" (Standard), "bottom-left", "top-right", "top-left"
   data-label    Text des sichtbaren Knopfs (Standard: "Spielhalle")
   data-word     geheimes Wort; wer es auf der Seite tippt, öffnet das Kasino (optional)

   Eigene Links/Knöpfe:   <a href="#" data-glueckspalast>Zum Kasino</a>
   Per Skript:            Glueckspalast.open()  /  Glueckspalast.close()
*/
(function () {
  if (window.Glueckspalast) return;
  var me = document.currentScript;
  if (!me) return;
  var base = new URL('.', me.src);
  var gameUrl = new URL('index.html?embed=1', base).href;
  var opt = {
    mode: me.getAttribute('data-mode') || 'button',
    pos: me.getAttribute('data-position') || 'bottom-right',
    label: me.getAttribute('data-label') || 'Spielhalle',
    word: (me.getAttribute('data-word') || '').toLowerCase()
  };
  var Z = 2147483000;
  var overlay = null, lastFocus = null, prevOverflow = '', typed = '';

  var css = '' +
    '.gpx-veil{position:fixed;inset:0;z-index:' + Z + ';background:rgba(6,2,4,.86);display:flex;align-items:center;justify-content:center;' +
    'padding:min(2vw,18px);opacity:0;transition:opacity .25s;backdrop-filter:blur(4px)}' +
    '.gpx-veil.on{opacity:1}' +
    '.gpx-frame{width:100%;height:100%;max-width:1320px;border:0;border-radius:18px;background:#0b0709;' +
    'box-shadow:0 0 0 2px #c98a20,0 30px 90px rgba(0,0,0,.7),0 0 60px rgba(242,182,61,.25);transform:scale(.97);transition:transform .3s}' +
    '.gpx-veil.on .gpx-frame{transform:none}' +
    '@media (max-width:640px){.gpx-veil{padding:0}.gpx-frame{border-radius:0;box-shadow:none}}' +
    '.gpx-launch{position:fixed;z-index:' + (Z - 1) + ';display:flex;align-items:center;gap:8px;border:0;cursor:pointer;' +
    'font:800 14px/1 system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#1b0700;' +
    'padding:12px 18px 12px 12px;border-radius:999px;background:radial-gradient(circle at 35% 25%,#fffbe0,#f2b63d 55%,#9e6312);' +
    'box-shadow:0 0 0 3px #7d4d0c,0 0 0 5px #fff1a8,0 12px 28px rgba(0,0,0,.5),0 0 30px rgba(242,182,61,.55);transition:transform .15s}' +
    '.gpx-launch:hover{transform:translateY(-2px) scale(1.03)}' +
    '.gpx-launch:focus-visible{outline:3px solid #fff1a8;outline-offset:4px}' +
    '.gpx-launch svg{width:26px;height:26px;flex:none}' +
    '.gpx-secret{position:fixed;z-index:' + (Z - 1) + ';width:22px;height:22px;padding:0;border:0;border-radius:50%;cursor:default;' +
    'background:currentColor;opacity:.04;color:inherit}' +
    '.gpx-secret:focus-visible{opacity:.6;outline:2px solid currentColor}' +
    '@media (prefers-reduced-motion:reduce){.gpx-veil,.gpx-frame,.gpx-launch{transition:none}}';

  function place(el, gap) {
    var p = opt.pos.split('-');
    el.style[p[0] === 'top' ? 'top' : 'bottom'] = 'calc(' + gap + 'px + env(safe-area-inset-' + (p[0] === 'top' ? 'top' : 'bottom') + ', 0px))';
    el.style[p[1] === 'left' ? 'left' : 'right'] = 'calc(' + gap + 'px + env(safe-area-inset-' + (p[1] === 'left' ? 'left' : 'right') + ', 0px))';
  }

  function open() {
    if (overlay) return;
    lastFocus = document.activeElement;
    overlay = document.createElement('div');
    overlay.className = 'gpx-veil';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Glückspalast Spielhalle');
    var frame = document.createElement('iframe');
    frame.className = 'gpx-frame';
    frame.src = gameUrl;
    frame.title = 'Glückspalast Spielhalle';
    frame.allow = 'fullscreen; autoplay';
    overlay.appendChild(frame);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { overlay.classList.add('on'); });
    frame.addEventListener('load', function () { try { frame.focus(); } catch (e) {} });
  }
  function close() {
    if (!overlay) return;
    var o = overlay; overlay = null;
    o.classList.remove('on');
    setTimeout(function () { o.remove(); }, 260);
    document.documentElement.style.overflow = prevOverflow;
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== base.origin && base.protocol !== 'file:') return;
    if (e.data && e.data.type === 'glueckspalast:close') close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay) { close(); return; }
    if (!opt.word || overlay || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (e.target && e.target.isContentEditable)) return;
    typed = (typed + e.key.toLowerCase()).slice(-opt.word.length);
    if (typed === opt.word) { typed = ''; open(); }
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-glueckspalast]');
    if (a) { e.preventDefault(); open(); }
  });

  function init() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    if (opt.mode === 'button') {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'gpx-launch';
      b.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 48 L4 18 L20 30 L32 10 L44 30 L60 18 L56 48Z" fill="#7d1020" stroke="#3a0408" stroke-width="3" stroke-linejoin="round"/><rect x="8" y="46" width="48" height="9" rx="3" fill="#7d1020" stroke="#3a0408" stroke-width="3"/></svg>';
      b.appendChild(document.createTextNode(opt.label));
      place(b, 18);
      b.addEventListener('click', open);
      document.body.appendChild(b);
    } else if (opt.mode === 'secret') {
      var s = document.createElement('button');
      s.type = 'button';
      s.className = 'gpx-secret';
      s.setAttribute('aria-label', opt.label);
      place(s, 6);
      s.addEventListener('click', open);
      document.body.appendChild(s);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.Glueckspalast = { open: open, close: close };
})();
