/* ---------- the story: a paper plane crosses an illustrated town, by day or by night ----------
   One SVG world, 5000 x 1000 units, five chapters of 1000 units each. Scrolling moves a camera
   across it (the viewBox) while far and near layers move at their own speeds. The day story and
   the night story share the town; the light, the props, the people and the words change. */
(function(){
'use strict';
if (document.body.classList.contains('player')) return;
const sec = document.getElementById('story'); if (!sec) return;
const pin = sec.querySelector('.st-pin'), svg = document.getElementById('stWorld');
const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const G = 820, W = 5000, H = 1000;

/* ---------- words ---------- */
const T = {
  ka: {
    label: 'ისტორია', skip: 'გამოტოვე ისტორია', hint: 'გადაახვიე',
    tipDay: 'შეეხე მზეს: ღამით ქალაქი სხვა ამბავს მოგიყვება', tipNight: 'შეეხე მთვარეს და დაბრუნდი დღეში',
    orbDay: 'ღამის ისტორიაზე გადასვლა', orbNight: 'დღის ისტორიაზე გადასვლა', dot: 'თავი',
    play: 'ითამაშე დემო', goal: 'აირჩიე შენი მიზანი',
    kick: ['პროლოგი', 'თავი 1 · სწავლება', 'თავი 2 · ონბორდინგი', 'თავი 3 · ბრენდის თამაში', 'თავი 4 · ღონისძიება'],
    day: [
      ['დილაა, თბილისი.', 'ნინიმ ქაღალდის თვითმფრინავი გააკეთა და ზედ დააწერა: „ეს შენთვისაა“. ჯერ არ იცის, რამდენ ადამიანს გაახარებს.'],
      ['გაკვეთილი, რომელიც თამაშია.', 'თვითმფრინავი საკლასო ოთახში შეფრინდა. მოსაწყენი წესები ქვიზად იქცა და ყველამ ერთად შესძახა: „ვიცი!“'],
      ['პირველი დღე, ღიმილით.', 'გიორგის ახალ სამსახურში პირველი დღეა. ნერვიულობის ნაცვლად მოგზაურობა ხვდება: გუნდი, ადგილები და პატარა სიურპრიზები.'],
      ['ყავა, რომელიც თამაშით იწყება.', 'კაფესთან ხალხი ტელეფონს უყურებს და იცინის. სამი კითხვა, ერთი წუთი, და ყველას ჯიბეში კუპონი ჩაუვარდა.'],
      ['და ბოლოს, ყველა აქაა.', 'თვითმფრინავი სუფრაზე დაეშვა. ყველამ, ვისაც გზაში შეხვდა, მოსაწვევი მიიღო და მოვიდა. ეს არის განცდა.']
    ],
    night: [
      ['ღამეა, თბილისი.', 'ქალაქს სძინავს, ნინის ფანჯარა კი ჯერ ანთია. ის ქაღალდის თვითმფრინავს პატარა ფარანს აბამს და ვარსკვლავებისკენ უშვებს.'],
      ['ბოლო საათი გამოცდამდე.', 'ბიბლიოთეკაში ერთადერთი ნათურა ანთია. თვითმფრინავი ღია წიგნზე ჯდება და ხუთ წუთში სამი რთული თემა მარტივ თამაშად იქცევა.'],
      ['ღამის ცვლა იწყება.', 'მზიას საცხობში პირველი ღამეა. ღუმელის სითბო, გუნდის მისალმება და თვითმფრინავი, რომელიც ყველაფერს აჩვენებს, სანამ პირველი პური გამოცხვება.'],
      ['ღამის ბაზრობა.', 'ფარნები ირხევა, მუსიკა უკრავს. ყველა დახლთან ერთსა და იმავე პატარა თამაშს თამაშობენ და გამარჯვებულები თბილ ჩაის იღებენ.'],
      ['შუაღამე, სახურავზე.', 'ვარსკვლავების ქვეშ ყველა ერთადაა. ფეიერვერკი იწყება და ნინი ხვდება: ერთმა პატარა მოსაწვევმა მთელი ქალაქი გააღვიძა.']
    ],
    signs: {school: 'სკოლა', library: 'ბიბლიოთეკა', studio: 'სტუდია', bakery: 'საცხობი', cafe: 'ყავა', hello: 'მოგესალმებით!', tea: 'ჩაი'}
  },
  en: {
    label: 'The story', skip: 'Skip the story', hint: 'Scroll',
    tipDay: 'Tap the sun: at night the town tells another story', tipNight: 'Tap the moon to go back to the day',
    orbDay: 'Switch to the night story', orbNight: 'Switch to the day story', dot: 'Chapter',
    play: 'Play a demo', goal: 'Pick your goal',
    kick: ['Prologue', 'Chapter 1 · Learning', 'Chapter 2 · Onboarding', 'Chapter 3 · Brand game', 'Chapter 4 · Event'],
    day: [
      ['Morning, Tbilisi.', 'Nini folds a paper plane and writes on it: “This is for you.” She has no idea yet how many people it will make happy.'],
      ['A lesson that plays like a game.', 'The plane glides into a classroom. Dull rules turn into a quiz, and everyone shouts at once: “I know this!”'],
      ['A first day, with a smile.', 'It is Giorgi’s first day at a new job. Instead of nerves he gets a journey: the team, the places and small surprises.'],
      ['Coffee that starts with a game.', 'Outside the café people laugh at their phones. Three questions, one minute, and a coupon lands in every pocket.'],
      ['And in the end, everyone is here.', 'The plane lands on the long table. Everyone it met along the way got an invitation, and came. That is Gancda.']
    ],
    night: [
      ['Night, Tbilisi.', 'The city is asleep, but Nini’s window is still lit. She ties a tiny lantern to a paper plane and lets it go toward the stars.'],
      ['The last hour before the exam.', 'One lamp still burns in the library. The plane lands on an open book, and in five minutes three hard topics become a simple game.'],
      ['The night shift begins.', 'Mzia’s first night at the bakery: the warm oven, the whole team saying hello, and a plane that shows her everything before the first loaf is out.'],
      ['The night market.', 'Lanterns sway and music plays. Every stall plays the same little game, and the winners get warm tea.'],
      ['Midnight, on the rooftop.', 'Under the stars everyone is together. The fireworks begin, and Nini realises one small invitation woke up the whole city.']
    ],
    signs: {school: 'SCHOOL', library: 'LIBRARY', studio: 'STUDIO', bakery: 'BAKERY', cafe: 'COFFEE', hello: 'Welcome!', tea: 'TEA'}
  }
};

/* ---------- drawing helpers (strings of SVG) ---------- */
let seed = 7;
const R = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const f1 = n => Math.round(n * 10) / 10;

function windows(x, y, w, h, o){
  const cols = o.cols || 2, rows = o.rows || 2, ww = o.ww || 40, wh = o.wh || 52;
  const gx = (w - cols * ww) / (cols + 1), top = o.wtop || 34, gy = o.gy || 30;
  let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++){
    const wx = x + gx + c * (ww + gx), wy = y + top + r * (wh + gy);
    if (o.door && r === rows - 1 && Math.abs(wx + ww / 2 - (x + w / 2)) < ww) continue;
    const dark = R() < (o.dark == null ? .3 : o.dark);
    if (!dark) s += '<ellipse class="glow" cx="'+f1(wx + ww / 2)+'" cy="'+f1(wy + wh / 2)+'" rx="'+f1(ww * 1.1)+'" ry="'+f1(wh * 1)+'" fill="url(#stWg)"/>';
    s += '<rect class="win'+(dark ? ' dk' : '')+'" x="'+f1(wx)+'" y="'+f1(wy)+'" width="'+ww+'" height="'+wh+'" rx="6"/>'+
      '<path d="M'+f1(wx + ww / 2)+' '+f1(wy)+'v'+wh+'M'+f1(wx)+' '+f1(wy + wh * .45)+'h'+ww+'" stroke="'+(o.frame || 'var(--wd)')+'" stroke-width="3" opacity=".55"/>';
  }
  return s;
}
function house(x, w, h, fill, o = {}){
  const y = G - h, rf = o.rf || 'var(--rf)';
  let s = '<g>';
  if (o.roof === 'flat') s += '<rect x="'+(x - 10)+'" y="'+(y - 16)+'" width="'+(w + 20)+'" height="18" rx="5" fill="'+rf+'"/>';
  else s += '<path d="M'+(x - 18)+' '+(y + 2)+'L'+(x + w / 2)+' '+(y - (o.rh || 70))+'L'+(x + w + 18)+' '+(y + 2)+'Z" fill="'+rf+'" stroke-linejoin="round"/>';
  if (o.chimney) s += '<rect x="'+(x + w * .72)+'" y="'+(y - (o.rh || 70) * .7 - 30)+'" width="28" height="60" fill="'+rf+'"/>';
  s += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'"/>';
  s += windows(x, y, w, h, o);
  if (o.door) s += '<path d="M'+(x + w / 2 - 26)+' '+G+'v-74a26 26 0 0 1 52 0v74z" fill="var(--wd)"/><circle cx="'+(x + w / 2 + 14)+'" cy="'+(G - 40)+'" r="3.5" fill="var(--hF)"/>';
  return s + '</g>';
}
/* people are Open Peeps (Pablo Stanley, CC0): a body, a hair style and a face, recoloured with CSS variables */
const PEEPS = /*PEEPS*/null;
const PK = 0.062;                       // world units per Open Peeps unit for a grown-up
function peep(x, y, o){
  const b = PEEPS.bodies[o.b], s = PK * (o.s || 1), fl = o.flip ? -1 : 1;
  const st = '--sk:' + (o.sk || 'var(--s1)') + ';--tp:' + (o.tp || 'var(--p1)') + ';--pa:' + (o.pa || 'var(--pt)') + ';--jk:' + (o.jk || 'var(--p2)') +
    ';--so:' + (o.so || 'var(--shoe)') + ';--ac:' + (o.ac || 'var(--p3)') + ';--ol:var(--line)';
  return '<g class="pp' + (o.cls ? ' ' + o.cls : '') + '" transform="translate(' + x + ' ' + y + ')" style="' + st + '"><g class="pb" style="animation-delay:-' + f1(R() * 2.6) + 's">' +
    '<g transform="scale(' + f1(fl * s * 1000) / 1000 + ' ' + f1(s * 1000) / 1000 + ') translate(' + (-b.nx) + ' ' + (-b.fy) + ')">' +
    '<use href="#pp-' + b.part + '" transform="translate(' + b.bx + ' ' + b.by + ')"/>' +
    '<g transform="translate(' + b.hx + ' ' + b.hy + ')"><use href="#pp-h-' + o.h + '"/><use href="#pp-f-' + o.f + '"/></g></g></g></g>';
}
const peepDefs = () => Object.entries(PEEPS.parts).map(([k, v]) => '<g id="pp-' + k + '">' + v + '</g>').join('');
function stool(x){
  return '<g><rect x="'+(x - 26)+'" y="'+(G - 58)+'" width="52" height="9" rx="4" fill="var(--wd)"/><path d="M'+(x - 18)+' '+(G - 50)+'L'+(x - 24)+' '+G+'M'+(x + 18)+' '+(G - 50)+'L'+(x + 24)+' '+G+'" stroke="var(--wd)" stroke-width="6" stroke-linecap="round"/></g>';
}
function tree(x, s = 1){
  return '<g class="sway" transform="translate('+x+' '+G+') scale('+s+')"><rect x="-9" y="-120" width="18" height="120" rx="6" fill="var(--tk)"/>'+
    '<circle cx="0" cy="-170" r="62" fill="var(--tr)"/><circle cx="-44" cy="-130" r="42" fill="var(--tr)"/><circle cx="44" cy="-132" r="44" fill="var(--tr2)"/><circle cx="12" cy="-200" r="40" fill="var(--tr2)"/></g>';
}
function lamp(x){
  return '<g><ellipse class="glow" cx="'+x+'" cy="'+(G - 236)+'" rx="70" ry="70" fill="url(#stWg)"/>'+
    '<rect x="'+(x - 4)+'" y="'+(G - 230)+'" width="8" height="230" rx="4" fill="var(--ink)"/>'+
    '<path d="M'+(x - 18)+' '+(G - 226)+'h36l-8 -22h-20z" fill="var(--ink)"/><circle cx="'+x+'" cy="'+(G - 222)+'" r="8" fill="var(--win)"/></g>';
}
function quadPts(x1, y1, x2, y2, sag, n){
  const cx = (x1 + x2) / 2, cy = Math.max(y1, y2) + sag, pts = [];
  for (let i = 1; i < n; i++){ const t = i / n; pts.push([(1-t)*(1-t)*x1 + 2*(1-t)*t*cx + t*t*x2, (1-t)*(1-t)*y1 + 2*(1-t)*t*cy + t*t*y2]); }
  return {d:'M'+x1+' '+y1+'Q'+cx+' '+cy+' '+x2+' '+y2, pts};
}
function lights(x1, y1, x2, y2, sag, n, cls){
  const q = quadPts(x1, y1, x2, y2, sag, n), cols = ['#ffd27a', '#ff9db0', '#9fe3ff', '#c6ff8a'];
  return '<g class="'+(cls || '')+'"><path d="'+q.d+'" stroke="var(--ink)" stroke-width="2.5" fill="none"/>'+
    q.pts.map((p, i) => '<ellipse class="glow" cx="'+f1(p[0])+'" cy="'+f1(p[1] + 8)+'" rx="22" ry="22" fill="url(#stWg)"/><circle class="tw" style="animation-delay:-'+f1(i * .37 % 3)+'s" cx="'+f1(p[0])+'" cy="'+f1(p[1] + 8)+'" r="6" fill="'+cols[i % 4]+'"/>').join('')+'</g>';
}
function bunting(x1, y1, x2, y2, sag, n, cls){
  const q = quadPts(x1, y1, x2, y2, sag, n), cols = ['var(--p1)', 'var(--p3)', 'var(--p2)', 'var(--p4)', 'var(--p5)', 'var(--p6)'];
  return '<g class="'+(cls || '')+'"><path d="'+q.d+'" stroke="var(--ink)" stroke-width="2.5" fill="none"/>'+
    q.pts.map((p, i) => '<path d="M'+f1(p[0] - 14)+' '+f1(p[1])+'h28l-14 30z" fill="'+cols[i % 6]+'"/>').join('')+'</g>';
}
function balloons(x, y, cls){
  const cols = ['var(--p1)', 'var(--p3)', 'var(--p2)', 'var(--p5)'];
  return '<g class="'+(cls || '')+'">'+cols.map((c, i) => { const bx = x + (i - 1.5) * 26, by = y - 40 - (i % 2) * 34;
    return '<g class="float" style="animation-delay:-'+(i * .7)+'s"><path d="M'+bx+' '+(by + 34)+'Q'+(bx + 6)+' '+(by + 80)+' '+x+' '+(y + 70)+'" stroke="var(--ink)" stroke-width="1.6" fill="none"/>'+
      '<ellipse cx="'+bx+'" cy="'+by+'" rx="24" ry="30" fill="'+c+'"/><ellipse cx="'+(bx - 8)+'" cy="'+(by - 10)+'" rx="6" ry="9" fill="#fff" opacity=".35"/></g>'; }).join('')+'</g>';
}
function sign(x, y, w, key, cls){
  return '<g class="'+(cls || '')+'"><rect x="'+(x - w / 2)+'" y="'+(y - 26)+'" width="'+w+'" height="52" rx="12" fill="var(--sign)" stroke="var(--ink)" stroke-width="3"/>'+
    '<text data-sign="'+key+'" x="'+x+'" y="'+(y + 10)+'" text-anchor="middle" fill="var(--signink)" style="font:800 28px var(--f-label)"></text></g>';
}

/* ---------- the layers ---------- */
function farLayer(){
  seed = 11;
  let s = '<path d="M-50 720 L-50 470 Q120 380 300 430 Q420 330 560 400 Q700 300 860 410 Q1000 360 1150 420 Q1320 330 1500 400 Q1680 340 1850 420 Q2050 350 2250 410 Q2450 330 2650 420 Q2850 360 3100 430 L3100 720Z" fill="var(--m1)"/>';
  // a TV tower on the far hill, its light blinks at night
  s += '<g><path d="M700 304 L690 404 M700 304 L710 404 M693 360 h14 M690 330 h20" stroke="var(--m2)" stroke-width="5" fill="none"/><rect x="697" y="254" width="6" height="52" fill="var(--m2)"/>'+
    '<circle class="dn-n tw" cx="700" cy="252" r="5" fill="#ff5b5b"/></g>';
  // fortress walls on the next hill
  s += '<path d="M1440 410 v-34 h14 v10 h12 v-10 h14 v10 h12 v-10 h14 v34 M1520 402 v-60 h26 v60" fill="var(--m2)" opacity=".9"/>';
  let st = '';
  for (let i = 0; i < 260; i++){ const x = R() * 3100, y = -700 + R() * 1130, r = .8 + R() * 2; st += '<circle'+(i % 4 ? '' : ' class="tw" style="animation-delay:-'+f1(R() * 3)+'s"')+' cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(r)+'" fill="#fff"/>'; }
  s += '<g class="dn-n">'+st+'<path d="M2100 80 l40 22" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>';
  let cl = '';
  for (let i = 0; i < 9; i++){ const x = i * 360 + R() * 120, y = (i % 3 ? 90 : -260) + R() * 160, k = .7 + R() * .6;
    cl += '<g transform="translate('+f1(x)+' '+f1(y)+') scale('+f1(k)+')"><ellipse cx="0" cy="0" rx="70" ry="26" fill="var(--cloud)"/><circle cx="-24" cy="-16" r="28" fill="var(--cloud)"/><circle cx="18" cy="-24" r="34" fill="var(--cloud)"/></g>'; }
  s += '<g class="dn-d"><g class="drift">'+cl+'</g></g>';
  return s;
}
function midLayer(){
  seed = 23;
  let s = '<path d="M-50 780 L-50 600 Q200 520 420 580 Q640 500 880 570 Q1100 520 1320 590 Q1560 510 1800 580 Q2050 520 2300 590 Q2550 510 2800 580 Q3050 520 3300 590 Q3600 520 3900 590 Q4150 540 4400 600 L4400 780Z" fill="var(--m2)"/>';
  // little houses on the hills
  for (let i = 0; i < 70; i++){
    const x = 40 + i * 62 + R() * 30, base = 600 + Math.sin(i * .9) * 22 + R() * 30, w = 26 + R() * 18, h = 22 + R() * 20;
    const c = ['var(--hA)', 'var(--hB)', 'var(--hC)', 'var(--hD)', 'var(--hE)'][i % 5];
    s += '<rect x="'+f1(x)+'" y="'+f1(base - h)+'" width="'+f1(w)+'" height="'+f1(h + 20)+'" fill="'+c+'"/><path d="M'+f1(x - 4)+' '+f1(base - h)+'l'+f1(w / 2 + 4)+' -14l'+f1(w / 2 + 4)+' 14z" fill="var(--rf)"/>'+
      (R() < .7 ? '<rect class="win" x="'+f1(x + w / 2 - 4)+'" y="'+f1(base - h + 8)+'" width="8" height="9" rx="1.5"/>' : '');
  }
  // the cable car
  s += '<path d="M260 560 L1700 300" stroke="var(--ink)" stroke-width="2.5" opacity=".6"/><g><g transform="translate(-22 0)"><path d="M22 0 v18" stroke="var(--ink)" stroke-width="3"/>'+
    '<rect x="0" y="18" width="44" height="34" rx="8" fill="var(--p1)"/><rect class="win" x="7" y="24" width="30" height="14" rx="3"/></g>'+
    '<animateMotion dur="30s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear" path="M260 560 L1700 300"/></g>';
  s += '<path d="M-50 820 L-50 700 Q300 650 650 700 Q1000 660 1350 710 Q1700 650 2050 705 Q2400 660 2750 710 Q3100 660 3450 705 Q3800 660 4150 710 L4400 700 L4400 820Z" fill="var(--m3)"/>';
  return s;
}
function mainLayer(){
  seed = 41;
  let s = '<rect x="-200" y="'+G+'" width="'+(W + 400)+'" height="'+(H - G + 40)+'" fill="var(--gr)"/>'+
    '<rect x="-200" y="'+(G + 52)+'" width="'+(W + 400)+'" height="50" fill="var(--road)"/>'+
    '<path d="M-200 '+(G + 77)+'H'+(W + 200)+'" stroke="var(--road2)" stroke-width="6" stroke-dasharray="40 34"/>';
  [1000, 2000, 3000, 4000].forEach(x => { s += lamp(x); });

  /* prologue: Nini's house with a carved wooden balcony */
  s += '<g data-sc="0">'+house(60, 230, 330, 'var(--hB)', {cols:2, rows:3, rh:60})+
    house(360, 420, 430, 'var(--hA)', {cols:3, rows:3, rh:96, ww:46, wh:58, door:true, dark:.15})+
    peep(575, G - 262, {b:'standing/Dancer', h:'LongHair', f:'BigSmile', tp:'var(--p3)', pa:'var(--p2)', cls:'nini'})+
    // balcony
    '<rect x="330" y="'+(G - 262)+'" width="480" height="16" rx="4" fill="var(--wd)"/>'+
    '<g>'+Array.from({length:21}, (_, i) => '<rect x="'+(338 + i * 22.6)+'" y="'+(G - 330)+'" width="7" height="70" rx="3" fill="var(--wd2)"/>').join('')+'</g>'+
    '<rect x="330" y="'+(G - 338)+'" width="480" height="14" rx="5" fill="var(--wd)"/>'+
    '<path d="M342 '+(G - 246)+'v246M798 '+(G - 246)+'v246" stroke="var(--wd)" stroke-width="12"/>'+
    // flower pots on the rail
    [380, 450, 690, 760].map((x, i) => '<g><rect x="'+(x - 16)+'" y="'+(G - 364)+'" width="32" height="26" rx="4" fill="var(--hC)"/><circle cx="'+(x - 8)+'" cy="'+(G - 372)+'" r="9" fill="'+['var(--p1)','var(--p3)','var(--p5)','var(--p6)'][i]+'"/><circle cx="'+(x + 8)+'" cy="'+(G - 374)+'" r="9" fill="var(--tr)"/></g>').join('')+
    // a cat on the rail: eyes open and glowing at night, closed by day
    '<g transform="translate(800 '+(G - 338)+')"><path d="M18 0 Q48 -6 40 -40" stroke="var(--ink)" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-20" rx="22" ry="20" fill="var(--ink)"/>'+
    '<circle cx="-6" cy="-48" r="15" fill="var(--ink)"/><path d="M-19 -54l2 -16 10 9zM7 -54l-2 -16 -10 9z" fill="var(--ink)"/>'+
    '<g class="dn-n"><circle cx="-11" cy="-49" r="3" fill="#ffe27a"/><circle cx="-1" cy="-49" r="3" fill="#ffe27a"/></g><g class="dn-d"><path d="M-14 -48h6M-4 -48h6" stroke="#f4ecdf" stroke-width="2" stroke-linecap="round"/></g></g>'+
    lights(330, G - 336, 810, G - 336, 34, 12, 'dn-n')+tree(930, .9)+'</g>';

  /* chapter 1: school by day, library by night */
  s += '<g data-sc="1">'+house(1170, 600, 420, 'var(--hD)', {roof:'flat', cols:3, rows:2, ww:96, wh:96, wtop:70, gy:60, door:true, dark:.6, frame:'var(--rf2)'})+
    '<path d="M1150 '+(G - 436)+'L1470 '+(G - 540)+'L1790 '+(G - 436)+'Z" fill="var(--rf2)"/>'+
    '<circle cx="1470" cy="'+(G - 470)+'" r="26" fill="var(--sign)" stroke="var(--ink)" stroke-width="3"/><path d="M1470 '+(G - 488)+'v18l12 8" stroke="var(--ink)" stroke-width="3.5" fill="none" stroke-linecap="round"/>'+
    sign(1470, G - 404, 230, 'school', 'dn-d')+sign(1470, G - 404, 270, 'library', 'dn-n')+
    // the late reader in the lit window, with a desk lamp
    '<g class="dn-n"><ellipse cx="1644" cy="'+(G - 300)+'" rx="120" ry="110" fill="url(#stWg)" opacity=".8"/>'+
      '<clipPath id="stWin"><rect x="1596" y="'+(G - 350)+'" width="96" height="96" rx="6"/></clipPath><g clip-path="url(#stWin)">'+
      peep(1636, G - 250, {b:'effigy/Paper', h:'Bun', f:'Calm', s:1.1, tp:'var(--p5)', sk:'var(--s2)'})+'</g>'+
      '<path d="M1600 '+(G - 256)+'h88" stroke="var(--wd)" stroke-width="6"/><path d="M1678 '+(G - 258)+'v-26l-14 -12" stroke="var(--ink)" stroke-width="3" fill="none"/><path d="M1654 '+(G - 300)+'l16 -8 6 14z" fill="var(--ink)"/></g>'+
    // the class out front by day
    '<g class="dn-d">'+peep(1250, G, {b:'standing/ShirtColorTee', h:'Pomp', f:'Smile', tp:'var(--p2)', sk:'var(--s2)'})+
      peep(1360, G, {b:'standing/Dancer', h:'Bun', f:'SmileLOL', s:.72, tp:'var(--p6)', pa:'var(--p2)'})+
      peep(1440, G, {b:'standing/WalkingColorTee', h:'Afro', f:'BigSmile', s:.7, tp:'var(--p4)', sk:'var(--s3)'})+
      peep(1560, G, {b:'standing/ShirtColorTee', h:'ShortOne', f:'Cute', s:.72, tp:'var(--p5)', flip:true})+
      peep(1650, G, {b:'standing/EasingColorTee', h:'MediumBangs', f:'LoveGrinTeeth', s:.68, tp:'var(--p1)', jk:'var(--p3)', sk:'var(--s2)'})+'</g>'+
    tree(1880, 1)+'<g class="dn-n" transform="translate(1900 '+(G - 222)+')"><ellipse cx="0" cy="0" rx="18" ry="24" fill="var(--wd)"/><circle cx="-7" cy="-6" r="6" fill="#fff3c0"/><circle cx="7" cy="-6" r="6" fill="#fff3c0"/><circle cx="-7" cy="-6" r="2.5" fill="#1a1320"/><circle cx="7" cy="-6" r="2.5" fill="#1a1320"/><path d="M-3 2l3 5 3 -5z" fill="var(--hF)"/></g></g>';

  /* chapter 2: a studio's first day by day, a bakery's night shift by night */
  s += '<g data-sc="2">'+house(2150, 540, 360, 'var(--hE)', {roof:'flat', cols:3, rows:2, ww:80, wh:80, wtop:70, gy:50, door:true, chimney:true, dark:.2})+
    sign(2420, G - 404, 230, 'studio', 'dn-d')+sign(2420, G - 404, 230, 'bakery', 'dn-n')+
    '<g class="dn-n"><ellipse class="steam" cx="2554" cy="'+(G - 470)+'" rx="18" ry="14" fill="#c9c3e0" opacity=".5"/><ellipse class="steam" style="animation-delay:-1.4s" cx="2560" cy="'+(G - 470)+'" rx="14" ry="12" fill="#c9c3e0" opacity=".5"/>'+
      '<ellipse cx="2240" cy="'+(G - 110)+'" rx="90" ry="70" fill="url(#stWo)"/></g>'+
    bunting(2300, G - 140, 2540, G - 140, 30, 8, 'dn-d')+lights(2300, G - 140, 2540, G - 140, 30, 8, 'dn-n')+
    sign(2420, G - 290, 270, 'hello', 'dn-d')+
    '<g class="dn-d">'+peep(2300, G, {b:'standing/Dancer', h:'Wavy', f:'BigSmile', tp:'var(--p4)', pa:'var(--pt)', sk:'var(--s2)'})+
      peep(2550, G, {b:'standing/Dancer', h:'LongCurly', f:'SmileLOL', tp:'var(--p6)', pa:'var(--p4)', sk:'var(--s3)', flip:true})+'</g>'+
    '<g class="dn-n">'+peep(2300, G, {b:'standing/Doc', h:'Beanie', f:'BigSmile', tp:'var(--p2)', jk:'#fffaf0', ac:'#fffaf0', pa:'var(--pt)', sk:'var(--s2)', cls:'baker'})+'</g>'+
    '<g class="dn-d">'+peep(2420, G, {b:'standing/EasingColorTee', h:'ShortTwo', f:'Smile', tp:'var(--p3)', jk:'var(--p2)', cls:'newbie'})+'</g>'+
    '<g class="dn-n">'+peep(2420, G, {b:'standing/WalkingColorTee', h:'LongHair', f:'Cute', tp:'var(--p5)', sk:'var(--s2)', cls:'newbie'})+'</g>'+
    balloons(2478, G - 150, 'dn-d')+
    '<g class="dn-n">'+peep(2550, G, {b:'standing/Doc', h:'Beanie', f:'SmileLOL', tp:'var(--p6)', jk:'#fffaf0', ac:'#fffaf0', pa:'var(--pt)', sk:'var(--s3)', flip:true})+
      '<g transform="translate(2600 '+(G - 90)+')"><ellipse cx="0" cy="0" rx="30" ry="14" fill="#d99a4e"/><path d="M-16 -4l6 8M-4 -6l6 8M8 -5l6 8" stroke="#a8692c" stroke-width="3" stroke-linecap="round"/></g></g>'+
    tree(2820, .95)+'</g>';

  /* chapter 3: a café brand game by day, a night market by night */
  s += '<g data-sc="3">'+house(3100, 440, 320, 'var(--hB)', {roof:'flat', cols:2, rows:1, ww:110, wh:90, wtop:40, door:true, dark:.1})+
    sign(3320, G - 360, 180, 'cafe')+
    // striped awning
    '<g>'+Array.from({length:10}, (_, i) => '<path d="M'+(3090 + i * 46)+' '+(G - 214)+'h46v40a23 23 0 0 1 -46 0z" fill="'+(i % 2 ? 'var(--awn2)' : 'var(--awn1)')+'"/>').join('')+'</g>'+
    // tables with people playing on their phones
    [3260, 3660].map((tx, k) => stool(tx - 62)+stool(tx + 62)+
      peep(tx - 66, G, {b:k ? 'sitting/OneLegColorTee' : 'sitting/MidColorTee', h:k ? 'Bangs' : 'Afro', f:k ? 'Cheeky' : 'SmileLOL', tp:k ? 'var(--p5)' : 'var(--p4)', sk:k ? 'var(--s1)' : 'var(--s3)'})+
      peep(tx + 66, G, {b:k ? 'sitting/CrossedLegs' : 'sitting/ClosedLegsColorTee', h:k ? 'BunTwo' : 'LongHair', f:k ? 'BigSmile' : 'LoveGrinTeeth', tp:k ? 'var(--p3)' : 'var(--p1)', jk:'var(--p2)', sk:'var(--s2)', flip:true})+
      '<rect x="'+(tx - 44)+'" y="'+(G - 84)+'" width="88" height="10" rx="5" fill="var(--wd)"/><rect x="'+(tx - 4)+'" y="'+(G - 76)+'" width="8" height="76" fill="var(--wd)"/>'+
      '<path d="M'+(tx - 14)+' '+(G - 84)+'v-14h16v14z" fill="var(--sign)"/><ellipse class="steam dn-n" cx="'+(tx - 6)+'" cy="'+(G - 106)+'" rx="6" ry="8" fill="#fff" opacity=".6"/>').join('')+
    // the gift by day
    '<g class="dn-d" transform="translate(3470 '+G+')"><rect x="-30" y="-54" width="60" height="54" rx="6" fill="var(--p1)"/><rect x="-36" y="-66" width="72" height="16" rx="5" fill="var(--p1)"/><rect x="-6" y="-66" width="12" height="66" fill="var(--p3)"/>'+
      '<path d="M0 -66q-28 -26 -24 -2M0 -66q28 -26 24 -2" stroke="var(--p3)" stroke-width="7" fill="none" stroke-linecap="round"/></g>'+
    // night market stalls with lanterns
    '<g class="dn-n">'+[3780, 3930].map((x, i) => '<g><path d="M'+(x - 66)+' '+(G - 170)+'L'+x+' '+(G - 214)+'L'+(x + 66)+' '+(G - 170)+'Z" fill="'+(i ? 'var(--p2)' : 'var(--p1)')+'"/>'+
      '<rect x="'+(x - 60)+'" y="'+(G - 90)+'" width="120" height="90" fill="var(--wd)"/><path d="M'+(x - 58)+' '+(G - 170)+'v80M'+(x + 58)+' '+(G - 170)+'v80" stroke="var(--wd)" stroke-width="7"/>'+
      '<ellipse class="glow" cx="'+x+'" cy="'+(G - 130)+'" rx="70" ry="50" fill="url(#stWg)"/><g class="sway"><path d="M'+x+' '+(G - 170)+'v12" stroke="var(--ink)" stroke-width="2"/><ellipse cx="'+x+'" cy="'+(G - 140)+'" rx="16" ry="20" fill="#ff6b5b"/></g>'+
      (i ? '<text data-sign="tea" x="'+x+'" y="'+(G - 40)+'" text-anchor="middle" fill="var(--sign)" style="font:800 20px var(--f-label)"></text>' : '<circle cx="'+(x - 20)+'" cy="'+(G - 98)+'" r="10" fill="#ffb347"/><circle cx="'+(x + 6)+'" cy="'+(G - 98)+'" r="10" fill="#ff7a59"/><circle cx="'+(x + 30)+'" cy="'+(G - 98)+'" r="10" fill="#c6ff8a"/>')+'</g>').join('')+
      peep(3855, G, {b:'standing/Dancer', h:'LongCurly', f:'SmileLOL', tp:'var(--p6)', pa:'var(--p2)', sk:'var(--s1)'})+'</g>'+
    lights(3110, G - 240, 3990, G - 240, 60, 16, 'dn-n')+'</g>';

  /* chapter 4: the long table, by day in a garden, by night under fireworks */
  s += '<g data-sc="4">'+tree(4080, 1.05)+tree(4930, 1.1)+
    '<path d="M4170 '+G+'V'+(G - 360)+'M4830 '+G+'V'+(G - 360)+'" stroke="var(--wd)" stroke-width="12" stroke-linecap="round"/>'+
    bunting(4170, G - 350, 4830, G - 350, 70, 14, 'dn-d')+lights(4170, G - 350, 4830, G - 350, 70, 16, 'dn-n')+
    balloons(4130, G - 260, 'dn-d')+balloons(4870, G - 270, 'dn-d')+
    [4250, 4335, 4420, 4505, 4590, 4675, 4755].map((x, i) => peep(x, G - 54, {s:1.55,
      b:['effigy/Coffee','effigy/PointingUp','effigy/Explaining','effigy/PointingUp','effigy/Coffee','effigy/Tee','effigy/PointingUp'][i],
      h:['Wavy','ShortOne','Afro','LongHair','Bun','Pomp','LongCurly'][i], f:['BigSmile','SmileLOL','LoveGrinTeeth','BigSmile','Cute','SmileLOL','EatingHappy'][i],
      tp:['var(--p1)','var(--p2)','var(--p3)','var(--p4)','var(--p5)','var(--p6)','var(--p2)'][i], sk:['var(--s1)','var(--s2)','var(--s3)'][i % 3], flip:i > 3})).join('')+
    '<rect x="4200" y="'+(G - 80)+'" width="600" height="18" rx="6" fill="var(--cloth)" stroke="var(--ink)" stroke-width="2"/><path d="M4210 '+(G - 62)+'h580v14q-290 22 -580 0z" fill="var(--cloth)"/>'+
    '<path d="M4230 '+(G - 50)+'V'+G+'M4770 '+(G - 50)+'V'+G+'" stroke="var(--wd)" stroke-width="10"/>'+
    [4260, 4380, 4500, 4620, 4740].map((x, i) => i % 2 ? '<path d="M'+(x - 10)+' '+(G - 80)+'q-6 -26 4 -34h12q10 8 4 34z" fill="var(--hC)"/>' : '<ellipse cx="'+x+'" cy="'+(G - 84)+'" rx="22" ry="6" fill="var(--sign)"/><circle cx="'+(x - 6)+'" cy="'+(G - 90)+'" r="6" fill="var(--p6)"/><circle cx="'+(x + 6)+'" cy="'+(G - 90)+'" r="6" fill="var(--p4)"/>').join('')+
    '</g>';
  return s;
}
function nearLayer(){
  seed = 77;
  let s = '';
  for (let x = -100; x < 8600; x += 70 + R() * 60){
    const y = 1000 - R() * 30;
    s += '<path d="M'+f1(x)+' '+f1(y + 30)+'q5 -34 10 0q5 -42 10 0q5 -30 10 0z" fill="var(--gr2)"/>';
    if (R() < .45) s += '<g class="dn-d"><circle cx="'+f1(x + 30)+'" cy="'+f1(y - 4)+'" r="7" fill="'+['var(--p1)','var(--p3)','#fff','var(--p5)'][Math.floor(R() * 4)]+'"/><circle cx="'+f1(x + 30)+'" cy="'+f1(y - 4)+'" r="2.5" fill="var(--p3)"/></g>';
    if (R() < .35) s += '<g class="dn-n"><circle class="glow" cx="'+f1(x + 20)+'" cy="'+f1(700 + R() * 200)+'" r="16" fill="url(#stWg)"/><circle class="tw" style="animation-delay:-'+f1(R() * 3)+'s" cx="'+f1(x + 20)+'" cy="'+f1(700 + R() * 200)+'" r="3" fill="#fff6a0"/></g>';
  }
  return s;
}

/* ---------- the flight ---------- */
const TGT = [[612, G - 430], [1468, G - 300], [2440, G - 200], [3262, G - 112], [4500, G - 104]];
const CAM = [560, 1480, 2440, 3420, 4500];
const seg = i => { const a = TGT[i], b = TGT[i + 1]; return [a, [(a[0] + b[0]) / 2, 140 + (i % 2) * 60], b]; };
const bez = (p, t) => { const u = 1 - t; return [u*u*p[0][0] + 2*u*t*p[1][0] + t*t*p[2][0], u*u*p[0][1] + 2*u*t*p[1][1] + t*t*p[2][1]]; };
const bezD = (p, t) => [2*(1-t)*(p[1][0]-p[0][0]) + 2*t*(p[2][0]-p[1][0]), 2*(1-t)*(p[1][1]-p[0][1]) + 2*t*(p[2][1]-p[1][1])];
function flightPath(){ let d = 'M' + TGT[0].join(' '); for (let i = 0; i < 4; i++){ const p = seg(i); d += 'Q' + p[1].join(' ') + ' ' + p[2].join(' '); } return d; }
const PLANE = '<g id="stPlane"><g class="plane-in"><ellipse class="dn-n" cx="-6" cy="4" rx="46" ry="34" fill="url(#stWg)"/>'+
  '<path d="M-38 -4 L36 -16 L-14 10 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>'+
  '<path d="M-14 10 L36 -16 L-6 22 Z" fill="var(--paperf)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>'+
  '<g class="dn-n"><path d="M-6 22v12" stroke="var(--ink)" stroke-width="1.5"/><rect x="-12" y="32" width="12" height="15" rx="4" fill="#ffb347"/><circle cx="-6" cy="39" r="3" fill="#fff6d0"/></g></g></g>';

/* ---------- build ---------- */
svg.setAttribute('viewBox', '0 0 1000 1000');
svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
svg.innerHTML = '<defs><radialGradient id="stWg"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".85"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>'+
  peepDefs()+'<radialGradient id="stWo"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient></defs>'+
  '<g id="stFar">'+farLayer()+'</g><g id="stMid">'+midLayer()+'</g><g id="stMain">'+mainLayer()+
  '<path d="'+flightPath()+'" fill="none" stroke="var(--paper)" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round" opacity=".7"/>'+PLANE+'<g id="stFx"></g></g><g id="stNear">'+nearLayer()+'</g>';
const L = {far:svg.querySelector('#stFar'), mid:svg.querySelector('#stMid'), near:svg.querySelector('#stNear')};
const plane = svg.querySelector('#stPlane'), fx = svg.querySelector('#stFx');
const DEPTH = {far:.18, mid:.45, near:1.25};

const cards = document.getElementById('stCards'), dots = sec.querySelector('.st-dots'), orb = document.getElementById('stOrb'), tip = sec.querySelector('.st-orb-tip');
orb.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">'+
  '<g class="sun"><g class="rays">'+Array.from({length:12}, (_, i) => '<path d="M50 6v12" stroke="#ffb52e" stroke-width="6" stroke-linecap="round" transform="rotate('+(i * 30)+' 50 50)"/>').join('')+'</g>'+
  '<circle cx="50" cy="50" r="27" fill="#ffd23f" stroke="#ffb52e" stroke-width="3"/><circle cx="41" cy="47" r="3" fill="#6b3d12"/><circle cx="59" cy="47" r="3" fill="#6b3d12"/>'+
  '<path d="M40 57q10 9 20 0" stroke="#6b3d12" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="34" cy="55" r="4" fill="#ff8f6b" opacity=".6"/><circle cx="66" cy="55" r="4" fill="#ff8f6b" opacity=".6"/></g>'+
  '<g class="moon"><circle cx="50" cy="50" r="40" fill="#fff2c4" opacity=".12"/><path d="M62 18a32 32 0 1 0 20 46a26 26 0 1 1 -20 -46z" fill="#fff2c4"/>'+
  '<path d="M40 52q5 4 10 0M30 58q4 3 8 0" stroke="#8a7a52" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="36" cy="40" r="3" fill="#e8d9a6"/>'+
  '<path d="M84 22l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#fff"/><path d="M14 80l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="#fff"/></g></svg>';

const langNow = () => document.documentElement.lang === 'en' ? 'en' : 'ka';
const nightNow = () => { const a = document.documentElement.getAttribute('data-theme'); if (a === 'dark') return true; if (a === 'light') return false; return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
let night = nightNow(), active = -1;

function renderText(){
  const D = T[langNow()], story = night ? D.night : D.day;
  sec.setAttribute('aria-label', D.label);
  cards.innerHTML = story.map((c, i) => '<article class="st-card'+(i === active ? ' on' : '')+'" data-i="'+i+'"><p class="k"><i>'+(i ? i : '★')+'</i>'+esc(D.kick[i])+'</p><h2>'+esc(c[0])+'</h2><p>'+esc(c[1])+'</p>'+
    (i === 4 ? '<div class="row"><a class="st-btn" href="#play">'+esc(D.play)+ARR+'</a><a class="st-btn ghost" href="#goal">'+esc(D.goal)+'</a></div>' : '')+'</article>').join('');
  dots.innerHTML = story.map((_, i) => '<li><button type="button" data-go="'+i+'" aria-label="'+esc(D.dot+' '+(i + 1))+'"'+(i === active ? ' aria-current="step"' : '')+'></button></li>').join('');
  sec.querySelector('.st-skip').textContent = D.skip;
  sec.querySelector('.st-hint span').textContent = D.hint;
  tip.textContent = night ? D.tipNight : D.tipDay;
  orb.setAttribute('aria-label', night ? D.orbNight : D.orbDay);
  svg.querySelectorAll('[data-sign]').forEach(t => { t.textContent = D.signs[t.dataset.sign]; });
}
function applyNight(){
  const n = nightNow(); if (n === night && pin.classList.contains('ready')) return;
  night = n; pin.classList.toggle('is-night', night); pin.classList.add('ready'); renderText();
  if (active >= 0) celebrate(active);
}

/* ---------- camera ---------- */
let vw = 1000, vh = 1000, y0 = 0, camX = 0, cNow = 0;
const ease = f => { const t = Math.min(1, Math.max(0, (f - .2) / .6)); return t * t * (3 - 2 * t); };
function measure(){
  const r = pin.getBoundingClientRect(), asp = r.width / Math.max(1, r.height);
  vw = Math.min(W, Math.max(1000 * asp, asp < .8 ? 780 : 0));   // phones see more of the town, with more sky above
  vh = vw / asp; y0 = 1000 - Math.max(1000, vh); vh = Math.max(1000, vh);
}
function frame(){
  const r = sec.getBoundingClientRect(), span = sec.offsetHeight - pin.offsetHeight;
  const p = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
  const c = Math.min(4, p * 4 / .9), i = Math.min(3, Math.floor(c)), ce = i + ease(c - i);
  cNow = ce;
  const shift = vw > 1150 ? vw * .14 : 0;
  const cx = CAM[i] + (CAM[i + 1] - CAM[i]) * (ce - i);
  camX = Math.min(W - vw, Math.max(0, cx - vw / 2 - shift));
  svg.setAttribute('viewBox', f1(camX) + ' ' + f1(y0) + ' ' + f1(vw) + ' ' + f1(vh));
  for (const k in L) L[k].setAttribute('transform', 'translate(' + f1(camX * (1 - DEPTH[k])) + ' 0)');
  const sg = seg(i), t = ce - i, pt = bez(sg, t), d = bezD(sg, t);
  const ang = Math.max(-35, Math.min(35, Math.atan2(d[1], d[0]) * 180 / Math.PI));
  plane.setAttribute('transform', 'translate(' + f1(pt[0]) + ' ' + f1(pt[1]) + ') rotate(' + f1(ang) + ')');
  const k = Math.round(c), on = Math.abs(c - k) < .22 ? k : -1;
  if (on !== active){
    active = on;
    cards.querySelectorAll('.st-card').forEach(el => el.classList.toggle('on', +el.dataset.i === on));
    dots.querySelectorAll('button').forEach(b => { if (+b.dataset.go === on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    if (on >= 0) celebrate(on);
  }
  pin.classList.toggle('moved', p > .02);
}
let raf = 0;
const queue = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; frame(); }); };

/* ---------- joy: jumps, confetti, sparkles, coupons, fireworks ---------- */
const COLS_D = ['#e8475b', '#f2b33d', '#3f7fd9', '#36a77a', '#8d5bd6', '#ff8a3d'];
const COLS_N = ['#ffd27a', '#fff6d0', '#ff9db0', '#9fe3ff', '#c6ff8a'];
function el(tag, attrs){ const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
function burst(x, y, n, kind){
  if (reduced()) return;
  for (let i = 0; i < n; i++){
    const cols = night ? COLS_N : COLS_D, c = cols[i % cols.length];
    let e;
    if (kind === 'star') e = el('path', {d:'M0 -12l3.5 7.5 8 1 -6 5.5 1.5 8 -7 -4 -7 4 1.5 -8 -6 -5.5 8 -1z', fill:c});
    else if (kind === 'heart') e = el('path', {d:'M0 6 C-14 -4 -8 -16 0 -9 C8 -16 14 -4 0 6z', fill:night ? '#ff9db0' : '#e8475b'});
    else if (kind === 'coupon') { e = el('g', {}); e.appendChild(el('rect', {x:-16, y:-10, width:32, height:20, rx:4, fill:c})); const t = el('text', {x:0, y:5, 'text-anchor':'middle', fill:'#fff', style:'font:800 13px var(--f-label)'}); t.textContent = '%'; e.appendChild(t); }
    else if (night) e = el('circle', {r:2 + Math.random() * 3, fill:c});
    else e = el('rect', {x:-5, y:-3, width:10, height:6, rx:1.5, fill:c});
    fx.appendChild(e);
    const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * (kind === 'big' ? 220 : 130);
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 60, rot = Math.random() * 720 - 360, dur = 1100 + Math.random() * 900;
    const up = kind === 'heart' || kind === 'star';
    e.animate([
      {transform:'translate(' + x + 'px,' + y + 'px) rotate(0deg) scale(.4)', opacity:1},
      {transform:'translate(' + (x + dx * .7) + 'px,' + (y + dy * .7) + 'px) rotate(' + rot / 2 + 'deg) scale(1)', opacity:1, offset:.45},
      {transform:'translate(' + (x + dx) + 'px,' + (y + dy + (up ? -60 : 140)) + 'px) rotate(' + rot + 'deg) scale(.8)', opacity:0}
    ], {duration:dur, easing:'cubic-bezier(.2,.7,.4,1)'}).onfinish = () => e.remove();
  }
}
function firework(x, y){
  if (reduced()) return;
  const c = COLS_N[Math.floor(Math.random() * COLS_N.length)], n = 22;
  for (let i = 0; i < n; i++){
    const a = i / n * Math.PI * 2, v = 70 + Math.random() * 30, e = el('circle', {r:3.2, fill:c});
    fx.appendChild(e);
    e.animate([{transform:'translate(' + x + 'px,' + y + 'px)', opacity:1}, {transform:'translate(' + (x + Math.cos(a) * v) + 'px,' + (y + Math.sin(a) * v + 30) + 'px)', opacity:0}],
      {duration:1300, easing:'cubic-bezier(.1,.8,.3,1)'}).onfinish = () => e.remove();
  }
  const flash = el('circle', {cx:x, cy:y, r:60, fill:'url(#stWg)'}); fx.appendChild(flash);
  flash.animate([{opacity:.9}, {opacity:0}], {duration:700}).onfinish = () => flash.remove();
}
let fwT = 0;
function celebrate(k){
  svg.querySelectorAll('[data-sc="' + k + '"] .pp').forEach((p, i) => { setTimeout(() => jump(p), i * 90); });
  const [x, y] = TGT[k];
  if (k === 1) burst(x, y - 40, 14, night ? 'star' : 'star');
  else if (k === 3) burst(x, y - 30, night ? 10 : 12, night ? 'heart' : 'coupon');
  else burst(x, y - 20, k === 4 ? 46 : 24, k === 4 ? 'big' : '');
  clearInterval(fwT);
  if (k === 4 && night) fwT = setInterval(() => { if (active !== 4 || !night || !visible) return clearInterval(fwT);
    firework(4180 + Math.random() * 640, 180 + Math.random() * 200); }, 700);
}
function jump(p){ p.classList.remove('jump'); void p.getBBox(); p.classList.add('jump'); setTimeout(() => p.classList.remove('jump'), 1500); }
svg.addEventListener('click', e => {
  const r = svg.getBoundingClientRect(), sc = r.width / vw;
  const x = camX + (e.clientX - r.left) / sc, y = y0 + (e.clientY - r.top) / sc;
  const p = e.target.closest('.pp');
  if (p){ jump(p); burst(x, y - 20, 8, 'heart'); }
  else if (night && y < 500) firework(x, y);
  else burst(x, y, 14, '');
});

/* ---------- controls ---------- */
orb.addEventListener('click', () => { const b = document.getElementById('themeBtn'); if (b) b.click(); });
dots.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (!b) return;
  const span = sec.offsetHeight - pin.offsetHeight, top = sec.getBoundingClientRect().top + scrollY;
  scrollTo({top: top + (+b.dataset.go / 4) * .9 * span + 2, behavior: reduced() ? 'auto' : 'smooth'}); });
let visible = true;
if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(sec);
new MutationObserver(() => { applyNight(); renderText(); }).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme', 'lang']});
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyNight);
window.addEventListener('scroll', queue, {passive:true});
window.addEventListener('resize', () => { measure(); queue(); });
night = !nightNow(); applyNight();
measure(); frame();
})();
