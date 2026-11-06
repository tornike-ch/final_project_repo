// Builds src/peeps.json: the Open Peeps parts the story uses, as SVG fragments whose colours are
// CSS variables, plus where each body's neck is so heads sit on it.
//   cd invite_site/tools/peeps && npm install && npm run build && python3 ../build_story.py
// Open Peeps by Pablo Stanley (openpeeps.com) is CC0; the npm package (@opeepsfun/open-peeps) is MIT.
const fs = require('fs'), path = require('path');
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const B = path.join(__dirname, 'node_modules/@opeepsfun/open-peeps/build/');

// the parts the scenes use (keep in step with src/story.js)
const BODIES = ['standing/WalkingColorTee', 'standing/PointingFingerColorTee', 'standing/Dancer', 'standing/EasingColorTee',
  'standing/ShirtColorTee', 'standing/Doc', 'sitting/MidColorTee', 'sitting/ClosedLegsColorTee', 'sitting/OneLegColorTee',
  'sitting/CrossedLegs', 'effigy/Coffee', 'effigy/PointingUp', 'effigy/Explaining', 'effigy/Tee', 'effigy/Paper'];
const HAIR = ['Beanie', 'LongHair', 'Afro', 'Bun', 'ShortOne', 'Wavy', 'MediumBangs', 'DocOne', 'LongCurly', 'Pomp', 'Bangs', 'ShortTwo', 'BunTwo'];
const FACES = ['BigSmile', 'Smile', 'SmileLOL', 'Cute', 'LoveGrinTeeth', 'Cheeky', 'EatingHappy', 'Calm'];

// sentinel colours, replaced by CSS variables so day and night can recolour every character
const SENT = {skinColor:'#a10001', topColor:'#a10002', pantsColor:'#a10003', jacketColor:'#a10004', coatColor:'#a10004',
  shoesColor:'#a10005', cupColor:'#a10006', capColor:'#a10006', beanieColor:'#a10006', outlineColor:'#a10007'};
const VAR = {'#a10001':'--sk', '#a10002':'--tp', '#a10003':'--pa', '#a10004':'--jk', '#a10005':'--so', '#a10006':'--ac', '#a10007':'--ol'};
// hair offsets the package's Effigy applies per hair style
const HAIR_OFF = {Bald:[50,20],BangsTwo:[20,0],BantuKnots:[30,0],Bear:[20,0],Bun:[-20,-30],Beanie:[20,0],BunClip:[20,-70],BunKnots:[10,-30],BunTwo:[-50,-90],ColorMedium:[30,0],CornrowsLight:[-15,0],DreadsTwo:[0,-15],FlatTop:[50,0]};
// and per bust body
const BUST_HEAD = {Explaining:[0,30], PointingUp:[0,30], PolkadotJacket:[0,20], Killer:[0,10], StrippedPocketTee:[250,0], Whatever:[90,0]};

function render(p){
  const m = require(B + p + '.js'), cfg = Object.values(m).find(v => v && v.viewBox), props = {};
  (cfg.props || []).forEach(x => { if (SENT[x.name]) props[x.name] = SENT[x.name]; });
  let svg = renderToStaticMarkup(React.createElement(m.default, props));
  svg = svg.replace(/(fill|stroke)="(#a1000\d)"/gi, (_, a, c) => 'style="' + a + ':var(' + VAR[c.toLowerCase()] + ')"')
    .replace(/ d="([^"]+)"/g, (_, d) => ' d="' + d.replace(/-?\d*\.\d+(e-?\d+)?/g, n => String(Math.round(+n))).replace(/\s+/g, ' ') + '"')
    .replace(/ (id|class)="[^"]*"/g, '');
  return {svg, vb: cfg.viewBox.split(' ').map(Number)};
}

// the neck: centre of the topmost painted row, measured in a browser (see calib in the commit that added this)
const NECK = require('./neck.json');

const out = {parts: {}, bodies: {}, credit: 'Open Peeps by Pablo Stanley, CC0'};
for (const b of BODIES){
  const r = render('body/' + b), key = 'b-' + b.replace('/', '-');
  out.parts[key] = r.svg;
  if (b.startsWith('effigy/')){
    const adj = BUST_HEAD[b.split('/')[1]] || [0, 0];
    out.bodies[b] = {part:key, bx:147, by:639, hx:adj[0], hy:adj[1], nx:583, fy:1341};
  } else {
    const nx = NECK[b];
    out.bodies[b] = {part:key, bx:0, by:0, hx:nx - 583, hy:-639, nx, fy:r.vb[3]};
  }
}
for (const h of HAIR){ const r = render('head/' + h), o = HAIR_OFF[h] || [0, 0]; out.parts['h-' + h] = '<g transform="translate(' + (342 + o[0]) + ' ' + (190 + o[1]) + ')">' + r.svg + '</g>'; }
for (const f of FACES){ const r = render('face/' + f); out.parts['f-' + f] = '<g transform="translate(531 366)">' + r.svg + '</g>'; }
const file = path.join(__dirname, '../../src/peeps.json');
fs.writeFileSync(file, JSON.stringify(out));
console.log('wrote', path.relative(process.cwd(), file), Math.round(fs.statSync(file).size / 1024) + ' KB');
