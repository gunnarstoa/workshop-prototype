import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType
} from 'docx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { injectIntoTemplate } from './inject-into-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const guideDir = path.join(projectRoot, 'guide');
fs.mkdirSync(guideDir, { recursive: true });

const academy = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/lib/data/academy-courses.json'), 'utf8'));
const ilt = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/lib/data/ilt-workshops.json'), 'utf8'));
const specialist = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/lib/data/specialist-engagements.json'), 'utf8'));

const NAVY = '0A2F46'; const ORANGE = 'FF6100';

function h1(t) { return new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 160 } }); }
function h2(t) { return new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 } }); }
function h3(t) { return new Paragraph({ text: t, heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 100 } }); }
function body(t) { return new Paragraph({ spacing: { before: 40, after: 100 }, children: [new TextRun({ text: t, size: 22 })] }); }
function bodyBold(b, r) { return new Paragraph({ spacing: { before: 40, after: 100 }, children: [new TextRun({ text: b, bold: true, size: 22 }), new TextRun({ text: r, size: 22 })] }); }
function bullet(t) { return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] }); }
function bulletBold(b, r) { return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: b, bold: true, size: 22 }), new TextRun({ text: r, size: 22 })] }); }
function prompt(t) { return new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: 'DISCUSS  |  ', bold: true, size: 18, color: ORANGE }), new TextRun({ text: t, italics: true, size: 22, color: ORANGE })] }); }
function inputLabel(t) {
  const stripped = t.replace(/^Workshop Input\s*[—-]\s*/i, '');
  return new Paragraph({ spacing: { before: 140, after: 60 }, children: [new TextRun({ text: 'WORKSHOP INPUT  |  ', bold: true, size: 18, color: NAVY }), new TextRun({ text: stripped, bold: true, size: 22, color: NAVY })] });
}
function slideRef(n, title) {
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: `Prototype Reference  `, bold: true, size: 18, color: '888888' }), new TextRun({ text: `Slide ${n}: ${title}`, italics: true, size: 18, color: '888888' })] });
}
function blankLines(n) { const l = []; for (let i = 0; i < n; i++) l.push(new Paragraph({ children: [new TextRun({ text: '_______________________________________________________________________________', size: 20, color: 'CCCCCC' })] })); return l; }
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

function tbl(headers, rows) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: 'D8D6D0' };
  const borders = { top: b, bottom: b, left: b, right: b };
  const w = Math.floor(9000 / headers.length);
  const hCells = headers.map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: 'FFFFFF' })] })], shading: { fill: NAVY, type: ShadingType.SOLID }, borders, width: { size: w, type: WidthType.DXA } }));
  const dRows = rows.map(row => new TableRow({ children: row.map(cell => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cell, size: 18 })] })], borders, width: { size: w, type: WidthType.DXA } })) }));
  return new Table({ rows: [new TableRow({ children: hCells }), ...dRows], width: { size: 9000, type: WidthType.DXA } });
}

function emptyTbl(headers, n = 5) { const rows = []; for (let i = 0; i < n; i++) rows.push(headers.map(() => '')); return tbl(headers, rows); }

// RACI table with 5 columns: Activity, R, A, C, I — populated from slide 12 data
function raciTbl5(rows) {
  return tbl(['Activity', 'R — Responsible', 'A — Accountable', 'C — Consulted', 'I — Informed'], rows);
}

// Blank RACI table with full 7-role headers (for workshop fill-in exercises)
function raciTable(activities) {
  const headers = ['Activity', 'Academy', 'Partner Success', 'Prof. Services', 'Partner Leadership', 'Partner Resource', 'Product'];
  return tbl(headers, activities);
}

