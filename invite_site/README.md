# Patizhi (პატიჟი): invite business site

A one-file website for the interactive invite business: portfolio of 10 playable templates,
custom-invite offer, restaurant pricing, FAQ and a request form. Georgian first, English switch,
light and dark themes. No emojis: every icon is inline SVG.

## Run it

Open `index.html` in a browser. Nothing to build or install.

To host it, any static host works (GitHub Pages, Netlify, Cloudflare Pages). For GitHub Pages:
Settings → Pages → deploy from branch → folder `/invite_site` is not selectable, so either move
the file to `/docs` or the repo root, or use Netlify/Cloudflare and point them at `invite_site/`.

## Before going live

At the top of the `<script>` in `index.html`:

```js
const CONFIG = {
  formEndpoint: '',            // a URL that accepts a JSON POST (Formspree, Getform, your own API)
  email: 'hello@patizhi.ge'    // placeholder: replace with the real address
};
```

With `formEndpoint` empty, the form validates and then shows the request as text with a
Copy button, so nothing is lost but nothing is sent either.

## The template engine

Every invite on the page (hero phone, posters, demo dialog) is rendered by one engine from a
plain data object in the `TPL` array. A template is:

| key | what it sets |
| --- | --- |
| `c` | palette: background, surfaces, ink, accent, paper (ticket), lines |
| `pat`, `po` | background pattern (`waves`, `grapes`, `gingham`, `rings`, `grill`, `stars`, `grid`, `confetti`, `diamond`, `lines`) and its opacity |
| `op` | step 1 opener: `noren`, `doors`, `env` (envelope with seal) or `box` (`pizza`, `cloche`, `gift`, `ring`) |
| `q`, `noLines` | step 2 question and the lines the runaway No button says |
| `items`, `max` | step 3 menu: icon, name, description, portion, fill color |
| `sp` | step 4 surprise: icon, big word, label, possible lines |
| `tk` | step 5 ticket: venue, sub-line, time, extra fields, stamp text and shape |
| `ui` | art direction: `align` (center/left), `head` (serif/light/sans/cond/geo), `caps`, `btn` (fill/outline/hard/glass), `card` (solid/line/hard/glass), `frame` (ornament/hairline/deco/gingham), `ask` (belt/trio/skyline/details/bigtype), `pick` (list/menu/grid/chips), `tk` ticket shape (stub/card/postcard/receipt/pass/badge/label/sticker) |

All text fields take `{ka, en}`. Adding a restaurant means adding one object: its colors,
menu and booking details. That is the asset to grow into a self-serve builder later.

Demo venues, companies and people on the site are fictional.
