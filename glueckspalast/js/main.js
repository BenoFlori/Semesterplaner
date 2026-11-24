/* Oberfläche, Animationen, Sound, Speicherstand */
/* ================= 3D-Kasino-Symbol-Grafiken ================= */
function starPath(cx, cy, R, r, n=5){
  let d = '';
  for(let i=0;i<n*2;i++){ const a = -Math.PI/2 + i*Math.PI/n, rr = i%2 ? r : R; d += (i?'L':'M') + (cx+Math.cos(a)*rr).toFixed(1) + ' ' + (cy+Math.sin(a)*rr).toFixed(1); }
  return d + 'Z';
}
const hl = (cx,cy,rx,ry,rot=-30,o=.65) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${cx} ${cy})"/>`;
const spk = (x,y,R=7,o=1) => `<path d="${starPath(x,y,R,R*.2,4)}" fill="#fff" opacity="${o}"/>`;
const drop = (x,y,r=2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".75"/><circle cx="${x+.5}" cy="${y+.8}" r="${r*.65}" fill="#000" opacity=".2"/>`;
const FONT_R = `font-family="Cinzel, Georgia, serif" font-weight="900"`;

/* Edle Spielhallen-Kartenbuchstaben: 3D-Schlagschatten, Goldprägung, Glanzverlauf */
const novCard = (L, gradId, rimCol, fs=66) => `
  <rect x="11" y="11" width="78" height="78" rx="16" fill="url(#${gradId})" stroke="url(#gGold)" stroke-width="4.5"/>
  <rect x="16" y="16" width="68" height="68" rx="11" fill="none" stroke="#fff6cf" stroke-opacity=".35" stroke-width="1.2"/>
  <text x="52" y="${fs === 66 ? 73 : 71}" text-anchor="middle" ${FONT_R} font-size="${fs}" fill="#090305" opacity=".7">${L}</text>
  <text x="50" y="${fs === 66 ? 70 : 68}" text-anchor="middle" ${FONT_R} font-size="${fs}" fill="url(#gGold)" stroke="${rimCol}" stroke-width="4" paint-order="stroke">${L}</text>
  <path d="M16 24 Q50 38 84 24 V18 Q84 14 78 14 H22 Q16 14 16 18Z" fill="#fff" opacity=".2"/>
  ${spk(79,20,6,.9)}`;

const cardJade = (L, col) => `<circle cx="50" cy="50" r="42" fill="url(#gJade)" stroke="url(#gGold)" stroke-width="5"/>
  <circle cx="50" cy="50" r="34" fill="none" stroke="#f7c948" stroke-opacity=".4" stroke-width="1.5" stroke-dasharray="3 4"/>
  <text x="52" y="71" text-anchor="middle" ${FONT_R} font-size="54" fill="#020d09" opacity=".75">${L}</text>
  <text x="50" y="69" text-anchor="middle" ${FONT_R} font-size="54" fill="${col}" stroke="#04150f" stroke-width="3.5" paint-order="stroke">${L}</text>${hl(34,28,10,4,-30,.28)}`;

const rune = (col, d) => `<circle cx="50" cy="50" r="41" fill="url(#gStone)" stroke="url(#gGold)" stroke-width="4.5"/>
  <circle cx="50" cy="50" r="34" fill="${col}" opacity=".18" stroke="${col}" stroke-width="2"/>
  <path d="${d}" fill="none" stroke="${col}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" opacity=".28"/>
  <path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>${hl(36,29,10,4,-30,.32)}`;

const dragonBody = 'M24 82 C12 62 42 60 46 50 C50 40 32 36 40 26 C46 18 58 18 64 24';

const ART = {
  /* === ALGE – KÖNIG DER MEERE SYMBOLE === */
  t10: novCard('10', 'gCardEmerald', '#042914', 56),
  tj:  novCard('J',  'gCardSapph',   '#061c47', 66),
  tq:  novCard('Q',  'gCardRuby',    '#470515', 64),
  tk:  novCard('K',  'gCardRoyal',   '#280647', 66),
  ta:  novCard('A',  'gCardCrimson', '#470508', 66),

  anchor: `
    <circle cx="50" cy="52" r="43" fill="url(#gSeaMedallion)" stroke="url(#gGold)" stroke-width="4"/>
    <circle cx="50" cy="22" r="9" fill="none" stroke="url(#gGold)" stroke-width="5"/>
    <rect x="46" y="29" width="8" height="52" rx="3" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2"/>
    <rect x="30" y="37" width="40" height="7" rx="3.5" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2"/>
    <path d="M22 60 C22 80 42 84 50 84 C58 84 78 80 78 60" fill="none" stroke="url(#gGold)" stroke-width="7" stroke-linecap="round"/>
    <path d="M17 63 L23 53 L29 63 Z M71 63 L77 53 L83 63 Z" fill="url(#gGold)" stroke="#5c3605" stroke-width="1"/>
    ${hl(38,24,7,3,-25,.6)}${spk(76,22,8)}`,

  shell: `
    <circle cx="50" cy="52" r="43" fill="url(#gSeaMedallion)" stroke="url(#gGold)" stroke-width="4"/>
    <path d="M16 58 C16 28 32 18 50 18 C68 18 84 28 84 58 C72 68 28 68 16 58Z" fill="url(#gShellTop)" stroke="#6e2c4b" stroke-width="1.5"/>
    <path d="M50 18 V62 M35 21 L42 62 M65 21 L58 62 M23 32 L34 60 M77 32 L66 60" stroke="#9e4770" stroke-width="1.5" opacity=".55"/>
    <path d="M18 58 C28 76 72 76 82 58 C72 84 28 84 18 58Z" fill="url(#gShellBot)" stroke="#6e2c4b" stroke-width="1.5"/>
    <circle cx="50" cy="56" r="14" fill="url(#gPearl)" stroke="#fff" stroke-width="1.2"/>
    ${hl(45,51,5,3,-30,.85)}${spk(74,24,8)}`,

  chest: `
    <circle cx="50" cy="52" r="43" fill="url(#gSeaMedallion)" stroke="url(#gGold)" stroke-width="4"/>
    <path d="M18 42 C18 24 82 24 82 42 Z" fill="url(#gWood)" stroke="#3d1e06" stroke-width="2"/>
    <rect x="18" y="42" width="64" height="38" rx="5" fill="url(#gWood)" stroke="#3d1e06" stroke-width="2"/>
    <ellipse cx="50" cy="43" rx="28" ry="8" fill="url(#gGold)"/>
    <circle cx="34" cy="41" r="4" fill="#fff6cf"/><circle cx="50" cy="39" r="4.5" fill="#fff6cf"/><circle cx="66" cy="41" r="4" fill="#fff6cf"/>
    <rect x="24" y="27" width="6" height="53" fill="url(#gGold)"/><rect x="70" y="27" width="6" height="53" fill="url(#gGold)"/>
    <rect x="43" y="38" width="14" height="16" rx="3" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.5"/>
    <circle cx="50" cy="45" r="2.5" fill="#2b1402"/>
    ${spk(22,22,7)}${spk(80,24,8)}`,

  trident: `
    <circle cx="50" cy="50" r="44" fill="url(#gRoyalRed)" stroke="url(#gGold)" stroke-width="4.5"/>
    <rect x="46.5" y="24" width="7" height="66" rx="3" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2"/>
    <path d="M26 32 C26 48 36 52 50 52 C64 52 74 48 74 32" fill="none" stroke="url(#gGold)" stroke-width="6.5" stroke-linecap="round"/>
    <path d="M50 8 L43 26 H57 Z" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2"/>
    <path d="M26 14 L20 32 H32 Z" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2"/>
    <path d="M74 14 L68 32 H80 Z" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2"/>
    <circle cx="50" cy="52" r="6" fill="url(#gSapph)" stroke="#fff" stroke-width="1.2"/>
    ${spk(78,16,9)}${spk(22,22,6)}`,

  king: `
    <circle cx="50" cy="50" r="45" fill="url(#gRoyalRed)" stroke="url(#gGold)" stroke-width="5"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#fff1a8" stroke-opacity=".4" stroke-width="1.5"/>
    <!-- Krone -->
    <path d="M26 30 L22 12 L36 22 L50 8 L64 22 L78 12 L74 30 Z" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="50" cy="22" r="3.5" fill="#e6223c"/><circle cx="35" cy="24" r="2.5" fill="#18d968"/><circle cx="65" cy="24" r="2.5" fill="#18d968"/>
    <!-- Gesicht & Bart -->
    <ellipse cx="50" cy="48" rx="20" ry="22" fill="url(#gSkin)"/>
    <path d="M28 48 C26 72 38 86 50 88 C62 86 74 72 72 48 C66 56 58 58 50 56 C42 58 34 56 28 48Z" fill="url(#gBeard)" stroke="#5e6679" stroke-width="1.2"/>
    <path d="M36 56 Q50 50 64 56 Q56 64 50 60 Q44 64 36 56Z" fill="#fff"/>
    <!-- Augen & Brauen -->
    <path d="M35 40 Q41 37 46 40 M54 40 Q59 37 65 40" stroke="#3b2614" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="41" cy="44" r="2.6" fill="#1a1008"/><circle cx="59" cy="44" r="2.6" fill="#1a1008"/>
    <circle cx="40.2" cy="43.2" r="1" fill="#fff"/><circle cx="58.2" cy="43.2" r="1" fill="#fff"/>
    ${spk(82,16,9)}${spk(18,22,7)}`,

  algecan: `
    <circle cx="50" cy="50" r="47" fill="url(#gAlgeGlow)"/>
    <!-- Goldene Krone über der Dose -->
    <path d="M34 15 L31 5 L41 11 L50 3 L59 11 L69 5 L66 15 Z" fill="url(#gGold)" stroke="#5c3605" stroke-width="1.2" stroke-linejoin="round"/>
    <!-- Dosenkörper -->
    <ellipse cx="50" cy="20" rx="22" ry="5.5" fill="url(#gSilver)" stroke="#4a5568" stroke-width="1.5"/>
    <path d="M28 20 V82 C28 87 72 87 72 82 V20 C72 25 28 25 28 20 Z" fill="url(#gAlgeCan)" stroke="#05381b" stroke-width="1.8"/>
    <ellipse cx="50" cy="82" rx="22" ry="5.5" fill="url(#gSilver)" stroke="#4a5568" stroke-width="1.2"/>
    <!-- Goldband & ALGE Schriftzug -->
    <rect x="28" y="37" width="44" height="27" fill="#032411" opacity=".82"/>
    <line x1="28" y1="37" x2="72" y2="37" stroke="url(#gGold)" stroke-width="2.5"/>
    <line x1="28" y1="64" x2="72" y2="64" stroke="url(#gGold)" stroke-width="2.5"/>
    <text x="50" y="56.5" text-anchor="middle" ${FONT_R} font-size="16.5" fill="url(#gGold)" letter-spacing=".8">ALGE</text>
    <!-- Glanz & Wassertropfen -->
    <rect x="33" y="23" width="6" height="58" rx="3" fill="#fff" opacity=".35"/>
    ${drop(63,30,2.5)}${drop(65,71,2.2)}${drop(36,73,2)}
    ${spk(80,14,9)}${spk(20,84,7)}`,

  /* === FRUCHT-EXPRESS (3D Hochglanz-Spielhallen-Früchte) === */
  cherry:`
    <path d="M50 13 C43 34 35 46 30 56" stroke="#235c0e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M50 13 C58 32 65 44 70 54" stroke="#235c0e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M50 13 C61 3 82 5 88 16 C75 23 60 21 50 13Z" fill="url(#gLeaf)" stroke="#14450b" stroke-width="1"/>
    <circle cx="30" cy="70" r="20" fill="url(#gRed)" stroke="#4a000c" stroke-width="1.2"/>
    <circle cx="70" cy="67" r="20" fill="url(#gRed)" stroke="#4a000c" stroke-width="1.2"/>
    ${hl(23,61,7,4,-30,.75)}${hl(63,58,7,4,-30,.75)}${drop(37,74,2.2)}${drop(76,72,2)}`,

  lemon:`
    <path d="M7 54 Q11 43 20 40 C34 19 66 19 80 40 Q89 43 93 54 Q89 65 80 68 C66 89 34 89 20 68 Q11 65 7 54Z" fill="url(#gLemon)" stroke="#8c6200" stroke-width="1.8"/>
    <path d="M58 26 C66 13 81 13 86 20 C78 28 66 31 58 26Z" fill="url(#gLeaf)"/>
    ${hl(36,40,15,5.5,-12,.75)}${drop(62,62,2.4)}${drop(46,68,2)}`,

  orange:`
    <circle cx="50" cy="57" r="36" fill="url(#gOrange)" stroke="#7d2b00" stroke-width="1.6"/>
    <path d="M50 22 L50 13" stroke="#4a2e08" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 17 C57 5 75 5 80 12 C71 20 58 22 50 17Z" fill="url(#gLeaf)"/>
    ${hl(36,42,12,6.5,-35,.7)}${drop(64,66,2.5)}${drop(34,70,2)}`,

  grape:`
    <path d="M50 19 L54 6" stroke="#4a2e08" stroke-width="4" stroke-linecap="round"/>
    <path d="M53 13 C62 2 81 4 86 13 C77 22 62 22 53 13Z" fill="url(#gLeaf)"/>
    ${[[30,31],[50,29],[70,31],[40,48],[60,48],[50,67]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="13.5" fill="url(#gGrape)" stroke="#2b0554" stroke-width="1"/>${hl(x-4,y-5,4,2.2,-30,.75)}`).join('')}`,

  bell:`
    <circle cx="50" cy="11" r="5.5" fill="url(#gGoldR)"/>
    <path d="M50 14 C29 14 25 36 24 52 C23 66 16 72 12 78 L88 78 C84 72 77 66 76 52 C75 36 71 14 50 14Z" fill="url(#gGold)" stroke="#6e4406" stroke-width="1.8"/>
    <rect x="9" y="76" width="82" height="10" rx="5" fill="#b87e18" stroke="#6e4406" stroke-width="1.5"/>
    <circle cx="50" cy="90" r="7" fill="url(#gGoldR)" stroke="#6e4406" stroke-width="1.2"/>
    <path d="M36 25 C32 36 31 50 30 62" stroke="#fff" stroke-width="5.5" stroke-linecap="round" opacity=".65" fill="none"/>${spk(79,20,9)}`,

  bar:`
    <rect x="5" y="16" width="90" height="68" rx="12" fill="url(#gGold)" stroke="#5c3605" stroke-width="2"/>
    <rect x="10" y="21" width="80" height="58" rx="8" fill="#120d10"/>
    <rect x="14" y="25" width="72" height="50" rx="5" fill="none" stroke="url(#gGold)" stroke-width="1.5"/>
    <text x="50" y="61" text-anchor="middle" ${FONT_R} font-size="30" fill="url(#gGold)" letter-spacing="1.5">BAR</text>
    ${spk(86,20,8)}${spk(14,80,6)}`,

  seven:`
    <text x="56" y="93" text-anchor="middle" ${FONT_R} font-size="102" fill="#2b0004">7</text>
    <text x="50" y="88" text-anchor="middle" ${FONT_R} font-size="102" fill="url(#gSeven)" stroke="url(#gGold)" stroke-width="6" paint-order="stroke">7</text>
    <path d="M24 20 H74 L68 30 H24 Z" fill="#fff" opacity=".35"/>
    ${spk(78,18,10)}${spk(30,78,7)}`,

  /* === STERNENJUWELEN === */
  planet:`
    <g transform="rotate(-20 50 52)"><ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="url(#gSilver)" stroke-width="5.5" opacity=".8"/></g>
    <circle cx="50" cy="52" r="28" fill="url(#gPlanet)" stroke="#591848" stroke-width="1.2"/>
    <path d="M25 46 Q50 40 75 46" stroke="#ffd2b0" stroke-width="3" fill="none" opacity=".55"/>
    <g transform="rotate(-20 50 52)"><path d="M4 52 A46 12 0 0 0 96 52" fill="none" stroke="url(#gSilver)" stroke-width="5.5"/></g>${hl(40,40,8,4)}${spk(84,18,7)}`,

  moon:`
    <circle cx="50" cy="50" r="46" fill="url(#gGlow)" opacity=".5"/><circle cx="46" cy="54" r="37" fill="url(#gMoon)" mask="url(#mMoon)"/>
    ${spk(78,26,9)}${spk(88,52,5,.85)}`,

  comet:`
    <path d="M60 22 Q34 52 6 95 Q44 72 80 42Z" fill="url(#gTail)"/>
    <circle cx="70" cy="32" r="26" fill="url(#gHead)"/><circle cx="70" cy="32" r="10" fill="#fff"/>${spk(30,24,7)}`,

  orb:`
    <path d="M28 78 H72 L81 93 H19Z" fill="url(#gGold)" stroke="#6e4406" stroke-width="1.5"/>
    <circle cx="50" cy="46" r="35" fill="url(#gOrb)" stroke="#fff1a8" stroke-width="1.5"/>
    ${hl(38,31,11,6,-30,.65)}${spk(62,56,7,.9)}`,

  ring:`
    <ellipse cx="50" cy="66" rx="28" ry="22" fill="none" stroke="#6e4406" stroke-width="11"/><ellipse cx="50" cy="66" rx="28" ry="22" fill="none" stroke="url(#gGold)" stroke-width="7.5"/>
    <path d="M28 30 L39 14 H61 L72 30 L50 53Z" fill="url(#gSapph)" stroke="#fff" stroke-width="1.2"/>
    <path d="M28 30 H72 M39 14 L45 30 L50 14 L55 30 L61 14 M45 30 L50 53 L55 30" stroke="#fff" stroke-width="1.3" opacity=".7" fill="none"/>${spk(75,14,9)}`,

  gem:`
    <path d="M11 36 L31 12 H69 L89 36 L50 92Z" fill="url(#gRuby)" stroke="#fff1a8" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M11 36 H89 M31 12 L40 36 L50 12 L60 36 L69 12 M40 36 L50 92 L60 36" stroke="#fff" stroke-width="1.5" opacity=".65" fill="none"/>
    ${spk(79,15,10)}${spk(24,62,6,.85)}`,

  crown:`
    <path d="M13 74 L7 29 L31 50 L50 16 L69 50 L93 29 L87 74Z" fill="url(#gGold)" stroke="#6e4406" stroke-width="1.8" stroke-linejoin="round"/>
    <rect x="11" y="70" width="78" height="17" rx="4" fill="url(#gGold)" stroke="#6e4406" stroke-width="1.8"/>
    <circle cx="7" cy="29" r="5.5" fill="#fffbe0"/><circle cx="50" cy="14" r="6" fill="#fffbe0"/><circle cx="93" cy="29" r="5.5" fill="#fffbe0"/>
    <circle cx="50" cy="78" r="5.5" fill="url(#gRuby)"/><circle cx="29" cy="78" r="4.5" fill="url(#gSapph)"/><circle cx="71" cy="78" r="4.5" fill="url(#gSapph)"/>
    ${spk(81,12,9)}`,

  star:`
    <circle cx="50" cy="52" r="48" fill="url(#gGlow)"/>
    <path d="${starPath(50,52,45,19)}" fill="url(#gGoldR)" stroke="#7d4d0c" stroke-width="2" stroke-linejoin="round"/>
    <path d="${starPath(50,52,30,12.5)}" fill="#fff" opacity=".32"/>
    <rect x="16" y="85" width="68" height="14" rx="7" fill="#2b0f66" stroke="#fff1a8" stroke-width="1.5"/>
    <text x="50" y="95.5" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="800" font-size="9.5" fill="#fff" letter-spacing="1.5">SCATTER</text>`,

  wildS:`
    <circle cx="50" cy="50" r="48" fill="url(#gGlow)" opacity=".6"/>
    <rect x="4" y="25" width="92" height="50" rx="13" fill="url(#gCosmic)" stroke="#fff1a8" stroke-width="3.5"/>
    <text x="50" y="61" text-anchor="middle" ${FONT_R} font-size="30" fill="#fff" stroke="#2b0f66" stroke-width="3" paint-order="stroke">WILD</text>
    ${spk(12,22,8)}${spk(88,80,7)}`,

  /* === DRACHENHORT === */
  j:cardJade('J','#b7f397'), q:cardJade('Q','#7fd6ff'), k:cardJade('K','#ffd166'), a:cardJade('A','#ff7a6b'),

  lantern:`
    <circle cx="50" cy="54" r="46" fill="url(#gGlow)" opacity=".6"/><line x1="50" y1="2" x2="50" y2="18" stroke="#c98a20" stroke-width="2.5"/>
    <rect x="34" y="15" width="32" height="9" rx="2" fill="url(#gGold)"/><ellipse cx="50" cy="52" rx="34" ry="30" fill="url(#gLantern)" stroke="url(#gGold)" stroke-width="2"/>
    <rect x="34" y="79" width="32" height="9" rx="2" fill="url(#gGold)"/><path d="M43 88 V98 M50 88 V100 M57 88 V98" stroke="#f7c948" stroke-width="2.5"/>
    <text x="50" y="60" text-anchor="middle" font-size="23" fill="#ffd44a" font-weight="700">福</text>${hl(34,42,6,11,20,.5)}`,

  envelope:`
    <rect x="19" y="8" width="62" height="84" rx="8" fill="url(#gEnv)" stroke="url(#gGold)" stroke-width="2.5"/>
    <path d="M19 15 Q50 52 81 15 V14 Q81 8 74 8 H26 Q19 8 19 14Z" fill="#b80d18"/>
    <circle cx="50" cy="41" r="14" fill="url(#gGoldR)" stroke="#6e4406" stroke-width="1.5"/><text x="50" y="47" text-anchor="middle" font-size="17" fill="#9c0612" font-weight="800">福</text>
    ${spk(82,10,8)}`,

  dragon:`
    <circle cx="50" cy="50" r="46" fill="url(#gDrag)" stroke="url(#gGold)" stroke-width="5"/>
    <circle cx="27" cy="31" r="13" fill="url(#gGlow)"/><circle cx="27" cy="31" r="7.5" fill="url(#gPearl)"/>
    <path d="${dragonBody}" stroke="#4a2e06" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="${dragonBody}" stroke="url(#gGold)" stroke-width="9.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="71" cy="29" rx="14" ry="9.5" transform="rotate(25 71 29)" fill="url(#gGold)" stroke="#4a2e06" stroke-width="1.5"/>
    <circle cx="73" cy="25.5" r="2.8" fill="#d4141c"/>${spk(82,16,8)}`,

  wildD:`
    <path d="M50 4 C64 24 84 34 80 60 C78 80 64 94 50 94 C36 94 20 82 20 60 C20 46 30 38 33 24 C40 36 43 42 49 44 C52 30 46 18 50 4Z" fill="url(#gFire)"/>
    <rect x="6" y="61" width="88" height="26" rx="8" fill="#260505" stroke="url(#gGold)" stroke-width="3"/>
    <text x="50" y="80" text-anchor="middle" ${FONT_R} font-size="19" fill="url(#gGold)" letter-spacing="1">WILD</text>${spk(80,14,8)}`,

  coin:`
    <circle cx="50" cy="50" r="45" fill="url(#gGold)" stroke="#6e4406" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="35" fill="url(#gGoldR)" stroke="#9e5f0d" stroke-width="2.5"/>
    <rect x="40" y="40" width="20" height="20" rx="2" fill="#3d2404" stroke="#9e5f0d" stroke-width="2"/>
    ${hl(34,26,12,5,-35,.6)}${spk(82,16,9)}`,

  /* === GRIMOIRE === */
  fire: rune('#ff6b4a','M50 27 L72 67 H28Z'),
  water: rune('#4ab8ff','M28 33 H72 L50 73Z'),
  air: rune('#ffe066','M50 27 L72 67 H28Z M35 54 H65'),
  earth: rune('#6bdc7a','M28 33 H72 L50 73Z M35 46 H65'),
  candle:`<ellipse cx="50" cy="22" rx="18" ry="22" fill="url(#gGlow)"/>
    <path d="M50 6 C59 17 59 28 50 35 C41 28 41 17 50 6Z" fill="url(#gFire)"/><path d="M50 17 C53 22 53 28 50 31 C47 28 47 22 50 17Z" fill="#fff6c0"/>
    <rect x="35" y="38" width="30" height="48" rx="3" fill="url(#gWax)"/>
    <ellipse cx="50" cy="88" rx="27" ry="7" fill="url(#gGold)" stroke="#6e4406" stroke-width="1.2"/>${spk(78,16,8)}`,
  potion:`<circle cx="50" cy="62" r="40" fill="url(#gGlow)" opacity=".4"/>
    <rect x="41" y="6" width="18" height="11" rx="2.5" fill="#8a5a2a"/>
    <path d="M44 17 H56 V34 C71 40 80 52 80 64 C80 82 66 93 50 93 C34 93 20 82 20 64 C20 52 29 40 44 34Z" fill="#d8eeff" fill-opacity=".2" stroke="#fff1a8" stroke-width="2.5"/>
    <path d="M22 62 C34 55 66 69 78 60 C80 80 66 90 50 90 C34 90 22 80 22 62Z" fill="url(#gPotion)"/>
    ${hl(31,56,4.5,10,20,.55)}${spk(76,26,8)}`,
  owl:`<path d="M26 40 L28 14 L42 30Z M74 40 L72 14 L58 30Z" fill="#5a3a1e"/>
    <ellipse cx="50" cy="58" rx="31" ry="34" fill="url(#gOwl)" stroke="url(#gGold)" stroke-width="2"/>
    <circle cx="37" cy="44" r="14" fill="#f3e3c0"/><circle cx="63" cy="44" r="14" fill="#f3e3c0"/>
    <circle cx="37" cy="44" r="9" fill="url(#gGoldR)"/><circle cx="63" cy="44" r="9" fill="url(#gGoldR)"/>
    <circle cx="37" cy="44" r="4.5" fill="#1a1008"/><circle cx="63" cy="44" r="4.5" fill="#1a1008"/>
    <path d="M45 54 L50 63 L55 54Z" fill="#e0a030"/>${spk(84,18,8)}`,
  hourglass:`<circle cx="50" cy="50" r="46" fill="url(#gGlow)" opacity=".45"/>
    <path d="M30 18 H70 C70 36 56 44 52 50 C56 56 70 64 70 82 H30 C30 64 44 56 48 50 C44 44 30 36 30 18Z" fill="#dff4ff" fill-opacity=".22" stroke="#fff1a8" stroke-width="2.5"/>
    <path d="M36 26 H64 C62 36 54 42 50 47 C46 42 38 36 36 26Z" fill="url(#gSand)"/>
    <path d="M33 81 C37 70 45 66 50 66 C55 66 63 70 67 81Z" fill="url(#gSand)"/>
    <rect x="18" y="8" width="64" height="11" rx="3" fill="url(#gGold)"/><rect x="18" y="81" width="64" height="11" rx="3" fill="url(#gGold)"/>${spk(86,12,9)}`,
  book:`<circle cx="50" cy="50" r="49" fill="url(#gGlow)" opacity=".6"/>
    <path d="M14 18 Q14 11 21 11 H82 Q88 11 88 17 V86 Q88 92 82 92 H21 Q14 92 14 85Z" fill="url(#gTome)" stroke="url(#gGold)" stroke-width="2.5"/>
    <circle cx="59" cy="51" r="22" fill="none" stroke="url(#gGold)" stroke-width="3.5"/>
    <path d="${starPath(59,51,15,5.5,8)}" fill="url(#gGold)"/><circle cx="59" cy="51" r="5" fill="#fffbe0"/>
    ${spk(14,8,9)}${spk(92,94,7)}`
};

const DEFS = `<linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#f2b63d"/><stop offset="1" stop-color="#7d4d0c"/></linearGradient>
<radialGradient id="gGoldR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fffbe0"/><stop offset=".5" stop-color="#f2b63d"/><stop offset="1" stop-color="#7d4d0c"/></radialGradient>
<linearGradient id="gCardEmerald" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#19b85c"/><stop offset="1" stop-color="#052e17"/></linearGradient>
<linearGradient id="gCardSapph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b82ff"/><stop offset="1" stop-color="#081f54"/></linearGradient>
<linearGradient id="gCardRuby" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f02b63"/><stop offset="1" stop-color="#4d061c"/></linearGradient>
<linearGradient id="gCardRoyal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9e3bf0"/><stop offset="1" stop-color="#2b074d"/></linearGradient>
<linearGradient id="gCardCrimson" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3848"/><stop offset="1" stop-color="#54040a"/></linearGradient>
<radialGradient id="gSeaMedallion" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#146352"/><stop offset="1" stop-color="#041c18"/></radialGradient>
<radialGradient id="gRoyalRed" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#9c142c"/><stop offset="1" stop-color="#2b030a"/></radialGradient>
<linearGradient id="gShellTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcce2"/><stop offset="1" stop-color="#c95b8c"/></linearGradient>
<linearGradient id="gShellBot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e88bb4"/><stop offset="1" stop-color="#872b54"/></linearGradient>
<linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9e5820"/><stop offset="1" stop-color="#472106"/></linearGradient>
<radialGradient id="gSkin" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffd9b8"/><stop offset="1" stop-color="#c9885b"/></radialGradient>
<linearGradient id="gBeard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#d8e0eb"/><stop offset="1" stop-color="#8e99ab"/></linearGradient>
<linearGradient id="gAlgeCan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b6e35"/><stop offset=".35" stop-color="#24f07a"/><stop offset=".7" stop-color="#14b858"/><stop offset="1" stop-color="#064721"/></linearGradient>
<radialGradient id="gAlgeGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#24f07a" stop-opacity=".75"/><stop offset="1" stop-color="#18d968" stop-opacity="0"/></radialGradient>
<radialGradient id="gRed" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ff9aa2"/><stop offset=".45" stop-color="#e3112d"/><stop offset="1" stop-color="#5c0010"/></radialGradient>
<radialGradient id="gLemon" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fffde0"/><stop offset=".5" stop-color="#ffe23d"/><stop offset="1" stop-color="#b98a00"/></radialGradient>
<radialGradient id="gOrange" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe0b0"/><stop offset=".5" stop-color="#ff8a14"/><stop offset="1" stop-color="#a03c00"/></radialGradient>
<radialGradient id="gGrape" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f0d0ff"/><stop offset=".5" stop-color="#9b3cf0"/><stop offset="1" stop-color="#3a0a70"/></radialGradient>
<linearGradient id="gLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c6f78a"/><stop offset=".5" stop-color="#43b02a"/><stop offset="1" stop-color="#1b5a12"/></linearGradient>
<linearGradient id="gSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c8d0e0"/><stop offset="1" stop-color="#5e6679"/></linearGradient>
<linearGradient id="gSapph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2f8ff"/><stop offset=".45" stop-color="#3cb6ff"/><stop offset="1" stop-color="#0a3f99"/></linearGradient>
<linearGradient id="gRuby" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd0da"/><stop offset=".45" stop-color="#ff2f63"/><stop offset="1" stop-color="#6d0026"/></linearGradient>
<radialGradient id="gPlanet" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffe6c2"/><stop offset=".5" stop-color="#ff8f6b"/><stop offset="1" stop-color="#7a2a66"/></radialGradient>
<linearGradient id="gMoon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbe6"/><stop offset=".55" stop-color="#ffd86b"/><stop offset="1" stop-color="#c58a1c"/></linearGradient>
<radialGradient id="gOrb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#d7b8ff"/><stop offset=".75" stop-color="#7b3df0"/><stop offset="1" stop-color="#2a0c66"/></radialGradient>
<radialGradient id="gHead" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#bff0ff"/><stop offset="1" stop-color="#2fb4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="gTail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#3cb6ff" stop-opacity="0"/><stop offset="1" stop-color="#c9f1ff"/></linearGradient>
<radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffcc33" stop-opacity="0"/></radialGradient>
<linearGradient id="gCosmic" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5fd2"/><stop offset=".5" stop-color="#7a5cff"/><stop offset="1" stop-color="#38d1ff"/></linearGradient>
<radialGradient id="gJade" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#2a6d55"/><stop offset="1" stop-color="#06261c"/></radialGradient>
<radialGradient id="gLantern" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffb08a"/><stop offset=".45" stop-color="#e3242b"/><stop offset="1" stop-color="#6a0508"/></radialGradient>
<linearGradient id="gEnv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5a5f"/><stop offset="1" stop-color="#9c0612"/></linearGradient>
<radialGradient id="gDrag" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#d8303a"/><stop offset="1" stop-color="#4a0408"/></radialGradient>
<linearGradient id="gFire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c4101c"/><stop offset=".5" stop-color="#ff8a1f"/><stop offset="1" stop-color="#fff2a0"/></linearGradient>
<radialGradient id="gPearl" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#bfefff"/><stop offset="1" stop-color="#3a9ad9"/></radialGradient>
<linearGradient id="gSeven" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a8a"/><stop offset=".5" stop-color="#e3112d"/><stop offset="1" stop-color="#7a0010"/></linearGradient>
<linearGradient id="gTome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a52d0"/><stop offset=".5" stop-color="#5a1f8a"/><stop offset="1" stop-color="#2a0c48"/></linearGradient>
<radialGradient id="gStone" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5e5870"/><stop offset="1" stop-color="#17141f"/></radialGradient>
<linearGradient id="gWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8d2a8"/><stop offset=".4" stop-color="#fff8e6"/><stop offset="1" stop-color="#d9bf8e"/></linearGradient>
<linearGradient id="gPotion" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2ff8f"/><stop offset=".5" stop-color="#2fbf5f"/><stop offset="1" stop-color="#0b5a2a"/></linearGradient>
<radialGradient id="gOwl" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#d0a676"/><stop offset=".55" stop-color="#7a5230"/><stop offset="1" stop-color="#341f0e"/></radialGradient>
<linearGradient id="gSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#d4922a"/></linearGradient>
<filter id="bevel" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="b"/>
<feSpecularLighting in="b" surfaceScale="3.2" specularConstant=".95" specularExponent="24" lighting-color="#ffffff" result="sp"><feDistantLight azimuth="235" elevation="40"/></feSpecularLighting>
<feComposite in="sp" in2="SourceAlpha" operator="in" result="spIn"/>
<feComposite in="SourceGraphic" in2="spIn" operator="arithmetic" k1="0" k2="1" k3=".7" k4="0"/></filter>
<mask id="mMoon\" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><circle cx="66" cy="38" r="31" fill="#000"/></mask>`;

document.body.insertAdjacentHTML('afterbegin',
  `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs>${DEFS}</defs>${
    Object.entries(ART).map(([k,v]) => `<symbol id="s-${k}" viewBox="0 0 100 100" overflow="visible">${v}</symbol>`).join('')}</svg>`);
const svgFor = key => `<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#s-${key}" filter="url(#bevel)"/></svg>`;
Object.values(MACHINES).forEach(m => Object.entries(m.sym).forEach(([id, s]) => {
  s.svg = svgFor(id === 'wild' ? (m.id === 'sterne' ? 'wildS' : 'wildD') : id);
}));

/* ---- Premium: 3D-Icons zuordnen, Top-Symbole bekommen Goldkacheln ---- */
const EMO_MAP = {
  alge:{anchor:'anchor', shell:'shell', trident:'trident', king:'merman'},
  frucht:{cherry:'cherry', lemon:'lemon', orange:'orange', grape:'grape', bell:'bell'},
  sterne:{planet:'planet', moon:'moon', comet:'comet', orb:'orb', ring:'ring', gem:'gem', crown:'crown', star:'star'},
  drache:{lantern:'lantern', envelope:'envelope', dragon:'dragon', coin:'coin'},
  buch:{candle:'candle', potion:'potion', owl:'owl', hourglass:'hourglass'}
};
const TILE = {
  alge:{king:'gold', trident:'gold', shell:'silver', anchor:'silver'},
  frucht:{bell:'gold'},
  sterne:{crown:'royal', gem:'royal', ring:'silver'},
  drache:{dragon:'jade', envelope:'gold'},
  buch:{hourglass:'gold', owl:'royal', potion:'silver'}
};
const emoHTML = k => `<i class="emo emo-${k}" aria-hidden="true"></i>`;
Object.values(MACHINES).forEach(m => Object.entries(EMO_MAP[m.id] || {}).forEach(([id, k]) => {
  if(m.sym[id]) m.sym[id].svg = emoHTML(k);
}));
const mini = s => `<span class="mini">${s.svg}</span>`;
document.getElementById('heroSyms').innerHTML = ['algecan','king','seven','crown','dragon','trident','gem','coin']
  .map((k,i) => `<span style="animation-delay:${(i*.24).toFixed(2)}s">${({king:emoHTML('merman'),crown:emoHTML('crown'),dragon:emoHTML('dragon'),trident:emoHTML('trident'),gem:emoHTML('gem'),coin:emoHTML('coin')})[k] || svgFor(k)}</span>`).join('');
document.getElementById('spotAlge').innerHTML = svgFor('algecan');

/* ================= Ambient Gold Dust Canvas ================= */
(() => {
  const dc = document.getElementById('dust');
  const ctx = dc.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; dc.width = W * dpr; dc.height = H * dpr; };
  resize(); addEventListener('resize', resize);
  const motes = Array.from({length: 44}, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: 1 + Math.random() * 2.2, vy: -(0.15 + Math.random() * 0.35), vx: (Math.random() - 0.5) * 0.25,
    ph: Math.random() * Math.PI * 2
  }));
  function tick(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ctx.clearRect(0, 0, dc.width, dc.height);
    for(const m of motes){
      m.y += m.vy; m.x += m.vx + Math.sin(m.ph += 0.015) * 0.15;
      if(m.y < -10){ m.y = H + 10; m.x = Math.random() * W; }
      if(m.x < -10) m.x = W + 10; if(m.x > W + 10) m.x = -10;
      const a = 0.25 + 0.45 * Math.abs(Math.sin(m.ph * 1.4));
      ctx.fillStyle = `rgba(255, 224, 130, ${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(m.x * dpr, m.y * dpr, m.r * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ================= Zustand ================= */
const BETS = [10,20,50,100,200,500,1000];
const KEY = (window.GP_PROFILE && GP_PROFILE.key) || 'glueckspalast-v1';   // je Spieler ein eigener Spielstand
const BONUS_MS = 24*3600*1000;
function freshState(){
  return {balance:5000, lastBonus:0, stats:{}, history:[], ach:{}, sound:true, grand:MACHINES.drache.grandSeed, betIdx:{alge:1,frucht:1,sterne:1,drache:1,buch:1}, gambleWins:0, refills:0};
}
let S = freshState();
try{ const raw = localStorage.getItem(KEY); if(raw) S = Object.assign(freshState(), JSON.parse(raw)); }catch(e){}
S.betIdx = Object.assign({alge:1,frucht:1,sterne:1,drache:1,buch:1}, S.betIdx);
if(!Number.isFinite(S.balance)) S.balance = 5000;
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} if(window.GPProfiles) GPProfiles.onSave(S); }

const $ = s => document.querySelector(s);
const fmt = n => Math.round(n).toLocaleString('de-DE');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= Stream Hype & Chat Engine ================= */
const HYPE_CHAT = {
  spin: [
    ['KönigsGarde', 'Dreh das Ding! 👑'],
    ['AlgenJäger', 'Jetzt kommt die ALGE-Dose!! 🥫'],
    ['PalastBote', 'Vollbild Alge-König incoming?!'],
    ['GoldFinger', 'Komm schon, dritte Walze!!'],
    ['SamtPrinz', 'Die Krone glüht heute! ✨'],
    ['LuckyLeo', 'ALGE! ALGE! ALGE! 🌿']
  ],
  tease: [
    ['CHAT_EXPLODIERT', 'NOCH EINE DOSE!! KOMM SCHON!! 🔥🔥🔥'],
    ['AlgenJäger', 'ZWEI ALGEN SIND DRIN!! 🥫⚡'],
    ['KönigsGarde', 'ALLE HÄNDE HOCH!! 🙌'],
    ['PalastBote', 'ES SCHEPPERT GLEICH!!']
  ],
  win: [
    ['KönigsGarde', 'ES SCHEPPERT!! 💰👑'],
    ['AlgenJäger', 'DER KÖNIG REGIERT!! 🔥'],
    ['SamtPrinz', 'AB AUF DIE RISIKOLEITER!! ⚡'],
    ['PalastBote', 'KASINO-KÖNIG!! 🏆']
  ],
  big: [
    ['ALLE_IM_CHAT', '👑👑👑 LEGENDÄR!! DER PALAST BEBT!! 👑👑👑'],
    ['AlgenJäger', 'VOLLES HAUS! ALGE! ALGE! ALGE!'],
    ['GoldFinger', 'UNFASSBAR!! KÖNIG DER SPIELHALLE!!']
  ]
};
function pushChat(poolName, customUser, customText){
  const feed = $('#chatFeed'); if(!feed) return;
  let user = customUser, text = customText;
  if(!user){
    const arr = HYPE_CHAT[poolName] || HYPE_CHAT.spin;
    [user, text] = arr[Math.floor(Math.random() * arr.length)];
  }
  const span = document.createElement('span');
  span.className = 'chat-msg';
  span.innerHTML = `<b>${user}:</b> ${text}`;
  feed.prepend(span);
  while(feed.children.length > 5) feed.lastElementChild.remove();
}

let hypeVal = 20;
function setHype(v){
  hypeVal = Math.max(12, Math.min(100, v));
  const fill = $('#hypeFill'), st = $('#hypeStatus'), strip = $('#hypeStrip');
  if(!fill) return;
  fill.style.width = hypeVal + '%';
  strip.classList.toggle('fire', hypeVal >= 72);
  if(hypeVal >= 90) st.textContent = '🔥 KÖNIGS-EKSTASE!';
  else if(hypeVal >= 72) st.textContent = '⚡ ES SCHEPPERT!';
  else if(hypeVal >= 45) st.textContent = '✨ AUFGEHEIZT';
  else st.textContent = '👑 WARMLAUFEN';
}

/* ================= Spielhallen-Sounds (WebAudio-Synthese) ================= */
const Sfx = {
  ctx:null,
  init(){ if(!this.ctx){ try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(this.ctx && this.ctx.state==='suspended') this.ctx.resume(); },
  tone(f, d=.12, type='square', vol=.05, when=0){
    if(!S.sound || !this.ctx) return;
    const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + d + .02);
  },
  spin(){
    // Typisches Spielhallen-Startgeräusch
    this.tone(190,.07,'triangle',.06);
    this.tone(285,.07,'sine',.04,.04);
  },
  stop(i){
    // Sattes mechanisches Walzen-Einrasten
    this.tone(115 + i*18,.075,'triangle',.07);
    this.tone(68,.06,'sine',.06);
  },
  win(){
    // Klassische Gewinnmelodie (aufsteigende Terzen & Quinte)
    const seq = [523.25, 659.25, 783.99, 659.25, 1046.5];
    seq.forEach((f,i)=>this.tone(f,.13,'square',.04,i*.065));
  },
  big(){
    // Große Spielhallen-Fanfare
    this.tone(65.41, .75, 'sawtooth', .065, 0);
    [523.25,659.25,783.99,1046.5,783.99,1046.5,1318.5,1567.98].forEach((f,i)=>this.tone(f,.22,'square',.05,i*.09));
  },
  coin(){ this.tone(1318,.06,'square',.045); this.tone(1760,.09,'triangle',.05,.045); },
  lose(){ this.tone(220,.18,'sawtooth',.04); this.tone(155,.32,'sawtooth',.045,.15); },
  feature(){
    // Kult-Freispiel-Fanfare
    this.tone(98, .65, 'triangle', .07, 0);
    [392,493.88,587.33,783.99,987.77,1174.66,1567.98].forEach((f,i)=>this.tone(f,.22,'square',.05,i*.08));
  },
  tick(){ this.tone(920,.025,'square',.022); },
  ladderTick(high){
    // Risikoleiter-Blinken (hoch/tief im Wechsel)
    this.tone(high ? 1180 : 780, .035, 'square', .028);
  },
  ladderUp(){
    // Aufsteigender Leiter-Erfolgston
    [659.25, 880, 1174.66, 1567.98].forEach((f,i)=>this.tone(f,.11,'square',.045,i*.045));
  },
  rise(ms){
    if(!S.sound || !this.ctx) return;
    const t = this.ctx.currentTime, d = ms/1000, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(1040, t + d);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.038, t + d*.85); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + d + .05);
    for(let i=0;i<ms/105;i++) this.tone(620 + i*28, .04, 'square', .02, i*.105);
  },
  scatter(n){
    // Markanter Scatter-Gong
    const f = [587.33, 783.99, 1046.5, 1396.91][Math.min(n-1,3)];
    this.tone(f,.32,'triangle',.08);
    this.tone(f*1.5,.36,'square',.04,.05);
  },
  wildLand(){ this.tone(523.25,.12,'square',.045); this.tone(1046.5,.18,'triangle',.05,.05); },
  tierUp(){
    this.tone(82.41, .5, 'sawtooth', .065, 0);
    [784,988,1175,1568,2093].forEach((f,i)=>this.tone(f,.18,'square',.055,i*.055));
  },
  roll(){ this.tone(1250 + Math.random()*450, .022, 'square', .016); },
  coinTick(){ this.tone(1900 + Math.random()*500, .05, 'square', .022); this.tone(2600, .04, 'sine', .016, .03); },
  wheelTick(){ this.tone(1500, .03, 'square', .038); },
  heartbeat(){ this.tone(72, .12, 'sine', .09, 0); this.tone(62, .16, 'sine', .07, .14); }
};

/* ================= Partikel (Canvas) ================= */
const FX = (() => {
  const cv = document.createElement('canvas'); cv.id = 'fx'; cv.setAttribute('aria-hidden','true'); document.body.appendChild(cv);
  const ctx = cv.getContext('2d'); let parts = [], raf = 0, dpr = 1;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
  size(); addEventListener('resize', size);
  const palette = () => ['#fffbe6','#fff1a8','#f2b63d','#18d968'];
  function draw(p){
    ctx.save(); ctx.translate(p.x*dpr, p.y*dpr); ctx.rotate(p.rot); const s = p.size*dpr;
    ctx.globalAlpha = Math.min(1, p.life/25);
    if(p.kind === 'coin'){
      ctx.scale(Math.abs(Math.cos(p.flip)) + .12, 1);
      ctx.beginPath(); ctx.arc(0,0,s,0,7); ctx.fillStyle = '#c98a20'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,0,s*.72,0,7); ctx.fillStyle = '#fff1a8'; ctx.fill();
      ctx.lineWidth = dpr; ctx.strokeStyle = '#7d4d0c'; ctx.stroke();
    } else if(p.kind === 'crown'){
      ctx.fillStyle = '#fff1a8';
      ctx.beginPath();
      ctx.moveTo(-s, s*.6); ctx.lineTo(-s*1.2, -s*.6); ctx.lineTo(-s*.4, 0);
      ctx.lineTo(0, -s*.9); ctx.lineTo(s*.4, 0); ctx.lineTo(s*1.2, -s*.6); ctx.lineTo(s, s*.6);
      ctx.closePath(); ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = p.color; ctx.beginPath();
      for(let i=0;i<8;i++){ const rr = i%2 ? s*.28 : s, a = i*Math.PI/4; ctx.lineTo(Math.cos(a)*rr, Math.sin(a)*rr); }
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function loop(){
    ctx.clearRect(0,0,cv.width,cv.height);
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 60);
    for(const p of parts){
      if(p.home){
        p.t++; if(p.t < 0) continue;
        const k = Math.min(1, p.t / p.dur), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
        const mx = (p.sx + p.tx)/2 + p.cv, my = Math.min(p.sy, p.ty) - 90 - Math.abs(p.cv)*.4;
        p.x = (1-e)*(1-e)*p.sx + 2*(1-e)*e*mx + e*e*p.tx;
        p.y = (1-e)*(1-e)*p.sy + 2*(1-e)*e*my + e*e*p.ty;
        p.flip += .3;
        if(k >= 1){ p.life = 0; if(p.cb) p.cb(); continue; }
        draw(p); continue;
      }
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .985; p.life--; p.rot += p.vr; p.flip += .18; draw(p);
    }
    raf = parts.length ? requestAnimationFrame(loop) : 0;
    if(!raf) ctx.clearRect(0,0,cv.width,cv.height);
  }
  function add(p){ if(parts.length < 750) parts.push(p); if(!raf) raf = requestAnimationFrame(loop); }
  return {
    burst(x, y, n=26){
      if(reduced) return; const cols = palette();
      for(let i=0;i<n;i++){ const a = Math.random()*Math.PI*2, v = 2 + Math.random()*6.5;
        add({x, y, vx:Math.cos(a)*v, vy:Math.sin(a)*v - 1.5, g:.14, life:45 + Math.random()*35, size:3 + Math.random()*6.5,
             color:cols[i % cols.length], kind:'star', rot:Math.random()*6, vr:(Math.random()-.5)*.3, flip:0}); }
    },
    fly(fromEl, toEl, n=12){
      if(reduced || !fromEl || !toEl) return;
      const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
      const tx = b.left + b.width/2, ty = b.top + b.height/2;
      for(let i=0;i<n;i++){
        const sx = a.left + a.width*(.15 + Math.random()*.7), sy = a.top + a.height*(.2 + Math.random()*.6);
        add({home:true, sx, sy, tx, ty, x:sx, y:sy, t:-i*2.5, dur:38 + Math.random()*22, cv:(Math.random()-.5)*220,
             kind:'coin', size:7 + Math.random()*4, rot:0, vr:0, flip:Math.random()*6, life:999, g:0, vx:0, vy:0,
             cb: i % 2 === 0 ? () => { Sfx.coinTick(); const el = $('#balance'); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } : null});
      }
    },
    fountain(n=45){
      if(reduced) return;
      for(let i=0;i<n;i++){
        const isCrown = i % 7 === 0;
        add({x:innerWidth/2 + (Math.random()-.5)*innerWidth*.55, y:innerHeight + 20, vx:(Math.random()-.5)*9.5, vy:-(11.5 + Math.random()*10.5),
             g:.33, life:175, size:8 + Math.random()*7, kind: isCrown ? 'crown' : 'coin', rot:(Math.random()-.5)*.6, vr:(Math.random()-.5)*.06, flip:Math.random()*6});
      }
    }
  };
})();
function burstAt(el, n){ if(!el) return; const r = el.getBoundingClientRect(); FX.burst(r.left + r.width/2, r.top + r.height/2, n); }
function flash(op=1){ if(reduced) return; const f = document.createElement('div'); f.className = 'flash'; f.style.setProperty('--o', op); document.body.appendChild(f); setTimeout(() => f.remove(), 600); }
function shake(){ if(reduced) return; document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 550); }
function rollWin(to){
  const el = $('#roWin');
  const from = Math.min(to, Number(el.textContent.replace(/\D/g,'')) || 0);
  if(reduced || to - from <= 0){ el.textContent = fmt(to); return; }
  const dur = Math.min(1900, 300 + Math.log10(to + 1) * 320);
  el.classList.add('rolling'); const t0 = performance.now(); let last = 0;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    if(now - last > 55){ Sfx.roll(); last = now; }
    if(p < 1) requestAnimationFrame(step); else el.classList.remove('rolling');
  };
  requestAnimationFrame(step);
}
async function expandReveal(m, sym){
  const ov = $('#overlay'); const keys = Object.keys(m.pays);
  const label = m.id === 'alge' ? '🥫 DIE ALGE-SCHRIFTROLLE ÖFFNET SICH …' : '📖 DAS GRIMOIRE ÖFFNET SICH …';
  ov.innerHTML = `<div class="rays"></div><div class="big"><div class="eyebrow" style="font-size:14px">${label}</div>
    <div class="t" style="font-size:clamp(32px,7vw,62px)">SPEZIALSYMBOL</div><div class="reveal" id="rv"></div><div class="s" id="rvs">&nbsp;</div></div>`;
  ov.hidden = false; FX.fountain(35);
  const rv = $('#rv'); let delay = 60;
  for(let k=0, n = reduced ? 1 : 24; k<n; k++){ rv.innerHTML = m.sym[keys[k % keys.length]].svg; Sfx.wheelTick(); await sleep(delay); delay *= 1.085; }
  rv.innerHTML = m.sym[sym].svg; rv.classList.add('final');
  flash(); shake(); Sfx.tierUp(); burstAt(rv, 100);
  $('#rvs').textContent = `👑 ${m.sym[sym].n.toUpperCase()} – VOLLBILD-JAGD!`;
  pushChat('big', 'Orakel', `SPEZIALSYMBOL: ${m.sym[sym].n.toUpperCase()}!! 🔥`);
  await sleep(reduced ? 400 : 2100);
  ov.hidden = true; ov.innerHTML = '';
}
async function showExpand(m, ex, sym){
  win.classList.add('dim');
  $('#msg').innerHTML = `<div class="teaser">⚡ ${mini(m.sym[sym])} BREITET SICH AUS!!</div>`;
  for(const c of ex.reels){
    const strip = win.querySelectorAll('.reel')[c].querySelector('.strip');
    strip.innerHTML = Array.from({length:m.rows}, () => cellHTML(m, {id:sym}, 'win expand')).join('');
    burstAt(strip, 50); flash(.35); Sfx.scatter(3);
    await sleep(UI.turbo || reduced ? 120 : 450);
  }
  const full = ex.n === m.cols;
  $('#msg').innerHTML = `<div class="main">${full ? '👑 VOLLBILD!! ' : ''}${mini(m.sym[sym])} auf ${ex.n} Walzen: <span class="num">${fmt(ex.amt)}</span></div>`;
  if(full) pushChat('big', 'PALAST_BEBT', 'VOLLBILD!! DER KÖNIG REGIERT!! 👑🔥');
  await sleep(UI.turbo || reduced ? 200 : 750);
}
function celebrateCells(){ [...win.querySelectorAll('.cell.win')].forEach((el,i) => setTimeout(() => burstAt(el, 14), i*55)); }

/* ================= Erfolge ================= */
const ACH = [
  ['spin1','Erster Dreh','Drehe zum ersten Mal',100],
  ['win1','Erster Treffer','Gewinne irgendetwas',100],
  ['big','Es scheppert!','Gewinne 15× den Einsatz',500],
  ['mega','Kasino-König','Gewinne 50× den Einsatz',2000],
  ['fs','Alge! Alge!','Löse Freispiele aus',500],
  ['hw','Drachenhort','Löse Hold & Win aus',750],
  ['jp','Jackpot-Krone!','Treffe einen Jackpot',1500],
  ['gamble','Leiter-Legende','Erreiche die Spitze der Risikoleiter',2500],
  ['tour','Spielhallen-Tour','Spiele alle fünf Automaten',400],
  ['s100','Stammgast','100 Drehungen',500],
  ['s1000','Palast-Inventar','1.000 Drehungen',3000],
];
function achHTML(){
  const done = ACH.filter(a => S.ach[a[0]]).length;
  return `<h3 style="margin:18px 0 8px">Erfolge <span class="num" style="color:var(--muted);font-weight:500">${done}/${ACH.length}</span></h3>
    <div class="ach">${ACH.map(a => `<div class="${S.ach[a[0]]?'done':''}"><b>${a[1]}</b>${a[2]} · +${fmt(a[3])}</div>`).join('')}</div>`;
}
function unlock(id){
  if(S.ach[id]) return;
  const a = ACH.find(x => x[0]===id); if(!a) return;
  S.ach[id] = Date.now(); S.balance += a[3];
  toast(`🏆 Erfolg: ${a[1]} · +${fmt(a[3])} Chips`);
}
function totalSpins(){ return Object.values(S.stats).reduce((s,x)=>s+x.spins,0); }
function checkAch(){
  const n = totalSpins();
  if(n>=1) unlock('spin1'); if(n>=100) unlock('s100'); if(n>=1000) unlock('s1000');
  if(['alge','frucht','sterne','drache','buch'].every(k => S.stats[k] && S.stats[k].spins>0)) unlock('tour');
}

/* ================= Statistik & Verlauf ================= */
function stat(mid){ return S.stats[mid] ||= {spins:0, wag:0, won:0, best:0, bestX:0, features:0}; }
function record(mid, bet, win, note){
  const st = stat(mid);
  st.spins++; st.wag += bet; st.won += win;
  if(win > st.best) st.best = win;
  S.history.unshift({m:mid, bet, win, t:Date.now(), note:note||''});
  if(S.history.length > 40) S.history.length = 40;
}

/* ================= Anzeige: Kopfzeile ================= */
let shownBal = S.balance;
function renderTop(){
  const el = $('#balance');
  if(shownBal !== S.balance){ el.classList.remove('bump'); void el.offsetWidth; if(S.balance > shownBal) el.classList.add('bump'); }
  shownBal = S.balance;
  el.textContent = fmt(S.balance);
  $('#soundBtn').setAttribute('aria-pressed', S.sound ? 'true':'false');
  $('#soundBtn').textContent = S.sound ? 'Ton an' : 'Ton aus';
}
function toast(t){
  const d = document.createElement('div'); d.textContent = t; $('#toast').appendChild(d);
  setTimeout(() => d.remove(), 3400);
}

/* ================= Lobby ================= */
function previewSyms(m){
  const pick = {
    alge:['king','algecan','trident','chest','ta'],
    frucht:['cherry','bell','seven','bar','grape'],
    sterne:['planet','gem','crown','star','wild'],
    drache:['lantern','dragon','coin','wild','envelope'],
    buch:['owl','hourglass','book','potion','fire']
  }[m.id];
  return pick.map(id => `<span>${m.sym[id].svg}</span>`).join('');
}
function renderLobby(){
  $('#machineCards').innerHTML = Object.values(MACHINES).map(m => {
    const st = S.stats[m.id];
    return `<article class="mcard m-${m.id}">
      <div class="photo"><span class="hype-ribbon">${m.badge}</span></div>
      <div class="preview">${previewSyms(m)}</div>
      <h2>${m.name}</h2>
      <p>${m.tagline}</p>
      <dl class="facts">
        <div><dt>Walzen</dt><dd>${m.cols}×${m.rows}</dd></div>
        <div><dt>Linien</dt><dd>${m.lines.length}</dd></div>
        <div><dt>Volatilität</dt><dd>${m.vol}</dd></div>
      </dl>
      <div class="tags">${m.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <p class="num" style="font-size:12.5px">${st ? `${fmt(st.spins)} Drehungen · Rekord ${fmt(st.best)}` : 'Noch unberührt · Krone wartet!'}</p>
      <button class="btn" data-open="${m.id}">${m.name} spielen</button>
    </article>`;
  }).join('');
  document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { location.hash = b.dataset.open; });

  const left = S.lastBonus + BONUS_MS - Date.now();
  $('#bonusAmt').textContent = 'bis ' + fmt(wheelVal(10000));
  if(left <= 0){ $('#bonusBtn').disabled = false; $('#bonusInfo').textContent = 'Bereit! Dreh das königliche Glücksrad.'; }
  else{
    $('#bonusBtn').disabled = true;
    const h = Math.floor(left/3600000), mi = Math.floor(left%3600000/60000);
    $('#bonusInfo').textContent = `Nächster Königs-Bonus in ${h} Std. ${mi} Min.`;
  }
  $('#refillBtn').hidden = S.balance >= BETS[0];


  const names = {alge:'ALGE – König der Meere', frucht:'Frucht-Express', sterne:'Sternenjuwelen', drache:'Drachenhort', buch:'Grimoire'};
  $('#histList').innerHTML = S.history.length
    ? S.history.slice(0,25).map(h => `<li><span>${names[h.m]||h.m}${h.note?` · <span style="color:var(--gold)">${h.note}</span>`:''}</span><span class="num l">${h.bet?'−'+fmt(h.bet):'frei'}</span><span class="num ${h.win?'w':'l'}">${h.win?'+'+fmt(h.win):'0'}</span></li>`).join('')
    : '';
  if(!S.history.length) $('#histList').innerHTML = '<li class="empty" style="display:block">Noch keine Spiele. Starte oben mit ALGE – König der Meere!</li>';
}

const WHEEL = [500,1000,750,2500,1000,5000,750,1500,1000,10000,750,2000];
const WHEEL_W = {500:20,750:14,1000:12,1500:8,2000:6,2500:5,5000:2,10000:.7};
const WHEEL_COL = ['#8a1530','#2a1b4a','#0f4a3a','#5a1a5e'];
function wheelVal(v){ return v; }   // feste Werte
function wheelSVG(){
  const n = WHEEL.length, R = 148, C = 160; let g = '';
  WHEEL.forEach((v,i) => {
    const a0 = i/n*2*Math.PI - Math.PI/2, a1 = (i+1)/n*2*Math.PI - Math.PI/2, am = (a0+a1)/2;
    const big = v >= 5000;
    const col = v === 10000 ? 'url(#gGold)' : v === 5000 ? '#c4141c' : WHEEL_COL[i % 4];
    g += `<path d="M${C} ${C} L${(C+R*Math.cos(a0)).toFixed(1)} ${(C+R*Math.sin(a0)).toFixed(1)} A${R} ${R} 0 0 1 ${(C+R*Math.cos(a1)).toFixed(1)} ${(C+R*Math.sin(a1)).toFixed(1)}Z" fill="${col}" stroke="#fff1a8" stroke-width="2"/>`;
    const tx = C + R*.66*Math.cos(am), ty = C + R*.66*Math.sin(am);
    g += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" transform="rotate(${(am*180/Math.PI + 90).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})" text-anchor="middle" dominant-baseline="middle"
      font-family="Chivo Mono, monospace" font-weight="700" font-size="${big ? 19 : 16}" fill="${v === 10000 ? '#3a1a00' : '#fff6e0'}">${v >= 10000 ? '10K' : fmt(wheelVal(v))}</text>`;
  });
  let bulbs = '';
  for(let i=0;i<n*2;i++){ const a = i/(n*2)*2*Math.PI; bulbs += `<circle cx="${(C+154*Math.cos(a)).toFixed(1)}" cy="${(C+154*Math.sin(a)).toFixed(1)}" r="3.6" fill="${i%2?'#fffbe0':'#f2b63d'}"/>`; }
  return `<svg viewBox="0 0 320 320"><circle cx="${C}" cy="${C}" r="156" fill="#2a1521" stroke="url(#gGold)" stroke-width="9"/>${g}${bulbs}
    <circle cx="${C}" cy="${C}" r="40" fill="url(#gGoldR)" stroke="#8a5a10" stroke-width="2"/></svg>`;
}
function openWheel(){
  if(S.lastBonus + BONUS_MS > Date.now()) return;
  Sfx.init();
  const n = WHEEL.length, seg = 360 / n;
  const ov = $('#overlay');
  ov.innerHTML = `<div class="rays"></div><div class="wheelbox">
    <div class="eyebrow">👑 KÖNIGLICHES GLÜCKSRAD</div><h2>Dreh am Rad!</h2>
    <div class="wheel"><div class="wpointer" id="wptr"></div><div class="wrot" id="wrot">${wheelSVG()}</div><button class="wbtn" id="wspin">DREH</button></div>
    <div class="wamt" id="wamt"></div><p class="lead" id="wmsg" style="margin:0">Hauptgewinn 10K · Ein Dreh alle 24 Stunden.</p></div>`;
  ov.hidden = false;
  const rot = $('#wrot'), btn = $('#wspin');
  btn.onclick = () => {
    btn.disabled = true; btn.textContent = '…';
    const idx = pick(WHEEL.map((v,i) => [i, WHEEL_W[v]]));
    const target = 360*8 - (idx + .5)*seg + (Math.random() - .5)*seg*.7;
    const dur = reduced ? 300 : 7000;
    rot.style.transition = `transform ${dur}ms cubic-bezier(.08,.75,.06,1)`;
    rot.style.transform = `rotate(${target}deg)`;
    let lastSeg = -1, done = false;
    const watch = () => {
      if(done) return;
      const mt = new DOMMatrix(getComputedStyle(rot).transform);
      const ang = Math.atan2(mt.b, mt.a) * 180 / Math.PI;
      const sIdx = Math.floor((((-ang) % 360) + 360) % 360 / seg);
      if(sIdx !== lastSeg){
        lastSeg = sIdx; Sfx.wheelTick();
        const p = $('#wptr'); p.classList.remove('wob'); void p.offsetWidth; p.classList.add('wob');
        $('#wamt').textContent = WHEEL[sIdx] >= 10000 ? '10K?!' : fmt(wheelVal(WHEEL[sIdx]));
      }
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
    setTimeout(() => {
      done = true;
      const amt = wheelVal(WHEEL[idx]);
      S.lastBonus = Date.now(); S.balance += amt; save();
      $('#wamt').textContent = '+' + fmt(amt);
      $('#wmsg').textContent = amt >= wheelVal(5000) ? '👑 WAHNSINN! RIESENGEWINN AM KÖNIGSRAD!' : 'Sauber abgeräumt! Morgen wieder drehen.';
      flash(); shake(); Sfx.big(); FX.fountain(amt >= wheelVal(5000) ? 130 : 65);
      FX.fly($('#wrot'), $('#balance').parentElement, 24);
      if(amt >= wheelVal(5000)) setTimeout(() => { Sfx.tierUp(); FX.burst(innerWidth/2, innerHeight/2, 130); flash(); }, 500);
      renderTop();
      btn.disabled = false; btn.textContent = 'OK';
      btn.onclick = () => { ov.hidden = true; ov.innerHTML = ''; renderLobby(); };
    }, dur + 120);
  };
}
$('#bonusBtn').onclick = openWheel;
$('#refillBtn').onclick = () => {
  if(S.balance >= BETS[0]) return;
  S.balance += 1000; S.refills++; save(); toast('👑 Königs-Nachschub: +1.000 Chips'); renderTop(); renderLobby();
};

/* ================= Automat ================= */
const UI = {cur:null, busy:false, auto:0, turbo:false, fs:{left:0,total:0,win:0,bet:0}, gamble:null};
const win = $('#window');
let svg;

function curM(){ return MACHINES[UI.cur]; }
function bet(){ return UI.fs.left > 0 || UI.fs.active ? UI.fs.bet : BETS[S.betIdx[UI.cur]]; }

function cellHTML(m, cell, extraCls=''){
  if(cell.id === 'blank') return `<div class="cell blank ${extraCls}"><span class="g">·</span></div>`;
  const s = m.sym[cell.id];
  let lbl = '';
  if(cell.id === m.coin){
    lbl = typeof cell.v === 'number' ? `<span class="lbl">${fmt(cell.v * bet())}</span>` : `<span class="lbl jpl">${cell.v}</span>`;
  }
  const tile = (TILE[m.id] || {})[cell.id];
  return `<div class="cell sym-${cell.id} ${extraCls}" data-id="${cell.id}"><span class="g svg${tile ? ' tile ' + tile : ''}">${s.svg}</span>${lbl}</div>`;
}
function buildWindow(m){
  win.style.setProperty('--cols', m.cols);
  win.style.setProperty('--rows', m.rows);
  const g = generate(m);
  win.innerHTML = g.map(col => `<div class="reel"><div class="strip">${col.map(c=>cellHTML(m,c)).join('')}</div></div>`).join('')
    + `<svg class="lines" aria-hidden="true"></svg>`;
  svg = win.querySelector('svg.lines');   // nur die Linien-Ebene, nicht die Symbolgrafiken in den Feldern
}
function cellEl(c, r){ return win.querySelectorAll('.reel')[c].querySelector('.strip').children[r]; }

function teasePlan(m, grid){
  const t = Array(m.cols).fill(null);
  if(m.scatter){
    let n = 0;
    for(let c=0;c<m.cols;c++){
      if(n >= 2) t[c] = n >= 3 ? `${n} ${m.scatterPl.toUpperCase()}!! JEDES WEITERE ZAHLT MEHR!!` : `🔥 NOCH EIN ${mini(m.sym[m.scatter])}!! KOMM SCHON!!`;
      n += grid[c].filter(x => x.id === m.scatter).length;
    }
  }
  if(m.coin){
    let n = 0;
    for(let c=0;c<m.cols;c++){
      const rem = (m.cols - c) * m.rows;
      if(n >= 3 && n < m.coinTrigger && n + rem >= m.coinTrigger) t[c] = `🪙 ${n} MÜNZEN … NOCH ${m.coinTrigger - n} BIS HOLD & WIN!!`;
      n += grid[c].filter(x => x.id === m.coin).length;
    }
  }
  const hi = m.hiSyms || [];
  for(let c=(m.cols===3?2:3); c<m.cols; c++){
    if(t[c]) continue;
    for(const ln of m.lines){
      const ids = ln.slice(0,c).map((r,cc) => grid[cc][r].id);
      const res = evalLine(ids, m.pays, m.wild);
      if(res.count === c && hi.includes(res.sym)){ t[c] = `${Array(c).fill(mini(m.sym[res.sym])).join('')} … DIE LETZTE WALZE MUSS KOMMEN!!`; break; }
      if(m.mixPay && ids.every(i => i==='bar' || i==='seven')){ t[c] = 'BAR · 7 … DIE DRITTE WALZE ENTSCHEIDET!!'; break; }
    }
  }
  return t;
}
function animateGrid(m, grid){
  const reels = [...win.querySelectorAll('.reel')];
  const h = reels[0].clientHeight / m.rows;
  const fast = UI.turbo || reduced;
  const tease = teasePlan(m, grid);
  const base = fast ? 320 : 620, step = fast ? 90 : 230, tMs = fast ? 1050 : 1950;
  const stops = []; let t = base;
  for(let c=0;c<m.cols;c++){ if(c > 0) t += step; if(tease[c]) t += tMs; stops.push(t); }
  const cab = win.closest('.cabinet'); cab.classList.add('spinning');
  let landed = 0, teasedOnce = false;
  return Promise.all(reels.map((reel, c) => {
    const strip = reel.querySelector('.strip');
    const nFill = Math.max(5, Math.round(stops[c] / (fast ? 60 : 50)));
    let fill = ''; for(let i=0;i<nFill;i++) fill += cellHTML(m, genCell(m,c));
    const finalH = grid[c].map(cell => cellHTML(m, cell)).join('');
    const current = strip.innerHTML;
    strip.style.transition = 'none';
    strip.innerHTML = finalH + fill + current;
    strip.style.transform = `translateY(${-(nFill + m.rows) * h}px)`;
    void strip.offsetHeight;
    const dur = stops[c];
    strip.style.transition = `transform ${dur}ms ${tease[c] ? 'cubic-bezier(.3,.55,.15,1.02)' : 'cubic-bezier(.25,.65,.35,1.06)'}`;
    if(!reduced) strip.classList.add('blur');
    strip.style.transform = 'translateY(0px)';
    setTimeout(() => strip.classList.remove('blur'), dur * (tease[c] ? .7 : .78));
    if(tease[c]){
      const startAt = c > 0 ? stops[c-1] : 0;
      setTimeout(() => {
        reel.classList.add('tease'); if(!reduced) win.classList.add('tension');
        $('#msg').innerHTML = `<div class="teaser">${tease[c]}</div>`;
        Sfx.rise(dur - startAt);
        setHype(hypeVal + 18);
        if(!teasedOnce){ teasedOnce = true; pushChat('tease'); }
      }, startAt + 30);
    }
    return new Promise(res => setTimeout(() => {
      strip.style.transition = 'none';
      strip.innerHTML = finalH;
      strip.style.transform = 'translateY(0)';
      reel.classList.remove('tease');
      win.classList.remove('tension');
      Sfx.stop(c);
      grid[c].forEach((cell, r) => {
        if(cell.id !== m.scatter && cell.id !== m.coin && cell.id !== m.wild) return;
        const el = strip.children[r]; el.classList.add('land');
        burstAt(el, cell.id === m.wild ? 16 : 30);
        if(cell.id === m.scatter){ landed++; Sfx.scatter(landed); }
        else if(cell.id === m.coin) Sfx.coin(); else Sfx.wildLand();
      });
      if(c === m.cols - 1) cab.classList.remove('spinning');
      res();
    }, dur + 20));
  }));
}
function nearMiss(m, grid){
  if(m.scatter){ const n = grid.flat().filter(x => x.id === m.scatter).length; if(n === 2) return `😱 SO KNAPP! 2 von 3 ${m.scatterDat} – fast wäre die Hütte explodiert!`; }
  if(m.coin){ const n = grid.flat().filter(x => x.id === m.coin).length; if(n >= 4 && n < m.coinTrigger) return `😱 SO KNAPP! ${n} von ${m.coinTrigger} Münzen!`; }
  if(teasePlan(m, grid).some(Boolean)) return '😬 KNAPP DANEBEN! Die letzte Walze wollte noch nicht!';
  return '';
}

const LINE_COLORS = ['#fff1a8','#ff477e','#7fd6ff','#18d968','#c9a7ff','#ff9f43','#5ef1d6','#ff7ae0','#f5f5a0','#9ad0ff'];
function clearWins(){
  win.classList.remove('dim');
  win.querySelectorAll('.cell.win').forEach(e => e.classList.remove('win'));
  if(svg) svg.innerHTML = '';
  $('#msg').innerHTML = '';
}
function showWins(m, res, mult){
  const cells = new Set();
  res.wins.forEach(w => w.cells.forEach(([c,r]) => cells.add(c+','+r)));
  if(res.scatter) res.scatter.cells.forEach(([c,r]) => cells.add(c+','+r));
  if(!cells.size) return;
  win.classList.add('dim');
  cells.forEach(k => { const [c,r] = k.split(',').map(Number); cellEl(c,r).classList.add('win'); });
  const wr = win.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${wr.width} ${wr.height}`);
  svg.innerHTML = res.wins.map(w => {
    const pts = m.lines[w.line].map((r,c) => {
      const b = cellEl(c,r).getBoundingClientRect();
      return `${(b.left - wr.left + b.width/2).toFixed(1)},${(b.top - wr.top + b.height/2).toFixed(1)}`;
    }).join(' ');
    return `<polyline points="${pts}" pathLength="1" style="animation-delay:${(w.line % 10)*70}ms" stroke="${LINE_COLORS[w.line % LINE_COLORS.length]}"/>`;
  }).join('');
  const chips = res.wins.map(w => {
    const s = w.sym === 'mix' ? 'BAR/7 gemischt' : `${w.count}× ${mini(m.sym[w.sym])}`;
    return `<span>Linie ${w.line+1} · ${s} · <b class="num">${fmt(w.amt*mult)}</b></span>`;
  });
  if(res.scatter) chips.push(`<span>${res.scatter.count}× ${mini(m.sym[m.scatter])} Scatter · <b class="num">${fmt(res.scatter.amt*mult)}</b></span>`);
  $('#msg').innerHTML += `<div class="wins">${chips.join('')}</div>`;
}
function setMsg(html){ $('#msg').innerHTML = `<div class="main">${html}</div>` + ($('#msg').querySelector('.wins')?.outerHTML || ''); }

function updateControls(){
  const m = curM(); if(!m) return;
  const b = bet();
  $('#betVal').textContent = fmt(BETS[S.betIdx[m.id]]);
  $('#roBet').textContent = fmt(b);
  $('#roLines').textContent = m.lines.length;
  const lock = UI.busy || UI.fs.left > 0 || UI.fs.active || UI.auto > 0 || !!UI.gamble;
  $('#betDown').disabled = lock || S.betIdx[m.id] === 0;
  $('#betUp').disabled = lock || S.betIdx[m.id] === BETS.length-1;
  $('#maxBet').disabled = lock;
  $('#autoSel').disabled = UI.fs.left > 0 || UI.fs.active;
  const sp = $('#spinBtn');
  if(UI.auto > 0){ sp.textContent = 'STOP'; sp.classList.add('stop'); sp.disabled = false; }
  else { sp.textContent = UI.fs.left > 0 || UI.fs.active ? 'FREI' : 'START'; sp.classList.remove('stop'); sp.disabled = UI.busy || UI.fs.active || !!UI.gamble; }
  $('#backBtn').disabled = UI.busy || UI.fs.left > 0 || UI.fs.active;
  document.querySelector('.cabinet').classList.toggle('hot', UI.fs.left > 0 || !!UI.fs.active);
  const fb = $('#fsbar');
  if(UI.fs.left > 0 || UI.fs.active){
    fb.hidden = false;
    fb.innerHTML = `<span>🔥 KÖNIGS-FREISPIELE: <b class="num">${UI.fs.left}</b> übrig · ${m.expanding && UI.fs.sym ? `Spezialsymbol ${mini(m.sym[UI.fs.sym])} · ` : ''}Multiplikator <b class="num">×${UI.fs.mult || 1}</b></span><span>Summe <b class="num">${fmt(UI.fs.win)}</b></span>`;
  } else fb.hidden = true;
  if(m.id === 'drache'){
    $('#jackpots').hidden = false;
    $('#jpMINI').textContent = fmt(m.jpMult.MINI * b);
    $('#jpMINOR').textContent = fmt(m.jpMult.MINOR * b);
    $('#jpMAJOR').textContent = fmt(m.jpMult.MAJOR * b);
    $('#jpGRAND').textContent = fmt(S.grand);
  } else $('#jackpots').hidden = true;
}

function openMachine(id){
  const m = MACHINES[id]; if(!m) return showLobby();
  endGamble();
  UI.cur = id; UI.auto = 0; UI.fs = {left:0,total:0,win:0,bet:0,active:false};
  $('#autoSel').value = '0';
  $('#lobby').hidden = true; $('#machine').hidden = false;
  $('#machine').className = 'm-' + id;
  $('#bgphoto').classList.add('machine');
  $('#mTitle').textContent = m.name; $('#mMarquee').textContent = m.name;
  $('#roWin').textContent = '0';
  setHype(22);
  buildWindow(m);
  $('#msg').innerHTML = `<div class="main" style="color:var(--muted);font-weight:500">${m.tagline}</div>`;
  updateControls(); renderTop();
  scrollTo(0,0);
}
function showLobby(){
  endGamble();
  UI.cur = null; UI.auto = 0;
  $('#machine').hidden = true; $('#lobby').hidden = false;
  $('#bgphoto').classList.remove('machine');
  renderLobby(); renderTop();
}
function route(){
  const h = location.hash.slice(1);
  if(MACHINES[h]) { if(UI.cur !== h) openMachine(h); }
  else showLobby();
}
window.addEventListener('hashchange', () => {
  if(UI.busy || UI.fs.left > 0 || UI.fs.active){ if(UI.cur && location.hash.slice(1) !== UI.cur) location.hash = UI.cur; return; }
  route();
});

/* ---------- Drehen ---------- */
async function spin(){
  const m = curM(); if(!m || UI.busy || UI.gamble) return;
  Sfx.init();
  const free = UI.fs.left > 0;
  const b = free ? UI.fs.bet : BETS[S.betIdx[m.id]];
  if(!free){
    if(S.balance < b){
      UI.auto = 0; $('#autoSel').value = '0'; updateControls();
      setMsg(S.balance < BETS[0] ? 'Keine Chips mehr! In der Lobby wartet Gratis-Nachschub.' : 'Zu wenig Chips für diesen Einsatz. Senke den Einsatz.');
      Sfx.lose(); return;
    }
    S.balance -= b;
    if(m.id === 'drache') S.grand += b * m.grandRate;
    if(UI.auto > 0){ UI.auto--; }
  } else {
    UI.fs.left--; UI.fs.active = true;
  }
  UI.busy = true; clearWins(); $('#roWin').textContent = '0';
  updateControls(); renderTop();
  Sfx.spin();
  if(Math.random() < 0.45) pushChat('spin');

  const grid = Tune.generate(m, b);   // [Quoten-Regler] Standard = normales generate()
  await animateGrid(m, grid);
  const res = evaluate(m, grid, b);
  const mult = free ? (UI.fs.mult || 1) : 1;   // Freispiel-Multiplikator
  let total = res.total * mult;
  let note = free ? 'Freispiel' : '';

  if(total > 0){ showWins(m, res, mult); Sfx.win(); celebrateCells(); }
  if(free && m.expanding && UI.fs.sym){
    const ex = expandWin(m, grid, b, UI.fs.sym);
    if(ex.amt > 0){ await showExpand(m, {...ex, amt: ex.amt * mult}, UI.fs.sym); total += ex.amt * mult; Sfx.big(); }
  }

  // ---- Freispiel-Multiplikator: jeder Gewinn erhöht ihn (bis fsMultMax) ----
  if(free){
    const before = UI.fs.mult || 1;
    UI.fs.mult = fsMultNext(m, before, total > 0);
    if(UI.fs.mult > before){ Sfx.ladderUp(); updateControls(); if(window.gpMultUp) gpMultUp(UI.fs.mult); }
  }

  // ---- Hold & Win ----
  if(res.coins){
    stat(m.id).features++;
    unlock('hw');
    setHype(95);
    const hw = await holdAndWin(m, grid, b);
    total += hw.total;
    note = hw.grand ? 'GRAND-Jackpot!' : 'Hold & Win';
  }

  // ---- Freispiele ----
  let fsStart = false;
  if(res.scatter && res.scatter.spins){
    stat(m.id).features++;
    unlock('fs');
    setHype(92);
    if(free){
      const add = Math.max(0, Math.min(res.scatter.spins, FS_CAP - UI.fs.total));   // Obergrenze pro Bonusrunde
      if(add > 0){ UI.fs.left += add; UI.fs.total += add; toast(`🔥 RETRIGGER! +${add} Freispiele!`); pushChat('big', 'CHAT_RASTET_AUS', `RETRIGGER +${add} SPINS!! 🔥🔥`); }
    }
    else { UI.fs = {left:res.scatter.spins, total:res.scatter.spins, win:0, bet:b, active:false, sym: m.expanding ? chooseExpand(m) : null, mult: m.fsMultStart || 1}; fsStart = true; }
    note = note || 'Freispiele';
  }

  if(free) UI.fs.win += total;
  S.balance += total;
  record(m.id, free ? 0 : b, total, note);
  if(total > 0){ unlock('win1'); UI.streak = (UI.streak || 0) + 1; } else UI.streak = 0;
  const x = total / b;
  const st = stat(m.id); if(x > st.bestX) st.bestX = x;
  rollWin(total);

  if(total > 0){
    setHype(hypeVal + Math.min(35, 10 + x * 2));
    if(x >= 10) pushChat('big'); else if(x >= 2) pushChat('win');
    const parts = [`👑 ES SCHEPPERT: <span class="num">${fmt(total)}</span>`];
    if(free && mult > 1) parts.push(`<span class="multtag">×${mult} Multiplikator</span>`);
    if(UI.streak >= 2) parts.push(`<span class="streak">Serie ×${UI.streak} 🔥</span>`);
    setMsg(parts.join(' '));
  } else if(!res.coins){
    setHype(hypeVal - 6);
    const nm = nearMiss(m, grid);
    setMsg(nm ? `<span class="nm">${nm}</span>` : free ? 'Noch kein Treffer in diesem Freispiel – weiter!' : '<span style="color:var(--muted);font-weight:500">Kein Gewinn. Nächster Dreh für die Krone!</span>');
  }
  renderTop(); checkAch(); save();
  if(total > 0){
    FX.fly(win, $('#balance').parentElement, Math.min(44, 7 + Math.round(x * 1.6)));
    const cab = document.querySelector('.cabinet'); cab.classList.add('winning'); setTimeout(() => cab.classList.remove('winning'), 1600);
  }

  if(x >= 15) await bigWin(total, x);
  else if(x >= 3) await midWin(total, x);

  if(fsStart){
    flash(); shake();
    win.querySelectorAll(`.cell[data-id="${m.scatter}"]`).forEach((el,i) => setTimeout(() => { burstAt(el, 55); Sfx.scatter(i+1); }, i*180));
    await sleep(reduced ? 100 : 1200);
    Sfx.feature();
    if(m.expanding){
      await expandReveal(m, UI.fs.sym);
      await banner(`ALGE! ${res.scatter.spins} FREISPIELE!`, `${m.sym[UI.fs.sym].n} breitet sich über ganze Walzen aus. Jeder Gewinn erhöht den Multiplikator bis ×${m.fsMultMax}!`, 2500);
    } else await banner(`${res.scatter.spins} KÖNIGS-FREISPIELE!`, `Multiplikator startet bei ×1 und steigt mit jedem Gewinn bis ×${m.fsMultMax}!`, 2300);
    updateControls();
  }
  let fsRoundWin = null;   // Summe einer gerade beendeten Freispielrunde
  if(free && UI.fs.left === 0){
    UI.fs.active = false;
    const fw = UI.fs.win;
    fsRoundWin = fw;
    await banner('FREISPIELE BEENDET', `Gesamtbeute: ${fmt(fw)} Chips aus ${UI.fs.total} Freispielen · Multiplikator am Ende ×${UI.fs.mult || 1}`, 2800);
    UI.fs = {left:0,total:0,win:0,bet:0,active:false,mult:1};
  }

  UI.busy = false;

  // Spielhallen-Risiko (Risikoleiter & Kartenrisiko) nach manuellem Gewinn, sonst direkt in die Bestenliste
  const roundEnded = fsRoundWin !== null;
  const riskAmount = roundEnded ? fsRoundWin : total;
  const riskType = roundEnded ? 'Freispiele' : (res.coins ? 'Hold & Win' : 'Gewinn');
  let gambling = false;
  if(m.gamble && riskAmount > 0 && UI.auto === 0 && UI.fs.left === 0 && UI.cur === m.id){
    gambling = startGamble(riskAmount, b, riskType);
  }
  if(!gambling && window.GPScores){
    if(roundEnded){ if(fsRoundWin > 0) GPScores.add({m:m.id, amount:fsRoundWin, bet:b, type:'Freispiele'}); }
    else if(!free && total > 0) GPScores.add({m:m.id, amount:total, bet:b, type:riskType});
  }
  updateControls();

  if(UI.cur !== m.id) return;
  if(UI.fs.left > 0){ setTimeout(spin, UI.turbo ? 350 : 800); }
  else if(UI.auto > 0){
    setTimeout(() => { if(UI.auto > 0) spin(); else updateControls(); }, total > 0 ? (UI.turbo ? 600 : 1200) : (UI.turbo ? 150 : 400));
  } else { $('#autoSel').value = '0'; updateControls(); }
}

/* ---------- Hold & Win ---------- */
async function holdAndWin(m, grid, b){
  flash(); shake();
  grid.forEach((col,c) => col.forEach((cell,r) => { if(cell.id === m.coin) setTimeout(() => { burstAt(cellEl(c,r), 34); Sfx.coin(); }, (c*m.rows + r)*60); }));
  await sleep(reduced ? 100 : 1100);
  Sfx.feature();
  await banner('HOLD & WIN · GOLDRAUSCH!', 'Münzen kleben fest! 3 Respins – jede neue Münze setzt zurück. Volles Feld = GRAND-KRONE!', 2500);
  const N = m.cols * m.rows;
  const locked = Array(N).fill(null);
  grid.forEach((col,c) => col.forEach((cell,r) => { if(cell.id === m.coin) locked[c*m.rows + r] = cell; }));
  clearWins();
  const render = (fresh=[]) => {
    win.querySelectorAll('.reel').forEach((reel, c) => {
      reel.querySelector('.strip').innerHTML = Array.from({length:m.rows}, (_,r) => {
        const i = c*m.rows + r, cell = locked[i];
        return cell ? cellHTML(m, cell, 'locked' + (fresh.includes(i) ? ' new' : '')) : cellHTML(m, {id:'blank'});
      }).join('');
    });
  };
  render();
  let respins = 3;
  const fb = $('#fsbar');
  const upd = () => {
    const have = locked.filter(Boolean).length;
    win.classList.toggle('tension', respins === 1 && !reduced);
    $('#msg').innerHTML = respins === 1 ? '<div class="teaser">⚡ LETZTER RESPIN!! JETZT ODER NIE!!</div>' : `<div class="teaser">🪙 ${have} MÜNZEN · NOCH ${N - have} BIS GRAND!!</div>`;
    fb.hidden = false; fb.innerHTML = `<span>Hold &amp; Win · Respins: <b class="num">${respins}</b></span><span>Münzen <b class="num">${locked.filter(Boolean).length}</b>/${N}</span>`; };
  upd();
  while(respins > 0 && locked.some(x => !x)){
    await sleep(UI.turbo ? 250 : 500);
    const t0 = performance.now(), flickMs = UI.turbo || reduced ? 300 : 700;
    while(performance.now() - t0 < flickMs){
      win.querySelectorAll('.reel').forEach((reel, c) => {
        [...reel.querySelector('.strip').children].forEach((el, r) => {
          if(!locked[c*m.rows + r]){ const cell = genCell(m, c); el.outerHTML = cellHTML(m, cell.id===m.coin?{id:'j'}:cell, 'flick'); }
        });
      });
      Sfx.tick();
      await sleep(70);
    }
    const added = respinStep(m, locked);
    render(added);
    if(added.length){
      respins = 3; flash(.38);
      added.forEach((i,k) => setTimeout(() => { Sfx.coin(); burstAt(cellEl(Math.floor(i/m.rows), i % m.rows), 32); }, k*90));
    }
    else respins--;
    upd();
  }
  const full = locked.every(Boolean);
  let total = 0; const hits = new Set();
  for(const cell of locked){
    if(!cell) continue;
    total += coinAmount(m, cell.v, b);
    if(typeof cell.v === 'string') hits.add(cell.v);
  }
  let grand = 0;
  if(full){ grand = Math.round(S.grand); total += grand; S.grand = m.grandSeed; hits.add('GRAND'); }
  hits.forEach(j => { const el = document.querySelector(`.jp[data-jp="${j}"]`); if(el){ el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); } });
  if(hits.size) unlock('jp');
  win.classList.remove('tension');
  let run = 0;
  for(let i=0;i<N;i++){
    const cell = locked[i]; if(!cell) continue;
    run += coinAmount(m, cell.v, b);
    const el = cellEl(Math.floor(i/m.rows), i % m.rows);
    el.classList.add('win'); burstAt(el, 18); Sfx.coin();
    $('#roWin').textContent = fmt(run);
    await sleep(UI.turbo || reduced ? 40 : 130);
  }
  win.classList.add('dim');
  fb.hidden = true;
  $('#msg').innerHTML = `<div class="main">👑 HOLD &amp; WIN BEUTE: <span class="num">${fmt(total)}</span>${hits.size ? ' · JACKPOT: ' + [...hits].join(', ') : ''}</div>`;
  Sfx.big();
  if(full) await banner('👑 GRAND JACKPOT!!', `${fmt(grand)} Chips aus dem Königstopf! Der Palast verneigt sich!`, 3200);
  await sleep(900);
  return {total, grand: !!full};
}

/* ---------- Spielhallen-Risikoleiter & Kartenrisiko ---------- */
let ladderTimer = null;
let ladderBlinkHigh = true;

/* ===== Risikoleiter =====
   Feste Stufen in Vielfachen des Einsatzes. Man steigt mit der höchsten Stufe ein, die der Gewinn
   erreicht; der Rest ist sofort gesichert. Chance pro Stufe = aktueller Wert ÷ nächster Wert
   (eine faire Leiter). Der Quoten-Regler im Admin-Panel kann die Chance verändern. */
const LADDER_X = [1, 2, 3, 5, 8, 12, 20, 30, 50, 80, 125, 200, 300, 500, 1000];
function buildLadderLevels(bet){ return [0, ...LADDER_X.map(x => Math.round(x * bet))]; }
function ladderEntryIdx(levels, amount){ let i = 0; for(let k = 1; k < levels.length; k++) if(levels[k] <= amount) i = k; return i; }
function ladderChance(g){
  const top = g.levels.length - 1;
  if(g.lIdx >= top || g.stake <= 0) return 0;
  const fair = g.stake / g.levels[g.lIdx + 1];
  return Math.max(0, Math.min(1, fair * (Tune.gambleP(UI.cur) / 0.5)));
}

function startGamble(amount, bet, type){
  clearInterval(ladderTimer);
  bet = bet || BETS[S.betIdx[UI.cur]];
  const levels = buildLadderLevels(bet);
  const lIdx = ladderEntryIdx(levels, amount);
  if(lIdx < 1) return false;   // kleiner als die unterste Stufe: kein Risiko, Gewinn wird direkt verbucht
  UI.gamble = {
    mode: 'ladder', type: type || 'Gewinn', bet, orig: amount,
    stake: levels[lIdx], banked: amount - levels[lIdx],
    step: 0, hist: [], levels, lIdx, lock: false
  };
  $('#gamble').hidden = false;
  $('#gCard').className = 'pcard'; $('#gCard').textContent = '?';
  setGambleTab('ladder');
  Sfx.init(); Sfx.ladderUp();
  setTimeout(() => { const r = document.querySelector('#ladderSteps .lrung.cur'); if(r) r.scrollIntoView({block:'center', behavior: reduced ? 'auto' : 'smooth'}); }, 60);
  return true;
}

function setGambleTab(mode){
  const g = UI.gamble; if(!g || g.lock) return;
  if(mode === 'ladder' && g.mode === 'card'){
    // Nach dem Kartenrisiko zurück auf die Leiter: höchste Stufe, die der Betrag erreicht
    const i = ladderEntryIdx(g.levels, g.stake);
    if(i < 1){ toast('Für die Leiter ist der Betrag zu klein.'); return; }
    g.banked += g.stake - g.levels[i]; g.stake = g.levels[i]; g.lIdx = i;
  }
  g.mode = mode;
  $('#tabLadder').classList.toggle('active', mode === 'ladder');
  $('#tabCard').classList.toggle('active', mode === 'card');
  $('#tabLadder').setAttribute('aria-selected', mode === 'ladder');
  $('#tabCard').setAttribute('aria-selected', mode === 'card');
  $('#viewLadder').hidden = mode !== 'ladder';
  $('#viewCard').hidden = mode !== 'card';
  if(mode === 'ladder'){
    renderLadder();
    startLadderBlink();
  } else {
    clearInterval(ladderTimer);
    renderCardRisk();
  }
}

function startLadderBlink(){
  clearInterval(ladderTimer);
  ladderBlinkHigh = true;
  ladderTimer = setInterval(() => {
    if(!UI.gamble || UI.gamble.mode !== 'ladder' || UI.gamble.lock) return;
    ladderBlinkHigh = !ladderBlinkHigh;
    if(!reduced) Sfx.ladderTick(ladderBlinkHigh);
    updateLadderBlinkDOM();
  }, 260);
}

function updateLadderBlinkDOM(){
  const g = UI.gamble; if(!g) return;
  const nextIdx = Math.min(g.levels.length - 1, g.lIdx + 1);
  document.querySelectorAll('#ladderSteps .lrung').forEach(row => {
    const idx = Number(row.dataset.idx);
    row.classList.toggle('blink-on', g.lIdx < g.levels.length - 1 && ((ladderBlinkHigh && idx === nextIdx) || (!ladderBlinkHigh && idx === 0)));
  });
}

function renderLadder(){
  const g = UI.gamble; if(!g) return;
  const top = g.levels.length - 1;
  let html = '';
  for(let i = top; i >= 0; i--){
    const cls = ['lrung', i === 0 ? 'zero' : i < g.lIdx ? 'below' : i === g.lIdx ? 'cur' : 'above'];
    if(i === top) cls.push('top');
    const label = i === 0 ? 'Absturz' : `${fmt(LADDER_X[i - 1])}×`;
    html += `<div class="${cls.join(' ')}" data-idx="${i}"><span class="lx">${label}</span><span class="lv num">${fmt(g.levels[i])}</span></div>`;
  }
  $('#ladderSteps').innerHTML = html;
  $('#lStake').textContent = fmt(g.stake);
  $('#lNext').textContent = g.lIdx >= top ? 'Spitze erreicht' : fmt(g.levels[g.lIdx + 1]);
  $('#lChance').textContent = g.lIdx >= top ? '–' : Math.round(ladderChance(g) * 100) + ' %';
  $('#lBank').textContent = fmt(g.banked);
  $('#lType').textContent = g.type;
  $('#lRiskBtn').disabled = g.lock || g.lIdx >= top;
  $('#lSplitBtn').disabled = g.lock || g.lIdx <= 1;
  $('#lTakeBtn').disabled = g.lock;
  $('#tabCard').disabled = g.lock;
  updateLadderBlinkDOM();
  updateControls();
}

async function ladderSuspense(){
  if(reduced) return;
  for(let i = 0; i < 7; i++){
    ladderBlinkHigh = !ladderBlinkHigh;
    updateLadderBlinkDOM();
    Sfx.ladderTick(ladderBlinkHigh);
    await sleep(60 + i * 22);
  }
}

async function ladderRisk(){
  const g = UI.gamble; if(!g || g.lock || g.mode !== 'ladder') return;
  const top = g.levels.length - 1;
  if(g.lIdx >= top) return;
  g.lock = true;
  clearInterval(ladderTimer);
  Sfx.init();
  if(g.lIdx >= 7) Sfx.heartbeat();
  renderLadder();
  const p = ladderChance(g);
  await ladderSuspense();
  const up = rnd() < p;
  const st = stat(UI.cur);
  S.balance -= g.stake;   // der Einsatz geht in die Leiter
  const box = $('#ladderSteps');
  if(up){
    g.lIdx++;
    const newStake = g.levels[g.lIdx];
    st.won += newStake - g.stake;
    g.stake = newStake;
    S.balance += g.stake;
    Sfx.ladderUp();
    setHype(hypeVal + 10);
    $('#roWin').textContent = fmt(g.stake + g.banked);
    box.classList.remove('climb', 'crash'); void box.offsetWidth; box.classList.add('climb');
    if(g.lIdx >= top){
      unlock('gamble'); S.gambleWins++;
      flash(.8); shake(); Sfx.big(); FX.fountain(110);
      setMsg(`👑 LEITER-SPITZE! <span class="num">${fmt(g.stake)}</span> CHIPS!`);
      pushChat('big', 'LeiterKönig', 'GANZ OBEN AUF DER LEITER!! 👑🔥');
      save(); renderTop(); renderLadder();
      await sleep(1600); endGamble(); return;
    }
    setMsg(`⚡ HOCH AUF <span class="num">${fmt(g.stake)}</span>!`);
    save(); renderTop(); g.lock = false; renderLadder(); startLadderBlink();
  } else {
    const lost = g.stake;
    st.won -= lost;
    ladderBlinkHigh = false;
    g.stake = 0; g.lIdx = 0;
    box.classList.remove('climb', 'crash'); void box.offsetWidth; box.classList.add('crash');
    Sfx.lose();
    $('#roWin').textContent = fmt(g.banked);
    setMsg(`💀 Abgestürzt! ${fmt(lost)} verloren.${g.banked > 0 ? ` Gesichert bleiben <span class="num">${fmt(g.banked)}</span>.` : ''}`);
    S.history.unshift({m:UI.cur, bet:0, win:0, t:Date.now(), note:`Leiter abgestürzt (−${fmt(lost)})`});
    save(); renderTop(); renderLadder();
    await sleep(1200); endGamble();
  }
}

function ladderSplit(){
  const g = UI.gamble; if(!g || g.lock || g.mode !== 'ladder' || g.lIdx <= 1) return;
  Sfx.init();
  const prev = g.stake;
  g.lIdx--;
  g.stake = g.levels[g.lIdx];
  g.banked += prev - g.stake;
  Sfx.coin();
  toast(`½ Geteilt: ${fmt(prev - g.stake)} Chips gesichert, ${fmt(g.stake)} bleiben im Risiko.`);
  $('#roWin').textContent = fmt(g.stake + g.banked);
  save(); renderTop(); renderLadder();
}

function renderCardRisk(){
  const g = UI.gamble; if(!g) return;
  $('#gStake').textContent = fmt(g.stake);
  $('#gStep').textContent = Math.min(g.step + 1, 5);
  $('#gHist').innerHTML = g.hist.map(c => `<span class="${c.red?'red':''}">${c.s}</span>`).join('');
  updateControls();
}
async function gambleGuess(red){
  const g = UI.gamble; if(!g || g.lock) return;
  g.lock = true;
  Sfx.init();
  if(g.step >= 2) Sfx.heartbeat();
  const card = Tune.gambleCard(UI.cur, red);   // [Quoten-Regler] Standard 50 %
  const el = $('#gCard');
  el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
  await sleep(180);
  el.className = 'pcard face flip' + (card.red ? ' red' : ''); el.textContent = card.s;
  g.hist.push(card);
  S.balance -= g.stake;
  const st = stat(UI.cur);
  if(card.red === red){
    S.balance += g.stake * 2; st.won += g.stake; g.stake *= 2; g.step++;
    Sfx.win();
    setHype(hypeVal + 15);
    $('#roWin').textContent = fmt(g.stake);
    if(g.step >= 5){
      unlock('gamble'); S.gambleWins++;
      flash(.7); shake(); Sfx.big(); FX.fountain(80);
      setMsg(`👑 KARTEN-KÖNIG! ALLE 5 STUFEN GEKNACKT: <span class="num">${fmt(g.stake)}</span>`);
      pushChat('big', 'LeiterKönig', `5× RICHTIG IM KARTENRISIKO!! 🔥👑`);
      save(); renderTop(); await sleep(1100); endGamble(); return;
    }
    setMsg(`🔥 DRIN!! VERDOPPELT AUF <span class="num">${fmt(g.stake)}</span>!`);
  } else {
    st.won -= g.stake;
    setMsg(`💀 Leider ${card.red?'Rot':'Schwarz'}! Der Gewinn ist weg.`);
    Sfx.lose();
    $('#roWin').textContent = '0';
    S.history.unshift({m:UI.cur, bet:0, win:0, t:Date.now(), note:`Kartenrisiko verloren (−${fmt(g.stake)})`});
    g.stake = 0; save(); renderTop(); renderCardRisk();
    await sleep(950); endGamble(); return;
  }
  save(); renderTop(); g.lock = false; renderCardRisk();
}
function endGamble(){
  clearInterval(ladderTimer);
  const g = UI.gamble;
  UI.gamble = null;
  $('#gamble').hidden = true;
  // Endbetrag (Gesichertes + verbliebener Einsatz) kommt in die Bestenliste
  if(g && window.GPScores && UI.cur) GPScores.add({m:UI.cur, amount:g.banked + g.stake, bet:g.bet, type:g.type, ladder:true});
  updateControls();
}

$('#tabLadder').onclick = () => setGambleTab('ladder');
$('#tabCard').onclick = () => setGambleTab('card');
$('#lRiskBtn').onclick = ladderRisk;
$('#lSplitBtn').onclick = ladderSplit;
$('#lTakeBtn').onclick = () => { if(UI.gamble && !UI.gamble.lock){ toast(`💰 ${fmt(UI.gamble.stake + UI.gamble.banked)} Chips angenommen!`); endGamble(); } };
$('#gRed').onclick = () => gambleGuess(true);
$('#gBlack').onclick = () => gambleGuess(false);
$('#gTake').onclick = () => { if(UI.gamble && !UI.gamble.lock){ toast(`💰 ${fmt(UI.gamble.stake + UI.gamble.banked)} Chips eingesammelt!`); endGamble(); } };

/* ---------- Overlays ---------- */
const TIERS = [[15,'ES SCHEPPERT!'],[50,'KASINO-KÖNIG!'],[100,'ALGE! MEGA WIN!'],[250,'👑 LEGENDÄR!']];
function bigWin(amount, x){
  unlock('big'); if(x >= 50) unlock('mega');
  const b = amount / x;
  const top = TIERS.filter(t => x >= t[0]).length;
  const dur = reduced ? 10 : 1800 + top * 1400;
  const ov = $('#overlay');
  ov.innerHTML = `<div class="rays"></div><div class="big" role="button" tabindex="0"><div class="t" id="bwT">ES SCHEPPERT!</div><div class="a num" id="bwA">0</div><div class="s" id="bwS">Tippen zum Überspringen</div></div>`;
  ov.hidden = false;
  flash(); shake(); Sfx.big(); FX.fountain(70);
  let tier = 1;
  return new Promise(res => {
    const t0 = performance.now(); let done = false, closeT, lastTick = 0;
    const fountT = setInterval(() => FX.fountain(14 + tier*7), 300);
    const setTier = k => {
      if(k <= tier) return; tier = k;
      const el = $('#bwT'); el.textContent = TIERS[k-1][1];
      el.classList.remove('up'); void el.offsetWidth; el.classList.add('up');
      flash(); shake(); Sfx.tierUp(); FX.burst(innerWidth/2, innerHeight/2, 100);
    };
    const finish = () => {
      if(done) return; done = true; clearInterval(fountT); setTier(top);
      $('#bwA').textContent = fmt(amount);
      $('#bwS').textContent = `👑 ${x.toFixed(1).replace('.',',')}× Einsatz · Tippen zum Fortfahren`;
      Sfx.big(); closeT = setTimeout(close, 1900);
    };
    const close = () => { clearTimeout(closeT); clearInterval(fountT); ov.hidden = true; ov.innerHTML = ''; ov.onclick = null; res(); };
    const step = now => {
      if(done) return;
      const p = Math.min(1, (now - t0) / dur), cur = amount * (1 - Math.pow(1 - p, 2.2));
      $('#bwA').textContent = fmt(cur);
      for(let k=top;k>1;k--) if(cur / b >= TIERS[k-1][0]){ setTier(k); break; }
      if(now - lastTick > 70){ Sfx.roll(); lastTick = now; }
      if(p < 1) requestAnimationFrame(step); else finish();
    };
    requestAnimationFrame(step);
    ov.onclick = () => { if(!done) finish(); else close(); };
  });
}
function midWin(amount, x){
  const label = x >= 8 ? '🔥 SAUBERER TREFFER!' : '👑 KÖNIGLICHER GEWINN!';
  const d = document.createElement('div'); d.className = 'floatwin';
  d.innerHTML = `<b>${label}</b><span>+${fmt(amount)}</span>`;
  document.querySelector('.cabinet').appendChild(d);
  flash(.5); if(x >= 8) shake(); FX.fountain(x >= 8 ? 45 : 24); Sfx.tierUp();
  return sleep(reduced ? 300 : 1400).then(() => d.remove());
}
function banner(title, sub, ms){
  const ov = $('#overlay');
  ov.innerHTML = `<div class="rays"></div><div class="big" role="button" tabindex="0"><div class="t" style="font-size:clamp(34px,7.5vw,68px)">${title}</div><div class="s" style="font-size:16px;max-width:42ch;margin-inline:auto">${sub}</div></div>`;
  ov.hidden = false; FX.fountain(35);
  return new Promise(res => {
    const close = () => { clearTimeout(t); ov.hidden = true; ov.innerHTML = ''; ov.onclick = null; res(); };
    const t = setTimeout(close, ms); ov.onclick = close;
  });
}
function modal(title, body){
  const ov = $('#overlay');
  ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${title}"><header><h2>${title}</h2><button class="tbtn" id="mClose">Schließen</button></header><div class="body">${body}</div></div>`;
  ov.hidden = false;
  const close = () => { ov.hidden = true; ov.innerHTML = ''; ov.onclick = null; };
  $('#mClose').onclick = close;
  ov.onclick = e => { if(e.target === ov) close(); };
  return close;
}

/* ---------- Gewinnplan ---------- */
function paytable(){
  const m = curM(); const b = BETS[S.betIdx[m.id]]; const lb = b / m.lines.length;
  const counts = m.payCounts || (m.cols === 3 ? [2,3] : [3,4,5]);
  const rows = Object.entries(m.pays).reverse().map(([id,p]) => {
    const s = m.sym[id];
    return `<tr><td class="sym"><span class="psym">${s.svg}</span></td><td>${s.n}</td>${counts.map(n => `<td class="n">${p[n] ? fmt(roundWin(p[n]*lb)) : '–'}</td>`).join('')}</tr>`;
  }).join('');
  let extra = '';
  if(m.mixPay) extra += `<tr><td class="sym txt">BAR/7</td><td>3 beliebig gemischt</td><td class="n">–</td><td class="n">${fmt(roundWin(m.mixPay*lb))}</td></tr>`;
  let rules = '';
  if(m.id === 'alge') rules = `<ul class="rules">
    <li>10 feste Gewinnlinien, gewertet wird von links nach rechts. Alle Themen-Symbole (Anker, Muschel, Schatztruhe, Dreizack, Alge-König) zahlen schon ab <b>2 gleichen</b>!</li>
    <li><b>ALGE-Dose</b> ist Wild und Scatter zugleich: Sie ersetzt jedes Symbol und zahlt überall (3 = ${fmt(2*b)}, 4 = ${fmt(20*b)}, 5 = ${fmt(200*b)}).</li>
    <li>3, 4 oder 5 ALGE-Dosen starten <b>8, 10 oder 12 Freispiele</b>. Vor Beginn wird per Schriftrolle ein zufälliges <b>Spezialsymbol</b> gezogen.</li>
    <li><b>Freispiel-Multiplikator:</b> startet bei ×1, jeder Gewinn erhöht ihn um 1 bis ×${m.fsMultMax}. Er gilt für alle Gewinne inklusive Spezialsymbol.</li>
    <li>In den Freispielen breitet sich das Spezialsymbol über die gesamte Walze aus (alle 3 Reihen), sobald genug davon für einen Gewinn gelandet sind – und zahlt auf allen 10 Linien!</li>
    <li><b>Risikoleiter &amp; Kartenrisiko:</b> Nach jedem manuellen Gewinn kannst du auf der blinkenden Risikoleiter hochdrücken (inkl. ½ Teilen) oder im Kartenrisiko Rot/Schwarz tippen.</li></ul>`;
  if(m.id === 'frucht') rules = `<ul class="rules">
    <li>Gewertet wird von links nach rechts auf 5 Linien. Einsatz pro Linie: ${fmt(lb)}.</li>
    <li>Kirschen zahlen schon ab zwei auf den ersten Walzen.</li>
    <li><b>Risikoleiter &amp; Kartenrisiko:</b> Nach jedem manuellen Gewinn kannst du auf der Risikoleiter hochdrücken (inkl. ½ Teilen) oder Rot/Schwarz tippen (${Tune.gambleP(m.id) === .5 ? '50/50' : Math.round(Tune.gambleP(m.id) * 100) + ' % Gewinnchance, angepasst'}).</li></ul>`;
  if(m.id === 'sterne') rules = `<ul class="rules">
    <li>20 feste Linien, von links nach rechts. Einsatz pro Linie: ${String(lb).replace('.',',')}. Linienwerte werden gerundet.</li>
    <li><b>WILD</b> erscheint nur auf den Walzen 2, 3 und 4 und ersetzt alle Symbole außer dem Stern.</li>
    <li><b>Goldstern</b> zahlt überall: 3 = ${fmt(2*b)}, 4 = ${fmt(10*b)}, 5 = ${fmt(50*b)} und startet 10 / 15 / 20 Freispiele.</li>
    <li><b>Freispiel-Multiplikator:</b> startet bei ×1, jeder Gewinn erhöht ihn um 1 bis ×${m.fsMultMax}. Weitere Sterne geben zusätzliche Freispiele.</li></ul>`;
  if(m.id === 'drache') rules = `<ul class="rules">
    <li>10 Linien, von links nach rechts. <b>Feuer-WILD</b> auf den Walzen 2 bis 5.</li>
    <li><b>Goldmünzen</b> tragen 1× bis 15× Einsatz oder einen Jackpot (MINI ${fmt(20*b)}, MINOR ${fmt(50*b)}, MAJOR ${fmt(250*b)}).</li>
    <li>Ab <b>6 Münzen</b> startet Hold &amp; Win: Die Münzen bleiben liegen, du hast 3 Respins. Jede neue Münze setzt die Respins auf 3 zurück.</li>
    <li>Alle 15 Felder voll: Du gewinnst zusätzlich den progressiven <b>GRAND</b>-Jackpot (aktuell ${fmt(S.grand)}). 1 % jedes Einsatzes fließt in den Topf.</li></ul>`;
  if(m.id === 'buch') rules = `<ul class="rules">
    <li>10 Linien, von links nach rechts. Eule und Sanduhr zahlen schon ab 2 gleichen.</li>
    <li><b>Grimoire</b> ist Wild und Scatter zugleich: Es ersetzt jedes Symbol und zahlt überall (3 = ${fmt(2*b)}, 4 = ${fmt(20*b)}, 5 = ${fmt(200*b)}).</li>
    <li>3, 4 oder 5 Bücher starten <b>8, 10 oder 12 Freispiele</b> mit einem zufälligen expandierenden Spezialsymbol.</li>
    <li><b>Freispiel-Multiplikator:</b> startet bei ×1, jeder Gewinn erhöht ihn um 1 bis ×${m.fsMultMax}.</li>
    <li><b>Risikoleiter &amp; Kartenrisiko:</b> Nach jedem manuellen Gewinn auf der Leiter hochdrücken oder Rot/Schwarz tippen.</li></ul>`;
  const lines = m.lines.map((ln,i) => `<div class="pl"><small>Linie ${i+1}</small><div class="g" style="grid-template-columns:repeat(${m.cols},1fr)">${
    Array.from({length:m.rows}, (_,r) => ln.map(lr => `<i class="${lr===r?'on':''}"></i>`).join('')).join('')}</div></div>`).join('');
  modal(`${m.name} · Gewinnplan`, `
    <p class="lead" style="margin:0 0 12px">Beträge in Chips beim aktuellen Einsatz von <b class="num">${fmt(b)}</b>.</p>
    <div class="tw"><table class="ptable"><thead><tr><th></th><th>Symbol</th>${counts.map(n=>`<th class="n">${n}×</th>`).join('')}</tr></thead><tbody>${rows}${extra}</tbody></table></div>
    <h3 style="margin:18px 0 6px">Spielhallen-Regeln</h3>${rules}
    <h3 style="margin:18px 0 0">Gewinnlinien</h3><div class="paylines">${lines}</div>
    <p class="rules" style="margin-top:14px">Auszahlungsquote ${Tune.rtpLabel(m)}. Jeder Dreh nutzt den Zufallsgenerator des Browsers (crypto.getRandomValues).</p>`);
}

/* ---------- Statistik ---------- */
function statsModal(){
  const all = Object.values(S.stats).reduce((a,s)=>({spins:a.spins+s.spins,wag:a.wag+s.wag,won:a.won+s.won}),{spins:0,wag:0,won:0});
  const best = Math.max(0, ...Object.values(S.stats).map(s=>s.best));
  const rows = Object.values(MACHINES).map(m => {
    const s = S.stats[m.id] || {spins:0,wag:0,won:0,best:0,bestX:0,features:0};
    const q = s.wag ? (s.won/s.wag*100).toFixed(1).replace('.',',')+' %' : '–';
    return `<tr><td>${m.name}</td><td class="n">${fmt(s.spins)}</td><td class="n">${fmt(s.wag)}</td><td class="n">${fmt(s.won)}</td><td class="n">${q}</td><td class="n">${fmt(s.best)}</td><td class="n">${fmt(s.features)}</td></tr>`;
  }).join('');
  const close = modal('Königliche Statistik', `
    <div class="statgrid">
      <div class="stat"><small>Drehungen</small><b>${fmt(all.spins)}</b></div>
      <div class="stat"><small>Gesetzt</small><b>${fmt(all.wag)}</b></div>
      <div class="stat"><small>Gewonnen</small><b>${fmt(all.won)}</b></div>
      <div class="stat"><small>Rekordgewinn</small><b>${fmt(best)}</b></div>
    </div>
    <div class="tw"><table class="ptable"><thead><tr><th>Automat</th><th class="n">Drehs</th><th class="n">Gesetzt</th><th class="n">Gewonnen</th><th class="n">Quote</th><th class="n">Rekord</th><th class="n">Features</th></tr></thead><tbody>${rows}</tbody></table></div>
    ${achHTML()}
    <p class="rules" style="margin-top:12px">Gratis-Nachschub genutzt: ${S.refills}× · GRAND-Topf: ${fmt(S.grand)}</p>
    <div class="confirm-row"><button class="btn ghost" id="resetBtn">Spielstand zurücksetzen</button></div>
    <div id="resetConfirm" hidden class="confirm-row" style="align-items:center"><span style="color:var(--red)">Alles löschen und mit 5.000 Chips neu starten?</span><button class="btn ghost" id="resetNo">Abbrechen</button><button class="btn" id="resetYes" style="background:var(--red);color:#fff">Zurücksetzen</button></div>`);
  $('#resetBtn').onclick = () => { $('#resetConfirm').hidden = false; $('#resetBtn').hidden = true; };
  $('#resetNo').onclick = () => { $('#resetConfirm').hidden = true; $('#resetBtn').hidden = false; };
  $('#resetYes').onclick = () => { const snd = S.sound; S = freshState(); S.sound = snd; save(); close(); toast('Spielstand zurückgesetzt'); location.hash = ''; route(); renderTop(); };
}

/* ---------- Bedienung ---------- */
$('#spinBtn').onclick = () => {
  if(UI.auto > 0){ UI.auto = 0; $('#autoSel').value = '0'; updateControls(); return; }
  spin();
};
$('#betDown').onclick = () => { const m = curM(); if(S.betIdx[m.id] > 0){ S.betIdx[m.id]--; save(); updateControls(); Sfx.init(); Sfx.tick(); } };
$('#betUp').onclick = () => { const m = curM(); if(S.betIdx[m.id] < BETS.length-1){ S.betIdx[m.id]++; save(); updateControls(); Sfx.init(); Sfx.tick(); } };
$('#maxBet').onclick = () => {
  const m = curM(); let i = BETS.length-1; while(i > 0 && BETS[i] > S.balance) i--;
  S.betIdx[m.id] = i; save(); updateControls();
};
$('#autoSel').onchange = e => {
  const n = +e.target.value;
  if(UI.gamble) endGamble();
  UI.auto = n;
  updateControls();
  if(n > 0 && !UI.busy && UI.fs.left === 0) spin();
};
$('#turboBtn').onclick = () => { UI.turbo = !UI.turbo; $('#turboBtn').setAttribute('aria-pressed', UI.turbo); };
$('#payBtn').onclick = paytable;
$('#backBtn').onclick = () => { if(UI.gamble) endGamble(); location.hash = ''; };
$('#home').onclick = () => { if(UI.busy || UI.fs.left > 0 || UI.fs.active) return; if(UI.gamble) endGamble(); location.hash = ''; };
$('#statsBtn').onclick = statsModal;
$('#soundBtn').onclick = () => { S.sound = !S.sound; save(); renderTop(); if(S.sound){ Sfx.init(); Sfx.win(); } };

document.addEventListener('keydown', e => {
  if(e.code !== 'Space' || !UI.cur || !$('#overlay').hidden) return;
  if(['SELECT','BUTTON','INPUT'].includes(e.target.tagName) && e.target.id !== 'lRiskBtn') return;
  e.preventDefault();
  if(UI.gamble && UI.gamble.mode === 'ladder'){
    ladderRisk();
    return;
  }
  if(!$('#spinBtn').disabled) $('#spinBtn').click();
});
document.addEventListener('keydown', e => {
  if(e.code === 'Escape' && !$('#overlay').hidden && $('#mClose')) $('#mClose').click();
});

/* ---------- Start ---------- */
route();
