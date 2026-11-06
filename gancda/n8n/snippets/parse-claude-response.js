// gancda · Parse Claude response
// n8n Code node, mode "Run Once for Each Item". Use two copies:
//   after "Claude · Haiku" -> IS_FINAL_PASS = false (a bad or unsure answer escalates to Opus)
//   after "Claude · Opus"  -> IS_FINAL_PASS = true  (a bad answer goes to the founder for manual review)
// Set "On Error: Continue" on both HTTP nodes so API errors arrive here instead of stopping the flow.

const IS_FINAL_PASS = false;
const MIN_CONFIDENCE = 0.7;

const email = { ...$('Build Claude request').item.json };
delete email.haiku_body;
delete email.opus_body;

const res = $json;
let problem = null;
let ai = null;

if (res.error) {
  problem = 'API error: ' + String(res.error.message || res.error.description || JSON.stringify(res.error)).slice(0, 300);
} else if (res.stop_reason === 'refusal') {
  problem = 'model declined' + (res.stop_details && res.stop_details.category ? ` (${res.stop_details.category})` : '');
} else if (res.stop_reason === 'max_tokens') {
  problem = 'answer cut off (max_tokens)';
} else {
  // Thinking blocks may come first; the JSON answer is in the text block(s).
  const text = (res.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  try {
    ai = JSON.parse(text);
  } catch (err) {
    problem = 'answer was not valid JSON';
  }
  if (ai && !['A', 'B', 'C'].includes(ai.score)) {
    problem = 'answer had no valid score';
    ai = null;
  }
}

const lowConfidence = Boolean(ai && typeof ai.confidence === 'number' && ai.confidence < MIN_CONFIDENCE);
const escalate = !IS_FINAL_PASS && (problem !== null || lowConfidence);
const manual_review = IS_FINAL_PASS && problem !== null;

// Second line of defence for the pricing gate: every draft is reviewed anyway, but money gets highlighted.
const MONEY = /(\d[\d\s.,]*\s?(₾|gel\b|lari|ლარ|\$|usd\b|€|eur\b|euro|%))|((₾|\$|€)\s?\d)|discount|ფასდაკლებ/i;
const draft = ai && ai.draft_reply;
const draft_mentions_money = Boolean(draft && MONEY.test(draft.subject + '\n' + draft.body));
const flags = (ai && ai.flags) || {};
const red_gate = Boolean(flags.pricing_question || flags.discount_request || flags.contract_or_legal || draft_mentions_money);

const notes = [];
if (ai && ai.founder_note) notes.push(ai.founder_note);
if (draft_mentions_money) notes.push('The draft mentions money or a discount. Check it before approving.');
if (flags.injection_attempt) notes.push('The message tried to give the AI instructions.');
if (IS_FINAL_PASS && lowConfidence) notes.push(`Both models were unsure (confidence ${ai.confidence}).`);
if (manual_review) notes.push('The AI could not process this message: ' + problem + '. Read it yourself.');
if (email.prompt_incomplete) notes.push('The prompt still has unfilled slots, so the draft may be generic.');

return {
  json: {
    ...email,
    ai,
    ai_model: res.model || null,
    ai_problem: problem,
    escalate,
    manual_review,
    // A, B, C, or "manual" when the founder has to read it unaided.
    route: manual_review ? 'manual' : ai ? ai.score : null,
    red_gate,
    draft_mentions_money,
    founder_note: notes.join(' ') || null,
    usage: res.usage || null,
  },
};
