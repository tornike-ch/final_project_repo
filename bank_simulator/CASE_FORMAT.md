# Case format reference

This is the contract between your case data and the game. Give this file to your enterprise Claude together with your interaction logs, and ask it to produce cases in either **JSON** (recommended) or the **Excel template** layout. Then import the result in the builder (`builder/index.html` → Import / Export).

All player-facing text (customer lines, answers, feedback, product descriptions) is **Georgian**. IDs use **latin letters, digits, `_ - .` only** (they are sent to the LMS).

---

## 1. Content file

```jsonc
{
  "meta":     { "packageId": "bank-service-simulator", "title": "…", "version": "1.0.0" },
  "config":   { … },          // levels, add-ons, scoring, theme (editable in the builder)
  "products": [ … ],          // reference catalog + product choices
  "cases":    [ … ],          // branching customer conversations
  "quiz":     [ … ]           // optional add-on: standalone knowledge questions
}
```

The builder accepts a full content file, an **array of cases**, or **one case object**. In *merge* mode, items with an existing `id` are replaced and new ones are added.

---

## 2. Case

```jsonc
{
  "id": "C101",                       // unique, latin
  "title": "დაბლოკილი ბარათი",          // shown in the report
  "level": 1,                         // must match a configured level id
  "channel": "branch",                // branch | phone | chat
  "category": "ბარათები",               // used to balance the random draw
  "brief": "კლიენტი მოვიდა ფილიალში…",   // ticket text shown at the top
  "customer": {
    "name": "ნინო ბერიძე", "gender": "f", "age": 34,       // gender f|m, age 60+ = grey hair + glasses
    "segment": "საცალო", "occupation": "მასწავლებელი", "income": "1,800 ₾",
    "productsHeld": ["სადებეტო ბარათი"],                      // CRM "products" tab
    "digital": "მობილბანკი არ აქვს",                            // CRM profile
    "notes": "ბოლო 3 თვეში 4-ჯერ მოვიდა…",                      // CRM "notes" tab: put sales cues here
    "initialMood": -1                                         // -3 (furious) … 3 (delighted)
  },
  "opportunities": [                  // hidden sales opportunities (for the report)
    { "id": "o_mobile", "product": "P_MOBILE", "cue": "კლიენტი ხშირად მოდის კომუნალურების გადასახდელად" }
  ],
  "start": "n1",
  "nodes": { "n1": { … }, "n2": { … }, "end_ok": { … } }
}
```

### Node (one customer turn)

| field | meaning |
|---|---|
| `say` | What the customer says. |
| `system` | Optional system or CRM note shown in a yellow strip *before* the customer line (for example "Identification successful. The system shows…"). Use it to reveal information the employee would see on screen. |
| `type` | `"product"` renders options as product cards (each option should have `product`). Omit for normal dialogue. |
| `options` | 2–4 employee answers (max 6). |
| `end` | `true` for a final node: there are no options, and `say` is the customer's last line. |
| `outcome` | End nodes only: `resolved`, `unresolved`, `escalated` or `walkout`. |

### Option (one employee answer)

| field | meaning |
|---|---|
| `text` | The employee's line (Georgian). |
| `next` | ID of the next node. |
| `scores` | `{ "knowledge": n, "service": n, "sales": n }`. Integers, usually **−3 … +3**. Omitted skills count as 0. |
| `mood` | Change in the customer's mood, usually −2 … +2. The avatar's face is the **only** visible mood signal. |
| `product` | Product id, for `type: "product"` nodes or for any answer that offers a product. |
| `opportunity` | The opportunity id this answer captures (it marks the sales chance as taken). |
| `critical` | `{ "skill": "knowledge" | "service" | "sales", "reason": "…" }` for compliance breaches, mis-selling, wrong facts or ignoring fraud. It applies a heavy penalty, and the reason appears in the report. |
| `feedback` | Shown in the final report next to the employee's choice. |

### Authoring rules
1. **The best answer at every step must have the highest total** (knowledge + service + sales) in its node. The engine treats the highest-total, non-critical option as "best", and uses the path of best answers as 100%.
2. Make wrong answers *plausible*. Common good patterns are:
   - right tone with a wrong fact (service +, knowledge −)
   - right fact with a cold tone (knowledge +, service −)
   - the right product offered at the wrong moment (sales −)
3. Put **sales cues** in the dialogue *and/or* the CRM (`notes`, `productsHeld`, `income`). Reward spotting them with `sales` points plus `opportunity`.
4. Penalise **pushy selling** (offering to an angry or vulnerable customer, or an unrelated product) with negative `sales` and `service`.
5. Use `critical` sparingly: real compliance or ethics failures only.
6. Every path must reach an `end` node, and avoid loops.
7. Keep a case to 3–6 decisions. Long cases tire people and dilute the score.
8. Answer order is shuffled in the game, so write options in any order.
9. Every product fact used in a case must also appear in `products`, so the reference panel can answer it.

