/* gancda demos: eight playable experiences, each with its own mechanic and look.
   Used by experiences.js. API: GancdaDemos.mount(el, id) -> instance, drop(instance), setLanguage(lang), info(id), ids(). */
(() => {
'use strict';
/* ---------- icons: one 24px line set, no emoji anywhere ---------- */
const I = {
  // UI
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  arrowR:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="M4.5 12.5l5 5 10-11"/>',
  play:'<path class="s" d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11.6-7.2a.8.8 0 0 0 0-1.4L8.2 4.1A.8.8 0 0 0 7 4.8z"/>',
  copy:'<rect x="8" y="8" width="12.5" height="12.5" rx="2"/><path d="M16 8V5.5a2 2 0 0 0-2-2H5.5a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2H8"/>',
  send:'<path d="M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5z"/>',
  megaphone:'<path d="M3.5 10v4a1 1 0 0 0 1 1H7l7.5 4.5v-15L7 9H4.5a1 1 0 0 0-1 1z"/><path d="M7.5 15l1.2 5h2.3l-1-4.2M18 9a4 4 0 0 1 0 6"/>',
  chef:'<path d="M7 14.5a4 4 0 0 1-.8-7.9A5 5 0 0 1 12 3.5a5 5 0 0 1 5.8 3.1 4 4 0 0 1-.8 7.9V20H7z"/><path d="M7 17h10"/>',
  calcheck:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M9 15l2 2 4-4"/>',
  coins:'<ellipse cx="9" cy="7" rx="6" ry="2.5"/><path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7"/><path d="M15 11c3.3 0 6 1.1 6 2.5S18.3 16 15 16s-6-1.1-6-2.5M9 13.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4"/>',
  stamp:'<path d="M12 3a2.5 2.5 0 0 0-2.5 2.5c0 1.6 1 2.4 1 4.5H9a3 3 0 0 0-3 3V15h12v-2a3 3 0 0 0-3-3h-1.5c0-2.1 1-2.9 1-4.5A2.5 2.5 0 0 0 12 3zM5 18.5h14M6.5 21h11"/>',
  layers:'<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M2.5 12.5 12 17.5l9.5-5"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pin:'<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  restart:'<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4h4"/>',
  store:'<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5c0 1.5 1.3 2.5 2.7 2.5s2.6-1 2.6-2.5c0 1.5 1.2 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.2 2.5 2.6 2.5S20 11 20 9.5M10 20v-4.5h4V20"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v2M3 12.5h18"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/>',
  clockfast:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  chat:'<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
  rocket:'<path d="M12 15.5 8.5 12C10 7 13.5 3.5 20.5 3.5 20.5 10.5 17 14 12 15.5z"/><path d="M8.5 12 5 11.5l2.5-3.5h4M12 15.5l.5 3.5 3.5-2.5v-4"/><circle cx="15.5" cy="8.5" r="1.5"/>',
  // food, drink and occasion icons used inside invites
  roll:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle class="f" cx="12" cy="12" r="2.3"/>',
  nigiri:'<rect x="4" y="12" width="16" height="7" rx="3.5"/><path class="f" d="M3 12.5c3-4.5 15-4.5 18 0-2.5 1.4-15.5 1.4-18 0z"/><path d="M9 9.2l1.4 2.4M13.2 8.6l1.4 2.8"/>',
  sashimi:'<path d="M3 19c6 2 12 2 18 0"/><rect class="f" x="4.5" y="6.5" width="5" height="10" rx="1.5" transform="rotate(-8 7 11.5)"/><rect x="9.5" y="6" width="5" height="10.5" rx="1.5"/><rect x="14.5" y="6.5" width="5" height="10" rx="1.5" transform="rotate(8 17 11.5)"/>',
  bowl:'<path class="f" d="M3 11h18a9 7.5 0 0 1-18 0z"/><path d="M8 19h8M9 8c0-1.5 1-1.5 1-3M13.5 8c0-1.5 1-1.5 1-3"/>',
  mochi:'<circle class="f" cx="8" cy="13" r="4.2"/><circle cx="16" cy="13" r="4.2"/><path d="M2.5 18.5h19"/>',
  omikuji:'<rect class="f" x="6.5" y="8.5" width="11" height="13" rx="1.5"/><path d="M10 8.5V3.5M13.5 8.5V2.5M9.5 13h5M9.5 16.5h5"/>',
  khinkali:'<path class="f" d="M4.5 16c0-4 3-7 7.5-9.5 4.5 2.5 7.5 5.5 7.5 9.5 0 2.2-3.4 3.5-7.5 3.5S4.5 18.2 4.5 16z"/><path d="M12 6.5V3.5M10.4 8.3 8.6 11.5M13.6 8.3l1.8 3.2M12 8.5v3.5"/>',
  khachapuri:'<path d="M2.5 12c3-4 6-5.5 9.5-5.5s6.5 1.5 9.5 5.5c-3 4-6 5.5-9.5 5.5S5.5 16 2.5 12z"/><ellipse cx="12" cy="12" rx="4.8" ry="2.8"/><circle class="f" cx="12" cy="12" r="1.6"/>',
  skewer:'<path d="M3 21 20.5 3.5"/><rect class="f" x="5.5" y="12.5" width="5" height="5" rx="1.4" transform="rotate(-45 8 15)"/><rect x="9.5" y="8.5" width="5" height="5" rx="1.4" transform="rotate(-45 12 11)"/><rect class="f" x="13.5" y="4.5" width="5" height="5" rx="1.4" transform="rotate(-45 16 7)"/>',
  pkhali:'<ellipse cx="12" cy="16" rx="9.5" ry="3.5"/><circle class="f" cx="8.2" cy="12.3" r="2.5"/><circle cx="12.5" cy="10.6" r="2.5"/><circle class="f" cx="16" cy="13" r="2.5"/>',
  jug:'<path d="M9.5 3h5M10.5 3v3.2C7.8 7.6 6.5 10 6.5 13c0 4 2.5 7.5 5.5 7.5s5.5-3.5 5.5-7.5c0-3-1.3-5.4-4-6.8V3"/><path class="f" d="M6.8 13.5h10.4c-.2 3.4-2.4 6.5-5.2 6.5s-5-3.1-5.2-6.5z"/><path d="M17.3 9.5c2 0 3.2 1.1 3.2 2.6s-1.2 2.6-3.2 2.6"/>',
  churchkhela:'<path d="M12 2v3"/><path class="f" d="M9 5h6v14a3 3 0 0 1-6 0z"/><path d="M9 9h6M9 13h6M9 17h6"/>',
  horn:'<path class="f" d="M3 5.6c1.5-1 3.5-1 5 0 1.6 5.2 5.5 10 13 14-6.2 1-12.2-2-15.6-8.4C4.3 9.1 3.5 7.2 3 5.6z"/><path d="M7.5 12.4l3-2M10.5 15.6l3-2.3"/>',
  pizza:'<path d="M12 21 3.5 5.5C8.5 3 15.5 3 20.5 5.5z"/><path d="M4.9 8C9.3 6 14.7 6 19.1 8"/><circle class="f" cx="10" cy="10.5" r="1.4"/><circle class="f" cx="14.2" cy="12" r="1.4"/><circle class="f" cx="12" cy="16" r="1.1"/>',
  pasta:'<ellipse cx="12" cy="17" rx="9.5" ry="3.5"/><path class="f" d="M6.5 16c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5"/><path d="M9 15.5c0-1.8 1.4-3 3-3s3 1.2 3 3M12 10.5V2.5M10 2.5v3a2 2 0 0 0 4 0v-3"/>',
  burrata:'<circle class="f" cx="12" cy="11.5" r="6.5"/><path d="M8.6 7.2c1.6 1.4 5.2 1.4 6.8 0"/><ellipse cx="12" cy="19" rx="9.5" ry="2.5"/>',
  tiramisu:'<path class="f" d="M3.5 18.5V10l8.5-4.5 8.5 4.5v8.5z"/><path d="M3.5 13h17M3.5 16h17M3.5 10h17"/>',
  glass:'<path d="M7.5 3h9c.5 4 .3 7-1.2 8.8A4.6 4.6 0 0 1 12 13.2a4.6 4.6 0 0 1-3.3-1.4C7.2 10 7 7 7.5 3z"/><path class="f" d="M7.7 7.2h8.6c-.1 1.9-.5 3.4-1.3 4.4A4.6 4.6 0 0 1 12 13a4.6 4.6 0 0 1-3-1.4c-.8-1-1.2-2.5-1.3-4.4z"/><path d="M12 13.2V20.5M8.5 20.5h7"/>',
  coin:'<circle cx="12" cy="12" r="8.5"/><circle class="f" cx="12" cy="12" r="6"/><path d="M9.5 12h5M12 9.5v5"/>',
  bottle:'<path d="M10 2.5h4M10.5 2.5v4.2c-2 1-3 2.6-3 4.8V20a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-8.5c0-2.2-1-3.8-3-4.8V2.5"/><rect class="f" x="7.5" y="12.5" width="9" height="5"/>',
  cork:'<path d="M8 2.5h8M12 2.5v4"/><path d="M12 6.5c2 .7 2 1.8 0 2.5s-2 1.8 0 2.5 2 1.8 0 2.5"/><rect class="f" x="8.5" y="14" width="7" height="7.5" rx="1.5"/>',
  board:'<rect x="2.5" y="9" width="15.5" height="9" rx="2"/><path d="M18 13.5h3.5"/><path class="f" d="M5 15.8 8.7 11l3.8 4.8z"/><circle cx="15" cy="13.5" r="1.6"/>',
  steak:'<path class="f" d="M4 13c-1-4 2.5-8 7-8 3 0 4 2 6.5 2.5S21 9 21 12c0 4-4 7-9.5 7C7.5 19 4.8 16.5 4 13z"/><path d="M8 11.5c0-2 1.5-3 3.5-3"/><circle cx="13" cy="12.5" r="1.6"/>',
  fries:'<path class="f" d="M6 10.5h12l-1.5 10.5h-9z"/><path d="M8 10.5 7.4 4M11 10.5V3M14 10.5l.6-6M16.6 10.5l1-4.5"/>',
  flame:'<path class="f" d="M12 21c-3.9 0-7-2.7-7-6.4 0-3.4 2.4-5.2 3.7-8.1.5 1.5 1.2 2.4 2.3 3 0-3 1.5-5.6 4-7 0 3 1.4 4.6 2.6 6.4A8 8 0 0 1 19 14.6c0 3.7-3.1 6.4-7 6.4z"/><path d="M12 21c-1.7 0-3-1.2-3-2.8 0-1.8 1.6-2.6 2.3-4.2.8 1.3 3.7 2 3.7 4.2 0 1.6-1.3 2.8-3 2.8z"/>',
  cocktail:'<path d="M3.5 4h17L12 13z"/><path class="f" d="M6.3 7h11.4L12 12.6z"/><path d="M12 13v7.5M8 20.5h8M15.5 2 13 7"/>',
  highball:'<path d="M7 4h10l-1.2 16.5H8.2z"/><path class="f" d="M7.4 9.5h9.2l-.8 11H8.2z"/><path d="M14.5 2l-1.5 11"/>',
  coupe:'<path d="M3.5 6h17c0 4-3.8 6.5-8.5 6.5S3.5 10 3.5 6z"/><path class="f" d="M4.4 8h15.2c-.9 2.6-3.9 4.5-7.6 4.5S5.3 10.6 4.4 8z"/><path d="M12 12.5v8M8.5 20.5h7"/>',
  citrus:'<circle cx="12" cy="12" r="8.5"/><circle class="f" cx="12" cy="12" r="6.3"/><path d="M12 5.7v12.6M5.7 12h12.6M7.5 7.5l9 9M16.5 7.5l-9 9"/>',
  plate:'<ellipse cx="12" cy="15" rx="9.5" ry="4.5"/><ellipse cx="12" cy="15" rx="5.5" ry="2.4"/><circle class="f" cx="9" cy="10" r="1.8"/><circle cx="13" cy="9.3" r="1.8"/><circle class="f" cx="16.2" cy="10.8" r="1.5"/>',
  sunset:'<path d="M3 17h18M6.5 20.5h11"/><path class="f" d="M6.5 17a5.5 5.5 0 0 1 11 0z"/><path d="M12 6.5V4M5.6 9.1 4 7.5M18.4 9.1 20 7.5M3.5 14H2M22 14h-1.5"/>',
  building:'<rect x="4" y="3.5" width="11" height="17" rx="1"/><path d="M15 9h4.5a.5.5 0 0 1 .5.5v11h-5"/><path d="M7.5 7.5H9M11 7.5h1.5M7.5 11H9M11 11h1.5M7.5 14.5H9M11 14.5h1.5"/><path class="f" d="M8.5 20.5v-3h2v3z"/>',
  video:'<rect class="f" x="2.5" y="6.5" width="13" height="11" rx="2"/><path d="M15.5 10.5 21 7.5v9l-5.5-3"/>',
  coffee:'<path class="f" d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c0 1.5 1 1.5 1 3M12 3.5c0 1.5 1 1.5 1 3M3 21.5h14"/>',
  tea:'<path d="M4 9h13v4.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10.5h1a2.5 2.5 0 0 1 0 5h-1.5M10 9V4l3 2"/><rect class="f" x="11.8" y="5.6" width="2.6" height="3" rx=".5"/>',
  clock:'<circle class="f" cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  bulb:'<path class="f" d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.3v1.4h5v-1.4c0-.9.4-1.7 1.1-2.3A6 6 0 0 0 12 3z"/><path d="M9.5 20.5h5"/>',
  music:'<path d="M9 18V5.5l11-2.5v12.5"/><circle class="f" cx="6.5" cy="18" r="2.5"/><circle class="f" cx="17.5" cy="15.5" r="2.5"/>',
  cake:'<path class="f" d="M4 12h16v8.5H4z"/><path d="M4 15.5c2 1.3 4 1.3 5.3 0s4-1.3 5.4 0 4 1.3 5.3 0M2.5 20.5h19M8 12V9M12 12V8.5M16 12V9"/><path d="M8 6.8c-.6-.8 0-1.6 0-2.3.8.6 1 1.6 0 2.3zM12 6.3c-.6-.8 0-1.6 0-2.3.8.6 1 1.6 0 2.3zM16 6.8c-.6-.8 0-1.6 0-2.3.8.6 1 1.6 0 2.3z"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path class="f" d="M4.5 12h15v8.5h-15z"/><path d="M12 8v12.5M12 8C10.5 5 7 4.5 7 6.3S10 8 12 8zM12 8c1.5-3 5-3.5 5-1.7S14 8 12 8z"/>',
  camera:'<path class="f" d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/><circle cx="12" cy="13" r="3.8"/>',
  mic:'<rect class="f" x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  balloon:'<path class="f" d="M12 3c3.6 0 6 2.8 6 6.2 0 4-3 7.3-6 7.3s-6-3.3-6-7.3C6 5.8 8.4 3 12 3z"/><path d="M11 16.5h2l-1 1.5zM12 18c0 1.5-2 1.5-2 3.5"/>',
  candle:'<rect class="f" x="9" y="10" width="6" height="11" rx="1"/><path d="M12 10V8.2M9 14h6"/><path d="M12 7.6c-1.4 0-2.2-1-2.2-2.2 0-1.5 2.2-2.9 2.2-2.9s2.2 1.4 2.2 2.9c0 1.2-.8 2.2-2.2 2.2z"/>',
  flower:'<path class="f" d="M7 4l2.5 2.5L12 3l2.5 3.5L17 4v5a5 5 0 0 1-10 0z"/><path d="M12 14v7.5M12 18c-1.5-2-4-2.5-5.5-2 .5 2 3 3.5 5.5 3M12 18c1.5-2 4-2.5 5.5-2-.5 2-3 3.5-5.5 3"/>',
  star:'<path class="f" d="M12 3l2.6 5.5 6 .8-4.4 4.1 1.1 6L12 16.6l-5.3 2.8 1.1-6-4.4-4.1 6-.8z"/>',
  fish:'<path class="f" d="M5.5 12c2.5-3.5 5.8-5 8.8-5s5.2 2 7.2 5c-2 3-4.2 5-7.2 5s-6.3-1.5-8.8-5z"/><path d="M5.5 12 2.5 8.5v7z"/><circle cx="16.8" cy="11" r=".9"/>',
  leaf:'<path class="f" d="M5 19C5 10 10 4.5 20 4c0 9-5 15-13 15z"/><path d="M5 19c3-4 6.5-7 10-9.5"/>',
  bus:'<rect x="4" y="3.5" width="16" height="14" rx="2.5"/><path class="f" d="M6.5 6h11v5h-11z"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/><path d="M7 17.5V20M17 17.5V20"/>',
  trophy:'<path class="f" d="M7 3.5h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4.5c0 3 1 4.5 3 4.8M17 5h2.5c0 3-1 4.5-3 4.8M12 13.5V17M8.5 20.5h7l-.8-3.5H9.3z"/>',
  ring:'<circle cx="12" cy="15" r="6"/><path class="f" d="M9.3 5.6 10.8 3h2.4l1.5 2.6L12 8.6z"/>'
};
const ic = (n, cls) => '<svg viewBox="0 0 24 24" class="ico'+(cls?' '+cls:'')+'" aria-hidden="true">'+(I[n]||'')+'</svg>';

/* ---------- background patterns for invite screens ---------- */
function pat(name, c, c2){
  const P = {
    waves:"<svg xmlns='http://www.w3.org/2000/svg' width='60' height='30' viewBox='0 0 60 30'><g fill='none' stroke='"+c+"' stroke-width='1.2'><circle cx='30' cy='30' r='28'/><circle cx='30' cy='30' r='21'/><circle cx='30' cy='30' r='14'/><circle cx='30' cy='30' r='7'/><circle cx='0' cy='15' r='28'/><circle cx='0' cy='15' r='21'/><circle cx='0' cy='15' r='14'/><circle cx='60' cy='15' r='28'/><circle cx='60' cy='15' r='21'/><circle cx='60' cy='15' r='14'/></g></svg>",
    grapes:"<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><g fill='"+c+"'><circle cx='11' cy='10' r='2.4'/><circle cx='8' cy='14.5' r='2.4'/><circle cx='14' cy='14.5' r='2.4'/><circle cx='11' cy='19' r='2.4'/><circle cx='33' cy='31' r='2.4'/><circle cx='30' cy='35.5' r='2.4'/><circle cx='36' cy='35.5' r='2.4'/><circle cx='33' cy='40' r='2.4'/></g><path d='M11 7.5c1-3 3-4 5-4M33 28.5c1-3 3-4 5-4' stroke='"+c+"' fill='none' stroke-width='1.2'/></svg>",
    gingham:"<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><g fill='"+c+"'><rect width='14' height='28' opacity='.55'/><rect width='28' height='14' opacity='.55'/></g></svg>",
    rings:"<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'><g fill='none' stroke='"+c+"' stroke-width='1.6'><circle cx='28' cy='30' r='15' stroke-dasharray='70 6 12 6'/><circle cx='66' cy='66' r='13' stroke-dasharray='50 8 18 5'/></g></svg>",
    grill:"<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><path d='M-6.5 6.5l13-13M0 26L26 0M19.5 32.5l13-13' stroke='"+c+"' stroke-width='3'/></svg>",
    stars:"<svg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'><g fill='"+c+"'><circle cx='8' cy='12' r='1'/><circle cx='40' cy='6' r='.7'/><circle cx='58' cy='36' r='1.1'/><circle cx='24' cy='48' r='.7'/><circle cx='50' cy='62' r='.8'/><path d='M30 26l1 3 3 1-3 1-1 3-1-3-3-1 3-1z'/></g></svg>",
    grid:"<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><path d='M22 .5H.5V22' fill='none' stroke='"+c+"'/></svg>",
    confetti:"<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect x='6' y='8' width='8' height='3' rx='1.5' fill='"+c+"' transform='rotate(30 10 9.5)'/><rect x='40' y='14' width='8' height='3' rx='1.5' fill='"+c2+"' transform='rotate(-40 44 15.5)'/><circle cx='26' cy='34' r='2' fill='"+c2+"'/><rect x='48' y='44' width='8' height='3' rx='1.5' fill='"+c+"' transform='rotate(70 52 45.5)'/><circle cx='12' cy='52' r='1.6' fill='"+c+"'/></svg>",
    diamond:"<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M14 2l12 12-12 12L2 14z' fill='none' stroke='"+c+"'/></svg>",
    lines:"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path d='M8 0v16' stroke='"+c+"'/></svg>"
  };
  return "url('data:image/svg+xml,"+encodeURIComponent(P[name]||'').replace(/'/g,'%27')+"')";
}

const L = (ka, en) => ({ka, en: en===undefined ? ka : en});
const it = (ic, ka, en, dka, den, pka, pen, col) => ({ic, n:L(ka,en), d:L(dka,den), p: pka ? L(pka, pen) : null, col});
const TPL = [
{ id:'omakase', cat:'restaurant', original:true,
  name:L('ომაკასე','Omakase'), kind:L('სუშის ბარი','Sushi bar'),
  desc:L('ნორენის ფარდა, სუშის კონვეიერი, ომიკუჯის ყუთი და 確定-ის ბეჭედი. შაბლონი, რომლითაც ყველაფერი დაიწყო.','A noren curtain, a sushi conveyor, an omikuji box and a 確定 stamp. The template the whole idea started with.'),
  c:{bg:'#121018',s:'#1c1922',s2:'#25212c',ink:'#f4ecdf',mut:'#a69a8c',acc:'#c8312b',on:'#ffffff',acc2:'#c9a45c',paper:'#f4ecdf',pink:'#121018',line:'#342e3c',flap:'#1f2a4d',flapInk:'#fffaf0'},
  pat:'waves', po:.06, jp:true, fx:'petal', fxc:['#f6c1cc','#fde2e7','#f6c1cc'],
  op:{type:'noren', l:'寿', r:'司', ls:L('სუ','SU'), rs:L('ში','SHI')},
  kick:L('いらっしゃいませ'), kick2:L('デート の お誘い'),
  to:L('ანი','Ani'), toGen:L('ანის','Ani’s'), from:L('ლუკა','Luka'),
  intro:L('შენთვის რაღაც პატარა დავჯავშნე. შემოდი.','I booked a little something for you. Come in.'),
  hint:L('შეეხე ფარდას','Tap the curtain'),
  q:L('წამოხვალ ჩემთან ერთად სუშის პაემანზე?','Will you go on a sushi date with me?'),
  noLines:L(['შეფმა ვერ გაიგო.','ვასაბი გეუბნება: კიდევ სცადე.','ორაგულს გული დასწყდა.','აი, აღარც არის.'],['The chef didn’t hear that.','The wasabi says: try again.','The salmon is heartbroken.','And now it’s gone.']),
  pickT:L('აირჩიე, რაც გინდა','Pick what you like'), max:3,
  items:[
    it('roll','ფილადელფია როლი','Philadelphia roll','ორაგული, ნაღების ყველი, ავოკადო','Salmon, cream cheese, avocado','8 ც.','8 pcs','#f08a5d'),
    it('roll','დრაკონი','Dragon roll','კრევეტის ტემპურა, გველთევზა, უნაგის სოუსი','Shrimp tempura, eel, unagi sauce','8 ც.','8 pcs','#7a4626'),
    it('nigiri','საკე ნიგირი','Sake nigiri','ორაგული','Salmon','2 ც.','2 pcs','#f08a5d'),
    it('sashimi','მაგურო საშიმი','Maguro sashimi','თინუსი','Tuna','5 ც.','5 pcs','#c8312b'),
    it('bowl','მისოს წვნიანი','Miso soup','ტოფუ, ვაკამე, მწვანე ხახვი','Tofu, wakame, scallion',null,null,'#d9a35a'),
    it('mochi','მოჩი','Mochi','მწვანე ჩაის ნაყინი','Green tea ice cream','2 ც.','2 pcs','#9cc27a')
  ],
  sp:{ic:'omikuji', title:L('ომიკუჯი','Omikuji'), hint:L('შეეხე ყუთს და ნახე, რა გელის.','Tap the box to see what awaits.'), big:L('大吉'), jp:true, lbl:L('დიდი იღბალი','Great luck'),
      lines:L(['ბოლო ნაჭერი შენია. უდავოდ.','ვარსკვლავები გირჩევენ, დესერტზე უარი არ თქვა.','ამ საღამოს ბევრს იცინებ. უკვე დადასტურებულია.'],['The last piece is yours. No debate.','The stars advise: don’t skip dessert.','You will laugh a lot tonight. Already confirmed.'])},
  tk:{venue:L('NAMI'), sub:L('სუშის ბარი · თბილისი','SUSHI BAR · TBILISI'), days:2, time:'21:00',
      fields:[[L('სტუმრები','Guests'),L('ანი + ლუკა','Ani + Luka')],[L('ფორმატი','Format'),L('ა ლა კარტი','À la carte')],[L('ჯავშანი','Booking'),L('NM-2048')]],
      stamp:{big:L('確定'), jp:true, round:false}},
  sign:L('ჩაიცვი, როგორც მოგინდება. მთავარია, მშიერი მოხვიდე.','Wear whatever you like. Just come hungry.') },
];
const TBY = Object.fromEntries(TPL.map(t => [t.id, t]));

/* ---------- strings used inside every invite ---------- */
const G = {
  ka:{yes:'კი', no:'არა', next:'შემდეგი', toTicket:'ბილეთის ნახვა', stamp:'ვადასტურებ', order:'შეკვეთა №', pax:'სტუმარი', board:'ჩასხდომა', boardT:'ჩასხდომის ბილეთი', to:'ვის', admit:'შესასვლელი ბილეთი', visitor:'სტუმარი', again:'თავიდან დაწყება',
      count:'არჩეულია {n} / {m}', max:'მაქსიმუმ {m}. ჯერ რომელიმე ამოიღე.', pickNote:'მენიუდან. აირჩიე {m}-მდე.',
      date:'თარიღი', time:'დრო', picks:'{to} არჩევანი', d:'დღე', h:'საათი', m:'წუთი', s:'წამი', tk:'შენი ბილეთი', ok:'დადასტურდა', now:'დროა!'},
  en:{yes:'Yes', no:'No', next:'Next', toTicket:'See my ticket', stamp:'Confirm', order:'ORDER №', pax:'Guest', board:'Boarding', boardT:'Boarding pass', to:'To', admit:'ADMIT ONE', visitor:'Visitor', again:'Start over',
      count:'{n} of {m} picked', max:'Up to {m}. Remove one first.', pickNote:'From the menu. Choose up to {m}.',
      date:'Date', time:'Time', picks:'{to} picks', d:'days', h:'hrs', m:'min', s:'sec', tk:'Your ticket', ok:'CONFIRMED', now:'It’s time!'}
};

/* month and day names for dates on tickets and coupons */
const S = {ka:{
  days:['კვირა','ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი'],
  months:['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი']
}, en:{
  days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  months:['January','February','March','April','May','June','July','August','September','October','November','December']
}};
let lang = document.documentElement.lang === 'en' ? 'en' : 'ka';
const tx = v => (v && typeof v === 'object' && !Array.isArray(v) && ('ka' in v)) ? v[lang] : v;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const path = (o, p) => p.split('.').reduce((a, k) => a == null ? a : a[k], o);
const mt = s => String(s).replace(/[ა-ჺჽ-ჿ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xBC0));
const caps = s => lang === 'ka' ? mt(s) : s;
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => o[k] != null ? o[k] : m);
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

function demoDate(t){
  const d = new Date(); d.setDate(d.getDate() + (t.tk.days || 3));
  const p = t.tk.time.split(':'); d.setHours(+p[0], +p[1], 0, 0); return d;
}
function fmtDate(d){
  const D = S[lang];
  return lang === 'ka' ? D.days[d.getDay()] + ',<br>' + d.getDate() + ' ' + D.months[d.getMonth()]
                       : D.days[d.getDay()] + ',<br>' + d.getDate() + ' ' + D.months[d.getMonth()];
}
/* each template carries its own art direction: layout, type, components, ticket */
const UI_DEF = {align:'center', head:'serif', body:'sans', caps:false, h1:38, rad:14, brad:999, btn:'fill', card:'solid', frame:'', kick:'', ask:'belt', pick:'list', tk:'stub', glow:1};
const HEADS = {
  serif:['var(--fi-serif)', 800, '100%', '0'],
  light:['var(--fi-serif)', 500, '100%', '.005em'],
  sans: ['var(--fi-sans)', 800, '100%', '0'],
  cond: ['var(--fi-sans)', 900, '62.5%', '.01em'],
  geo:  ['var(--fi-geo)', 700, '100%', '-.01em']
};
const uiOf = t => Object.assign({}, UI_DEF, t.ui || {});
const capsT = s => lang === 'ka' ? mt(s) : String(s).toUpperCase();
function tvars(t){
  const c = t.c, u = uiOf(t), h = HEADS[u.head] || HEADS.serif;
  return ['--ibg:'+c.bg,'--is:'+c.s,'--is2:'+c.s2,'--iink:'+c.ink,'--imut:'+c.mut,'--iacc:'+c.acc,'--ion:'+c.on,'--iacc2:'+c.acc2,
    '--ipaper:'+c.paper,'--ipink:'+c.pink,'--iline:'+c.line,'--iflap:'+(c.flap||c.acc),'--iflapink:'+(c.flapInk||c.on),
    '--ibox:'+(c.box||c.acc),'--iaccp:'+(c.accp||c.acc),'--ipat:'+pat(t.pat, t.patc||c.ink, c.acc2),'--ipo:'+(t.po||.06),
    '--idisp:'+h[0],'--ihf:'+h[0],'--ihw:'+h[1],'--ihs:'+h[2],'--ihl:'+h[3],'--ih1:'+u.h1+'px',
    '--ibf:'+(u.body === 'geo' ? 'var(--fi-geo)' : 'var(--fi-sans)'),'--irad:'+u.rad+'px','--ibrad:'+u.brad+'px','--iglow:'+u.glow,
    '--iout:'+(c.out||c.acc2),'--ibgimg:'+(c.bgImg||'none'),'--itable:'+(c.table||c.s2),'--isil:'+(c.sil||c.bg),
    '--iglyph:'+(t.jp?'var(--f-jp)':'var(--fi-serif)'),'--ikick:'+(t.jp?'var(--f-jp)':'inherit')].join(';');
}
function scrOpen(t){
  const u = uiOf(t);
  const cls = 'scr al-'+u.align+' b-'+u.btn+' c-'+u.card+(u.frame ? ' has-frame frm-'+u.frame : '')+(u.kick ? ' k-'+u.kick : '')+(u.caps ? ' hcaps' : '');
  return '<div class="'+cls+'" style="'+tvars(t)+'">';
}
const frameEl = t => { const u = uiOf(t); return u.frame ? '<div class="i-frame fr-'+u.frame+'" aria-hidden="true"></div>' : ''; };

/* ---------- invite views ---------- */
function vOpener(t, isStatic){
  const o = t.op, tag = isStatic ? 'span' : 'button';
  const attrs = isStatic ? '' : ' type="button" data-act="open" aria-label="'+esc(tx(t.hint))+'"';
  if (o.type === 'noren' || o.type === 'doors'){
    const behind = '<span class="op-behind">'+ic(t.items[0].ic)+ic(t.items[1].ic)+'</span>';
    return '<'+tag+' class="op op-'+o.type+'"'+attrs+'>'+behind+'<span class="op-rod"></span>'+
      '<span class="op-flap l"><b>'+esc(o.l)+'</b><small>'+esc(tx(o.ls))+'</small></span>'+
      '<span class="op-flap r"><b>'+esc(o.r)+'</b><small>'+esc(tx(o.rs))+'</small></span></'+tag+'>';
  }
  if (o.type === 'env'){
    return '<'+tag+' class="op op-env"'+attrs+'><span class="env-back"></span>'+
      '<span class="env-letter"><small>'+esc(tx(o.label))+'</small><b>'+esc(tx(t.to))+'</b></span>'+
      '<span class="env-front"></span><span class="env-flap"></span><span class="env-seal">'+esc(o.glyph)+'</span></'+tag+'>';
  }
  return '<'+tag+' class="op op-box v-'+o.v+'"'+attrs+'><span class="bx-in">'+ic(o.inside)+'</span><span class="bx-base"></span>'+
    '<span class="bx-lid">'+(o.label?'<b>'+esc(tx(o.label))+'</b>':'')+(o.small?'<small>'+esc(tx(o.small))+'</small>':'')+'</span></'+tag+'>';
}
function vCover(t, isStatic){
  const u = uiOf(t), name = tx(t.to);
  return '<section class="i-step"><div class="i-kick">'+esc(tx(t.kick))+'</div>'+
    '<h1 class="i-h1">'+esc(u.caps ? capsT(name) : name)+(t.punct || ',')+'</h1><p class="i-lead">'+esc(tx(t.intro))+'</p>'+
    vOpener(t, isStatic)+'<p class="i-hint"><i></i>'+esc(tx(t.hint))+'</p></section>';
}
const dots = n => '<div class="i-dots" aria-hidden="true">'+[1,2,3,4].map(i => '<i'+(i<=n?' class="a"':'')+'></i>').join('')+'</div>';
const fcol = c => c ? ' style="--f:'+c+'"' : '';
/* Tbilisi at dusk: Narikala walls on the left, the old town, Mtatsminda and its TV tower on the right */
const SKY = '<svg class="i-sky" viewBox="0 0 300 120" aria-hidden="true">'+
  '<circle cx="150" cy="98" r="44" fill="var(--iacc)" opacity=".92"/>'+
  '<path fill="var(--isil)" d="M0 120V84l18-6 12-8h10v-8h4v4h4v-4h4v4h4v-6h4v6h4v-4h4v4h4v-4h4v8l16 6 16 10h6v-8h6v8h6V72h4v14h8v-6h8v8h10V76h4v12h10l16-10 20-14 20-10 14-3 16 3 20 10 24 8v48z"/>'+
  '<path fill="var(--isil)" d="M236 52l3-42h2l3 42zM239.6 10V1h.8v9zM232 40h16v2.4h-16zM234.5 27h11v2.2h-11z"/>'+
  '<g fill="var(--iacc)" opacity=".85"><rect x="116" y="82" width="2" height="2"/><rect x="132" y="78" width="2" height="2"/><rect x="152" y="84" width="2" height="2"/><rect x="164" y="80" width="2" height="2"/><rect x="58" y="70" width="2" height="2"/></g></svg>';
function askArt(t){
  const u = uiOf(t);
  if (u.ask === 'belt'){
    const dish = t.items.map(x => '<div class="i-dish"'+fcol(x.col)+'>'+ic(x.ic)+'</div>').join('');
    return '<div class="i-belt" aria-hidden="true"><div class="i-track">'+dish+dish+dish+dish+'</div></div>';
  }
  if (u.ask === 'trio') return '<div class="i-trio" aria-hidden="true">'+(t.trio || [0,1,2]).map(i => { const x = t.items[i]; return '<span'+fcol(x.col)+'>'+ic(x.ic)+'</span>'; }).join('')+'</div>';
  if (u.ask === 'skyline') return SKY;
  if (u.ask === 'details') return '<dl class="i-det">'+(t.det || []).map(r => '<div><dt>'+esc(capsT(tx(r[0])))+'</dt><dd>'+(r[1] === '@date' ? fmtDate(demoDate(t)).replace('<br>', ' ') : esc(tx(r[1])))+'</dd></div>').join('')+'</dl>';
  return '';
}
function vAsk(t){
  const g = G[lang], u = uiOf(t), big = u.ask === 'bigtype';
  return '<section class="i-step">'+dots(1)+'<div class="i-kick">'+esc(tx(t.kick2||t.kick))+'</div>'+
    (big ? '<div class="i-bigic" aria-hidden="true">'+ic(t.bigIc || t.sp.ic)+'</div>' : '')+
    '<h2 class="i-h2'+(big ? ' i-big' : '')+'">'+esc(tx(t.q))+'</h2>'+askArt(t)+
    '<div class="i-row"><button type="button" class="i-btn i-yes" data-act="yes">'+esc(tx(t.yes)||g.yes)+'</button>'+
    '<button type="button" class="i-btn i-no" data-act="no">'+esc(g.no)+'</button></div><div class="i-msg" aria-live="polite"></div></section>';
}
function vPick(t, s){
  const g = G[lang], u = uiOf(t);
  const list = t.items.map((x, i) => '<button type="button" class="i-item'+(s.picks.includes(i)?' sel':'')+'" data-act="pick" data-i="'+i+'" aria-pressed="'+s.picks.includes(i)+'">'+
    '<span class="ic"'+fcol(x.col)+'>'+ic(x.ic)+'</span><span class="tx"><b>'+esc(tx(x.n))+'</b><small>'+esc(tx(x.d))+'</small></span>'+
    (x.p?'<span class="pc">'+esc(tx(x.p))+'</span>':'')+'<span class="ck">'+ic('check')+'</span></button>').join('');
  return '<section class="i-step">'+dots(2)+'<h2 class="i-h2">'+esc(tx(t.pickT))+'</h2>'+
    '<p class="i-lead">'+esc(fill(g.pickNote,{m:t.max}))+'</p><div class="i-list pk-'+u.pick+'">'+list+'</div>'+
    '<div class="i-tray"></div><div class="i-count" aria-live="polite"></div>'+
    '<div class="i-row"><button type="button" class="i-btn" data-act="next">'+esc(g.next)+'</button></div></section>';
}
function vSurprise(t, s){
  const g = G[lang], sp = t.sp, done = s.fortune >= 0;
  let h = '<section class="i-step">'+dots(3)+'<h2 class="i-h2">'+esc(tx(sp.title))+'</h2>';
  if (!done) h += '<p class="i-lead">'+esc(tx(sp.hint))+'</p><button type="button" class="i-obj" data-act="reveal" aria-label="'+esc(tx(sp.hint))+'">'+ic(sp.ic)+'</button>';
  else {
    h += '<div class="i-obj done">'+ic(sp.ic)+'</div><div class="i-card"><div class="big"'+(sp.jp?' style="--ibig:var(--f-jp)"':'')+'>'+esc(tx(sp.big))+'</div>'+
      '<div class="lbl">'+esc(tx(sp.lbl))+'</div><p>'+esc(tx(sp.lines)[s.fortune])+'</p></div>'+
      '<div class="i-row"><button type="button" class="i-btn" data-act="next">'+esc(g.toTicket)+'</button></div>';
  }
  return h + '</section>';
}
const QR = (() => { const rows = ['1110111','1010101','1110111','0001000','1101011','0110110','1011101']; let r = '';
  rows.forEach((row, y) => row.split('').forEach((b, x) => { if (b === '1') r += '<rect x="'+x+'" y="'+y+'" width="1" height="1"/>'; }));
  return '<svg class="tkg-qr" viewBox="0 0 7 7" aria-hidden="true">'+r+'</svg>'; })();
function vTicket(t, s){
  const g = G[lang], u = uiOf(t), tk = t.tk, d = demoDate(t);
  const date2 = fmtDate(d), date1 = date2.replace('<br>', ' ');
  const flds = tk.fields.map(f => [tx(f[0]), tx(f[1])]);
  const picks = s.picks.map(i => t.items[i]);
  const chips = picks.map(x => '<span class="i-chip"><span'+fcol(x.col)+'>'+ic(x.ic)+'</span>'+esc(tx(x.n))+'</span>').join('');
  const names = picks.map(x => esc(tx(x.n))).join(' · ');
  const pickLbl = esc(caps(fill(g.picks, {to:tx(t.toGen)})));
  const luck = s.fortune >= 0 ? esc(tx(t.sp.lines)[s.fortune]) : '';
  const big = tx(tk.stamp.big), sz = big.length > 4 ? (big.length > 5 ? 12 : 14) : (big.length > 2 ? 18 : 23);
  const stamp = '<div class="i-stamp'+(tk.stamp.round?' round':'')+(s.stamped?' on':'')+'" style="--sz:'+sz+'px'+(tk.stamp.jp?';--ibig:var(--f-jp)':'')+'"><b>'+esc(big)+'</b><small>'+esc(caps(g.ok))+'</small></div>';
  const cell = (l, v) => '<div><label>'+esc(caps(l))+'</label><div>'+v+'</div></div>';
  const venue = tx(tk.venue);
  let card;
  if (u.tk === 'card'){
    card = '<div class="i-tk tk-card tf-'+(u.frame || 'hairline')+'"><div class="tkc-in"><div class="tkc-sub">'+esc(caps(tx(tk.sub)))+'</div>'+
      '<div class="tkc-venue">'+esc(u.caps ? capsT(venue) : venue)+'</div><div class="tkc-rule"></div>'+
      '<div class="tkc-date">'+date1+'</div><div class="tkc-time">'+tk.time+'</div>'+
      '<div class="tkc-fields">'+flds.map(f => '<span><b>'+esc(caps(f[0]))+'</b>'+esc(f[1])+'</span>').join('')+'</div>'+
      (names ? '<div class="tkc-picks"><label>'+pickLbl+'</label>'+names+'</div>' : '')+(luck ? '<p class="tkc-luck">'+luck+'</p>' : '')+stamp+'</div></div>';
  } else if (u.tk === 'postcard'){
    card = '<div class="i-tk tk-post"><div class="tkp-top"><div class="tkp-brand">'+esc(venue)+'<small>'+esc(caps(tx(tk.sub)))+'</small></div>'+
      '<div class="tkp-post"><i>'+ic(t.items[0].ic)+'<span>'+esc(tx(tk.post || L('POSTA')))+'</span></i></div></div>'+
      '<div class="tkp-grid"><div class="tkp-msg">'+luck+(names ? '<b>'+names+'</b>' : '')+'</div><div class="tkp-addr">'+
      [[g.to, esc(tx(t.to))], [g.date, date1], [g.time, tk.time]].concat(flds.map(f => [f[0], esc(f[1])])).map(r => '<div class="ln"><label>'+esc(caps(r[0]))+'</label>'+r[1]+'</div>').join('')+
      '</div></div>'+stamp+'</div>';
  } else if (u.tk === 'receipt'){
    const code = (flds[flds.length - 1] || ['', ''])[1];
    const row = (l, v) => '<div class="tkr-row"><span>'+l+'</span><span class="dd"></span><span>'+v+'</span></div>';
    card = '<div class="i-tk tk-rcpt"><div class="tkr-head"><b>'+esc(venue)+'</b><span>'+esc(caps(tx(tk.sub)))+'</span><span>'+esc(g.order)+' '+esc(code)+'</span></div><div class="tkr-sep"></div>'+
      row(esc(g.date), date1)+row(esc(g.time), tk.time)+flds.slice(0, -1).map(f => row(esc(f[0]), esc(f[1]))).join('')+
      (picks.length ? '<div class="tkr-sep"></div>'+picks.map(x => row('1 × '+esc(tx(x.n)), x.p ? esc(tx(x.p)) : '')).join('') : '')+
      '<div class="tkr-sep"></div>'+(luck ? '<p class="tkr-luck">'+luck+'</p>' : '')+'<div class="tkr-bar"></div><div class="tkr-code">'+esc(code)+'</div>'+stamp+'</div>';
  } else if (u.tk === 'pass'){
    const r = tk.route || {a:'TBS', al:L('თბილისი','Tbilisi'), b:'—', bl:L('')};
    const code = (flds[flds.length - 1] || ['', ''])[1];
    card = '<div class="i-tk tk-pass"><div class="tkb-band"><span>'+esc(venue)+'</span><span>'+esc(caps(g.boardT))+'</span></div>'+
      '<div class="tkb-route"><div><b>'+esc(r.a)+'</b><small>'+esc(tx(r.al))+'</small></div>'+ic('arrowR')+'<div><b>'+esc(r.b)+'</b><small>'+esc(tx(r.bl))+'</small></div></div>'+
      '<div class="tkb-grid">'+cell(g.pax, esc(tx(t.to)))+cell(g.date, date1)+cell(g.board, tk.time)+flds.slice(1, -1).map(f => cell(f[0], esc(f[1]))).join('')+'</div>'+
      (chips ? '<div class="tkb-picks"><label>'+pickLbl+'</label>'+chips+'</div>' : '')+(luck ? '<p class="tkb-luck">'+luck+'</p>' : '')+
      '<div class="tkb-tear"></div><div class="tkb-stub"><div class="tkb-bar"></div><span>'+esc(code)+'</span></div>'+stamp+'</div>';
  } else if (u.tk === 'badge'){
    const name = tx(t.to);
    card = '<div class="i-tk tk-badge"><div class="tkg-slot"></div><div class="tkg-head">'+esc(venue)+'<span>'+esc(caps(tx(tk.sub)))+'</span></div>'+
      '<div class="tkg-ava">'+esc(name.charAt(0))+'</div><div class="tkg-name">'+esc(name)+'</div><div class="tkg-role">'+esc((flds[0] || ['', ''])[1])+'</div>'+
      '<div class="tkg-grid">'+cell(g.date, date1)+cell(g.time, tk.time)+flds.slice(1).map(f => cell(f[0], esc(f[1]))).join('')+'</div>'+
      (chips ? '<div class="i-picks"><label>'+pickLbl+'</label>'+chips+'</div>' : '')+(luck ? '<p class="tkg-luck">'+luck+'</p>' : '')+
      '<div class="tkg-foot"><span>'+esc(caps(g.visitor))+'</span>'+QR+'</div>'+stamp+'</div>';
  } else if (u.tk === 'label'){
    card = '<div class="i-tk tk-label"><div class="tkl-in"><div class="tkl-top">'+esc(caps(tx(tk.sub)))+'</div><div class="tkl-name">'+esc(capsT(venue))+'</div>'+
      '<div class="tkl-orn">'+ic('diamond')+'</div><div class="tkl-vint">'+d.getFullYear()+'</div><div class="tkl-date">'+date1+' · '+tk.time+'</div>'+
      '<div class="tkl-fields">'+flds.map(f => esc(f[1])).join(' · ')+'</div>'+(names ? '<div class="tkl-picks"><label>'+pickLbl+'</label>'+names+'</div>' : '')+
      (luck ? '<p class="tkl-luck">'+luck+'</p>' : '')+stamp+'</div></div>';
  } else if (u.tk === 'sticker'){
    card = '<div class="i-tk tk-stk"><div class="tks-band">'+esc(caps(g.admit))+'</div><div class="tks-big">'+esc(tx(tk.big || L('')))+'</div>'+
      '<div class="tks-venue">'+esc(u.caps ? capsT(venue) : venue)+'</div><div class="tks-sub">'+esc(caps(tx(tk.sub)))+'</div>'+
      '<div class="tks-grid">'+cell(g.date, date1)+cell(g.time, tk.time)+flds.map(f => cell(f[0], esc(f[1]))).join('')+'</div>'+
      (chips ? '<div class="i-picks"><label>'+pickLbl+'</label>'+chips+'</div>' : '')+(luck ? '<p class="tks-luck">'+luck+'</p>' : '')+stamp+'</div>';
  } else {
    const fields = [[g.date, date2, true], [g.time, tk.time, true]].concat(flds.map(f => [f[0], esc(f[1]), false]));
    card = '<div class="i-tk"><div class="i-tk-top"><div class="i-brand">'+esc(venue)+'</div><div class="i-sub">'+esc(caps(tx(tk.sub)))+'</div><i class="i-n l"></i><i class="i-n r"></i></div>'+
      '<div class="i-tk-body"><div class="i-grid">'+fields.map(f => '<div class="i-f'+(f[2]?' big':'')+'"><label>'+esc(caps(f[0]))+'</label><div>'+f[1]+'</div></div>').join('')+'</div>'+
      (chips ? '<div class="i-picks"><label>'+pickLbl+'</label>'+chips+'</div>' : '')+
      (luck ? '<p class="i-luck">'+esc(tx(t.sp.title))+': '+luck+'</p>' : '')+stamp+'</div></div>';
  }
  let h = '<section class="i-step">'+dots(4)+'<h2 class="i-h2">'+esc(tx(tk.title)||g.tk)+'</h2>'+card;
  if (!s.stamped) h += '<div class="i-row"><button type="button" class="i-btn" data-act="stamp">'+esc(tx(tk.cta) || g.stamp)+'</button></div>';
  else h += '<div class="i-after"><div class="i-cd" data-cd="'+d.getTime()+'">'+['d','h','m','s'].map(k => '<div><b>0</b><span>'+esc(g[k])+'</span></div>').join('')+'</div>'+
    '<p class="i-sign">'+esc(tx(t.sign))+'<br><em>'+esc(tx(t.from))+'</em></p>'+
    '<div class="i-row"><button type="button" class="i-btn ghost" data-act="again">'+esc(g.again)+'</button></div></div>';
  return h + '</section>';
}
function coverHTML(t){
  return scrOpen(t)+'<div class="scr-in">'+vCover(t, true)+'</div>'+frameEl(t)+'</div>';
}

/* ---------- live invite instance ---------- */
const invites = [];
class Invite {
  constructor(el, id){
    this.el = el; this.timers = [];
    el.addEventListener('click', e => this.onClick(e));
    el.addEventListener('pointerover', e => { const b = e.target.closest('.i-no'); if (b && e.pointerType === 'mouse') this.flee(b); });
    el.addEventListener('touchstart', e => { const b = e.target.closest('.i-no'); if (b){ e.preventDefault(); this.flee(b); } }, {passive:false});
    invites.push(this);
    this.set(id);
  }
  set(id){ this.t = TBY[id]; this.reset(); }
  reset(){ this.clear(); this.s = {step:0, picks:[], fortune:-1, stamped:false, tries:0}; this.render(); }
  clear(){ this.timers.forEach(clearTimeout); this.timers = []; }
  later(fn, ms){ this.timers.push(setTimeout(fn, ms)); }
  render(){
    const t = this.t, s = this.s;
    const views = [() => vCover(t, false), () => vAsk(t), () => vPick(t, s), () => vSurprise(t, s), () => vTicket(t, s)];
    this.el.innerHTML = scrOpen(t)+'<div class="scr-in">'+views[s.step]()+'</div>'+frameEl(t)+'<div class="i-fx"></div></div>';
    this.inner = this.el.querySelector('.scr-in');
    if (s.step === 2) this.tray();
    tick();
  }
  go(n){ this.s.step = n; this.render(); if (this.inner) this.inner.scrollTop = 0; }
  onClick(e){
    const b = e.target.closest('[data-act]'); if (!b || !this.el.contains(b)) return;
    const a = b.dataset.act, s = this.s;
    if (a === 'open'){ if (b.classList.contains('open')) return; b.classList.add('open'); this.later(() => this.go(1), reduced() ? 50 : 1050); }
    else if (a === 'yes'){ this.burst(36); this.later(() => this.go(2), 380); }
    else if (a === 'no'){ this.flee(b); }
    else if (a === 'pick'){ this.pick(+b.dataset.i, b); }
    else if (a === 'next'){ if (s.step === 2 && !s.picks.length) return; this.go(s.step + 1); }
    else if (a === 'reveal'){ b.classList.add('shake'); this.later(() => { s.fortune = Math.floor(Math.random() * tx(this.t.sp.lines).length); this.render(); this.burst(18); }, 520); }
    else if (a === 'stamp'){ s.stamped = true; this.render(); this.later(() => this.burst(40), 380); }
    else if (a === 'again'){ this.reset(); }
  }
  flee(b){
    const lines = tx(this.t.noLines), s = this.s;
    s.tries++;
    const msg = this.el.querySelector('.i-msg'), yes = this.el.querySelector('.i-yes');
    if (msg) msg.textContent = lines[Math.min(s.tries - 1, lines.length - 1)];
    if (yes) yes.style.transform = 'scale(' + (1 + s.tries * .1) + ')';
    if (s.tries >= lines.length){ b.hidden = true; return; }
    const box = this.inner, r = b.getBoundingClientRect(), br = box.getBoundingClientRect();
    const w = r.width, h = r.height, W = box.clientWidth, H = box.clientHeight;
    b.classList.add('flee');
    b.style.left = Math.round(8 + Math.random() * Math.max(0, W - w - 16)) + 'px';
    b.style.top = Math.round(box.scrollTop + 60 + Math.random() * Math.max(0, H - h - 90)) + 'px';
    b.style.transform = 'rotate(' + (Math.random() * 26 - 13) + 'deg) scale(' + Math.max(.6, 1 - s.tries * .1) + ')';
    void br;
  }
  pick(i, b){
    const s = this.s, at = s.picks.indexOf(i);
    if (at > -1) s.picks.splice(at, 1);
    else if (s.picks.length < this.t.max) s.picks.push(i);
    else {
      b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
      const c = this.el.querySelector('.i-count'); if (c) c.textContent = fill(G[lang].max, {m:this.t.max});
      return;
    }
    b.classList.toggle('sel', s.picks.includes(i)); b.setAttribute('aria-pressed', s.picks.includes(i));
    this.tray();
  }
  tray(){
    const s = this.s, t = this.t;
    let h = '';
    for (let k = 0; k < t.max; k++){ const x = t.items[s.picks[k]]; h += x ? '<div class="i-slot f"'+fcol(x.col)+'>'+ic(x.ic)+'</div>' : '<div class="i-slot"></div>'; }
    const tr = this.el.querySelector('.i-tray'); if (tr) tr.innerHTML = h;
    const c = this.el.querySelector('.i-count'); if (c) c.textContent = fill(G[lang].count, {n:s.picks.length, m:t.max});
    const n = this.el.querySelector('[data-act="next"]'); if (n) n.disabled = !s.picks.length;
  }
  burst(n){
    if (reduced()) return;
    const fx = this.el.querySelector('.i-fx'); if (!fx) return;
    const t = this.t, cols = t.fxc || [t.c.acc, t.c.acc2, t.c.paper];
    for (let i = 0; i < n; i++){
      const p = document.createElement('span');
      p.className = t.fx || 'rect';
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = cols[i % cols.length];
      p.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      p.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      p.style.animationDelay = (Math.random() * .5) + 's';
      fx.appendChild(p);
      setTimeout(() => p.remove(), 3600);
    }
  }
}

/* countdowns: one ticker for every open ticket */
function tick(){
  $$('[data-cd]').forEach(el => {
    const left = Math.max(0, +el.dataset.cd - Date.now());
    if (!left){ el.innerHTML = '<p class="i-sign"><em>'+esc(G[lang].now)+'</em></p>'; el.removeAttribute('data-cd'); return; }
    const sec = Math.floor(left / 1000), v = [Math.floor(sec / 86400), Math.floor(sec % 86400 / 3600), Math.floor(sec % 3600 / 60), sec % 60];
    el.querySelectorAll('b').forEach((b, i) => { b.textContent = v[i]; });
  });
}
setInterval(tick, 1000);

/* ================= seven more ways to play =================
   Each demo below has its own mechanic and its own look. Only the Omakase invitation still runs on the invite engine above. */
Object.assign(I, {
  hands:'<path d="M7 11.5V6.5a1.5 1.5 0 0 1 3 0v4.5M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 11V8.5a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-.6a6.4 6.4 0 0 1-5.5-3.1L3.7 13.6a1.5 1.5 0 0 1 2.6-1.5L7 13"/>',
  thermo:'<path d="M10 4.5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0z"/><path d="M12 9v7.5"/><circle class="f" cx="12" cy="17.6" r="1.8"/>',
  spoon:'<ellipse class="f" cx="12" cy="7" rx="3.6" ry="4.6"/><path d="M12 11.6V21"/>',
  knife:'<rect class="f" x="2.5" y="12.5" width="13" height="8.5" rx="2"/><path d="M11 10.5 20.5 3c1 1.6.4 4-1.4 5.4L14 12.5"/>',
  tag:'<path class="f" d="M3.5 12V4.5a1 1 0 0 1 1-1H12l8.5 8.5-8 8z"/><circle cx="8" cy="8" r="1.5"/>',
  send2:'<path d="M4 12 20 4l-4 16-4-6z"/><path d="M12 14l8-10"/>'
});

/* small shared helpers */
const DG = {ka:{again:'თავიდან', start:'დაწყება'}, en:{again:'Start over', start:'Start'}};
const dg = () => DG[lang];
const secs = n => Math.max(0, Math.ceil(n)) + (lang === 'ka' ? ' წმ' : ' s');
const shuffle = a => { for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* an illustrated face for team members and badges */
function face(p, cls){
  const h = p.hair, sk = p.skin;
  const back = p.style === 0 ? '<path d="M17 36c0-15 7-23 15-23s15 8 15 23v16H17z" fill="'+h+'"/>' : p.style === 2 ? '<circle cx="32" cy="13" r="6" fill="'+h+'"/>' : '';
  const front = ['<path d="M21 30c0-9 5-15 11-15s11 6 11 15c-3-5-7-7-11-7s-8 2-11 7z" fill="'+h+'"/>',
    '<path d="M21 28c0-8 5-12 11-12s11 4 11 12c-2-2-6-4-11-4s-9 2-11 4z" fill="'+h+'"/>',
    '<path d="M21 30c0-9 5-14 11-14s11 5 11 14c-3-4-7-6-11-6s-8 2-11 6z" fill="'+h+'"/>',
    '<g fill="'+h+'"><circle cx="23" cy="24" r="4.5"/><circle cx="28" cy="19" r="5"/><circle cx="35" cy="18.5" r="5"/><circle cx="41" cy="23" r="4.5"/></g>'][p.style];
  return '<svg class="ava'+(cls ? ' '+cls : '')+'" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="32" fill="'+p.bg+'"/>'+back+
    '<path d="M13 64c2-11 9-15 19-15s17 4 19 15z" fill="'+(p.shirt || '#14213D')+'"/><rect x="28" y="40" width="8" height="10" fill="'+sk+'"/>'+
    '<ellipse cx="32" cy="32" rx="11" ry="12.5" fill="'+sk+'"/>'+front+
    '<circle cx="28" cy="33" r="1.3" fill="#1b1b1b"/><circle cx="36" cy="33" r="1.3" fill="#1b1b1b"/><path d="M29 39c2 1.5 4 1.5 6 0" stroke="#1b1b1b" stroke-width="1.2" fill="none" stroke-linecap="round"/>'+
    (p.glasses ? '<g fill="none" stroke="#1b1b1b" stroke-width="1.3"><circle cx="28" cy="33" r="3.6"/><circle cx="36" cy="33" r="3.6"/><path d="M31.6 33h.8"/></g>' : '')+
    (p.beard ? '<path d="M21.5 34c1 8 5 11 10.5 11s9.5-3 10.5-11c-2 3-5 4-10.5 4s-8.5-1-10.5-4z" fill="'+h+'"/>' : '')+'</svg>';
}

/* the base every new demo shares: timers, painting, keyboard for drawn controls */
class Demo {
  constructor(el, id){
    this.el = el; this.timers = []; this.iv = 0;
    el.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b && this.el.contains(b)) this.act(b.dataset.act, b, e); });
    el.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('g[data-act]')){ e.preventDefault(); this.act(e.target.dataset.act, e.target, e); }
    });
    if (this.bind) this.bind();
    invites.push(this);
    this.set(id);
  }
  set(id){ this.t = TBY[id]; this.reset(); }
  reset(){ this.clear(); this.s = this.init(); this.render(); }
  clear(){ this.timers.forEach(clearTimeout); this.timers = []; if (this.iv){ clearInterval(this.iv); this.iv = 0; } }
  later(fn, ms){ this.timers.push(setTimeout(fn, ms)); }
  paint(inner){ this.el.innerHTML = '<div class="dm dm-'+this.t.mech+'">'+inner+'<div class="i-fx"></div></div>'; }
  q(s){ return this.el.querySelector(s); }
  svgPt(e, svg, w, h){ const r = svg.getBoundingClientRect(); return {x:(e.clientX - r.left) / r.width * w, y:(e.clientY - r.top) / r.height * h}; }
}
Demo.prototype.burst = Invite.prototype.burst;

