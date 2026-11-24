/* Spiel-Logik ohne DOM: Zufall, Walzen, Gewinnauswertung.
   Wird auch von tools/simulate.js genutzt. */
//#LOGIC
/* ================= Spiel-Logik (rein, ohne DOM) ================= */
const RNG = {
  buf: new Uint32Array(512), i: 512,
  next(){ if(this.i >= 512){ crypto.getRandomValues(this.buf); this.i = 0; } return this.buf[this.i++] / 4294967296; }
};
const rnd = () => RNG.next();
function pick(list){
  let t = 0; for(const e of list) t += e[1];
  let r = rnd() * t;
  for(const e of list){ r -= e[1]; if(r < 0) return e[0]; }
  return list[list.length-1][0];
}

const LINES3 = [[1,1,1],[0,0,0],[2,2,2],[0,1,2],[2,1,0]];
const LINES5 = [
  [1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],
  [0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[1,0,1,2,1],
  [1,2,1,0,1],[0,1,1,1,0],[2,1,1,1,2],[0,1,0,1,0],[2,1,2,1,2],
  [1,1,0,1,1],[1,1,2,1,1],[0,0,2,0,0],[2,2,0,2,2],[0,2,0,2,0]
];

function reelsFrom(base, overrides){
  return overrides.map(ov => Object.entries({...base, ...ov}).filter(([,w]) => w > 0));
}

const MACHINES = {
  alge: {
    id:'alge', name:'ALGE – König der Meere', badge:'KULT-AUTOMAT', cols:5, rows:3, lines:LINES5.slice(0,10),
    tagline:'Der legendäre Kult-Automat: 5 Walzen, 10 Linien, der Alge-König zahlt bis 5.000× (schon ab 2!). Drei ALGE-Dosen starten bis zu 12 Freispiele mit Spezialsymbol und Multiplikator bis ×10.',
    vol:'sehr hoch', rtp:'≈ 96 %',
    tags:['10 Gewinnlinien','ALGE-Dose Wild+Scatter','Expandierendes Symbol','Risikoleiter'],
    sym:{
      t10:{n:'Zehn (10)'}, tj:{n:'Bube (J)'}, tq:{n:'Dame (Q)'}, tk:{n:'König (K)'}, ta:{n:'Ass (A)'},
      anchor:{n:'Goldanker'}, shell:{n:'Perlenmuschel'}, chest:{n:'Schatztruhe'}, trident:{n:'Goldener Dreizack'},
      king:{n:'Der Alge-König'}, algecan:{n:'ALGE-Dose (Wild + Scatter)'}
    },
    reels: reelsFrom({t10:25,tj:25,tq:23,tk:21,ta:21,anchor:13,shell:12,chest:8,trident:6,king:4,algecan:3.65}   /* mit Freispiel-Multiplikator ≈ 96 % (Simulation, 4 Mio. Drehungen) */,[{},{},{},{},{}]),
    pays:{
      t10:{3:5,4:25,5:100}, tj:{3:5,4:25,5:100}, tq:{3:5,4:25,5:100}, tk:{3:5,4:40,5:150}, ta:{3:5,4:40,5:150},
      anchor:{2:5,3:30,4:100,5:750}, shell:{2:5,3:30,4:100,5:750},
      chest:{2:5,3:40,4:400,5:2000}, trident:{2:5,3:40,4:400,5:2000},
      king:{2:10,3:100,4:1000,5:5000}
    },
    payCounts:[2,3,4,5],
    wild:'algecan', scatter:'algecan', scatterPl:'ALGE-Dosen', scatterDat:'ALGE-Dosen',
    scatterPay:{3:2,4:20,5:200}, fsAward:{3:8,4:10,5:12}, fsMult:1, fsMultStart:1, fsMultStep:1, fsMultMax:10,
    expanding:true, expandWeights:{t10:3,tj:3,tq:3,tk:2.6,ta:2.6,anchor:1.8,shell:1.8,chest:1.1,trident:1.1,king:.65},
    gamble:true, hiSyms:['king','trident','chest','shell','anchor']
  },
  frucht: {
    id:'frucht', name:'Frucht-Express', badge:'RISIKO-KLASSIKER', cols:3, rows:3, lines:LINES3,
    tagline:'Der deutsche Spielhallen-Klassiker: drei Walzen, fünf Linien, Hochglanz-Früchte & Doppel-777. Nach jedem Treffer lockt die Risikoleiter!',
    vol:'niedrig', rtp:'≈ 95 %',
    tags:['5 Gewinnlinien','Risikoleiter + Teilen','Kirschen ab 2'],
    sym:{
      cherry:{n:'Hochglanz-Kirschen'}, lemon:{n:'Zitrone'}, orange:{n:'Orange'}, grape:{n:'Edel-Trauben'},
      bell:{n:'Goldglocke'}, bar:{n:'Dreifach-BAR'}, seven:{n:'Doppel-777'}
    },
    reels: reelsFrom({cherry:22,lemon:20,orange:18,grape:15,bell:10,bar:7,seven:4},[{},{},{}]),
    pays:{cherry:{2:2,3:8}, lemon:{3:25}, orange:{3:30}, grape:{3:40}, bell:{3:75}, bar:{3:150}, seven:{3:400}},
    mixPay:20, gamble:true, hiSyms:['seven','bar','bell']
  },
  sterne: {
    id:'sterne', name:'Sternenjuwelen', badge:'MULTI ×10', cols:5, rows:3, lines:LINES5,
    tagline:'Funkelnde Edelsteine im Kosmos. Wilds auf den mittleren Walzen, goldene Sterne zahlen überall und zünden bis zu 20 Freispiele. Jeder Gewinn erhöht den Multiplikator bis ×10.',
    vol:'mittel', rtp:'≈ 95,5 %',
    tags:['20 Gewinnlinien','Wild auf Walze 2–4','Multiplikator bis ×10'],
    sym:{
      planet:{n:'Smaragd-Planet'}, moon:{n:'Goldmond'}, comet:{n:'Komet'}, orb:{n:'Orakelkugel'},
      ring:{n:'Saphir-Ring'}, gem:{n:'Kaiser-Rubin'}, crown:{n:'Reichskrone'},
      star:{n:'Goldstern (Scatter)'}, wild:{n:'Kosmos-Wild'}
    },
    reels: reelsFrom({planet:30,moon:28,comet:26,orb:18,ring:14,gem:9,crown:6,star:3.8,wild:0},[{},{wild:7},{wild:7},{wild:7},{}]),
    pays:{planet:{3:6,4:20,5:60}, moon:{3:6,4:20,5:75}, comet:{3:10,4:25,5:90}, orb:{3:12,4:40,5:125},
          ring:{3:20,4:60,5:200}, gem:{3:30,4:125,5:400}, crown:{3:60,4:250,5:1250}},
    wild:'wild', scatter:'star', scatterPl:'Sterne', scatterDat:'Sternen', scatterPay:{3:2,4:10,5:50}, fsAward:{3:10,4:15,5:20}, fsMult:1, fsMultStart:1, fsMultStep:1, fsMultMax:10, gamble:true, hiSyms:['crown','gem','ring']
  },
  drache: {
    id:'drache', name:'Drachenhort', badge:'HOLD & WIN · GRAND', cols:5, rows:3, lines:LINES5.slice(0,10),
    tagline:'Geprägte Goldmünzen tragen fette Werte. Sechs oder mehr starten Hold & Win: Münzen kleben fest, jede neue setzt die Respins zurück. Volles Feld knackt den GRAND!',
    vol:'hoch', rtp:'≈ 95 %',
    tags:['10 Gewinnlinien','Hold & Win','4 Jackpots'],
    sym:{
      j:{n:'Bube (J)'}, q:{n:'Dame (Q)'}, k:{n:'König (K)'}, a:{n:'Ass (A)'},
      lantern:{n:'Seidenlaterne'}, envelope:{n:'Glücksumschlag'}, dragon:{n:'Kaiserdrache'},
      wild:{n:'Feuer-Wild'}, coin:{n:'Goldmünze'}
    },
    reels: reelsFrom({j:26,q:24,k:22,a:20,lantern:12,envelope:10,dragon:6,wild:0,coin:17},[{},{wild:5},{wild:5},{wild:5},{wild:5}]),
    pays:{j:{3:8,4:25,5:80}, q:{3:8,4:25,5:80}, k:{3:12,4:35,5:125}, a:{3:15,4:40,5:150},
          lantern:{3:25,4:80,5:300}, envelope:{3:35,4:125,5:500}, dragon:{3:80,4:300,5:1500}},
    wild:'wild', coin:'coin', coinTrigger:6, respinP:0.106,
    coinValues:[[1,30],[2,25],[3,15],[5,12],[8,8],[10,5],[15,3],['MINI',1.6],['MINOR',0.7],['MAJOR',0.15]],
    jpMult:{MINI:20, MINOR:50, MAJOR:250}, grandSeed:25000, grandRate:0.01, gamble:true, hiSyms:['dragon','envelope','lantern']
  },
  buch: {
    id:'buch', name:'Grimoire', badge:'DAS ZAUBERBUCH', cols:5, rows:3, lines:LINES5.slice(0,10),
    tagline:'Drei Zauberbücher öffnen bis zu 12 Freispiele mit Spezialsymbol und Multiplikator bis ×10. Plus echte Risikoleiter!',
    vol:'sehr hoch', rtp:'≈ 96,5 %',
    tags:['10 Gewinnlinien','Expandierendes Symbol','Risikoleiter'],
    sym:{
      fire:{n:'Feuer-Rune'}, water:{n:'Wasser-Rune'}, earth:{n:'Erd-Rune'}, air:{n:'Luft-Rune'},
      candle:{n:'Goldleuchter'}, potion:{n:'Elixier'}, owl:{n:'Goldene Eule'}, hourglass:{n:'Sanduhr'}, book:{n:'Grimoire (Wild + Scatter)'}
    },
    reels: reelsFrom({fire:26,water:26,earth:24,air:24,candle:14,potion:12,owl:7,hourglass:5,book:3.12},[{},{},{},{},{}]),
    pays:{fire:{3:4,4:20,5:100}, water:{3:4,4:20,5:100}, earth:{3:4,4:20,5:100}, air:{3:4,4:20,5:100},
          candle:{3:15,4:60,5:500}, potion:{3:15,4:60,5:500}, owl:{2:4,3:25,4:250,5:1250}, hourglass:{2:8,3:80,4:800,5:4000}},
    payCounts:[2,3,4,5],
    wild:'book', scatter:'book', scatterPl:'Bücher', scatterDat:'Büchern', scatterPay:{3:2,4:20,5:200}, fsAward:{3:8,4:10,5:12}, fsMult:1, fsMultStart:1, fsMultStep:1, fsMultMax:10,
    expanding:true, expandWeights:{fire:3,water:3,earth:3,air:3,candle:2,potion:2,owl:1.2,hourglass:.8},
    gamble:true, hiSyms:['owl','hourglass','potion','candle']
  }
};
function chooseExpand(m){ return pick(Object.entries(m.expandWeights)); }
function expandWin(m, grid, bet, sym){
  const reels = []; grid.forEach((col,c) => { if(col.some(x => x.id === sym)) reels.push(c); });
  const mult = m.pays[sym][reels.length] || 0;
  return {reels, n:reels.length, amt: mult ? roundWin(mult * bet) : 0};
}

function genCell(m, c){
  const id = pick((m.tuned || m.reels)[c]);   // m.tuned: vom Quoten-Regler angepasste Gewichte
  const cell = {id};
  if(id === m.coin) cell.v = pick(m.coinValues);
  return cell;
}
function generate(m){
  const g = [];
  for(let c=0;c<m.cols;c++){ g.push([]); for(let r=0;r<m.rows;r++) g[c].push(genCell(m,c)); }
  return g;
}
function evalLine(ids, pays, wild){
  let base = null, n = 0;
  for(const id of ids){
    if(id === wild){ n++; continue; }
    if(!pays[id]) break;
    if(base === null){ base = id; n++; continue; }
    if(id === base){ n++; continue; }
    break;
  }
  if(base === null) return {sym:null, count:0, mult:0};
  const tbl = pays[base];
  return {sym:base, count:n, mult: tbl[n] || 0};
}
function roundWin(x){ return x > 0 ? Math.max(1, Math.round(x)) : 0; }
function evaluate(m, grid, bet){
  const lineBet = bet / m.lines.length;
  const wins = []; let total = 0;
  m.lines.forEach((ln, li) => {
    const ids = ln.map((r,c) => grid[c][r].id);
    let res = evalLine(ids, m.pays, m.wild);
    if(!res.mult && m.mixPay && ids.every(i => i==='bar' || i==='seven')) res = {sym:'mix', count:3, mult:m.mixPay};
    if(res.mult){
      const amt = roundWin(res.mult * lineBet);
      total += amt;
      wins.push({line:li, sym:res.sym, count:res.count, amt, cells: ln.slice(0,res.count).map((r,c) => [c,r])});
    }
  });
  let scatter = null;
  if(m.scatter){
    const cells = [];
    grid.forEach((col,c) => col.forEach((cell,r) => { if(cell.id === m.scatter) cells.push([c,r]); }));
    if(cells.length >= 3){
      const n = Math.min(cells.length, 5);
      const amt = roundWin(m.scatterPay[n] * bet);
      total += amt;
      scatter = {count:cells.length, amt, cells, spins:m.fsAward[n]};
    }
  }
  let coins = null;
  if(m.coin){
    const cells = [];
    grid.forEach((col,c) => col.forEach((cell,r) => { if(cell.id === m.coin) cells.push([c,r]); }));
    if(cells.length >= m.coinTrigger) coins = {cells};
  }
  return {wins, scatter, coins, total};
}
function coinAmount(m, v, bet){ return typeof v === 'number' ? v * bet : m.jpMult[v] * bet; }
function respinStep(m, locked){
  const added = [];
  for(let i=0;i<locked.length;i++){
    if(!locked[i] && rnd() < m.respinP){ locked[i] = {id:m.coin, v:pick(m.coinValues)}; added.push(i); }
  }
  return added;
}
function gambleDraw(){ const suits = ['♥','♦','♠','♣']; const s = suits[Math.floor(rnd()*4)]; return {s, red: s==='♥'||s==='♦'}; }
// Freispiel-Multiplikator: startet bei fsMultStart und steigt nach jedem Freispiel mit Gewinn um fsMultStep (bis fsMultMax)
function fsMultNext(m, cur, won){ return won ? Math.min(m.fsMultMax || cur, cur + (m.fsMultStep || 0)) : cur; }
const FS_CAP = 100;   // Obergrenze: höchstens so viele Freispiele pro Bonusrunde (inkl. Retrigger)
//#END
