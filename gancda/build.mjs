// Regenerates the files that embed other files, so there is one source for each text:
//   n8n/snippets/build-claude-request.js  <- template + prompts/system-prompt.txt + prompts/output-schema.json
//   n8n/monday-digest.json                <- n8n/snippets/monday-digest.js
// Run from anywhere:  node gancda/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

// 1. Claude request builder
const prompt = read('prompts/system-prompt.txt').trim();
const schema = JSON.parse(read('prompts/output-schema.json'));
const template = read('n8n/snippets/build-claude-request.template.js');
const builder = template
  .replace('__SYSTEM_PROMPT__', () => '`' + prompt.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`')
  .replace('__OUTPUT_SCHEMA__', () => JSON.stringify(schema, null, 2));
writeFileSync(join(root, 'n8n/snippets/build-claude-request.js'), builder);

// 2. Monday digest workflow
const digestCode = read('n8n/snippets/monday-digest.js');
const auth = { authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth' };
const node = (id, name, type, typeVersion, position, parameters, extra = {}) => ({ id, name, type, typeVersion, position, parameters, ...extra });

const hubspotBody = `={{ JSON.stringify({
  filterGroups: [
    { filters: [{ propertyName: 'gancda_received_at', operator: 'GTE', value: String($now.minus({ days: 7 }).toMillis()) }] },
    { filters: [{ propertyName: 'gancda_approval_status', operator: 'EQ', value: 'pending' }] }
  ],
  properties: ['email', 'firstname', 'lastname', 'company', 'gancda_lead_score', 'gancda_source', 'gancda_language',
    'gancda_received_at', 'gancda_ack_sent_at', 'gancda_first_reply_at', 'gancda_approval_status', 'gancda_summary'],
  sorts: [{ propertyName: 'gancda_received_at', direction: 'DESCENDING' }],
  limit: 100
}) }}`;

const setting = (id, name, value, type = 'string') => ({ id, name, value, type });

const nodes = [
  node('6f1c1d0e-0001-4a10-9a01-000000000001', 'Setup notes', 'n8n-nodes-base.stickyNote', 1, [-460, -260], {
    width: 420,
    height: 400,
    content:
      '## gancda · Monday digest\nEvery Monday at 09:00 (Tbilisi time) this emails the founder new leads by score, drafts waiting for approval, response times and meetings booked.\n\n**Before activating**\n1. **Settings**: set `founder_email`, and `hubspot_portal_id` for links into HubSpot. Set `a_reply_sla_hours` from the Sales Workflow.\n2. **HubSpot leads**: credential *Header Auth*, Name `Authorization`, Value `Bearer <HubSpot private-app token>` (scope: crm.objects.contacts.read).\n3. **Calendly me / events**: credential *Header Auth*, Name `Authorization`, Value `Bearer <Calendly personal access token>`. If you skip Calendly, disable both nodes. The digest still sends.\n4. **Send to founder**: connect Gmail.\n5. Click **Execute workflow** once to test, then toggle **Active**.\n\nThe HubSpot properties this reads are listed in gancda/README.md.',
  }),
  node('6f1c1d0e-0001-4a10-9a01-000000000002', 'Monday 09:00', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 0], {
    rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * 1' }] },
  }),
  node('6f1c1d0e-0001-4a10-9a01-000000000003', 'Settings', 'n8n-nodes-base.set', 3.4, [220, 0], {
    mode: 'manual',
    assignments: {
      assignments: [
        setting('s1', 'founder_email', 'REPLACE_ME@example.com'),
        setting('s2', 'timezone', 'Asia/Tbilisi'),
        setting('s3', 'hubspot_portal_id', ''),
        setting('s4', 'hubspot_app_url', 'https://app.hubspot.com'),
        setting('s5', 'ack_sla_minutes', 5, 'number'),
        setting('s6', 'a_reply_sla_hours', 24, 'number'),
        setting('s7', 'mark_png_url', 'https://gancda.com/brand/gancda-mark-120.png'),
      ],
    },
    options: {},
  }),
  node('6f1c1d0e-0001-4a10-9a01-000000000004', 'HubSpot leads', 'n8n-nodes-base.httpRequest', 4.2, [440, 0], {
    method: 'POST',
    url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
    ...auth,
    sendBody: true,
    specifyBody: 'json',
    jsonBody: hubspotBody,
    options: { timeout: 30000 },
  }, { onError: 'continueRegularOutput' }),
  node('6f1c1d0e-0001-4a10-9a01-000000000005', 'Calendly me', 'n8n-nodes-base.httpRequest', 4.2, [660, 0], {
    url: 'https://api.calendly.com/users/me',
    ...auth,
    options: { timeout: 30000 },
  }, { onError: 'continueRegularOutput' }),
  node('6f1c1d0e-0001-4a10-9a01-000000000006', 'Calendly events', 'n8n-nodes-base.httpRequest', 4.2, [880, 0], {
    url: 'https://api.calendly.com/scheduled_events',
    ...auth,
    sendQuery: true,
    queryParameters: {
      parameters: [
        { name: 'user', value: "={{ $json.resource?.uri ?? '' }}" },
        { name: 'min_start_time', value: '={{ $now.minus({ days: 7 }).toUTC().toISO() }}' },
        { name: 'status', value: 'active' },
        { name: 'sort', value: 'start_time:asc' },
        { name: 'count', value: '100' },
      ],
    },
    options: { timeout: 30000 },
  }, { onError: 'continueRegularOutput' }),
  node('6f1c1d0e-0001-4a10-9a01-000000000007', 'Build digest', 'n8n-nodes-base.code', 2, [1100, 0], { jsCode: digestCode }),
  node('6f1c1d0e-0001-4a10-9a01-000000000008', 'Send to founder', 'n8n-nodes-base.gmail', 2.1, [1320, 0], {
    operation: 'send',
    sendTo: '={{ $json.to }}',
    subject: '={{ $json.subject }}',
    emailType: 'html',
    message: '={{ $json.html }}',
    options: { appendAttribution: false },
  }),
];

const chain = ['Monday 09:00', 'Settings', 'HubSpot leads', 'Calendly me', 'Calendly events', 'Build digest', 'Send to founder'];
const connections = {};
for (let i = 0; i < chain.length - 1; i++) {
  connections[chain[i]] = { main: [[{ node: chain[i + 1], type: 'main', index: 0 }]] };
}

const workflow = {
  name: 'gancda · Monday digest',
  nodes,
  connections,
  active: false,
  settings: { executionOrder: 'v1', timezone: 'Asia/Tbilisi' },
  pinData: {},
};
writeFileSync(join(root, 'n8n/monday-digest.json'), JSON.stringify(workflow, null, 2) + '\n');
console.log('wrote n8n/snippets/build-claude-request.js and n8n/monday-digest.json');
