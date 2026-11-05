/*
 * Customer avatars. Mood (-3..3) changes the facial expression, which is the
 * only on-screen mood signal (by design).
 *
 * Primary renderer: Micah illustration style (DiceBear, bundled in js/micah.js;
 * artwork by Micah Lanier, CC BY 4.0). Falls back to a simple built-in SVG
 * face if that bundle is missing.
 *
 * Optional per-customer overrides (case.customer.avatar):
 *   { hair, hairColor, skin, shirt, shirtColor, glasses, facialHair, earrings }
 * using Micah option values, e.g. { "hair": "pixie", "glasses": "round" }.
 */
(function () {
  'use strict';

  var SKINS = ['#F6D3B3', '#EDBE98', '#D9A27A', '#B9805A'];
  var HAIR = ['#2B1D14', '#4A2F1E', '#6B4428', '#1C1C1C', '#8A5A35'];
  var SHIRTS = ['#3D5A80', '#7A4E8C', '#2A7F62', '#9C4A3C', '#4F5D75', '#A0703A'];

  function hash(str) {
    var h = 2166136261;
    str = String(str || '');
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function expression(mood) {
    if (mood <= -2) return 'angry';
    if (mood === -1) return 'annoyed';
    if (mood === 0) return 'neutral';
    if (mood === 1) return 'pleased';
    return 'happy';
  }

  function legacy(customer, mood, seed) {
    customer = customer || {};
    var h = hash(seed || customer.name);
    var a = customer.avatar || {};
    var skin = a.skin || SKINS[h % SKINS.length];
    var age = customer.age || 35;
    var hair = a.hair || (age >= 60 ? '#B9B9B9' : HAIR[(h >> 3) % HAIR.length]);
    var shirt = a.shirt || SHIRTS[(h >> 5) % SHIRTS.length];
    var female = (customer.gender || 'm') === 'f';
    var expr = expression(Math.max(-3, Math.min(3, Math.round(mood || 0))));

    var s = [];
    s.push('<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="avatar-svg" data-expr="' + expr + '" role="img" aria-label="' + String(customer.name || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') + '">');
    s.push('<circle cx="60" cy="60" r="60" fill="var(--avatar-bg, #E6EEF4)"/>');

    // long hair behind the head
    if (female) {
      s.push('<path d="M30 58 Q28 26 60 22 Q92 26 90 58 L92 96 Q76 102 60 100 Q44 102 28 96 Z" fill="' + hair + '"/>');
    }
    // shoulders + neck
    s.push('<path d="M18 120 Q20 92 46 88 L74 88 Q100 92 102 120 Z" fill="' + shirt + '"/>');
    s.push('<rect x="52" y="76" width="16" height="16" rx="6" fill="' + skin + '"/>');
    s.push('<path d="M50 88 L60 98 L70 88" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>');
    // head
    s.push('<ellipse cx="60" cy="56" rx="24" ry="27" fill="' + skin + '"/>');
    // ears
    s.push('<ellipse cx="36" cy="58" rx="4" ry="6" fill="' + skin + '"/><ellipse cx="84" cy="58" rx="4" ry="6" fill="' + skin + '"/>');

    // hair on top
    if (female) {
      s.push('<path d="M36 52 Q38 28 60 28 Q84 28 85 52 Q74 40 58 38 Q46 40 36 52 Z" fill="' + hair + '"/>');
    } else if (age >= 60) {
      s.push('<path d="M36 54 Q36 40 42 36 Q40 46 40 54 Z M84 54 Q84 40 78 36 Q80 46 80 54 Z" fill="' + hair + '"/>');
    } else {
      s.push('<path d="M36 50 Q36 28 60 28 Q84 28 84 50 Q80 38 66 36 Q54 40 40 40 Q37 44 36 50 Z" fill="' + hair + '"/>');
    }

    // brows
    var b = {
      angry: [[44, 46, 54, 50], [76, 46, 66, 50]],
      annoyed: [[44, 47, 54, 48], [76, 47, 66, 48]],
      neutral: [[44, 46, 54, 46], [76, 46, 66, 46]],
      pleased: [[44, 45, 54, 44], [76, 45, 66, 44]],
      happy: [[44, 44, 54, 42], [76, 44, 66, 42]]
    }[expr];
    var browColor = age >= 60 ? '#8C8C8C' : '#3A2A20';
    for (var i = 0; i < 2; i++) {
      s.push('<line x1="' + b[i][0] + '" y1="' + b[i][1] + '" x2="' + b[i][2] + '" y2="' + b[i][3] + '" stroke="' + browColor + '" stroke-width="2.6" stroke-linecap="round"/>');
    }

    // eyes
    if (expr === 'happy') {
      s.push('<path d="M45 56 Q49 52 53 56 M67 56 Q71 52 75 56" fill="none" stroke="#2A2A2A" stroke-width="2.4" stroke-linecap="round"/>');
    } else {
      var ry = expr === 'angry' ? 2.2 : 3;
      s.push('<ellipse cx="49" cy="56" rx="2.8" ry="' + ry + '" fill="#2A2A2A"/><ellipse cx="71" cy="56" rx="2.8" ry="' + ry + '" fill="#2A2A2A"/>');
    }
    if (age >= 60) {
      s.push('<g fill="none" stroke="#5A5A5A" stroke-width="1.6"><circle cx="49" cy="56" r="7"/><circle cx="71" cy="56" r="7"/><line x1="56" y1="56" x2="64" y2="56"/></g>');
    }
    // nose
    s.push('<path d="M60 58 Q57 66 60 68" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="1.8" stroke-linecap="round"/>');

    // cheeks
    if (expr === 'angry') s.push('<ellipse cx="44" cy="66" rx="5" ry="3" fill="#E35D5D" opacity=".45"/><ellipse cx="76" cy="66" rx="5" ry="3" fill="#E35D5D" opacity=".45"/>');
    if (expr === 'happy' || expr === 'pleased') s.push('<ellipse cx="44" cy="66" rx="5" ry="3" fill="#F29C9C" opacity=".35"/><ellipse cx="76" cy="66" rx="5" ry="3" fill="#F29C9C" opacity=".35"/>');

    // mouth
    var mouth = {
      angry: '<path d="M50 76 Q60 69 70 76" fill="none" stroke="#7A2E2E" stroke-width="2.6" stroke-linecap="round"/>',
      annoyed: '<path d="M51 74 Q60 72 69 75" fill="none" stroke="#7A3A3A" stroke-width="2.4" stroke-linecap="round"/>',
      neutral: '<path d="M51 74 L69 74" fill="none" stroke="#7A3A3A" stroke-width="2.4" stroke-linecap="round"/>',
      pleased: '<path d="M50 72 Q60 79 70 72" fill="none" stroke="#7A3A3A" stroke-width="2.4" stroke-linecap="round"/>',
      happy: '<path d="M49 71 Q60 84 71 71 Z" fill="#7A2E2E" stroke="#7A2E2E" stroke-width="1.5" stroke-linejoin="round"/><path d="M52 72 Q60 75 68 72" fill="#fff"/>'
    }[expr];
    s.push(mouth);
    s.push('</svg>');
    return s.join('');
  }

  /* ---------- Micah renderer ---------- */
  var M_SKIN = ['f9d4bf', 'f2d3b1', 'ecc3a0', 'e3b48f', 'd9a57e'];
  var M_HAIR = ['2c1b18', '3b2417', '4a312c', '5b3a29', '724133', '1c1c1c'];
  var M_GREY = ['c9c9c9', 'b0b0b0', 'dcdcdc'];
  var M_SHIRT = ['3d5a80', '6b8fbf', '2a7f62', '9287ff', 'c06c84', '4f5d75', 'e0a96d', '5b8e7d'];

  // expression -> [eyebrows (male), eyebrows (female), eyes, mouth]
  var FACES = {
    angry: ['down', 'eyelashesDown', 'eyes', 'nervous'],
    annoyed: ['down', 'eyelashesDown', 'eyes', 'frown'],
    neutral: ['up', 'eyelashesUp', 'eyes', 'smirk'],
    pleased: ['up', 'eyelashesUp', 'eyes', 'smile'],
    happy: ['up', 'eyelashesUp', 'smiling', 'laughing']
  };

  var cache = {};

  function pick(list, h, shift) { return list[(h >>> shift) % list.length]; }

  function micahUri(customer, mood, seed) {
    var a = customer.avatar || {};
    var h = hash(seed || customer.name);
    var age = Number(customer.age) || 35;
    var female = (customer.gender || 'm') === 'f';
    var expr = expression(Math.max(-3, Math.min(3, Math.round(mood || 0))));
    var face = FACES[expr];
    var hairStyle = a.hair || (female ? pick(['full', 'pixie'], h, 2)
      : age >= 45 ? pick(['mrClean', 'fonze'], h, 2)
      : 'fonze');
    var hairColor = a.hairColor || (age >= 60 ? pick(M_GREY, h, 4) : age >= 48 && !female && (h % 3 === 0) ? '6b6b6b' : pick(M_HAIR, h, 4));
    var facialHair = a.facialHair !== undefined ? a.facialHair : (!female && (h >>> 7) % 10 < 4 ? pick(['scruff', 'beard'], h, 8) : null);
    var glasses = a.glasses !== undefined ? a.glasses : (age >= 60 || (h >>> 9) % 10 < 2 ? pick(['round', 'square'], h, 10) : null);
    var earrings = a.earrings !== undefined ? a.earrings : (female && (h >>> 11) % 10 < 6 ? pick(['stud', 'hoop'], h, 12) : null);
    var opts = {
      seed: String(seed || customer.name || 'x'),
      baseColor: [a.skin || pick(M_SKIN, h, 13)],
      hair: [hairStyle], hairColor: [hairColor], hairProbability: 100,
      eyebrows: [female ? face[1] : face[0]], eyebrowsColor: [age >= 60 ? '8c8c8c' : '2c1b18'],
      eyes: [face[2]], mouth: [face[3]],
      shirt: [a.shirt || pick(['collared', 'crew', 'open'], h, 14)], shirtColor: [a.shirtColor || pick(M_SHIRT, h, 15)],
      facialHair: facialHair ? [facialHair] : undefined, facialHairColor: [hairColor], facialHairProbability: facialHair ? 100 : 0,
      glasses: glasses ? [glasses] : undefined, glassesColor: ['3f3f46'], glassesProbability: glasses ? 100 : 0,
      earrings: earrings ? [earrings] : undefined, earringColor: ['e0a96d'], earringsProbability: earrings ? 100 : 0
    };
    Object.keys(opts).forEach(function (k) { if (opts[k] === undefined) delete opts[k]; });
    var key = JSON.stringify(opts);
    if (!cache[key]) cache[key] = window.MicahAvatar(opts);
    return { uri: cache[key], expr: expr };
  }

  function escAttr(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function render(customer, mood, seed) {
    customer = customer || {};
    if (typeof window.MicahAvatar !== 'function') return legacy(customer, mood, seed);
    try {
      var r = micahUri(customer, mood, seed);
      return '<img class="avatar-img" src="' + r.uri + '" data-expr="' + r.expr + '" alt="' + escAttr(customer.name) + '" draggable="false">';
    } catch (e) {
      return legacy(customer, mood, seed);
    }
  }

  window.Avatar = { render: render, expression: expression };
})();