function buildDoc() {
  const c = [];

  // ── Slide Map Reference ──
  c.push(h1('Prototype Slide Reference'));
  c.push(body('This guide is built around the 17-slide Connected Enablement prototype. Each section below maps to one or more slides. Facilitators should advance the prototype in sync with the workshop flow.'));
  c.push(tbl(['#', 'Slide Title', 'Workshop Section', 'Mode'], [
    ['1',  'Homework',                         'Pre-Workshop',            'Reference / Async'],
    ['2',  'Connected Enablement',             'Part 1 — The Three Pillars', 'Present'],
    ['3',  'Objectives',                        'Part 1 — The Three Pillars', 'Present'],
    ['4',  'Questions',                         'Throughout',             'Facilitation Check'],
    ['5',  'Big Rocks',                         'Part 2 — Current State',  'Discuss'],
    ['6',  'Select Your Role',                  'Part 3 — Roles',         'Interactive'],
    ['7',  'The Framework',                     'Part 4 — Three-Layer Framework', 'Interactive Build'],
    ['8',  'Three Layers Over Time',            'Part 4 — Three-Layer Framework', 'Interactive'],
    ['9',  'Your Enablement Journey',           'Part 5 — Journeys',      'Interactive'],
    ['10', 'Our Products',                      'Part 6 — Enablement Assets', 'Reference'],
    ['11', 'Individual Role Paths — Admin View','Part 5 — Journeys',      'Deep Dive'],
    ['12', 'Who Owns What?',                    'Part 7 — Governance & RACI', 'Present'],
    ['13', 'RACI Matrix',                       'Part 7 — Governance & RACI', 'Workshop Fill-In'],
    ['14', 'Content Coverage Gap',             'Part 8 — Gaps & Priorities', 'Data'],
    ['15', 'Hands-On Technical Workshops',     'Part 9 — Asset Design',   'Example'],
    ['16', 'Facilitator Dashboard',            'Part 9 — Asset Design',   'Demo'],
    ['17', 'PSM Activity Map',                  'Part 10 — PSM Model',    'Interactive'],
  ]));
  c.push(pb());

  // ── Agenda ──
  c.push(h1('Workshop Agenda'));
  c.push(tbl(['#', 'Topic', 'Prototype Slides', 'Focus'], [
    ['Part 1',  'The Three Pillars',           '2–3',   'Pipeline Growth, Technical Expertise, Delivery Excellence'],
    ['Part 2',  'Current State — The Big Rocks', '4–5', 'Friction, gaps, and what the group agrees needs to change'],
    ['Part 3',  'Roles',                        '6, 11', 'Who needs a journey — 14 roles across 5 categories'],
    ['Part 4',  'The Three-Layer Framework',   '7–8',   'Assets → Journeys → Achievements; the build-up interactive'],
    ['Part 5',  'Journeys & Progression',      '9, 11', 'Stages, gates, activities, and role-specific paths'],
    ['Part 6',  'Enablement Assets',           '10, 15–16', 'Current library, gaps, and what great looks like'],
    ['Part 7',  'Achievements & Designations', '7 (step 14–15)', 'What partners earn; composition and recognition'],
    ['Part 8',  'Governance & RACI',           '12–13', 'Who decides, who builds, who approves, who delivers'],
    ['Part 9',  'Content Coverage Gap',        '14',    'Where current Academy content falls short of journey needs'],
    ['Part 10', 'PSM Activity & Resource Model','17',   'Where PSM time goes today; future model'],
    ['Part 11', 'Interactive Exercises',       'All',   'Quadrants, dot voting, card sorts, empathy maps, before/after'],
    ['Part 12', 'Day 2: Stakeholder Sessions', 'All',   'Academy, PS, PSMs, Sales Ops, CS, Product, Leadership'],
    ['Part 13', 'Next Steps & Prioritization', 'All',   'What to build first — 30/60/90 day action plan'],
  ]));
  c.push(pb());

  // ── Part 1: The Three Pillars ──
  c.push(h1('Part 1 — The Three Pillars'));
  c.push(slideRef(2, 'Connected Enablement'));
  c.push(slideRef(3, 'Objectives'));
  c.push(body('Connected Enablement is built on three pillars. Every journey, every asset, and every achievement should trace back to at least one of these outcomes. The framework exists to drive measurable partner performance across all three.'));

  c.push(h2('Pipeline Growth'));
  c.push(body('Equip partner sales and pre-sales teams to identify, qualify, position, present, and close Anaplan opportunities with confidence across every product and industry. A partner with an enabled, certified Sales team generates pipeline. An unenabled one waits for Anaplan to bring the deal.'));
  c.push(body('Outcome callout on slide 2: Increase Pipeline'));

  c.push(h2('Technical Expertise'));
  c.push(body("Build deep, certified capability across model building, application configuration, solution architecture, and the Anaplan platform. Technical expertise is the prerequisite for delivery quality — a partner can't deliver what they don't deeply know."));
  c.push(body('Outcome callout on slide 2: Win Rates'));

  c.push(h2('Delivery Excellence'));
  c.push(body("Ensure every client engagement meets Anaplan's quality bar — from supervised delivery through independent practice. Delivery excellence turns first implementations into references, expansions, and multi-year partnerships."));
  c.push(body('Outcome callout on slide 2: Delivery Quality'));

  c.push(h2('Workshop Objectives'));
  c.push(body('The four objectives displayed on slide 3 frame what the group commits to accomplish together:'));
  c.push(bulletBold('1. Define from/to: ', 'Articulate what must change — current state pain points mapped to the future state model.'));
  c.push(bulletBold('2. Validate and prioritize: ', 'Review the journey maps built to date; align on which are most critical to complete first.'));
  c.push(bulletBold('3. Prioritize Day 2 work: ', 'Identify the specific actions each business unit will commit to for the next 30/60/90 days.'));
  c.push(bulletBold('4. Execute the future state roadmap: ', 'Leave with an owner, a date, and a decision for every open item.'));

  c.push(prompt('Before starting: run the Before/After Self-Assessment (Exercise H in Part 11). Capture baseline scores. Revisit at the end of the day.'));
  c.push(prompt('Which of the three pillars is most underdeveloped in your partner ecosystem today? Which one would have the biggest impact if improved?'));
  c.push(inputLabel('Success Indicators by Pillar'));
  c.push(emptyTbl(['Pillar', 'Success Indicator', 'How Measured', 'Current Baseline', 'Target'], 6));
  c.push(pb());

  // ── Part 2: Current State — The Big Rocks ──
  c.push(h1('Part 2 — Current State: The Big Rocks'));
  c.push(slideRef(4, 'Questions'));
  c.push(slideRef(5, 'Big Rocks'));
  c.push(body('Before designing the future state, the group must reach shared agreement on what is broken today. Slide 5 presents thirteen "big rocks" — the friction points most commonly cited by PSMs, partners, and stakeholders when describing the current enablement experience.'));
  c.push(body('These are not hypothetical. They were surfaced directly from the field and from internal stakeholder conversations. Use this section to validate, rank, and add to the list before moving forward.'));

  c.push(h2('The Thirteen Big Rocks'));
  c.push(tbl(['#', 'Friction Point', 'Layer Affected', 'Discussion Notes'], [
    ['1',  'Blueprints and journeys are not flexible',            'Layer 2',   ''],
    ['2',  'Content maturity and availability',                   'Layer 1',   ''],
    ['3',  'Good on delivery, not so good on pre-sales',          'Layer 2',   ''],
    ['4',  'Metrics — no consistent measurement',                 'All',       ''],
    ['5',  'Scale — model cannot grow with partner base',         'All',       ''],
    ['6',  'Ownership — unclear who is responsible',             'All',       ''],
    ['7',  'RACI on enablement is undefined',                     'All',       ''],
    ['8',  'Not self-serve — everything requires PSM involvement','Layer 1',   ''],
    ['9',  'Access control — wrong people see wrong content',     'Layer 1',   ''],
    ['10', 'PSM = low value, high touch',                         'Governance',''],
    ['11', 'No reuse — every engagement starts from scratch',     'Layer 1',   ''],
    ['12', 'Everyone does everything — no specialization',        'Layer 2',   ''],
    ['13', 'People and change management',                        'All',       ''],
  ]));

  c.push(h2('Facilitation Guide'));
  c.push(body('Display slide 5. Give the group 3 minutes to read silently. Then:'));
  c.push(bullet('Ask: "Is anything missing from this list that you consider a bigger problem?"'));
  c.push(bullet('Dot-vote (use Exercise B from Part 11) on the top 3 most painful.'));
  c.push(bullet('For each of the top 3: capture why it is painful, what it costs (partner time, pipeline, quality), and what solving it would unlock.'));

  c.push(prompt('Which of these is costing the most in partner trust, pipeline, or delivery quality right now?'));
  c.push(prompt('Which ones are symptoms of deeper root causes? (e.g., "no reuse" and "everyone does everything" may both trace back to undefined roles and missing journey structure)'));
  c.push(prompt('Which would be solved automatically if the Connected Enablement framework were fully in place?'));

  c.push(h2('From Big Rocks to Design Decisions'));
  c.push(body('Each big rock should map to a design decision in the workshop. Use this table to close the loop.'));
  c.push(tbl(['Big Rock', 'Root Cause', 'Framework Response', 'Owner', 'Priority'], [
    ['Blueprints not flexible',        '', 'Modular journey structure with configurable stage content', '', ''],
    ['Content gaps',                   '', 'Layer 1 inventory + gap analysis + prioritized backlog',   '', ''],
    ['Weak pre-sales enablement',      '', 'Dedicated Pre-Sales role journey with discovery & demo stages', '', ''],
    ['No metrics',                     '', 'Journey-stage KPIs tied to pipeline, quality, and CSAT',   '', ''],
    ['Cannot scale',                   '', 'Self-service Layer 1 + prescriptive journeys + clear RACI', '', ''],
    ['Ownership unclear',              '', 'Defined RACI per layer — see Part 8',                      '', ''],
    ['Not self-serve',                 '', 'Academy courses as the primary Layer 1 vehicle',            '', ''],
    ['PSM = low value, high touch',    '', 'Automate routine assignments; PSM focuses on gate review and coaching', '', ''],
    ['No reuse',                       '', 'Asset tagging + journey assembly from shared library',     '', ''],
    ['Everyone does everything',       '', 'Role-specific journeys with clear scope per role',         '', ''],
  ]));
  c.push(pb());

  // ── Part 3: Roles ──
  c.push(h1('Part 3 — Roles'));
  c.push(slideRef(6, 'Select Your Role'));
  c.push(slideRef(11, 'Individual Role Paths — Admin View'));
  c.push(body('A partner organization is made up of many roles — each with a different relationship to Anaplan, a different enablement need, and a different definition of success. The framework recognizes three primary role categories visible in the prototype, plus a broader taxonomy of fourteen roles.'));

  c.push(h2('The Three Primary Roles (Slide 6)'));
  c.push(body('Slide 6 presents the three partner-facing roles as interactive cards. Selecting a role reveals a five-stage journey with sample tasks at each stage.'));

  c.push(h3('Sales'));
  c.push(body('Identify, qualify, and close Anaplan opportunities with confidence across every product and industry.'));
  c.push(tbl(['Stage', 'Sample Tasks'], [
    ['Registered',  'Join the partner portal · Complete Connected Planning overview · Attend Anaplan sales kickoff'],
    ['Trained',     'Anaplan Way — Sales Motion · Application value proposition (focus area) · Discovery for Sellers workshop'],
    ['Certified',   'Pass Sales certification · Business Case Development · Competitive Positioning'],
    ['Delivering',  'Deliver first qualified discovery meeting · Close first partner-led opportunity · Earn GTM Blueprint'],
    ['Expert',      'Consistent pipeline generation · Coach junior sellers · Drive strategic accounts'],
  ]));

  c.push(h3('Pre-Sales'));
  c.push(body('Support the sales cycle with technical credibility — demos, solutioning, and proof of concept across all Anaplan products.'));
  c.push(tbl(['Stage', 'Sample Tasks'], [
    ['Registered',  'Join the partner portal · Complete Anaplan Essentials · Request demo environment access'],
    ['Trained',     'Level 1 Model Building · Application Demo Mastery (focus area) · SC/Finance Discovery Framework'],
    ['Certified',   'Pass Pre-Sales certification · Gap-Fit Analysis Methodology · Technical Objection Handling'],
    ['Delivering',  'Deliver 3 coached application demos · Architect first client solution · POC Development & Delivery'],
    ['Expert',      'Lead complex multi-app solutions · Mentor other pre-sales resources · Architect enterprise-scale solutions'],
  ]));

  c.push(h3('Delivery'));
  c.push(body('Build deep, certified delivery capability and consistently meet client expectations on every engagement.'));
  c.push(tbl(['Stage', 'Sample Tasks'], [
    ['Registered',  'Join the partner portal · Complete resource profile · Begin Anaplan Essentials'],
    ['Trained',     'Level 1 Model Building · Application Overview (focus area) · Attend Delivery Workshop'],
    ['Certified',   'Pass L1 Model Builder Certification · Application Configurator · Delivery Blueprint'],
    ['Delivering',  'Complete first supervised client project · Earn Anaplan SA scorecard · Pass peer review'],
    ['Expert',      'Lead independent client deliveries · Mentor junior delivery resources · Earn Connected Planning designation'],
  ]));

  c.push(h2('Extended Role Taxonomy (14 Roles)'));
  c.push(body('The full partner ecosystem spans fourteen roles in five categories. Every role that touches an Anaplan engagement — commercial, technical, or advisory — should have an enablement journey.'));

  c.push(h3('Business Development'));
  c.push(bulletBold('Sales — ', 'Builds pipeline, qualifies, presents the value proposition, closes deals.'));
  c.push(bulletBold('Marketing — ', 'Drives demand generation, content, events, and co-marketing with Anaplan.'));
  c.push(bulletBold('Pre-Sales Technical — ', 'Leads technical discovery, delivers demos, architects proposed solutions.'));

  c.push(h3('Delivery'));
  c.push(bulletBold('Model Builder — ', 'Builds and configures Anaplan models for client deployments.'));
  c.push(bulletBold('Solution Architect — ', 'Designs scalable Anaplan solutions across domains.'));
  c.push(bulletBold('Program Management — ', 'Orchestrates multi-workstream programs and portfolios of engagements.'));
  c.push(bulletBold('Delivery Lead — ', 'Runs projects: SOWs, sprints, resourcing, client communication.'));

  c.push(h3('Advisory'));
  c.push(bulletBold('Change Management — ', 'Guides clients through planning transformation and adoption.'));
  c.push(bulletBold('Industry Lead — ', 'Drives industry-specific GTM, solution strategy, and reference development.'));
  c.push(bulletBold('Data Architect — ', 'Designs client data model, hub strategy, and cloud data platform alignment.'));
  c.push(bulletBold('Data Integration — ', 'Moves data into and out of Anaplan reliably — ADO, CloudWorks, APIs, ETL.'));

  c.push(h3('Client Management'));
  c.push(bulletBold('Client Account Lead — ', 'Owns the commercial relationship, orchestrates delivery, and drives expansion.'));
  c.push(bulletBold('Technical Account Lead — ', 'Client-facing technical advisor on solution direction, roadmap, and escalations.'));

  c.push(h3('Practice Management'));
  c.push(bulletBold('Anaplan Practice Lead — ', 'Practice strategy, growth, hiring, tiering, and business planning.'));

  c.push(h2('RACI — Role Definition & Journey Assignment'));
  c.push(raciTable([
    ['Define which roles get dedicated journeys',   '', '', '', '', '', ''],
    ['Validate role definitions with partners',     '', '', '', '', '', ''],
    ['Assign a partner resource to the correct role', '', '', '', '', '', ''],
    ['Approve role changes / additions',            '', '', '', '', '', ''],
    ['Map existing partner resources to roles',     '', '', '', '', '', ''],
  ]));

  c.push(prompt('Does this taxonomy capture your partner ecosystem? Are there roles missing — Executive Sponsor, QA, Training Lead, Support?'));
  c.push(prompt('Where are the boundaries fuzziest? When does a senior Model Builder become a Solution Architect? When does Data Architect overlap with Data Integration?'));
  c.push(inputLabel('Additional or Modified Roles'));
  c.push(emptyTbl(['Role Name', 'Category', 'Responsibility', 'How It Differs From Existing', 'Priority'], 6));
  c.push(pb());

  // ── Part 4: The Three-Layer Framework ──
  c.push(h1('Part 4 — The Three-Layer Framework'));
  c.push(slideRef(7, 'The Framework (15-step interactive build)'));
  c.push(slideRef(8, 'Three Layers Over Time'));
  c.push(body('The Connected Enablement framework is built in three layers. Slide 7 walks through the assembly in 15 steps — click to advance. Use this slide as the central visual anchor for the workshop. Every concept introduced later (journeys, RACI, gaps) traces back to this model.'));

  c.push(h2('The Three Layers'));
  c.push(tbl(['Layer', 'Name', 'What It Contains', 'Who Consumes It'], [
    ['Layer 1', 'Enablement Assets',   'Self-Paced Academy courses, Capstone workshops, Masterclass & Continuous Learning', 'All roles, at the appropriate stage'],
    ['Layer 2', 'Journeys',            'Role × product paths; stages, gates, activities, and assigned assets', 'Individual partner resources + PSMs'],
    ['Layer 3', 'Achievements',        'Designations earned by completing combinations of journeys', 'Partners, customers, marketplace'],
  ]));

  c.push(h2('The Build Sequence (Slide 7 — 15 Steps)'));
  c.push(body('The prototype walks facilitators through the framework build step by step. Below is the step map for reference:'));
  c.push(tbl(['Steps', 'What Appears', 'Facilitator Talking Point'], [
    ['1–3',   'Layer 1: Asset types introduced',                   'We start with what we have. Three types of enablement assets, each with a different scale and cost profile.'],
    ['4–6',   'Layer 2: Journey structure introduced',              'Journeys are the connective tissue — they organize assets into a progression a partner can follow.'],
    ['7–9',   'Asset drag-and-drop into journey stages',           'Drag the assets to the right stage. This makes the framework tangible: every journey stage is an assembly of specific assets.'],
    ['10–12', 'Layer 3: Achievements introduced',                  'Achievements sit above journeys. You don\'t earn a designation by completing one course — you earn it by completing a combination of journeys.'],
    ['13',    'Step 14: Three featured achievements appear',        'Agentic Office of the CFO, Connected Financial Planning, Connected Supply Chain Planning — the three most strategic designations.'],
    ['14',    'Step 15: All eight achievements appear',             'The full achievement library. Partners can earn multiple. Journeys can contribute to multiple achievements.'],
  ]));

  c.push(h2('Three Layers Over Time (Slide 8)'));
  c.push(body('Slide 8 shows how the framework matures over a 12-month horizon. Drag the timeline marker to reveal how assets, journeys, and achievements appear progressively. Use this to set expectations: not everything is available Day 1.'));
  c.push(prompt('Which layer is furthest from being complete in your current state — assets, journeys, or achievements?'));
  c.push(prompt('If you had to pick one layer to make fully operational in 90 days, which would it be and why?'));
  c.push(inputLabel('Framework Maturity Assessment'));
  c.push(emptyTbl(['Layer', 'Current State (1–10)', 'Target State', 'Biggest Gap', 'First Action'], 3));
  c.push(pb());

  // ── Part 5: Journeys & Progression ──
  c.push(h1('Part 5 — Journeys & Progression'));
  c.push(slideRef(9, 'Your Enablement Journey'));
  c.push(slideRef(11, 'Individual Role Paths — Admin View'));
  c.push(body('A journey is a prescriptive, role-specific path through enablement. Defined by role × product area. Every journey shares the same five-stage structure — but the assets, activities, and gate criteria differ by role.'));

  c.push(h2('The Five Stages'));
  c.push(tbl(['Stage', 'Sales', 'Pre-Sales', 'Delivery', 'What It Means'], [
    ['1', 'Registered',  'Registered',  'Registered',  'Partner is enrolled, has portal access, and has begun foundational learning.'],
    ['2', 'Trained',     'Trained',     'Trained',     'Core coursework complete; ready to begin applied learning.'],
    ['3', 'Certified',   'Certified',   'Certified',   'Passed the relevant assessment or certification exam.'],
    ['4', 'Delivering',  'Delivering',  'Delivering',  'Actively applying skills in client-facing or supervised contexts.'],
    ['5', 'Expert',      'Expert',      'Expert',      'Demonstrated mastery; ready to lead and mentor others.'],
  ]));

  c.push(h2('Stage Content'));
  c.push(bulletBold('Assets — ', 'Self-paced courses, workshops, and masterclass & continuous learning engagements assigned to this stage.'));
  c.push(bulletBold('Activities — ', 'Hands-on tasks: "deliver a coached demo," "complete a supervised project," "close first partner-led opportunity."'));
  c.push(bulletBold('Milestones — ', 'Observable checkpoints: "L1 certification passed," "first client delivery complete," "SA scorecard earned."'));
  c.push(bulletBold('Outcomes — ', 'The capability a partner has demonstrated by completing this stage.'));

  c.push(h2('Gates'));
  c.push(body('Gates are quantified criteria to progress from one stage to the next. They ensure quality and prevent advancement without demonstrated capability.'));
  c.push(tbl(['Transition', 'Gate Criteria (Delivery Role)', 'Evaluation Owner'], [
    ['Registered → Trained',    'All assigned Level 1 coursework complete',                   'System (auto)'],
    ['Trained → Certified',     'L1 Model Builder certification passed',                       'Academy / PSM'],
    ['Certified → Delivering',  '≥ 2 supervised projects; SA scorecard ≥ 4.0',                'Professional Services'],
    ['Delivering → Expert',     '≥ 4 independent deliveries; CSAT ≥ 4.0; peer review passed', 'PSM + PS'],
  ]));

  c.push(h2('The Wizard (Slide 9)'));
  c.push(body('Slide 9 is the partner-facing journey builder. It walks a user through: (1) select role category, (2) select specific persona, (3) answer a focus-area question, (4) view your multi-stage journey with tasks and gate criteria unlocked level-by-level. Use this in the workshop to demonstrate what a partner actually experiences.'));
  c.push(body('The Admin View (slide 11) shows the same journeys from the PSM perspective — 12 distinct role journeys with tabs, stage progression strips, and collapsible detail views.'));

  c.push(h2('RACI — Journey Lifecycle'));
  c.push(body('From slide 12. Pre-populated with current ownership assignments.'));
  c.push(raciTbl5([
    ['Define role journey structure & stages',        'PSM',     'PSM',     'Acad',    'P.Lead'],
    ['Define stage gates & progression criteria',    'PSM',     'PSM',     'ProfSvc', 'P.Lead'],
    ['Governance & sign-off on journeys',            'P.Lead',  'P.Lead',  'PSM',     'Field Leadership'],
    ['Assign partners to journey paths',             'PSM',     'PSM',     'P.Lead',  'P.Res'],
    ['Complete journey tasks & submit evidence',     'P.Res',   'PSM',     'ProfSvc', 'P.Lead'],
    ['Approve stage progression',                    'ProfSvc', 'PSM',     'P.Lead',  'P.Res'],
    ['Monitor journey health & completion rates',    'PSM',     'PSM',     'Acad',    'P.Lead'],
  ]));

  c.push(prompt('How many stages? Too few = meaningless, too many = bureaucratic.'));
  c.push(prompt('Who has final approval authority on gate progression — PSM, SA, or a committee? How are disputes handled?'));
  c.push(prompt('How do journeys differ across product areas — same stages with different content, or fundamentally different structures?'));
  c.push(inputLabel('Journey Definitions'));
  c.push(emptyTbl(['Journey (Role + Product)', 'Stage 1 Assets', 'Stage 2 Assets', 'Stage 3 Gate', 'Stage 4 Gate', 'Stage 5 Output'], 6));
  c.push(inputLabel('Gate Criteria — To Complete'));
  c.push(emptyTbl(['From Stage', 'To Stage', 'Metric', 'Threshold', 'Who Validates', 'Approval Process'], 8));
  c.push(pb());

  // ── Part 6: Enablement Assets ──
  c.push(h1('Part 6 — Enablement Assets'));
  c.push(slideRef(10, 'Our Products'));
  c.push(slideRef(15, 'Hands-On Technical Workshops'));
  c.push(slideRef(16, 'Facilitator Dashboard'));
  c.push(body('Enablement assets are the building blocks of Layer 1. Every journey stage is assembled from these assets. Three categories exist today — but are they sufficient, current, and journey-ready?'));

  c.push(h2('Self-Paced Academy'));
  c.push(body(`The Academy currently offers ${academy.courses.length} partner-accessible courses. These are always available, self-service, and scalable — but are they role-appropriate, current, and journey-ready?`));
  const catalogs = {};
  academy.courses.forEach(co => { const k = co.catalog || 'Other'; if (!catalogs[k]) catalogs[k] = []; catalogs[k].push(co); });
  for (const [cat, courses] of Object.entries(catalogs).sort((a, b) => b[1].length - a[1].length)) {
    c.push(h3(`${cat} (${courses.length})`));
    courses.forEach(co => c.push(bullet(co.name)));
  }

  c.push(h2('Instructor-Led / Capstone Workshops'));
  c.push(body(`${ilt.workshops.length} workshops delivered by PSMs, SAs, and subject matter experts. High-touch, scheduled, application-specific. Capstone workshops include hands-on lab environments where partners work in real Anaplan workspaces with real data.`));
  ilt.workshops.forEach(w => c.push(bullet(w.name)));

  c.push(h2('Masterclass & Continuous Learning'));
  c.push(body(`${specialist.engagements.length} masterclass & continuous learning engagements — the highest-value, most customized enablement touchpoints. Expert-led, qualification-gated, limited capacity.`));
  const engCats = {};
  specialist.engagements.forEach(e => { const k = e.category; if (!engCats[k]) engCats[k] = []; engCats[k].push(e); });
  for (const [cat, engs] of Object.entries(engCats)) {
    c.push(h3(`${cat} (${engs.length})`));
    engs.forEach(e => c.push(bullet(e.name)));
  }

  c.push(h2('What Great Looks Like (Slides 15–16)'));
  c.push(body('Slide 15 shows the RPM Workshop as a case study: real Anaplan workspaces, real financial data, real configuration tasks. The facilitator dashboard (slide 16) shows 19 participants across 4 application modules (Territory & Quota, Account Segmentation, Capacity Planning, Sales Forecasting) with real-time status per participant.'));
  c.push(body('These slides make the "Hands-On" category tangible. A workshop is not a slideshow — it is a lab environment where the partner builds something that matters.'));

  c.push(h2('Course Review — Evaluation Criteria'));
  c.push(body('Every existing Academy course should be evaluated against these criteria before being assigned to a journey:'));
  c.push(bulletBold('Currency — ', 'Is the content current with the live product version?'));
  c.push(bulletBold('Self-Service Readiness — ', 'Can a partner complete this independently without Anaplan assistance?'));
  c.push(bulletBold('Role Relevance — ', 'Which specific roles benefit from this course? Is it correctly labelled?'));
  c.push(bulletBold('Journey Alignment — ', 'Which stage(s) would this course be assigned to?'));
  c.push(bulletBold('Quality — ', 'Production quality, working labs, accurate screenshots.'));
  c.push(bulletBold('Gap Indicator — ', 'Is this part of a coherent learning path, or does it stand alone?'));

  c.push(h2('Course-by-Course Review'));
  const courseRows = academy.courses.map(co => [co.name, co.catalog, '', '', '', '', '', '']);
  c.push(tbl(['Course Name', 'Catalog', 'Current?', 'Self-Service?', 'Roles Served', 'Journey Stage', 'Quality', 'Gaps / Notes'], courseRows));

  c.push(h2('RACI — Self-Paced Academy Asset Lifecycle'));
  c.push(body('From slide 12, layer 1 — Self-Paced Academy.'));
  c.push(raciTbl5([
    ['Identify content gaps & priorities',       'PSM',  'Acad', 'Prod',    'P.Lead'],
    ['Commission & author course content',        'Acad', 'Acad', 'ProfSvc', 'PSM'],
    ['Review & approve content quality',          'Prod', 'Acad', 'ProfSvc', 'PSM'],
    ['Assign courses to journey stages',          'PSM',  'PSM',  'Acad',    'P.Res'],
    ['Enroll learners & manage access',           'PSM',  'PSM',  'P.Lead',  'P.Res'],
    ['Track module completion & progress',        'PSM',  'PSM',  'Acad',    'P.Lead'],
    ['Refresh content for new product releases',  'Acad', 'Acad', 'Prod',    'PSM'],
  ]));

  c.push(h2('RACI — Capstone / Hands-On Workshops'));
  c.push(body('From slide 12, layer 1 — Capstone Projects / Hands-On Workshops.'));
  c.push(raciTbl5([
    ['Design capstone scenario & rubric',          'ProfSvc', 'PSM',     'Acad',    'P.Lead'],
    ['Build hands-on lab environments',            'ProfSvc', 'ProfSvc', 'Acad',    'PSM'],
    ['Facilitate & deliver workshops',             'PSM',     'PSM',     'ProfSvc', 'P.Res'],
    ['Schedule sessions & enroll partners',        'PSM',     'PSM',     'P.Lead',  'P.Res'],
    ['Assess submissions & grade capstone work',   'ProfSvc', 'PSM',     'Acad',    'P.Res'],
    ['Certify completion & award credit',          'ProfSvc', 'PSM',     'Acad',    'P.Res'],
    ['Collect & act on participant feedback',      'PSM',     'PSM',     'ProfSvc', 'P.Lead'],
  ]));

  c.push(h2('RACI — Masterclass & Continuous Learning'));
  c.push(body('From slide 12, layer 1 — Masterclass & Continuous Learning.'));
  c.push(raciTbl5([
    ['Define masterclass types & eligibility',     'ProfSvc', 'PSM',     'Acad',    'P.Lead'],
    ['Identify & qualify participants',            'PSM',     'PSM',     'P.Lead',  'P.Res'],
    ['Source & prepare SME facilitators',          'ProfSvc', 'ProfSvc', 'PSM',     'Acad'],
    ['Schedule & confirm engagements',             'PSM',     'PSM',     'P.Lead',  'P.Res'],
    ['Deliver expert-led masterclass sessions',    'ProfSvc', 'ProfSvc', 'PSM',     'P.Res'],
    ['Capture outcomes & follow-up actions',       'PSM',     'PSM',     'ProfSvc', 'P.Lead'],
    ['Measure engagement effectiveness & NPS',     'PSM',     'PSM',     'ProfSvc', 'Acad'],
  ]));

  c.push(prompt('How many of these courses are genuinely self-service today — meaning a partner can start and finish without asking for help?'));
  c.push(prompt('Which assets exist today but are not journey-ready — outdated, wrong audience, not self-service?'));
  c.push(prompt('Are there other asset types we should consider? Sandbox labs, mentoring, community, ride-alongs, documentation?'));
  c.push(inputLabel('High-Reuse Asset Inventory'));
  c.push(emptyTbl(['Asset Name', 'Type', 'Journeys It Supports', 'Roles Served', 'Current State', 'Action Needed'], 8));
  c.push(inputLabel('Courses Flagged for Action'));
  c.push(emptyTbl(['Course Name', 'Issue', 'Action Needed', 'Owner', 'Priority'], 8));
  c.push(pb());

  // ── Part 7: Achievements ──
  c.push(h1('Part 7 — Achievements & Designations'));
  c.push(slideRef(7, 'The Framework — Steps 14 & 15'));
  c.push(body('Achievements are Layer 3 outcomes — designations earned by completing a combination of journeys. They are the highest-value signals a partner can display: proof of multi-domain capability, not just single-course completion.'));
  c.push(body('In the prototype, step 14 of slide 7 reveals the three most strategic "featured" achievements. Step 15 reveals all eight. Partners can drag journey completions into achievement slots to demonstrate how journeys compose into designations.'));

  c.push(h2('The Eight Achievements'));
  c.push(tbl(['Achievement', 'Type', 'Composed Of', 'Audience / Signal'], [
    ['Agentic Office of the CFO',       'Featured',  'Finance + AI + Connected Planning',           'Partners who can sell and deliver the agentic finance story — highest strategic value.'],
    ['Connected Financial Planning',    'Featured',  'Cross-domain finance expertise',              'Broad finance capability across IFP, Financial Close, and Finance Suite.'],
    ['Connected Supply Chain Planning', 'Featured',  'End-to-end supply chain mastery',             'Full SC expertise: TPM, Production, IBP.'],
    ['Retail Expert',                   'Standard',  'Assortment + Demand + Inventory',             'Specialist in retail planning applications.'],
    ['Supply Chain Expert',             'Standard',  'TPM + Production + IBP',                      'Deep supply chain delivery capability.'],
    ['Workforce Expert',                'Standard',  'OWP + Contact Center + Resource Planning',    'Human capital and workforce planning specialist.'],
    ['AI Products Expert',              'Standard',  'CoModeler + Agent Studio',                    'Certified in Anaplan AI products — first-mover advantage.'],
    ['Connected Planning',              'Standard',  'Expert across multiple domains',              'The broadest designation — multi-product, multi-role mastery.'],
  ]));

  c.push(h2('Featured vs. Standard'));
  c.push(body('The three "featured" achievements (Agentic Office of the CFO, Connected Financial Planning, Connected Supply Chain Planning) are shown first in step 14 of the prototype build. They represent the highest-value, most strategically differentiated designations — the ones most likely to influence customer selection and partner tiering.'));
  c.push(body('Standard achievements represent domain specialization. A partner might hold multiple standard achievements as they grow their practice into new product areas.'));

  c.push(h2('RACI — Achievement Lifecycle'));
  c.push(body('From slide 12, layer 3 — Achievements.'));
  c.push(raciTbl5([
    ['Define achievement criteria & standards',  'PSM',     'PSM',     'Acad',   'P.Lead'],
    ['Map achievements to journey milestones',   'PSM',     'PSM',     'Acad',   'P.Res'],
    ['Validate & review earning submissions',    'ProfSvc', 'PSM',     'Acad',   'P.Res'],
    ['Award designations & digital badges',      'PSM',     'PSM',     'Acad',   'P.Lead'],
    ['Track & report attainment data',           'PSM',     'PSM',     'P.Lead', 'Acad'],
    ['Promote achievement value to partners',    'PSM',     'PSM',     'P.Lead', 'P.Res'],
  ]));

  c.push(prompt('Which achievement, if it existed today, would most change how customers select and trust partners?'));
  c.push(prompt('Should achievements expire? If so, what is the renewal cadence and what must be re-demonstrated?'));
  c.push(prompt('Who has authority to award — automatic when criteria are met, or does it require human review?'));
  c.push(prompt('How should achievements appear in partner marketplace listings, tier criteria, and business plans?'));
  c.push(inputLabel('Achievement Definition Workshop'));
  c.push(emptyTbl(['Achievement', 'Required Journeys', 'Evidence / Metrics', 'Renewal Period', 'Awarded By', 'Tier Credit?'], 6));
  c.push(pb());

  // ── Part 8: Governance & RACI ──
  c.push(h1('Part 8 — Governance & RACI'));
  c.push(slideRef(12, 'Who Owns What?'));
  c.push(slideRef(13, 'RACI Matrix'));
  c.push(body('Connected Enablement requires clear governance. Without it, the framework becomes a list of good intentions. Slide 12 presents the full RACI across all three layers. Slide 13 is the cross-functional RACI for the workshop to fill in together.'));

  c.push(h2('RACI Legend'));
  c.push(tbl(['Letter', 'Meaning', 'Description'], [
    ['R', 'Responsible',  'Does the work. There should be exactly one R per activity.'],
    ['A', 'Accountable',  'Owns the outcome. Signs off. There must be exactly one A.'],
    ['C', 'Consulted',    'Provides input before the work is done. Two-way communication.'],
    ['I', 'Informed',     'Kept in the loop after decisions are made. One-way communication.'],
  ]));
  c.push(body('Role abbreviations used in slide 12: Acad = Academy · PSM = Partner Success · ProfSvc = Professional Services · P.Lead = Partner Leadership · P.Res = Partner Resource · Prod = Product'));

  c.push(h2('Key Governance Questions'));
  c.push(prompt('How are new enablement tasks prioritized? Who manages the backlog?'));
  c.push(prompt('What is the approval process for a new journey, a new achievement, or a new gate criterion?'));
  c.push(prompt('Who is accountable when a partner is stuck at a gate and cannot progress?'));
  c.push(prompt('How frequently are journeys reviewed and updated? Quarterly? Annually? On product release?'));
  c.push(prompt('How does the governance model scale from 10 partners to 100 partners?'));

  c.push(h2('Cross-Functional RACI — End-to-End (Workshop Fill-In)'));
  c.push(body('Use this table during slide 13. Fill in R, A, C, or I for each activity and role. Disagreements are the most valuable part.'));
  c.push(raciTable([
    ['Define the overall enablement strategy',                    '', '', '', '', '', ''],
    ['Create and maintain self-paced courses',                    '', '', '', '', '', ''],
    ['Design and maintain capstone workshop curriculum',          '', '', '', '', '', ''],
    ['Deliver PSM-led workshops and orientations',                '', '', '', '', '', ''],
    ['Build and maintain specialist delivery blueprints',         '', '', '', '', '', ''],
    ['Assign partners to correct journey paths',                  '', '', '', '', '', ''],
    ['Conduct gate reviews and stage sign-off',                   '', '', '', '', '', ''],
    ['Complete journey tasks and submit evidence',                '', '', '', '', '', ''],
    ['Deliver supervised delivery oversight (SA pairing)',        '', '', '', '', '', ''],
    ['New product enablement readiness (post-GA)',                '', '', '', '', '', ''],
    ['Track partner progress and enablement health',              '', '', '', '', '', ''],
    ['Define achievement criteria & award designations',          '', '', '', '', '', ''],
    ['Report enablement metrics to leadership',                   '', '', '', '', '', ''],
    ['Manage the enablement platform and tooling',                '', '', '', '', '', ''],
    ['Handle partner escalations and exceptions',                 '', '', '', '', '', ''],
  ]));

  c.push(h2('Cross-Cutting Issue — Missing Enablement Assets'));
  c.push(body('The single most important operational question: what happens when a journey requires an asset that does not exist? This will happen constantly. Without a clear, repeatable process, gaps become permanent.'));
  c.push(tbl(['Situation', 'Recommended Form', 'Created By', 'Turnaround', 'Scalability'], [
    ['Critical blocker — partner stuck at gate',          'PSM-delivered session or SA pairing',    'PS / PSM',        '1–2 weeks',  'Low (1:1)'],
    ['Multiple partners need the same thing',             'Capstone workshop',                       'Academy + PS',    '4–6 weeks',  'Medium (1:many, scheduled)'],
    ['Foundational knowledge, stable content',            'Self-paced Academy course',               'Academy',         '8–12 weeks', 'High (always available)'],
    ['Technical depth, changes with product',             'Delivery blueprint or playbook',          'PS',              '4–8 weeks',  'Medium (document)'],
    ['New product, evolving rapidly',                     'Interim guide + SME office hours → Masterclass & Continuous Learning', 'Product + PS', '2–4 weeks', 'Low initially, upgrade later'],
  ]));

  c.push(h2('Task Prioritization Framework'));
  c.push(inputLabel('Prioritization Criteria'));
  c.push(emptyTbl(['Criterion', 'Weight', 'How Assessed', 'Who Scores', 'Example'], 5));
  c.push(inputLabel('Approval Process'));
  c.push(emptyTbl(['Decision Type', 'Who Proposes', 'Who Reviews', 'Who Approves', 'Turnaround Time'], 5));
  c.push(pb());

  // ── Part 9: Content Coverage Gap ──
  c.push(h1('Part 9 — Content Coverage Gap'));
  c.push(slideRef(14, 'Content Coverage Gap'));
  c.push(body('Slide 14 presents a data-driven view of the gap between current Academy content and what 102+ journey-stage slots actually require. For each application category, the slide shows: courses available, course-journey slots needed, current coverage %, and gap severity.'));
  c.push(body('This is not a judgment on the Academy team — it is a realistic picture of the size of the backlog. The purpose is to move from "we need more content" (vague) to "we need 48 more course-stage assignments in Finance applications" (actionable).'));

  c.push(h2('How to Read the Gap Chart'));
  c.push(bulletBold('Academy courses (total): ', `${academy.courses.length} self-paced courses currently available.`));
  c.push(bulletBold('Journey-stage slots needed: ', '102+ assignments required to fully cover all journeys across all stages.'));
  c.push(bulletBold('Coverage %: ', 'Per application category — Finance, Supply Chain, Workforce, Retail, AI, Platform.'));
  c.push(bulletBold('Gap severity: ', 'Red = critical gap (< 40% covered), Yellow = partial (40–70%), Green = sufficient (> 70%).'));

  c.push(h2('Discussion: From Data to Backlog'));
  c.push(prompt('Which application categories have the largest gaps relative to partner demand?'));
  c.push(prompt('Are any gaps acceptable — where demand is low enough that a gap does not block journeys partners actually want?'));
  c.push(prompt('What is the realistic course creation capacity of the Academy team per quarter? How does that compare to the size of the backlog?'));
  c.push(prompt('Which gaps can be closed with workshops or masterclass & continuous learning engagements rather than new Academy courses?'));

  c.push(h2('Gap Resolution Priority Matrix'));
  c.push(inputLabel('Gaps Ranked by Priority'));
  c.push(emptyTbl(['Application Area', 'Gap Size', 'Journeys Blocked', 'Partner Demand', 'Recommended Form', 'Owner', 'Target Date'], 8));
  c.push(pb());

  // ── Part 10: PSM Activity & Resource Model ──
  c.push(h1('Part 10 — PSM Activity & Resource Model'));
  c.push(slideRef(17, 'PSM Activity Map'));
  c.push(body('Slide 17 is an interactive 2D map of how PSM time is currently allocated across 15 activities. The X-axis is Value (low to high), the Y-axis is PSM Effort (low to high). Participants drag the activity dots to reflect their reality.'));
  c.push(body('The goal: identify activities where PSM effort is high but value is low (candidates for reduction or automation), and activities where value is high but effort is low (candidates for investment).'));

  c.push(h2('The Fifteen PSM Activities'));
  c.push(tbl(['Activity', 'Category', 'Expected Quadrant', 'Notes'], [
    ['Admin & Ops',              'Internal',    'Low value, High effort → reduce',     ''],
    ['Training Delivery',        'Enablement',  'High value if scaled; varies',         ''],
    ['Reactive Support',         'Partner',     'Low value, High effort → automate',   ''],
    ['Delivery Readiness',       'Enablement',  'High value, varies in effort',         ''],
    ['Journey Assignment',       'Enablement',  'High value if systematic',             ''],
    ['Gate Reviews',             'Governance',  'High value — do not reduce',           ''],
    ['Partner Business Planning','Strategic',   'High value, high effort — invest',     ''],
    ['Escalation Management',    'Reactive',    'Varies — reduce via better gates',     ''],
    ['Content Review',           'Governance',  'Medium value — share with Academy',    ''],
    ['Dashboard Reporting',      'Internal',    'Low value if manual → automate',       ''],
    ['Co-sell Coordination',     'Pipeline',    'High value → invest',                  ''],
    ['New Partner Onboarding',   'Enablement',  'High value in Year 1',                 ''],
    ['Achievement Tracking',     'Governance',  'High value if systematic',             ''],
    ['Masterclass & Continuous Learning', 'Enablement',  'High value, high effort → qualify',   ''],
    ['Partner Communication',    'Internal',    'Varies — consolidate channels',        ''],
  ]));

  c.push(h2('PSM Model — Current vs. Future'));
  c.push(body('The Connected Enablement framework is designed to shift PSM time toward high-value activities (gate reviews, partner business planning, co-sell) and away from low-value, high-effort activities (manual tracking, reactive support, routine communications).'));
  c.push(tbl(['Activity Type', 'Current State', 'Future State with Connected Enablement'], [
    ['Journey assignment',    'Manual, ad-hoc',       'Systematic — framework defines the path'],
    ['Progress tracking',     'Excel / memory',       'Platform-driven dashboards'],
    ['Gate reviews',          'Informal, inconsistent', 'Standardized rubric, scheduled cadence'],
    ['Reactive support',      'High volume',           'Reduced by self-serve Layer 1'],
    ['Partner reporting',     'Manual assembly',       'Auto-generated from journey data'],
  ]));

  c.push(prompt('Where is PSM time going today that adds the least value? What would need to change to free up that time?'));
  c.push(prompt('If PSMs had 20% more time for high-value activities, what would they do with it?'));
  c.push(prompt('What activities can only a PSM do — and should therefore be protected even as the framework automates others?'));
  c.push(inputLabel('PSM Activity Reallocation Plan'));
  c.push(emptyTbl(['Activity', 'Current % Time', 'Target % Time', 'What Changes', 'Owner'], 10));
  c.push(pb());

  // ── Part 11: Interactive Exercises ──
  c.push(h1('Part 11 — Interactive Exercises'));
  c.push(body('This section contains structured group exercises to run during the workshop. Mix and match based on group size and energy level.'));

  // Exercise A: 2x2 Prioritization Quadrant
  c.push(h2('Exercise A — 2×2 Prioritization Quadrant'));
  c.push(body('Time: 15–20 minutes. Purpose: Prioritize which journeys, assets, or initiatives to build first by plotting on an Impact vs. Complexity grid.'));
  c.push(h3('Instructions'));
  c.push(bullet('Each participant receives sticky notes (or digital cards) with items to prioritize.'));
  c.push(bullet('Working individually (2 min), place top 5 items on the quadrant.'));
  c.push(bullet('As a group, discuss clusters and disagreements. Align on "Do First" and "Deprioritize."'));
  c.push(tbl(['', 'Low Complexity / Fast', 'High Complexity / Slow'], [
    ['HIGH IMPACT', 'DO FIRST\n(Quick wins with high return)',     'PLAN & INVEST\n(Worth it but needs resources & time)'],
    ['LOW IMPACT',  'FILL IN LATER\n(Easy but not urgent)',        'DEPRIORITIZE\n(Hard and low return — skip for now)'],
  ]));
  c.push(h3('Run it three times'));
  c.push(bulletBold('Round 1 — Journeys: ', 'Which of the 26+ journeys should we build first?'));
  c.push(bulletBold('Round 2 — Content Gaps: ', 'Which missing Academy courses or workshops would unblock the most journeys?'));
  c.push(bulletBold('Round 3 — Achievements: ', 'Which achievements matter most to customers and partner tiering?'));
  c.push(inputLabel('Captured Quadrant — Journeys'));
  c.push(emptyTbl(['Quadrant', 'Items Placed', 'Notes'], 4));
  c.push(inputLabel('Captured Quadrant — Content Gaps'));
  c.push(emptyTbl(['Quadrant', 'Items Placed', 'Notes'], 4));
  c.push(inputLabel('Captured Quadrant — Achievements'));
  c.push(emptyTbl(['Quadrant', 'Items Placed', 'Notes'], 4));

  // Exercise B: Dot Voting
  c.push(h2('Exercise B — Dot Voting'));
  c.push(body('Time: 5–10 minutes. Purpose: Quickly surface collective priorities without lengthy debate.'));
  c.push(bullet('Post full item list on wall or screen. Each participant gets 3 dots.'));
  c.push(bullet('Place all 3 dots on the most important items. Multiple dots on one item allowed.'));
  c.push(bulletBold('Vote 1: ', '"Which roles should get their first journey built in the next quarter?"'));
  c.push(bulletBold('Vote 2: ', '"Which Big Rock is most painful and should be resolved first?"'));
  c.push(bulletBold('Vote 3: ', '"Which achievement would you highlight to a customer tomorrow if it existed?"'));
  c.push(inputLabel('Dot Voting Results'));
  c.push(emptyTbl(['Item', 'Votes', 'Rank'], 8));

  // Exercise C: Persona Empathy Mapping
  c.push(h2('Exercise C — Persona Empathy Map'));
  c.push(body('Time: 15 minutes (pick 1–2 personas). Purpose: Build shared understanding of what a specific role needs.'));
  c.push(tbl(['', 'Internal', 'External'], [
    ['THINKS & FEELS', '"What are they worried about?\nWhat do they hope for?\nWhat frustrates them about current enablement?"', '"What do they hear from their manager, peers, or Anaplan about what they should be doing?"'],
    ['DOES & NEEDS',   '"What actions are they taking today to learn Anaplan? What workarounds do they use?"',                   '"What do they actually need to succeed? What would make their first 90 days easier?"'],
  ]));
  c.push(inputLabel('Empathy Map Capture'));
  c.push(emptyTbl(['Quadrant', 'Key Insights', 'Implications for Journey Design'], 4));

  // Exercise D: Card Sort
  c.push(h2('Exercise D — Card Sort: Assets into Stages'));
  c.push(body('Time: 15–20 minutes. Purpose: Physically assemble a journey by sorting assets into stages.'));
  c.push(bullet('Print cards for 15–20 enablement assets (mix of Academy, Workshops, Masterclass & Continuous Learning).'));
  c.push(bullet('Print 5 stage headers: Registered, Trained, Certified, Delivering, Expert.'));
  c.push(bullet('Working in pairs, sort asset cards into the stages where they belong.'));
  c.push(bullet('Compare results. Discuss disagreements — they reveal assumptions about progression.'));
  c.push(prompt('Where did pairs disagree? What does the disagreement reveal?'));
  c.push(...blankLines(3));

  // Exercise E: Rose / Thorn / Bud
  c.push(h2('Exercise E — Rose / Thorn / Bud'));
  c.push(body('Time: 10 minutes. Purpose: Structured reflection on current state before designing future state.'));
  c.push(bulletBold('Rose — ', 'Something working well in partner enablement today.'));
  c.push(bulletBold('Thorn — ', 'Something that is a pain point or clearly broken.'));
  c.push(bulletBold('Bud — ', "Something with potential that hasn't been fully developed yet."));
  c.push(inputLabel('Rose / Thorn / Bud — Themes'));
  c.push(emptyTbl(['Category', 'Theme', 'Number of Notes', 'Priority?'], 6));

  // Exercise F: How Might We
  c.push(h2('Exercise F — "How Might We" Reframing'));
  c.push(body('Time: 10 minutes. Purpose: Transform problems into actionable opportunity statements.'));
  c.push(bullet('Take the top 3–5 Thorns from Exercise E.'));
  c.push(bullet('For each: reframe as a "How might we…?" question.'));
  c.push(bullet('Example: "PSM = low value, high touch" → "How might we design Connected Enablement so PSMs spend 80% of their time on gate reviews and partner strategy, with routine tasks handled by the system?"'));
  c.push(inputLabel('"How Might We" Statements'));
  c.push(emptyTbl(['Thorn (Problem)', '"How Might We…?" (Opportunity)', 'Ideas'], 5));

  // Exercise G: Lightning Decision Jam
  c.push(h2('Exercise G — Lightning Decision Jam'));
  c.push(body('Time: 20 minutes. Purpose: Move from discussion to decisions fast.'));
  c.push(bulletBold('1. Problems (2 min): ', 'Everyone writes problems silently. One problem per note.'));
  c.push(bulletBold('2. Vote (2 min): ', 'Dot-vote on top 3 problems.'));
  c.push(bulletBold('3. Reframe (3 min): ', 'Convert top 3 into "How Might We" statements.'));
  c.push(bulletBold('4. Solutions (3 min): ', 'Everyone writes solution ideas silently for the top HMW.'));
  c.push(bulletBold('5. Vote (2 min): ', 'Dot-vote on best solutions.'));
  c.push(bulletBold('6. Action (5 min): ', 'For each winning solution: define action, owner, due date.'));
  c.push(inputLabel('Lightning Jam — Decisions Made'));
  c.push(emptyTbl(['HMW Statement', 'Winning Solution', 'Action', 'Owner', 'Due Date'], 3));

  // Exercise H: Before / After Self-Assessment
  c.push(h2('Exercise H — Before / After Self-Assessment'));
  c.push(body('Time: 5 min at START, 5 min at END. Purpose: Capture baseline confidence and measure the shift.'));
  c.push(tbl(
    ['Statement', 'Before (1–10)', 'After (1–10)', 'Δ'],
    [
      ['I fully understand what is broken about partner enablement today.',                         '', '', ''],
      ['I can articulate the difference between an asset, a journey, and an achievement.',         '', '', ''],
      ['I understand how the five journey stages work and what gates between them look like.',     '', '', ''],
      ['I know which partner roles are currently underserved by enablement.',                      '', '', ''],
      ['I can explain how Connected Enablement drives pipeline growth.',                           '', '', ''],
      ['I can explain how Connected Enablement drives delivery excellence.',                       '', '', ''],
      ['I understand the RACI for who creates, approves, and delivers enablement.',               '', '', ''],
      ['I know which achievements we should build first and why.',                                '', '', ''],
      ['I understand how the PSM role changes with Connected Enablement in place.',               '', '', ''],
      ['I could recommend the right journey for a specific partner resource today.',              '', '', ''],
      ['I know what content gaps we need to close in the next 90 days.',                          '', '', ''],
      ['I have a clear owner and date for at least one action item from this workshop.',          '', '', ''],
    ]
  ));
  c.push(h3('Facilitator Notes'));
  c.push(bulletBold('Big shifts (Δ ≥ 3): ', 'Content landed. Reinforce with follow-up materials.'));
  c.push(bulletBold('Small shifts (Δ ≤ 1): ', 'Topic needs more depth or a different approach.'));
  c.push(bulletBold('Consistently low "After" scores: ', 'Group needs foundational context. Do not force decisions.'));
  c.push(inputLabel('"The most important thing I learned today was…"'));
  c.push(...blankLines(2));
  c.push(inputLabel('"The thing I\'m still uncertain about is…"'));
  c.push(...blankLines(2));
  c.push(inputLabel('"The one thing I will do differently starting next week is…"'));
  c.push(...blankLines(2));
  c.push(pb());

  // ── Part 12: Day 2 — Stakeholder Sessions ──
  c.push(h1('Part 12 — Day 2: Stakeholder Sessions'));
  c.push(body('Day 2 shifts from "design the framework" to "align the organization." Each session follows a three-part structure: The Story (10 min), The Ask (15 min), The Commitment (5 min). No session ends without at least one concrete next step.'));

  c.push(h2('Stakeholder Map'));
  c.push(tbl(['Business Unit', 'What They Own', 'What We Need', 'What They Get Back'], [
    ['Academy',           'Self-paced course catalog, LMS platform',                'Course creation for journey gaps, curriculum alignment to stages, self-service audit',                 'Clear demand signal (which courses, by when, for which journeys); fewer ad-hoc requests'],
    ['Professional Svcs', 'SA capacity, delivery blueprints, supervised delivery',  'SA time for gate reviews, delivery scorecard data, blueprint updates aligned to journeys',           'Structured partner onramp that reduces SA support burden; better-prepared partners'],
    ['Partner Success',   'Partner relationships, journey assignment, gate reviews', 'PSM adoption of journey framework, consistent gate evaluation, progress reporting',                  'A system replacing ad-hoc planning with prescriptive paths; clearer partner health metrics'],
    ['Sales Operations',  'Pipeline data, deal registration, co-sell programs',     'Pipeline metrics by partner certification level, leading indicator data',                             'Evidence that enablement drives pipeline; data to justify investment'],
    ['Customer Success',  'Post-deployment CSAT, adoption, renewal data',           'Delivery quality data tied to partner enablement level, expansion correlation',                      'Better partner quality = better customer outcomes = higher retention'],
    ['Product',           'Product roadmap, GA timelines, feature documentation',   'Early access to product content for enablement development, SME time for reviews',                  'Faster partner readiness at GA; fewer support tickets from undertrained partners'],
    ['Marketing',         'Partner comms, marketplace listings, co-marketing',      'Achievement badge assets, partner capability messaging, marketplace integration',                    'Verified partner capabilities to promote; stronger co-marketing stories'],
    ['Partner Leadership','Partner strategy, tier requirements, business planning',  'Tier criteria aligned to achievements, executive sponsorship',                                       'Objective, measurable partner capability data for tiering and investment decisions'],
  ]));
  c.push(pb());

  const sessions = [
    {
      title: 'Session 1 — Academy',
      story: 'The Academy is the engine of Layer 1. Self-paced courses are the most scalable enablement asset. Connected Enablement creates a clear demand signal: every journey stage specifies exactly which courses are needed. The course review in Part 6 of this guide is a joint deliverable — Academy and PSM need to complete it together.',
      asks: [
        'Conduct the Academy course review (Part 6) — evaluate all courses for currency, self-service readiness, role relevance, and journey alignment.',
        'Commit to a quarterly course creation cadence aligned to journey priority from the Part 9 gap analysis.',
        'Establish a feedback loop: when a PSM or partner flags a course as inadequate, what is the process to update or replace it?',
        'Provide course completion data by partner and role for enablement health reporting.',
      ],
      gets: [
        'A prioritized backlog of courses to create — no more guessing what partners need.',
        'Course utilization data tied to journey progression — proof of which courses drive outcomes.',
        'Reduced ad-hoc "can you create a course on X?" requests — the journey framework absorbs those.',
      ],
    },
    {
      title: 'Session 2 — Professional Services',
      story: 'Professional Services owns the highest-value enablement touchpoints: SA pairings, supervised delivery, architecture reviews, and delivery scorecards. These are the gates that determine whether a partner is truly ready to deliver independently. Without PS participation, the framework has no teeth.',
      asks: [
        'Allocate SA capacity for gate reviews and supervised delivery oversight — define hours per quarter per partner.',
        'Formalize the delivery scorecard as a gate criterion (standardize the rubric across SAs).',
        'Align masterclass & continuous learning engagement formats to journey stages — specify which engagements map to which stage.',
        'Provide delivery quality data (CSAT, scorecard ratings) as inputs to journey health reporting.',
      ],
      gets: [
        'Partners arrive at supervised delivery better prepared — less SA hand-holding.',
        'A structured pipeline of partners moving toward independence — predictable capacity demand.',
        'Data showing that PS investment in enablement reduces long-term support cost.',
      ],
    },
    {
      title: 'Session 3 — Partner Success (PSMs)',
      story: "PSMs are the face of enablement to the partner. Connected Enablement replaces ad-hoc enablement planning ('what should this partner do next?') with a prescriptive system ('the journey says they need X, Y, Z to reach the next stage'). The PSM Activity Map (slide 17) shows clearly where PSM time needs to shift.",
      asks: [
        'Adopt the journey framework as the primary enablement planning tool — every partner gets a journey, every resource gets a path.',
        'Conduct gate evaluations using the standardized criteria — consistent across PSMs.',
        'Report journey progress in partner reviews — make it visible to partner leadership.',
        'Provide ongoing feedback on journey design: what works, what is too rigid, what is missing.',
      ],
      gets: [
        "A system that answers 'what should this partner do next?' — no more building plans from scratch.",
        "Objective data for partner conversations — 'you need X to reach Certified' instead of 'maybe try some courses.'",
        'Visibility into partner health across the portfolio — which partners are progressing, which are stuck.',
      ],
    },
    {
      title: 'Session 4 — Sales Operations',
      story: 'Connected Enablement exists to drive business outcomes, not just training completions. Sales Operations owns the pipeline data that proves whether enablement is working. The hypothesis: partners with more certified, journey-progressed resources generate more pipeline and close more deals faster.',
      asks: [
        'Provide pipeline metrics segmented by partner enablement level — are journey-advanced partners performing better?',
        'Define the leading indicators for partner-sourced pipeline that enablement should target.',
        'Integrate partner enablement data into sales planning — which partners get co-sell support based on enablement maturity?',
      ],
      gets: [
        'Data-backed investment decisions — invest enablement resources where pipeline impact is highest.',
        'A predictive model: partner enablement level → expected pipeline contribution.',
      ],
    },
    {
      title: 'Session 5 — Customer Success',
      story: 'The ultimate test of partner enablement is customer outcomes. Customer Success owns the data showing whether enabled partners deliver better results: higher CSAT, better adoption, more renewals. Connected Enablement creates a traceable path from "partner completed this journey" to "customer got this outcome."',
      asks: [
        'Share CSAT and adoption data tied to the delivering partner and their enablement level.',
        'Identify leading indicators that predict successful implementations leading to expansion.',
        "Participate in defining Delivery Excellence metrics — what does 'good' look like from the customer's perspective?",
      ],
      gets: [
        'Better partner quality = better customer outcomes = higher retention and NRR.',
        'Early warning signals when an underqualified partner is assigned to a critical account.',
      ],
    },
    {
      title: 'Session 6 — Product',
      story: 'New products (CoModeler, Agent Studio, upcoming releases) launch with minimal partner enablement. Partners wait months post-GA before role-specific training exists. Connected Enablement creates a "new product enablement readiness" process: Product provides early content and SME access — all before GA, not after.',
      asks: [
        'Include "partner enablement readiness" as a GA checklist item — no product launches without at least a foundational journey defined.',
        'Provide SME access 90 days before GA for course and blueprint development.',
        'Review and validate application-specific enablement content for technical accuracy.',
      ],
      gets: [
        'Faster partner adoption of new products — more implementations, more customer references, faster feedback loop.',
        'Fewer support tickets from undertrained partners attempting new product deployments.',
      ],
    },
    {
      title: 'Session 7 — Partner Leadership & Strategy',
      story: "Connected Enablement provides objective, measurable partner capability data. This data should inform partner tiering, investment decisions, and strategic planning. Achievements become the language of partner capability — not 'they say they can do Finance' but 'they have earned the Connected Financial Planning designation backed by certified resources and proven delivery.'",
      asks: [
        'Align partner tier criteria to achievements — make achievement attainment a factor in tier advancement.',
        'Use journey and achievement data in annual partner business planning.',
        'Provide executive sponsorship for the Connected Enablement program — signal to the organization that this is a priority.',
      ],
      gets: [
        'Objective partner capability data — no more relying on self-reported competency.',
        'A defensible framework for partner investment decisions — invest where capability is demonstrated.',
      ],
    },
  ];

  for (const s of sessions) {
    c.push(h2(s.title));
    c.push(body('Time: 30 minutes'));
    c.push(h3('The Story'));
    c.push(body(s.story));
    c.push(h3('The Ask'));
    s.asks.forEach(a => c.push(bullet(a)));
    c.push(h3('What They Get Back'));
    s.gets.forEach(g => c.push(bullet(g)));
    c.push(inputLabel(`${s.title} — Commitments`));
    c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));
  }

  c.push(h2('Day 2 — Consolidated Timeline'));
  c.push(inputLabel('Cross-Team Milestones'));
  c.push(emptyTbl(['Milestone', 'Business Unit', 'Dependency', 'Target Date', 'Status'], 10));
  c.push(inputLabel('Cross-Team Dependencies'));
  c.push(emptyTbl(['Dependency', 'Blocking Team', 'Blocked Team', 'Resolution Path', 'Escalation Owner'], 5));
  c.push(inputLabel('Day 2 — Open Questions'));
  c.push(emptyTbl(['Question', 'Raised By', 'Needs Input From', 'Target Resolution Date'], 5));
  c.push(pb());

  // ── Part 13: Next Steps ──
  c.push(h1('Part 13 — Next Steps & Prioritization'));
  c.push(h2('What to Build First'));
  c.push(bodyBold('Principle: ', 'Start with the journey closest to complete. A journey that is 80% done should be finished before starting one at 20%.'));
  c.push(bulletBold('High-impact roles: ', 'Which roles, if enabled first, move the most pipeline or improve delivery fastest?'));
  c.push(bulletBold('High-demand products: ', 'Which product areas have the most partner demand now?'));
  c.push(bulletBold('Quick wins: ', 'Which journeys can be assembled mostly from existing content?'));
  c.push(bulletBold('Featured achievements: ', 'Which featured achievements (Agentic CFO, Connected Financial Planning, Connected Supply Chain) drive the most customer-facing differentiation?'));
  c.push(bulletBold('Content gaps: ', 'Where are the biggest gaps between Academy offerings and journey needs (from slide 14)?'));

  c.push(h2('30 / 60 / 90 Day Plan'));
  c.push(tbl(['Horizon', 'Objective', 'Actions', 'Owner'], [
    ['30 days', 'Foundation', 'Complete role definitions; assign all existing PSM partners to at least one journey path; publish gap backlog', ''],
    ['60 days', 'First journeys live', 'At least 2 complete journeys (Delivery role, top product area); gate criteria defined; PSM rubric standardized', ''],
    ['90 days', 'First achievement enabled', 'One featured achievement fully defined with all required journeys complete; first cohort working toward it', ''],
  ]));

  c.push(h2('Technology & Platform Requirements'));
  c.push(bullet('Journey assignment and tracking per partner resource'));
  c.push(bullet('Gate evaluation workflow (automated + PSM-reviewed)'));
  c.push(bullet('Achievement assembly and digital badge issuance'));
  c.push(bullet('PSM dashboard: partner progress, stuck gates, portfolio health'));
  c.push(bullet('Leadership reporting: pipeline correlation, coverage metrics, CSAT by enablement level'));
  c.push(bullet('Integration with Academy LMS, certification platform, CRM, and partner portal'));

  c.push(inputLabel('Prioritization Matrix'));
  c.push(emptyTbl(['Initiative', 'Impact (H/M/L)', 'Effort (H/M/L)', 'Dependencies', 'Owner', 'Target Date'], 8));
  c.push(inputLabel('Key Decisions Required'));
  c.push(emptyTbl(['Decision', 'Options Considered', 'Recommendation', 'Decision Owner', 'By When'], 6));
  c.push(inputLabel('Action Items'));
  c.push(emptyTbl(['Action', 'Owner', 'Due Date', 'Status'], 10));

  return c;
}

