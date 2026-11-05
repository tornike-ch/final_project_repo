/*
 * Content <-> spreadsheet rows. Pure functions (no SheetJS here), so the
 * format can be tested in Node. One workbook sheet per table:
 *   Settings, Levels, Cases, Opportunities, Nodes, Options, Products, Quiz
 * See CASE_FORMAT.md for the column reference.
 */
(function (root) {
  'use strict';

  var COLUMNS = {
    Settings: ['key', 'value'],
    Levels: ['id', 'name', 'description', 'cases_per_run', 'quiz_questions', 'pass_threshold', 'skill_floor'],
    Cases: ['case_id', 'title', 'level', 'channel', 'category', 'brief', 'start_node',
      'customer_name', 'gender', 'age', 'segment', 'occupation', 'income', 'products_held', 'digital', 'notes', 'initial_mood'],
    Opportunities: ['case_id', 'opportunity_id', 'product_id', 'cue'],
    Nodes: ['case_id', 'node_id', 'type', 'system', 'say', 'outcome'],
    Options: ['case_id', 'node_id', 'text', 'next', 'knowledge', 'service', 'sales', 'mood',
      'product_id', 'opportunity_id', 'critical_skill', 'critical_reason', 'feedback'],
    Products: ['product_id', 'type', 'category', 'name', 'short', 'conditions'],
    Quiz: ['quiz_id', 'level', 'question', 'option_1', 'option_2', 'option_3', 'option_4', 'option_5', 'option_6', 'correct', 'points', 'explanation']
  };

  var SETTINGS_KEYS = [
    'meta.title', 'meta.packageId', 'meta.version',
    'config.theme.bankName', 'config.theme.logoText', 'config.theme.productName',
    'config.theme.primary', 'config.theme.primaryDark', 'config.theme.accent', 'config.theme.background',
    'config.scoring.criticalPenalty', 'config.scoring.criticalFailsLevel', 'config.scoring.balanceCategories',
    'config.features.referencePanel', 'config.features.quiz', 'config.features.quizPlacement',
    'config.features.moodWalkout', 'config.features.shuffleOptions', 'config.features.showTimeInReport',
    'config.channel', 'config.scorm.statusMode'
  ];

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function set(obj, path, value) {
    var keys = path.split('.');
    var o = obj;
    for (var i = 0; i < keys.length - 1; i++) {
      if (o[keys[i]] == null || typeof o[keys[i]] !== 'object') o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
  }

  function str(v) { return v == null ? '' : String(v).trim(); }
  function num(v, d) { var n = Number(v); return v === '' || v == null || isNaN(n) ? d : n; }
  function scalar(v) {
    var s = str(v);
    if (/^(true|yes|1)$/i.test(s) && typeof v !== 'number') return true;
    if (/^(false|no|0)$/i.test(s) && typeof v !== 'number') return false;
    if (typeof v === 'boolean') return v;
    if (s !== '' && !isNaN(Number(s)) && !/^#/.test(s)) return Number(s);
    return s;
  }
  function list(v) {
    return str(v).split(/\s*(?:;|\n)\s*/).filter(Boolean);
  }

  /* ---------- content -> rows ---------- */
  function contentToSheets(content) {
    var s = {};
    s.Settings = SETTINGS_KEYS.map(function (k) {
      var v = get(content, k);
      return { key: k.replace(/^config\./, ''), value: v == null ? '' : v };
    });
    s.Levels = (content.config.levels || []).map(function (l) {
      return { id: l.id, name: l.name, description: l.description || '', cases_per_run: l.casesPerRun, quiz_questions: l.quizQuestions || 0, pass_threshold: l.passThreshold, skill_floor: l.skillFloor || 0 };
    });
    s.Cases = []; s.Opportunities = []; s.Nodes = []; s.Options = [];
    (content.cases || []).forEach(function (c) {
      var cu = c.customer || {};
      s.Cases.push({
        case_id: c.id, title: c.title, level: c.level, channel: c.channel, category: c.category || '', brief: c.brief || '',
        start_node: c.start, customer_name: cu.name || '', gender: cu.gender || '', age: cu.age == null ? '' : cu.age,
        segment: cu.segment || '', occupation: cu.occupation || '', income: cu.income || '',
        products_held: (cu.productsHeld || []).join('; '), digital: cu.digital || '', notes: cu.notes || '',
        initial_mood: cu.initialMood || 0
      });
      (c.opportunities || []).forEach(function (o) {
        s.Opportunities.push({ case_id: c.id, opportunity_id: o.id, product_id: o.product || '', cue: o.cue || '' });
      });
      Object.keys(c.nodes || {}).forEach(function (nid) {
        var n = c.nodes[nid];
        s.Nodes.push({
          case_id: c.id, node_id: nid, type: n.end ? 'end' : (n.type || 'dialogue'),
          system: n.system || '', say: n.say || '', outcome: n.end ? (n.outcome || 'resolved') : ''
        });
        (n.options || []).forEach(function (o) {
          var sc = o.scores || {};
          s.Options.push({
            case_id: c.id, node_id: nid, text: o.text || '', next: o.next || '',
            knowledge: sc.knowledge || 0, service: sc.service || 0, sales: sc.sales || 0, mood: o.mood || 0,
            product_id: o.product || '', opportunity_id: o.opportunity || '',
            critical_skill: o.critical ? o.critical.skill : '', critical_reason: o.critical ? (o.critical.reason || '') : '',
            feedback: o.feedback || ''
          });
        });
      });
    });
    s.Products = (content.products || []).map(function (p) {
      return {
        product_id: p.id, type: p.type || 'product', category: p.category || '', name: p.name, short: p.short || '',
        conditions: (p.conditions || []).map(function (c) { return c.label + ': ' + c.value; }).join('\n')
      };
    });
    s.Quiz = (content.quiz || []).map(function (q) {
      var row = { quiz_id: q.id, level: q.level || 0, question: q.question };
      for (var i = 0; i < 6; i++) row['option_' + (i + 1)] = q.options[i] || '';
      row.correct = (q.correct || 0) + 1;
      row.points = q.points || 1;
      row.explanation = q.explanation || '';
      return row;
    });
    return s;
  }

  /* ---------- rows -> content parts ---------- */
  function sheetsToContent(sheets) {
    var out = { warnings: [] };
    if (sheets.Settings && sheets.Settings.length) {
      out.settings = {};
      sheets.Settings.forEach(function (r) {
        var k = str(r.key);
        if (!k) return;
        var path = /^meta\./.test(k) ? k : 'config.' + k;
        out.settings[path] = scalar(r.value);
      });
    }
    if (sheets.Levels && sheets.Levels.length) {
      out.levels = sheets.Levels.filter(function (r) { return str(r.id) !== ''; }).map(function (r, i) {
        return {
          id: num(r.id, i + 1), name: str(r.name), description: str(r.description),
          casesPerRun: num(r.cases_per_run, 3), quizQuestions: num(r.quiz_questions, 0), passThreshold: num(r.pass_threshold, 70), skillFloor: num(r.skill_floor, 0)
        };
      });
    }
    if (sheets.Cases && sheets.Cases.length) {
      var cases = {};
      var order = [];
      sheets.Cases.forEach(function (r) {
        var id = str(r.case_id);
        if (!id) return;
        var c = {
          id: id, title: str(r.title), level: num(r.level, 1), channel: str(r.channel).toLowerCase() || 'branch',
          category: str(r.category), brief: str(r.brief),
          customer: {
            name: str(r.customer_name), gender: str(r.gender).toLowerCase().charAt(0) === 'f' || str(r.gender) === 'ქ' ? 'f' : 'm',
            age: num(r.age, undefined), segment: str(r.segment), occupation: str(r.occupation), income: str(r.income),
            productsHeld: list(r.products_held), digital: str(r.digital), notes: str(r.notes), initialMood: num(r.initial_mood, 0)
          },
          opportunities: [], start: str(r.start_node), nodes: {}
        };
        cases[id] = c;
        order.push(id);
      });
      (sheets.Opportunities || []).forEach(function (r) {
        var c = cases[str(r.case_id)];
        if (!c) { if (str(r.case_id)) out.warnings.push('Opportunities: unknown case ' + r.case_id); return; }
        c.opportunities.push({ id: str(r.opportunity_id), product: str(r.product_id), cue: str(r.cue) });
      });
      (sheets.Nodes || []).forEach(function (r) {
        var c = cases[str(r.case_id)];
        if (!c) { if (str(r.case_id)) out.warnings.push('Nodes: unknown case ' + r.case_id); return; }
        var nid = str(r.node_id);
        var type = str(r.type).toLowerCase() || 'dialogue';
        var n = {};
        if (str(r.system)) n.system = str(r.system);
        if (str(r.say)) n.say = str(r.say);
        if (type === 'end') { n.end = true; n.outcome = str(r.outcome) || 'resolved'; }
        else { if (type === 'product') n.type = 'product'; n.options = []; }
        c.nodes[nid] = n;
        if (!c.start) c.start = nid;
      });
      (sheets.Options || []).forEach(function (r) {
        var c = cases[str(r.case_id)];
        if (!c) { if (str(r.case_id)) out.warnings.push('Options: unknown case ' + r.case_id); return; }
        var n = c.nodes[str(r.node_id)];
        if (!n) { out.warnings.push('Options: case ' + c.id + ' has no node ' + r.node_id); return; }
        if (n.end) { out.warnings.push('Options: node ' + c.id + '/' + r.node_id + ' is an end node, option ignored'); return; }
        var o = {
          text: str(r.text), next: str(r.next),
          scores: { knowledge: num(r.knowledge, 0), service: num(r.service, 0), sales: num(r.sales, 0) }
        };
        if (num(r.mood, 0)) o.mood = num(r.mood, 0);
        if (str(r.product_id)) o.product = str(r.product_id);
        if (str(r.opportunity_id)) o.opportunity = str(r.opportunity_id);
        if (str(r.critical_skill)) o.critical = { skill: str(r.critical_skill).toLowerCase(), reason: str(r.critical_reason) };
        if (str(r.feedback)) o.feedback = str(r.feedback);
        n.options.push(o);
      });
      out.cases = order.map(function (id) { return cases[id]; });
    }
    if (sheets.Products && sheets.Products.length) {
      out.products = sheets.Products.filter(function (r) { return str(r.product_id); }).map(function (r) {
        return {
          id: str(r.product_id), type: str(r.type) || 'product', category: str(r.category), name: str(r.name), short: str(r.short),
          conditions: str(r.conditions).split(/\s*(?:\n|\|)\s*/).filter(Boolean).map(function (line) {
            var i = line.indexOf(':');
            return i > 0 ? { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() } : { label: '', value: line };
          })
        };
      });
    }
    if (sheets.Quiz && sheets.Quiz.length) {
      out.quiz = sheets.Quiz.filter(function (r) { return str(r.quiz_id); }).map(function (r) {
        var opts = [];
        for (var i = 1; i <= 6; i++) if (str(r['option_' + i])) opts.push(str(r['option_' + i]));
        return {
          id: str(r.quiz_id), level: num(r.level, 0), question: str(r.question), options: opts,
          correct: num(r.correct, 1) - 1, points: num(r.points, 1), explanation: str(r.explanation)
        };
      });
    }
    return out;
  }

  /** Apply imported parts onto content. mode: 'merge' (by id) | 'replace' */
  function applyImport(content, parts, mode) {
    var c = JSON.parse(JSON.stringify(content));
    function mergeList(key, items) {
      if (!items) return;
      if (mode === 'replace') { c[key] = items; return; }
      var idx = {};
      c[key].forEach(function (x, i) { idx[x.id] = i; });
      items.forEach(function (x) {
        if (idx[x.id] != null) c[key][idx[x.id]] = x;
        else { idx[x.id] = c[key].length; c[key].push(x); }
      });
    }
    mergeList('cases', parts.cases);
    mergeList('products', parts.products);
    mergeList('quiz', parts.quiz);
    if (parts.levels) c.config.levels = parts.levels;
    if (parts.settings) Object.keys(parts.settings).forEach(function (k) { set(c, k, parts.settings[k]); });
    if (parts.config) c.config = Object.assign({}, c.config, parts.config);
    if (parts.meta) c.meta = Object.assign({}, c.meta, parts.meta);
    return c;
  }

  var api = { COLUMNS: COLUMNS, contentToSheets: contentToSheets, sheetsToContent: sheetsToContent, applyImport: applyImport, get: get, set: set };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SheetIO = api;
})(typeof window !== 'undefined' ? window : this);
