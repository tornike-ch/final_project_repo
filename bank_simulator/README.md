# Bank customer-service simulator (SCORM 1.2)

A branching, multiple-choice simulator for evaluating bank employees on **product knowledge**, **service** and **sales**. The game is in Georgian, looks like a mock banking workstation, and is packaged as **SCORM 1.2** for your LMS. A browser-based **builder** imports cases (Excel or JSON), configures the game and exports new SCORM packages.

> The sample cases, products and rates are invented placeholders. Replace them with your own content in the builder. The colours approximate TBC Bank's palette; the TBC website was not reachable from the build environment, so check the exact brand colours in **Builder → Settings → Branding**.

```
bank_simulator/
├── dist/bank-service-simulator_scorm12.zip   ← ready-to-upload package with the sample content
├── builder/index.html                        ← open in a browser: import, configure, preview, export
├── player/                                   ← the game (also an unzipped SCORM package)
│   ├── index.html, css/, js/
│   └── data/content.js                       ← cases, products, quiz and settings
├── CASE_FORMAT.md                            ← the data contract and a prompt for your enterprise Claude
└── tools/                                    ← build script, mock LMS, automated tests
```

## Quick start

1. **Try it:** upload `dist/bank-service-simulator_scorm12.zip` to the LMS as a SCORM 1.2 package, or open `player/index.html` directly (in test mode without an LMS, progress is kept in the browser).
2. **Add your cases:** open `builder/index.html` → *Import / Export* → download the Excel template or the JSON sample. Generate cases with your enterprise Claude using `CASE_FORMAT.md`, then import them.
3. **Configure:** set levels, pass thresholds, add-ons (the reference panel and the quiz can each be switched on or off), scoring penalty and branding.
4. **Check:** *Validation* tab, *Preview* for each case, *Test full game*.
5. **Export SCORM package** and upload it. Raise `meta.version` each time.

The builder runs completely in the browser, with no server or install, and keeps your work in that browser. Use *Content JSON* export as a backup. Excel import and export load the SheetJS library from cdnjs the first time; JSON works offline.

## How the game works

| | |
|---|---|
| **Structure** | Levels by difficulty. Each run draws random cases from that level's pool (balanced across categories) plus optional quiz questions. |
| **Progression** | A level is passed when the average of the three skill scores on it reaches the level's threshold (default 70–75%). |
| **Evaluation** | **Only the first run counts.** It starts at level 1 and continues while levels are passed. It stops at the first failed level or after the last level, and the result is then locked. |
| **Practice** | After the evaluation, unlimited practice on unlocked levels. Practice never changes the LMS score. |
| **Answers** | Multiple choice, shuffled on every display. Keys 1–4 or A–D work too. |
| **Mood** | Shown only by the customer's face. An already-furious customer leaves after one more bad answer (optional). |
| **Channels** | Branch counter, phone call (with a call timer) or chat. Set per case, or force one channel for the whole package. |
| **Workstation** | Mock CRM profile (profile, products, notes tabs) with sales cues, plus the optional **reference panel** (searchable product catalog and procedures). |
| **Feedback** | Only at the end of the session: skill scores, levels, critical errors, missed sales opportunities, and a step-by-step review with the best answer and an explanation. |
| **Time** | Every answer's response time is recorded and sent to the LMS. It is not scored, and it is hidden from the employee unless enabled. |
| **Resume** | Closing mid-session resumes at the start of the unfinished conversation. |

## What is sent to the LMS

| SCORM field | Value |
|---|---|
| `cmi.core.score.raw` | Overall % (average of knowledge, service and sales) from the evaluation run |
| `cmi.core.lesson_status` | `incomplete` while running, then `completed` (or `passed`/`failed` if configured) |
| `cmi.objectives.0..2` | `knowledge`, `service`, `sales`: each skill % |
| `cmi.objectives.3` | `levels`: % of levels passed, with passed/failed status |
| `cmi.interactions.n` | One per answer: `CASEID_NODEID`, chosen letter, best letter, correct/neutral/wrong, latency. One per quiz question. One `CASEID_SUMMARY` per case, e.g. `K7/7;S7/7;SA5/5;CRIT0;OPP1/1;OUTresolved;REF2;T95s` |
| `cmi.suspend_data` | Compact progress (well under the 4096-character limit) |
| `cmi.core.lesson_location`, `session_time`, `exit=suspend` | Standard bookkeeping |

Interaction letters refer to the option order in the content file, not the shuffled screen order, so reports stay comparable between employees.

## Testing

```bash
python3 tools/build.py                       # regenerate dist zip, manifest and builder bundle after changing player/
node tools/smoke_test.js                     # plays the game in a mock LMS: perfect run, locked relaunch, practice, failing run + resume, mobile
node tools/builder_test.js --xlsx <path to xlsx.full.min.js>   # export, unzip and boot, JSON/Excel import, preview
```
`tools/lms_test_harness.html` is a mock LMS you can open yourself (serve the folder, for example with `python3 -m http.server`, then open `/tools/lms_test_harness.html`). It shows every value the game writes.

## Where to change evaluation later

- **Per answer:** the `scores`, `critical` and `feedback` of each option (done in your case data).
- **Global:** `config.scoring.criticalPenalty`, the level thresholds, and the add-ons (builder Settings).
- **Formula:** `aggregate()` and `skillPct()` in `player/js/engine.js` (pooled % per skill, ideal-path maximum). After code changes run `python3 tools/build.py` so the builder exports the new code.

## Defaults I chose (change if needed)

- One answer key per step, with a 15-point penalty for each critical error on the affected skill.
- The evaluation stops at the first failed level. The employee can keep practising and unlock further levels.
- The LMS status is `completed` (not passed/failed), so the score itself carries the result.
- Builder UI is in English; the game is in Georgian.
- No escalate-to-manager button. Escalation is modelled as an answer option with outcome `escalated`.
- No pausing inside a conversation. Resume restarts the unfinished conversation, and earlier answers in it are not counted twice.

## Credits

Customer illustrations: **Micah Lanier, "Avatar Illustration System"** ([source](https://www.figma.com/community/file/829741575478342595)), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). They are rendered with [DiceBear](https://www.dicebear.com) (MIT), bundled in `player/js/micah.js` (see `tools/avatar_lib/README.md`). The credit line on the start screen satisfies the attribution requirement, so keep it. Per-customer look overrides go in `customer.avatar` (see CASE_FORMAT.md).
