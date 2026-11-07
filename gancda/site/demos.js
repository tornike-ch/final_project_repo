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
  desc:L('პაემნის მოსაწვევი სუშის ბარის სტილში: გადაწიე ნორენის ფარდა, აირჩიე კერძები, ამოიღე ომიკუჯი და მიიღე ბილეთი 確定 ბეჭდით.','A date invitation in sushi-bar style: part the noren curtain, pick your dishes, draw an omikuji and get a ticket with a 確定 stamp.'),
  c:{bg:'#121018',s:'#1c1922',s2:'#25212c',ink:'#f4ecdf',mut:'#a69a8c',acc:'#c8312b',on:'#ffffff',acc2:'#c9a45c',paper:'#f4ecdf',pink:'#121018',line:'#342e3c',flap:'#1f2a4d',flapInk:'#fffaf0'},
  pat:'waves', po:.06, jp:true, fx:'petal', fxc:['#f6c1cc','#fde2e7','#f6c1cc'],
  op:{type:'noren', l:'寿', r:'司', ls:L('სუ','SU'), rs:L('ში','SHI')},
  kick:L('いらっしゃいませ'), kick2:L('デートのお誘い'),
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
  reset(){ this.clear(); this.lastStep = -1; this.s = {step:0, picks:[], fortune:-1, stamped:false, tries:0}; this.render(); this.step(0); }
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
  go(n){ this.s.step = n; this.render(); if (this.inner) this.inner.scrollTop = 0; this.step(Math.max(0, n - 1)); }
  onClick(e){
    const b = e.target.closest('[data-act]'); if (!b || !this.el.contains(b)) return;
    const a = b.dataset.act, s = this.s;
    if (a === 'open'){ if (b.classList.contains('open')) return; b.classList.add('open'); sfx('whoosh'); this.later(() => this.go(1), reduced() ? 50 : 1050); }
    else if (a === 'yes'){ this.burst(36); sfx('win'); buzz([15, 30, 15]); this.later(() => this.go(2), 380); }
    else if (a === 'no'){ this.flee(b); }
    else if (a === 'pick'){ sfx('tap'); this.pick(+b.dataset.i, b); }
    else if (a === 'next'){ if (s.step === 2 && !s.picks.length) return; this.go(s.step + 1); }
    else if (a === 'reveal'){ b.classList.add('shake'); sfx('clack'); buzz([20, 40, 20]); this.later(() => { s.fortune = Math.floor(Math.random() * tx(this.t.sp.lines).length); this.render(); sfx('ding'); this.burst(18); }, 520); }
    else if (a === 'stamp'){ s.stamped = true; this.render(); this.later(() => { sfx('stamp'); buzz(30); this.shake(); }, 260); this.later(() => { sfx('win'); this.burst(40); }, 380); this.won(); }
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
  send2:'<path d="M4 12 20 4l-4 16-4-6z"/><path d="M12 14l8-10"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M12 13v5M9.5 15.5h5"/>'
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

/* ---------- the juice kit: sound, touch and ink, shared by every demo ----------
   Sounds are synthesised with Web Audio (no files), start only after a tap, and can be switched off. */
let soundOn = (() => { try { return localStorage.getItem('gancda.sound') !== 'off'; } catch (e) { return true; } })();
let actx = null;
function audio(){
  if (!soundOn) return null;
  try {
    if (!actx){ const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; actx = new A(); }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  } catch (e) { return null; }
}
function tone(c, o){
  const t0 = c.currentTime + (o.t || 0), d = o.d || .15, v = o.v || .12, osc = c.createOscillator(), g = c.createGain();
  osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(o.f, t0); if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + d);
  g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + (o.a || .006)); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  osc.connect(g); g.connect(c.destination); osc.start(t0); osc.stop(t0 + d + .03);
}
function hiss(c, o){
  const d = o.d || .08, n = Math.max(1, Math.floor(c.sampleRate * d)), b = c.createBuffer(1, n, c.sampleRate), x = b.getChannelData(0);
  for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
  const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
  f.type = o.lp ? 'lowpass' : 'highpass'; f.frequency.value = o.lp || o.hp || 1200;
  s.buffer = b; g.gain.value = o.v || .1; s.connect(f); f.connect(g); g.connect(c.destination); s.start(c.currentTime + (o.t || 0));
}
const SFX = {
  tap: c => tone(c, {f:700, d:.05, v:.06, type:'triangle'}),
  pop: c => tone(c, {f:380, f2:880, d:.09, v:.09}),
  ok: c => { tone(c, {f:660, d:.12, v:.1, type:'triangle'}); tone(c, {f:990, t:.08, d:.2, v:.1, type:'triangle'}); },
  bad: c => { tone(c, {f:196, f2:140, d:.26, v:.09, type:'sawtooth'}); hiss(c, {d:.08, v:.05, lp:600}); },
  stamp: c => { tone(c, {f:150, f2:48, d:.2, v:.32}); hiss(c, {d:.07, v:.16, lp:900}); },
  ding: c => { tone(c, {f:1318, d:1.3, v:.1}); tone(c, {f:1976, d:.9, v:.04}); },
  win: c => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(c, {f, t:i * .075, d:.55, v:.08, type:'triangle'})),
  whoosh: c => hiss(c, {d:.28, v:.07, hp:700}),
  scratch: c => hiss(c, {d:.05, v:.035, hp:3200}),
  print: c => { for (let i = 0; i < 9; i++) hiss(c, {t:i * .07, d:.035, v:.05, hp:2200}); },
  flip: c => hiss(c, {d:.06, v:.06, hp:1600}),
  shutter: c => { hiss(c, {d:.03, v:.2, hp:1800}); hiss(c, {t:.07, d:.05, v:.14, hp:1200}); },
  clack: c => { hiss(c, {d:.03, v:.3, lp:2600}); hiss(c, {t:.11, d:.03, v:.24, lp:2600}); },
  siren: c => {
    const t0 = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth';
    for (let k = 0; k < 4; k++){ o.frequency.setValueAtTime(620, t0 + k * .5); o.frequency.linearRampToValueAtTime(960, t0 + k * .5 + .25); o.frequency.linearRampToValueAtTime(620, t0 + k * .5 + .5); }
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.045, t0 + .05); g.gain.setValueAtTime(.045, t0 + 1.9); g.gain.exponentialRampToValueAtTime(.0001, t0 + 2);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + 2.05);
  }
};
function sfx(n){ const c = audio(); if (c && SFX[n]) try { SFX[n](c); } catch (e) {} }
function buzz(p){ try { if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(p); } catch (e) {} }
const FLAME = '<svg class="flame" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.8 3.6 5.5 5.7 5.5 11a5.5 5.5 0 0 1-11 0c0-2.8 1.6-4.3 2.3-6.6 1.5 1.1 2.4 2.6 2.6 4.4 1.3-2.4 1.4-5.5.6-8.8z"/><path class="in" d="M12 12.5c.4 1.8 2.6 2.6 2.6 4.8a2.6 2.6 0 0 1-5.2 0c0-1.4 1-2.2 1.4-3.2.6.4 1 .9 1.2 1.6.3-1.1.3-2.2 0-3.2z"/></svg>';

/* the base every new demo shares: timers, painting, keyboard for drawn controls, and the juice */
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
  reset(){ this.clear(); this.lastStep = -1; this.s = this.init(); this.render(); this.step(0); }
  clear(){ this.timers.forEach(clearTimeout); this.timers = []; if (this.iv){ clearInterval(this.iv); this.iv = 0; } }
  later(fn, ms){ this.timers.push(setTimeout(fn, ms)); }
  paint(inner){ this.el.innerHTML = '<div class="dm dm-'+this.t.mech+'">'+inner+'<div class="i-fx"></div></div>'; }
  q(s){ return this.el.querySelector(s); }
  svgPt(e, svg, w, h){ const r = svg.getBoundingClientRect(); return {x:(e.clientX - r.left) / r.width * w, y:(e.clientY - r.top) / r.height * h}; }
  /* progress for the player's side rail: n is the index of the step the visitor has reached */
  step(n){ if (n <= this.lastStep) return; this.lastStep = n; this.el.dispatchEvent(new CustomEvent('gancda:step', {bubbles:true, detail:{id:this.t.id, n}})); }
  won(){ this.step((this.t.steps || []).length); this.el.dispatchEvent(new CustomEvent('gancda:done', {bubbles:true, detail:{id:this.t.id}})); }
  shake(){ const r = this.q('.dm, .scr'); if (!r || reduced()) return; r.classList.remove('dm-shake'); void r.offsetWidth; r.classList.add('dm-shake'); }
  flash(c){ const r = this.q('.dm'); if (!r) return; const f = document.createElement('i'); f.className = 'dm-flash'; f.style.background = c; r.appendChild(f); setTimeout(() => f.remove(), 700); }
  /* the moment a stamp lands: a thud, a buzz and a small shake */
  thud(ms){ this.later(() => { sfx('stamp'); buzz(28); this.shake(); }, reduced() ? 0 : ms); }
  good(){ sfx('ok'); buzz(12); }
  bad(){ sfx('bad'); buzz([40, 40, 40]); this.flash('rgba(229,64,42,.35)'); }
}
Demo.prototype.burst = Invite.prototype.burst;
['step', 'won', 'shake', 'q'].forEach(k => { Invite.prototype[k] = Demo.prototype[k]; });

