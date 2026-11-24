/* ================= Einstellungen =================
   Diese Datei kannst du gefahrlos anpassen. */
window.GP_CONFIG = {
  // Passwort für das geheime Admin-Panel, als SHA-256-Hash gespeichert (nie im Klartext).
  adminPasswordSha256: '0640373cd47982c58f19421a101503454a0264746d0776c67c3b4bf9024051db',

  // Geheime Wege zum Admin-Panel:
  secretLogoClicks: 5,
  secretWord: 'tresor',

  // Nach so vielen falschen Passwörtern wird das Panel kurz gesperrt
  maxPasswordTries: 5,
  lockSeconds: 30,

  // Online-Speicher (Supabase)
  online: {
    supabaseUrl: 'https://kstmccmfxhkooqkawhnf.supabase.co',
    supabaseAnonKey: 'eyJhbGci••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  }
};
