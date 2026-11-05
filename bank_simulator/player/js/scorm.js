/*
 * SCORM 1.2 runtime wrapper.
 *
 * Finds the LMS API in parent frames / opener windows. A local
 * localStorage-backed mock is used ONLY when the page is clearly not running
 * inside an LMS (opened directly, file:// or blob: preview, or a host page
 * that sets window.SIM_ALLOW_STANDALONE = true). Inside an LMS frame without a
 * working API the game must not start, otherwise results would silently never
 * reach the LMS.
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
  var retryTimer = null;

  function findAPI(win) {
    var tries = 0;
    try {
      while (win && !win.API && win.parent && win.parent !== win && tries < 10) {
        tries++;
        win = win.parent;
      }
      return win && win.API ? win.API : null;
    } catch (e) {
      return null; // cross-origin frame
    }
  }

  function locateAPI() {
    var a = findAPI(window);
    try { if (!a && window.opener) a = findAPI(window.opener); } catch (e) { /* ignore */ }
    try { if (!a && window.top && window.top.opener) a = findAPI(window.top.opener); } catch (e) { /* ignore */ }
    return a;
  }

  function looksLikeLms() {
    if (window.SIM_ALLOW_STANDALONE) return false;
    if (/^(file|blob):$/.test(window.location.protocol)) return false;
    var framed = false;
    try { framed = window.top !== window.self; } catch (e) { framed = true; }
    return framed || !!window.opener;
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

  function lastError() {
    try { return api && api.LMSGetLastError ? String(api.LMSGetLastError()) : '?'; } catch (e) { return '?'; }
  }

  function markFailure(what) {
    Scorm.ok = false;
    Scorm.error = what + ':' + lastError();
    if (window.console) console.warn('SCORM', Scorm.error);
    if (!retryTimer) {
      retryTimer = setInterval(function () {
        if (finished) { clearInterval(retryTimer); retryTimer = null; return; }
        if (Scorm.commit()) { clearInterval(retryTimer); retryTimer = null; if (Scorm.onRecover) Scorm.onRecover(); }
      }, 15000);
    }
    if (Scorm.onFailure) Scorm.onFailure(Scorm.error);
  }

  var Scorm = {
    log: log,
    ok: true,
    error: '',
    onFailure: null,
    onRecover: null,

    /** Seconds -> SCORM 1.2 CMITimespan "HH:MM:SS.SS" (rounded to centiseconds first). */
    timespan: function (seconds) {
      var cs = Math.round(Math.max(0, Number(seconds) || 0) * 100);
      var h = Math.floor(cs / 360000);
      var m = Math.floor((cs % 360000) / 6000);
      var s = cs % 6000;
      return pad(Math.min(h, 9999), 2) + ':' + pad(m, 2) + ':' + pad(Math.floor(s / 100), 2) + '.' + pad(s % 100, 2);
    },

    /** Date -> SCORM 1.2 CMITime "HH:MM:SS" */
    clock: function (date) {
      date = date || new Date();
      return pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2);
    },

    /**
     * Returns true when connected (LMS or allowed standalone mock).
     * Returns false (and sets Scorm.error) when inside an LMS that could not be reached.
     */
    init: function (key) {
      if (key) storageKey = 'sim-scorm:' + key;
      api = locateAPI();
      if (api) {
        var ok = false;
        try { ok = String(api.LMSInitialize('')) === 'true'; } catch (e) { ok = false; }
        if (!ok) {
          Scorm.error = 'init:' + lastError();
          api = null;
          return false;
        }
        connected = true;
      } else if (looksLikeLms()) {
        Scorm.error = 'noapi';
        return false;
      } else {
        standalone = true;
        connected = true;
        readMock();
        if (!mock['cmi.core.lesson_status']) mock['cmi.core.lesson_status'] = 'not attempted';
        mock['cmi.core.entry'] = mock['cmi.suspend_data'] ? 'resume' : 'ab-initio';
        if (!mock['cmi.core.student_name']) mock['cmi.core.student_name'] = '';
        if (!mock['cmi.core.lesson_mode']) mock['cmi.core.lesson_mode'] = 'normal';
        if (!mock['cmi.core.credit']) mock['cmi.core.credit'] = 'credit';
      }
      sessionStart = Date.now();
      return true;
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

    /** Returns true on success. `quiet` = do not mark the session as failing. */
    set: function (key, value, quiet) {
      if (!connected || finished) return false;
      value = value == null ? '' : String(value);
      log.push([key, value]);
      if (standalone) {
        mock[key] = value;
        return true;
      }
      var ok = false;
      try { ok = String(api.LMSSetValue(key, value)) === 'true'; } catch (e) { ok = false; }
      if (!ok && !quiet) markFailure('set ' + key);
      return ok;
    },

    commit: function () {
      if (!connected || finished) return false;
      if (standalone) { writeMock(); return true; }
      var ok = false;
      try { ok = String(api.LMSCommit('')) === 'true'; } catch (e) { ok = false; }
      if (!ok) markFailure('commit');
      else Scorm.ok = true;
      return ok;
    },

    finish: function () {
      if (!connected || finished) return;
      Scorm.set('cmi.core.session_time', Scorm.timespan((Date.now() - sessionStart) / 1000), true);
      Scorm.commit();
      finished = true;
      if (retryTimer) { clearInterval(retryTimer); retryTimer = null; }
      if (!standalone) {
        try { api.LMSFinish(''); } catch (e) { /* ignore */ }
      }
    },

    /** Wipes the local mock (standalone mode only). */
    resetLocal: function () {
      if (!standalone) return;
      mock = { 'cmi.core.lesson_status': 'not attempted', 'cmi.core.entry': 'ab-initio', 'cmi.core.lesson_mode': 'normal', 'cmi.core.credit': 'credit' };
      writeMock();
    }
  };

  window.Scorm = Scorm;
})();