/* ---------- 1 · swipe: safe or not? ---------- */
const SW = {
  ka:{yes:'უსაფრთხოა', no:'არ არის', right:'სწორია.', wrong:'არა.', hint:'გადაწიე ბარათი: მარჯვნივ, თუ უსაფრთხოა, მარცხნივ, თუ არა.', pass:'სამზარეულოსთვის მზად', fail:'კიდევ ერთი ცდა', used:'წამი', streak:'საუკეთესო სერია', review:'გაიმეორე:', clean:'ერთი შეცდომაც არ დაგიშვია.'},
  en:{yes:'Safe', no:'Not safe', right:'Right.', wrong:'Not quite.', hint:'Swipe the card: right if it’s safe, left if it isn’t.', pass:'Kitchen ready', fail:'One more try', used:'seconds', streak:'best streak', review:'Worth another look:', clean:'Not a single mistake.'}
};
class Swipe extends Demo {
  init(){ return {i:0, score:0, streak:0, best:0, left:this.t.time, run:false, done:false, busy:false, last:null, wrong:[]}; }
  bind(){
    let d = null;
    this.el.addEventListener('pointerdown', e => {
      const c = e.target.closest('.sw-card.top'); if (!c || this.s.done || this.s.busy) return;
      d = {c, x:e.clientX, dx:0, id:e.pointerId}; try { c.setPointerCapture(e.pointerId); } catch (err) {} c.classList.add('drag');
    });
    this.el.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.id) return;
      d.dx = e.clientX - d.x;
      d.c.style.transform = 'translateX('+d.dx+'px) rotate('+(d.dx / 14)+'deg)';
      d.c.style.setProperty('--yes', Math.max(0, Math.min(1, d.dx / 80)));
      d.c.style.setProperty('--no', Math.max(0, Math.min(1, -d.dx / 80)));
    });
    const end = e => {
      if (!d || e.pointerId !== d.id) return;
      const x = d; d = null; x.c.classList.remove('drag');
      if (Math.abs(x.dx) > 70) this.answer(x.dx > 0);
      else { x.c.style.transform = ''; x.c.style.setProperty('--yes', 0); x.c.style.setProperty('--no', 0); }
    };
    this.el.addEventListener('pointerup', end); this.el.addEventListener('pointercancel', end);
  }
  act(a){ if (a === 'yes') this.answer(true); else if (a === 'no') this.answer(false); else if (a === 'again') this.reset(); }
  go(){
    const s = this.s; if (s.run) return; s.run = true; const end = Date.now() + s.left * 1000;
    this.iv = setInterval(() => { s.left = Math.max(0, (end - Date.now()) / 1000); this.hud(); if (!s.left) this.finish(); }, 200);
  }
  hud(){ const b = this.q('.sw-time i'), n = this.q('.sw-sec'); if (b) b.style.width = (this.s.left / this.t.time * 100) + '%'; if (n) n.textContent = secs(this.s.left); }
  answer(safe){
    const s = this.s, t = this.t; if (s.done || s.busy) return;
    this.go();
    const ok = t.cards[s.i].ok === safe;
    if (ok){ s.score++; s.streak++; s.best = Math.max(s.best, s.streak); } else { s.streak = 0; s.wrong.push(s.i); }
    s.last = {ok, i:s.i}; s.busy = true;
    const el = this.q('.sw-card.top'); if (el){ el.style.transform = ''; el.classList.add(safe ? 'out-r' : 'out-l'); }
    this.later(() => { s.busy = false; s.i++; if (s.i >= t.cards.length) this.finish(); else this.render(); }, reduced() ? 0 : 280);
  }
  finish(){
    const s = this.s; if (s.done) return; s.done = true; this.clear(); this.render();
    if (s.score >= this.t.cards.length - 1) this.later(() => this.burst(40), 120);
  }
  render(){
    const t = this.t, s = this.s, g = SW[lang];
    if (s.done) return this.paint(this.result());
    const cards = t.cards.slice(s.i, s.i + 3).map((c, k) => '<div class="sw-card'+(k === 0 ? ' top' : '')+'" style="--k:'+k+'">'+
      '<span class="sw-stamp yes">'+esc(g.yes)+'</span><span class="sw-stamp no">'+esc(g.no)+'</span>'+
      '<span class="sw-ic">'+ic(c.ic)+'</span><p>'+esc(tx(c.s))+'</p><span class="sw-n">'+(s.i + k + 1)+' / '+t.cards.length+'</span></div>').reverse().join('');
    const last = s.last ? t.cards[s.last.i] : null;
    this.paint('<div class="dm-in sw-in"><div class="sw-top"><b>'+esc(tx(t.brand))+'</b><span class="sw-sc">'+ic('check')+s.score+(s.streak > 1 ? ' <em>×'+s.streak+'</em>' : '')+'</span></div>'+
      '<div class="sw-time"><i style="width:'+(s.left / t.time * 100)+'%"></i></div><span class="sw-sec">'+secs(s.left)+'</span>'+
      '<h2 class="sw-h">'+esc(tx(t.name))+'</h2><div class="sw-stack">'+cards+'</div>'+
      '<div class="sw-fb'+(last ? (s.last.ok ? ' ok' : ' bad') : '')+'" aria-live="polite">'+(last ? '<b>'+esc(s.last.ok ? g.right : g.wrong)+'</b> '+esc(tx(last.why)) : esc(g.hint))+'</div>'+
      '<div class="sw-btns"><button type="button" class="sw-b no" data-act="no" aria-label="'+esc(g.no)+'">'+ic('close')+'</button>'+
      '<button type="button" class="sw-b yes" data-act="yes" aria-label="'+esc(g.yes)+'">'+ic('check')+'</button></div></div>');
  }
  result(){
    const t = this.t, s = this.s, g = SW[lang], n = t.cards.length, pass = s.score >= n - 1;
    return '<div class="dm-in sw-in sw-res"><div class="sw-badge'+(pass ? ' pass' : '')+'"><b>'+s.score+'<small>/'+n+'</small></b><span>'+esc(pass ? g.pass : g.fail)+'</span></div>'+
      '<div class="sw-stats"><div><b>'+Math.round(t.time - s.left)+'</b><span>'+esc(g.used)+'</span></div><div><b>×'+s.best+'</b><span>'+esc(g.streak)+'</span></div></div>'+
      (s.wrong.length ? '<p class="sw-lbl">'+esc(g.review)+'</p><ul class="sw-rev">'+s.wrong.map(i => '<li><b>'+esc(tx(t.cards[i].s))+'</b><span>'+esc(tx(t.cards[i].why))+'</span></li>').join('')+'</ul>'
        : '<p class="sw-lbl">'+esc(g.clean)+'</p>')+
      '<button type="button" class="sw-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 2 · spot the mistakes: hotel room 214 ---------- */
const SP = {
  ka:{q:'იპოვე {n} შეცდომა.', hint0:'შეეხე ყველაფერს, რაც სტუმრის მოსვლამდე უნდა გასწორდეს. არასწორი შეხება 3 წამი ჯდება.', hintB:'მინიშნება (−10 წმ)', scene:'სასტუმროს ოთახი, შეეხე შეცდომებს', done:'ოთახი 214 მზადაა', late:'დრო ამოიწურა', left:'დარჩა {n} წამი'},
  en:{q:'Find {n} mistakes.', hint0:'Tap anything that must be fixed before the guest arrives. A wrong tap costs 3 seconds.', hintB:'Hint (−10 s)', scene:'A hotel room. Tap the mistakes.', done:'Room 214 is ready', late:'Time’s up', left:'{n} seconds to spare'}
};
/* where each mistake sits in the drawing (viewBox 300 × 330) */
const SPOTS = {frame:{x:75, y:62, r:30}, cup:{x:50, y:168, r:12}, towel:{x:165, y:278, r:22}, bin:{x:263, y:256, r:20}, slipper:{x:93, y:300, r:15}};
const ROOM = '<rect width="300" height="214" fill="#DCCFEA"/><rect y="214" width="300" height="116" fill="#C8996A"/>'+
  '<g stroke="#B3855A" stroke-width="1"><path d="M0 240H300M0 268H300M0 298H300"/><path d="M60 214V240M180 214V240M120 240V268M240 240V268M40 268V298M200 268V298M100 298V330M260 298V330"/></g>'+
  '<rect y="208" width="300" height="7" fill="#F4EFE8"/>'+
  '<rect x="196" y="30" width="80" height="92" fill="#F4EFE8"/><rect x="202" y="36" width="68" height="80" fill="#BFE0F2"/><path d="M202 100l18-16 14 10 16-18 20 20V116H202z" fill="#9CC8A9"/><path d="M236 36V116M202 76H270" stroke="#F4EFE8" stroke-width="4"/>'+
  '<rect x="184" y="20" width="104" height="5" rx="2" fill="#6F5590"/><path d="M188 24h14v104c-6 0-10-2-14-4z" fill="#A98BC9"/><path d="M284 24h-14v104c6 0 10-2 14-4z" fill="#A98BC9"/>'+
  '<circle cx="75" cy="34" r="2" fill="#6F5590"/><path d="M75 34 52 43M75 34l27 9" stroke="#6F5590" stroke-width="1"/>'+
  '<g transform="rotate(9 75 62)"><rect x="45" y="40" width="60" height="44" fill="#F4EFE8" stroke="#6F5590" stroke-width="3"/><path d="M50 79l16-18 10 10 10-8 14 16z" fill="#7FB0C9"/><circle cx="88" cy="52" r="5" fill="#F2C14E"/></g>'+
  '<rect x="76" y="118" width="160" height="56" rx="8" fill="#6F5590"/>'+
  '<rect x="90" y="140" width="62" height="24" rx="11" fill="#FFFFFF"/><rect x="160" y="140" width="62" height="24" rx="11" fill="#FFFFFF"/>'+
  '<rect x="66" y="160" width="180" height="58" rx="8" fill="#FFFFFF"/><path d="M66 182h180v34a8 8 0 0 1-8 8H74a8 8 0 0 1-8-8z" fill="#B9A3D9"/><rect x="66" y="180" width="180" height="6" fill="#F4EFE8"/>'+
  '<rect x="74" y="224" width="6" height="10" fill="#5A4476"/><rect x="232" y="224" width="6" height="10" fill="#5A4476"/>'+
  '<path d="M262 178h22l-3 32h-16z" fill="#D9744A"/><path d="M273 178c-10-10-8-24 0-30 8 6 10 20 0 30zM273 178c-14-2-22-12-20-20 10 0 18 8 20 20zM273 178c4-14 14-18 20-16 0 10-8 16-20 16z" fill="#5E9E6A"/>'+
  '<rect x="12" y="176" width="50" height="50" rx="3" fill="#B07D4F"/><rect x="16" y="196" width="42" height="2" fill="#8E6038"/><circle cx="37" cy="211" r="2" fill="#5A3A22"/>'+
  '<path d="M14 140h22l4 22H10z" fill="#F2E3C2"/><rect x="22" y="162" width="6" height="12" fill="#8E6038"/><rect x="16" y="172" width="18" height="4" rx="2" fill="#8E6038"/>'+
  '<path d="M44 162h12l-1.5 12h-9z" fill="#FFFFFF" stroke="#6F5590" stroke-width="1.2"/><path d="M56 165a3 3 0 0 1 0 6" fill="none" stroke="#6F5590" stroke-width="1.2"/><path d="M47 164.5h6" stroke="#8A5A3A" stroke-width="2"/>'+
  '<ellipse cx="156" cy="262" rx="90" ry="22" fill="#E7D9C6"/>'+
  '<path d="M146 272c8-8 24-10 34-4 8 5 4 14-6 16-10 3-26 2-30-4-2-3-1-6 2-8z" fill="#FFFFFF" stroke="#D6CCE3" stroke-width="1.5"/><path d="M156 276c6-3 14-3 18 0" stroke="#D6CCE3" fill="none"/>'+
  '<path d="M250 246h26l-3 32h-20z" fill="#8E8A9C"/><rect x="248" y="243" width="30" height="5" rx="2" fill="#6E6A7D"/><circle cx="258" cy="241" r="5" fill="#FFFFFF"/><circle cx="268" cy="239" r="6" fill="#F7F3EE"/><circle cx="263" cy="234" r="4" fill="#FFFFFF"/>'+
  '<path d="M80 300c0-6 6-10 14-10s12 4 12 8-4 8-12 8H86c-4 0-6-2-6-6z" fill="#FFFFFF" stroke="#C9B9E0" stroke-width="1.5"/><path d="M84 300c4-5 14-6 18-2" fill="none" stroke="#A98BC9" stroke-width="3"/>';
class Spot extends Demo {
  init(){ return {found:[], left:this.t.time, run:false, done:false, last:-1, hint:-1, end:0}; }
  act(a, b, e){
    const s = this.s, t = this.t;
    if (a === 'again') return this.reset();
    if (s.done) return;
    if (a === 'spot'){
      const i = +b.dataset.i; this.go();
      if (s.found.includes(i)) return;
      s.found.push(i); s.last = i; if (s.hint === i) s.hint = -1;
      this.render(); this.burst(10);
      if (s.found.length === t.spots.length) this.later(() => this.finish(), 700);
    } else if (a === 'miss'){
      this.go(); this.penalty(3);
      const svg = this.q('.sp-scene svg'); if (!svg || !e || e.clientX == null) return;
      const p = this.svgPt(e, svg, 300, 330);
      svg.insertAdjacentHTML('beforeend', '<g class="sp-x" transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')"><path d="M-6-6 6 6M6-6-6 6"/><text y="-11">'+esc(SP[lang].hintB.match(/−\d+/) ? '−3' : '−3')+'</text></g>');
      const x = svg.lastElementChild; setTimeout(() => x && x.remove(), 900);
    } else if (a === 'hint'){
      const i = t.spots.findIndex((sp, k) => !s.found.includes(k)); if (i < 0) return;
      this.go(); this.penalty(10); s.hint = i; this.render();
    }
  }
  penalty(n){ const s = this.s; if (s.run){ s.end -= n * 1000; s.left = Math.max(0, (s.end - Date.now()) / 1000); } else s.left = Math.max(0, s.left - n); this.hud(); }
  go(){
    const s = this.s; if (s.run) return; s.run = true; s.end = Date.now() + s.left * 1000;
    this.iv = setInterval(() => { s.left = Math.max(0, (s.end - Date.now()) / 1000); this.hud(); if (!s.left) this.finish(); }, 200);
  }
  hud(){ const r = this.q('.sp-ring .v'), n = this.q('.sp-sec'); if (r) r.style.strokeDashoffset = ((1 - this.s.left / this.t.time) * 100.5).toFixed(2); if (n) n.textContent = Math.ceil(this.s.left); }
  finish(){ const s = this.s; if (s.done) return; s.done = true; this.clear(); this.render(); if (s.found.length === this.t.spots.length) this.later(() => this.burst(40), 120); }
  render(){
    const t = this.t, s = this.s, g = SP[lang];
    if (s.done) return this.paint(this.result());
    const P = sp => SPOTS[sp.id];
    const marks = s.found.map((i, n) => { const p = P(t.spots[i]); return '<g class="sp-mark" transform="translate('+p.x+' '+p.y+')"><ellipse rx="'+(p.r + 5)+'" ry="'+(p.r + 1)+'" transform="rotate(-12)"/><text y="'+(-p.r - 7)+'">'+(n + 1)+'</text></g>'; }).join('');
    const hint = s.hint >= 0 ? '<circle class="sp-hint" cx="'+P(t.spots[s.hint]).x+'" cy="'+P(t.spots[s.hint]).y+'" r="'+(P(t.spots[s.hint]).r + 10)+'"/>' : '';
    const hits = t.spots.map((sp, i) => s.found.includes(i) ? '' : '<circle class="sp-hit" data-act="spot" data-i="'+i+'" cx="'+P(sp).x+'" cy="'+P(sp).y+'" r="'+(P(sp).r + 8)+'"/>').join('');
    const last = s.last >= 0 ? t.spots[s.last] : null;
    this.paint('<div class="dm-in sp-in"><div class="sp-top"><div><b>'+esc(tx(t.brand))+'</b><span>'+esc(tx(t.name))+'</span></div>'+
      '<div class="sp-ring"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16"/><circle class="v" cx="18" cy="18" r="16" pathLength="100.5" style="stroke-dashoffset:'+((1 - s.left / t.time) * 100.5).toFixed(2)+'"/></svg><span class="sp-sec">'+Math.ceil(s.left)+'</span></div></div>'+
      '<p class="sp-q">'+esc(fill(g.q, {n:t.spots.length}))+'<b>'+s.found.length+' / '+t.spots.length+'</b></p>'+
      '<div class="sp-scene"><svg viewBox="0 0 300 330" role="img" aria-label="'+esc(g.scene)+'"><g pointer-events="none">'+ROOM+'</g>'+
      '<rect class="sp-miss" data-act="miss" width="300" height="330"/>'+hits+'<g pointer-events="none">'+hint+marks+'</g></svg></div>'+
      '<div class="sp-fb" aria-live="polite">'+(last ? '<b>'+esc(tx(last.n))+'.</b> '+esc(tx(last.why)) : esc(g.hint0))+'</div>'+
      '<div class="sp-row"><button type="button" class="sp-hintb" data-act="hint">'+ic('bulb')+esc(g.hintB)+'</button></div></div>');
  }
  result(){
    const t = this.t, s = this.s, g = SP[lang], all = s.found.length === t.spots.length;
    const stars = all ? (s.left > 20 ? 3 : 2) : (s.found.length >= 3 ? 1 : 0);
    return '<div class="dm-in sp-in sp-res"><p class="sp-kick">'+esc(tx(t.brand))+'</p><h2>'+esc(all ? g.done : g.late)+'</h2>'+
      '<div class="sp-stars">'+[0, 1, 2].map(k => '<span'+(k < stars ? ' class="on"' : '')+'>'+ic('star')+'</span>').join('')+'</div>'+
      (all ? '<p class="sp-left">'+esc(fill(g.left, {n:Math.floor(s.left)}))+'</p>' : '')+
      '<ul class="sp-list">'+t.spots.map((sp, i) => { const f = s.found.includes(i); return '<li class="'+(f ? 'ok' : 'miss')+'"><span>'+ic(f ? 'check' : 'close')+'</span><div><b>'+esc(tx(sp.n))+'</b><small>'+esc(tx(sp.why))+'</small></div></li>'; }).join('')+'</ul>'+
      '<button type="button" class="sp-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 3 · build the order: Menu Academy ---------- */
const BD = {
  ka:{how:'გადაიტანე ინგრედიენტები ხალიჩაზე ან შეეხე მათ. ამოსაღებად შეეხე ხალიჩაზე.', drop:'ინგრედიენტები აქ', rm:'ამოღება:', clear:'გასუფთავება', serve:'მიტანა', okT:'სწორია. შემდეგი შეკვეთა.', miss:'აკლია:', extra:'ზედმეტია:', cert:'მენიუს აკადემია · დონე 1', first:'შეკვეთა პირველივე ცდით'},
  en:{how:'Drag ingredients onto the mat, or tap them. Tap one on the mat to take it off.', drop:'Ingredients go here', rm:'Remove:', clear:'Clear', serve:'Serve', okT:'Correct. Next order.', miss:'Missing:', extra:'Shouldn’t be there:', cert:'Menu Academy · Level 1', first:'orders right first time'}
};
class Build extends Demo {
  init(){ return {o:0, plate:[], tries:0, firstOk:0, fb:null, busy:false, done:false}; }
  bind(){
    let d = null;
    const overMat = e => { const m = this.q('.bd-mat'); if (!m) return false; const r = m.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; };
    this.el.addEventListener('pointerdown', e => {
      const b = e.target.closest('[data-ing]'); if (!b || this.s.done || this.s.busy) return;
      e.preventDefault(); d = {b, id:b.dataset.ing, x:e.clientX, y:e.clientY, moved:false, pid:e.pointerId, ghost:null};
      try { b.setPointerCapture(e.pointerId); } catch (err) {}
    });
    this.el.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.pid) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
      const root = this.q('.dm'), r = root.getBoundingClientRect();
      if (!d.ghost){ d.moved = true; d.ghost = document.createElement('div'); d.ghost.className = 'bd-ghost'; d.ghost.innerHTML = d.b.querySelector('.bd-bowl').outerHTML; root.appendChild(d.ghost); }
      d.ghost.style.left = (e.clientX - r.left) + 'px'; d.ghost.style.top = (e.clientY - r.top) + 'px';
      const m = this.q('.bd-mat'); if (m) m.classList.toggle('over', overMat(e));
    });
    const end = e => {
      if (!d || e.pointerId !== d.pid) return;
      const x = d; d = null; if (x.ghost) x.ghost.remove();
      const over = overMat(e), m = this.q('.bd-mat'); if (m) m.classList.remove('over');
      if (e.type !== 'pointercancel' && (!x.moved || over)) this.add(x.id);
    };
    this.el.addEventListener('pointerup', end); this.el.addEventListener('pointercancel', end);
  }
  add(id){ const s = this.s; if (s.done || s.busy || s.plate.includes(id)) return; s.plate.push(id); s.fb = null; this.render(); }
  act(a, b, e){
    const s = this.s, t = this.t;
    if (a === 'again') return this.reset();
    if (s.busy || s.done) return;
    if (a === 'ing'){ if (e && e.detail === 0) this.add(b.dataset.ing); return; }
    if (a === 'rm'){ s.plate = s.plate.filter(x => x !== b.dataset.id); s.fb = null; this.render(); return; }
    if (a === 'clear'){ s.plate = []; s.fb = null; this.render(); return; }
    if (a === 'serve'){
      const need = t.orders[s.o].need, miss = need.filter(x => !s.plate.includes(x)), extra = s.plate.filter(x => !need.includes(x));
      s.tries++;
      if (!miss.length && !extra.length){
        if (s.tries === 1) s.firstOk++;
        s.fb = {ok:true}; s.busy = true; this.render(); this.burst(16);
        this.later(() => { s.busy = false; s.o++; s.plate = []; s.tries = 0; s.fb = null; if (s.o >= t.orders.length){ s.done = true; this.render(); this.burst(40); } else this.render(); }, reduced() ? 300 : 1100);
      } else {
        s.fb = {ok:false, miss, extra}; this.render();
        const m = this.q('.bd-mat'); if (m){ m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }
      }
    }
  }
  render(){
    const t = this.t, s = this.s, g = BD[lang];
    if (s.done) return this.paint(this.result());
    const o = t.orders[s.o], ING = id => t.ings.find(x => x.id === id), nm = id => esc(tx(ING(id).n));
    const plate = s.plate.map(id => '<button type="button" class="bd-chip" data-act="rm" data-id="'+id+'" style="--c:'+ING(id).col+'" aria-label="'+esc(g.rm)+' '+nm(id)+'"><i></i>'+nm(id)+'</button>').join('');
    const fb = !s.fb ? '<div class="bd-fb">'+esc(g.how)+'</div>' : s.fb.ok ? '<div class="bd-fb ok"><span class="bd-hanko">OK</span>'+esc(g.okT)+'</div>' :
      '<div class="bd-fb bad" aria-live="polite">'+(s.fb.miss.length ? '<b>'+esc(g.miss)+'</b> '+s.fb.miss.map(nm).join(', ')+'<br>' : '')+(s.fb.extra.length ? '<b>'+esc(g.extra)+'</b> '+s.fb.extra.map(nm).join(', ') : '')+'</div>';
    const tray = t.ings.map(x => '<button type="button" class="bd-ing'+(s.plate.includes(x.id) ? ' used' : '')+'" data-act="ing" data-ing="'+x.id+'"><span class="bd-bowl" style="--c:'+x.col+'"></span><span>'+esc(tx(x.n))+'</span></button>').join('');
    this.paint('<div class="dm-in bd-in"><div class="bd-top"><b>'+esc(tx(t.brand))+'</b><span>'+esc(tx(t.name))+'</span></div>'+
      '<div class="bd-rail"><div class="bd-tk"><div class="bd-tk-h"><span>'+esc(tx(o.t))+'</span><span>'+(s.o + 1)+' / '+t.orders.length+'</span></div><b>'+esc(tx(o.d))+'</b>'+(o.note ? '<em>'+esc(tx(o.note))+'</em>' : '')+'</div></div>'+
      '<div class="bd-mat"><div class="bd-plate">'+(plate || '<span class="bd-empty">'+esc(g.drop)+'</span>')+'</div></div>'+fb+
      '<div class="bd-tray">'+tray+'</div><div class="bd-row"><button type="button" class="bd-clear" data-act="clear">'+esc(g.clear)+'</button>'+
      '<button type="button" class="bd-serve" data-act="serve"'+(s.plate.length ? '' : ' disabled')+'>'+esc(g.serve)+'</button></div></div>');
  }
  result(){
    const t = this.t, s = this.s, g = BD[lang];
    return '<div class="dm-in bd-in bd-res"><div class="bd-cert"><span class="bd-cert-k">'+esc(tx(t.brand))+'</span><b>'+esc(g.cert)+'</b><span class="bd-big">'+s.firstOk+'<small>/'+t.orders.length+'</small></span><span class="bd-sub">'+esc(g.first)+'</span><span class="bd-hanko big">合格</span></div>'+
      '<ul class="bd-rules">'+t.orders.map(o => '<li><b>'+esc(tx(o.d))+'</b>'+(o.note ? ' · '+esc(tx(o.note)) : '')+'<small>'+o.need.map(id => esc(tx(t.ings.find(x => x.id === id).n))).join(' + ')+'</small></li>').join('')+'</ul>'+
      '<button type="button" class="bd-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 4 · a buddy chat with a memory game inside ---------- */
const CH = {
  ka:{online:'ონლაინ', typing:'წერს', msg:'შეტყობინება', voiceT:'„ყველა ელოდება შენს გაცნობას. ორშაბათს ტორტი გვექნება.“', memH:'ვინ ვინაა?', memP:'გადააბრუნე ორი ბარათი: სახე და სახელი.', moves:'{n} სვლა', card:'ბარათი {n}',
      pass:'პირველი დღე', role:'Product Designer', day:'დაწყება', dayV:'ორშაბათი, 9:30', coffee:'ყავა ნინოსთან', desk:'მაგიდა', floor:'სართული', again:'ჩატის თავიდან დაწყება', play:'ხმოვანის მოსმენა'},
  en:{online:'online', typing:'typing', msg:'Message', voiceT:'“Everyone can’t wait to meet you. There’ll be cake on Monday.”', memH:'Who’s who?', memP:'Flip two cards: a face and a name.', moves:'{n} moves', card:'Card {n}',
      pass:'Day one', role:'Product Designer', day:'Starts', dayV:'Monday, 9:30', coffee:'Coffee with Nino', desk:'Desk', floor:'Floor', again:'Restart the chat', play:'Play the voice note'}
};
const MAPART = '<svg viewBox="0 0 200 84" aria-hidden="true"><rect width="200" height="84" fill="#E3EAF3"/><path d="M0 58H200M70 0V84M142 0V84M0 22 200 38" stroke="#FFFFFF" stroke-width="8"/>'+
  '<rect x="82" y="44" width="46" height="12" rx="3" fill="#CFE3D4"/><path d="M106 12a10 10 0 0 1 10 10c0 8-10 18-10 18s-10-10-10-18a10 10 0 0 1 10-10z" fill="#2F5BD3"/><circle cx="106" cy="22" r="3.5" fill="#fff"/></svg>';
const WAVE = [6,10,16,9,13,18,8,12,17,11,7,14,10,16,9,6,12,8].map((h, i) => '<i style="--h:'+h+'px;--d:'+(i * .05).toFixed(2)+'s"></i>').join('');
class Chat extends Demo {
  init(){ const sc = this.t.script; return {log:[{w:'b', k:'text', v:sc.hello[0]}, {w:'b', k:'text', v:sc.hello[1]}], ch:'nerv', typing:false, coffee:'', desk:'', mem:null, playing:false, heard:false}; }
  say(list, next){
    const s = this.s; s.ch = null; let k = 0;
    const step = () => {
      if (k >= list.length){ s.typing = false; s.ch = next; this.render(); return; }
      s.typing = true; this.render();
      this.later(() => { s.typing = false; s.log.push(list[k++]); this.render(); this.later(step, reduced() ? 0 : 320); }, reduced() ? 0 : 750);
    };
    this.later(step, 250);
  }
  newMem(){ const c = []; this.t.team.forEach((p, i) => { c.push({p:i, f:'face'}); c.push({p:i, f:'name'}); }); return {cards:shuffle(c), open:[], got:[], moves:0, lock:false, done:false}; }
  act(a, b){
    const s = this.s, sc = this.t.script;
    if (a === 'voice'){ if (s.playing) return; s.playing = true; this.render(); this.later(() => { s.playing = false; s.heard = true; this.render(); }, reduced() ? 0 : 2600); return; }
    if (a === 'flip') return this.flip(+b.dataset.c);
    if (a !== 'opt' || !s.ch) return;
    const i = +b.dataset.i, B = (v, k) => ({w:'b', k:k || 'text', v}), U = v => s.log.push({w:'u', k:'text', v});
    if (s.ch === 'nerv'){ U(sc.nerv[i][0]); this.say([B(sc.nerv[i][1]), B(sc.coffeeQ)], 'coffee'); }
    else if (s.ch === 'coffee'){ s.coffee = sc.coffeeA[i]; U(sc.coffeeA[i]); this.say([B(sc.coffeeR), B(null, 'loc'), B(sc.deskQ)], 'desk'); }
    else if (s.ch === 'desk'){ s.desk = sc.deskA[i][1]; U(sc.deskA[i][0]); this.say([B(sc.deskR), B(sc.team), B(null, 'team'), B(null, 'voice'), B(sc.gameQ)], 'game'); }
    else if (s.ch === 'game'){ U(sc.gameA); s.ch = null; this.later(() => { s.mem = this.newMem(); this.render(); }, reduced() ? 0 : 450); }
    else if (s.ch === 'end') return this.reset();
    this.render();
  }
  flip(c){
    const m = this.s.mem; if (!m || m.lock || m.done) return;
    const card = m.cards[c]; if (m.got.includes(card.p) || m.open.includes(c)) return;
    m.open.push(c);
    if (m.open.length < 2) return this.render();
    m.moves++;
    const [x, y] = m.open.map(i => m.cards[i]);
    if (x.p === y.p){
      m.got.push(x.p); m.open = []; this.render(); this.burst(8);
      if (m.got.length === this.t.team.length){
        m.done = true; const sc = this.t.script;
        this.later(() => { this.render(); this.burst(30); this.say([{w:'b', k:'text', v:sc.won}, {w:'b', k:'text', v:sc.bye}, {w:'b', k:'pass'}], 'end'); }, reduced() ? 0 : 700);
      }
      return;
    }
    m.lock = true; this.render();
    this.later(() => { m.open = []; m.lock = false; this.render(); }, 850);
  }
  render(){
    const t = this.t, s = this.s, g = CH[lang], sc = t.script;
    const vars = {to:tx(t.to), time:s.coffee || '10:00', desk:s.desk, moves:s.mem ? s.mem.moves : 0};
    const T = v => esc(fill(tx(v), vars));
    const msg = m => {
      if (m.k === 'text') return '<div class="ch-m '+m.w+'"><p>'+T(m.v)+'</p></div>';
      if (m.k === 'loc') return '<div class="ch-m b card"><div class="ch-map">'+MAPART+'</div><p><b>'+T(sc.loc.t)+'</b><small>'+T(sc.loc.d)+'</small></p></div>';
      if (m.k === 'team') return '<div class="ch-m b card"><div class="ch-team">'+t.team.map(p => '<span>'+face(p)+'<small>'+esc(tx(p.n))+'</small></span>').join('')+'</div></div>';
      if (m.k === 'voice') return '<div class="ch-m b"><button type="button" class="ch-voice'+(s.playing ? ' on' : '')+'" data-act="voice" aria-label="'+esc(g.play)+'">'+ic('play')+'<span class="wave">'+WAVE+'</span><small>0:04</small></button>'+(s.heard ? '<p class="ch-tr">'+esc(g.voiceT)+'</p>' : '')+'</div>';
      return '<div class="ch-pass"><div class="ch-pass-band"><span>'+esc(tx(t.co))+'</span><span>'+esc(g.pass)+'</span></div><div class="ch-pass-in">'+face(t.me)+
        '<div><b>'+esc(tx(t.to))+'</b><small>'+esc(g.role)+'</small></div><dl><div><dt>'+esc(g.day)+'</dt><dd>'+esc(g.dayV)+'</dd></div><div><dt>'+esc(g.coffee)+'</dt><dd>'+esc(vars.time)+'</dd></div>'+
        '<div><dt>'+esc(g.desk)+'</dt><dd>'+esc(s.desk)+'</dd></div><div><dt>'+esc(g.floor)+'</dt><dd>5</dd></div></dl></div></div>';
    };
    const opts = s.ch === 'nerv' ? sc.nerv.map(o => o[0]) : s.ch === 'coffee' ? sc.coffeeA : s.ch === 'desk' ? sc.deskA.map(o => o[0]) : s.ch === 'game' ? [sc.gameA] : s.ch === 'end' ? [g.again] : [];
    let mem = '';
    if (s.mem && !s.mem.done){
      const m = s.mem;
      mem = '<div class="ch-mem"><div class="ch-sheet" role="dialog" aria-label="'+esc(g.memH)+'"><h3>'+esc(g.memH)+'</h3><p>'+esc(g.memP)+'</p><div class="ch-grid">'+
        m.cards.map((cd, i) => { const p = t.team[cd.p], st = m.got.includes(cd.p) ? ' got' : (m.open.includes(i) ? ' open' : '');
          return '<button type="button" class="ch-card'+st+'" data-act="flip" data-c="'+i+'" aria-label="'+esc(fill(g.card, {n:i + 1}))+'"><span class="fc"><span class="bk"><i></i></span><span class="fr">'+
            (cd.f === 'face' ? face(p) : '<b>'+esc(tx(p.n))+'</b><small>'+esc(tx(p.r))+'</small>')+'</span></span></button>'; }).join('')+
        '</div><p class="ch-moves">'+esc(fill(g.moves, {n:m.moves}))+'</p></div></div>';
    }
    this.paint('<div class="ch-head">'+face(t.team[0])+'<div><b>'+esc(tx(t.team[0].n))+'</b><small>'+esc(s.typing ? g.typing+'…' : g.online)+'</small></div><span class="co">'+esc(tx(t.co))+'</span></div>'+
      '<div class="ch-body" aria-live="polite">'+s.log.map(msg).join('')+(s.typing ? '<div class="ch-typing" aria-label="'+esc(g.typing)+'"><i></i><i></i><i></i></div>' : '')+'</div>'+
      '<div class="ch-foot">'+(opts.length ? '<div class="ch-opts">'+opts.map((o, i) => '<button type="button" class="ch-opt" data-act="opt" data-i="'+i+'">'+esc(fill(tx(o), vars))+'</button>').join('')+'</div>' : '')+
      '<div class="ch-input"><span>'+esc(g.msg)+'</span>'+ic('send2')+'</div></div>'+mem);
    const body = this.q('.ch-body'); if (body) body.scrollTop = body.scrollHeight;
  }
}

/* ---------- 5 · the store map ---------- */
const MP = {
  ka:{prog:'{n} / {m}', tap:'შეეხე ნომრებს რუკაზე და გაიცანი მაღაზია.', got:'გასაგებია', alarm:'განგაში! შეეხე რუკაზე იქ, სადაც უნდა წახვიდე.', wrong:'არა იქ. გარეთ, პარკინგზე, ბოძთან A.', ready:'მზადაა',
      learned:'რა ისწავლე', till:'სალარო', from:'პირველი დღე', fromV:'ორშაბათი, 9:00', locker:'კარადა', code:'კარის კოდი', drill:'განგაშის დროს: პარკინგი, ბოძი A', plan:'მაღაზიის გეგმა', park:'პარკინგი'},
  en:{prog:'{n} of {m}', tap:'Tap the numbers on the map to get to know the store.', got:'Got it', alarm:'Alarm! Tap the map where you go.', wrong:'Not there. Outside, in the car park, at post A.', ready:'READY',
      learned:'What you learned', till:'Till', from:'First day', fromV:'Monday, 9:00', locker:'Locker', code:'Door code', drill:'If the alarm rings: car park, post A', plan:'Store floor plan', park:'CAR PARK'}
};
const PLAN = '<path class="wall" d="M14 14H266V100M266 118V264H240M200 264H14V170M14 150V14"/>'+
  '<path class="wall" d="M118 14V100H100M40 100H14M172 14V84H198M224 84H266M228 84V134H266"/>'+
  '<g class="thin">'+[44, 80, 116, 152].map(x => '<rect x="'+x+'" y="122" width="14" height="70"/>').join('')+'<rect x="190" y="160" width="56" height="14"/><rect x="190" y="184" width="56" height="14"/>'+
  '<rect x="34" y="220" width="40" height="24"/><rect x="84" y="220" width="40" height="24"/><rect x="134" y="220" width="40" height="24"/>'+
  '<path d="M220 300V272M214 278l6-6 6 6"/><path d="M14 286H266"/>'+[30, 62, 94, 190, 222, 254].map(x => '<path d="M'+x+' 292V322"/>').join('')+'</g>'+
  '<rect x="18" y="134" width="20" height="10" fill="#2BB673"/><text class="exit" x="28" y="141.5">EXIT</text>'+
  '<g class="mp-post"><circle cx="142" cy="306" r="9"/><text x="142" y="309.5">A</text></g>';
class MapHunt extends Demo {
  init(){ return {seen:[], open:-1, phase:'explore', wrong:null}; }
  act(a, b, e){
    const s = this.s, t = this.t;
    if (a === 'again') return this.reset();
    if (a === 'pin'){ s.open = +b.dataset.i; this.render(); const g = this.q('.mp-got'); if (g) g.focus({preventScroll:true}); }
    else if (a === 'got'){
      if (!s.seen.includes(s.open)) s.seen.push(s.open);
      s.open = -1;
      if (s.seen.length === t.rooms.length){ s.phase = 'alarm'; this.burst(10); }
      this.render();
    } else if (a === 'where'){
      const svg = this.q('.mp-plan svg'); if (!svg || !e || e.clientX == null) return;
      const p = this.svgPt(e, svg, 280, 330);
      if (Math.hypot(p.x - 142, p.y - 306) < 30){ s.phase = 'done'; this.render(); this.burst(40); }
      else { s.wrong = p; this.render(); }
    }
  }
  render(){
    const t = this.t, s = this.s, g = MP[lang], R = t.rooms;
    if (s.phase === 'done') return this.paint(this.result());
    const lab = (x, y, v) => '<text class="lab" x="'+x+'" y="'+y+'">'+esc(v)+'</text>';
    const pins = s.phase === 'explore' ? R.map((r, i) => { const seen = s.seen.includes(i);
      return '<g class="mp-pin'+(seen ? ' seen' : '')+'" data-act="pin" data-i="'+i+'" transform="translate('+r.px+' '+r.py+')" role="button" tabindex="0" aria-label="'+(i + 1)+'. '+esc(tx(r.n))+'"><circle r="9.5"/>'+
        (seen ? '<path d="M-4 0l3 3 5-6" fill="none" stroke="#1638B8" stroke-width="2.4"/>' : '<text y="3.6">'+(i + 1)+'</text>')+'</g>'; }).join('') :
      '<rect class="mp-where" data-act="where" width="280" height="330"/>'+(s.wrong ? '<g class="mp-wrong" transform="translate('+s.wrong.x.toFixed(1)+' '+s.wrong.y.toFixed(1)+')"><path d="M-6-6 6 6M6-6-6 6"/></g>' : '');
    const svg = '<svg viewBox="0 0 280 330" role="img" aria-label="'+esc(g.plan)+'">'+R.map((r, i) => '<rect class="mp-room'+(s.seen.includes(i) ? ' seen' : '')+'" x="'+r.r[0]+'" y="'+r.r[1]+'" width="'+r.r[2]+'" height="'+r.r[3]+'"/>').join('')+PLAN+
      lab(20, 26, tx(R[2].lab))+lab(178, 26, tx(R[1].lab))+lab(196, 150, tx(R[0].lab))+lab(34, 212, tx(R[3].lab))+lab(18, 186, tx(R[4].lab))+lab(196, 282, g.park)+pins+'</svg>';
    const room = s.open >= 0 ? R[s.open] : null;
    this.paint('<div class="dm-in mp-in"><div class="mp-top"><b>'+esc(tx(t.co))+'</b><span>'+esc(fill(g.prog, {n:s.seen.length, m:R.length}))+'</span></div>'+
      (s.phase === 'alarm' ? '<p class="mp-alarm" aria-live="assertive">'+esc(g.alarm)+'</p>' : '<p class="mp-q">'+esc(g.tap)+'</p>')+
      '<div class="mp-plan">'+svg+'</div><p class="mp-fb" aria-live="polite">'+(s.wrong ? esc(g.wrong) : '')+'</p></div>'+
      (room ? '<div class="mp-sheet" role="dialog" aria-label="'+esc(tx(room.n))+'"><span class="no">'+(s.open + 1)+' / '+R.length+'</span><h3>'+esc(tx(room.n))+'</h3><p>'+esc(tx(room.txt))+'</p><button type="button" class="mp-got" data-act="got">'+esc(g.got)+'</button></div>' : ''));
  }
  result(){
    const t = this.t, g = MP[lang];
    return '<div class="dm-in mp-in mp-res"><div class="mp-badge"><div class="band">'+esc(tx(t.co))+'</div>'+face(t.me)+'<b>'+esc(tx(t.to))+'</b><small>'+esc(tx(t.role))+'</small><span class="mp-stamp">'+esc(g.ready)+'</span>'+
      '<dl><div><dt>'+esc(g.till)+'</dt><dd>№ 3</dd></div><div><dt>'+esc(g.from)+'</dt><dd>'+esc(g.fromV)+'</dd></div><div><dt>'+esc(g.locker)+'</dt><dd>№ 14</dd></div><div><dt>'+esc(g.code)+'</dt><dd>2207</dd></div></dl><div class="mp-bar"></div></div>'+
      '<p class="mp-lbl">'+esc(g.learned)+'</p><ul class="mp-learn">'+t.rooms.map(r => '<li>'+ic('check')+esc(tx(r.n))+'</li>').join('')+'<li>'+ic('check')+esc(g.drill)+'</li></ul>'+
      '<button type="button" class="mp-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 6 · scratch, stamp, coupon ---------- */
const SC = {
  ka:{title:'გაფხეკე და მოიგე', scratch:'გაფხეკე', how:'გაფხეკე ვერცხლისფერი ფენა თითით.', reveal:'ყველაფრის ჩვენება', won:'მოიგე!', add:'ჩემს ბარათზე დამატება', card:'შენი ბეჭდების ბარათი', left:'უფასო ყავამდე დარჩა {n}', free:'მეათე ყავა საჩუქარია.', coupon:'კუპონის აღება', cpn:'კუპონი', show:'აჩვენე სალაროსთან.', valid:'მოქმედებს {d}-მდე'},
  en:{title:'Scratch and win', scratch:'SCRATCH', how:'Scratch off the silver with your finger.', reveal:'Reveal it all', won:'You won!', add:'Add to my card', card:'Your stamp card', left:'{n} more to a free coffee', free:'The tenth coffee is on us.', coupon:'Get my coupon', cpn:'COUPON', show:'Show this at the till.', valid:'Valid until {d}'}
};
class Scratch extends Demo {
  init(){ return {step:'card', p:Math.floor(Math.random() * this.t.prizes.length), revealed:false, shown:this.t.have, code:'TSK-'+Math.floor(1000 + Math.random() * 8999)}; }
  bind(){
    this.el.addEventListener('pointerdown', e => {
      const cv = e.target.closest('.sc-foil'); if (!cv || this.s.revealed) return;
      e.preventDefault(); if (!this.cv || this.cv.el !== cv || cv.width < 4) this.setup(cv); if (!this.cv) return;
      this.sp = {id:e.pointerId, last:null}; try { cv.setPointerCapture(e.pointerId); } catch (err) {} this.rub(e);
    });
    this.el.addEventListener('pointermove', e => { if (this.sp && e.pointerId === this.sp.id) this.rub(e); });
    const end = e => { if (this.sp && e.pointerId === this.sp.id){ this.sp = null; this.measure(); } };
    this.el.addEventListener('pointerup', end); this.el.addEventListener('pointercancel', end);
  }
  setup(cv){
    const r = cv.getBoundingClientRect(); if (r.width < 4){ this.cv = null; return; }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const c = cv.getContext('2d'), W = cv.width, H = cv.height;
    const gr = c.createLinearGradient(0, 0, W, H);
    gr.addColorStop(0, '#A9ACB5'); gr.addColorStop(.45, '#E4E6EA'); gr.addColorStop(.55, '#CDD0D6'); gr.addColorStop(1, '#9EA1AA');
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 2 * dpr;
    for (let x = -H; x < W; x += 9 * dpr){ c.beginPath(); c.moveTo(x, H); c.lineTo(x + H, 0); c.stroke(); }
    c.fillStyle = '#5E616B'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '800 '+Math.round(H * .16)+'px "Google Sans","Noto Sans Georgian",sans-serif';
    c.fillText(SC[lang].scratch, W / 2, H / 2);
    c.globalCompositeOperation = 'destination-out'; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 30 * dpr;
    this.cv = {el:cv, c, dpr, n:0};
  }
  rub(e){
    const k = this.cv; if (!k) return;
    const r = k.el.getBoundingClientRect(), x = (e.clientX - r.left) * k.dpr, y = (e.clientY - r.top) * k.dpr, c = k.c;
    c.beginPath();
    if (this.sp.last){ c.moveTo(this.sp.last.x, this.sp.last.y); c.lineTo(x, y); c.stroke(); }
    else { c.arc(x, y, 15 * k.dpr, 0, Math.PI * 2); c.fill(); }
    this.sp.last = {x, y};
    if (++k.n % 8 === 0) this.measure();
  }
  measure(){
    const k = this.cv; if (!k || this.s.revealed) return;
    const d = k.c.getImageData(0, 0, k.el.width, k.el.height).data; let clear = 0, n = 0;
    for (let i = 3; i < d.length; i += 96){ n++; if (d[i] < 100) clear++; }
    if (n && clear / n > .5) this.reveal();
  }
  reveal(){ const s = this.s; if (s.revealed) return; s.revealed = true; this.cv = null; this.sp = null; this.render(); this.burst(36); }
  act(a){
    const s = this.s, t = this.t;
    if (a === 'reveal') return this.reveal();
    if (a === 'again') return this.reset();
    if (a === 'stamps'){
      s.step = 'stamps'; s.shown = t.have; this.render();
      const total = t.have + t.prizes[s.p].stamps;
      const add = () => { if (s.step !== 'stamps' || s.shown >= total) return; s.shown++; this.render(); if (s.shown < total) this.later(add, 450); else this.burst(14); };
      this.later(add, reduced() ? 0 : 500);
    } else if (a === 'coupon'){ s.step = 'coupon'; this.render(); this.burst(30); }
  }
  render(){
    const t = this.t, s = this.s, g = SC[lang], p = t.prizes[s.p];
    let body = '';
    if (s.step === 'card'){
      body = '<h2 class="sc-h">'+esc(g.title)+'</h2><div class="sc-ticket"><div class="sc-box"><span class="big">'+esc(tx(p.big))+'</span><b>'+esc(tx(p.n))+'</b><small>'+esc(tx(p.d))+'</small>'+
        (s.revealed ? '' : '<canvas class="sc-foil" aria-hidden="true"></canvas>')+'</div>'+
        '<div class="sc-how">'+(s.revealed ? '<b>'+esc(g.won)+'</b>' : '<span>'+esc(g.how)+'</span><button type="button" class="sc-link" data-act="reveal">'+esc(g.reveal)+'</button>')+'</div></div>'+
        (s.revealed ? '<button type="button" class="sc-btn" data-act="stamps">'+esc(g.add)+'</button>' : '');
    } else if (s.step === 'stamps'){
      const total = t.have + p.stamps;
      body = '<div class="sc-card"><h3>'+esc(g.card)+'</h3><div class="sc-slots">'+Array.from({length:t.of}, (_, i) => {
          const on = i < s.shown, nw = on && i >= t.have && i === s.shown - 1, gift = i === t.of - 1;
          return '<span class="sc-slot'+(on ? ' on' : '')+(nw ? ' new' : '')+(gift && !on ? ' gift' : '')+'">'+(on ? ic('coffee') : (gift ? ic('gift') : ''))+'</span>'; }).join('')+'</div>'+
        '<p class="sc-left">'+esc(fill(g.left, {n:t.of - total}))+'</p><p class="sc-free">'+esc(g.free)+'</p></div>'+
        '<button type="button" class="sc-btn" data-act="coupon"'+(s.shown < total ? ' disabled' : '')+'>'+esc(g.coupon)+'</button>';
    } else {
      const d = new Date(); d.setDate(d.getDate() + 7);
      body = '<div class="sc-cp"><div class="sc-brand"><b>'+esc(tx(t.brand))+'</b><span>'+esc(g.cpn)+'</span></div><span class="big">'+esc(tx(p.big))+'</span><b>'+esc(tx(p.n))+'</b>'+
        '<p class="sc-valid">'+esc(fill(g.valid, {d:d.getDate()+' '+S[lang].months[d.getMonth()]}))+'</p><hr><div class="sc-bar"></div><p class="sc-code">'+esc(s.code)+'</p><p class="sc-valid">'+esc(g.show)+'</p></div>'+
        '<button type="button" class="sc-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button>';
    }
    this.paint('<div class="dm-in sc-in"><div class="sc-check" aria-hidden="true"></div><div class="sc-brand"><b>'+esc(tx(t.brand))+'</b><span>'+esc(tx(t.kind2))+'</span></div>'+body+'</div>');
    if (s.step === 'card' && !s.revealed) requestAnimationFrame(() => { const cv = this.q('.sc-foil'); if (cv) this.setup(cv); });
  }
}

/* ---------- 7 · pick your seat ---------- */
const ST = {
  ka:{dear:'ძვირფასო {to},', when:'პარასკევი, 19:30', where:'შუშის დარბაზი, ვაკე', dress:'დრესკოდი: საღამოს, თავისუფალი', yes:'მოვდივარ', no:'ვერ მოვალ', noMsg:'მოგვენატრები. ოთხშაბათამდე შეგიძლია გადაიფიქრო.',
      seatH:'აირჩიე შენი ადგილი', seatHint:'გადაიტანე შენი ბარათი თავისუფალ ადგილზე ან შეეხე მას.', next:'შემდეგი: კერძი', dishH:'რას მიირთმევ?', card:'ჩემი ბარათი', table:'მაგიდა {t} · ადგილი {k}', tableN:'მაგიდა {n}',
      seatN:'მაგიდა {t}, ადგილი {k}, თავისუფალი', near:'გვერდით გიზის: {a}.', nearNone:'შენ გვერდით ჯერ თავისუფალია.', see:'პარასკევს გნახავთ.', and:' და '},
  en:{dear:'Dear {to},', when:'Friday, 19:30', where:'The Glass Hall, Vake', dress:'Dress code: evening, relaxed', yes:'I’m coming', no:'Can’t make it', noMsg:'We’ll miss you. You can change your mind until Wednesday.',
      seatH:'Pick your seat', seatHint:'Drag your card to a free seat, or tap one.', next:'Next: your dish', dishH:'What will you have?', card:'My place card', table:'Table {t} · Seat {k}', tableN:'TABLE {n}',
      seatN:'Table {t}, seat {k}, free', near:'You’re next to {a}.', nearNone:'The seats next to you are still free.', see:'See you on Friday.', and:' and '}
};
const seatPos = (T, k) => { const a = (-90 + k * 60) * Math.PI / 180; return [T.x + 44 * Math.cos(a), T.y + 44 * Math.sin(a)]; };
class Seats extends Demo {
  init(){ return {step:'rsvp', no:false, seat:null, dish:-1, tip:''}; }
  bind(){
    let d = null;
    const seatAt = e => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest ? el.closest('.se-seat.free') : null; };
    this.el.addEventListener('pointerdown', e => {
      const c = e.target.closest('.se-card'); if (!c) return;
      e.preventDefault(); d = {pid:e.pointerId, x:e.clientX, y:e.clientY, ghost:null, moved:false, c}; try { c.setPointerCapture(e.pointerId); } catch (err) {}
    });
    this.el.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.pid) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
      const root = this.q('.dm'), r = root.getBoundingClientRect();
      if (!d.ghost){ d.moved = true; d.ghost = document.createElement('div'); d.ghost.className = 'se-ghost'; d.ghost.innerHTML = d.c.outerHTML; root.appendChild(d.ghost); d.c.style.opacity = '.3'; }
      d.ghost.style.left = (e.clientX - r.left) + 'px'; d.ghost.style.top = (e.clientY - r.top) + 'px';
      this.el.querySelectorAll('.se-seat.drop').forEach(x => x.classList.remove('drop'));
      const st = seatAt(e); if (st) st.classList.add('drop');
    });
    const end = e => {
      if (!d || e.pointerId !== d.pid) return;
      const x = d; d = null; if (x.ghost) x.ghost.remove(); x.c.style.opacity = '';
      const st = e.type === 'pointercancel' ? null : seatAt(e);
      if (st) this.sit(+st.dataset.t, +st.dataset.k);
      else if (!x.moved){ this.s.tip = ST[lang].seatHint; this.render(); }
    };
    this.el.addEventListener('pointerup', end); this.el.addEventListener('pointercancel', end);
  }
  sit(ti, k){ const s = this.s; s.seat = {t:ti, k}; s.tip = ''; this.render(); this.burst(10); }
  near(){
    const g = ST[lang], T = this.t.tables[this.s.seat.t], k = this.s.seat.k, ns = [T.seats[(k + 5) % 6], T.seats[(k + 1) % 6]].filter(Boolean);
    return ns.length ? fill(g.near, {a:ns.map(p => tx(p.n)+' ('+tx(p.r)+')').join(g.and)}) : g.nearNone;
  }
  act(a, b){
    const s = this.s, t = this.t, g = ST[lang];
    if (a === 'again') return this.reset();
    if (a === 'yes'){ s.step = 'seat'; s.no = false; this.render(); this.burst(18); }
    else if (a === 'no'){ s.no = true; this.render(); }
    else if (a === 'sit') this.sit(+b.dataset.t, +b.dataset.k);
    else if (a === 'who'){ const p = t.tables[+b.dataset.t].seats[+b.dataset.k]; s.tip = tx(p.n)+' · '+tx(p.r); this.render(); }
    else if (a === 'dishes'){ if (s.seat){ s.step = 'dish'; this.render(); } }
    else if (a === 'dish'){ s.dish = +b.dataset.i; this.render(); }
    else if (a === 'card'){ if (s.dish >= 0){ s.step = 'card'; this.render(); this.burst(36); } }
    void g;
  }
  plan(){
    const t = this.t, s = this.s, g = ST[lang];
    return '<svg viewBox="0 0 268 290" role="group" aria-label="'+esc(g.seatH)+'">'+t.tables.map((T, ti) =>
      '<circle class="se-tab" cx="'+T.x+'" cy="'+T.y+'" r="28"/><text class="se-tab-n" x="'+T.x+'" y="'+(T.y + 3)+'">'+esc(fill(g.tableN, {n:ti + 1}))+'</text>'+
      T.seats.map((p, k) => { const [x, y] = seatPos(T, k), me = s.seat && s.seat.t === ti && s.seat.k === k;
        const c = '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="11"/>', lt = v => '<text x="'+x.toFixed(1)+'" y="'+(y + 3.2).toFixed(1)+'">'+esc(v.charAt(0))+'</text>';
        if (me) return '<g class="se-seat me">'+c+lt(tx(t.to))+'</g>';
        if (p) return '<g class="se-seat taken" data-act="who" data-t="'+ti+'" data-k="'+k+'" role="button" tabindex="0" aria-label="'+esc(tx(p.n)+', '+tx(p.r))+'">'+c+lt(tx(p.n))+'</g>';
        return '<g class="se-seat free" data-act="sit" data-t="'+ti+'" data-k="'+k+'" role="button" tabindex="0" aria-label="'+esc(fill(g.seatN, {t:ti + 1, k:k + 1}))+'">'+c+'</g>'; }).join('')).join('')+'</svg>';
  }
  render(){
    const t = this.t, s = this.s, g = ST[lang];
    const head = '<p class="se-kick">'+esc(tx(t.co))+'</p>';
    let body = '';
    if (s.step === 'rsvp'){
      body = head+'<h2 class="se-h">'+esc(tx(t.name))+'</h2><div class="se-rule"><i></i></div><div class="se-inv"><span>'+esc(fill(g.dear, {to:tx(t.to)}))+'</span><span>'+esc(tx(t.ask))+'</span><b>'+esc(g.when)+'</b><span>'+esc(g.where)+'</span><span>'+esc(g.dress)+'</span></div>'+
        '<div class="se-btns"><button type="button" class="se-yes" data-act="yes">'+esc(g.yes)+'</button><button type="button" class="se-no" data-act="no">'+esc(g.no)+'</button></div><p class="se-msg" aria-live="polite">'+(s.no ? esc(g.noMsg) : '')+'</p>';
    } else if (s.step === 'seat'){
      body = head+'<h2 class="se-h sm">'+esc(g.seatH)+'</h2><div class="se-plan">'+this.plan()+'</div><p class="se-tip" aria-live="polite">'+esc(s.seat ? this.near() : (s.tip || g.seatHint))+'</p>'+
        (s.seat ? '<button type="button" class="se-next" data-act="dishes">'+esc(g.next)+'</button>' : '<div class="se-me"><button type="button" class="se-card">'+esc(lang === 'ka' ? mt(tx(t.to)) : tx(t.to).toUpperCase())+'</button></div>');
    } else if (s.step === 'dish'){
      body = head+'<h2 class="se-h sm">'+esc(g.dishH)+'</h2><div class="se-dishes">'+t.dishes.map((x, i) => '<button type="button" class="se-dish" data-act="dish" data-i="'+i+'" aria-pressed="'+(s.dish === i)+'"><span class="pl">'+ic(x.ic)+'</span><span><b>'+esc(tx(x.n))+'</b><small>'+esc(tx(x.d))+'</small></span></button>').join('')+'</div>'+
        '<button type="button" class="se-yes" data-act="card"'+(s.dish < 0 ? ' disabled' : '')+'>'+esc(g.card)+'</button>';
    } else {
      body = head+'<div class="se-tent"><div class="back"></div><div class="front"><span class="k">'+esc(tx(t.co))+' · '+new Date().getFullYear()+'</span><b>'+esc(tx(t.to))+'</b>'+
        '<span class="tb">'+esc(fill(g.table, {t:s.seat.t + 1, k:s.seat.k + 1}))+'</span><span class="dish">'+esc(tx(t.dishes[s.dish].n))+'</span><span class="se-seal">RSVP</span></div></div>'+
        '<p class="se-near">'+esc(this.near())+'</p><p class="se-near"><b>'+esc(g.when)+'</b> · '+esc(g.where)+'</p><p class="se-see">'+esc(g.see)+'</p><button type="button" class="se-again" data-act="again">'+esc(dg().again)+'</button>';
    }
    this.paint('<div class="dm-in se-in">'+body+'</div>');
  }
}

