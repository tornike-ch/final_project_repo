# Gancda (განცდა): digital experiences site

The one-page site for Gancda, a digital experience studio. The page is itself a short experience in
four steps (goal, play, result, start): the visitor picks what they want people to do (learn, join,
engage with a brand, show up), plays the experience built for that goal on a live phone, launches a
demo results report, then sends a request. Demos: a lesson, an onboarding path, a brand campaign
game and event invitations. Georgian first, English switch, light and dark themes. No emojis: every
icon is inline SVG. All brands, names and figures on the page are demo data.

A lesson-type template can set `glab` to rename the lesson labels per language (the campaign demo
uses it to turn the certificate into a coupon).

## The site

`public/index.html` is the site: a clean one-page studio site with four playable demos on a live
phone, each with its own mechanics:

- **Learning game**: a customer-service simulator. Four customers, three answers each; every choice
  changes the customer's mood, earns points and is explained. Ends with a score and skill breakdown.
- **Onboarding journey**: a first-week map with four stages: flip cards to meet the team, pick who
  does what, tick off first-day tasks, true/false on how the team works. XP, a badge and a buddy.
- **Brand game**: catch falling coffee beans for 15 seconds (gold +3, ice −2), then scratch a card
  for a prize tied to the score, with a leaderboard.
- **Event invitation**: envelope, details and programme, RSVP with a plus-one, a ticket with a
  countdown and a real calendar file (.ics).

Then formats, how we work, results (demo dashboard), packages and a contact form that posts to
`/api/requests`. Georgian and English, light and dark. Sources are in `src/site/` (`index.html`,
`app.css`, `copy.js` with every string, `app.js`); build with `python3 invite_site/tools/build_site.py`.

`public/play.html` is the earlier page, kept only to play shared experience links (`/e/<code>`,
served by `functions/e/[slug].js`); it carries the old template engine and the scroll story
(`src/story.*`, `tools/build_story.py`, `tools/peeps/`). Opened at any other path it redirects home.

## Layout

```
invite_site/
  public/index.html        the site, and the player for shared links (/e/<code>)
  public/admin/index.html  the private admin page (/admin)
  public/_headers          response headers (admin is noindex, no-store)
  functions/               Cloudflare Pages Functions: the backend
    api/requests.js            POST  /api/requests             the site's request form
    api/e/[slug].js            GET   /api/e/:code              what a shared link shows
    api/e/[slug]/events.js     POST  /api/e/:code/events       what a player did
    api/admin/_middleware.js   every /api/admin/* call needs ADMIN_PASSWORD
    api/admin/requests.js      GET   the request inbox; requests/[id].js PATCH status/note, DELETE
    api/admin/experiences.js   GET   groups of links with totals; POST create links
    api/admin/experiences/[grp].js  GET results per person; PATCH on/off; DELETE
    e/[slug].js                GET   /e/:code serves the page, which opens the player
  lib/                     shared helpers: schema, auth, results queries
  src/story.css, story.js  the illustrated scroll story, inlined by tools/build_story.py
```

## Run it

Open `public/index.html` in a browser to see the site; nothing to build. Opened as a file there is
no backend, so the form shows the request as text to copy instead of sending it.

With the backend, locally:

```sh
npx wrangler pages dev public --d1 DB=gancda-local --binding ADMIN_PASSWORD=a-long-test-password
```

The database tables are created on first use, so a new D1 database needs no setup.

## Hosting on Cloudflare Pages (connected to GitHub)

One-time setup in the Cloudflare dashboard:

1. **Storage & Databases → D1 → Create** a database named `gancda`.
2. **Workers & Pages → Create → Pages → Connect to Git**, pick this repository, then:
   production branch: the branch to publish; framework preset: None; build command: empty;
   build output directory: `public`; root directory: `invite_site`.
3. In the new project, **Settings → Bindings → Add → D1 database**: variable name `DB`, database `gancda`.
4. **Settings → Variables and Secrets → Add**: `ADMIN_PASSWORD`, type Secret, 12+ characters.
5. **Deployments → retry the latest deployment** so the binding and secret take effect.
6. **Custom domains**: remove `gancda.com` and `www.gancda.com` from any older Pages project first,
   then add them here.

Every push to the production branch then deploys the site and the backend.

Optional email notice for each new request (via [Resend](https://resend.com)): add the secret
`RESEND_API_KEY` and the variable `NOTIFY_TO` (comma-separated addresses), and verify gancda.com in
Resend so it can send as `hello@gancda.com` (override with `NOTIFY_FROM`). Without them, requests
are saved and shown in `/admin` only.

## The admin page

`gancda.com/admin`, signed in with `ADMIN_PASSWORD`.

- **Requests**: every form submission, with status (new, contacted, won, closed, spam) and a private note.
- **Experience links**: pick a template, enter one name per line, and each person gets a personal
  link (`gancda.com/e/<code>`) with their name in it; with no names you get one shared link. A link can
  change: who it is for, who it is from, the opening message, the question, venue, venue line,
  date and time (invites) and the closing line. Demo names in the template text are swapped for the
  real ones.
- **Results** per group: how far people got (opened, started, said yes, picked, confirmed, or
  answered and finished), right answers per question, what people picked, each person's status and
  score, and a CSV download. Counts are per device. Links can be switched off or deleted.

## What the player records

Each shared link sends small events to `/api/e/:code/events`: `view`, `start`, `yes`, `no`, `picks`
(item names), `reveal`, `confirm`, `answer` (question number, right or not) and `complete` (score).
The visitor is a random id kept in the browser; no names, IPs or other personal data are stored with
events. Form requests store a daily-rotating hash of the IP only, to limit a sender to 5 requests per
10 minutes.

## Settings in the page

At the top of the `<script>` in `public/index.html`:

```js
const CONFIG = {
  formEndpoint: ONLINE ? '/api/requests' : '',  // the backend when served, copy-as-text when opened as a file
  api: ONLINE ? '/api' : '',
  email: 'hello@gancda.com'
};
```

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
