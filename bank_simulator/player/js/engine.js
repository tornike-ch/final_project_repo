/*
 * Game engine: content defaults, validation, max-score computation,
 * random drawing, case runner and score aggregation.
 * No DOM access here - used by the player, the builder and the tests.
 */
(function (root) {
  'use strict';

  var SKILLS = ['knowledge', 'service', 'sales'];
  var CHANNELS = ['branch', 'phone', 'chat'];

  var DEFAULT_CONFIG = {
    theme: {
      bankName: 'ბანკი', logoText: 'BANK', productName: 'მომსახურების სიმულატორი',
      primary: '#00A3E0', primaryDark: '#0B2440', accent: '#00B5AD', background: '#F2F5F8'
    },
    levels: [{ id: 1, name: 'დონე 1', description: '', casesPerRun: 3, quizQuestions: 0, passThreshold: 70 }],
    scoring: { criticalPenalty: 15, balanceCategories: true },
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
    c.cases.forEach(function (cs) {
      cs.level = Number(cs.level) || 1;
      cs.channel = CHANNELS.indexOf(cs.channel) >= 0 ? cs.channel : 'branch';
      cs.customer = cs.customer || {};
      cs.opportunities = Array.isArray(cs.opportunities) ? cs.opportunities : [];
      cs.nodes = cs.nodes || {};
      if (!cs.start) cs.start = Object.keys(cs.nodes)[0];
      Object.keys(cs.nodes).forEach(function (nid) {
        var n = cs.nodes[nid];
        n.options = Array.isArray(n.options) ? n.options : [];
        if (!n.options.length) n.end = true;
        n.options.forEach(function (o) {
          o.scores = o.scores || {};
          SKILLS.forEach(function (s) { o.scores[s] = Number(o.scores[s]) || 0; });
          o.mood = Number(o.mood) || 0;
        });
      });
    });
    c.quiz.forEach(function (q) {
      q.level = Number(q.level) || 0;
      q.points = Number(q.points) || 1;
      q.correct = Number(q.correct) || 0;
    });
    c.config.levels.forEach(function (l, i) {
      l.id = Number(l.id) || i + 1;
      l.casesPerRun = Math.max(1, Number(l.casesPerRun) || 1);
      l.quizQuestions = Math.max(0, Number(l.quizQuestions) || 0);
      l.passThreshold = Math.max(0, Math.min(100, Number(l.passThreshold) || 0));
    });
    return c;
  }

  function optionTotal(o) {
    return SKILLS.reduce(function (sum, s) { return sum + (o.scores[s] || 0); }, 0);
  }

  /**
   * Maximum points per skill = the per-skill sums along the "ideal path"
   * (the path with the highest total points). Answering the best option at
   * every step therefore yields 100% on every skill.
   */
  function caseMax(cs) {
    if (cs._max) return cs._max;
    var memo = {};
    var visiting = {};
    function best(nid) {
      if (memo[nid]) return memo[nid];
      var n = cs.nodes[nid];
      var zero = { total: 0, sums: { knowledge: 0, service: 0, sales: 0 } };
      if (!n || n.end || visiting[nid]) return zero;
      visiting[nid] = true;
      var top = null;
      n.options.forEach(function (o) {
        var rest = best(o.next);
        var total = optionTotal(o) + rest.total;
        if (!top || total > top.total) {
          var sums = {};
          SKILLS.forEach(function (s) { sums[s] = (o.scores[s] || 0) + rest.sums[s]; });
          top = { total: total, sums: sums };
        }
      });
      visiting[nid] = false;
      memo[nid] = top || zero;
      return memo[nid];
    }
    var r = best(cs.start).sums;
    var result = {};
    SKILLS.forEach(function (s) { result[s] = Math.max(0, r[s]); });
    Object.defineProperty(cs, '_max', { value: result, enumerable: false, configurable: true });
    return result;
  }

  /** best | ok | poor | critical */
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
    node.options.forEach(function (o) {
      if (o.critical) return;
      if (!best || optionTotal(o) > optionTotal(best)) best = o;
    });
    return best;
  }

  function validate(content) {
    var c = normalize(content);
    var errors = [];
    var warnings = [];
    var productIds = {};
    c.products.forEach(function (p) {
      if (!p.id) errors.push('პროდუქტს/Product without id: ' + (p.name || '?'));
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
      if (!/^[A-Za-z0-9_\-.]+$/.test(cs.id || '')) warnings.push(where + ': id should use only latin letters, digits, _ - . (needed for LMS reporting)');
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
        if (!n.say && !n.system) warnings.push(where + '/' + nid + ': node has no customer text');
        n.options.forEach(function (o, i) {
          var tag = where + '/' + nid + ' option ' + (i + 1);
          if (!o.text) warnings.push(tag + ': empty text');
          if (!cs.nodes[o.next]) errors.push(tag + ': next node "' + o.next + '" does not exist');
          if (o.product && !productIds[o.product]) warnings.push(tag + ': unknown product ' + o.product);
          if (o.opportunity && !oppIds[o.opportunity]) warnings.push(tag + ': unknown opportunity ' + o.opportunity);
          if (o.critical && SKILLS.indexOf(o.critical.skill) < 0) warnings.push(tag + ': critical.skill must be knowledge, service or sales');
        });
        if (n.options.length > 6) warnings.push(where + '/' + nid + ': more than 6 options');
      });
      if (!hasEnd) errors.push(where + ': no end node');
      // reachability
      var seen = {};
      (function walk(nid) {
        if (seen[nid] || !cs.nodes[nid]) return;
        seen[nid] = true;
        cs.nodes[nid].options.forEach(function (o) { walk(o.next); });
      })(cs.start);
      Object.keys(cs.nodes).forEach(function (nid) {
        if (!seen[nid]) warnings.push(where + '/' + nid + ': node is unreachable');
      });
      var mx = caseMax(cs);
      if (!mx.knowledge && !mx.service && !mx.sales) warnings.push(where + ': no positive points anywhere');
    });
    c.config.levels.forEach(function (l) {
      var pool = c.cases.filter(function (cs) { return cs.level === l.id; }).length;
      if (!pool) errors.push('Level ' + l.id + ': no cases in pool');
      else if (pool < l.casesPerRun) warnings.push('Level ' + l.id + ': pool has ' + pool + ' cases but casesPerRun is ' + l.casesPerRun + ' (all will be used, no randomness)');
      else if (pool === l.casesPerRun) warnings.push('Level ' + l.id + ': pool size equals casesPerRun - everyone gets the same cases');
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
      // spread questions after cases, as evenly as possible
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
    this.earned = { knowledge: 0, service: 0, sales: 0 };
    this.criticals = [];
    this.captured = [];
    this.steps = [];
    this.outcome = null;
    this.startedAt = Date.now();
    this.nodeShownAt = Date.now();
    this.ref = { opens: 0, searches: 0, views: 0 };
    this.channel = content.config.channel !== 'case' && CHANNELS.indexOf(content.config.channel) >= 0 ? content.config.channel : cs.channel;
  }

  CaseRun.prototype.node = function () { return this.cs.nodes[this.nodeId]; };

  CaseRun.prototype.markShown = function () { this.nodeShownAt = Date.now(); };

  CaseRun.prototype.choose = function (index) {
    var node = this.node();
    var opt = node.options[index];
    if (!opt) throw new Error('Invalid option ' + index);
    var latency = Date.now() - this.nodeShownAt;
    var self = this;
    SKILLS.forEach(function (s) { self.earned[s] += opt.scores[s] || 0; });
    if (opt.critical) this.criticals.push({ skill: opt.critical.skill, reason: opt.critical.reason || '', node: this.nodeId });
    if (opt.opportunity && this.captured.indexOf(opt.opportunity) < 0) this.captured.push(opt.opportunity);
    // Walkout: the customer is already at the lowest mood (-3, visibly angry)
    // and the employee makes it worse once more.
    var rawMood = this.mood + (opt.mood || 0);
    this.mood = Math.max(-3, Math.min(3, rawMood));
    this.steps.push({ node: this.nodeId, option: index, latency: latency, verdict: verdict(node, opt) });
    this.nodeId = opt.next;
    var next = this.node();
    if (this.content.config.features.moodWalkout && rawMood < -3 && next && !next.end) {
      this.outcome = 'walkout';
      return { ended: true, walkout: true, node: next };
    }
    if (!next || next.end) {
      this.outcome = (next && next.outcome) || 'resolved';
      return { ended: true, node: next };
    }
    return { ended: false, node: next };
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

  function skillPct(earned, max, crit, penalty) {
    var pct;
    if (max > 0) pct = Math.round((earned / max) * 100);
    else if (earned < 0 || crit > 0) pct = 100 + earned * 10;
    else return null;
    pct -= crit * penalty;
    return Math.max(0, Math.min(100, pct));
  }

  /**
   * caseResults: [{caseId, earned:{...}, criticals:[{skill}]}]
   * quizResults: [{id, correct:boolean, points}]
   */
  function aggregate(content, caseResults, quizResults) {
    var penalty = Number(content.config.scoring.criticalPenalty) || 0;
    var byId = {};
    content.cases.forEach(function (c) { byId[c.id] = c; });
    var acc = {};
    SKILLS.forEach(function (s) { acc[s] = { earned: 0, max: 0, criticals: 0 }; });
    (caseResults || []).forEach(function (r) {
      var cs = byId[r.caseId];
      if (!cs) return;
      var mx = caseMax(cs);
      SKILLS.forEach(function (s) {
        acc[s].earned += r.earned[s] || 0;
        acc[s].max += mx[s];
      });
      (r.criticals || []).forEach(function (c) { if (acc[c.skill]) acc[c.skill].criticals++; });
    });
    (quizResults || []).forEach(function (q) {
      acc.knowledge.max += q.points;
      if (q.correct) acc.knowledge.earned += q.points;
    });
    var pcts = [];
    SKILLS.forEach(function (s) {
      acc[s].pct = skillPct(acc[s].earned, acc[s].max, acc[s].criticals, penalty);
      if (acc[s].pct != null) pcts.push(acc[s].pct);
    });
    var overall = pcts.length ? Math.round(pcts.reduce(function (a, b) { return a + b; }, 0) / pcts.length) : 0;
    return { skills: acc, overall: overall };
  }

  var Engine = {
    SKILLS: SKILLS,
    CHANNELS: CHANNELS,
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    normalize: normalize,
    validate: validate,
    caseMax: caseMax,
    optionTotal: optionTotal,
    verdict: verdict,
    bestOption: bestOption,
    shuffle: shuffle,
    drawCases: drawCases,
    drawQuiz: drawQuiz,
    buildLevelSteps: buildLevelSteps,
    CaseRun: CaseRun,
    aggregate: aggregate,
    skillPct: skillPct
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
  else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : this);
