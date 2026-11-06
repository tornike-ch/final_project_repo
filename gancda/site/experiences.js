/* gancda experiences: the goal gallery, the report and the demo player.
   Every goal opens a different kind of demo (see demos.js); goals with several demos get a selector. */
(() => {
  'use strict';
  const p = (ka, en) => ({ ka, en });
  const ui = {
    heading: p('ითამაშეთ მაგალითი', 'Play an example'),
    intro: p('აირჩიეთ მიზანი და ითამაშეთ მაგალითი თქვენი აუდიტორიის თვალით.', 'Choose a goal and play an example from your audience’s side.'),
    goals: p('გამოცდილების მიზანი', 'Experience goal'),
    play: p('მაგალითის თამაში', 'Play the example'),
    request: p('მინდა მსგავსი პროექტი', 'Build one for us'),
    audience: p('ვისთვის', 'Audience'),
    outcome: p('შედეგი', 'Outcome'),
    mechanic: p('როგორ თამაშობენ', 'How it plays'),
    example: p('მაგალითი', 'Example'),
    reportTitle: p('რას გიყვებათ შედეგები?', 'What can you learn after launch?'),
    sample: p('საჩვენებელი ანგარიში · პირობითი ციფრები', 'Example report · illustrative numbers'),
    close: p('დახურვა', 'Close'),
    restart: p('თავიდან დაწყება', 'Play again'),
    preview: p('ცოცხალი გადახედვა', 'Live preview'),
    steps: p('როგორ მიდის', 'How it unfolds'),
    sound: p('ხმა', 'Sound'),
    tapOpen: p('შეეხე გასახსნელად', 'Tap to open'),
    now: p('ახლა', 'now'),
    feel: p('ეს არის განცდა.', 'That’s the feeling.'),
    want: p('გინდათ მსგავსი თქვენი აუდიტორიისთვის?', 'Want one like this for your audience?'),
    illustrative: p('საჩვენებელი ანგარიში · პირობითი ციფრები', 'Example report · illustrative numbers'),
    keep: p('თამაშის გაგრძელება', 'Keep playing'),
  };
  /* the lock-screen notification each demo arrives with: just a phone and a link */
  const notes = {
    build: p('UMI აკადემია: პირველი ცვლის გაკვეთილი მზადაა.', 'UMI Academy: your first-shift lesson is ready.'),
    spot: p('სასტუმრო ლილა: ოთახი 214 სტუმრის მოსვლამდე უნდა მოამზადო.', 'Hotel Lila: room 214 needs you before the guest arrives.'),
    swipe: p('სახლი · სამზარეულო: 45 წამი, 6 სიტუაცია. მზად ხარ?', 'Sakhli Kitchen: 45 seconds, six situations. Ready?'),
    buddy: p('ნინო, Orbita: გამარჯობა, გიორგი! 👋', 'Nino, Orbita: Hi Giorgi! 👋'),
    map: p('ბაზარი: ორშაბათს იწყებ. გაიარე მაღაზია ახლავე.', 'Bazari: you start on Monday. Take the store tour now.'),
    scratch: p('ცისკარი: ფხეკის ბარათი გელოდება ☕', 'Tsiskari: a scratch card is waiting for you ☕'),
    seats: p('Meridian: 1 მოსაწვევი', 'Meridian: 1 invitation'),
    omakase: p('ლუკა: შენთვის რაღაც პატარა დავჯავშნე.', 'Luka: I booked a little something for you.'),
  };
  const cases = {
    learn: {
      label: p('სწავლება', 'Learning'),
      title: p('სწავლება, რომელსაც ბოლომდე გადიან', 'Training people actually finish.'),
      audience: p('რესტორნის, სასტუმროს და სამზარეულოს გუნდები', 'Restaurant, hotel and kitchen teams'), outcome: p('ცოდნის შემოწმება და სერტიფიკატი', 'A knowledge check and a certificate'),
      report: p('ნახეთ, რამდენმა თანამშრომელმა დაასრულა გაკვეთილი და რა ქულა მიიღეს.', 'See how many team members finished the lesson and how they scored.'),
      metrics: [[p('დაასრულა გაკვეთილი', 'Finished the lesson'),'42','/ 50'],[p('საშუალო ქულა','Average score'),'3.4','/ 4'],[p('საშუალო დრო','Average time'),'4.6',p('წთ','min')],[p('სერტიფიკატი','Certificates earned'),'42','']],
      demos: ['build', 'spot', 'swipe'],
    },
    onboard: {
      label: p('ადაპტაცია','Onboarding'),
      title: p('გაიცანით გუნდი პირველ დღემდე', 'Meet the team before day one.'),
      audience: p('ახალი თანამშრომლები','New hires'), outcome: p('პირველი დღისთვის მზადყოფნა','First-day readiness'),
      report: p('პირველ შეხვედრამდე გაიგეთ, ვინ გაიცნო გუნდი და ვის სჭირდება დამატებითი დახმარება.', 'See who has met the team and checked the essentials before they arrive.'),
      metrics: [[p('მზადაა პირველი დღისთვის','Ready before day one'),'9','/ 10'],[p('გაიცნო გუნდი','Met the team'),'100','%'],[p('წესების ცოდნა','Rules check score'),'92','%'],[p('მიღებული სამკერდე ნიშანი','Badges earned'),'9','']],
      demos: ['buddy', 'map'],
    },
    engage: {
      label: p('კამპანია','Campaigns'),
      title: p('მიეცით მომხმარებელს თამაშის მიზეზი', 'Give customers a reason to play.'),
      audience: p('კაფის სტუმრები','Café customers'), outcome: p('დაბრუნება და კუპონის გამოყენება','Return visits and redeemed coupons'),
      report: p('ნახეთ, რამდენმა მოთამაშემ გამოიყენა კუპონი ან გაუზიარა ბმული სხვას.', 'Follow the campaign from the first play through to sharing the game and redeeming a coupon in store.'),
      metrics: [[p('ითამაშა','Played the game'),'1,240',''],[p('დაასრულა','Reached the end'),'71','%'],[p('გამოყენებული კუპონი','Coupons redeemed'),'318',''],[p('გააზიარა','Shares'),'204','']],
      demos: ['scratch'],
    },
    attend: {
      label: p('ღონისძიებები','Events'),
      title: p('მოსაწვევიდან სტუმრების სიამდე','Turn an invitation into a guest list.'),
      audience: p('ორგანიზატორები, რესტორნები და ყველა, ვისაც მოსაწვევი აქვს გასაგზავნი','Event hosts, restaurants and anyone with an invitation to send'), outcome: p('დასწრების დადასტურება','Guest confirmations'),
      report: p('დაგეგმეთ სუფრა და ტრანსფერი სტუმრების პასუხების მიხედვით. მაგალითში ნაჩვენებია გუნდური ვახშმის ანგარიში.', 'Plan the tables and transport around guests’ choices. This example shows a team dinner.'),
      metrics: [[p('გახსნა მოსაწვევი','Opened the invitation'),'118','/ 120'],[p('დაადასტურა დასწრება','Confirmed attendance'),'96',''],[p('აირჩია ადგილი და მენიუ','Picked a seat and menu'),'96',''],[p('მოითხოვა ტრანსფერი','Booked a transfer'),'31','']],
      demos: ['seats', 'omakase'],
    },
  };
  /* one line on what makes each demo different to play */
  const mechanics = {
    build: p('გადაიტანე ინგრედიენტები და ააწყე შეკვეთა', 'Drag ingredients to build each order'),
    spot: p('იპოვე შეცდომები ოთახში დროზე', 'Find the mistakes in a room against the clock'),
    swipe: p('გადაწიე ბარათები მარჯვნივ ან მარცხნივ', 'Swipe cards right or left'),
    buddy: p('ჩატი ბადისთან და თამაში „ვინ ვინაა“', 'A chat with your buddy and a memory game'),
    map: p('გახსენი ოთახები მაღაზიის რუკაზე', 'Open rooms on the store map'),
    scratch: p('გაფხეკე, შეაგროვე ბეჭდები, მიიღე კუპონი', 'Scratch, collect stamps, get a coupon'),
    seats: p('აირჩიე ადგილი დარბაზის გეგმაზე', 'Pick your seat on the floor plan'),
    omakase: p('გახსენი ფარდა და მიიღე ბილეთი', 'Open the curtain and get your ticket'),
  };
  const iconPaths = {
    learn: '<path d="M3 5c3-1 6-1 9 1.4C15 4 18 4 21 5v14c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 7v13"/>',
    onboard: '<circle cx="9" cy="8" r="3"/><path d="M2.5 20v-2a6.5 6.5 0 0 1 13 0v2M18 6v8m-4-4h8"/>',
    engage: '<path d="m4 11 14-6v14L4 14zM4 11c-2 0-2 3 0 3m3 .7L8.5 21H12l-2-5.3"/>',
    attend: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v5m10-5v5M3 11h18m-13 4h3"/>',
    play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke-linejoin="round"/>',
    open: '<path d="M6 18 18 6M7 6h11v11"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    undo: '<path d="M4 9a8 8 0 1 1 0 7m0-13v6h6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    soundOn: '<path d="M4 9.5h3.5L13 5v14l-5.5-4.5H4z"/><path d="M16.5 9a4.5 4.5 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
    soundOff: '<path d="M4 9.5h3.5L13 5v14l-5.5-4.5H4z"/><path d="m16.5 9.5 5 5m0-5-5 5"/>',
  };
  const icon = id => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + iconPaths[id] + '</svg>';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let lang = document.documentElement.lang === 'en' ? 'en' : 'ka';
  let active = 'learn';
  const pick = { learn: 'build', onboard: 'buddy', engage: 'scratch', attend: 'seats' };
  let modal, sourceFocus, preview = null, player = null;
  const t = text => typeof text === 'object' ? text[lang] : text;
  const keys = Object.keys(cases);
  const valid = key => Object.hasOwn(cases, key);
  const D = () => window.GancdaDemos;
  const info = id => (D() && D().info(id)) || { name: id, kind: '', tag: id, desc: '', brand: '', steps: [] };

  function renderGallery() {
    const mount = document.getElementById('play');
    if (!mount) return;
    if (preview && D()) { D().drop(preview); preview = null; }
    const c = cases[active], id = pick[active], d = info(id);
    const filters = keys.map(key => '<button type="button" data-xp-filter="' + key + '" aria-pressed="' + (key === active) + '">' + icon(key) + '<span>' + t(cases[key].label) + '</span></button>').join('');
    const options = c.demos.length > 1 ? '<label class="xp-format">' + t(ui.example) + '<select data-xp-variant>' + c.demos.map(k => '<option value="' + k + '"' + (k === id ? ' selected' : '') + '>' + esc(info(k).tag) + '</option>').join('') + '</select></label>' : '';
    mount.innerHTML = '<div class="wrap xp-section"><div class="xp-heading"><h2>' + t(ui.heading) + '</h2><p>' + t(ui.intro) + '</p></div>' +
      '<div class="xp-filters" role="group" aria-label="' + t(ui.goals) + '">' + filters + '</div>' +
      '<article class="xp-feature" data-case="' + active + '">' +
        '<div class="xp-poster" data-xp-play><span class="xp-posterhead"><b>' + esc(d.brand) + '</b><span>' + esc(d.name) + '</span></span>' +
          '<span class="xp-live"><i></i>' + t(ui.preview) + '</span>' +
          '<div class="xp-mini" inert aria-hidden="true"><div class="xp-screen" data-xp-preview></div></div>' +
          '<button type="button" class="xp-playdot" aria-label="' + t(ui.play) + ' · ' + esc(d.name) + '">' + icon('play') + '</button></div>' +
        '<div class="xp-brief"><div class="xp-case-label"><span></span>' + t(c.label) + ' · ' + esc(String(d.kind).split(' · ').pop()) + '</div><h3>' + t(c.title) + '</h3><p>' + esc(d.desc) + '</p>' +
          '<dl class="xp-details"><div><dt>' + t(ui.mechanic) + '</dt><dd>' + t(mechanics[id]) + '</dd></div><div><dt>' + t(ui.audience) + '</dt><dd>' + t(c.audience) + '</dd></div><div><dt>' + t(ui.outcome) + '</dt><dd>' + t(c.outcome) + '</dd></div></dl>' +
          options +
          '<div class="xp-actions"><button class="xp-btn" type="button" data-xp-play>' + icon('play') + t(ui.play) + '</button><a href="#request" data-xp-request>' + t(ui.request) + icon('open') + '</a></div></div>' +
      '</article></div>';
    const screen = mount.querySelector('[data-xp-preview]');
    if (screen && D()) preview = D().mount(screen, id);
  }

  function renderReport() {
    const mount = document.getElementById('report');
    if (!mount) return;
    const c = cases[active];
    const metrics = c.metrics.map(([label, value, unit]) => '<div class="xp-metric"><dt>' + t(label) + '</dt><dd>' + value + (unit ? '<small>' + t(unit) + '</small>' : '') + '</dd></div>').join('');
    mount.innerHTML = '<div class="wrap xp-report"><div class="xp-reportintro"><h2>' + t(ui.reportTitle) + '</h2><p>' + t(c.report) + '</p></div><div class="xp-dashboard" data-case="' + active + '"><header><div class="xp-dashboard-name">' + icon(active) + '<strong>' + esc(info(pick[active]).name) + '</strong></div><span class="xp-sample"><i></i>' + t(ui.sample) + '</span></header><dl>' + metrics + '</dl></div></div>';
  }

  /* ---------- the player: a full-screen stage in the demo's own light ---------- */
  let stageStep = 0, stageDone = false, outroTimer = 0;
  const two = n => String(n).padStart(2, '0');
  function lockTime() { const d = new Date(); return two(d.getHours()) + ':' + two(d.getMinutes()); }
  function lockDate() { try { return new Intl.DateTimeFormat(lang === 'ka' ? 'ka-GE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()); } catch (e) { return ''; } }
  function soundIcon() { const on = !D() || D().sound(); return '<span class="xs-ic">' + icon(on ? 'soundOn' : 'soundOff') + '</span>'; }

  function paintChrome() {
    if (!modal) return;
    const id = pick[active], d = info(id), c = cases[active];
    const steps = d.steps.map((x, i) => '<li class="' + (stageDone || i < stageStep ? 'done' : i === stageStep ? 'now' : '') + '"><i>' + icon('check') + '</i><span>' + esc(x) + '</span></li>').join('');
    modal.querySelector('.xs-brand').innerHTML = icon(active) + '<div><b>' + esc(d.brand) + '</b><span id="xp-dialog-title">' + esc(d.name) + '</span></div>';
    const snd = modal.querySelector('[data-xp-action="sound"]');
    snd.innerHTML = soundIcon(); snd.setAttribute('aria-pressed', String(!D() || D().sound())); snd.setAttribute('aria-label', t(ui.sound));
    modal.querySelector('.xp-close').setAttribute('aria-label', t(ui.close));
    modal.querySelector('.xs-rail').innerHTML = '<p class="xs-kicker">' + t(c.label) + ' · ' + esc(String(d.kind).split(' · ').pop()) + '</p><h2>' + esc(d.name) + '</h2><p class="xs-desc">' + esc(d.desc) + '</p>' +
      '<p class="xs-label">' + t(ui.steps) + '</p><ol class="xs-steps">' + steps + '</ol>' +
      '<div class="xs-actions"><button class="xs-link" type="button" data-xp-action="restart">' + icon('undo') + t(ui.restart) + '</button><a href="#request" class="xs-link" data-xp-action="request">' + t(ui.request) + icon('open') + '</a></div>';
    modal.querySelector('.xs-dots').innerHTML = d.steps.map((x, i) => '<i class="' + (stageDone || i < stageStep ? 'done' : i === stageStep ? 'now' : '') + '"></i>').join('');
    const lock = modal.querySelector('.xs-lock');
    if (lock) {
      lock.querySelector('.xs-time').textContent = lockTime();
      lock.querySelector('.xs-date').textContent = lockDate();
      lock.querySelector('.xs-note').innerHTML = '<span class="xs-app">' + esc(d.brand).charAt(0) + '</span><span class="xs-nt"><b>' + esc(d.brand) + '<small>' + t(ui.now) + '</small></b><span>' + esc(t(notes[id] || p('', ''))) + '</span></span>';
      lock.querySelector('.xs-hint').textContent = t(ui.tapOpen);
    }
    const m = c.metrics.slice(0, 2).map(([label, value, unit]) => '<div><dt>' + t(label) + '</dt><dd data-count="' + value + '">' + value + (unit ? '<small>' + t(unit) + '</small>' : '') + '</dd></div>').join('');
    modal.querySelector('.xs-outro').innerHTML = '<button type="button" class="xs-x" data-xp-action="keep" aria-label="' + t(ui.keep) + '">' + icon('close') + '</button><p class="xs-kicker">' + t(ui.feel) + '</p><h3>' + t(ui.want) + '</h3>' +
      '<dl class="xs-metrics">' + m + '</dl><p class="xs-note2">' + t(ui.illustrative) + '</p>' +
      '<div class="xs-outro-actions"><a href="#request" class="xs-cta" data-xp-action="request">' + t(ui.request) + icon('open') + '</a><button type="button" class="xs-link" data-xp-action="restart">' + icon('undo') + t(ui.restart) + '</button></div>';
  }

  function paintSteps() {
    if (!modal) return;
    modal.querySelectorAll('.xs-steps li').forEach((li, i) => { li.className = stageDone || i < stageStep ? 'done' : i === stageStep ? 'now' : ''; });
    modal.querySelectorAll('.xs-dots i').forEach((li, i) => { li.className = stageDone || i < stageStep ? 'done' : i === stageStep ? 'now' : ''; });
  }

  function countUp(root) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-count]').forEach(dd => {
      const raw = dd.dataset.count, target = parseFloat(raw.replace(/,/g, '')), dec = (raw.split('.')[1] || '').length, comma = raw.includes(',');
      const unit = dd.querySelector('small'), node = document.createTextNode('');
      if (isNaN(target) || reduce) return;
      dd.firstChild.replaceWith(node);
      const t0 = performance.now(), fmt = v => comma ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
      const tickN = now => { const k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3); node.textContent = fmt(target * e); if (k < 1) requestAnimationFrame(tickN); };
      requestAnimationFrame(tickN); void unit;
    });
  }

  function showOutro() {
    const o = modal && modal.querySelector('.xs-outro'); if (!o || !modal.open) return;
    o.hidden = false; modal.classList.add('outro'); countUp(o);
  }
  function hideOutro() { clearTimeout(outroTimer); const o = modal && modal.querySelector('.xs-outro'); if (o) o.hidden = true; modal && modal.classList.remove('outro'); }

  function unlock() {
    const lock = modal && modal.querySelector('.xs-lock'); if (!lock || lock.classList.contains('go')) return;
    if (D() && D().unlock) D().unlock();
    lock.classList.add('go'); modal.classList.add('live');
    setTimeout(() => { lock.remove(); const f = modal.querySelector('[data-xp-stage] button, [data-xp-stage] [tabindex="0"]'); if (f) f.focus({ preventScroll: true }); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650);
  }

  function renderPlayer() {
    const id = pick[active], col = (D() && D().colors && D().colors(id)) || { acc: '#C8B6FF', acc2: '#D7FF52' };
    stageStep = 0; stageDone = false; hideOutro();
    modal.dataset.case = active;
    modal.className = 'xp-dialog xp-stage';
    modal.style.setProperty('--sa', col.acc); modal.style.setProperty('--sb', col.acc2);
    modal.innerHTML = '<div class="xs-bg" aria-hidden="true"></div>' +
      '<header class="xs-top"><div class="xs-brand"></div><div class="xs-dots" aria-hidden="true"></div><div class="xs-tools"><button type="button" class="xs-icon" data-xp-action="sound"></button><button type="button" class="xs-icon xp-close" data-xp-action="done">' + icon('close') + '</button></div></header>' +
      '<aside class="xs-rail"></aside>' +
      '<div class="xs-center"><div class="xs-tilt"><div class="xp-phone"><div class="xp-screen" data-xp-stage></div>' +
        '<div class="xs-lock"><span class="xs-time"></span><span class="xs-date"></span><button type="button" class="xs-note" data-xp-action="unlock"></button><span class="xs-hint"></span></div>' +
      '</div></div></div>' +
      '<section class="xs-outro" hidden></section>';
    paintChrome();
    if (player && D()) D().drop(player);
    player = D() ? D().mount(modal.querySelector('[data-xp-stage]'), id) : null;
  }
  function choose(key) {
    if (!valid(key)) return;
    active = key;
    renderGallery();
    renderReport();
  }

  function launch(key) {
    if (!modal) init();
    if (!modal) return;
    sourceFocus = document.activeElement;
    if (valid(key) && active !== key) choose(key);
    renderPlayer();
    if (!modal.open) modal.showModal();
    document.documentElement.classList.add('xs-open');
    modal.querySelector('.xs-note').focus({ preventScroll: true });
  }

  function init() {
    if (modal || !document.body) return;
    const play = document.getElementById('play');
    if (!play) return;
    modal = document.createElement('dialog');
    modal.className = 'xp-dialog';
    modal.setAttribute('aria-labelledby', 'xp-dialog-title');
    document.body.append(modal);
    play.addEventListener('click', e => {
      const filter = e.target.closest('[data-xp-filter]');
      if (filter) {
        choose(filter.dataset.xpFilter);
        play.querySelector('[data-xp-filter="' + active + '"]').focus({ preventScroll: true });
        return;
      }
      if (e.target.closest('[data-xp-play]')) launch(active);
      if (e.target.closest('[data-xp-request]')) document.dispatchEvent(new CustomEvent('gancda:goal', { detail: active, bubbles: true }));
    });
    play.addEventListener('change', e => {
      if (e.target.matches('[data-xp-variant]') && cases[active].demos.includes(e.target.value)) {
        pick[active] = e.target.value;
        renderGallery(); renderReport();
        play.querySelector('[data-xp-variant]')?.focus({ preventScroll: true });
      }
    });
    modal.addEventListener('close', () => {
      document.documentElement.classList.remove('xs-open'); hideOutro();
      try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
      if (player && D()) { D().drop(player); player = null; }
      const target = sourceFocus && sourceFocus.isConnected ? sourceFocus : play.querySelector('[data-xp-play]');
      target?.focus({ preventScroll: true });
    });
    /* the rail ticks off each step as the visitor reaches it; the finale brings the outro */
    modal.addEventListener('gancda:step', e => {
      if (!e.detail) return;
      if (e.detail.n === 0 && stageStep > 0 && !stageDone) return;
      stageStep = e.detail.n; if (e.detail.n === 0) stageDone = false; paintSteps();
      const bg = modal.querySelector('.xs-bg'); if (bg && e.detail.n > 0) { bg.classList.remove('pulse'); void bg.offsetWidth; bg.classList.add('pulse'); }
    });
    modal.addEventListener('gancda:done', () => {
      stageDone = true; paintSteps(); modal.classList.add('won');
      clearTimeout(outroTimer); outroTimer = setTimeout(showOutro, 2600);
    });
    /* the phone leans towards the pointer, a little */
    modal.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const tilt = modal.querySelector('.xs-tilt'); if (!tilt) return;
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      tilt.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg'); tilt.style.setProperty('--gx', (50 + x * 60).toFixed(0) + '%');
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) return;
      const action = e.target.closest('[data-xp-action]')?.dataset.xpAction;
      if (action === 'done') modal.close();
      if (action === 'unlock') unlock();
      if (action === 'keep') hideOutro();
      if (action === 'sound' && D()) { D().sound(!D().sound()); paintChrome(); }
      if (action === 'restart' && player) { stageDone = false; stageStep = 0; hideOutro(); paintSteps(); player.reset(); }
      if (action === 'request') { document.dispatchEvent(new CustomEvent('gancda:goal', { detail: active, bubbles: true })); modal.close(); }
    });
    renderGallery();
    renderReport();
  }

  window.GancdaExperiences = {
    open: launch,
    select: choose,
    setLanguage(value) {
      lang = value === 'en' ? 'en' : 'ka';
      renderGallery();
      renderReport();
      if (modal?.open) paintChrome();
    },
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
