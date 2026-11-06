# gancda website

Your layout (`index.html`, `experiences.*`, `project.*`) in the gancda brand, in light and dark themes, with eight demos that each play differently and react as you play.

| File | What it does |
|---|---|
| `index.html` | Page frame: header, hero, footer, and empty `#play`, `#report`, `#start` sections the scripts fill. |
| `studio.css` / `studio.js` | Brand tokens, header, hero, footer, language switch and mobile menu. Written new: the originals weren't supplied. Light and dark themes; header, hero and footer stay aubergine. The Georgian lockup shows in Georgian, the kit's Latin logo in English. |
| `experiences.css` / `experiences.js` | The goal gallery with a live preview of each demo, the results report, and the full-screen player: lock-screen intro, steps that tick off as you play, an outro with the illustrative report. |
| `demos.css` / `demos.js` | The eight demos. `GancdaDemos.mount(element, id)` runs one inside any `.xp-screen` element. Demos emit `gancda:step` and `gancda:done` events; sound is synthesised with Web Audio and can be switched off (`GancdaDemos.sound(false)`). |
| `project.css` / `project.js` | How we work, the individual-offer block (no public prices) and the request form. |
| `preview.html` | The same page without its document head, used to publish the claude.ai preview. Not needed on the live site. |
| `assets/` | Logo, symbol, favicons, app icons, social image and graphics from the brand kit. |

Demos by goal:
- **Learning:** Menu Academy (drag and build), Room 214 (spot the mistakes), Safe or not (swipe).
- **Onboarding:** Your buddy (chat and memory game), The store map (floor-plan hunt).
- **Campaigns:** Tsiskari Coffee (scratch card and stamp card).
- **Events:** Year-end dinner (pick a seat), Omakase (invitation).

Fonts load from Google Fonts. Check the licences, or self-host the fonts, before launch, as the kit's handoff notes say. The kit's logo paths are traced from a raster and still need a designer's clean-up and a trademark check before final use.
