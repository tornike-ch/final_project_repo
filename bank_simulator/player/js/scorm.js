/*
 * SCORM 1.2 runtime wrapper.
 * Finds the LMS API in parent frames / opener. When no LMS is present
 * (local testing, builder preview) it falls back to a localStorage-backed
 * mock so the game still works and progress survives a reload.
 */
(function () {
  'use strict';

  var api = null;
  var standalone = false;
  var connected = false;
  var finished = false;
  var storageKey = 'sim-scorm';
  var mock = {};
  var sessionStart = Date.now();
  var log = [];

  function findAPI(win) {
    var tries = 0;
    try {
      while (win && !win.API && win.parent && win.parent !== win && tries < 10) {
        tries++;
        win = win.parent;
      }
      return win && win.API ? win.API : null;
    } catch (e) {
      return null;
    }
  }

  function locateAPI() {
    var a = findAPI(window);
    if (!a) {
      try {
        if (window.opener) a = findAPI(window.opener);
      } catch (e) { a = null; }
    }
    return a;
  }

  function readMock() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      mock = raw ? JSON.parse(raw) : {};
    } catch (e) { mock = {}; }
  }

  function writeMock() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(mock)); } catch (e) { /* storage blocked */ }
  }

  function pad(n, w) {
    var s = String(n);
    while (s.length < w) s = '0' + s;
    return s;
  }

  var Scorm = {
    log: log,

    /** Seconds -> SCORM 1.2 CMITimespan "HHHH:MM:SS.SS" */
    timespan: function (seconds) {
      seconds = Math.max(0, seconds || 0);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = seconds - h * 3600 - m * 60;
      return pad(Math.min(h, 9999), 2) + ':' + pad(m, 2) + ':' + (s < 10 ? '0' : '') + s.toFixed(2);
    },

    /** Date -> SCORM 1.2 CMITime "HH:MM:SS" */
    clock: function (date) {
      date = date || new Date();
      return pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2);
    },

    init: function (key) {
      if (key) storageKey = 'sim-scorm:' + key;
      api = locateAPI();
      if (api) {
        var ok = String(api.LMSInitialize('')) === 'true';
        connected = ok;
        if (!ok) { api = null; }
      }
      if (!api) {
        standalone = true;
        connected = true;
        readMock();
        if (!mock['cmi.core.lesson_status']) mock['cmi.core.lesson_status'] = 'not attempted';
        mock['cmi.core.entry'] = mock['cmi.suspend_data'] ? 'resume' : 'ab-initio';
        if (!mock['cmi.core.student_name']) mock['cmi.core.student_name'] = '';
      }
      sessionStart = Date.now();
      return connected;
    },

    isStandalone: function () { return standalone; },

    get: function (key) {
      if (!connected) return '';
      if (standalone) return mock[key] != null ? String(mock[key]) : '';
      try {
        var v = api.LMSGetValue(key);
        return v == null ? '' : String(v);
      } catch (e) { return ''; }
    },

    set: function (key, value) {
      if (!connected || finished) return false;
      value = value == null ? '' : String(value);
      log.push([key, value]);
      if (standalone) {
        mock[key] = value;
        return true;
      }
      try {
        var ok = String(api.LMSSetValue(key, value)) === 'true';
        if (!ok && window.console) {
          var code = api.LMSGetLastError ? api.LMSGetLastError() : '?';
          console.warn('SCORM set failed', key, value, code);
        }
        return ok;
      } catch (e) { return false; }
    },

    commit: function () {
      if (!connected || finished) return false;
      if (standalone) { writeMock(); return true; }
      try { return String(api.LMSCommit('')) === 'true'; } catch (e) { return false; }
    },

    finish: function () {
      if (!connected || finished) return;
      Scorm.set('cmi.core.session_time', Scorm.timespan((Date.now() - sessionStart) / 1000));
      Scorm.commit();
      finished = true;
      if (!standalone) {
        try { api.LMSFinish(''); } catch (e) { /* ignore */ }
      }
    },

    /** Wipes the local mock (standalone mode only). */
    resetLocal: function () {
      if (!standalone) return;
      mock = { 'cmi.core.lesson_status': 'not attempted', 'cmi.core.entry': 'ab-initio' };
      writeMock();
    }
  };

  window.Scorm = Scorm;
})();
