/* ================= Einstellungen =================
   Diese Datei kannst du gefahrlos anpassen. */
window.GP_CONFIG = {
  // Passwort für das geheime Admin-Panel, als SHA-256-Hash gespeichert (nie im Klartext).
  // Neues Passwort setzen:  node tools/set-password.js "MeinNeuesPasswort"
  adminPasswordSha256: '5093809930b74e7e63d6d32843a57a082f4caafc70ceb2b4d485a400654ef443',

  // Geheime Wege zum Admin-Panel:
  secretLogoClicks: 5,      // so oft schnell hintereinander auf das Logo oben links klicken
  secretWord: 'tresor',     // oder dieses Wort irgendwo auf der Seite tippen (leer lassen = aus)

  // Nach so vielen falschen Passwörtern wird das Panel kurz gesperrt
  maxPasswordTries: 5,
  lockSeconds: 30,

  // Optional: gemeinsamer Online-Speicher für Bestenliste und Login auf allen Geräten (Supabase).
  // Leer lassen = alles bleibt im Browser des jeweiligen Geräts. Einrichtung: siehe README.
  online: {
    supabaseUrl: 'https://kstmccmfxhkooqkawhnf.supabase.co',       // z. B. 'https://abcdefgh.supabase.co'
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdG1jY21meGhrb29xa2F3aG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MTU5OTYsImV4cCI6MjExMTA5MTk5Nn0.jeVPT9_5GxJeOKZ-K9q_QtAQSYu2SKHQsVpwmZS57eU'    // der "anon public"-Schlüssel (Project Settings → API)
  }
};