/* ---------- 1 · swipe: safe or not? ---------- */
const SW = {
  ka:{yes:'უსაფრთხოა', no:'არ არის', right:'სწორია.', wrong:'არა.', hint:'გადაწიე ბარათი: მარჯვნივ, თუ უსაფრთხოა, მარცხნივ, თუ არა.', pass:'სამზარეულოსთვის მზად', fail:'კიდევ ერთი ცდა', used:'წამი', streak:'საუკეთესო სერია', review:'გაიმეორე:', clean:'ერთი შეცდომაც არ დაგიშვია.', grade:'ჰიგიენის შეფასება', insp:'ინსპექცია', hot:'სერია'},
  en:{yes:'Safe', no:'Not safe', right:'Right.', wrong:'Not quite.', hint:'Swipe the card: right if it’s safe, left if it isn’t.', pass:'Kitchen ready', fail:'One more try', used:'seconds', streak:'best streak', review:'Worth another look:', clean:'Not a single mistake.', grade:'Hygiene grade', insp:'Inspection', hot:'streak'}
};
const SWC = ['#FFD23F', '#8FD3F4', '#FF9F7A', '#B9E39B', '#F7A9BE', '#C9B8F0'];
class Swipe extends Demo {
  init(){ return {i:0, score:0, streak:0, best:0, left:this.t.time, run:false, done:false, busy:false, last:null, wrong:[]}; }
  bind(){
    let d = null;
    this.el.addEventListener('pointerdown', e => {
      const c = e.target.closest('.sw-card.top'); if (!c || this.s.done || this.s.busy) return;
      d = {c, x:e.clientX, y:e.clientY, dx:0, dy:0, id:e.pointerId}; try { c.setPointerCapture(e.pointerId); } catch (err) {} c.classList.add('drag');
    });
    this.el.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.id) return;
      d.dx = e.clientX - d.x; d.dy = (e.clientY - d.y) * .25;
      d.c.style.transform = 'translate('+d.dx+'px,'+d.dy+'px) rotate('+(d.dx / 12)+'deg)';
      d.c.style.setProperty('--yes', Math.max(0, Math.min(1, d.dx / 80)));
      d.c.style.setProperty('--no', Math.max(0, Math.min(1, -d.dx / 80)));
    });
    const end = e => {
      if (!d || e.pointerId !== d.id) return;
      const x = d; d = null; x.c.classList.remove('drag');
      if (Math.abs(x.dx) > 70) this.answer(x.dx > 0, true);
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
  answer(safe, dragged){
    const s = this.s, t = this.t; if (s.done || s.busy) return;
    this.go(); this.step(1);
    const ok = t.cards[s.i].ok === safe;
    if (ok){ s.score++; s.streak++; s.best = Math.max(s.best, s.streak); this.good(); } else { s.streak = 0; s.wrong.push(s.i); this.bad(); }
    s.last = {ok, i:s.i}; s.busy = true;
    const el = this.q('.sw-card.top'), slow = reduced() ? 0 : 1;
    if (el){
      /* the stamp lands on the card first, then the card flies off the way it was sent */
      el.style.setProperty(safe ? '--yes' : '--no', 1); el.classList.add('stamped', safe ? 'say-yes' : 'say-no');
      if (!dragged) el.style.transform = 'rotate('+(safe ? 3 : -3)+'deg) scale(1.03)';
      this.later(() => { el.style.transform = ''; el.classList.add(safe ? 'out-r' : 'out-l'); sfx('whoosh'); }, 230 * slow);
    }
    this.later(() => { s.busy = false; s.i++; if (s.i >= t.cards.length) this.finish(); else { this.render(); this.step(2); } }, 520 * slow);
  }
  finish(){
    const s = this.s; if (s.done) return; s.done = true; this.clear(); this.render();
    this.thud(420); this.later(() => { sfx('win'); if (s.score >= this.t.cards.length - 1) this.burst(40); }, reduced() ? 0 : 700);
    this.won();
  }
  render(){
    const t = this.t, s = this.s, g = SW[lang];
    if (s.done) return this.paint(this.result());
    const cards = t.cards.slice(s.i, s.i + 3).map((c, k) => '<div class="sw-card'+(k === 0 ? ' top' : '')+'" style="--k:'+k+';--cc:'+SWC[(s.i + k) % SWC.length]+'">'+
      '<div class="sw-art"><span class="sw-ic">'+ic(c.ic)+'</span></div>'+
      '<span class="sw-stamp yes">'+esc(g.yes)+'</span><span class="sw-stamp no">'+esc(g.no)+'</span>'+
      '<p>'+esc(tx(c.s))+'</p><span class="sw-n">'+(s.i + k + 1)+' / '+t.cards.length+'</span></div>').reverse().join('');
    const last = s.last ? t.cards[s.last.i] : null, heat = Math.min(s.streak, 6);
    this.paint('<div class="dm-in sw-in"><div class="sw-top"><b>'+esc(tx(t.brand))+'</b><span class="sw-sc'+(s.streak > 1 ? ' hot' : '')+'" style="--h:'+heat+'">'+ic('check')+s.score+
        (s.streak > 1 ? ' <em>'+FLAME+'×'+s.streak+'</em>' : '')+'</span></div>'+
      '<div class="sw-time"><i style="width:'+(s.left / t.time * 100)+'%"></i></div><span class="sw-sec">'+secs(s.left)+'</span>'+
      '<h2 class="sw-h">'+esc(tx(t.name))+'</h2><div class="sw-stack">'+cards+'</div>'+
      '<div class="sw-fb'+(last ? (s.last.ok ? ' ok' : ' bad') : '')+'" aria-live="polite">'+(last ? '<span class="sw-fbi">'+ic(s.last.ok ? 'check' : 'close')+'</span><span><b>'+esc(s.last.ok ? g.right : g.wrong)+'</b> '+esc(tx(last.why))+'</span>' : '<span>'+esc(g.hint)+'</span>')+'</div>'+
      '<div class="sw-btns"><button type="button" class="sw-b no" data-act="no" aria-label="'+esc(g.no)+'">'+ic('close')+'</button>'+
      '<button type="button" class="sw-b yes" data-act="yes" aria-label="'+esc(g.yes)+'">'+ic('check')+'</button></div>'+
      '<div class="sw-hob'+(heat ? ' on' : '')+'" aria-hidden="true" style="--h:'+heat+'">'+[0, 1, 2, 3, 4].map(k => '<i style="--d:'+(k * .13).toFixed(2)+'s">'+FLAME+'</i>').join('')+'</div></div>');
  }
  result(){
    const t = this.t, s = this.s, g = SW[lang], n = t.cards.length, pass = s.score >= n - 1, grade = s.score >= n - 1 ? 'A' : s.score >= n - 2 ? 'B' : 'C';
    return '<div class="dm-in sw-in sw-res"><div class="sw-grade g-'+grade+'"><small>'+esc(tx(t.brand))+' · '+esc(g.insp)+'</small><b>'+grade+'</b><span>'+esc(g.grade)+'</span></div>'+
      '<div class="sw-badge'+(pass ? ' pass' : '')+'"><b>'+s.score+'<small>/'+n+'</small></b><span>'+esc(pass ? g.pass : g.fail)+'</span></div>'+
      '<div class="sw-stats"><div><b>'+Math.round(t.time - s.left)+'</b><span>'+esc(g.used)+'</span></div><div><b>×'+s.best+'</b><span>'+esc(g.streak)+'</span></div></div>'+
      (s.wrong.length ? '<p class="sw-lbl">'+esc(g.review)+'</p><ul class="sw-rev">'+s.wrong.map(i => '<li><b>'+esc(tx(t.cards[i].s))+'</b><span>'+esc(tx(t.cards[i].why))+'</span></li>').join('')+'</ul>'
        : '<p class="sw-lbl">'+esc(g.clean)+'</p>')+
      '<button type="button" class="sw-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 2 · spot the mistakes: hotel room 214, which fixes itself as you find things ---------- */
const SP = {
  ka:{q:'იპოვე {n} შეცდომა.', hint0:'შეეხე ყველაფერს, რაც სტუმრის მოსვლამდე უნდა გასწორდეს. არასწორი შეხება 3 წამი ჯდება.', hintB:'მინიშნება (−10 წმ)', scene:'სასტუმროს ოთახი, შეეხე შეცდომებს', done:'ოთახი 214 მზადაა', late:'დრო ამოიწურა', left:'დარჩა {n} წამი',
      lift:'სტუმარი უკვე ლიფტშია!', review:'„უნაკლო ოთახი. თავი შინ ვიგრძენი.“', guest:'სტუმარი, ოთახი 214'},
  en:{q:'Find {n} mistakes.', hint0:'Tap anything that must be fixed before the guest arrives. A wrong tap costs 3 seconds.', hintB:'Hint (−10 s)', scene:'A hotel room. Tap the mistakes.', done:'Room 214 is ready', late:'Time’s up', left:'{n} seconds to spare',
      lift:'The guest is already in the lift!', review:'“Spotless. It felt like home.”', guest:'Guest, room 214'}
};
/* where each mistake sits in the drawing (viewBox 300 × 330) */
const SPOTS = {frame:{x:75, y:62, r:30}, cup:{x:50, y:168, r:12}, towel:{x:165, y:278, r:22}, bin:{x:263, y:256, r:20}, slipper:{x:93, y:300, r:15}};
const ROOM_BASE = '<rect width="300" height="214" fill="#DCCFEA"/><rect y="214" width="300" height="116" fill="#C8996A"/>'+
  '<g stroke="#B3855A" stroke-width="1"><path d="M0 240H300M0 268H300M0 298H300"/><path d="M60 214V240M180 214V240M120 240V268M240 240V268M40 268V298M200 268V298M100 298V330M260 298V330"/></g>'+
  '<rect y="208" width="300" height="7" fill="#F4EFE8"/>'+
  '<rect x="196" y="30" width="80" height="92" fill="#F4EFE8"/><rect class="sp-sky" x="202" y="36" width="68" height="80" fill="#BFE0F2"/><path d="M202 100l18-16 14 10 16-18 20 20V116H202z" fill="#9CC8A9"/><path d="M236 36V116M202 76H270" stroke="#F4EFE8" stroke-width="4"/>'+
  '<rect x="184" y="20" width="104" height="5" rx="2" fill="#6F5590"/><path d="M188 24h14v104c-6 0-10-2-14-4z" fill="#A98BC9"/><path d="M284 24h-14v104c6 0 10-2 14-4z" fill="#A98BC9"/>'+
  '<circle cx="75" cy="34" r="2" fill="#6F5590"/><path d="M75 34 52 43M75 34l27 9" stroke="#6F5590" stroke-width="1"/>';
const ROOM_MID = '<rect x="76" y="118" width="160" height="56" rx="8" fill="#6F5590"/>'+
  '<rect x="90" y="140" width="62" height="24" rx="11" fill="#FFFFFF"/><rect x="160" y="140" width="62" height="24" rx="11" fill="#FFFFFF"/>'+
  '<rect x="66" y="160" width="180" height="58" rx="8" fill="#FFFFFF"/><path d="M66 182h180v34a8 8 0 0 1-8 8H74a8 8 0 0 1-8-8z" fill="#B9A3D9"/><rect x="66" y="180" width="180" height="6" fill="#F4EFE8"/>'+
  '<rect x="74" y="224" width="6" height="10" fill="#5A4476"/><rect x="232" y="224" width="6" height="10" fill="#5A4476"/>'+
  '<path d="M262 178h22l-3 32h-16z" fill="#D9744A"/><path d="M273 178c-10-10-8-24 0-30 8 6 10 20 0 30zM273 178c-14-2-22-12-20-20 10 0 18 8 20 20zM273 178c4-14 14-18 20-16 0 10-8 16-20 16z" fill="#5E9E6A"/>'+
  '<rect x="12" y="176" width="50" height="50" rx="3" fill="#B07D4F"/><rect x="16" y="196" width="42" height="2" fill="#8E6038"/><circle cx="37" cy="211" r="2" fill="#5A3A22"/>'+
  '<path d="M14 140h22l4 22H10z" fill="#F2E3C2"/><rect x="22" y="162" width="6" height="12" fill="#8E6038"/><rect x="16" y="172" width="18" height="4" rx="2" fill="#8E6038"/>'+
  '<ellipse cx="156" cy="262" rx="90" ry="22" fill="#E7D9C6"/>'+
  '<path d="M250 246h26l-3 32h-20z" fill="#8E8A9C"/><rect x="248" y="243" width="30" height="5" rx="2" fill="#6E6A7D"/>';
/* each mistake drawn messy, then fixed: the picture straightens, the cup is swapped, the towel folds onto the bed, the bin empties, the slippers pair up */
const SPART = {
  frame:[f => '<g class="sp-o sp-frame'+f+'"><rect x="45" y="40" width="60" height="44" fill="#F4EFE8" stroke="#6F5590" stroke-width="3"/><path d="M50 79l16-18 10 10 10-8 14 16z" fill="#7FB0C9"/><circle cx="88" cy="52" r="5" fill="#F2C14E"/></g>'],
  cup:['<g class="sp-o sp-cup"><path d="M44 162h12l-1.5 12h-9z" fill="#FFFFFF" stroke="#6F5590" stroke-width="1.2"/><path d="M56 165a3 3 0 0 1 0 6" fill="none" stroke="#6F5590" stroke-width="1.2"/><path d="M47 164.5h6" stroke="#8A5A3A" stroke-width="2"/></g>',
       '<g class="sp-o sp-new"><path d="M43 174h14l-2-12h-10z" fill="#E6F4FB" stroke="#6F5590" stroke-width="1.2"/><path d="M41 174.5h18" stroke="#6F5590" stroke-width="1.6" stroke-linecap="round"/></g>'],
  towel:['<g class="sp-o sp-towel"><path d="M146 272c8-8 24-10 34-4 8 5 4 14-6 16-10 3-26 2-30-4-2-3-1-6 2-8z" fill="#FFFFFF" stroke="#D6CCE3" stroke-width="1.5"/><path d="M156 276c6-3 14-3 18 0" stroke="#D6CCE3" fill="none"/></g>',
         '<g class="sp-o sp-new sp-fly"><rect x="190" y="190" width="40" height="12" rx="3" fill="#FFFFFF" stroke="#D6CCE3" stroke-width="1.5"/><rect x="194" y="186" width="32" height="7" rx="2.5" fill="#FFFFFF" stroke="#D6CCE3" stroke-width="1.5"/></g>'],
  bin:['<g class="sp-o sp-trash"><circle cx="258" cy="241" r="5" fill="#FFFFFF"/><circle cx="268" cy="239" r="6" fill="#F7F3EE"/><circle cx="263" cy="234" r="4" fill="#FFFFFF"/></g>',
       '<g class="sp-o sp-new"><path d="M252 248.5h22" stroke="#B9B5C6" stroke-width="2" stroke-linecap="round"/></g>'],
  slipper:['<g class="sp-o sp-slip"><path d="M80 300c0-6 6-10 14-10s12 4 12 8-4 8-12 8H86c-4 0-6-2-6-6z" fill="#FFFFFF" stroke="#C9B9E0" stroke-width="1.5"/><path d="M84 300c4-5 14-6 18-2" fill="none" stroke="#A98BC9" stroke-width="3"/></g>',
           '<g class="sp-o sp-new">'+[84, 106].map(x => '<g transform="translate('+x+' 240)"><path d="M0 8c0-5 4-8 9-8s8 3 8 7-3 7-8 7H5c-3 0-5-2-5-6z" fill="#FFFFFF" stroke="#C9B9E0" stroke-width="1.5"/><path d="M3 7c3-4 9-4 12-1" fill="none" stroke="#A98BC9" stroke-width="2.6"/></g>').join('')+'</g>']
};
function roomSVG(t, found, just){
  const fixed = id => found.some(i => t.spots[i].id === id), part = id => {
    const p = SPART[id], f = fixed(id), j = just === id ? ' just' : '';
    if (id === 'frame') return p[0](f ? ' fix'+j : '');
    if (!f) return p[0];
    return (j ? p[0].replace('class="sp-o', 'class="sp-o sp-out') : '')+p[1].replace('class="sp-o', 'class="sp-o'+j);
  };
  const spark = just ? (() => { const s = SPOTS[just], to = just === 'towel' ? {x:210, y:194} : just === 'slipper' ? {x:100, y:248} : s;
    return '<g transform="translate('+to.x+' '+to.y+')"><g class="sp-spark">'+[0, 60, 120, 180, 240, 300].map(a => '<path d="M0-9V-15" transform="rotate('+a+')"/>').join('')+'</g></g>'; })() : '';
  return ROOM_BASE+part('frame')+ROOM_MID+part('bin')+part('cup')+part('towel')+part('slipper')+spark;
}
class Spot extends Demo {
  init(){ return {found:[], left:this.t.time, run:false, done:false, last:-1, hint:-1, end:0, lift:false}; }
  act(a, b, e){
    const s = this.s, t = this.t;
    if (a === 'again') return this.reset();
    if (s.done) return;
    if (a === 'spot'){
      const i = +b.dataset.i; this.go();
      if (s.found.includes(i)) return;
      s.found.push(i); s.last = i; if (s.hint === i) s.hint = -1;
      this.render(true); this.good(); this.step(2);
      if (s.found.length === t.spots.length) this.later(() => this.finish(), reduced() ? 300 : 1100);
    } else if (a === 'miss'){
      this.go(); this.penalty(3); sfx('bad'); buzz(30);
      const svg = this.q('.sp-scene svg'); if (!svg || !e || e.clientX == null) return;
      const p = this.svgPt(e, svg, 300, 330);
      svg.insertAdjacentHTML('beforeend', '<g class="sp-x" transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')"><path d="M-6-6 6 6M6-6-6 6"/><text y="-11">−3</text></g>');
      const x = svg.lastElementChild; setTimeout(() => x && x.remove(), 900);
    } else if (a === 'hint'){
      const i = t.spots.findIndex((sp, k) => !s.found.includes(k)); if (i < 0) return;
      this.go(); this.penalty(10); s.hint = i; this.render();
    }
  }
  penalty(n){ const s = this.s; if (s.run){ s.end -= n * 1000; s.left = Math.max(0, (s.end - Date.now()) / 1000); } else s.left = Math.max(0, s.left - n); this.hud(); }
  go(){
    const s = this.s; if (s.run) return; s.run = true; s.end = Date.now() + s.left * 1000; this.step(1);
    this.iv = setInterval(() => { s.left = Math.max(0, (s.end - Date.now()) / 1000); this.hud(); if (!s.left) this.finish(); }, 200);
  }
  hud(){
    const s = this.s, r = this.q('.sp-ring .v'), n = this.q('.sp-sec'), sc = this.q('.sp-scene');
    if (r) r.style.strokeDashoffset = ((1 - s.left / this.t.time) * 100.5).toFixed(2); if (n) n.textContent = Math.ceil(s.left);
    /* the pressure builds: under 15 seconds the light drops; at 10 the lift dings */
    if (sc) sc.classList.toggle('late', s.left <= 15);
    const ring = this.q('.sp-ring'); if (ring) ring.classList.toggle('late', s.left <= 15);
    if (!s.lift && s.left <= 10 && s.left > 0){ s.lift = true; sfx('ding'); const fb = this.q('.sp-fb'); if (fb){ fb.classList.add('lift'); fb.textContent = SP[lang].lift; } }
  }
  finish(){
    const s = this.s, t = this.t; if (s.done) return; s.done = true; this.clear(); this.render();
    const all = s.found.length === t.spots.length, stars = this.stars();
    for (let k = 0; k < stars; k++) this.later(() => { sfx('pop'); buzz(10); }, reduced() ? 0 : 900 + k * 220);
    if (all) this.later(() => { sfx('win'); this.burst(40); }, reduced() ? 0 : 1600);
    this.won();
  }
  stars(){ const s = this.s, all = s.found.length === this.t.spots.length; return all ? (s.left > 20 ? 3 : 2) : (s.found.length >= 3 ? 1 : 0); }
  render(fresh){
    const t = this.t, s = this.s, g = SP[lang];
    if (s.done) return this.paint(this.result());
    const P = sp => SPOTS[sp.id], just = fresh && s.last >= 0 ? t.spots[s.last].id : null;
    const marks = s.found.map((i, n) => { const p = P(t.spots[i]); return '<g class="sp-mark" transform="translate('+p.x+' '+p.y+')"><ellipse rx="'+(p.r + 5)+'" ry="'+(p.r + 1)+'" transform="rotate(-12)"/><text y="'+(-p.r - 7)+'">'+(n + 1)+'</text></g>'; }).join('');
    const hint = s.hint >= 0 ? '<circle class="sp-hint" cx="'+P(t.spots[s.hint]).x+'" cy="'+P(t.spots[s.hint]).y+'" r="'+(P(t.spots[s.hint]).r + 10)+'"/>' : '';
    const hits = t.spots.map((sp, i) => s.found.includes(i) ? '' : '<circle class="sp-hit" data-act="spot" data-i="'+i+'" cx="'+P(sp).x+'" cy="'+P(sp).y+'" r="'+(P(sp).r + 8)+'"/>').join('');
    const last = s.last >= 0 ? t.spots[s.last] : null, late = s.left <= 15 ? ' late' : '';
    this.paint('<div class="dm-in sp-in"><div class="sp-top"><div><b>'+esc(tx(t.brand))+'</b><span>'+esc(tx(t.name))+'</span></div>'+
      '<div class="sp-ring'+late+'"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16"/><circle class="v" cx="18" cy="18" r="16" pathLength="100.5" style="stroke-dashoffset:'+((1 - s.left / t.time) * 100.5).toFixed(2)+'"/></svg><span class="sp-sec">'+Math.ceil(s.left)+'</span></div></div>'+
      '<p class="sp-q">'+esc(fill(g.q, {n:t.spots.length}))+'<b>'+s.found.length+' / '+t.spots.length+'</b></p>'+
      '<div class="sp-scene'+late+'"><svg viewBox="0 0 300 330" role="img" aria-label="'+esc(g.scene)+'"><g pointer-events="none">'+roomSVG(t, s.found, just)+'</g>'+
      '<rect class="sp-miss" data-act="miss" width="300" height="330"/>'+hits+'<g pointer-events="none">'+hint+marks+'</g></svg></div>'+
      '<div class="sp-fb'+(s.lift && !last ? ' lift' : '')+'" aria-live="polite">'+(last ? '<b>'+esc(tx(last.n))+'.</b> '+esc(tx(last.why)) : esc(s.lift ? g.lift : g.hint0))+'</div>'+
      '<div class="sp-row"><button type="button" class="sp-hintb" data-act="hint">'+ic('bulb')+esc(g.hintB)+'</button></div></div>');
  }
  result(){
    const t = this.t, s = this.s, g = SP[lang], all = s.found.length === t.spots.length, stars = this.stars();
    return '<div class="dm-in sp-in sp-res"><div class="sp-after'+(all ? ' warm' : '')+'"><svg viewBox="0 0 300 330" aria-hidden="true">'+roomSVG(t, s.found, null)+'</svg>'+
        (all ? '<div class="sp-review"><span class="sp-rs">'+'<i>★</i>'.repeat(5)+'</span><p>'+esc(g.review)+'</p><small>'+esc(g.guest)+'</small></div>' : '')+'</div>'+
      '<p class="sp-kick">'+esc(tx(t.brand))+'</p><h2>'+esc(all ? g.done : g.late)+'</h2>'+
      '<div class="sp-stars">'+[0, 1, 2].map(k => '<span class="'+(k < stars ? 'on' : '')+'" style="--k:'+k+'">'+ic('star')+'</span>').join('')+'</div>'+
      (all ? '<p class="sp-left">'+esc(fill(g.left, {n:Math.floor(s.left)}))+'</p>' : '')+
      '<ul class="sp-list">'+t.spots.map((sp, i) => { const f = s.found.includes(i); return '<li class="'+(f ? 'ok' : 'miss')+'"><span>'+ic(f ? 'check' : 'close')+'</span><div><b>'+esc(tx(sp.n))+'</b><small>'+esc(tx(sp.why))+'</small></div></li>'; }).join('')+'</ul>'+
      '<button type="button" class="sp-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 3 · build the order: Menu Academy. The roll assembles on the mat, rolls, and is sliced onto the plate ---------- */
const BD = {
  ka:{how:'გადაიტანე ინგრედიენტები ხალიჩაზე ან შეეხე მათ. ამოსაღებად შეეხე ჩიპს.', drop:'ინგრედიენტები აქ', rm:'ამოღება:', clear:'გასუფთავება', serve:'მიტანა', okT:'სწორია. შემდეგი შეკვეთა.', miss:'აკლია:', extra:'ზედმეტია:', cert:'მენიუს აკადემია · დონე 1', first:'შეკვეთა პირველივე ცდით',
      back:'{t}: თეფში უკან დაბრუნდა.', allergy:'{t}: სტუმარს ალერგია აქვს!', up:'შეკვეთა მზადაა!'},
  en:{how:'Drag ingredients onto the mat, or tap them. Tap a chip to take it off.', drop:'Ingredients go here', rm:'Remove:', clear:'Clear', serve:'Serve', okT:'Correct. Next order.', miss:'Missing:', extra:'Shouldn’t be there:', cert:'Menu Academy · Level 1', first:'orders right first time',
      back:'{t}: the plate came back.', allergy:'{t}: the guest has an allergy!', up:'Order up!'}
};
class Build extends Demo {
  init(){ return {o:0, plate:[], tries:0, firstOk:0, fb:null, busy:false, done:false, phase:'', just:'', fresh:true}; }
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
  add(id){ const s = this.s; if (s.done || s.busy || s.plate.includes(id)) return; s.plate.push(id); s.just = id; s.fb = null; sfx('pop'); buzz(8); this.render(); this.step(1); }
  act(a, b, e){
    const s = this.s, t = this.t;
    if (a === 'again') return this.reset();
    if (s.busy || s.done) return;
    if (a === 'ing'){ if (e && e.detail === 0) this.add(b.dataset.ing); return; }
    if (a === 'rm'){ s.plate = s.plate.filter(x => x !== b.dataset.id); s.fb = null; sfx('tap'); this.render(); return; }
    if (a === 'clear'){ s.plate = []; s.fb = null; this.render(); return; }
    if (a === 'serve'){
      const o = t.orders[s.o], need = o.need, miss = need.filter(x => !s.plate.includes(x)), extra = s.plate.filter(x => !need.includes(x));
      s.tries++; this.step(2);
      if (!miss.length && !extra.length){
        if (s.tries === 1) s.firstOk++;
        const slow = reduced() ? 0 : 1;
        /* roll it, slice it, plate it, ring the bell */
        s.busy = true; s.phase = 'roll'; this.render(); sfx('whoosh');
        this.later(() => { s.phase = 'plate'; s.fb = {ok:true}; this.render(); sfx('ding'); buzz(15); this.burst(14); }, 750 * slow);
        this.later(() => {
          s.busy = false; s.phase = ''; s.o++; s.plate = []; s.tries = 0; s.fb = null; s.fresh = true;
          if (s.o >= t.orders.length){ s.done = true; this.render(); this.thud(520); this.later(() => { sfx('win'); this.burst(24); }, reduced() ? 0 : 1000); this.won(); }
          else { this.render(); sfx('print'); }
        }, 2300 * slow);
      } else {
        s.fb = {ok:false, miss, extra, allergy:!!(o.allergy && extra.includes(o.allergy))}; this.render(); this.bad();
        const m = this.q('.bd-mat'); if (m){ m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }
      }
    }
  }
  /* the sheet on the bamboo mat: nori, then rice spread to the edges, fillings laid in a line, sesame on top */
  sheet(){
    const t = this.t, s = this.s, has = id => s.plate.includes(id), J = id => s.just === id ? ' just' : '';
    const fills = s.plate.filter(id => !['nori', 'rice', 'sesame'].includes(id));
    const col = id => t.ings.find(x => x.id === id).col;
    return '<div class="bd-sheet'+(s.phase === 'roll' ? ' roll' : '')+'">'+
      (has('nori') ? '<i class="ly nori'+J('nori')+'"></i>' : '')+(has('rice') ? '<i class="ly rice'+J('rice')+'"></i>' : '')+
      '<span class="ly fills">'+fills.map((id, k) => '<i class="fl'+J(id)+'" style="--c:'+col(id)+';--k:'+k+'"></i>').join('')+'</span>'+
      (has('sesame') ? '<i class="ly sesame'+J('sesame')+'"></i>' : '')+'</div>';
  }
  dish(){
    const t = this.t, o = t.orders[this.s.o], col = id => t.ings.find(x => x.id === id).col;
    const f = o.need.filter(id => !['nori', 'rice', 'sesame'].includes(id)).map(col), sesame = o.need.includes('sesame');
    const pos = [[50, 34], [34, 58], [66, 58], [50, 66], [38, 40], [62, 40]];
    const core = f.map((c, k) => 'radial-gradient(circle at '+pos[k][0]+'% '+pos[k][1]+'%,'+c+' 0 13%,transparent 14%)').join(',');
    const bg = (core ? core+',' : '')+(sesame ? 'radial-gradient(circle at 30% 30%,#E8D9B0 0 4%,transparent 5%),radial-gradient(circle at 70% 26%,#E8D9B0 0 4%,transparent 5%),' : '')+'radial-gradient(circle,#FBF8F0 0 66%,#1F3B2C 67%)';
    return '<div class="bd-dish"><div class="bd-plate-w">'+Array.from({length:8}, (_, k) => '<i style="--k:'+k+';background:'+bg+'"></i>').join('')+'</div><b>'+esc(BD[lang].up)+'</b></div>';
  }
  render(){
    const t = this.t, s = this.s, g = BD[lang];
    if (s.done) return this.paint(this.result());
    const o = t.orders[s.o], ING = id => t.ings.find(x => x.id === id), nm = id => esc(tx(ING(id).n));
    const plate = s.plate.map(id => '<button type="button" class="bd-chip" data-act="rm" data-id="'+id+'" style="--c:'+ING(id).col+'" aria-label="'+esc(g.rm)+' '+nm(id)+'"><i></i>'+nm(id)+'</button>').join('');
    const who = tx(o.t);
    const fb = !s.fb ? '<div class="bd-fb">'+esc(g.how)+'</div>' : s.fb.ok ? '<div class="bd-fb ok"><span class="bd-hanko">OK</span>'+esc(g.okT)+'</div>' :
      '<div class="bd-fb bad" aria-live="polite"><b class="bd-guest">'+esc(fill(s.fb.allergy ? g.allergy : g.back, {t:who}))+'</b>'+(s.fb.miss.length ? '<span><b>'+esc(g.miss)+'</b> '+s.fb.miss.map(nm).join(', ')+'</span>' : '')+(s.fb.extra.length ? '<span><b>'+esc(g.extra)+'</b> '+s.fb.extra.map(nm).join(', ')+'</span>' : '')+'</div>';
    const tray = t.ings.map(x => '<button type="button" class="bd-ing'+(s.plate.includes(x.id) ? ' used' : '')+'" data-act="ing" data-ing="'+x.id+'"><span class="bd-bowl" style="--c:'+x.col+'"></span><span>'+esc(tx(x.n))+'</span></button>').join('');
    const mat = s.phase === 'plate' ? this.dish() : this.sheet()+(s.plate.length ? '' : '<span class="bd-empty">'+esc(g.drop)+'</span>');
    this.paint('<div class="dm-in bd-in"><div class="bd-top"><b>'+esc(tx(t.brand))+'</b><span>'+esc(tx(t.name))+'</span></div>'+
      '<div class="bd-rail"><div class="bd-tk'+(s.fresh ? ' print' : '')+'"><div class="bd-tk-h"><span>'+esc(who)+'</span><span>'+(s.o + 1)+' / '+t.orders.length+'</span></div><b>'+esc(tx(o.d))+'</b>'+(o.note ? '<em>'+esc(tx(o.note))+'</em>' : '')+'</div></div>'+
      '<div class="bd-mat'+(s.phase === 'plate' ? ' plated' : '')+'">'+mat+'</div><div class="bd-plate">'+(s.phase ? '' : plate)+'</div>'+fb+
      '<div class="bd-tray">'+tray+'</div><div class="bd-row"><button type="button" class="bd-clear" data-act="clear">'+esc(g.clear)+'</button>'+
      '<button type="button" class="bd-serve" data-act="serve"'+(s.plate.length && !s.busy ? '' : ' disabled')+'>'+esc(g.serve)+'</button></div></div>');
    s.just = ''; s.fresh = false;
  }
  result(){
    const t = this.t, s = this.s, g = BD[lang];
    return '<div class="dm-in bd-in bd-res"><div class="bd-cert"><span class="bd-cert-k">'+esc(tx(t.brand))+'</span><b>'+esc(g.cert)+'</b><span class="bd-big">'+s.firstOk+'<small>/'+t.orders.length+'</small></span><span class="bd-sub">'+esc(g.first)+'</span><span class="bd-hanko big"><span>合格</span></span></div>'+
      '<ul class="bd-rules">'+t.orders.map(o => '<li><b>'+esc(tx(o.d))+'</b>'+(o.note ? ' · '+esc(tx(o.note)) : '')+'<small>'+o.need.map(id => esc(tx(t.ings.find(x => x.id === id).n))).join(' + ')+'</small></li>').join('')+'</ul>'+
      '<button type="button" class="bd-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 4 · who do you ask? Draw a line from each first-day problem to the person who helps; they answer ---------- */
const LK = {
  ka:{how:'გაავლე ხაზი პრობლემიდან იმ ადამიანამდე, ვინც დაგეხმარება. ან შეეხე ჯერ პრობლემას, მერე ადამიანს.', wrong:'{p} ამაში ვერ დაგეხმარება. სცადე სხვა.', people:'შენი ხალხი', first:'პირველივე ცდით: {n} / {m}',
      save:'კონტაქტების შენახვა', saved:'კონტაქტებში შენახულია', board:'პრობლემები და ადამიანები', ask:'ვის ჰკითხავ?'},
  en:{how:'Draw a line from each problem to the person who can help. Or tap one, then the other.', wrong:'{p} can’t help with that one. Try someone else.', people:'Your people', first:'Right first time: {n} of {m}',
      save:'Save contacts', saved:'Saved to contacts', board:'Problems and people', ask:'Who do you ask?'}
};
class Link extends Demo {
  init(){ const n = this.t.pairs.length; return {got:[], sel:-1, tries:Array(n).fill(0), bad:null, done:false, just:-1, say:-1, right:shuffle([...Array(n).keys()]), saved:false, all:false}; }
  bind(){
    let d = null;
    const board = () => this.q('.lk-board');
    const pt = e => { const r = board().getBoundingClientRect(); return {x:e.clientX - r.left, y:e.clientY - r.top}; };
    this.el.addEventListener('pointerdown', e => {
      const q = e.target.closest('.lk-q'); if (!q || this.s.done || q.classList.contains('got')) return;
      d = {q:+q.dataset.q, pid:e.pointerId, x:e.clientX, y:e.clientY, moved:false};
      try { q.setPointerCapture(e.pointerId); } catch (err) {}
    });
    this.el.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.pid) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
      d.moved = true;
      const svg = this.q('.lk-lines'), a = this.dot('.lk-q[data-q="'+d.q+'"] .dot'), b = pt(e); if (!svg || !a) return;
      let l = svg.querySelector('.drag'); if (!l){ svg.insertAdjacentHTML('beforeend', '<path class="drag"/>'); l = svg.lastElementChild; }
      l.setAttribute('d', this.curve(a, b));
      this.el.querySelectorAll('.lk-p.hover').forEach(x => x.classList.remove('hover'));
      const over = document.elementFromPoint(e.clientX, e.clientY), p = over && over.closest && over.closest('.lk-p'); if (p) p.classList.add('hover');
    });
    const end = e => {
      if (!d || e.pointerId !== d.pid) return;
      const x = d; d = null; const l = this.q('.lk-lines .drag'); if (l) l.remove();
      if (!x.moved || e.type === 'pointercancel') return;
      this.skip = Date.now();
      const over = document.elementFromPoint(e.clientX, e.clientY), p = over && over.closest && over.closest('.lk-p');
      if (p) this.connect(x.q, +p.dataset.p); else this.render();
    };
    this.el.addEventListener('pointerup', end); this.el.addEventListener('pointercancel', end);
    window.addEventListener('resize', () => { if (this.el.isConnected && !this.s.done) this.lines(); });
  }
  dot(sel){ const b = this.q('.lk-board'), el = this.q(sel); if (!b || !el) return null; const r = b.getBoundingClientRect(), o = el.getBoundingClientRect(); return {x:o.left + o.width / 2 - r.left, y:o.top + o.height / 2 - r.top}; }
  curve(a, b){ const m = (a.x + b.x) / 2; return 'M'+a.x.toFixed(1)+' '+a.y.toFixed(1)+'C'+m.toFixed(1)+' '+a.y.toFixed(1)+' '+m.toFixed(1)+' '+b.y.toFixed(1)+' '+b.x.toFixed(1)+' '+b.y.toFixed(1); }
  act(a, b){
    const s = this.s;
    if (a === 'again') return this.reset();
    if (a === 'save'){ if (s.saved) return; s.saved = true; sfx('ding'); buzz([10, 40, 10]); b.setAttribute('aria-pressed', 'true'); b.innerHTML = ic('check')+esc(LK[lang].saved); return; }
    if (s.done || (this.skip && Date.now() - this.skip < 400)) return;
    if (a === 'q'){ const q = +b.dataset.q; if (s.got.includes(q)) return; s.sel = s.sel === q ? -1 : q; sfx('tap'); this.render(); }
    else if (a === 'p'){ if (s.sel < 0){ sfx('tap'); return; } this.connect(s.sel, +b.dataset.p); }
  }
  connect(q, p){
    const s = this.s, t = this.t; if (s.got.includes(q)) return;
    this.step(1); s.sel = -1;
    if (q === p){
      s.got.push(q); s.just = q; s.say = p; s.bad = null; this.good(); this.render(); this.step(2);
      if (s.got.length === t.pairs.length){
        s.all = true; this.later(() => { const bd = this.q('.lk-board'); if (bd) bd.classList.add('all'); sfx('win'); }, reduced() ? 0 : 900);
        this.later(() => this.finish(), reduced() ? 300 : 2300);
      }
    } else {
      s.tries[q]++; s.bad = {q, p}; s.say = -1; this.bad(); this.render();
      this.later(() => { if (s.bad && s.bad.q === q){ s.bad = null; this.lines(); } }, 700);
    }
  }
  finish(){ const s = this.s; if (s.done) return; s.done = true; this.render(); this.thud(500); this.later(() => this.burst(36), reduced() ? 0 : 700); this.won(); }
  lines(){
    const s = this.s, svg = this.q('.lk-lines'); if (!svg) return;
    let h = '';
    s.got.forEach((q, k) => { const a = this.dot('.lk-q[data-q="'+q+'"] .dot'), b = this.dot('.lk-p[data-p="'+q+'"] .dot'); if (a && b) h += '<path class="ok'+(s.just === q ? ' just' : '')+'" pathLength="1" style="--k:'+k+'" d="'+this.curve(a, b)+'"/>'; });
    if (s.bad){ const a = this.dot('.lk-q[data-q="'+s.bad.q+'"] .dot'), b = this.dot('.lk-p[data-p="'+s.bad.p+'"] .dot'); if (a && b) h += '<path class="no" d="'+this.curve(a, b)+'"/>'; }
    svg.innerHTML = h;
  }
  render(){
    const t = this.t, s = this.s, g = LK[lang], P = t.pairs;
    if (s.done) return this.paint(this.result());
    const qs = P.map((x, i) => '<button type="button" class="lk-q'+(s.got.includes(i) ? ' got' : '')+(s.sel === i ? ' sel' : '')+(s.bad && s.bad.q === i ? ' no' : '')+'" data-act="q" data-q="'+i+'" aria-pressed="'+(s.sel === i)+'">'+
      '<span class="ic">'+ic(x.ic)+'</span><span class="tx">'+esc(tx(x.q))+'</span><i class="dot"></i></button>').join('');
    const ps = s.right.map(i => { const w = P[i].who;
      return '<button type="button" class="lk-p'+(s.got.includes(i) ? ' got' : '')+(s.just === i ? ' just' : '')+(s.bad && s.bad.p === i ? ' no' : '')+'" data-act="p" data-p="'+i+'"><i class="dot"></i>'+face(w)+'<span><b>'+esc(tx(w.n))+'</b><small>'+esc(tx(w.r))+'</small></span>'+
        (s.say === i ? '<span class="lk-say">'+esc(tx(P[i].reply))+'</span>' : '')+'</button>'; }).join('');
    const fb = s.bad ? '<p class="lk-fb bad" aria-live="polite">'+esc(fill(g.wrong, {p:tx(P[s.bad.p].who.n)}))+'</p>' : '<p class="lk-fb" aria-live="polite">'+esc(g.how)+'</p>';
    this.paint('<div class="dm-in lk-in"><div class="lk-top"><b>'+esc(tx(t.co))+'</b><span>'+s.got.length+' / '+P.length+'</span></div><h2 class="lk-h">'+esc(g.ask)+'</h2>'+
      '<div class="lk-board'+(s.all ? ' all' : '')+'" role="group" aria-label="'+esc(g.board)+'"><svg class="lk-lines" aria-hidden="true"></svg><div class="lk-col">'+qs+'</div><div class="lk-col r">'+ps+'</div></div>'+fb+'</div>');
    this.lines(); s.just = -1;
  }
  result(){
    const t = this.t, s = this.s, g = LK[lang], first = s.tries.filter(n => !n).length;
    return '<div class="dm-in lk-in lk-res"><div class="lk-card"><div class="lk-band"><span>'+esc(tx(t.co))+'</span><span class="lk-stamp">✓</span></div><h3>'+esc(g.people)+'</h3>'+
      '<ul>'+t.pairs.map((x, k) => '<li style="--k:'+k+'">'+face(x.who)+'<span><b>'+esc(tx(x.who.n))+' · '+esc(tx(x.who.r))+'</b><small>'+esc(tx(x.q))+'</small></span><em>'+esc(x.who.ch)+'</em></li>').join('')+'</ul>'+
      '<p class="lk-first">'+esc(fill(g.first, {n:first, m:t.pairs.length}))+'</p></div>'+
      '<button type="button" class="lk-save" data-act="save"'+(s.saved ? ' aria-pressed="true"' : '')+'>'+ic(s.saved ? 'check' : 'user')+esc(s.saved ? g.saved : g.save)+'</button>'+
      '<button type="button" class="lk-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 5 · first shift: tap the day into order; the sky moves from morning to evening as it fills ---------- */
const OD = {
  ka:{how:'შეეხე იმას, რაც ახლა უნდა მოხდეს.', not:'ჯერ არა. რა ხდება მანამდე?', next:'შემდეგი', plan:'შენი პირველი ცვლა', done:'ცვლა დაგეგმილია', miss:'არასწორი შეხება: {n}', miss1:'არასწორი შეხება: 1', clean:'უშეცდომოდ!', ready:'მზადაა', sky:'დღე მაღაზიაში'},
  en:{how:'Tap what happens next.', not:'Not yet. What comes before that?', next:'Next', plan:'Your first shift', done:'Your shift is planned', miss:'{n} wrong taps', miss1:'1 wrong tap', clean:'Not a single wrong tap!', ready:'READY', sky:'A day at the store'}
};
const SKYC = [[0, [255, 214, 170]], [.35, [150, 205, 240]], [.7, [140, 195, 235]], [.9, [246, 166, 92]], [1, [44, 48, 108]]];
function skyAt(p){
  for (let i = 1; i < SKYC.length; i++) if (p <= SKYC[i][0]){ const [p0, a] = SKYC[i - 1], [p1, b] = SKYC[i], k = (p - p0) / (p1 - p0 || 1); return 'rgb('+a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(',')+')'; }
  return 'rgb(44,48,108)';
}
class Order extends Demo {
  init(){ return {pool:shuffle(this.t.events.map((e, i) => i)), placed:0, miss:0, bad:-1, done:false, p0:0}; }
  act(a, b){
    const s = this.s, n = this.t.events.length;
    if (a === 'again') return this.reset();
    if (a !== 'pick' || s.done || s.placed === n) return;
    const i = +b.dataset.i; if (i < s.placed) return;
    this.step(1);
    if (i === s.placed){
      s.p0 = s.placed / n; s.placed++; s.bad = -1; this.good(); this.render(); if (s.placed >= 3) this.step(2);
      if (s.placed === n){ this.later(() => { s.done = true; sfx('ding'); this.render(); this.thud(600); this.later(() => { sfx('win'); this.burst(36); }, reduced() ? 0 : 900); this.won(); }, reduced() ? 300 : 1300); }
    } else { s.miss++; s.bad = i; this.bad(); this.render(); }
  }
  sky(p, p0, end){
    /* the sun rises and crosses as the shift fills up; at the end the street lamps and shop windows light up */
    const sun = q => [30 + q * 240, 100 - Math.sin(q * Math.PI) * 72];
    const [x, y] = sun(Math.min(p, .96)), [x0, y0] = sun(Math.min(p0, .96));
    return '<svg class="od-sky'+(end ? ' night' : '')+'" viewBox="0 0 300 130" role="img" aria-label="'+esc(OD[lang].sky)+'"><rect class="bg" width="300" height="130" style="fill:'+skyAt(p)+';--from:'+skyAt(p0)+'"/>'+
      (end ? '<g class="stars">'+[[40,20],[90,34],[150,14],[210,28],[262,18],[120,46]].map(([a, c]) => '<circle cx="'+a+'" cy="'+c+'" r="1.3"/>').join('')+'</g><circle class="moon" cx="240" cy="32" r="11"/>' :
        '<circle class="sun" r="13" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" style="--dx:'+(x0 - x).toFixed(1)+'px;--dy:'+(y0 - y).toFixed(1)+'px"/>')+
      '<path class="hill" d="M0 112c50-12 90-10 150-2s110 4 150-6v26H0z"/>'+
      '<g class="shop"><rect x="92" y="62" width="116" height="56" rx="3"/><rect class="sign" x="112" y="54" width="76" height="16" rx="3"/><text x="150" y="65.5">'+esc(tx(this.t.co))+'</text>'+
      [104, 140, 176].map(a => '<rect class="win" x="'+a+'" y="80" width="22" height="20" rx="2"/>').join('')+'<rect class="door" x="143" y="102" width="14" height="16"/></g></svg>';
  }
  render(){
    const t = this.t, s = this.s, g = OD[lang], E = t.events, n = E.length, end = s.placed === n;
    if (s.done) return this.paint(this.result());
    const clock = s.placed ? E[s.placed - 1].time : E[0].time.replace(/\d\d$/, m => String(Math.max(0, +m - 15)).padStart(2, '0'));
    const slots = E.map((e, i) => i < s.placed ? '<li class="on'+(i === s.placed - 1 ? ' just' : '')+'"><time>'+esc(e.time)+'</time><span>'+ic(e.ic)+esc(tx(e.n))+'</span></li>' :
      '<li class="'+(i === s.placed ? 'next' : '')+'"><time>··:··</time><span>'+(i === s.placed ? esc(g.next)+'…' : '')+'</span></li>').join('');
    const pool = s.pool.filter(i => i >= s.placed).map(i => '<button type="button" class="od-ev'+(s.bad === i ? ' no' : '')+'" data-act="pick" data-i="'+i+'">'+ic(E[i].ic)+'<span>'+esc(tx(E[i].n))+'</span></button>').join('');
    this.paint('<div class="dm-in od-in"><div class="od-top"><b>'+esc(tx(t.co))+'</b><span>'+esc(tx(t.to))+' · '+esc(tx(t.role))+'</span></div>'+
      '<div class="od-skyw">'+this.sky(s.placed / n, s.p0, end)+'<span class="od-clock">'+esc(clock)+'</span></div>'+
      '<ol class="od-line">'+slots+'</ol>'+
      (end ? '' : '<p class="od-fb'+(s.bad >= 0 ? ' bad' : '')+'" aria-live="polite">'+esc(s.bad >= 0 ? g.not : g.how)+'</p><div class="od-pool">'+pool+'</div>')+'</div>');
  }
  result(){
    const t = this.t, s = this.s, g = OD[lang];
    return '<div class="dm-in od-in od-res"><div class="od-skyw">'+this.sky(1, 1, true)+'</div><div class="od-card"><div class="od-band">'+esc(tx(t.co))+'</div>'+
      '<div class="od-who">'+face(t.me)+'<span><b>'+esc(tx(t.to))+'</b><small>'+esc(tx(t.role))+' · '+esc(g.plan)+'</small></span><span class="od-stamp">'+esc(g.ready)+'</span></div>'+
      '<ol>'+t.events.map(e => '<li><time>'+esc(e.time)+'</time><span>'+esc(tx(e.n))+'</span></li>').join('')+'</ol>'+
      '<p class="od-miss">'+esc(s.miss === 1 ? g.miss1 : s.miss ? fill(g.miss, {n:s.miss}) : g.clean)+'</p></div>'+
      '<button type="button" class="od-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button></div>';
  }
}

/* ---------- 6 · pour it right: hold to pour, let go on the line; the latte art and the prize depend on your pour ---------- */
const PR = {
  ka:{hold:'დააჭირე და ასხი', how1:'დააჭირე და არ აუშვა. ხელი აუშვი, როცა ესპრესო ზოლს მიაღწევს.', how2:'ახლა რძე: ხელი აუშვი, როცა ზოლში მოხვდება.', r1:'ესპრესო', r2:'რძე', round:'{n} / 2',
      perfect:'ზუსტად!', short:'ცოტა აკლია.', long:'ცოტა მეტია.', over:'გადმოიღვარა!', heart:'იდეალური გული.', blob:'…ეს აბსტრაქტული ხელოვნებაა.', score:'ზუსტი ჩასხმა: {n} / 2', cpn:'კუპონი', show:'აჩვენე სალაროსთან.', valid:'მოქმედებს {d}-მდე', glass:'ჭიქა და ზოლი'},
  en:{hold:'Hold to pour', how1:'Press and hold. Let go when the espresso reaches the band.', how2:'Now the milk: let go inside the band.', r1:'Espresso', r2:'Milk', round:'{n} of 2',
      perfect:'Spot on!', short:'A little short.', long:'A touch too much.', over:'Overflow!', heart:'A perfect heart.', blob:'…let’s call it abstract art.', score:'Perfect pours: {n} of 2', cpn:'COUPON', show:'Show this at the till.', valid:'Valid until {d}', glass:'The glass and the target band'}
};
SFX.pour = c => hiss(c, {d:.13, v:.035, lp:1300});
const LV = v => 250 - 118 * v;
class Pour extends Demo {
  init(){ if (this.raf) cancelAnimationFrame(this.raf); return {r:0, e:0, m:0, holding:false, phase:'pour', res:[], wait:false, msg:'', code:'TSK-'+Math.floor(1000 + Math.random() * 8999)}; }
  bind(){
    const down = e => { const b = e.target.closest('.pr-hold'); if (!b) return; e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (err) {} this.start(); };
    const up = () => this.stop();
    this.el.addEventListener('pointerdown', down);
    this.el.addEventListener('pointerup', up); this.el.addEventListener('pointercancel', up);
    this.el.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && e.target.closest && e.target.closest('.pr-hold')){ e.preventDefault(); if (!e.repeat) this.start(); } });
    this.el.addEventListener('keyup', e => { if ((e.key === ' ' || e.key === 'Enter') && e.target.closest && e.target.closest('.pr-hold')){ e.preventDefault(); this.stop(); } });
  }
  act(a){ if (a === 'again') this.reset(); }
  total(){ return this.s.e + this.s.m; }
  start(){
    const s = this.s; if (s.holding || s.wait || s.phase !== 'pour') return;
    s.holding = true; s.msg = ''; this.step(s.r === 0 ? 1 : 2); audio();
    const dm = this.q('.dm'); if (dm) dm.classList.add('pouring');
    const fb = this.q('.pr-fb'); if (fb){ fb.className = 'pr-fb'; fb.textContent = tx(this.t.rounds[s.r].n)+'…'; }
    let last = performance.now(), t0 = last, tick = 0;
    const rate = s.r === 0 ? .2 : .26;
    const frame = now => {
      if (!s.holding) return;
      const dt = Math.min(.05, (now - last) / 1000), el = (now - t0) / 1000; last = now;
      const add = rate * dt * (1 + .4 * el);
      if (s.r === 0) s.e += add; else s.m += add;
      if (now - tick > 120){ tick = now; sfx('pour'); }
      this.paintLevel();
      if (this.total() >= 1.1) return this.stop();
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }
  stop(){
    const s = this.s; if (!s.holding) return;
    s.holding = false; cancelAnimationFrame(this.raf);
    const dm = this.q('.dm'); if (dm) dm.classList.remove('pouring');
    const R = this.t.rounds[s.r], v = this.total(), ok = v >= R.lo && v <= R.hi, over = v > 1;
    s.res.push(ok); s.msg = ok ? 'perfect' : over ? 'over' : v < R.lo ? 'short' : 'long';
    if (ok) this.good(); else this.bad();
    if (over && s.r === 1) s.m = Math.max(0, 1.02 - s.e);
    s.wait = true; this.render();
    if (s.r === 0) this.later(() => { s.r = 1; s.wait = false; s.msg = ''; this.render(); }, reduced() ? 300 : 1200);
    else this.later(() => { s.phase = 'art'; this.render(); this.later(() => { if (s.res.every(Boolean)){ sfx('win'); this.burst(24); } else sfx('pop'); }, reduced() ? 0 : 900);
      this.later(() => { s.phase = 'prize'; this.render(); sfx('print'); this.thud(1300); this.later(() => this.burst(30), reduced() ? 0 : 1500); this.won(); }, reduced() ? 600 : 3200); }, reduced() ? 300 : 1300);
  }
  /* during a pour only the liquid moves; nothing else repaints */
  paintLevel(){
    const s = this.s, q = n => this.q(n), e = Math.min(s.e, 1.1), tot = Math.min(this.total(), 1.1);
    const E = q('.lq-e'), M = q('.lq-m'), F = q('.lq-f'), ST = q('.pr-stream');
    if (E){ E.setAttribute('y', LV(e).toFixed(1)); E.setAttribute('height', (252 - LV(e)).toFixed(1)); }
    if (M){ M.setAttribute('y', LV(tot).toFixed(1)); M.setAttribute('height', Math.max(0, LV(e) - LV(tot)).toFixed(1)); }
    if (F){ F.setAttribute('cy', LV(tot).toFixed(1)); F.style.opacity = s.m > .02 ? 1 : .0; }
    if (ST) ST.setAttribute('height', Math.max(0, LV(tot) - (s.r === 0 ? 64 : 92)).toFixed(1));
    /* the band lights up while you are inside it: let go now */
    const B = q('.pr-band'), R = this.t.rounds[s.r]; if (B) B.classList.toggle('in', this.total() >= R.lo && this.total() <= R.hi);
  }
  glass(){
    const s = this.s, t = this.t, R = t.rounds[s.r], e = Math.min(s.e, 1.1), tot = Math.min(this.total(), 1.1), over = this.total() > 1 && !s.holding && s.msg === 'over';
    const inner = 'M96 130H204L196 240Q194 252 182 252H118Q106 252 104 240Z';
    return '<svg class="pr-scene" viewBox="0 0 300 300" role="img" aria-label="'+esc(PR[lang].glass)+'"><defs><clipPath id="prclip"><path d="'+inner+'"/></clipPath></defs>'+
      '<rect class="pr-counter" y="262" width="300" height="38"/><ellipse class="pr-saucer" cx="150" cy="260" rx="78" ry="9"/>'+
      (s.r === 0 ? '<g class="pr-machine"><rect x="102" y="0" width="96" height="34" rx="6"/><rect x="126" y="34" width="48" height="16" rx="4"/><rect x="138" y="50" width="24" height="14" rx="3"/></g>' :
        '<g class="pr-jug"><path d="M176 40h50l-6 52h-38l-14-30z"/><path class="lip" d="M162 62l-14 18 16 6"/><path class="hdl" d="M226 50c14 0 14 26 0 26"/></g>')+
      '<rect class="pr-stream" x="'+(s.r === 0 ? 147 : 147)+'" y="'+(s.r === 0 ? 64 : 88)+'" width="6" height="0" rx="3" style="fill:'+R.col+'"/>'+
      '<g clip-path="url(#prclip)"><rect class="pr-air" x="90" y="120" width="120" height="140"/>'+
      '<rect class="lq-e" x="90" width="120" y="'+LV(e).toFixed(1)+'" height="'+(252 - LV(e)).toFixed(1)+'"/>'+
      '<rect class="lq-m" x="90" width="120" y="'+LV(tot).toFixed(1)+'" height="'+Math.max(0, LV(e) - LV(tot)).toFixed(1)+'"/>'+
      '<ellipse class="lq-f" cx="150" cy="'+LV(tot).toFixed(1)+'" rx="56" ry="4" style="opacity:'+(s.m > .02 ? 1 : 0)+'"/></g>'+
      '<g class="pr-band"><rect x="96" y="'+LV(R.hi).toFixed(1)+'" width="108" height="'+(LV(R.lo) - LV(R.hi)).toFixed(1)+'"/><path d="M90 '+LV(R.hi).toFixed(1)+'h120M90 '+LV(R.lo).toFixed(1)+'h120"/></g>'+
      '<path class="pr-glass" d="'+inner+'"/><path class="pr-shine" d="M108 140l-2 90"/>'+
      (over ? '<g class="pr-spill"><path d="M98 132c-4 20-6 50-8 90"/><path d="M202 132c4 22 6 52 8 92"/><ellipse cx="150" cy="262" rx="74" ry="6"/></g>' : '')+'</svg>';
  }
  render(){
    const t = this.t, s = this.s, g = PR[lang];
    const head = '<div class="sc-check" aria-hidden="true"></div><div class="sc-brand"><b>'+esc(tx(t.brand))+'</b><span>'+esc(tx(t.kind2))+'</span></div>';
    if (s.phase === 'prize') return this.paint('<div class="dm-in sc-in pr-in">'+head+this.prize()+'</div>');
    if (s.phase === 'art'){
      const all = s.res.every(Boolean);
      return this.paint('<div class="dm-in sc-in pr-in">'+head+'<div class="pr-top"><svg viewBox="0 0 300 300" aria-hidden="true"><circle class="pr-plate" cx="150" cy="150" r="140"/><circle class="pr-cupw" cx="150" cy="150" r="108"/><circle class="pr-crema" cx="150" cy="150" r="92"/>'+
        (all ? '<path class="pr-heart" d="M150 205C112 178 94 158 94 134c0-18 14-31 30-31 12 0 21 7 26 17 5-10 14-17 26-17 16 0 30 13 30 31 0 24-18 44-56 71z"/>'
          : '<path class="pr-blob" d="M120 120c20-26 64-14 70 8s30 22 14 46-52 34-74 14-30-42-10-68z"/>')+'</svg></div>'+
        '<p class="pr-art">'+esc(all ? g.heart : g.blob)+'</p><p class="pr-score">'+esc(fill(g.score, {n:s.res.filter(Boolean).length}))+'</p></div>');
    }
    const R = t.rounds[s.r], msg = s.msg ? g[s.msg] : (s.r === 0 ? g.how1 : g.how2);
    this.paint('<div class="dm-in sc-in pr-in">'+head+'<div class="pr-h"><h2>'+esc(tx(R.n))+'</h2><span>'+esc(fill(g.round, {n:s.r + 1}))+'</span></div>'+
      '<div class="pr-stage">'+this.glass()+'</div><p class="pr-fb'+(s.msg ? (s.msg === 'perfect' ? ' ok' : ' bad') : '')+'" aria-live="polite">'+esc(msg)+'</p>'+
      '<button type="button" class="pr-hold"'+(s.wait ? ' disabled' : '')+'><span class="ring"></span>'+esc(g.hold)+'</button></div>');
  }
  prize(){
    const t = this.t, s = this.s, g = PR[lang], n = s.res.filter(Boolean).length, p = t.prizes.find(x => n >= x.min), d = new Date(); d.setDate(d.getDate() + 7);
    return '<div class="sc-printer"><div class="sc-mouth"></div><div class="sc-paper"><div class="sc-cp"><div class="sc-brand"><b>'+esc(tx(t.brand))+'</b><span>'+esc(g.cpn)+'</span></div><span class="big">'+esc(tx(p.big))+'</span><b>'+esc(tx(p.n))+'</b>'+
      '<p class="sc-valid">'+esc(fill(g.score, {n}))+' · '+esc(fill(g.valid, {d:d.getDate()+' '+S[lang].months[d.getMonth()]}))+'</p><hr><div class="sc-bar"></div><p class="sc-code">'+esc(s.code)+'</p><p class="sc-valid">'+esc(g.show)+'</p></div></div></div>'+
      '<button type="button" class="sc-again" data-act="again">'+ic('restart')+esc(dg().again)+'</button>';
  }
  clear(){ super.clear(); if (this.raf) cancelAnimationFrame(this.raf); if (this.s) this.s.holding = false; }
}

/* ---------- 7 · pick your seat: break the seal, the hall lights up, the neighbours wave, the place card catches the light ---------- */
const ST = {
  ka:{dear:'ძვირფასო {to},', when:'პარასკევი, 19:30', where:'შუშის დარბაზი, ვაკე', dress:'დრესკოდი: სასაღამოო, თავისუფალი', yes:'მოვდივარ', no:'ვერ მოვალ', noMsg:'მოგვენატრები. ოთხშაბათამდე შეგიძლია გადაიფიქრო.',
      seatH:'აირჩიე შენი ადგილი', seatHint:'გადაიტანე შენი ბარათი თავისუფალ ადგილზე ან შეეხე მას.', next:'შემდეგი: კერძი', dishH:'რას მიირთმევ?', card:'ჩემი ბარათი', table:'მაგიდა {t} · ადგილი {k}', tableN:'მაგიდა {n}',
      seatN:'მაგიდა {t}, ადგილი {k}, თავისუფალი', near:'გვერდით გიზის: {a}.', nearNone:'შენ გვერდით ჯერ თავისუფალია.', see:'პარასკევს გნახავთ.', and:' და ',
      seal:'გატეხე ბეჭედი', env:'შენთვის მოსაწვევია', cal:'კალენდარში დამატება', days:'{n} დღე დარჩა', tilt:'დახარე ბარათი'},
  en:{dear:'Dear {to},', when:'Friday, 19:30', where:'The Glass Hall, Vake', dress:'Dress code: evening, relaxed', yes:'I’m coming', no:'Can’t make it', noMsg:'We’ll miss you. You can change your mind until Wednesday.',
      seatH:'Pick your seat', seatHint:'Drag your card to a free seat, or tap one.', next:'Next: your dish', dishH:'What will you have?', card:'My place card', table:'Table {t} · Seat {k}', tableN:'TABLE {n}',
      seatN:'Table {t}, seat {k}, free', near:'You’re next to {a}.', nearNone:'The seats next to you are still free.', see:'See you on Friday.', and:' and ',
      seal:'Break the seal', env:'An invitation for you', cal:'Add to calendar', days:'{n} days to go', tilt:'Tilt the card'}
};
const seatPos = (T, k) => { const a = (-90 + k * 60) * Math.PI / 180; return [T.x + 44 * Math.cos(a), T.y + 44 * Math.sin(a)]; };
const nextFriday = () => { const d = new Date(); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); d.setHours(19, 30, 0, 0); return d; };
class Seats extends Demo {
  init(){ return {step:'env', no:false, seat:null, dish:-1, tip:'', opening:false, lit:false, sat:false}; }
  bind(){
    let d = null;
    const seatAt = e => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest ? el.closest('.se-seat.free') : null; };
    this.el.addEventListener('pointerdown', e => {
      const c = e.target.closest('.se-card'); if (!c) return;
      e.preventDefault(); d = {pid:e.pointerId, x:e.clientX, y:e.clientY, ghost:null, moved:false, c}; try { c.setPointerCapture(e.pointerId); } catch (err) {}
    });
    this.el.addEventListener('pointermove', e => {
      /* the place card follows the pointer: it tilts and the gold foil catches the light */
      const tent = e.target.closest && e.target.closest('.se-tent');
      if (tent && !d && !reduced()){
        const r = tent.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        tent.style.setProperty('--ry', ((px - .5) * 22).toFixed(1)+'deg'); tent.style.setProperty('--rx', ((.5 - py) * 16).toFixed(1)+'deg'); tent.style.setProperty('--mx', (px * 100).toFixed(0));
      }
      if (!d || e.pointerId !== d.pid) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
      const root = this.q('.dm'), r = root.getBoundingClientRect();
      if (!d.ghost){ d.moved = true; d.ghost = document.createElement('div'); d.ghost.className = 'se-ghost'; d.ghost.innerHTML = d.c.outerHTML; root.appendChild(d.ghost); d.c.style.opacity = '.3'; }
      d.ghost.style.left = (e.clientX - r.left) + 'px'; d.ghost.style.top = (e.clientY - r.top) + 'px';
      this.el.querySelectorAll('.se-seat.drop').forEach(x => x.classList.remove('drop'));
      const st = seatAt(e); if (st) st.classList.add('drop');
    });
    this.el.addEventListener('pointerleave', () => { const tent = this.q('.se-tent'); if (tent){ tent.style.setProperty('--rx', '0deg'); tent.style.setProperty('--ry', '0deg'); } });
    const end = e => {
      if (!d || e.pointerId !== d.pid) return;
      const x = d; d = null; if (x.ghost) x.ghost.remove(); x.c.style.opacity = '';
      const st = e.type === 'pointercancel' ? null : seatAt(e);
      if (st) this.sit(+st.dataset.t, +st.dataset.k);
      else if (!x.moved){ this.s.tip = ST[lang].seatHint; this.render(); }
    };
    this.el.addEventListener('pointerup', end); this.el.addEventListener('pointercancel', end);
  }
  sit(ti, k){ const s = this.s; s.seat = {t:ti, k}; s.tip = ''; s.sat = true; this.render(); s.sat = false; sfx('ok'); buzz(15); this.burst(10); }
  near(){
    const g = ST[lang], T = this.t.tables[this.s.seat.t], k = this.s.seat.k, ns = [T.seats[(k + 5) % 6], T.seats[(k + 1) % 6]].filter(Boolean);
    return ns.length ? fill(g.near, {a:ns.map(p => tx(p.n)+' ('+tx(p.r)+')').join(g.and)}) : g.nearNone;
  }
  act(a, b){
    const s = this.s, t = this.t;
    if (a === 'again') return this.reset();
    if (a === 'seal'){
      if (s.opening) return; s.opening = true; this.render(); sfx('clack'); buzz(20);
      this.later(() => sfx('whoosh'), reduced() ? 0 : 450);
      this.later(() => { s.step = 'rsvp'; s.opening = false; this.render(); }, reduced() ? 0 : 1500);
    }
    else if (a === 'yes'){ s.step = 'seat'; s.no = false; this.render(); this.burst(18); this.step(1); sfx('ok');
      if (!reduced()) t.tables.forEach((T, i) => this.later(() => sfx('tap'), 300 + i * 380)); this.later(() => { s.lit = true; }, 1600); }
    else if (a === 'no'){ s.no = true; this.render(); }
    else if (a === 'sit') this.sit(+b.dataset.t, +b.dataset.k);
    else if (a === 'who'){ const p = t.tables[+b.dataset.t].seats[+b.dataset.k]; s.tip = tx(p.n)+' · '+tx(p.r); this.render(); }
    else if (a === 'dishes'){ if (s.seat){ s.step = 'dish'; this.render(); this.step(2); } }
    else if (a === 'dish'){ s.dish = +b.dataset.i; sfx('tap'); this.render(); }
    else if (a === 'card'){ if (s.dish >= 0){ s.step = 'card'; this.render(); this.thud(700); this.later(() => { sfx('win'); this.burst(36); }, reduced() ? 0 : 900); this.won(); } }
  }
  plan(){
    const t = this.t, s = this.s, g = ST[lang], me = s.seat, T0 = me ? t.tables[me.t] : null;
    const nb = me ? [(me.k + 5) % 6, (me.k + 1) % 6] : [];
    /* the camera leans in towards your table */
    const zoom = T0 ? ' style="transform-origin:'+(T0.x / 268 * 100).toFixed(1)+'% '+(T0.y / 290 * 100).toFixed(1)+'%"' : '';
    return '<svg viewBox="0 0 268 290" role="group" aria-label="'+esc(g.seatH)+'" class="'+(s.lit ? '' : 'lighting')+(me ? ' zoom' : '')+(s.sat ? ' zooming' : '')+'"'+zoom+'>'+t.tables.map((T, ti) =>
      '<g class="se-tg" style="--i:'+ti+'"><circle class="se-glow" cx="'+T.x+'" cy="'+T.y+'" r="60"/><circle class="se-tab" cx="'+T.x+'" cy="'+T.y+'" r="28"/><text class="se-tab-n" x="'+T.x+'" y="'+(T.y + 3)+'">'+esc(fill(g.tableN, {n:ti + 1}))+'</text>'+
      T.seats.map((p, k) => { const [x, y] = seatPos(T, k), mine = me && me.t === ti && me.k === k, wave = me && me.t === ti && nb.includes(k) && p;
        const c = '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="11"/>', lt = v => '<text x="'+x.toFixed(1)+'" y="'+(y + 3.2).toFixed(1)+'">'+esc(v.charAt(0))+'</text>';
        if (mine) return '<g class="se-seat me">'+c+lt(tx(t.to))+'</g>';
        if (p) return '<g class="se-seat taken'+(wave ? ' wave' : '')+'" data-act="who" data-t="'+ti+'" data-k="'+k+'" role="button" tabindex="0" aria-label="'+esc(tx(p.n)+', '+tx(p.r))+'" style="transform-origin:'+x.toFixed(1)+'px '+y.toFixed(1)+'px">'+c+lt(tx(p.n))+
          (wave ? '<text class="hi" x="'+x.toFixed(1)+'" y="'+(y - 14).toFixed(1)+'">👋</text>' : '')+'</g>';
        return '<g class="se-seat free" data-act="sit" data-t="'+ti+'" data-k="'+k+'" role="button" tabindex="0" aria-label="'+esc(fill(g.seatN, {t:ti + 1, k:k + 1}))+'">'+c+'</g>'; }).join('')+'</g>').join('')+'</svg>';
  }
  ics(){
    const t = this.t, d = nextFriday(), p = n => String(n).padStart(2, '0'), f = x => x.getFullYear()+p(x.getMonth() + 1)+p(x.getDate())+'T'+p(x.getHours())+p(x.getMinutes())+'00';
    const e = new Date(d.getTime() + 4 * 3600e3), g = ST[lang];
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//gancda//demo//EN', 'BEGIN:VEVENT', 'UID:gancda-demo-'+d.getTime()+'@gancda.com', 'DTSTAMP:'+f(new Date()), 'DTSTART:'+f(d), 'DTEND:'+f(e),
      'SUMMARY:'+tx(t.co)+' · '+tx(t.name), 'LOCATION:'+g.where, 'DESCRIPTION:'+fill(g.table, {t:this.s.seat.t + 1, k:this.s.seat.k + 1})+' · '+tx(t.dishes[this.s.dish].n), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(body);
  }
  render(){
    const t = this.t, s = this.s, g = ST[lang];
    const head = '<p class="se-kick">'+esc(tx(t.co))+'</p>';
    let body = '';
    if (s.step === 'env'){
      body = head+'<p class="se-envt">'+esc(g.env)+'</p><div class="se-env'+(s.opening ? ' open' : '')+'"><div class="se-env-back"></div><div class="se-env-card"><span>'+esc(tx(t.name))+'</span></div><div class="se-env-front"></div><div class="se-env-flap"></div>'+
        '<button type="button" class="se-wax" data-act="seal" aria-label="'+esc(g.seal)+'"><span class="l">'+esc(tx(t.co)).charAt(0)+'</span><i class="h1"></i><i class="h2"></i></button></div><p class="se-envh">'+esc(g.seal)+'</p>';
    } else if (s.step === 'rsvp'){
      body = '<div class="se-rise">'+head+'<h2 class="se-h">'+esc(tx(t.name))+'</h2><div class="se-rule"><i></i></div><div class="se-inv"><span>'+esc(fill(g.dear, {to:tx(t.to)}))+'</span><span>'+esc(tx(t.ask))+'</span><b>'+esc(g.when)+'</b><span>'+esc(g.where)+'</span><span>'+esc(g.dress)+'</span></div>'+
        '<div class="se-btns"><button type="button" class="se-yes" data-act="yes">'+esc(g.yes)+'</button><button type="button" class="se-no" data-act="no">'+esc(g.no)+'</button></div><p class="se-msg" aria-live="polite">'+(s.no ? esc(g.noMsg) : '')+'</p></div>';
    } else if (s.step === 'seat'){
      body = head+'<h2 class="se-h sm">'+esc(g.seatH)+'</h2><div class="se-plan">'+this.plan()+'</div><p class="se-tip" aria-live="polite">'+esc(s.seat ? this.near() : (s.tip || g.seatHint))+'</p>'+
        (s.seat ? '<button type="button" class="se-next" data-act="dishes">'+esc(g.next)+'</button>' : '<div class="se-me"><button type="button" class="se-card">'+esc(lang === 'ka' ? mt(tx(t.to)) : tx(t.to).toUpperCase())+'</button></div>');
    } else if (s.step === 'dish'){
      body = head+'<h2 class="se-h sm">'+esc(g.dishH)+'</h2><div class="se-dishes">'+t.dishes.map((x, i) => '<button type="button" class="se-dish" data-act="dish" data-i="'+i+'" aria-pressed="'+(s.dish === i)+'"><span class="pl">'+ic(x.ic)+'</span><span><b>'+esc(tx(x.n))+'</b><small>'+esc(tx(x.d))+'</small></span></button>').join('')+'</div>'+
        '<button type="button" class="se-yes" data-act="card"'+(s.dish < 0 ? ' disabled' : '')+'>'+esc(g.card)+'</button>';
    } else {
      const days = Math.max(1, Math.round((nextFriday() - new Date()) / 864e5));
      body = head+'<div class="se-tent" style="--rx:0deg;--ry:0deg;--mx:30"><div class="se-tent-in"><div class="back"></div><div class="front"><span class="k">'+esc(tx(t.co))+' · '+new Date().getFullYear()+'</span><b>'+esc(tx(t.to))+'</b>'+
        '<span class="tb">'+esc(fill(g.table, {t:s.seat.t + 1, k:s.seat.k + 1}))+'</span><span class="dish">'+esc(tx(t.dishes[s.dish].n))+'</span><i class="foil" aria-hidden="true"></i><span class="se-seal">RSVP</span></div></div></div>'+
        '<p class="se-near">'+esc(this.near())+'</p><p class="se-near"><b>'+esc(g.when)+'</b> · '+esc(g.where)+' · '+esc(fill(g.days, {n:days}))+'</p>'+
        '<a class="se-cal" href="'+this.ics()+'" download="'+esc(tx(t.co)).toLowerCase()+'-dinner.ics">'+ic('calendar')+esc(g.cal)+'</a>'+
        '<p class="se-see">'+esc(g.see)+'</p><button type="button" class="se-again" data-act="again">'+esc(dg().again)+'</button>';
    }
    this.paint('<div class="dm-in se-in ses-'+s.step+'">'+body+'</div>');
  }
}

const MECH = {invite:Invite, swipe:Swipe, spot:Spot, build:Build, link:Link, order:Order, pour:Pour, seats:Seats};

/* ---------- the demo line-up: eight demos, eight ways to play ---------- */
TBY.omakase.mech = 'invite'; TBY.omakase.goal = 'attend';
TBY.omakase.tag = L('სუშის ბარი: მოსაწვევი','Sushi bar: an invitation');
TBY.omakase.steps = [L('ფარდა და კითხვა','The curtain and the question'), L('მენიუდან არჩევა','Pick from the menu'), L('ომიკუჯის ბედისწერა','An omikuji fortune'), L('ბილეთი 確定 ბეჭდით','A ticket with a 確定 stamp')];
[
{ id:'spot', mech:'spot', goal:'learn', time:60,
  name:L('ოთახი 214','Room 214'), kind:L('სწავლება · სასტუმროს დასუფთავება','Learning · Hotel housekeeping'), tag:L('სასტუმრო: იპოვე შეცდომები','Hotel: find the mistakes'), brand:L('სასტუმრო ლილა','Hotel Lila'),
  desc:L('ოთახი სტუმრის მოსვლამდე: იპოვე ხუთი შეცდომა 60 წამში. ყოველი აღმოჩენა ერთ წესს გასწავლის.','A room before the guest arrives: find five mistakes in 60 seconds. Every find teaches one rule.'),
  steps:[L('ოთახი სტუმრის მოსვლამდე','The room before the guest arrives'), L('60 წამი ხუთი შეცდომისთვის','60 seconds to find five mistakes'), L('ყოველი აღმოჩენა წესს გასწავლის','Every find teaches a rule'), L('ვარსკვლავები და ოთახის ჩეკლისტი','Stars and a room checklist')],
  c:{acc:'#6F5590', acc2:'#F2B33D', paper:'#FFFFFF'}, fx:'petal', fxc:['#B9A3D9','#F2B33D','#FFFFFF'],
  spots:[
    {id:'frame', n:L('დახრილი სურათი','A crooked picture'), why:L('სურათები სწორად ეკიდება. შეამოწმე კარიდან.','Pictures hang straight. Check from the doorway.')},
    {id:'cup', n:L('ნახმარი ჭიქა','A used cup'), why:L('ნახმარი ჭურჭელი ოთახიდან გაიტანება და სუფთით იცვლება.','Used cups leave the room and are replaced with clean ones.')},
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
    {ic:'hands', ok:true, s:L('ცვლის დაწყებამდე ხელების დაბანა 20 წამის განმავლობაში.','Washing your hands for 20 seconds before a shift.'), why:L('ზუსტად ასე: საპონი, 20 წამი, ერთჯერადი ხელსახოცი.','Exactly: soap, 20 seconds, a paper towel.')},
    {ic:'thermo', ok:true, s:L('მაცივარი 4 °C-ზე ან უფრო ცივად.','Keeping the fridge at 4 °C or colder.'), why:L('4 °C-ზე და უფრო ცივად ბაქტერიები ძალიან ნელა მრავლდება.','At 4 °C or colder, most bacteria grow very slowly.')},
    {ic:'spoon', ok:false, s:L('სოუსის გასინჯვა ერთი და იმავე კოვზით ორჯერ.','Tasting the sauce twice with the same spoon.'), why:L('ყოველ ჯერზე სუფთა კოვზი.','A clean spoon every time.')},
    {ic:'steak', ok:false, s:L('ხორცის გალღობა მაგიდაზე, ოთახის ტემპერატურაზე.','Thawing meat on the counter at room temperature.'), why:L('ხორცი მაცივარში ლღვება, ღამით.','Meat thaws in the fridge, overnight.')},
    {ic:'tag', ok:true, s:L('გახსნილ ქილაზე გახსნის თარიღის დაწერა.','Writing the opening date on an opened jar.'), why:L('თარიღი გეუბნება, როდის უნდა გადააგდო.','The date tells you when to throw it out.')}]},
{ id:'build', mech:'build', goal:'learn',
  name:L('მენიუს აკადემია','Menu Academy'), kind:L('სწავლება · სუშის ბარის გუნდი','Learning · Sushi bar team'), tag:L('სუშის ბარი: ააწყე შეკვეთა','Sushi bar: build the order'), brand:L('UMI'),
  desc:L('ოფიციანტები და მზარეულები მენიუს ერთად სწავლობენ: წაიკითხე შეკვეთა, ჩააწყე ინგრედიენტები და მიიტანე. სამი შეკვეთა, ერთი ალერგიით.','Waiters and cooks learn the menu together: read the order, lay out the ingredients, serve it. Three orders, one with an allergy.'),
  steps:[L('შეკვეთა რელსზე','An order on the rail'), L('ინგრედიენტების ჩაწყობა','Lay out the ingredients'), L('მიტანა და მყისიერი შემოწმება','Serve it and get an instant check'), L('სერტიფიკატი 合格 ბეჭდით','A certificate with a 合格 stamp')],
  c:{acc:'#C8312B', acc2:'#9CC27A', paper:'#FFFDF7'}, fx:'petal', fxc:['#f6c1cc','#C8312B','#FFFDF7'],
  ings:[{id:'nori', n:L('ნორი','Nori'), col:'#1F3B2C'}, {id:'rice', n:L('ბრინჯი','Rice'), col:'#FBF8F0'}, {id:'salmon', n:L('ორაგული','Salmon'), col:'#F08A5D'}, {id:'tuna', n:L('თინუსი','Tuna'), col:'#C8312B'},
        {id:'cheese', n:L('ნაღების ყველი','Cream cheese'), col:'#FFF1CC'}, {id:'avocado', n:L('ავოკადო','Avocado'), col:'#9CC27A'}, {id:'cucumber', n:L('კიტრი','Cucumber'), col:'#4E9A4A'}, {id:'sesame', n:L('სეზამი','Sesame'), col:'#E8D9B0'}],
  orders:[{t:L('მაგიდა 4','Table 4'), d:L('ფილადელფია როლი','Philadelphia roll'), note:null, need:['nori','rice','salmon','cheese','avocado']},
          {t:L('მაგიდა 7','Table 7'), d:L('კაპა მაკი','Kappa maki'), note:L('ვეგეტარიანელი სტუმარი','Vegetarian guest'), need:['nori','rice','cucumber','sesame']},
          {t:L('მაგიდა 2','Table 2'), d:L('ფილადელფია როლი','Philadelphia roll'), note:L('ალერგია ავოკადოზე','Avocado allergy'), allergy:'avocado', need:['nori','rice','salmon','cheese']}]},
{ id:'ask', mech:'link', goal:'onboard',
  name:L('ვის ჰკითხო?','Who do you ask?'), kind:L('ადაპტაცია · პროდუქტის გუნდი','Onboarding · Product team'), tag:L('ოფისი: ვის ჰკითხო','Office: who do you ask?'), co:L('ORBITA'),
  desc:L('ახალი თანამშრომელი ოთხ ჩვეულებრივ პრობლემას ხაზით აკავშირებს იმ ადამიანთან, ვინც დაეხმარება. ყველა პასუხობს და ბოლოს კონტაქტები ინახება.','A new hire draws a line from four everyday problems to the person who can help. Each one answers, and the contacts are saved at the end.'),
  steps:[L('ოთხი პირველი დღის კითხვა','Four first-day questions'), L('ხაზი სწორ ადამიანამდე','A line to the right person'), L('ისინი გპასუხობენ','They answer you'), L('შენი ხალხი, კონტაქტებში','Your people, saved')],
  c:{acc:'#2F5BD3', acc2:'#2BB673', paper:'#FFFFFF'}, fx:'rect', fxc:['#2F5BD3','#FFD23F','#2BB673'],
  pairs:[
    {ic:'phone', q:L('ლეპტოპი არ ირთვება','Your laptop won’t turn on'), reply:L('მომიტანე, ორ წუთში გავასწორებ.','Bring it over, I’ll fix it in two minutes.'),
     who:{n:L('დათო','Dato'), r:L('IT','IT'), ch:'#it-help', hair:'#151515', skin:'#D9A47E', bg:'#7FC8A9', style:1, glasses:true}},
    {ic:'calendar', q:L('დასვენების დღე გინდა','You want a day off'), reply:L('HR პორტალში მოითხოვე, იმავე დღეს დაგიდასტურებ.','Ask in the HR portal, I approve it the same day.'),
     who:{n:L('ქეთი','Keti'), r:L('HR','People'), ch:'hr.orbita.ge', hair:'#5A2A16', skin:'#F1C6A8', bg:'#F7A9BE', style:0}},
    {ic:'briefcase', q:L('არ იცი, რით დაიწყო','Not sure which task comes first'), reply:L('10-ზე დაფას ერთად გადავხედოთ.','Let’s look at the board together at 10.'),
     who:{n:L('ანა','Ana'), r:L('გუნდის ლიდი','Team lead'), ch:'@ana', hair:'#8A3B1E', skin:'#F1C6A8', bg:'#C9B8F0', style:2}},
    {ic:'coffee', q:L('სად არის კარგი ყავა?','Where’s the good coffee?'), reply:L('მესამე სართულზე, ფანჯარასთან. გაჩვენებ!','Third floor, by the window. I’ll show you!'),
     who:{n:L('ნინო','Nino'), r:L('შენი ბადი','Your buddy'), ch:'@nino', hair:'#2B1B12', skin:'#EDBB98', bg:'#FFD23F', style:0}}]},
{ id:'shift', mech:'order', goal:'onboard',
  name:L('პირველი ცვლა','First shift'), kind:L('ადაპტაცია · მაღაზიების ქსელი','Onboarding · Retail chain'), tag:L('მაღაზია: პირველი ცვლა','Store: your first shift'), co:L('BAZARI'),
  desc:L('ახალი მოლარე პირველ ცვლას თვითონ ალაგებს: შეეხება მოვლენებს სწორი თანმიმდევრობით, ცა კი დილიდან საღამომდე იცვლება.','A new cashier puts their first shift in order: tap the events in sequence while the sky moves from morning to evening.'),
  steps:[L('ცვლის მოვლენები, არეული','The shift’s events, shuffled'), L('დაალაგე სწორად','Put them in order'), L('დღე გადის','The day goes by'), L('ცვლის გეგმა და ბეჯი','A shift plan and a badge')],
  c:{acc:'#1638B8', acc2:'#FFB13B', paper:'#FFFFFF'}, fx:'rect', fxc:['#FFB13B','#1638B8','#FF7A1A'],
  to:L('მარიამი','Mariam'), role:L('მოლარე','Cashier'), me:{hair:'#4A2A1A', skin:'#F0C4A4', bg:'#FFE1B0', style:2, shirt:'#FF7A1A'},
  events:[
    {time:'08:45', ic:'store', n:L('შემოდი უკანა კარიდან, კოდი 2207','Come in by the back door, code 2207')},
    {time:'08:50', ic:'user', n:L('ჩაიცვი ფორმა და გაიკეთე ბეჯი','Put on your uniform and badge')},
    {time:'09:00', ic:'clock', n:L('მოსვლა დააფიქსირე ტერმინალზე','Clock in at the staff terminal')},
    {time:'09:10', ic:'chat', n:L('დილის შეხვედრა ქეთისთან','Morning huddle with Keti')},
    {time:'13:00', ic:'coffee', n:L('შესვენება, 30 წუთი','Break, 30 minutes')},
    {time:'17:00', ic:'coins', n:L('დაითვალე სალარო და დაასრულე','Count your till and clock out')}]},
{ id:'pour', mech:'pour', goal:'engage',
  name:L('ზუსტად ჩაასხი','Pour it right'), kind:L('კამპანია · ყავის ბრენდი','Campaign · Coffee brand'), tag:L('ყავა: ზუსტად ჩაასხი','Coffee: pour it right'), brand:L('ცისკარი','TSISKARI'), kind2:L('ყავა','COFFEE'),
  desc:L('ჭიქის ქაღალდის გარსზე QR ხსნის თამაშს: დააჭირე და ჩაასხი ესპრესო, მერე რძე, და გაუშვი ზუსტად ზოლზე. რაც უფრო ზუსტია ჩასხმა, მით უკეთესია ლატე-არტი და პრიზი.','A QR code on the cup sleeve opens a game: hold to pour the espresso, then the milk, and let go right on the line. The better the pour, the better the latte art and the prize.'),
  steps:[L('QR ჭიქაზე','A QR code on the cup'), L('დააჭირე და ჩაასხი ესპრესო','Hold to pour the espresso'), L('რძე: გაჩერდი ზოლზე','Milk: stop on the line'), L('ლატე-არტი და პრიზი','Latte art and a prize')],
  c:{acc:'#0E3B2C', acc2:'#D4202B', paper:'#F3EAD6'}, fx:'rect', fxc:['#0E3B2C','#D4202B','#F3EAD6'],
  rounds:[{n:L('ესპრესო','Espresso'), lo:.32, hi:.42, col:'#4A2412'}, {n:L('რძე','Milk'), lo:.8, hi:.9, col:'#F4EADB'}],
  prizes:[{min:2, big:L('უფასო','FREE'), n:L('უფასო ფლეტ უაიტი','A free flat white')}, {min:1, big:L('−50%'), n:L('შემდეგი ყავა ნახევარ ფასად','Half price on your next coffee')}, {min:0, big:L('+1'), n:L('დამატებითი ბეჭედი ცდისთვის','An extra stamp for trying')}]},
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
['spot', 'swipe', 'build', 'ask', 'shift', 'pour', 'seats', 'omakase'].forEach(id => TPL.push(TBY[id]));


/* ---------- public API ---------- */
window.GancdaDemos = {
  mount(el, id){ const t = TBY[id]; if (!t) return null; const C = MECH[t.mech] || Invite; return new C(el, id); },
  drop(inst){ if (!inst) return; inst.clear(); const i = invites.indexOf(inst); if (i > -1) invites.splice(i, 1); },
  setLanguage(value){ lang = value === 'en' ? 'en' : 'ka'; invites.forEach(i => { if (i.el && i.el.isConnected) i.render(); }); },
  info(id){ const t = TBY[id]; if (!t) return null;
    return {id, goal:t.goal, name:tx(t.name), kind:tx(t.kind), tag:tx(t.tag), desc:tx(t.desc), brand:tx(t.brand || t.co || (t.tk && t.tk.venue) || ''), steps:(t.steps || []).map(tx)}; },
  ids(){ return TPL.map(t => t.id); },
  colors(id){ const t = TBY[id]; return t ? {acc:t.c.acc, acc2:t.c.acc2, paper:t.c.paper} : null; },
  sound(on){ if (on != null){ soundOn = !!on; try { localStorage.setItem('gancda.sound', soundOn ? 'on' : 'off'); } catch (e) {} if (!soundOn) try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} } return soundOn; },
  unlock(){ audio(); }
};
})();