const MECH = {invite:Invite, swipe:Swipe, spot:Spot, build:Build, chat:Chat, map:MapHunt, scratch:Scratch, seats:Seats};

/* ---------- the demo line-up: eight demos, eight ways to play ---------- */
TBY.omakase.mech = 'invite'; TBY.omakase.goal = 'attend';
TBY.omakase.tag = L('სუშის ბარი: მოსაწვევი','Sushi bar: an invitation');
[
{ id:'spot', mech:'spot', goal:'learn', time:60,
  name:L('ოთახი 214','Room 214'), kind:L('სწავლება · სასტუმროს დასუფთავება','Learning · Hotel housekeeping'), tag:L('სასტუმრო: იპოვე შეცდომები','Hotel: find the mistakes'), brand:L('სასტუმრო ლილა','Hotel Lila'),
  desc:L('ოთახი სტუმრის მოსვლამდე: იპოვე ხუთი შეცდომა 60 წამში. ყოველი აღმოჩენა ერთ წესს გასწავლის.','A room before the guest arrives: find five mistakes in 60 seconds. Every find teaches one rule.'),
  steps:[L('ოთახი სტუმრის მოსვლამდე','The room before the guest arrives'), L('60 წამი ხუთი შეცდომისთვის','60 seconds to find five mistakes'), L('ყოველი აღმოჩენა წესს გასწავლის','Every find teaches a rule'), L('ვარსკვლავები და ოთახის ჩეკლისტი','Stars and a room checklist')],
  c:{acc:'#6F5590', acc2:'#F2B33D', paper:'#FFFFFF'}, fx:'petal', fxc:['#B9A3D9','#F2B33D','#FFFFFF'],
  spots:[
    {id:'frame', n:L('დახრილი სურათი','A crooked picture'), why:L('სურათები სწორად ეკიდება. შეამოწმე კარიდან.','Pictures hang straight. Check from the doorway.')},
    {id:'cup', n:L('ნახმარი ჭიქა','A used cup'), why:L('ნახმარი ჭურჭელი ოთახიდან გააქვს და სუფთით ცვლი.','Used cups leave the room and are replaced with clean ones.')},
    {id:'towel', n:L('პირსახოცი იატაკზე','A towel on the floor'), why:L('სუფთა პირსახოცები დაკეცილი, საწოლის ბოლოში.','Fresh towels go folded at the foot of the bed.')},
    {id:'bin', n:L('სავსე ურნა','A full bin'), why:L('ურნა ყოველ ჯერზე იცლება, ახალი პარკით.','Empty the bin every time and fit a new liner.')},
    {id:'slipper', n:L('ერთი ჩუსტი','One slipper'), why:L('ჩუსტები წყვილად, საწოლის გვერდით.','Slippers go in pairs, by the bed.')}]},
{ id:'swipe', mech:'swipe', goal:'learn', time:45,
  name:L('უსაფრთხოა თუ არა?','Safe or not?'), kind:L('სწავლება · სამზარეულოს გუნდი','Learning · Kitchen team'), tag:L('სამზარეულო: უსაფრთხოა თუ არა','Kitchen: safe or not'), brand:L('სახლი · სამზარეულო','SAKHLI KITCHEN'),
  desc:L('სანიტარიის სწავლება ბარათებით: გადაწიე მარჯვნივ, თუ უსაფრთხოა, მარცხნივ, თუ არა. 45 წამი, ექვსი სიტუაცია.','Food-safety training as a card deck: swipe right if it’s safe, left if it isn’t. 45 seconds, six situations.'),
  steps:[L('სიტუაცია ბარათზე','A situation on a card'), L('გადაწევა მარჯვნივ ან მარცხნივ','Swipe right or left'), L('მყისიერი ახსნა','An instant explanation'), L('ქულა და სამზარეულოს ნიშანი','A score and a kitchen badge')],
  c:{acc:'#E5402A', acc2:'#1F9D55', paper:'#FFD23F'}, fx:'rect', fxc:['#E5402A','#1F9D55','#FFD23F'],
  cards:[
    {ic:'knife', ok:false, s:L('უმი ქათამი და სალათი ერთსა და იმავე დაფაზე.','Raw chicken and salad on the same cutting board.'), why:L('ცალ-ცალკე დაფები: წითელი ხორცისთვის, მწვანე ბოსტნეულისთვის.','Separate boards: red for raw meat, green for vegetables.')},
    {ic:'hands', ok:true, s:L('ცვლის დაწყებამდე ხელების დაბანა 20 წამი.','Washing your hands for 20 seconds before a shift.'), why:L('ზუსტად ასე: საპონი, 20 წამი, ერთჯერადი ხელსახოცი.','Exactly: soap, 20 seconds, a paper towel.')},
    {ic:'thermo', ok:true, s:L('მაცივარი 4 °C-ზე ან უფრო ცივად.','Keeping the fridge at 4 °C or colder.'), why:L('4 °C-ზე ბაქტერიები თითქმის არ მრავლდება.','At 4 °C bacteria barely grow.')},
    {ic:'spoon', ok:false, s:L('სოუსის გასინჯვა ერთი და იმავე კოვზით ორჯერ.','Tasting the sauce twice with the same spoon.'), why:L('ყოველ ჯერზე სუფთა კოვზი.','A clean spoon every time.')},
    {ic:'steak', ok:false, s:L('ხორცის გალღობა მაგიდაზე, ოთახის ტემპერატურაზე.','Thawing meat on the counter at room temperature.'), why:L('ხორცი მაცივარში ლღვება, ღამით.','Meat thaws in the fridge, overnight.')},
    {ic:'tag', ok:true, s:L('გახსნილ ქილაზე გახსნის თარიღის დაწერა.','Writing the opening date on an opened jar.'), why:L('თარიღი გეუბნება, როდის უნდა გადააგდო.','The date tells you when to throw it out.')}]},
{ id:'build', mech:'build', goal:'learn',
  name:L('მენიუს აკადემია','Menu Academy'), kind:L('სწავლება · სუშის ბარის გუნდი','Learning · Sushi bar team'), tag:L('სუშის ბარი: ააწყე შეკვეთა','Sushi bar: build the order'), brand:L('NAMI'),
  desc:L('ოფიციანტები და მზარეულები მენიუს ერთად სწავლობენ: წაიკითხე შეკვეთა, ჩააწყე ინგრედიენტები და მიიტანე. სამი შეკვეთა, ერთი ალერგიით.','Waiters and cooks learn the menu together: read the order, lay out the ingredients, serve it. Three orders, one with an allergy.'),
  steps:[L('შეკვეთა რელსზე','An order on the rail'), L('ინგრედიენტების ჩაწყობა','Lay out the ingredients'), L('მიტანა და მყისიერი შემოწმება','Serve it and get an instant check'), L('სერტიფიკატი 合格 ბეჭდით','A certificate with a 合格 stamp')],
  c:{acc:'#C8312B', acc2:'#9CC27A', paper:'#FFFDF7'}, fx:'petal', fxc:['#f6c1cc','#C8312B','#FFFDF7'],
  ings:[{id:'nori', n:L('ნორი','Nori'), col:'#1F3B2C'}, {id:'rice', n:L('ბრინჯი','Rice'), col:'#FBF8F0'}, {id:'salmon', n:L('ორაგული','Salmon'), col:'#F08A5D'}, {id:'tuna', n:L('თინუსი','Tuna'), col:'#C8312B'},
        {id:'cheese', n:L('ნაღების ყველი','Cream cheese'), col:'#FFF1CC'}, {id:'avocado', n:L('ავოკადო','Avocado'), col:'#9CC27A'}, {id:'cucumber', n:L('კიტრი','Cucumber'), col:'#4E9A4A'}, {id:'sesame', n:L('სეზამი','Sesame'), col:'#E8D9B0'}],
  orders:[{t:L('მაგიდა 4','Table 4'), d:L('ფილადელფია როლი','Philadelphia roll'), note:null, need:['nori','rice','salmon','cheese','avocado']},
          {t:L('მაგიდა 7','Table 7'), d:L('კაპა მაკი','Kappa maki'), note:L('ვეგეტარიანელი სტუმარი','Vegetarian guest'), need:['nori','rice','cucumber','sesame']},
          {t:L('მაგიდა 2','Table 2'), d:L('ფილადელფია როლი','Philadelphia roll'), note:L('ალერგია ავოკადოზე','Avocado allergy'), need:['nori','rice','salmon','cheese']}]},
{ id:'buddy', mech:'chat', goal:'onboard',
  name:L('შენი ბადი','Your buddy'), kind:L('ონბორდინგი · პროდუქტის გუნდი','Onboarding · Product team'), tag:L('ჩატი ბადისთან და გუნდის გაცნობა','A chat with your buddy'), co:L('ORBITA'),
  desc:L('ახალ თანამშრომელს პირველ დღემდე ბადი წერს: პასუხობ, ირჩევ ყავის დროს და მაგიდას, ხვდები გუნდს და თამაშობ „ვინ ვინაა“.','A buddy messages the new hire before day one: you answer, pick a coffee time and a desk, meet the team and play “who’s who”.'),
  steps:[L('ბადი პირველი წერს','Your buddy writes first'), L('შენი პასუხები ცვლის საუბარს','Your answers change the chat'), L('თამაში „ვინ ვინაა“','A “who’s who” game'), L('საშვი ორშაბათისთვის','A pass for Monday')],
  c:{acc:'#2F5BD3', acc2:'#2BB673', paper:'#FFFFFF'}, fx:'rect', fxc:['#2F5BD3','#FFD23F','#F7A9BE'],
  to:L('გიორგი','Giorgi'), me:{hair:'#2A1C14', skin:'#E2AC86', bg:'#9FB8F4', style:1, shirt:'#2F5BD3'},
  team:[{n:L('ნინო','Nino'), r:L('დიზაინი','Design'), hair:'#2B1B12', skin:'#EDBB98', bg:'#FFD23F', style:0},
        {n:L('დათო','Dato'), r:L('ფრონტენდი','Frontend'), hair:'#151515', skin:'#D9A47E', bg:'#7FC8A9', style:1, glasses:true},
        {n:L('ანა','Ana'), r:L('პროდუქტი','Product'), hair:'#8A3B1E', skin:'#F1C6A8', bg:'#F7A9BE', style:2},
        {n:L('ლევანი','Levan'), r:L('მონაცემები','Data'), hair:'#3A2A1A', skin:'#C99272', bg:'#C9B8F0', style:3, beard:true}],
  script:{
    hello:[L('გამარჯობა, {to}! მე ნინო ვარ, შენი ბადი Orbita-ში. ორშაბათამდე ყველაფერს აქ გეტყვი.','Hi {to}! I’m Nino, your buddy at Orbita. I’ll walk you through everything here before Monday.'), L('ცოტა ნერვიულობ?','A little nervous?')],
    nerv:[[L('ცოტა, კი','A little, yes'), L('ნორმალურია. პირველ დღეს ყველა ასეა, მეც ასე ვიყავი.','That’s normal. Everyone is on day one. I was too.')],
          [L('საერთოდ არა','Not at all'), L('მომწონს! მაშინ პირდაპირ საქმეზე.','Love it. Straight to business, then.')]],
    coffeeQ:L('ორშაბათს ერთად დავლიოთ ყავა. როდის გირჩევნია?','Let’s have coffee together on Monday. When suits you?'), coffeeA:['10:00', '15:00'],
    coffeeR:L('ჩავწერე. {time}-ზე ქვემოთ, კაფეში შეგხვდები.','Booked. I’ll meet you downstairs in the café at {time}.'),
    loc:{t:L('ვაკე, ჭავჭავაძის 37','37 Chavchavadze Ave, Vake'), d:L('მე-5 სართული · მიმღებში უთხარი შენი სახელი','5th floor · give your name at reception')},
    deskQ:L('მაგიდა: მშვიდ ზონაში თუ გუნდთან ახლოს?','Your desk: the quiet zone, or next to the team?'),
    deskA:[[L('მშვიდ ზონაში','Quiet zone'), 'A-12'], [L('გუნდთან','Next to the team'), 'B-04']],
    deskR:L('{desk} შენია. ლეპტოპი უკვე მაგიდაზე დაგხვდება.','{desk} is yours. Your laptop will be waiting on the desk.'),
    team:L('ეს ჩვენი გუნდია. ხმოვანიც ჩაგიწერეს:','This is the team. They recorded you a voice note:'),
    gameQ:L('პატარა თამაში: ორშაბათამდე დაიმახსოვრებ, ვინ ვინაა?','Quick game: can you learn who’s who before Monday?'), gameA:L('ვითამაშოთ','Let’s play'),
    won:L('{moves} სვლაში! ორშაბათს ყველას სახელით მიესალმები.','{moves} moves! You’ll greet everyone by name on Monday.'),
    bye:L('აი, შენი საშვი. ორშაბათს გნახავ!','Here’s your pass. See you Monday!')}},
{ id:'map', mech:'map', goal:'onboard',
  name:L('მაღაზიის რუკა','The store map'), kind:L('ონბორდინგი · მაღაზიების ქსელი','Onboarding · Retail chain'), tag:L('მაღაზია: რუკა პირველ დღემდე','Store: a map before day one'), co:L('BAZARI'),
  desc:L('ახალი მოლარე მაღაზიას პირველ დღემდე ეცნობა: ხსნის ოთახებს რუკაზე და ამოწმებს, სად წავა განგაშის დროს.','A new cashier gets to know the store before day one: open the rooms on the map, then show where to go if the alarm rings.'),
  steps:[L('მაღაზიის გეგმა','The store plan'), L('ხუთი ოთახი, ხუთი წესი','Five rooms, five rules'), L('განგაშის შემოწმება','An alarm drill'), L('ბეჯი პირველი დღისთვის','A badge for day one')],
  c:{acc:'#FFB13B', acc2:'#FFFFFF', paper:'#1638B8'}, fx:'rect', fxc:['#FFB13B','#FFFFFF','#FF7A1A'],
  to:L('მარიამი','Mariam'), role:L('მოლარე','Cashier'), me:{hair:'#4A2A1A', skin:'#F0C4A4', bg:'#FFE1B0', style:2, shirt:'#FF7A1A'},
  rooms:[
    {lab:L('შესასვლელი','STAFF DOOR'), n:L('სამსახურებრივი შესასვლელი','Staff entrance'), px:247, py:109, r:[228, 84, 38, 50], txt:L('შემოდი უკანა კარიდან 8:45-ზე. კარის კოდია 2207.','Come in through the back door at 8:45. The door code is 2207.')},
    {lab:L('გასახდელი','STAFF ROOM'), n:L('გასახდელი','Staff room'), px:205, py:52, r:[172, 14, 94, 70], txt:L('შენი კარადაა №14. შესვენება აქ გაქვს, 13:00–13:30.','Your locker is No. 14. Your break is here, 13:00–13:30.')},
    {lab:L('საწყობი','STOCKROOM'), n:L('საწყობი','Stockroom'), px:66, py:60, r:[14, 14, 104, 86], txt:L('მარაგი აქ ინახება. 15 კგ-ზე მძიმე ყუთს ორი ადამიანი წევს.','Stock lives here. Boxes over 15 kg take two people to lift.')},
    {lab:L('სალაროები','TILLS'), n:L('სალაროები','The tills'), px:104, py:232, r:[30, 214, 150, 36], txt:L('შენი სალარო №3-ია. პირველ კვირას ქეთი გვერდით დაგიდგება.','Your till is No. 3. Keti works beside you for the first week.')},
    {lab:L('გასასვლელი','FIRE EXIT'), n:L('საევაკუაციო გასასვლელი','Fire exit'), px:30, py:160, r:[14, 145, 30, 30], txt:L('განგაშის დროს გადი აქედან და დადექი პარკინგზე, ბოძთან A.','If the alarm rings, leave this way and wait in the car park at post A.')}]},
{ id:'scratch', mech:'scratch', goal:'engage', have:6, of:10,
  name:L('ცისკრის ყავა','Tsiskari Coffee'), kind:L('კამპანია · ყავის ბრენდი','Campaign · Coffee brand'), tag:L('ყავა: გაფხეკე და შეაგროვე','Coffee: scratch and collect'), brand:L('ცისკარი','TSISKARI'), kind2:L('ყავა','COFFEE'),
  desc:L('ჭიქის სახელურზე QR, ტელეფონში ფხეკის ბარათი: გაფხეკე, მოიგე და შეაგროვე ბეჭდები. მეათე ყავა საჩუქარია.','A QR code on the cup sleeve opens a scratch card: scratch, win and collect stamps. The tenth coffee is on the house.'),
  steps:[L('QR ჭიქაზე','A QR code on the cup'), L('ფხეკის ბარათი','A scratch card'), L('ბეჭდების ბარათი','A stamp card'), L('კუპონი სალაროსთვის','A coupon for the till')],
  c:{acc:'#0E3B2C', acc2:'#D4202B', paper:'#F3EAD6'}, fx:'rect', fxc:['#0E3B2C','#D4202B','#F3EAD6'],
  prizes:[{big:L('+2'), n:L('ორმაგი ბეჭედი','Double stamp'), d:L('დღეს ორ ბეჭედს იღებ.','You get two stamps today.'), stamps:2},
          {big:L('−50%'), n:L('ნახევარ ფასად','Half price'), d:L('შემდეგი ფლეტ უაიტი ნახევარ ფასად.','Your next flat white is half price.'), stamps:1},
          {big:L('უფასო','FREE'), n:L('უფასო ქრუასანი','A free croissant'), d:L('ქრუასანი ყავასთან ერთად, ჩვენზე.','A croissant with your coffee, on us.'), stamps:1}]},
{ id:'seats', mech:'seats', goal:'attend',
  name:L('წლის ბოლოს ვახშამი','Year-end dinner'), kind:L('ღონისძიება · კომპანიის ვახშამი','Event · Company dinner'), tag:L('ვახშამი: აირჩიე ადგილი','Dinner: pick your seat'), co:L('MERIDIAN'),
  ask:L('გეპატიჟებით წლის დასასრულის ვახშამზე.','You’re invited to our year-end dinner.'),
  desc:L('მოსაწვევი, სადაც სტუმარი თვითონ ირჩევს ადგილს: ხედავს, ვინ ზის მაგიდასთან, ირჩევს კერძს და იღებს ბარათს სახელით.','An invitation where guests pick their own seat: see who sits at each table, choose a dish and get a place card with their name.'),
  steps:[L('მოსაწვევი და პასუხი','The invitation and an answer'), L('ადგილი დარბაზის გეგმაზე','A seat on the floor plan'), L('კერძის არჩევა','Choose a dish'), L('ბარათი სახელით','A place card with your name')],
  c:{acc:'#C9A45C', acc2:'#F4F1E8', paper:'#7FC8A9'}, fx:'rect', fxc:['#C9A45C','#F4F1E8','#7FC8A9'],
  to:L('თამარ','Tamar'),
  tables:[{x:72, y:84, seats:[{n:L('გიორგი','Giorgi'), r:L('დიზაინი','Design')}, null, {n:L('ანა','Ana'), r:L('გაყიდვები','Sales')}, null, {n:L('ლევანი','Levan'), r:L('მონაცემები','Data')}, null]},
          {x:196, y:84, seats:[null, {n:L('ნინო','Nino'), r:L('დიზაინი','Design')}, {n:L('დათო','Dato'), r:L('ფინანსები','Finance')}, null, null, {n:L('ქეთი','Keti'), r:L('HR')}]},
          {x:134, y:206, seats:[{n:L('მარი','Mari'), r:L('მარკეტინგი','Marketing')}, {n:L('ლუკა','Luka'), r:L('CEO')}, null, {n:L('სალომე','Salome'), r:L('იურიდიული','Legal')}, null, null]}],
  dishes:[{ic:'steak', n:L('საქონლის ფილე','Beef tenderloin'), d:L('წითელი ღვინის სოუსი','Red wine jus')},
          {ic:'fish', n:L('ლავრაკი','Sea bass'), d:L('ლიმონი, კაპერსი','Lemon, capers')},
          {ic:'leaf', n:L('სოკოს რიზოტო','Mushroom risotto'), d:L('ვეგეტარიანული','Vegetarian')}]}
].forEach(t => { TBY[t.id] = t; });
TPL.length = 0;
['spot', 'swipe', 'build', 'buddy', 'map', 'scratch', 'seats', 'omakase'].forEach(id => TPL.push(TBY[id]));


/* ---------- public API ---------- */
window.GancdaDemos = {
  mount(el, id){ const t = TBY[id]; if (!t) return null; const C = MECH[t.mech] || Invite; return new C(el, id); },
  drop(inst){ if (!inst) return; inst.clear(); const i = invites.indexOf(inst); if (i > -1) invites.splice(i, 1); },
  setLanguage(value){ lang = value === 'en' ? 'en' : 'ka'; invites.forEach(i => { if (i.el && i.el.isConnected) i.render(); }); },
  info(id){ const t = TBY[id]; if (!t) return null;
    return {id, goal:t.goal, name:tx(t.name), kind:tx(t.kind), tag:tx(t.tag), desc:tx(t.desc), brand:tx(t.brand || t.co || (t.tk && t.tk.venue) || ''), steps:(t.steps || []).map(tx)}; },
  ids(){ return TPL.map(t => t.id); }
};
})();
