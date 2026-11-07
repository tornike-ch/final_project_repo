# gancda website

Your layout (`index.html`, `experiences.*`, `project.*`) in the gancda brand, light by default everywhere (dark is a switch in the header), with eight demos that each play differently and react as you play.

| File | What it does |
|---|---|
| `index.html` | Page frame: header, hero, footer, and empty `#play`, `#report`, `#start` sections the scripts fill. |
| `studio.css` / `studio.js` | Brand tokens, header, hero, footer, language switch and mobile menu. Written new: the originals weren't supplied. Light by default, including header, hero, footer and the demo player; dark only when chosen. The Georgian lockup shows in Georgian, the kit's Latin logo in English, each in aubergine on light and cream/lime on dark. |
| `experiences.css` / `experiences.js` | The goal gallery with a live preview of each demo, the results report, and the full-screen player: lock-screen intro, steps that tick off as you play, an outro with the illustrative report. |
| `demos.css` / `demos.js` | The eight demos. `GancdaDemos.mount(element, id)` runs one inside any `.xp-screen` element. Demos emit `gancda:step` and `gancda:done` events; sound is synthesised with Web Audio and can be switched off (`GancdaDemos.sound(false)`). |
| `project.css` / `project.js` | How we work, the individual-offer block (no public prices) and the request form. |
| `preview.html` | The same page without its document head, used to publish the claude.ai preview. Not needed on the live site. |
| `assets/` | Logo, symbol, favicons, app icons, social image and graphics from the brand kit; `gancda-lockup-ka*.png` (Georgian lockup, cut from the design-language PDF) and `gancda-symbol.svg` (a smooth redraw of the asterisk). |

Demos by goal:
- **Learning:** Room 214 (spot the mistakes, shown first), Safe or not (swipe), Menu Academy (drag and build).
- **Onboarding:** Who do you ask? (draw lines from problems to people), First shift (tap the day into order).
- **Campaigns:** Pour it right (hold to pour, let go on the line; the latte art and the prize follow your pour).
- **Events:** Year-end dinner (pick a seat), Omakase (invitation).

The slogan's hand-lettered second line uses DM Ivane Nanuashvili for Georgian (self-hosted in `assets/fonts/`; © David Maisuradze, Georgian National Centre of Manuscripts; supplied by the client, confirm the licence terms before launch) and Zeyada (Google Fonts) for English, picked to match its thin, slanted pen. Other fonts load from Google Fonts. Check the licences, or self-host the fonts, before launch, as the kit's handoff notes say. The kit's logo paths are traced from a raster and still need a designer's clean-up and a trademark check before final use.
