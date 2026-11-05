/*
 * Game engine: content defaults, validation, max-score computation,
 * random drawing, case runner and score aggregation.
 * No DOM access here - used by the player, the builder and the tests.
 *
 * Node types inside a case:
 *   dialogue (default)  customer line + multiple-choice employee replies (options)
 *   ask                 the employee chooses which questions to ask (questions)
 *   task                the employee works in the bank system: fills form fields
 *                       that are checked against expected values (fields)
 *   end                 final customer line (end: true)
 */
(function (root) {
  'use strict';

  var SKILLS = ['knowledge', 'service', 'sales'];
  var CHANNELS = ['branch', 'phone', 'chat'];
  var STAGES = ['greeting', 'identification', 'verification', 'needs', 'solution', 'offer', 'closing'];
  var FIELD_TYPES = ['text', 'number', 'select', 'radio', 'checkbox', 'date', 'computed'];
  var OUTCOMES = ['resolved', 'unresolved', 'escalated', 'walkout'];

  var DEFAULT_CONFIG = {
    theme: {
      bankName: 'ბანკი', logoText: 'BANK', productName: 'მომსახურების სიმულატორი',
      primary: '#00A3E0', primaryDark: '#0B2440', accent: '#00B5AD', background: '#F2F5F8'
    },
    levels: [{ id: 1, name: 'დონე 1', description: '', casesPerRun: 3, quizQuestions: 0, passThreshold: 70, skillFloor: 0 }],
    scoring: { criticalPenalty: 15, criticalFailsLevel: true, balanceCategories: true },
    features: { referencePanel: true, quiz: true, quizPlacement: 'between', moodWalkout: true, shuffleOptions: true, showTimeInReport: false },
    channel: 'case',
    scorm: { statusMode: 'completed' }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(base, over) {
    var out = clone(base);
    if (!over) return out;
    Object.keys(over).forEach(function (k) {
      var v = over[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) {
        out[k] = merge(out[k], v);
      } else if (v !== undefined) {
        out[k] = clone(v);
      }
    });
    return out;
  }

  function normScores(sc) {
    var out = {};
    sc = sc && typeof sc === 'object' ? sc : {};
    SKILLS.forEach(function (s) { out[s] = Number(sc[s]) || 0; });
    return out;
  }

  function isAsk(n) { return n && n.type === 'ask'; }
  function isTask(n) { return n && n.type === 'task'; }

  /** Fills defaults so the rest of the code can rely on the shape. */
  function normalize(content) {
    var c = clone(content || {});
    c.meta = c.meta || {};
    c.meta.packageId = c.meta.packageId || 'bank-service-simulator';
    c.meta.title = c.meta.title || 'Simulator';
    c.config = merge(DEFAULT_CONFIG, c.config || {});
    c.products = Array.isArray(c.products) ? c.products : [];
    c.cases = Array.isArray(c.cases) ? c.cases : [];
    c.quiz = Array.isArray(c.quiz) ? c.quiz : [];
    c.cases = c.cases.filter(function (cs) { return cs && typeof cs === 'object'; });
    c.products = c.products.filter(function (p) { return p && typeof p === 'object'; });
    c.quiz = c.quiz.filter(function (q) { return q && typeof q === 'object'; });
    c.products.forEach(function (p) { if (p.id != null) p.id = String(p.id); });
    c.cases.forEach(function (cs) {
      if (cs.id != null) cs.id = String(cs.id);
      cs.level = Number(cs.level) || 1;
      cs.channel = CHANNELS.indexOf(cs.channel) >= 0 ? cs.channel : 'branch';
      cs.customer = cs.customer || {};
      cs.opportunities = Array.isArray(cs.opportunities) ? cs.opportunities : [];
      cs.nodes = cs.nodes || {};
      if (cs.start == null) cs.start = Object.keys(cs.nodes)[0];
      cs.start = String(cs.start);
      Object.keys(cs.nodes).forEach(function (nid) {
        if (!cs.nodes[nid] || typeof cs.nodes[nid] !== 'object') cs.nodes[nid] = { end: true, outcome: 'unresolved', _invalid: true };
        var n = cs.nodes[nid];
        n.options = Array.isArray(n.options) ? n.options.filter(function (o) { return o && typeof o === 'object'; }) : [];
        if (n.next != null) n.next = String(n.next);
        if (isAsk(n)) {
          n.questions = Array.isArray(n.questions) ? n.questions.filter(function (q) { return q && typeof q === 'object'; }) : [];
          n.questions.forEach(function (q, i) {
            q.id = String(q.id != null ? q.id : 'q' + (i + 1));
            q.scores = normScores(q.scores);
            q.mood = Number(q.mood) || 0;
          });
          n.maxQuestions = Number(n.maxQuestions) || n.questions.length;
          n.options = [];
        } else if (isTask(n)) {
          n.fields = Array.isArray(n.fields) ? n.fields.filter(function (f) { return f && typeof f === 'object'; }) : [];
          n.fields.forEach(function (f, i) {
            f.id = String(f.id != null ? f.id : 'f' + (i + 1));
            f.type = FIELD_TYPES.indexOf(f.type) >= 0 ? f.type : 'text';
            f.scores = normScores(f.scores);
            f.wrongScores = normScores(f.wrongScores);
          });
          n.branches = Array.isArray(n.branches) ? n.branches : [];
          n.branches.forEach(function (b) { if (b && b.next != null) b.next = String(b.next); });
          n.mood = Number(n.mood) || 0;
          n.options = [];
        } else if (!n.options.length) {
          n.end = true;
        }
        n.options.forEach(function (o) {
          if (o.next != null) o.next = String(o.next);
          o.scores = normScores(o.scores);
          o.mood = Number(o.mood) || 0;
        });
      });
    });
    c.quiz.forEach(function (q) {
      if (q.id != null) q.id = String(q.id);
      q.level = Number(q.level) || 0;
      q.points = Number(q.points) || 1;
      q.correct = Number(q.correct) || 0;
    });
    c.config.levels.forEach(function (l, i) {
      l.id = Number(l.id) || i + 1;
      l.casesPerRun = Math.max(1, Number(l.casesPerRun) || 1);
      l.quizQuestions = Math.max(0, Number(l.quizQuestions) || 0);
      l.passThreshold = Math.max(0, Math.min(100, l.passThreshold === undefined || l.passThreshold === '' ? 70 : Number(l.passThreshold) || 0));
      l.skillFloor = Math.max(0, Math.min(100, Number(l.skillFloor) || 0));
    });
    return c;
  }

  function optionTotal(o) {
    return SKILLS.reduce(function (sum, s) { return sum + ((o.scores || {})[s] || 0); }, 0);
  }

  function addScores(a, b) { SKILLS.forEach(function (s) { a[s] += (b && b[s]) || 0; }); return a; }
  function zeroScores() { return { knowledge: 0, service: 0, sales: 0 }; }

  /* ---------- task fields: values, computed fields, checking ---------- */

  function normText(v) { return String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, ' '); }
  function digits(v) { return String(v == null ? '' : v).replace(/\D/g, ''); }
  function toNum(v) {
    if (typeof v === 'number') return v;
    var n = Number(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.').replace(/[−–]/g, '-'));
    return isNaN(n) ? NaN : n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  /**
   * Computed field: { compute: 'annuity', from: { amount, rate, term } }  -> monthly payment
   *                 { compute: 'mul' | 'div' | 'pct' | 'sum' | 'sub', args: [fieldId | number, ...] }
   */
  function computeField(f, values) {
    var arg = function (a) { return typeof a === 'number' ? a : toNum(values[a]); };
    var r;
    if (f.compute === 'annuity' && f.from) {
      var P = arg(f.from.amount), rate = arg(f.from.rate) / 100 / 12, n = arg(f.from.term);
      if (!(P > 0) || !(n > 0) || isNaN(rate)) return '';
      r = rate ? P * rate / (1 - Math.pow(1 + rate, -n)) : P / n;
    } else {
      var a = (f.args || []).map(arg);
      if (!a.length || a.some(isNaN)) return '';
      if (f.compute === 'mul') r = a.reduce(function (x, y) { return x * y; }, 1);
      else if (f.compute === 'sum') r = a.reduce(function (x, y) { return x + y; }, 0);
      else if (f.compute === 'sub') r = a[0] - (a[1] || 0);
      else if (f.compute === 'div') r = a[1] ? a[0] / a[1] : NaN;
      else if (f.compute === 'pct') r = a[1] ? a[0] / a[1] * 100 : NaN;
      else return '';
    }
    return isNaN(r) || !isFinite(r) ? '' : round2(r);
  }

  /** values typed by the employee + computed fields */
  function taskValues(node, entered) {
    var v = {};
    node.fields.forEach(function (f) { if (f.type !== 'computed') v[f.id] = entered && entered[f.id] !== undefined ? entered[f.id] : (f.type === 'checkbox' ? false : ''); });
    node.fields.forEach(function (f) { if (f.type === 'computed') v[f.id] = computeField(f, v); });
    return v;
  }

  /** true / false, or null when the field is not graded */
  function checkField(f, value) {
    var e = f.expect;
    if (!e || typeof e !== 'object') return null;
    if (f.type === 'checkbox') return !!value === !!e.equals;
    if (e.equals !== undefined) {
      if (f.type === 'number' || f.type === 'computed' || typeof e.equals === 'number') {
        var n = toNum(value);
        return !isNaN(n) && Math.abs(n - Number(e.equals)) <= (Number(e.tolerance) || 0);
      }
      if (e.match === 'digits') return digits(value) === digits(e.equals) && digits(value) !== '';
      return normText(value) === normText(e.equals);
    }
    if (Array.isArray(e.oneOf)) return e.oneOf.some(function (x) { return normText(x) === normText(value); });
    if (e.min !== undefined || e.max !== undefined) {
      var m = toNum(value);
      if (isNaN(m) || String(value).trim() === '') return false;
      return (e.min === undefined || m >= Number(e.min)) && (e.max === undefined || m <= Number(e.max));
    }
    if (e.notEmpty) return normText(value) !== '';
    return null;
  }

  /** the values a perfect employee would enter (used for the ideal path, tests and the report) */
  function expectedValues(node) {
    var v = {};
    node.fields.forEach(function (f) {
      if (f.type === 'computed') return;
      var e = f.expect || {};
      if (e.equals !== undefined) v[f.id] = e.equals;
      else if (Array.isArray(e.oneOf)) v[f.id] = e.oneOf[0];
      else if (e.min !== undefined) v[f.id] = e.min;
      else if (e.max !== undefined) v[f.id] = e.max;
      else if (f.value !== undefined) v[f.id] = f.value;
      else v[f.id] = f.type === 'checkbox' ? false : '';
    });
    return taskValues(node, v);
  }

  function branchMatches(cond, values, node) {
    if (!cond) return false;
    var f = cond.field;
    var val = values[f];
    if (cond.wrong !== undefined) {
      var fd = node.fields.filter(function (x) { return x.id === cond.wrong; })[0];
      return fd ? checkField(fd, values[cond.wrong]) === false : false;
    }
    if (cond.equals !== undefined) return typeof cond.equals === 'boolean' ? !!val === cond.equals : normText(val) === normText(cond.equals);
    if (Array.isArray(cond.in)) return cond.in.some(function (x) { return normText(x) === normText(val); });
    var n = toNum(val);
    if (cond.gt !== undefined) return n > Number(cond.gt);
    if (cond.gte !== undefined) return n >= Number(cond.gte);
    if (cond.lt !== undefined) return n < Number(cond.lt);
    if (cond.lte !== undefined) return n <= Number(cond.lte);
    return false;
  }

  function taskNext(node, values) {
    for (var i = 0; i < node.branches.length; i++) {
      var b = node.branches[i];
      if (b && b.next && branchMatches(b.if || b.when, values, node)) return b.next;
    }
    return node.next;
  }

  /** grade a submitted task */
  function gradeTask(node, entered) {
    var values = taskValues(node, entered);
    var earned = zeroScores();
    var fields = {};
    var criticals = [];
    node.fields.forEach(function (f) {
      var ok = checkField(f, values[f.id]);
      fields[f.id] = ok;
      if (ok === true) addScores(earned, f.scores);
      else if (ok === false) {
        addScores(earned, f.wrongScores);
        if (f.critical) criticals.push({ skill: f.critical.skill, reason: f.critical.reason || '', node: null, field: f.id });
      }
    });
    return { values: values, fields: fields, earned: earned, criticals: criticals, next: taskNext(node, values) };
  }

  function taskMax(node) {
    var m = zeroScores();
    node.fields.forEach(function (f) { if (f.expect) SKILLS.forEach(function (s) { m[s] += Math.max(0, f.scores[s] || 0); }); });
    return m;
  }

  /* ---------- ask nodes ---------- */

  /** the best set of questions: positive-value questions, highest first, within maxQuestions */
  function bestQuestions(node) {
    var good = node.questions.filter(function (q) { return optionTotal(q) > 0; });
    good.sort(function (a, b) { return optionTotal(b) - optionTotal(a); });
    return good.slice(0, node.maxQuestions);
  }

  function askMax(node) {
    var m = zeroScores();
    bestQuestions(node).forEach(function (q) { addScores(m, q.scores); });
    return m;
  }

  /* ---------- generic edges (used by max, validation, reachability) ---------- */

  /** the step a perfect employee takes from this node: { scores, next } */
  function bestEdge(node) {
    if (!node || node.end) return null;
    if (isAsk(node)) return { scores: askMax(node), next: node.next };
    if (isTask(node)) return { scores: taskMax(node), next: taskNext(node, expectedValues(node)) };
    return bestOption(node);
  }

  /** every node id this node can lead to */
  function nextIds(node) {
    if (!node || node.end) return [];
    if (isAsk(node)) return [node.next];
    if (isTask(node)) return [node.next].concat(node.branches.map(function (b) { return b && b.next; })).filter(Boolean);
    return node.options.map(function (o) { return o.next; });
  }

  /** candidate edges for the dynamic programme (non-critical) */
  function edges(node) {
    if (isAsk(node) || isTask(node)) { var e = bestEdge(node); return e ? [e] : []; }
    return node.options.filter(function (o) { return !o.critical; });
  }

  /**
   * Maximum points per skill = per-skill sums along the "ideal path": the
   * best answer at every step (dialogue: highest-total non-critical option;
   * ask: all useful questions; task: every field correct).
   */
  function caseMax(cs) {
    if (cs._max) return cs._max;
    var sums = zeroScores();
    var nid = cs.start, guard = {};
    while (cs.nodes[nid] && !cs.nodes[nid].end && !guard[nid]) {
      guard[nid] = true;
      var b = bestEdge(cs.nodes[nid]);
      if (!b) break;
      addScores(sums, b.scores);
      nid = b.next;
    }
    // best achievable continuation from any node, for validation
    var memo = {};
    var visiting = {};
    function best(id) {
      if (memo[id]) return memo[id];
      var n = cs.nodes[id];
      var zero = { total: 0, sums: zeroScores() };
      if (!n || n.end || visiting[id]) return zero;
      visiting[id] = true;
      var top = null;
      edges(n).forEach(function (o) {
        var rest = best(o.next);
        var total = optionTotal(o) + rest.total;
        if (!top || total > top.total) {
          var s = zeroScores();
          SKILLS.forEach(function (k) { s[k] = ((o.scores || {})[k] || 0) + rest.sums[k]; });
          top = { total: total, sums: s };
        }
      });
      visiting[id] = false;
      memo[id] = top || zero;
      return memo[id];
    }
    Object.defineProperty(cs, '_bestFrom', { value: best, enumerable: false, configurable: true });
    var result = {};
    SKILLS.forEach(function (s) { result[s] = Math.max(0, sums[s]); });
    Object.defineProperty(cs, '_max', { value: result, enumerable: false, configurable: true });
    return result;
  }

  /** best | ok | poor | critical (dialogue options) */
  function verdict(node, opt) {
    if (opt.critical) return 'critical';
    var top = -Infinity;
    node.options.forEach(function (o) { if (!o.critical) top = Math.max(top, optionTotal(o)); });
    var t = optionTotal(opt);
    if (t >= top) return 'best';
    if (t < 0) return 'poor';
    return 'ok';
  }

  function bestOption(node) {
    var best = null;
    (node.options || []).forEach(function (o) {
      if (o.critical) return;
      if (!best || optionTotal(o) > optionTotal(best)) best = o;
    });
    return best;
  }

  /* ---------- validation ---------- */

  var ID_RE = /^[A-Za-z0-9_\-.]+$/;

  function validate(content) {
    var errors = [];
    var warnings = [];
    // checks on the raw input, before normalize() papers over bad values
    ((content && content.cases) || []).forEach(function (cs, i) {
      if (!cs || typeof cs !== 'object') { errors.push('Case #' + (i + 1) + ': not an object'); return; }
      var w = 'Case ' + (cs.id || '#' + (i + 1));
      if (cs.level !== undefined && isNaN(Number(cs.level))) errors.push(w + ': level "' + cs.level + '" is not a number');
      if (cs.channel !== undefined && CHANNELS.indexOf(cs.channel) < 0) errors.push(w + ': channel "' + cs.channel + '" must be branch, phone or chat');
      Object.keys(cs.nodes || {}).forEach(function (nid) {
        var n = cs.nodes[nid];
        if (!n || typeof n !== 'object') { errors.push(w + '/' + nid + ': node is empty'); return; }
        if (n.type && ['dialogue', 'ask', 'task', 'product'].indexOf(n.type) < 0) errors.push(w + '/' + nid + ': type "' + n.type + '" must be dialogue, product, ask or task');
        if (n.stage && STAGES.indexOf(n.stage) < 0) warnings.push(w + '/' + nid + ': stage "' + n.stage + '" should be one of ' + STAGES.join(', '));
        if (n.end && n.outcome && OUTCOMES.indexOf(n.outcome) < 0) errors.push(w + '/' + nid + ': outcome "' + n.outcome + '" must be one of ' + OUTCOMES.join(', '));
        var scored = (n.options || []).concat(n.questions || [], n.fields || []);
        scored.forEach(function (o, k) {
          if (!o) return;
          SKILLS.concat(['mood']).forEach(function (sk) {
            var v = sk === 'mood' ? o.mood : (o.scores || {})[sk];
            if (v !== undefined && v !== null && v !== '' && isNaN(Number(v))) errors.push(w + '/' + nid + ' item ' + (k + 1) + ': ' + sk + ' "' + v + '" is not a number');
          });
        });
        (n.fields || []).forEach(function (f, k) {
          if (!f) return;
          if (f.type && FIELD_TYPES.indexOf(f.type) < 0) errors.push(w + '/' + nid + ' field ' + (f.id || k + 1) + ': type "' + f.type + '" must be one of ' + FIELD_TYPES.join(', '));
        });
      });
    });
    var seenLevels = {};
    (((content && content.config) || {}).levels || []).forEach(function (l) {
      if (seenLevels[l.id]) errors.push('Level id ' + l.id + ' is used twice');
      seenLevels[l.id] = true;
    });
    var c = normalize(content);
    var productIds = {};
    c.products.forEach(function (p) {
      if (!p.id) errors.push('Product without id: ' + (p.name || '?'));
      else if (productIds[p.id]) errors.push('Duplicate product id ' + p.id);
      productIds[p.id] = true;
    });
    var caseIds = {};
    var levelIds = c.config.levels.map(function (l) { return l.id; });
    c.cases.forEach(function (cs) {
      var where = 'Case ' + (cs.id || '?');
      if (!cs.id) errors.push(where + ': missing id');
      else if (caseIds[cs.id]) errors.push(where + ': duplicate id');
      caseIds[cs.id] = true;
      if (!ID_RE.test(cs.id || '')) errors.push(where + ': id must use only latin letters, digits, _ - . (it is sent to the LMS)');
      Object.keys(cs.nodes).forEach(function (nid) {
        if (!ID_RE.test(nid)) warnings.push(where + ': node id "' + nid + '" should use only latin letters, digits, _ - . (sent to the LMS)');
      });
      if (levelIds.indexOf(cs.level) < 0) warnings.push(where + ': level ' + cs.level + ' is not configured, case will never be drawn');
      if (!cs.nodes[cs.start]) { errors.push(where + ': start node "' + cs.start + '" does not exist'); return; }
      var oppIds = {};
      cs.opportunities.forEach(function (o) {
        oppIds[o.id] = true;
        if (o.product && !productIds[o.product]) warnings.push(where + ': opportunity ' + o.id + ' references unknown product ' + o.product);
      });
      var hasEnd = false;
      Object.keys(cs.nodes).forEach(function (nid) {
        var n = cs.nodes[nid];
        if (n.end) { hasEnd = true; return; }
        var tag0 = where + '/' + nid;
        if (isAsk(n)) {
          if (!n.questions.length) errors.push(tag0 + ': ask node has no questions');
          if (!cs.nodes[n.next]) errors.push(tag0 + ': next node "' + n.next + '" does not exist');
          var qids = {};
          n.questions.forEach(function (q) {
            if (qids[q.id]) errors.push(tag0 + ': duplicate question id ' + q.id);
            qids[q.id] = true;
            if (!q.text) warnings.push(tag0 + ' question ' + q.id + ': empty text');
            if (!q.answer) warnings.push(tag0 + ' question ' + q.id + ': no customer answer');
            if (q.opportunity && !oppIds[q.opportunity]) warnings.push(tag0 + ' question ' + q.id + ': unknown opportunity ' + q.opportunity);
          });
          if (!bestQuestions(n).length) warnings.push(tag0 + ': no question is worth any points');
          return;
        }
        if (isTask(n)) {
          if (!n.fields.length) errors.push(tag0 + ': task has no fields');
          if (!cs.nodes[n.next]) errors.push(tag0 + ': next node "' + n.next + '" does not exist');
          n.branches.forEach(function (b, k) { if (!b || !cs.nodes[b.next]) errors.push(tag0 + ' branch ' + (k + 1) + ': next node does not exist'); });
          var fids = {};
          n.fields.forEach(function (f) {
            var ft = tag0 + ' field ' + f.id;
            if (fids[f.id]) errors.push(ft + ': duplicate field id');
            fids[f.id] = true;
            if ((f.type === 'select' || f.type === 'radio') && (!Array.isArray(f.options) || f.options.length < 2)) errors.push(ft + ': needs at least 2 options');
            if (f.expect && (f.type === 'select' || f.type === 'radio') && f.expect.equals !== undefined &&
                !(f.options || []).some(function (o) { return normText(o) === normText(f.expect.equals); })) errors.push(ft + ': expected value is not one of the options');
            if (f.type === 'computed' && !f.compute) errors.push(ft + ': computed field needs "compute"');
            if (f.expect && checkField(f, expectedValues(n)[f.id]) !== true) errors.push(ft + ': the expected value does not pass its own check');
            if (f.critical && SKILLS.indexOf(f.critical.skill) < 0) warnings.push(ft + ': critical.skill must be knowledge, service or sales');
          });
          if (!n.fields.some(function (f) { return f.expect; })) warnings.push(tag0 + ': no field is graded');
          return;
        }
        if (!n.say && !n.system) warnings.push(tag0 + ': node has no customer text');
        n.options.forEach(function (o, i) {
          var tag = tag0 + ' option ' + (i + 1);
          if (!o.text) warnings.push(tag + ': empty text');
          if (!cs.nodes[o.next]) errors.push(tag + ': next node "' + o.next + '" does not exist');
          if (o.product && !productIds[o.product]) warnings.push(tag + ': unknown product ' + o.product);
          if (o.opportunity && !oppIds[o.opportunity]) warnings.push(tag + ': unknown opportunity ' + o.opportunity);
          if (o.critical && SKILLS.indexOf(o.critical.skill) < 0) warnings.push(tag + ': critical.skill must be knowledge, service or sales');
        });
        if (n.options.length > 6) warnings.push(tag0 + ': more than 6 options');
      });
      if (!hasEnd) errors.push(where + ': no end node');
      // every reachable node must be able to reach an end (no endless loops)
      var canEnd = {};
      var changed = true;
      while (changed) {
        changed = false;
        Object.keys(cs.nodes).forEach(function (nid) {
          if (canEnd[nid]) return;
          var n = cs.nodes[nid];
          if (n.end || nextIds(n).some(function (x) { return canEnd[x]; })) { canEnd[nid] = true; changed = true; }
        });
      }
      var seen = {};
      (function walk(nid) {
        if (seen[nid] || !cs.nodes[nid]) return;
        seen[nid] = true;
        nextIds(cs.nodes[nid]).forEach(walk);
      })(cs.start);
      Object.keys(cs.nodes).forEach(function (nid) {
        if (!seen[nid]) warnings.push(where + '/' + nid + ': node is unreachable');
        else if (!canEnd[nid]) errors.push(where + '/' + nid + ': no path from here reaches an end node (loop)');
        var n = cs.nodes[nid];
        if (n.end || !seen[nid] || isAsk(n) || isTask(n)) return;
        var b = bestOption(n);
        if (!b) { errors.push(where + '/' + nid + ': every option is critical, there is no correct answer'); return; }
        var bt = optionTotal(b);
        n.options.forEach(function (o, i) {
          if (o === b) return;
          if (!o.critical && optionTotal(o) === bt) warnings.push(where + '/' + nid + ' option ' + (i + 1) + ': ties with the best answer on total points; make one clearly better');
          if (o.critical && optionTotal(o) >= bt) warnings.push(where + '/' + nid + ' option ' + (i + 1) + ': critical answer has as many points as the best answer; give it negative points');
        });
      });
      var mx = caseMax(cs);
      if (cs._bestFrom && cs.nodes[cs.start]) {
        var refTotal = mx.knowledge + mx.service + mx.sales;
        if (cs._bestFrom(cs.start).total > refTotal) warnings.push(where + ': a path through weaker answers scores more in total than always choosing the best answer; check the branch points');
      }
      if (!mx.knowledge && !mx.service && !mx.sales) warnings.push(where + ': no positive points anywhere');

      // answer-length tell (dialogue nodes only)
      var decisions = 0, bestLongest = 0, spread = [];
      var bestFrom = cs._bestFrom;
      Object.keys(cs.nodes).forEach(function (nid) {
        var n = cs.nodes[nid];
        if (n.end || isAsk(n) || isTask(n) || n.options.length < 2 || !seen[nid]) return;
        decisions++;
        var lens = n.options.map(function (o) { return String(o.text || '').length; });
        var b = bestOption(n);
        var bl = b ? String(b.text || '').length : 0;
        if (b && lens.every(function (x, i) { return n.options[i] === b || x < bl; })) bestLongest++;
        var mn = Math.min.apply(null, lens), mxl = Math.max.apply(null, lens);
        if (mn > 0 && mxl > 1.5 * mn) spread.push(nid);
        if (b && bestFrom) {
          var ideal = optionTotal(b) + bestFrom(b.next).total;
          n.options.forEach(function (o, i) {
            if (o === b || o.critical) return;
            if (optionTotal(o) < optionTotal(b) && optionTotal(o) + bestFrom(o.next).total >= ideal) {
              warnings.push(where + '/' + nid + ' option ' + (i + 1) + ': weaker answer can still reach the ideal total later (recovery branch gives the points back)');
            }
          });
        }
      });
      if (decisions >= 3 && bestLongest / decisions > 0.4) {
        warnings.push(where + ': the best answer is the longest option at ' + bestLongest + ' of ' + decisions + ' decisions (length gives the answer away; aim for 40% or less)');
      }
      if (spread.length) warnings.push(where + ': option lengths differ more than 1.5x at ' + spread.join(', ') + ' (keep options of similar length)');
    });
    c.config.levels.forEach(function (l) {
      var pool = c.cases.filter(function (cs) { return cs.level === l.id; }).length;
      if (!pool) errors.push('Level ' + l.id + ': no cases in pool');
      else if (pool < l.casesPerRun) warnings.push('Level ' + l.id + ': pool has ' + pool + ' cases but casesPerRun is ' + l.casesPerRun + ' (all will be used, no randomness)');
      else if (pool === l.casesPerRun) warnings.push('Level ' + l.id + ': pool size equals casesPerRun - everyone gets the same cases');
      else if (pool < 3 * l.casesPerRun) warnings.push('Level ' + l.id + ': pool has ' + pool + ' cases; at least ' + (3 * l.casesPerRun) + ' (3x casesPerRun) is recommended so colleagues get different cases');
      if (c.config.features.quiz && l.quizQuestions) {
        var qpool = c.quiz.filter(function (q) { return q.level === l.id || q.level === 0; }).length;
        if (qpool < l.quizQuestions) warnings.push('Level ' + l.id + ': quiz pool has ' + qpool + ' questions, ' + l.quizQuestions + ' requested');
      }
    });
    var qIds = {};
    c.quiz.forEach(function (q) {
      if (qIds[q.id]) errors.push('Quiz ' + q.id + ': duplicate id');
      qIds[q.id] = true;
      if (!Array.isArray(q.options) || q.options.length < 2) errors.push('Quiz ' + q.id + ': needs at least 2 options');
      else if (q.correct < 0 || q.correct >= q.options.length) errors.push('Quiz ' + q.id + ': correct index out of range');
    });
    return { errors: errors, warnings: warnings };
  }

  /* ---------- random draw ---------- */

  function rng() { return Math.random(); }

  function shuffle(arr, random) {
    random = random || rng;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** Random cases for a level; round-robin across categories when balancing. */
  function drawCases(content, levelId, n, balance, random) {
    var pool = shuffle(content.cases.filter(function (c) { return c.level === levelId; }), random);
    if (!balance) return pool.slice(0, n);
    var groups = {};
    var order = [];
    pool.forEach(function (c) {
      var k = c.category || '-';
      if (!groups[k]) { groups[k] = []; order.push(k); }
      groups[k].push(c);
    });
    var out = [];
    while (out.length < n && order.some(function (k) { return groups[k].length; })) {
      order.forEach(function (k) { if (out.length < n && groups[k].length) out.push(groups[k].shift()); });
    }
    return shuffle(out, random);
  }

  function drawQuiz(content, levelId, n, random) {
    var pool = content.quiz.filter(function (q) { return q.level === levelId; });
    var general = content.quiz.filter(function (q) { return q.level === 0; });
    return shuffle(pool, random).concat(shuffle(general, random)).slice(0, n);
  }

  /** Step list for one level: ["c:ID", "q:ID", ...] */
  function buildLevelSteps(content, level, random) {
    var cfg = content.config;
    var cases = drawCases(content, level.id, level.casesPerRun, cfg.scoring.balanceCategories, random);
    var quiz = cfg.features.quiz ? drawQuiz(content, level.id, level.quizQuestions, random) : [];
    var steps = [];
    if (cfg.features.quizPlacement === 'end') {
      cases.forEach(function (c) { steps.push('c:' + c.id); });
      quiz.forEach(function (q) { steps.push('q:' + q.id); });
    } else {
      var per = cases.length ? quiz.length / cases.length : 0;
      var qi = 0;
      cases.forEach(function (c, i) {
        steps.push('c:' + c.id);
        var upto = Math.round(per * (i + 1));
        while (qi < upto && qi < quiz.length) steps.push('q:' + quiz[qi++].id);
      });
      while (qi < quiz.length) steps.push('q:' + quiz[qi++].id);
    }
    return steps;
  }

  /* ---------- Case runner ---------- */

  function CaseRun(content, cs) {
    this.content = content;
    this.cs = cs;
    this.nodeId = cs.start;
    this.mood = Math.max(-3, Math.min(3, Number(cs.customer.initialMood) || 0));
    this.earned = zeroScores();
    this.criticals = [];
    this.captured = [];
    this.steps = [];
    this.asked = [];          // questions asked in the current ask node
    this.outcome = null;
    this.startedAt = Date.now();
    this.nodeShownAt = Date.now();
    this.ref = { opens: 0, searches: 0, views: 0 };
    this.unlocked = {};       // system panels made available by the story (e.g. id, bureau)
    this.crm = clone(cs.crm || {}); // the customer record as currently saved in the system
    this.channel = content.config.channel !== 'case' && CHANNELS.indexOf(content.config.channel) >= 0 ? content.config.channel : cs.channel;
    this._enter(cs.nodes[cs.start]);
  }

  CaseRun.prototype.node = function () { return this.cs.nodes[this.nodeId]; };

  CaseRun.prototype.markShown = function () { this.nodeShownAt = Date.now(); };

  CaseRun.prototype._enter = function (node) {
    var self = this;
    if (!node) return;
    (node.unlock || []).forEach(function (k) { self.unlocked[k] = true; });
  };

  /** move to the next node; handles walk-out and case end */
  CaseRun.prototype._go = function (nextId, moodDelta) {
    var prevMood = this.mood;
    this.mood = Math.max(-3, Math.min(3, this.mood + (moodDelta || 0)));
    this.nodeId = nextId;
    var next = this.node();
    this._enter(next);
    // walk-out: the customer was already visibly furious (-3) and it got worse again
    if (this.content.config.features.moodWalkout && prevMood <= -3 && (moodDelta || 0) < 0 && next && !next.end) {
      this.outcome = 'walkout';
      return { ended: true, walkout: true, node: next };
    }
    if (!next || next.end) {
      this.outcome = (next && next.outcome) || 'resolved';
      return { ended: true, node: next };
    }
    return { ended: false, node: next };
  };

  CaseRun.prototype._capture = function (opp) {
    if (opp && this.captured.indexOf(opp) < 0) this.captured.push(opp);
  };

  /** dialogue: pick option `index` */
  CaseRun.prototype.choose = function (index) {
    var node = this.node();
    var opt = node.options[index];
    if (!opt) throw new Error('Invalid option ' + index);
    var latency = Date.now() - this.nodeShownAt;
    addScores(this.earned, opt.scores);
    if (opt.critical) this.criticals.push({ skill: opt.critical.skill, reason: opt.critical.reason || '', node: this.nodeId });
    this._capture(opt.opportunity);
    this.steps.push({ node: this.nodeId, kind: 'dialogue', option: index, latency: latency, at: Date.now(), verdict: verdict(node, opt) });
    return this._go(opt.next, opt.mood);
  };

  /** ask: ask one question; returns the question (with its answer) or null */
  CaseRun.prototype.ask = function (qid) {
    var node = this.node();
    if (!isAsk(node) || this.asked.indexOf(qid) >= 0 || this.asked.length >= node.maxQuestions) return null;
    var q = node.questions.filter(function (x) { return x.id === qid; })[0];
    if (!q) return null;
    this.asked.push(qid);
    addScores(this.earned, q.scores);
    if (q.critical) this.criticals.push({ skill: q.critical.skill, reason: q.critical.reason || '', node: this.nodeId });
    this._capture(q.opportunity);
    this.mood = Math.max(-3, Math.min(3, this.mood + (q.mood || 0)));
    return q;
  };

  /** ask: finish asking and move on */
  CaseRun.prototype.finishAsk = function () {
    var node = this.node();
    var asked = this.asked.slice();
    var missed = node.questions.filter(function (q) { return q.required && asked.indexOf(q.id) < 0; }).map(function (q) { return q.id; });
    var bad = node.questions.some(function (q) { return asked.indexOf(q.id) >= 0 && optionTotal(q) < 0; });
    this.steps.push({
      node: this.nodeId, kind: 'ask', asked: asked, missed: missed, latency: Date.now() - this.nodeShownAt, at: Date.now(),
      verdict: !missed.length && !bad ? 'best' : (bad && missed.length ? 'poor' : 'ok')
    });
    this.asked = [];
    return this._go(node.next, 0);
  };

  /** task: submit field values typed in the system */
  CaseRun.prototype.submitTask = function (entered) {
    var node = this.node();
    var g = gradeTask(node, entered);
    var self = this;
    addScores(this.earned, g.earned);
    g.criticals.forEach(function (c) { c.node = self.nodeId; self.criticals.push(c); });
    if (node.saveTo === 'crm') {
      node.fields.forEach(function (f) { if (f.crmKey) self.crm[f.crmKey] = g.values[f.id]; });
    }
    var graded = Object.keys(g.fields).filter(function (k) { return g.fields[k] !== null; });
    var wrong = graded.filter(function (k) { return g.fields[k] === false; });
    this.steps.push({
      node: this.nodeId, kind: 'task', values: g.values, fields: g.fields, latency: Date.now() - this.nodeShownAt, at: Date.now(),
      verdict: g.criticals.length ? 'critical' : !wrong.length ? 'best' : wrong.length < graded.length / 2 ? 'ok' : 'poor'
    });
    var moodDelta = node.mood || 0;
    if (wrong.length && node.moodIfWrong) moodDelta += Number(node.moodIfWrong) || 0;
    return this._go(g.next, moodDelta);
  };

  /** compact, replayable record of the steps taken */
  CaseRun.prototype.encodeSteps = function () {
    return this.steps.map(function (s) {
      if (s.kind === 'ask') return { a: s.asked };
      if (s.kind === 'task') {
        var v = {};
        Object.keys(s.values).forEach(function (k) { v[k] = s.values[k]; });
        return { t: v };
      }
      return s.option;
    });
  };

  /** replay one encoded step (resume / report rebuild) */
  CaseRun.prototype.applyStep = function (enc) {
    var node = this.node();
    if (!node || node.end) return null;
    if (enc && typeof enc === 'object' && enc.a) {
      var self = this;
      enc.a.forEach(function (q) { self.ask(q); });
      return this.finishAsk();
    }
    if (enc && typeof enc === 'object' && enc.t) return this.submitTask(enc.t);
    return this.choose(Number(enc));
  };

  CaseRun.prototype.result = function () {
    return {
      caseId: this.cs.id,
      level: this.cs.level,
      channel: this.channel,
      earned: clone(this.earned),
      criticals: clone(this.criticals),
      captured: this.captured.slice(),
      steps: clone(this.steps),
      outcome: this.outcome || 'unresolved',
      seconds: Math.round((Date.now() - this.startedAt) / 1000),
      ref: clone(this.ref)
    };
  };

  /* ---------- Aggregation ---------- */

  /**
   * Skill % = earned / max - penalty per critical error, clamped 0..100.
   * A skill with no possible points in scope is "not measured" (null).
   */
  function skillPct(earned, max, crit, penalty) {
    if (!(max > 0)) return null;
    var pct = Math.round((earned / max) * 100) - crit * penalty;
    return Math.max(0, Math.min(100, pct));
  }

  /** skills actually measured by a node (count as "scored decisions") */
  function nodeSkills(node) {
    if (!node) return [];
    var items = isAsk(node) ? node.questions : isTask(node) ? node.fields.filter(function (f) { return f.expect; }) : node.options;
    return SKILLS.filter(function (s) {
      var vals = items.map(function (o) { return (o.scores || {})[s] || 0; });
      if (!vals.length) return false;
      if (isTask(node)) return vals.some(function (v) { return v !== 0; });
      return Math.max.apply(null, vals) !== Math.min.apply(null, vals);
    });
  }

  function aggregate(content, caseResults, quizResults) {
    var penalty = Number(content.config.scoring.criticalPenalty) || 0;
    var byId = {};
    content.cases.forEach(function (c) { byId[c.id] = c; });
    var acc = {};
    SKILLS.forEach(function (s) { acc[s] = { earned: 0, max: 0, criticals: 0, decisions: 0 }; });
    var criticals = 0;
    (caseResults || []).forEach(function (r) {
      var cs = byId[r.caseId];
      if (!cs) return;
      var mx = caseMax(cs);
      SKILLS.forEach(function (s) {
        acc[s].earned += r.earned[s] || 0;
        acc[s].max += mx[s];
      });
      (r.steps || []).forEach(function (st) {
        var node = cs.nodes[st.node];
        if (node) nodeSkills(node).forEach(function (s) { acc[s].decisions++; });
      });
      (r.criticals || []).forEach(function (c) { criticals++; if (acc[c.skill]) acc[c.skill].criticals++; });
    });
    (quizResults || []).forEach(function (q) {
      acc.knowledge.max += q.points;
      acc.knowledge.decisions++;
      if (q.correct) acc.knowledge.earned += q.points;
    });
    var pcts = [];
    SKILLS.forEach(function (s) {
      acc[s].pct = skillPct(acc[s].earned, acc[s].max, acc[s].criticals, penalty);
      if (acc[s].pct != null) pcts.push(acc[s].pct);
    });
    var overall = pcts.length ? Math.round(pcts.reduce(function (a, b) { return a + b; }, 0) / pcts.length) : 0;
    return { skills: acc, overall: overall, criticals: criticals };
  }

  /**
   * Level pass rule: overall >= passThreshold, no critical errors (if
   * criticalFailsLevel), and every sufficiently measured skill (>= 6 scored
   * decisions) at or above the level's skillFloor.
   */
  function levelPass(content, level, agg) {
    var reasons = [];
    if (agg.overall < level.passThreshold) reasons.push('threshold');
    if (content.config.scoring.criticalFailsLevel && agg.criticals > 0) reasons.push('critical');
    if (level.skillFloor > 0) {
      SKILLS.forEach(function (s) {
        var a = agg.skills[s];
        if (a.pct != null && a.decisions >= 6 && a.pct < level.skillFloor) reasons.push('floor:' + s);
      });
    }
    return { passed: reasons.length === 0, reasons: reasons };
  }

  var Engine = {
    SKILLS: SKILLS,
    CHANNELS: CHANNELS,
    STAGES: STAGES,
    OUTCOMES: OUTCOMES,
    FIELD_TYPES: FIELD_TYPES,
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    normalize: normalize,
    validate: validate,
    caseMax: caseMax,
    optionTotal: optionTotal,
    verdict: verdict,
    bestOption: bestOption,
    bestEdge: bestEdge,
    bestQuestions: bestQuestions,
    expectedValues: expectedValues,
    taskValues: taskValues,
    computeField: computeField,
    checkField: checkField,
    gradeTask: gradeTask,
    shuffle: shuffle,
    drawCases: drawCases,
    drawQuiz: drawQuiz,
    buildLevelSteps: buildLevelSteps,
    CaseRun: CaseRun,
    aggregate: aggregate,
    levelPass: levelPass,
    nodeSkills: nodeSkills,
    skillPct: skillPct
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
  else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : this);
