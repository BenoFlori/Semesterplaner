/* Macht aus den Terminen eine Kalender-Datei (.ics) für Apple Kalender, Google Kalender und Outlook.
   Läuft auf zwei Arten:
   1. Im Browser (index.html): window.makeICS(liste, optionen) baut die Datei zum Herunterladen.
   2. Auf GitHub (Action "Kalender-Datei bauen"): node kalender-ics.js liest termine.js und schreibt termine.ics.
      Diese Datei kann man in Apple Kalender abonnieren, dann kommen neue Termine von selbst. */
(function (root) {
  const KIND = { tutorium: "Tutorium", pruefung: "Klausur", sonstiges: "Sonstiges", vorlesung: "Vorlesung" };

  /* Zeitzone Deutschland, damit Termine auch nach der Zeitumstellung stimmen */
  const VTIMEZONE = [
    "BEGIN:VTIMEZONE", "TZID:Europe/Berlin", "X-LIC-LOCATION:Europe/Berlin",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE"
  ];

  const text = (s) => String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const local = (date, time) => date.replace(/-/g, "") + "T" + time.replace(":", "") + "00";
  const kindOf = (e) => (KIND[e.kind] ? e.kind : "vorlesung");
  const titleOf = (e) => (kindOf(e) === "tutorium" ? "Tutorium: " + e.title : e.title);
  const hash = (s) => { let a = 5381, b = 52711; for (const c of s) { const n = c.codePointAt(0); a = (a * 33 ^ n) >>> 0; b = (b * 31 + n) >>> 0; } return a.toString(36) + b.toString(36); };
  /* Gleicher Termin = gleiche ID. So erkennt der Kalender beim Aktualisieren, was neu ist und was weg ist. */
  const uid = (e) => hash([kindOf(e), e.title, e.date, e.start].join("|")) + "@semesterplan";

  /* Zeilen länger als 75 Byte müssen umgebrochen werden (Regel des Kalender-Formats) */
  function fold(line) {
    const out = []; let cur = "", bytes = 0;
    for (const ch of line) {
      const n = ch.codePointAt(0), b = n < 0x80 ? 1 : n < 0x800 ? 2 : n < 0x10000 ? 3 : 4;
      if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ""; bytes = 0; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join("\r\n ");
  }

  function stamp(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z"); }

  /* liste: Termine wie in termine.js. opt.notes: Funktion, die zu einem Termin die eigene Notiz liefert (oder "").
     opt.name: Name des Kalenders. opt.url: Adresse der Website (kommt in jeden Termin). */
  function makeICS(liste, opt) {
    opt = opt || {};
    const now = stamp(opt.now || new Date());
    const L = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Semesterplaner//DHBW Ravensburg WI//DE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "X-WR-CALNAME:" + text(opt.name || "Semesterplan WI"), "X-WR-TIMEZONE:Europe/Berlin",
      "REFRESH-INTERVAL;VALUE=DURATION:PT6H", "X-PUBLISHED-TTL:PT6H",
      ...VTIMEZONE
    ];
    for (const e of liste) {
      if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !/^\d{2}:\d{2}$/.test(e.start) || !/^\d{2}:\d{2}$/.test(e.end)) continue;
      const k = kindOf(e);
      const note = opt.notes ? opt.notes(e) : "";
      const desc = [
        e.prof ? (k === "tutorium" ? "Tutor/in: " : "Dozent/in: ") + e.prof : "",
        note ? "Meine Notiz: " + note : "",
        opt.url ? "Semesterplaner: " + opt.url : ""
      ].filter(Boolean).join("\n");
      L.push(
        "BEGIN:VEVENT",
        "UID:" + uid(e),
        "DTSTAMP:" + now,
        "DTSTART;TZID=Europe/Berlin:" + local(e.date, e.start),
        "DTEND;TZID=Europe/Berlin:" + local(e.date, e.end),
        "SUMMARY:" + text((k === "pruefung" && !/klausur|prüfung/i.test(e.title) ? "Klausur: " : "") + titleOf(e))
      );
      if (e.room) L.push("LOCATION:" + text(e.room));
      if (desc) L.push("DESCRIPTION:" + text(desc));
      L.push("CATEGORIES:" + text(KIND[k]));
      if (/^verschoben/i.test(e.title)) L.push("STATUS:CANCELLED");
      L.push("TRANSP:OPAQUE", "END:VEVENT");
    }
    L.push("END:VCALENDAR");
    return L.map(fold).join("\r\n") + "\r\n";
  }

  root.makeICS = makeICS;

  /* Aufruf auf GitHub: node kalender-ics.js [termine.js] [termine.ics] */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = makeICS;
    if (typeof require !== "undefined" && require.main === module) {
      const fs = require("fs"), vm = require("vm");
      const src = process.argv[2] || "termine.js", dst = process.argv[3] || "termine.ics";
      const box = { window: {} };
      vm.runInNewContext(fs.readFileSync(src, "utf8"), box);
      const list = box.window.TERMINE || [];
      if (!list.length) { console.error("Keine Termine in " + src); process.exit(1); }
      /* DTSTAMP fest auf den Stand von termine.js, damit sich die Datei nur ändert, wenn sich Termine ändern */
      const ics = makeICS(list, { now: fs.statSync(src).mtime, url: process.env.SITE_URL || "" });
      const old = fs.existsSync(dst) ? fs.readFileSync(dst, "utf8") : "";
      const strip = (s) => s.replace(/^DTSTAMP:.*$/gm, "");
      if (strip(old) === strip(ics)) { console.log("termine.ics ist schon aktuell"); }
      else { fs.writeFileSync(dst, ics); console.log(list.length + " Termine nach " + dst + " geschrieben"); }
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