### Mood and walk-out
Mood goes from −3 to 3 and starts at `initialMood`. When the customer is already at −3 and another answer has a negative `mood`, the customer **walks out** and the case ends early (this can be switched off in Settings). An angry customer therefore always gives one visible warning first.

---

## 3. Product or procedure

```json
{ "id": "P_DEPOSIT", "type": "product", "category": "ანაბრები", "name": "ვადიანი ანაბარი",
  "short": "ფიქსირებული ვადა, მაღალი განაკვეთი.",
  "conditions": [ { "label": "განაკვეთი (12 თვე)", "value": "10% წლიური" } ] }
```
`type: "procedure"` items (KYC rules, fraud steps, the dispute process) appear in the reference panel but not as product choices.

## 4. Quiz question (add-on)

```json
{ "id": "Q01", "level": 1, "question": "…", "options": ["…", "…", "…", "…"], "correct": 2, "points": 2, "explanation": "…" }
```
`correct` is the **0-based** index of the right option. `level: 0` means the question can be drawn on any level. Correct answers add to the **Product knowledge** score.

---

## 5. Excel template

The builder reads and writes a workbook with these sheets. Use **Download Excel template** in the builder to get one pre-filled with the sample cases. Every case uses three sheets (`Cases`, `Nodes`, `Options`), linked by `case_id` and `node_id`.

| Sheet | Columns |
|---|---|
| **Cases** | case_id, title, level, channel, category, brief, start_node, customer_name, gender, age, segment, occupation, income, products_held (`;`-separated), digital, notes, initial_mood |
| **Opportunities** | case_id, opportunity_id, product_id, cue |
| **Nodes** | case_id, node_id, type (`dialogue` / `product` / `end`), system, say, outcome (end nodes) |
| **Options** | case_id, node_id, text, next, knowledge, service, sales, mood, product_id, opportunity_id, critical_skill, critical_reason, feedback |
| **Products** | product_id, type, category, name, short, conditions (one `label: value` per line, or separated by `|`) |
| **Quiz** | quiz_id, level, question, option_1 … option_6, correct (**1-based** here), points, explanation |
| **Levels** | id, name, description, cases_per_run, quiz_questions, pass_threshold |
| **Settings** | key, value (for example `features.quiz` = `false`) |

Sheets you leave out are not touched by the import, so a workbook with only `Cases`, `Nodes` and `Options` adds cases and keeps everything else.

---

## 6. How scores are calculated

For each skill (knowledge, service, sales):

```
maximum   = sum of that skill's points along the case's ideal path (the best answer at every step)
earned    = sum of the points of the answers actually chosen (it can be negative)
skill %   = earned ÷ maximum, pooled over all cases (and quiz questions, for knowledge) in the scope,
            minus  criticalPenalty × number of critical errors on that skill (default 15 points each),
            clamped to 0–100
overall % = plain average of the skills that had a non-zero maximum
```
- A **level** passes when its overall % is at least the level's `passThreshold`.
- The **LMS score** (`cmi.core.score.raw`) is the overall % of the evaluation run. Each skill % is sent as its own objective.
- If a skill has no possible points in the whole scope but the employee still lost points on it (for example pushy selling in service-only cases), that skill gets 100 − 10 per negative point − penalties.

To change the evaluation logic later, edit `aggregate()` and `skillPct()` in `player/js/engine.js`. Most changes, though, only need different `scores` on the options plus the `config.scoring` settings.

---

## 7. Prompt template for converting interactions into cases

> You are converting real bank customer-service interactions into training cases for a branching, multiple-choice simulator. Follow `CASE_FORMAT.md` exactly and output a JSON **array of cases** only.
> For each interaction:
> 1. Remove personal data. Invent a Georgian name, change amounts and dates slightly, and never copy account numbers, ID numbers or phone numbers.
> 2. Choose `level` (1 = simple request with a calm customer, 2 = sales opportunity or an unhappy customer, 3 = vulnerable customer, fraud risk or complex advice), plus `channel` and `category`.
> 3. Build 3–6 decision nodes. At each node write one best answer and 2–3 realistic weaker ones, based on what employees really said, including the mistakes seen in the logs.
> 4. Score every option on knowledge, service and sales (−3 … +3). The best answer must have the highest total. Mark compliance, mis-selling and fraud-ignoring answers as `critical` with a reason.
> 5. Put sales cues in the dialogue or the CRM notes, and list them in `opportunities`. The answer that offers the right product gets the `opportunity` id.
> 6. Only use product facts from this product list: «paste the products JSON». If a fact is missing, add a product or procedure entry in a separate `products` array.
> 7. Write a short Georgian `feedback` for every non-best option, explaining what was wrong.