async function main() {
  const doc = new Document({
    creator: 'Connected Enablement',
    title: 'Connected Enablement — Workshop Guide',
    styles: {
      default: {
        document: { run: { font: 'Aptos', size: 22, color: '1C2345' } },
        heading1: { run: { font: 'Aptos', size: 36, bold: true, color: '0A2F46' }, paragraph: { spacing: { before: 400, after: 160 } } },
        heading2: { run: { font: 'Aptos', size: 28, bold: true, color: '0A2F46' }, paragraph: { spacing: { before: 320, after: 120 } } },
        heading3: { run: { font: 'Aptos', size: 24, bold: true, color: 'FF6100' }, paragraph: { spacing: { before: 240, after: 100 } } }
      }
    },
    numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 200 } } } }] }] },
    sections: [{ properties: {}, children: buildDoc() }]
  });
  const generatedBuf = await Packer.toBuffer(doc);
  const merged = await injectIntoTemplate(generatedBuf, {
    coverTitle: 'Connected Enablement',
    coverSubtitle: 'Workshop Guide'
  });
  const outPath = path.join(guideDir, 'Connected-Enablement-Workshop-Guide.docx');
  fs.writeFileSync(outPath, merged);
  console.log(`✓ Workshop guide written to ${path.relative(projectRoot, outPath)}`);
}

main();
