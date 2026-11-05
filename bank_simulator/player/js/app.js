/*
 * Player UI and session flow.
 *
 * Evaluation run: starts at level 1 and continues while levels are passed.
 * It ends when all levels are passed or a level is failed. Only this first
 * run is reported to the LMS. Afterwards the employee may practise without
 * limit (practice never overwrites the LMS score).
 */
(function () {
  'use strict';

  var Engine = window.Engine;
  var Scorm = window.Scorm;
  var Avatar = window.Avatar;

  var content = Engine.normalize(window.SIM_CONTENT || {});
  var cfg = content.config;
  var SKILLS = Engine.SKILLS;

  /* ---------------- Georgian UI strings ---------------- */
  var T = {
    skills: { knowledge: 'პროდუქტის ცოდნა', service: 'მომსახურება', sales: 'გაყიდვები' },
    channels: { branch: 'ფილიალი', phone: 'ტელეფონი', chat: 'ჩატი' },
    outcomes: {
      resolved: 'საკითხი მოგვარებულია',
      unresolved: 'საკითხი არ მოგვარდა',
      walkout: 'კლიენტი წავიდა',
      escalated: 'გადაეცა მენეჯერს'
    },
    walkout: {
      branch: 'კლიენტმა უკმაყოფილოდ დატოვა ფილიალი.',
      phone: 'კლიენტმა ზარი გათიშა.',
      chat: 'კლიენტმა ჩატი დატოვა.'
    },
    verdicts: { best: 'საუკეთესო', ok: 'მისაღები', poor: 'სუსტი', critical: 'კრიტიკული შეცდომა' },
    you: 'თქვენ',
    system: 'სისტემა',
    customer: 'კლიენტი'
  };

  /* ---------------- helpers ---------------- */
  var app = document.getElementById('app');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function byId(list) {
    var m = {};
    list.forEach(function (x) { m[x.id] = x; });
    return m;
  }

  var CASES = byId(content.cases);
  var QUIZ = byId(content.quiz);
  var PRODUCTS = byId(content.products);
  var LEVELS = cfg.levels;

  function fmtTime(sec) {
    sec = Math.round(sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  var ICONS = {
    branch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10 12 4l9 6v1H3zM5 12h2v6H5zm4 0h2v6H9zm4 0h2v6h-2zm4 0h2v6h-2zM3 19h18v2H3z" fill="currentColor"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11a3 3 0 0 1 3 3v15H7a2 2 0 0 1-2-2zm2 14v2h10v-2zM8 6v2h7V6z" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.4z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" fill="currentColor"/></svg>'
  };

  /* ---------------- theme ---------------- */
  /** Darken a brand colour until white text on it reaches WCAG AA (4.5:1). */
  function strongShade(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return hex;
    var rgb = [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); });
    function lum(c) {
      var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    }
    for (var k = 0; k < 30 && 1.05 / (lum(rgb) + 0.05) < 4.6; k++) rgb = rgb.map(function (x) { return Math.round(x * 0.93); });
    return '#' + rgb.map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  function applyTheme() {
    var t = cfg.theme;
    var r = document.documentElement.style;
    r.setProperty('--primary', t.primary);
    r.setProperty('--primary-dark', t.primaryDark);
    r.setProperty('--accent', t.accent);
    r.setProperty('--bg', t.background);
    r.setProperty('--primary-strong', strongShade(t.primary));
    r.setProperty('--accent-strong', strongShade(t.accent));
    document.title = t.productName + ' — ' + t.bankName;
  }

  /* ---------------- persistent state (suspend_data) ---------------- */
  var state;
  var studentName = '';
  var studentId = '';
  var detailKey;

  function emptyEval() { return { s: 'n', li: 0, st: [], i: 0, r: [], q: [], lv: [], n: 0, res: null }; }

  function loadState() {
    var raw = Scorm.get('cmi.suspend_data');
    var parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }
    state = parsed && parsed.v === 1 ? parsed : { v: 1, e: emptyEval(), p: { u: 0, n: 0 } };
    var status = Scorm.get('cmi.core.lesson_status');
    var scoreRaw = Scorm.get('cmi.core.score.raw');
    // The LMS holds a finished, scored attempt but our saved data is gone: keep the evaluation locked.
    // (A status without a score can come from an LMS that auto-completes on exit; that must not lock.)
    if (!parsed && /^(completed|passed|failed)$/.test(status) && scoreRaw !== '') {
      state.e.s = 'd';
      state.e.res = { o: Number(scoreRaw), lost: 1 };
      state.e.sent = 1;
    }
  }

  /** LMS launched us for browsing/review, or the attempt does not count. */
  function noCredit() {
    var mode = Scorm.get('cmi.core.lesson_mode');
    return mode === 'browse' || mode === 'review' || Scorm.get('cmi.core.credit') === 'no-credit';
  }

  function saveState() {
    var data = JSON.stringify(state);
    if (data.length > 4000) {
      // SCORM 1.2 limit is 4096 chars. First drop the replay strings of finished cases
      // (only the report detail is lost), keeping scores, level index and outcome.
      state.e.r = state.e.r.map(function (r) { return r.slice(0, 12); });
      data = JSON.stringify(state);
    }
    if (data.length > 4000) {
      state.e.r = state.e.r.map(function (r) { return r.slice(0, 10); });
      data = JSON.stringify(state);
    }
    Scorm.set('cmi.suspend_data', data);
    Scorm.commit();
  }

  function saveDetail(run) {
    try {
      var keep = run.caseResults.map(function (r) { return r.compact ? null : r; }).filter(Boolean);
      window.localStorage.setItem(detailKey, JSON.stringify({ cases: keep, quiz: run.quizResults }));
    } catch (e) { /* storage unavailable */ }
  }

  function loadDetail() {
    try {
      var raw = window.localStorage.getItem(detailKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* compact case result for suspend_data */
  function compactCase(r) {
    var crit = { knowledge: 0, service: 0, sales: 0 };
    r.criticals.forEach(function (c) { crit[c.skill] = (crit[c.skill] || 0) + 1; });
    return [r.caseId, r.earned.knowledge, r.earned.service, r.earned.sales, crit.knowledge, crit.service, crit.sales,
      r.lvl, r.seconds, (r.outcome || 'u').charAt(0), r.captured.length, r.ref.opens + r.ref.views,
      r.steps.map(function (st) { return st.option; }).join('')];
  }

  /** Re-runs recorded choices through the engine (resume / report after reload). */
  function replayCase(cs, choices) {
    var cr = new Engine.CaseRun(content, cs);
    for (var k = 0; k < choices.length; k++) {
      var node = cr.node();
      if (!node || node.end || !node.options[Number(choices.charAt(k))]) break;
      var r = cr.choose(Number(choices.charAt(k)));
      if (r.ended) break;
    }
    cr.steps.forEach(function (st) { st.latency = null; });
    return cr;
  }

  function expandCase(a) {
    var criticals = [];
    [['knowledge', a[4]], ['service', a[5]], ['sales', a[6]]].forEach(function (p) {
      for (var i = 0; i < (p[1] || 0); i++) criticals.push({ skill: p[0], reason: '' });
    });
    var o = { r: 'resolved', u: 'unresolved', w: 'walkout', e: 'escalated' }[a[9]] || 'resolved';
    var cs = CASES[a[0]];
    if (cs && a[12]) {
      try {
        var res = replayCase(cs, String(a[12])).result();
        // keep the scores that were reported; take the step detail from the replay
        res.earned = { knowledge: a[1], service: a[2], sales: a[3] };
        if (res.criticals.length !== criticals.length) res.criticals = criticals;
        res.lvl = a[7] || 0; res.seconds = a[8] || 0; res.outcome = o;
        res.ref = { opens: 0, searches: 0, views: a[11] || 0 };
        return res;
      } catch (e) { /* content changed: fall back to the summary */ }
    }
    return {
      caseId: a[0], level: cs ? cs.level : 0, lvl: a[7] || 0,
      earned: { knowledge: a[1], service: a[2], sales: a[3] },
      criticals: criticals, captured: [], steps: [], outcome: o, seconds: a[8] || 0,
      ref: { opens: 0, searches: 0, views: a[11] || 0 }, compact: true, channel: cs ? cs.channel : 'branch'
    };
  }

  /* ---------------- LMS reporting ---------------- */
  function sanitizeId(s) { return String(s).replace(/[^A-Za-z0-9_\-.]/g, '_').slice(0, 250); }

  function interaction(fields) {
    var i = state.e.n++;
    var p = 'cmi.interactions.' + i + '.';
    if (!Scorm.set(p + 'id', sanitizeId(fields.id), true)) {
      // index out of step with the LMS (e.g. it dropped stored interactions): append at _count
      var c = parseInt(Scorm.get('cmi.interactions._count'), 10);
      if (!isNaN(c) && c !== i) { i = c; state.e.n = c + 1; p = 'cmi.interactions.' + i + '.'; }
      Scorm.set(p + 'id', sanitizeId(fields.id));
    }
    Scorm.set(p + 'type', fields.type);
    Scorm.set(p + 'time', fields.time || Scorm.clock());
    if (fields.weighting != null) Scorm.set(p + 'weighting', fields.weighting);
    if (fields.pattern != null) Scorm.set(p + 'correct_responses.0.pattern', fields.pattern);
    Scorm.set(p + 'student_response', String(fields.response).slice(0, 255));
    Scorm.set(p + 'result', fields.result);
    if (fields.latency != null) Scorm.set(p + 'latency', Scorm.timespan(fields.latency / 1000));
  }

  function reportCaseInteractions(res) {
    var cs = CASES[res.caseId];
    res.steps.forEach(function (st) {
      var node = cs.nodes[st.node];
      var best = Engine.bestOption(node);
      interaction({
        id: res.caseId + '_' + st.node,
        type: 'choice',
        response: String.fromCharCode(97 + st.option),
        pattern: best ? String.fromCharCode(97 + node.options.indexOf(best)) : null,
        result: st.verdict === 'best' ? 'correct' : (st.verdict === 'critical' || st.verdict === 'poor') ? 'wrong' : 'neutral',
        latency: st.latency,
        time: st.at ? Scorm.clock(new Date(st.at)) : null,
        weighting: best ? Engine.optionTotal(best) : 0
      });
    });
    var mx = Engine.caseMax(cs);
    var crit = res.criticals.map(function (c) { return c.skill.charAt(0).toUpperCase(); }).join('');
    interaction({
      id: res.caseId + '_SUMMARY',
      type: 'fill-in',
      response: 'K' + res.earned.knowledge + '/' + mx.knowledge + ';S' + res.earned.service + '/' + mx.service +
        ';SA' + res.earned.sales + '/' + mx.sales + ';CRIT' + res.criticals.length + (crit ? '(' + crit + ')' : '') +
        ';OPP' + res.captured.length + '/' + cs.opportunities.length + ';OUT' + res.outcome + ';REF' + (res.ref.opens + res.ref.views) +
        ';T' + res.seconds + 's',
      result: 'neutral',
      latency: res.seconds * 1000
    });
  }

  function reportFinal(agg, levelsPassed, levelsAttempted) {
    Scorm.set('cmi.core.score.min', '0');
    Scorm.set('cmi.core.score.max', '100');
    Scorm.set('cmi.core.score.raw', String(agg.overall));
    var idx = 0;
    SKILLS.forEach(function (s) {
      var p = 'cmi.objectives.' + idx++ + '.';
      Scorm.set(p + 'id', s);
      Scorm.set(p + 'score.min', '0');
      Scorm.set(p + 'score.max', '100');
      if (agg.skills[s].pct != null) Scorm.set(p + 'score.raw', String(agg.skills[s].pct));
      Scorm.set(p + 'status', 'completed');
    });
    var lp = 'cmi.objectives.' + idx + '.';
    Scorm.set(lp + 'id', 'levels');
    Scorm.set(lp + 'score.min', '0');
    Scorm.set(lp + 'score.max', '100');
    Scorm.set(lp + 'score.raw', String(Math.round(levelsPassed / LEVELS.length * 100)));
    Scorm.set(lp + 'status', 'completed');
    var cp = 'cmi.objectives.' + (idx + 1) + '.';
    Scorm.set(cp + 'id', 'critical_errors');
    Scorm.set(cp + 'score.min', '0');
    Scorm.set(cp + 'score.max', '100');
    Scorm.set(cp + 'score.raw', String(Math.min(100, agg.criticals)));
    Scorm.set(cp + 'status', agg.criticals ? 'failed' : 'passed');
    interaction({
      id: 'SESSION_SUMMARY',
      type: 'fill-in',
      response: SKILLS.map(function (s) {
        var a = agg.skills[s];
        return { knowledge: 'K', service: 'S', sales: 'SA' }[s] + (a.pct == null ? 'na' : a.pct) + '(' + a.earned + '/' + a.max + ',n' + a.decisions + ')';
      }).join(';') + ';CRIT' + agg.criticals + ';LVL' + levelsPassed + '/' + LEVELS.length + ';TRIED' + levelsAttempted +
        ';CASES' + run.caseResults.length + ';T' + run.caseResults.reduce(function (t, r) { return t + (r.seconds || 0); }, 0) + 's',
      result: 'neutral'
    });
    var status = 'completed';
    if (cfg.scorm.statusMode === 'passed_failed') status = levelsPassed === LEVELS.length ? 'passed' : 'failed';
    Scorm.set('cmi.core.lesson_status', status);
    Scorm.commit();
  }

  /* ---------------- run (in memory) ---------------- */
  var run = null;      // current evaluation or practice run
  var current = null;  // current CaseRun
  var preview = null;  // builder preview target

  function newRun(mode, levelIndex) {
    return {
      mode: mode, levelIndex: levelIndex, steps: [], stepIndex: 0,
      caseResults: [], quizResults: [], levelResults: [], lvl: 0
    };
  }

  function levelSteps(li) {
    return Engine.buildLevelSteps(content, LEVELS[li]);
  }

  /* ---------------- screens ---------------- */
  function topbar(extra) {
    var t = cfg.theme;
    var opts = typeof extra === 'object' && extra ? extra : { html: extra };
    var mode = run ? (run.mode === 'eval' ? '<span class="pill pill-eval">' + ICONS.check + 'შეფასება · ითვლება</span>' : '<span class="pill pill-practice">პრაქტიკა · არ ითვლება</span>') : '';
    var lvName = run && LEVELS[run.levelIndex] ? 'დონე ' + LEVELS[run.levelIndex].id + ' · ' + LEVELS[run.levelIndex].name : '';
    var lvl = lvName && !opts.noLevel ? '<span class="pill" title="' + esc(lvName) + '">' + esc(lvName) + '</span>' : '';
    extra = opts.html;
    return '<header class="topbar">' +
      '<div class="brand"><span class="logo">' + esc(t.logoText) + '</span><span class="brand-text"><b>' + esc(t.bankName) + '</b><small>' + esc(t.productName) + '</small></span></div>' +
      '<div class="topbar-mid">' + mode + lvl + (extra || '') + '</div>' +
      '<div class="user">' + (studentName ? esc(studentName) : '') + '</div>' +
      '</header>' +
      (Scorm.isStandalone() ? '<div class="standalone-bar">სატესტო რეჟიმი: LMS არ არის დაკავშირებული, პროგრესი ინახება ამ ბრაუზერში. <button class="link" data-act="reset-local">თავიდან დაწყება</button></div>' : '');
  }

  var screenGen = 0;          // bumps on every screen change; stale timers check it
  var inputLockedUntil = 0;   // ignore answer/next clicks right after a screen changes (double-click guard)

  function lockInput() { inputLockedUntil = Date.now() + (window.SIM_FAST ? 0 : 350); }

  function render(html) {
    stopCallTimer();
    screenGen++;
    lockInput();
    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo(0, 0);
    var h = app.querySelector('h1');
    if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
  }

  function showWelcome() {
    run = null;
    var e = state.e;
    var t = cfg.theme;
    var body;
    var rules = '<ul class="rules">' +
      '<li>სიმულაცია შედგება <b>' + LEVELS.length + ' დონისგან</b>. თითოეულ დონეზე შემთხვევითად შეირჩევა კლიენტები' + (cfg.features.quiz ? ' და ცოდნის შემოწმების კითხვები' : '') + '.</li>' +
      '<li>ყოველ ნაბიჯზე აირჩიეთ პასუხი, რომელსაც კლიენტს ეტყოდით. შეფასდება სამი უნარი: <b>პროდუქტის ცოდნა, მომსახურება და გაყიდვები</b>.</li>' +
      '<li>შემდეგ დონეზე გადასასვლელად საჭიროა დონის გასვლის ზღვრის მიღწევა.</li>' +
      '<li>გამოიყენეთ კლიენტის პროფილი (CRM)' + (cfg.features.referencePanel ? ' და საცნობარო პანელი' : '') + ' — ისინი მინიშნებებს შეიცავს' + (cfg.features.referencePanel ? ' (საცნობაროს გამოყენება ფიქსირდება, ქულას არ ამცირებს)' : '') + '.</li>' +
      '<li>დრო შეზღუდული არ არის. პასუხის ხანგრძლივობა ფიქსირდება, მაგრამ ქულაზე გავლენას არ ახდენს.</li>' +
      '<li>უკუკავშირს და დეტალურ შედეგებს სესიის ბოლოს ნახავთ. შეფასების დროს გაცემული პასუხის შეცვლა შეუძლებელია.</li>' +
      '<li><b>შეფასებისთვის მხოლოდ პირველი მცდელობა ითვლება.</b> შემდეგ შეგიძლიათ შეუზღუდავად ივარჯიშოთ.</li>' +
      '</ul>';
    if (e.s !== 'd' && noCredit()) {
      body = '<p class="lead">კურსი გახსნილია ნახვის რეჟიმში — შეფასება ამ რეჟიმში არ ითვლება.</p>' +
        '<p class="muted">შეფასების გასავლელად კურსი LMS-დან ჩვეულებრივ რეჟიმში გახსენით. აქ შეგიძლიათ მხოლოდ ივარჯიშოთ.</p>' +
        '<div class="actions"><button class="btn btn-primary btn-lg" data-act="practice-menu">პრაქტიკა</button></div>';
    } else if (e.s === 'n') {
      body = '<p class="lead">მოგესალმებით' + (studentName ? ', ' + esc(firstName(studentName)) : '') + '! თქვენ მომსახურების ოპერატორის როლში ხართ.</p>' + rules +
        '<div class="actions"><button class="btn btn-primary btn-lg" data-act="start-eval">შეფასების დაწყება</button></div>';
    } else if (e.s === 'a') {
      var lv = LEVELS[e.li];
      body = '<p class="lead">შეფასება დაწყებულია. გააგრძელეთ იქიდან, სადაც შეჩერდით.</p>' +
        '<p class="muted">დონე ' + (lv ? lv.id + ' · ' + esc(lv.name) : '') + ', ნაბიჯი ' + Math.min(e.i + 1, e.st.length) + ' / ' + e.st.length + '. უკვე გაცემული პასუხები შენახულია და შეცვლა შეუძლებელია.</p>' + rules +
        '<div class="actions"><button class="btn btn-primary btn-lg" data-act="resume-eval">გაგრძელება</button></div>';
    } else {
      body = '<p class="lead">შეფასება დასრულებულია. შედეგი უკვე გაგზავნილია.</p>' + summaryTiles(e.res) +
        '<div class="actions">' +
        (e.res && !e.res.lost ? '<button class="btn" data-act="eval-report">დეტალური შედეგები</button>' : '') +
        '<button class="btn btn-primary btn-lg" data-act="practice-menu">პრაქტიკა</button></div>';
    }
    render(topbar() + '<main class="screen center"><section class="card welcome"><h1>' + esc(t.productName) + '</h1>' + body +
      '<p class="credits">კლიენტების ილუსტრაციები: Micah Lanier, „Avatar Illustration System“ (CC BY 4.0), DiceBear-ის მეშვეობით.</p></section></main>');
  }

  function firstName(n) {
    // SCORM 1.2 student_name is usually "Last, First"
    var parts = String(n).split(',');
    return (parts.length > 1 ? parts[1] : parts[0]).trim();
  }

  function summaryTiles(res) {
    if (!res) return '';
    if (res.lost) return res.o != null ? '<div class="tiles"><div class="tile"><span>საერთო ქულა</span><b>' + res.o + '%</b></div></div>' : '';
    return '<div class="tiles">' +
      '<div class="tile tile-main"><span>საერთო ქულა</span><b>' + res.o + '%</b></div>' +
      SKILLS.map(function (s) { var v = res[s.charAt(0) + (s === 'sales' ? 'a' : '')]; return '<div class="tile"><span>' + T.skills[s] + '</span><b>' + (v == null ? '—' : v + '%') + '</b></div>'; }).join('') +
      '</div><p class="muted">გავლილი დონეები: ' + res.lp + ' / ' + LEVELS.length + '</p>';
  }

  function showPracticeMenu() {
    run = null;
    var u = Math.min(state.p.u, LEVELS.length - 1);
    var cards = LEVELS.map(function (l, i) {
      var locked = i > u;
      return '<button class="level-card' + (locked ? ' locked' : '') + '" ' + (locked ? 'disabled' : 'data-act="start-practice" data-level="' + i + '"') + '>' +
        '<span class="level-num">' + (locked ? ICONS.lock : l.id) + '</span>' +
        '<span class="level-info"><b>' + esc(l.name) + '</b><small>' + esc(l.description || '') + '</small><small class="muted">' + l.casesPerRun + ' კლიენტი · ზღვარი ' + l.passThreshold + '%</small></span></button>';
    }).join('');
    render(topbar() + '<main class="screen center"><section class="card wide"><h1>პრაქტიკა</h1>' +
      '<p class="muted">პრაქტიკის შედეგები შეფასებაზე გავლენას არ ახდენს. დონე იხსნება წინა დონის გავლის შემდეგ.</p>' +
      '<div class="level-grid">' + cards + '</div>' +
      '<div class="actions"><button class="btn" data-act="home">მთავარი</button></div></section></main>');
  }

  function showLevelIntro() {
    var l = LEVELS[run.levelIndex];
    var nCases = run.steps.filter(function (s) { return s.charAt(0) === 'c'; }).length;
    var nQuiz = run.steps.length - nCases;
    render(topbar() + '<main class="screen center"><section class="card level-intro">' +
      '<div class="level-badge">' + l.id + '</div><h1>დონე ' + l.id + ': ' + esc(l.name) + '</h1>' +
      '<p class="lead">' + esc(l.description || '') + '</p>' +
      '<div class="tiles"><div class="tile"><span>კლიენტები</span><b>' + nCases + '</b></div>' +
      (nQuiz ? '<div class="tile"><span>ცოდნის კითხვები</span><b>' + nQuiz + '</b></div>' : '') +
      '<div class="tile"><span>გასვლის ზღვარი</span><b>' + l.passThreshold + '%</b></div></div>' +
      (run.mode === 'eval' ? '<p class="notice-eval">ეს შეფასებაა: პასუხები ითვლება და მათი შეცვლა შეუძლებელია.' +
        (cfg.scoring.criticalFailsLevel ? ' კრიტიკული შეცდომა (მაგ., წესების დარღვევა) დონის ჩაჭრას ნიშნავს.' : '') + '</p>' : '') +
      '<div class="actions"><button class="btn btn-primary btn-lg" data-act="next-step">დაწყება</button></div></section></main>');
  }

  /* ---------------- step flow ---------------- */
  function nextStep() {
    if (run.stepIndex >= run.steps.length) { finishLevel(); return; }
    var step = run.steps[run.stepIndex];
    var id = step.slice(2);
    if (step.charAt(0) === 'c' && CASES[id]) playCase(CASES[id]);
    else if (step.charAt(0) === 'q' && QUIZ[id]) playQuiz(QUIZ[id]);
    else { run.stepIndex++; nextStep(); } // content changed: skip missing item
  }

  function advance() {
    run.stepIndex++;
    if (run.mode === 'eval') {
      state.e.i = Math.max(state.e.i, run.stepIndex);
      if (LEVELS[run.levelIndex]) Scorm.set('cmi.core.lesson_location', 'L' + LEVELS[run.levelIndex].id + '-S' + run.stepIndex, true);
      saveState();
      saveDetail(run);
    }
    nextStep();
  }

  /* ---------------- case play ---------------- */
  var callTimer = null;
  function stopCallTimer() { if (callTimer) { clearInterval(callTimer); callTimer = null; } }

  function playCase(cs) {
    current = new Engine.CaseRun(content, cs);
    var ch = current.channel;
    var nCases = run.steps.filter(function (s) { return s.charAt(0) === 'c'; });
    var pos = nCases.indexOf('c:' + cs.id) + 1;
    var progress = '<span class="pill">კლიენტი ' + pos + ' / ' + nCases.length + '</span>';
    var refBtn = cfg.features.referencePanel ? '<button class="btn btn-ghost ref-toggle" data-act="ref-toggle" aria-expanded="false" aria-controls="ref-panel" aria-label="საცნობარო">' + ICONS.book + '<span>საცნობარო</span></button>' : '';
    render(topbar(progress + refBtn) +
      '<main class="ws ws-' + ch + '">' +
      '<h1 class="sr-only" tabindex="-1">კლიენტი ' + pos + ' / ' + nCases.length + ' — ' + T.channels[ch] + ': ' + esc(cs.brief || '') + '</h1>' +
      '<aside class="ws-left">' + customerCard(cs, ch) + crmPanel(cs) + '</aside>' +
      '<section class="ws-main">' +
      '<div class="ticket"><span class="ch-icon">' + ICONS[ch] + '</span><div><b>' + T.channels[ch] + '</b><span>' + esc(cs.brief || '') + '</span></div></div>' +
      '<div class="convo convo-' + ch + '" id="convo" role="log" aria-live="polite" aria-relevant="additions" aria-label="საუბარი"></div>' +
      '<div class="choices" id="choices" role="group" aria-labelledby="choices-label" tabindex="-1"></div>' +
      '</section>' +
      (cfg.features.referencePanel ? refPanel() : '') +
      '</main>');
    if (ch === 'phone') startCallTimer();
    var saved = run.mode === 'eval' && state.e.cur && state.e.cur[0] === cs.id ? String(state.e.cur[1] || '') : '';
    if (saved) resumeConversation(saved);
    else showNode(current.node(), true);
  }

  function startCallTimer() {
    var started = Date.now();
    callTimer = setInterval(function () {
      var el = document.getElementById('call-timer');
      if (el) el.textContent = fmtTime((Date.now() - started) / 1000);
    }, 1000);
  }

  function customerCard(cs, ch) {
    var c = cs.customer;
    var label = { branch: 'ფილიალის ვიზიტორი', phone: 'შემომავალი ზარი', chat: 'ონლაინ ჩატი' }[ch];
    var extra = ch === 'phone' ? '<div class="call-status" id="call-status"><span class="dot"></span>ზარი მიმდინარეობს' + (run && run.mode === 'eval' ? '' : ' · <span id="call-timer">0:00</span>') + '</div>' :
      ch === 'chat' ? '<div class="call-status" id="call-status"><span class="dot"></span>ონლაინ</div>' : '';
    return '<div class="cust-card cust-' + ch + '">' +
      '<div class="cust-avatar" id="cust-avatar">' + Avatar.render(c, current.mood, cs.id + c.name) + '</div>' +
      '<div class="cust-meta"><small>' + label + '</small><b>' + esc(c.name || T.customer) + '</b>' + extra + '</div></div>';
  }

  function crmRow(label, val) {
    if (val == null || val === '' || (Array.isArray(val) && !val.length)) return '';
    if (Array.isArray(val)) val = '<ul>' + val.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>';
    else val = esc(val);
    return '<div class="crm-row"><span>' + label + '</span><div>' + val + '</div></div>';
  }

  function crmPanel(cs) {
    var c = cs.customer;
    return '<div class="crm"><div class="crm-head">კლიენტის პროფილი (CRM)</div>' +
      '<div class="crm-tabs" role="tablist" aria-label="კლიენტის პროფილი">' +
      ['პროფილი', 'პროდუქტები', 'შენიშვნები'].map(function (lbl, i) {
        return '<button role="tab" id="crm-t' + i + '" aria-controls="crm-p' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '"' +
          (i === 0 ? ' class="active"' : '') + ' data-act="crm-tab" data-tab="' + i + '">' + lbl + '</button>';
      }).join('') + '</div>' +
      '<div class="crm-body" data-tab="0" role="tabpanel" id="crm-p0" aria-labelledby="crm-t0">' +
      crmRow('სახელი', c.name) + crmRow('ასაკი', c.age) + crmRow('სეგმენტი', c.segment) +
      crmRow('საქმიანობა', c.occupation) + crmRow('შემოსავალი', c.income) + crmRow('ციფრული არხები', c.digital) + '</div>' +
      '<div class="crm-body hidden" data-tab="1" role="tabpanel" id="crm-p1" aria-labelledby="crm-t1">' + (crmRow('აქტიური პროდუქტები', c.productsHeld) || '<p class="muted">მონაცემი არ არის</p>') + '</div>' +
      '<div class="crm-body hidden" data-tab="2" role="tabpanel" id="crm-p2" aria-labelledby="crm-t2">' + (c.notes ? '<p>' + esc(c.notes) + '</p>' : '<p class="muted">შენიშვნები არ არის</p>') + '</div>' +
      '</div>';
  }

  function refPanel() {
    return '<aside class="ref-panel" id="ref-panel" aria-hidden="true" aria-label="საცნობარო">' +
      '<div class="ref-head"><b>' + ICONS.book + ' საცნობარო</b><button class="icon-btn" data-act="ref-toggle" aria-label="დახურვა">' + ICONS.close + '</button></div>' +
      '<input type="search" id="ref-search" placeholder="ძიება: პროდუქტი, პირობა…" aria-label="ძიება საცნობაროში" autocomplete="off">' +
      '<div class="ref-list" id="ref-list">' + refList('') + '</div>' +
      '<div class="ref-detail hidden" id="ref-detail"></div></aside>';
  }

  function refList(q) {
    q = (q || '').toLowerCase();
    var groups = {};
    var order = [];
    content.products.forEach(function (p) {
      var hay = (p.name + ' ' + (p.short || '') + ' ' + (p.category || '') + ' ' + (p.conditions || []).map(function (c) { return c.label + ' ' + c.value; }).join(' ')).toLowerCase();
      if (q && hay.indexOf(q) < 0) return;
      var g = p.category || 'სხვა';
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(p);
    });
    if (!order.length) return '<p class="muted">ვერაფერი მოიძებნა</p>';
    return order.map(function (g) {
      return '<div class="ref-group"><small>' + esc(g) + '</small>' + groups[g].map(function (p) {
        return '<button class="ref-item" data-act="ref-view" data-id="' + esc(p.id) + '"><b>' + esc(p.name) + '</b><span>' + esc(p.short || '') + '</span></button>';
      }).join('') + '</div>';
    }).join('');
  }

  function refDetail(p) {
    return '<button class="link" data-act="ref-back">← უკან</button><h3>' + esc(p.name) + '</h3><p class="muted">' + esc(p.short || '') + '</p>' +
      '<table class="cond">' + (p.conditions || []).map(function (c) { return '<tr><th>' + esc(c.label) + '</th><td>' + esc(c.value) + '</td></tr>'; }).join('') + '</table>';
  }

  function addMsg(kind, html) {
    var convo = document.getElementById('convo');
    if (!convo) return;
    var div = document.createElement('div');
    div.className = 'msg msg-' + kind;
    div.innerHTML = html;
    convo.appendChild(div);
    convo.scrollTop = convo.scrollHeight;
  }

  function customerMsg(text) {
    var name = esc(current.cs.customer.name || T.customer);
    var mini = current.channel === 'chat' ? '<span class="mini-avatar">' + Avatar.render(current.cs.customer, current.mood, current.cs.id + current.cs.customer.name) + '</span>' : '';
    addMsg('customer', mini + '<div class="bubble"><small>' + name + '</small>' + esc(text) + '</div>');
  }

  function updateAvatar() {
    var el = document.getElementById('cust-avatar');
    if (el) el.innerHTML = Avatar.render(current.cs.customer, current.mood, current.cs.id + current.cs.customer.name);
  }

  function typing(cb, text) {
    var convo = document.getElementById('convo');
    if (!convo) return cb();
    var ind = document.createElement('div');
    ind.className = 'msg msg-customer typing';
    ind.innerHTML = '<div class="bubble"><span></span><span></span><span></span></div>';
    convo.appendChild(ind);
    convo.scrollTop = convo.scrollHeight;
    var delay = window.SIM_FAST ? 0 : Math.min(1300, 450 + String(text || '').length * 6);
    var gen = screenGen;
    var caseRun = current;
    setTimeout(function () {
      if (ind.parentNode) ind.parentNode.removeChild(ind);
      if (gen !== screenGen || caseRun !== current) return; // screen changed meanwhile
      cb();
    }, delay);
  }

  function showNode(node, first) {
    var choices = document.getElementById('choices');
    choices.innerHTML = '';
    if (node.system) addMsg('system', '<span>' + T.system + ':</span> ' + esc(node.system));
    typing(function () {
      updateAvatar();
      if (node.say) customerMsg(node.say);
      if (node.end) return endCase(node);
      renderOptions(node);
      current.markShown();
    }, node.say);
  }

  /** Rebuild the transcript of an interrupted conversation from saved choices. */
  function resumeConversation(choices) {
    for (var k = 0; k < choices.length; k++) {
      var node = current.node();
      var idx = Number(choices.charAt(k));
      if (!node || node.end || !node.options[idx]) break;
      if (node.system) addMsg('system', '<span>' + T.system + ':</span> ' + esc(node.system));
      if (node.say) customerMsg(node.say);
      addMsg('employee', '<div class="bubble"><small>' + T.you + '</small>' + esc(node.options[idx].text) + '</div>');
      var r = current.choose(idx);
      current.steps[current.steps.length - 1].latency = null;
      if (r.walkout) {
        updateAvatar();
        addMsg('system', '<span>' + T.system + ':</span> ' + T.walkout[current.channel]);
        return endCase(null);
      }
    }
    updateAvatar();
    addMsg('system', '<span>' + T.system + ':</span> საუბარი გაგრძელდა შეწყვეტის შემდეგ. წინა პასუხები შენახულია.');
    showNode(current.node());
  }

  function renderOptions(node) {
    var choices = document.getElementById('choices');
    var isProduct = node.type === 'product';
    var html = '<div class="choices-label" id="choices-label">' + (isProduct ? 'აირჩიეთ შესათავაზებელი პროდუქტი' : 'აირჩიეთ თქვენი პასუხი') + '</div>';
    html += '<div class="opt-list' + (isProduct ? ' opt-products' : '') + '">';
    var order = node.options.map(function (_, i) { return i; });
    if (cfg.features.shuffleOptions !== false && !window.SIM_NO_SHUFFLE) order = Engine.shuffle(order);
    order.forEach(function (i, pos) {
      var o = node.options[i];
      var p = o.product && PRODUCTS[o.product];
      html += '<button class="opt" data-act="choose" data-i="' + i + '"><span class="opt-key">' + String.fromCharCode(65 + pos) + '</span><span class="opt-text">' +
        (isProduct && p ? '<b class="opt-product">' + esc(p.name) + '</b>' : '') + esc(o.text) + '</span></button>';
    });
    html += '</div>';
    choices.innerHTML = html;
    awaitingChoice = true;
    lockInput();
  }

  var awaitingChoice = false;

  function choose(i) {
    if (!awaitingChoice || !current) return;
    var node = current.node();
    var opt = node.options[i];
    if (!opt) return;
    awaitingChoice = false;
    var chEl = document.getElementById('choices');
    if (chEl) chEl.focus({ preventScroll: true });
    chEl.innerHTML = '';
    addMsg('employee', '<div class="bubble"><small>' + T.you + '</small>' + esc(opt.text) + '</div>');
    var r = current.choose(i);
    if (run.mode === 'eval') {
      state.e.cur = [current.cs.id, current.steps.map(function (st) { return st.option; }).join('')];
      saveState();
    }
    if (r.walkout) {
      typing(function () {
        updateAvatar();
        addMsg('system', '<span>' + T.system + ':</span> ' + T.walkout[current.channel]);
        endCase(null);
      }, '');
      return;
    }
    showNode(r.node);
  }

  function endCase(node) {
    stopCallTimer();
    var res = current.result();
    res.lvl = run.lvl;
    run.caseResults.push(res);
    if (run.mode === 'eval') {
      state.e.r.push(compactCase(res));
      reportCaseInteractions(res);
      state.e.cur = null;
      state.e.i = run.stepIndex + 1; // this case can never be replayed
      saveState();
      saveDetail(run);
    }
    var cst = document.getElementById('call-status');
    if (cst) { cst.classList.add('ended'); cst.innerHTML = '<span class="dot"></span>' + (current.channel === 'phone' ? 'ზარი დასრულდა' : 'ჩატი დასრულდა'); }
    // neutral on purpose: no hint about how the conversation went until the session report
    document.getElementById('choices').innerHTML =
      '<div class="case-end"><span class="outcome outcome-neutral">საუბარი დასრულდა</span>' +
      '<button class="btn btn-primary" data-act="advance">' + (run.stepIndex + 1 < run.steps.length ? 'შემდეგი' : 'დონის დასრულება') + '</button></div>';
    lockInput();
    var btn = app.querySelector('[data-act="advance"]');
    if (btn) btn.focus();
  }

  /* ---------------- quiz ---------------- */
  var currentQuiz = null;

  function playQuiz(q) {
    currentQuiz = { q: q, shownAt: Date.now(), order: Engine.shuffle(q.options.map(function (_, i) { return i; })) };
    var nQ = run.steps.filter(function (s) { return s.charAt(0) === 'q'; });
    var pos = nQ.indexOf('q:' + q.id) + 1;
    render(topbar('<span class="pill">ცოდნის შემოწმება ' + pos + ' / ' + nQ.length + '</span>') +
      '<main class="screen center"><section class="card quiz"><small class="eyebrow">ცოდნის შემოწმება</small><h2>' + esc(q.question) + '</h2>' +
      '<div class="opt-list">' + currentQuiz.order.map(function (oi, k) {
        return '<button class="opt" data-act="quiz-answer" data-i="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + k) + '</span><span class="opt-text">' + esc(q.options[oi]) + '</span></button>';
      }).join('') + '</div></section></main>');
  }

  function answerQuiz(i) {
    if (!currentQuiz) return;
    var q = currentQuiz.q;
    var latency = Date.now() - currentQuiz.shownAt;
    var qr = { id: q.id, answer: i, correct: i === q.correct, points: q.points, lvl: run.lvl, latency: latency };
    run.quizResults.push(qr);
    if (run.mode === 'eval') {
      state.e.q.push([q.id, qr.correct ? 1 : 0, run.lvl]);
      state.e.i = run.stepIndex + 1;
      interaction({
        id: 'QUIZ_' + q.id, type: 'choice', response: String.fromCharCode(97 + i),
        pattern: String.fromCharCode(97 + q.correct), result: qr.correct ? 'correct' : 'wrong',
        latency: latency, weighting: q.points
      });
    }
    currentQuiz = null;
    advance();
  }

  /* ---------------- level & run end ---------------- */
  function levelAggregate(lvl) {
    return Engine.aggregate(content,
      run.caseResults.filter(function (r) { return r.lvl === lvl; }),
      run.quizResults.filter(function (q) { return q.lvl === lvl; }));
  }

  function finishLevel() {
    var l = LEVELS[run.levelIndex];
    var agg = levelAggregate(run.lvl);
    var verdict = Engine.levelPass(content, l, agg);
    var passed = verdict.passed;
    run.levelResults.push({ levelId: l.id, pct: agg.overall, passed: passed });
    if (passed) {
      state.p.u = Math.max(state.p.u, run.levelIndex + 1);
      if (run.mode === 'practice' && !preview) saveState();
    }
    var more = passed && run.levelIndex + 1 < LEVELS.length && !preview;
    if (run.mode === 'eval') {
      state.e.lv.push([l.id, agg.overall, passed ? 1 : 0]);
      if (more) {
        state.e.li = run.levelIndex + 1;
        state.e.st = levelSteps(state.e.li);
        state.e.i = 0;
        saveState();
      } else {
        finalizeEval(); // lock the result now, before the employee even opens the report
      }
    }
    var why = verdict.reasons.map(function (r) {
      if (r === 'threshold') return 'დონის ქულა ზღვარზე დაბალია';
      if (r === 'critical') return 'დაშვებულია კრიტიკული შეცდომა';
      return '„' + T.skills[r.slice(6)] + '“ მინიმალურ ზღვარზე (' + l.skillFloor + '%) დაბალია';
    });
    var verdictHtml = passed ? '<div class="level-result ok">' + ICONS.check + ' დონე გავლილია</div>' :
      '<div class="level-result bad">დონე ვერ გაიარეთ</div>' + (why.length ? '<p class="muted">მიზეზი: ' + why.join('; ') + '.</p>' : '');
    var next = more ? '<button class="btn btn-primary btn-lg" data-act="next-level">შემდეგი დონე</button>' :
      '<button class="btn btn-primary btn-lg" data-act="finish-run">შედეგების ნახვა</button>';
    render(topbar() + '<main class="screen center"><section class="card level-intro">' +
      '<div class="level-badge">' + l.id + '</div><h1>დონე ' + l.id + ': ' + esc(l.name) + '</h1>' + verdictHtml +
      (run.mode === 'eval' ? '' : '<div class="tiles"><div class="tile tile-main"><span>დონის ქულა</span><b>' + agg.overall + '%</b></div><div class="tile"><span>ზღვარი</span><b>' + l.passThreshold + '%</b></div></div>') +
      (more ? '<p class="muted">დეტალურ უკუკავშირს სესიის ბოლოს მიიღებთ.</p>' : '') +
      '<div class="actions">' + next + '</div></section></main>');
  }

  function nextLevel() {
    run.levelIndex++;
    run.lvl++;
    run.steps = run.mode === 'eval' ? state.e.st.slice() : levelSteps(run.levelIndex);
    run.stepIndex = 0;
    showLevelIntro();
  }

  function finalizeEval() {
    var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
    var levelsPassed = run.levelResults.filter(function (l) { return l.passed; }).length;
    state.e.s = 'd';
    state.e.res = {
      o: agg.overall, k: agg.skills.knowledge.pct, s: agg.skills.service.pct, sa: agg.skills.sales.pct,
      lp: levelsPassed, c: agg.criticals
    };
    state.e.cur = null;
    reportFinal(agg, levelsPassed, run.levelResults.length);
    saveState();
    if (Scorm.ok) { state.e.sent = 1; saveState(); }
    saveDetail(run);
  }

  function finishRun() {
    var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
    if (run.mode === 'practice' && !preview) {
      state.p.n++;
      saveState();
    }
    showReport(run, agg);
  }

  /* ---------------- report ---------------- */
  function bar(pct) {
    if (pct == null) return '<div class="bar na"><span style="width:0"></span></div>';
    var cls = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'low';
    return '<div class="bar ' + cls + '"><span style="width:' + pct + '%"></span></div>';
  }

  function showReport(r, agg) {
    var title = r.mode === 'eval' ? 'შეფასების შედეგები' : (preview ? 'წინასწარი ნახვა: შედეგები' : 'პრაქტიკის შედეგები');
    var skillCards = SKILLS.map(function (s) {
      var a = agg.skills[s];
      return '<div class="skill-card"><div class="skill-head"><span>' + T.skills[s] + '</span><b>' + (a.pct == null ? '—' : a.pct + '%') + '</b></div>' + bar(a.pct) +
        '<small class="muted">' + (a.max ? a.earned + ' / ' + a.max + ' ქულა · ' + a.decisions + ' შეფასებული გადაწყვეტილება' : 'ამ სესიაში არ შეფასებულა') +
        (a.criticals ? ' · <span class="crit-text">' + a.criticals + ' კრიტიკული შეცდომა</span>' : '') + '</small></div>';
    }).join('');

    var levels = r.levelResults.map(function (l) {
      var lv = LEVELS.filter(function (x) { return x.id === l.levelId; })[0] || {};
      return '<li class="' + (l.passed ? 'ok' : 'bad') + '"><b>დონე ' + l.levelId + ' · ' + esc(lv.name || '') + '</b><span>' + l.pct + '% ' + (l.passed ? '— გავლილია' : '— ვერ გაიარეთ') + '</span></li>';
    }).join('');

    var criticals = [];
    var missed = [];
    r.caseResults.forEach(function (res) {
      var cs = CASES[res.caseId];
      if (!cs) return;
      res.criticals.forEach(function (c) { if (c.reason) criticals.push('<li><b>' + esc(cs.title) + ':</b> ' + esc(c.reason) + ' <span class="tag">' + T.skills[c.skill] + '</span></li>'); });
      if (!res.compact) {
        cs.opportunities.forEach(function (o) {
          if (res.captured.indexOf(o.id) < 0) {
            var p = PRODUCTS[o.product];
            missed.push('<li><b>' + esc(cs.title) + ':</b> ' + esc(p ? p.name : o.product) + ' — <span class="muted">' + esc(o.cue || '') + '</span></li>');
          }
        });
      }
    });

    var cases = r.caseResults.map(function (res) { return caseReport(res); }).join('');
    var quiz = r.quizResults.length ? '<h2>ცოდნის შემოწმება</h2><div class="quiz-review">' + r.quizResults.map(function (q) {
      var qq = QUIZ[q.id];
      if (!qq) return '';
      return '<div class="qr ' + (q.correct ? 'ok' : 'bad') + '"><b>' + esc(qq.question) + '</b>' +
        '<div>თქვენი პასუხი: ' + esc(qq.options[q.answer] != null ? qq.options[q.answer] : '—') + (q.correct ? ' ' + ICONS.check : '') + '</div>' +
        (q.correct ? '' : '<div>სწორი პასუხი: <b>' + esc(qq.options[qq.correct]) + '</b></div>') +
        (qq.explanation ? '<small class="muted">' + esc(qq.explanation) + '</small>' : '') + '</div>';
    }).join('') + '</div>' : '';

    var refUse = r.caseResults.reduce(function (a, x) { return a + x.ref.opens + x.ref.views; }, 0);
    var totalTime = r.caseResults.reduce(function (a, x) { return a + x.seconds; }, 0);

    var buttons = preview ? '<button class="btn btn-primary" data-act="preview-restart">თავიდან</button>' :
      '<button class="btn" data-act="home">მთავარი</button><button class="btn btn-primary" data-act="practice-menu">პრაქტიკა</button>';

    render(topbar({ noLevel: true }) + '<main class="screen report"><section class="card wide">' +
      '<div class="report-head"><div><small class="eyebrow">' + (r.mode === 'eval' ? 'პირველი მცდელობა · იგზავნება LMS-ში' : 'არ იგზავნება LMS-ში') + '</small><h1>' + title + '</h1></div>' +
      '<div class="overall"><span>საერთო</span><b>' + agg.overall + '%</b></div></div>' +
      '<div class="skill-grid">' + skillCards + '</div>' +
      (levels ? '<h2>დონეები</h2><ul class="level-list">' + levels + '</ul>' : '') +
      (criticals.length ? '<h2>კრიტიკული შეცდომები</h2><ul class="crit-list">' + criticals.join('') + '</ul>' : '') +
      (missed.length ? '<h2>გამოტოვებული გაყიდვის შესაძლებლობები</h2><ul class="missed-list">' + missed.join('') + '</ul>' : '') +
      '<div class="review-head"><h2>საუბრების მიმოხილვა</h2><button class="btn btn-sm" data-act="expand-all">ყველას გაშლა</button></div>' + cases + quiz +
      '<p class="muted small">' + (cfg.features.referencePanel ? 'საცნობარო პანელის გამოყენება: ' + refUse + '-ჯერ. ' : '') +
      (cfg.features.showTimeInReport ? 'საუბრებში გატარებული დრო: ' + fmtTime(totalTime) + '.' : '') + '</p>' +
      '<div class="actions">' + buttons + '</div></section></main>');
  }

  function caseReport(res) {
    var cs = CASES[res.caseId];
    if (!cs) return '';
    var mx = Engine.caseMax(cs);
    var penalty = Number(cfg.scoring.criticalPenalty) || 0;
    var critBy = {};
    res.criticals.forEach(function (c) { critBy[c.skill] = (critBy[c.skill] || 0) + 1; });
    var pills = SKILLS.map(function (s) {
      var p = Engine.skillPct(res.earned[s], mx[s], critBy[s] || 0, penalty);
      return '<span class="mini-score">' + T.skills[s] + ': <b>' + (p == null ? '—' : p + '%') + '</b></span>';
    }).join('');
    var cls = { resolved: 'ok', escalated: 'warn', unresolved: 'bad', walkout: 'bad' }[res.outcome] || 'ok';
    var steps = res.compact ? '<p class="muted">დეტალური ჩანაწერი ამ საუბრისთვის მიუწვდომელია (სესია განახლდა სხვა მოწყობილობაზე/ბრაუზერში).</p>' :
      res.steps.filter(function (st) { return cs.nodes[st.node] && cs.nodes[st.node].options && cs.nodes[st.node].options[st.option]; }).map(function (st, idx) {
        var node = cs.nodes[st.node];
        var opt = node.options[st.option];
        var best = Engine.bestOption(node);
        return '<div class="step v-' + st.verdict + '"><div class="step-n">' + (idx + 1) + '</div><div class="step-body">' +
          (node.say ? '<div class="say"><small>' + T.customer + '</small>' + esc(node.say) + '</div>' : '') +
          '<div class="ans"><small>' + T.you + ' <span class="verdict">' + T.verdicts[st.verdict] + '</span>' +
          (cfg.features.showTimeInReport ? ' · ' + fmtTime(st.latency / 1000) : '') + '</small>' + esc(opt.text) + '</div>' +
          (opt.feedback ? '<div class="fb">' + esc(opt.feedback) + '</div>' : '') +
          (opt.critical && opt.critical.reason ? '<div class="fb crit-text">' + esc(opt.critical.reason) + '</div>' : '') +
          (st.verdict !== 'best' && best ? '<div class="best"><small>საუკეთესო პასუხი</small>' + esc(best.text) + '</div>' : '') +
          '</div></div>';
      }).join('');
    return '<details class="case-review"><summary><span class="ch-icon">' + ICONS[res.channel || cs.channel] + '</span><b>' + esc(cs.title) + '</b>' +
      '<span class="outcome outcome-' + cls + '">' + T.outcomes[res.outcome] + '</span><span class="pills">' + pills + '</span></summary>' +
      '<div class="steps">' + steps + '</div></details>';
  }

  /* ---------------- actions ---------------- */
  function startEval() {
    if (noCredit()) return showWelcome();
    state.e = emptyEval();
    state.e.s = 'a';
    state.e.st = levelSteps(0);
    if (Scorm.get('cmi.core.lesson_status') === 'not attempted' || !Scorm.get('cmi.core.lesson_status')) Scorm.set('cmi.core.lesson_status', 'incomplete');
    saveState();
    try { window.localStorage.removeItem(detailKey); } catch (e) { /* ignore */ }
    run = newRun('eval', 0);
    run.steps = state.e.st.slice();
    showLevelIntro();
  }

  function rebuildEvalRun() {
    var e = state.e;
    var r = newRun('eval', 0);
    var detail = loadDetail();
    var detailCases = detail && detail.cases ? detail.cases.slice() : [];
    r.caseResults = e.r.map(function (a) {
      for (var i = 0; i < detailCases.length; i++) {
        if (detailCases[i] && detailCases[i].caseId === a[0] && detailCases[i].lvl === (a[7] || 0)) return detailCases.splice(i, 1)[0];
      }
      return expandCase(a);
    });
    r.quizResults = e.q.map(function (q) {
      var d = detail && detail.quiz ? detail.quiz.filter(function (x) { return x.id === q[0] && x.lvl === q[2]; })[0] : null;
      return d || { id: q[0], correct: !!q[1], points: QUIZ[q[0]] ? QUIZ[q[0]].points : 1, lvl: q[2], answer: null };
    });
    r.levelResults = e.lv.map(function (l) { return { levelId: l[0], pct: l[1], passed: !!l[2] }; });
    r.levelIndex = e.li;
    r.lvl = e.li; // evaluation always starts at level index 0, so lvl === level index
    r.steps = e.st.slice();
    r.stepIndex = e.i;
    return r;
  }

  function resumeEval() {
    run = rebuildEvalRun();
    if (!LEVELS[run.levelIndex]) {
      // the package was updated and this level no longer exists: close the evaluation with what was recorded
      run.levelIndex = LEVELS.length - 1;
      finalizeEval();
      return showReport(run, Engine.aggregate(content, run.caseResults, run.quizResults));
    }
    if (run.stepIndex === 0) showLevelIntro();
    else nextStep();
  }

  function showEvalReport() {
    run = rebuildEvalRun();
    var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
    showReport(run, agg);
  }

  function startPractice(li) {
    run = newRun('practice', li);
    run.steps = levelSteps(li);
    showLevelIntro();
  }

  var actions = {
    'start-eval': startEval,
    'resume-eval': resumeEval,
    'eval-report': showEvalReport,
    'practice-menu': showPracticeMenu,
    'home': showWelcome,
    'start-practice': function (el) { startPractice(Number(el.getAttribute('data-level'))); },
    'next-step': nextStep,
    'advance': advance,
    'next-level': nextLevel,
    'finish-run': finishRun,
    'choose': function (el) { choose(Number(el.getAttribute('data-i'))); },
    'quiz-answer': function (el) { answerQuiz(Number(el.getAttribute('data-i'))); },
    'crm-tab': function (el) {
      var tab = el.getAttribute('data-tab');
      app.querySelectorAll('.crm-tabs button').forEach(function (b) {
        b.classList.toggle('active', b === el);
        b.setAttribute('aria-selected', b === el ? 'true' : 'false');
        b.setAttribute('tabindex', b === el ? '0' : '-1');
      });
      app.querySelectorAll('.crm-body').forEach(function (b) { b.classList.toggle('hidden', b.getAttribute('data-tab') !== tab); });
    },
    'ref-toggle': function () {
      var p = document.getElementById('ref-panel');
      if (!p) return;
      var open = !p.classList.contains('open');
      p.classList.toggle('open', open);
      p.setAttribute('aria-hidden', open ? 'false' : 'true');
      var ws = app.querySelector('.ws');
      if (ws) ws.classList.toggle('ref-open', open);
      var tg = app.querySelector('.ref-toggle');
      if (tg) tg.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && current) current.ref.opens++;
      if (open) { var s = document.getElementById('ref-search'); if (s) s.focus(); }
      else if (tg) tg.focus();
    },
    'ref-view': function (el) {
      var p = PRODUCTS[el.getAttribute('data-id')];
      if (!p) return;
      if (current) current.ref.views++;
      var d = document.getElementById('ref-detail');
      d.innerHTML = refDetail(p);
      d.classList.remove('hidden');
      document.getElementById('ref-list').classList.add('hidden');
    },
    'ref-back': function () {
      document.getElementById('ref-detail').classList.add('hidden');
      document.getElementById('ref-list').classList.remove('hidden');
    },
    'reset-local': function (el) {
      // two-step confirmation inside the page (window.confirm is blocked in some hosts)
      if (el.getAttribute('data-armed') !== '1') {
        el.setAttribute('data-armed', '1');
        el.textContent = 'პროგრესი წაიშლება — დააჭირეთ ისევ დასადასტურებლად';
        setTimeout(function () {
          if (el.isConnected) { el.removeAttribute('data-armed'); el.textContent = 'თავიდან დაწყება'; }
        }, 4000);
        return;
      }
      restartLocal();
    },
    'preview-restart': function () { startPreview(); },
    'expand-all': function (el) {
      var all = app.querySelectorAll('.case-review');
      var open = !Array.prototype.every.call(all, function (d) { return d.open; });
      all.forEach(function (d) { d.open = open; });
      el.textContent = open ? 'ყველას აკეცვა' : 'ყველას გაშლა';
    }
  };

  var GUARDED = { 'choose': 1, 'quiz-answer': 1, 'advance': 1, 'next-step': 1, 'next-level': 1, 'finish-run': 1, 'start-eval': 1, 'resume-eval': 1 };

  app.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el || el.disabled) return;
    var act = el.getAttribute('data-act');
    if (GUARDED[act] && Date.now() < inputLockedUntil) { ev.preventDefault(); return; }
    var fn = actions[act];
    if (fn) { ev.preventDefault(); fn(el); }
  });

  var searchTimer = null;
  app.addEventListener('input', function (ev) {
    if (ev.target.id !== 'ref-search') return;
    var list = document.getElementById('ref-list');
    list.innerHTML = refList(ev.target.value);
    list.classList.remove('hidden');
    document.getElementById('ref-detail').classList.add('hidden');
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { if (current && ev.target.value) current.ref.searches++; }, 600);
  });

  document.addEventListener('keydown', function (ev) {
    var panel = document.getElementById('ref-panel');
    if (ev.key === 'Escape' && panel && panel.classList.contains('open')) { ev.preventDefault(); actions['ref-toggle'](); return; }
    var tab = ev.target && ev.target.closest && ev.target.closest('[role="tab"]');
    if (tab && /^(ArrowLeft|ArrowRight|Home|End)$/.test(ev.key)) {
      var tabs = Array.prototype.slice.call(tab.parentNode.querySelectorAll('[role="tab"]'));
      var at = tabs.indexOf(tab);
      var to = ev.key === 'Home' ? 0 : ev.key === 'End' ? tabs.length - 1 : (at + (ev.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      ev.preventDefault();
      tabs[to].click();
      tabs[to].focus();
      return;
    }
    if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat || ev.isComposing) return;
    var t = ev.target;
    if (t && t.closest && (t.closest('input,textarea,select,[contenteditable],dialog,#ref-panel,.review-strip') || t.isContentEditable)) return;
    var m = /^(?:Digit|Numpad)([1-7])$/.exec(ev.code || '');
    var idx = -1;
    if (m) idx = Number(m[1]) - 1;
    else if ((m = /^Key([A-G])$/.exec(ev.code || ''))) idx = m[1].charCodeAt(0) - 65;
    if (idx < 0) return;
    var opts = app.querySelectorAll('#choices .opt, .quiz .opt');
    if (opts[idx]) { ev.preventDefault(); opts[idx].click(); }
  });

  function restartLocal() {
    preview = null;
    Scorm.resetLocal();
    try { window.localStorage.removeItem(detailKey); } catch (e) { /* ignore */ }
    state = { v: 1, e: emptyEval(), p: { u: 0, n: 0 } };
    showWelcome();
  }

  /* ---------------- builder preview ---------------- */
  function startPreview() {
    var id = preview.id;
    run = newRun('practice', 0);
    var item = CASES[id] ? 'c:' + id : QUIZ[id] ? 'q:' + id : null;
    if (preview.level != null) {
      var li = Math.max(0, LEVELS.map(function (l) { return l.id; }).indexOf(preview.level));
      run.levelIndex = li;
      run.steps = levelSteps(li);
      return showLevelIntro();
    }
    if (!item) { render('<main class="screen center"><section class="card"><h1>ვერ მოიძებნა: ' + esc(id) + '</h1></section></main>'); return; }
    if (CASES[id]) run.levelIndex = Math.max(0, LEVELS.map(function (l) { return l.id; }).indexOf(CASES[id].level));
    run.steps = [item];
    nextStep();
  }

  function showLmsBanner(on) {
    var el = document.getElementById('lms-banner');
    if (!on) { if (el) el.remove(); return; }
    if (el) return;
    el = document.createElement('div');
    el.id = 'lms-banner';
    el.className = 'lms-banner';
    el.setAttribute('role', 'alert');
    el.textContent = 'შედეგები LMS-ში ვერ ინახება. ნუ დახურავთ ფანჯარას — ვცდილობთ ხელახლა. თუ შეტყობინება არ ქრება, მიმართეთ ადმინისტრატორს.';
    document.body.insertBefore(el, document.body.firstChild);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    applyTheme();
    var hash = window.location.hash || '';
    var m = hash.match(/preview=([^&]+)/);
    var lm = hash.match(/previewLevel=(\d+)/);
    if (m || lm) {
      preview = { id: m ? decodeURIComponent(m[1]) : null, level: lm ? Number(lm[1]) : null };
      Scorm.init('preview-' + Date.now());
      state = { v: 1, e: emptyEval(), p: { u: LEVELS.length, n: 0 } };
      startPreview();
      return;
    }
    if (!Scorm.init(content.meta.packageId)) {
      render('<main class="screen center"><section class="card"><h1>LMS-თან კავშირი ვერ დამყარდა</h1>' +
        '<p class="lead">შეფასება ვერ დაიწყება, რადგან შედეგები LMS-ში ვერ შეინახება.</p>' +
        '<p>დახურეთ ეს ფანჯარა და კურსი თავიდან გაუშვით LMS-დან. თუ პრობლემა განმეორდა, მიმართეთ ადმინისტრატორს.</p>' +
        '<p class="muted small">კოდი: ' + esc(Scorm.error) + '</p></section></main>');
      return;
    }
    studentName = Scorm.get('cmi.core.student_name');
    studentId = Scorm.get('cmi.core.student_id');
    detailKey = 'sim-detail:' + content.meta.packageId + ':' + (studentId || 'local');
    if (Scorm.isStandalone() && /(^|[#&])reset/.test(hash)) {
      // builder "test full game" opens with #reset for a clean local run
      Scorm.resetLocal();
      try { window.localStorage.removeItem(detailKey); } catch (e) { /* ignore */ }
    }
    loadState();
    var st0 = Scorm.get('cmi.core.lesson_status');
    if ((st0 === '' || st0 === 'not attempted') && !noCredit()) Scorm.set('cmi.core.lesson_status', 'incomplete');
    Scorm.set('cmi.core.exit', 'suspend');
    Scorm.commit();
    Scorm.onFailure = function () { showLmsBanner(true); };
    Scorm.onRecover = function () {
      showLmsBanner(false);
      if (state.e.s === 'd' && !state.e.sent) { state.e.sent = 1; saveState(); }
    };
    // finish only when the page really goes away; commit on the earlier signals
    window.addEventListener('pagehide', function () { Scorm.finish(); });
    window.addEventListener('beforeunload', function () { Scorm.commit(); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') Scorm.commit(); });
    // final result computed earlier but never confirmed by the LMS: send it again
    if (state.e.s === 'd' && !state.e.sent && state.e.res && !state.e.res.lost) {
      run = rebuildEvalRun();
      var agg = Engine.aggregate(content, run.caseResults, run.quizResults);
      reportFinal(agg, run.levelResults.filter(function (l) { return l.passed; }).length, run.levelResults.length);
      saveState();
      if (Scorm.ok) { state.e.sent = 1; saveState(); }
      run = null;
    }
    showWelcome();
  }

  // exposed for automated tests
  window.SimApp = {
    /** jump straight into a case or quiz id, or a level ({level: 2}); used by review tools */
    jump: function (target) {
      if (!detailKey) detailKey = 'sim-detail:' + content.meta.packageId + ':local';
      preview = typeof target === 'object' ? { id: null, level: target.level } : { id: target, level: null };
      state = state || { v: 1, e: emptyEval(), p: { u: LEVELS.length, n: 0 } };
      startPreview();
    },
    /** standalone only: wipe local progress and go back to the start screen */
    restart: function () { if (Scorm.isStandalone()) restartLocal(); },
    state: function () { return state; },
    run: function () { return run; },
    current: function () { return current; },
    quiz: function () { return currentQuiz; },
    content: content
  };

  boot();
})();
