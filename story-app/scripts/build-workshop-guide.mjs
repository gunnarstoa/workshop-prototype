import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType
} from 'docx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
function prompt(t) { return new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: '💬  ', size: 22 }), new TextRun({ text: t, italics: true, size: 22, color: ORANGE })] }); }
function inputLabel(t) { return new Paragraph({ spacing: { before: 140, after: 60 }, children: [new TextRun({ text: '✏️  ' + t, bold: true, size: 22, color: NAVY })] }); }
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

function raciTable(activities) {
  const headers = ['Activity', 'Academy', 'Partner Success', 'Prof. Services', 'Partner Leadership', 'Partner Resource', 'Product'];
  return tbl(headers, activities);
}

function buildDoc() {
  const c = [];

  // ── Cover ──
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1600, after: 200 }, children: [new TextRun({ text: 'Connected Enablement', bold: true, size: 60, color: NAVY })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Workshop Guide', bold: true, size: 40, color: ORANGE })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'A facilitated working session to define enablement journeys, achievements, governance, and measurement for the partner ecosystem', italics: true, size: 24, color: '555555' })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Three pillars: Pipeline Growth · Technical Expertise · Delivery Excellence', size: 22, color: NAVY })] }));
  c.push(pb());

  // ── Agenda ──
  c.push(h1('Workshop Agenda'));
  c.push(tbl(['#', 'Topic', 'Focus'], [
    ['Part 1', 'The Key Message', 'Start with what you have — reuse, prioritize, build bottom-up'],
    ['Part 2', 'The Three Pillars', 'Pipeline Growth, Technical Expertise, Delivery Excellence'],
    ['Part 3', 'Enablement Assets', 'Current library, gaps, and governance'],
    ['Part 4', 'Academy Course Review', 'Critical assessment of self-service readiness'],
    ['Part 5', 'Roles', 'Identifying every role that needs a journey'],
    ['Part 6', 'Journeys', 'Stages, gates, activities, and governance'],
    ['Part 7', 'Achievements', 'Designations, composition, and recognition'],
    ['Part 8', 'Governance & RACI', 'Who decides, who builds, who approves, who delivers'],
    ['Part 9', 'Measurement & Impact', 'Connecting enablement to business outcomes'],
    ['Part 10', 'Use Cases & Scenarios', 'Real-world partner stories'],
    ['Part 11', 'Interactive Exercises', 'Quadrants, dot voting, card sorts, empathy maps, before/after'],
    ['Part 12', 'Day 2: Stakeholder Sessions', 'Academy, PS, PSMs, Sales Ops, CS, Product, Leadership'],
    ['Part 13', 'Next Steps & Prioritization', 'What to build first'],
  ]));
  c.push(pb());

  // ── Part 1: The Key Message ──
  c.push(h1('Part 1 — The Key Message: Start with What You Have'));
  c.push(body('Before we design journeys or define achievements, we need to ground the conversation in reality. The three-layer framework is built bottom-up — and so is the workshop.'));

  c.push(h2('Layer 1: Reuse First'));
  c.push(body('The single most important principle in Connected Enablement is reuse. We do not start from zero. The Academy already has 54 courses. PSMs deliver 20 workshops. Professional Services runs 22 specialist engagements. These are the raw materials. The first question is not "what do we need to create?" — it is "what do we already have that can be assembled into journeys right now?"'));
  c.push(body('Some enablement assets are foundational — they appear in nearly every journey. "Essentials of Model Building" is needed by every Delivery resource regardless of product area. "Connected Planning Overview" is needed by every Sales resource regardless of industry. These high-reuse assets are the most valuable because building or improving one course unblocks many journeys simultaneously.'));
  c.push(prompt('Which existing assets have the highest reuse potential — appearing in the most journeys across the most roles?'));
  c.push(prompt('Which assets exist today but are not journey-ready (outdated, wrong audience, not self-service)?'));

  c.push(h2('Layer 1: What Has the Biggest Impact'));
  c.push(body('Not all gaps are equal. A missing foundational course that blocks 15 journeys at Stage 1 is a higher priority than a missing advanced course that blocks 2 journeys at Stage 4. The prioritization formula is:'));
  c.push(bodyBold('Priority = ', '(Number of journeys blocked) × (Stage blocked at) × (Partner demand for those journeys)'));
  c.push(body('A course that unblocks the Registered → Trained gate for 10 high-demand journeys is more valuable than a course that unblocks Delivering → Expert for 2 niche journeys — even if the niche course is more intellectually interesting to build.'));
  c.push(inputLabel('Workshop Input — High-Reuse Asset Inventory'));
  c.push(emptyTbl(['Asset Name', 'Type', 'Journeys It Supports', 'Roles It Serves', 'Current State', 'Action Needed'], 8));

  c.push(h2('Layer 2: Which Journeys Are Complete Today?'));
  c.push(body('Given the current asset library, some journeys can be assembled RIGHT NOW — every stage has the courses, workshops, and engagements it needs. Others are partially complete (stages 1–3 covered, stages 4–5 missing). Others have almost nothing.'));
  c.push(body('Mapping this is the first concrete output of the workshop: a journey completeness matrix that shows, for every journey, which stages have assets and which have gaps.'));
  c.push(prompt('Can we assemble even ONE complete journey today — all 5 stages with assets, gates defined, and outcomes clear? Which one is closest?'));
  c.push(prompt('For the journeys that are 60–80% complete, what specific assets are missing to finish them?'));
  c.push(inputLabel('Workshop Input — Journey Completeness Matrix'));
  c.push(emptyTbl(['Journey (Role + Product)', 'Stage 1 Ready?', 'Stage 2 Ready?', 'Stage 3 Ready?', 'Stage 4 Ready?', 'Stage 5 Ready?', 'Gaps'], 8));

  c.push(h2('Layer 2: What Should Be Next?'));
  c.push(body('Deciding which journeys to build next is a multi-factor decision. The inputs include:'));
  c.push(bulletBold('Partner demand — ', 'Which products and roles are partners hiring for and asking about? (Source: PSM feedback, partner business plans, hiring data.)'));
  c.push(bulletBold('Pipeline impact — ', 'Which journeys, if completed, would directly unblock partner-sourced pipeline? (Source: Sales Ops pipeline data by product area.)'));
  c.push(bulletBold('Delivery quality — ', 'Where are delivery quality issues concentrated? Which product areas have the lowest CSAT from partner-led implementations? (Source: Customer Success data.)'));
  c.push(bulletBold('Strategic priority — ', 'What products is Anaplan investing in? Where is the company betting? (Source: Product roadmap, executive direction.)'));
  c.push(bulletBold('Reuse leverage — ', 'Which journeys share the most assets with journeys already built? Building one journey that shares 70% of its assets with three others creates a multiplier effect. (Source: Asset mapping.)'));
  c.push(bulletBold('Completion proximity — ', 'Which journeys are closest to complete? A journey that is 80% done should generally be finished before starting one at 20%. (Source: Journey completeness matrix above.)'));
  c.push(prompt('Which of these data sources do we have access to today? Which are we missing? How do we get them?'));
  c.push(prompt('Who should make the final call on journey priority? Is it a single owner or a committee? How often is the priority list reviewed?'));
  c.push(inputLabel('Workshop Input — Journey Prioritization Inputs'));
  c.push(emptyTbl(['Data Source', 'Available Today?', 'Owner', 'How to Access', 'Gaps / Issues'], 6));

  c.push(h2('Layer 3: Achievements Follow Naturally'));
  c.push(body('Achievements sit at the top of the framework because they are the last thing earned — but they should be defined early because they set the target. If we know that "Finance Expert" requires IFP Delivery + Financial Close Delivery + Finance Suite completion, then we know exactly which journeys to prioritize first.'));
  c.push(body('Achievements are the forcing function for journey priority: define the achievement, trace backward to the required journeys, trace backward to the required assets. The gaps become the backlog.'));
  c.push(prompt('Which achievement, if it existed today, would most change how customers select and trust partners?'));

  c.push(pb());

  // ── Part 2: The Three Pillars ──
  c.push(h1('Part 2 — The Three Pillars'));
  c.push(body('Connected Enablement is built on three pillars. Every journey, every asset, and every achievement should trace back to at least one of these outcomes.'));
  c.push(h3('📈  Pipeline Growth'));
  c.push(body('Equip partner sales and pre-sales teams to identify, qualify, position, present, and close Anaplan opportunities with confidence across every product and industry.'));
  c.push(h3('🎓  Technical Expertise'));
  c.push(body('Build deep, certified capability across model building, application configuration, solution architecture, and the Anaplan platform.'));
  c.push(h3('⭐  Delivery Excellence'));
  c.push(body("Ensure every client engagement meets Anaplan's quality bar — from supervised delivery through independent practice and beyond."));
  c.push(prompt('What does success look like across these three pillars? What would you measure?'));
  c.push(inputLabel('Workshop Input — Success Indicators'));
  c.push(emptyTbl(['Pillar', 'Success Indicator', 'How Measured', 'Target'], 6));
  c.push(pb());

  // ── Part 2: Enablement Assets ──
  c.push(h1('Part 3 — Enablement Assets'));
  c.push(body('Enablement assets are the building blocks in Layer 1. Every journey is assembled from these assets. Three categories exist today — but are they sufficient?'));

  c.push(h2('Self-Paced Academy'));
  c.push(body(`The Academy currently offers ${academy.courses.length} partner-accessible courses. These are always available, self-service, and scalable — but are they role-appropriate, current, and journey-ready?`));
  const catalogs = {};
  academy.courses.forEach(co => { const k = co.catalog || 'Other'; if (!catalogs[k]) catalogs[k] = []; catalogs[k].push(co); });
  for (const [cat, courses] of Object.entries(catalogs).sort((a, b) => b[1].length - a[1].length)) {
    c.push(h3(`${cat} (${courses.length})`));
    courses.forEach(co => c.push(bullet(co.name)));
  }

  c.push(h2('Instructor-Led Workshops'));
  c.push(body(`${ilt.workshops.length} workshops delivered by PSMs, SAs, and subject matter experts. High-touch, scheduled, application-specific.`));
  ilt.workshops.forEach(w => c.push(bullet(w.name)));

  c.push(h2('Specialist Engagements'));
  c.push(body(`${specialist.engagements.length} specialist engagements — the highest-value, most customized enablement touchpoints.`));
  const engCats = {};
  specialist.engagements.forEach(e => { const k = e.category; if (!engCats[k]) engCats[k] = []; engCats[k].push(e); });
  for (const [cat, engs] of Object.entries(engCats)) {
    c.push(h3(`${cat} (${engs.length})`));
    engs.forEach(e => c.push(bullet(e.name)));
  }

  c.push(h2('RACI — Enablement Asset Lifecycle'));
  c.push(body('Who is responsible for each phase of the enablement asset lifecycle?'));
  c.push(raciTable([
    ['Identify new asset needs', '', '', '', '', '', ''],
    ['Prioritize asset development backlog', '', '', '', '', '', ''],
    ['Create self-paced course content', '', '', '', '', '', ''],
    ['Review and approve course content', '', '', '', '', '', ''],
    ['Design ILT workshop curriculum', '', '', '', '', '', ''],
    ['Schedule and deliver ILT workshops', '', '', '', '', '', ''],
    ['Design specialist engagement format', '', '', '', '', '', ''],
    ['Deliver specialist engagements', '', '', '', '', '', ''],
    ['Retire or update stale content', '', '', '', '', '', ''],
    ['Measure asset effectiveness', '', '', '', '', '', ''],
  ]));
  c.push(prompt('Are there other types of enablement assets we should consider? Certifications, sandbox labs, mentoring, community, documentation, customer ride-alongs?'));
  c.push(inputLabel('Workshop Input — Additional Asset Types'));
  c.push(emptyTbl(['Asset Type', 'Description', 'Target Roles', 'Who Creates', 'Who Approves', 'Priority'], 6));
  c.push(pb());

  // ── Part 3: Academy Course Review ──
  c.push(h1('Part 4 — Academy Course Review'));
  c.push(body('A critical assessment of the current Academy course library. For Connected Enablement to work at scale, self-paced courses must be: current, role-appropriate, journey-aligned, and genuinely self-service (a partner can complete the course without Anaplan assistance).'));
  c.push(h2('Evaluation Criteria'));
  c.push(bulletBold('Currency — ', 'Is the content up to date with the current product version? When was it last reviewed?'));
  c.push(bulletBold('Self-Service Readiness — ', 'Can a partner complete this independently, or does it require context, prerequisites, or Anaplan support?'));
  c.push(bulletBold('Role Relevance — ', 'Which roles does this course serve? Is it labelled correctly? Does it assume a delivery audience when it should also serve sales or pre-sales?'));
  c.push(bulletBold('Journey Alignment — ', 'Which journey stage(s) would this course be assigned to? Is it foundational (Registered/Trained), certification-track (Certified), or advanced (Delivering/Expert)?'));
  c.push(bulletBold('Quality — ', 'Is the production quality acceptable? Are there known issues, broken labs, or outdated screenshots?'));
  c.push(bulletBold('Gap Indicator — ', 'Does this course exist in isolation, or is it part of a coherent learning path? What is missing before and after it?'));

  c.push(h2('Course-by-Course Review'));
  c.push(body('Use this table to evaluate each of the current Academy courses. Mark each criterion as ✓ (adequate), ⚠ (needs improvement), or ✗ (inadequate/missing).'));
  const courseRows = academy.courses.map(co => [co.name, co.catalog, '', '', '', '', '', '']);
  c.push(tbl(['Course Name', 'Catalog', 'Current?', 'Self-Service?', 'Roles Served', 'Journey Stage', 'Quality', 'Gaps / Notes'], courseRows));

  c.push(h2('Key Questions'));
  c.push(prompt('How many of these 54 courses are genuinely self-service today — meaning a partner can start and finish without asking for help?'));
  c.push(prompt('How many are delivery-focused vs. sales/pre-sales appropriate? What is the ratio, and is it right?'));
  c.push(prompt('Which courses are outdated or reference deprecated features/versions?'));
  c.push(prompt('Which courses should be retired, replaced, or consolidated?'));
  c.push(prompt('What new courses are needed to support journeys that currently have no self-paced content?'));
  c.push(prompt('Are the catalog groupings (e.g., "Sales Training for Partners," "Core Solutions") the right way to organize, or should courses be reorganized by journey alignment?'));
  c.push(inputLabel('Workshop Input — Courses Flagged for Action'));
  c.push(emptyTbl(['Course Name', 'Issue', 'Action Needed', 'Owner', 'Priority'], 8));
  c.push(pb());

  // ── Part 4: Roles ──
  c.push(h1('Part 5 — Roles'));
  c.push(body('We started with three familiar roles and expanded to eight. The partner ecosystem may be broader.'));
  c.push(h2('The Initial Three'));
  c.push(bulletBold('Sales — ', 'Builds pipeline, qualifies, presents the value proposition.'));
  c.push(bulletBold('Pre-Sales — ', 'Leads discovery, demos, architects solutions.'));
  c.push(bulletBold('Delivery — ', 'Implements, configures, supports applications.'));
  c.push(h2('The Expanded Eight'));
  c.push(bulletBold('Delivery Lead — ', 'Project management, SOWs, sprints, client communication.'));
  c.push(bulletBold('Solution Architect — ', 'Designs scalable solutions across domains.'));
  c.push(bulletBold('Anaplan Practice Lead — ', 'Practice strategy, growth, team development.'));
  c.push(bulletBold('Industry Lead — ', 'Industry-specific GTM and solution strategy.'));
  c.push(bulletBold('Client Account Lead — ', 'Client relationships, delivery orchestration.'));

  c.push(h2('RACI — Role Definition & Journey Assignment'));
  c.push(raciTable([
    ['Define which roles get dedicated journeys', '', '', '', '', '', ''],
    ['Validate role definitions with partners', '', '', '', '', '', ''],
    ['Assign a partner resource to the correct role', '', '', '', '', '', ''],
    ['Approve role changes / additions', '', '', '', '', '', ''],
    ['Map existing partner resources to roles', '', '', '', '', '', ''],
  ]));

  c.push(prompt('Are there other critical roles? Marketing, Executive Sponsor, TAM, Customer Success, Data Engineer, QA, Training Lead?'));
  c.push(inputLabel('Workshop Input — Additional Roles'));
  c.push(emptyTbl(['Role Name', 'Responsibility', 'How It Differs', 'Who Decides', 'Priority'], 6));
  c.push(pb());

  // ── Part 5: Journeys ──
  c.push(h1('Part 6 — Journeys'));
  c.push(body('A journey is a prescriptive, role-specific path through enablement. Defined by role × product area × experience level. Every journey is opt-in.'));
  c.push(h2('Stages'));
  c.push(tbl(['Stage', 'Delivery', 'Sales', 'Pre-Sales', 'Solution Architect'], [
    ['1', 'Registered', 'Registered', 'Registered', 'Aspiring'],
    ['2', 'Trained', 'Trained', 'Trained', 'Practicing'],
    ['3', 'Certified', 'Certified', 'Certified', 'Designing'],
    ['4', 'Delivering', 'Presenting', 'Solutioning', 'Architecting'],
    ['5', 'Expert', 'Expert', 'Expert', 'Leading'],
  ]));

  c.push(h2('Stage Content'));
  c.push(bulletBold('Assets — ', 'Self-paced courses, workshops, specialist engagements assigned to this stage.'));
  c.push(bulletBold('Activities — ', 'Hands-on tasks: "deliver a coached demo," "complete a supervised project."'));
  c.push(bulletBold('Milestones — ', 'Observable checkpoints: "L1 certification passed," "first client delivery."'));
  c.push(bulletBold('Outcomes — ', 'Capability gained by completing this stage.'));

  c.push(h2('Gates'));
  c.push(body('Gates are quantified criteria to progress. They ensure quality and prevent advancement without demonstrated capability.'));
  c.push(tbl(['Gate', 'Metric', 'Comparison', 'Notes'], [
    ['→ Trained', 'L1 coursework', 'complete', 'All required modules'],
    ['→ Certified', 'L1 Model Builder cert', 'passed', 'Proctored exam'],
    ['→ Delivering', 'Supervised projects', '≥ 2', 'SA scorecard ≥ 4.0'],
    ['→ Expert', 'Independent deliveries', '≥ 4', 'CSAT ≥ 4.0 + peer review'],
  ]));

  c.push(h2('RACI — Journey Lifecycle'));
  c.push(raciTable([
    ['Define journey structure, stages, and gate criteria', '', '', '', '', '', ''],
    ['Select and assign assets to each stage', '', '', '', '', '', ''],
    ['Approve journey definitions before rollout', '', '', '', '', '', ''],
    ['Assign a partner to the correct journey', '', '', '', '', '', ''],
    ['Conduct gate reviews and stage sign-off', '', '', '', '', '', ''],
    ['Complete journey tasks and submit evidence', '', '', '', '', '', ''],
    ['Escalate blocked or disputed gate decisions', '', '', '', '', '', ''],
    ['Update journeys when products or assets change', '', '', '', '', '', ''],
    ['Prioritize which journeys to build next', '', '', '', '', '', ''],
    ['Retire or archive deprecated journeys', '', '', '', '', '', ''],
  ]));

  c.push(prompt('How many stages? Too few = meaningless, too many = bureaucratic.'));
  c.push(prompt('Should all roles share the same stage names, or can each role have unique stages?'));
  c.push(prompt('How do journeys differ across product areas? Same stages, different content? Or fundamentally different structures?'));
  c.push(prompt('Who has final approval authority on gate progression? PSM? SA? Committee?'));
  c.push(prompt('How are disputes handled when a partner disagrees with a gate assessment?'));
  c.push(inputLabel('Workshop Input — Journey Definitions'));
  c.push(emptyTbl(['Journey (Role + Product)', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'], 6));
  c.push(inputLabel('Workshop Input — Gate Criteria'));
  c.push(emptyTbl(['From Stage', 'To Stage', 'Metric', 'Threshold', 'Who Validates', 'Approval Process'], 8));
  c.push(pb());

  // ── Part 6: Achievements ──
  c.push(h1('Part 7 — Achievements'));
  c.push(body('Achievements are Layer 3 outcomes — designations earned by completing a combination of journeys and additional enablement.'));
  c.push(h2('Current Achievements'));
  c.push(tbl(['Achievement', 'Composed Of'], [
    ['💰 Finance Expert', 'IFP + Financial Close + Finance Suite'],
    ['🛍 Retail Expert', 'Assortment + Demand + Inventory'],
    ['📦 Supply Chain Expert', 'TPM + Production + IBP'],
    ['👥 Workforce Expert', 'OWP + Contact Center + Resource Planning'],
    ['🤖 AI Products Expert', 'CoModeler + Agent Studio'],
    ['🏦 Agentic Office of the CFO', 'Finance + AI + Connected Planning'],
    ['🏆 Connected Planning Champion', 'Expert across multiple domains'],
  ]));

  c.push(h2('RACI — Achievement Lifecycle'));
  c.push(raciTable([
    ['Define achievement criteria and composition', '', '', '', '', '', ''],
    ['Approve achievement definitions', '', '', '', '', '', ''],
    ['Evaluate partner readiness for achievement', '', '', '', '', '', ''],
    ['Award achievement designation', '', '', '', '', '', ''],
    ['Publish achievement to marketplace / directory', '', '', '', '', '', ''],
    ['Review achievement for renewal / expiration', '', '', '', '', '', ''],
    ['Revoke achievement if criteria no longer met', '', '', '', '', '', ''],
  ]));

  c.push(prompt('What achievements matter most to customers selecting a partner?'));
  c.push(prompt('How should achievements be recognized? Badges, certificates, marketplace listings, tier credit?'));
  c.push(prompt('Should achievements expire? If so, what is the renewal cadence and what must be re-demonstrated?'));
  c.push(prompt('Who has authority to award an achievement? Is it automatic (criteria met = awarded) or does it require human review?'));
  c.push(inputLabel('Workshop Input — Achievement Definitions'));
  c.push(emptyTbl(['Achievement', 'Required Journeys', 'Required Assets', 'Evidence / Metrics', 'Renewal Period', 'Awarded By'], 6));
  c.push(pb());

  // ── Part 7: Governance & RACI ──
  c.push(h1('Part 8 — Governance & RACI'));
  c.push(body('Connected Enablement requires clear governance. Who decides what gets built? Who creates content? Who delivers workshops? Who approves progression? Who measures success? Without governance, the framework becomes a list of good intentions.'));

  c.push(h2('Key Governance Questions'));
  c.push(prompt('How are new enablement tasks prioritized? Who manages the backlog?'));
  c.push(prompt('What is the approval process for a new journey, a new achievement, or a new gate criterion?'));
  c.push(prompt('Who is accountable when a partner is stuck at a gate and cannot progress?'));
  c.push(prompt('How frequently are journeys reviewed and updated? Quarterly? Annually? On product release?'));
  c.push(prompt('Who owns the relationship with the Academy team for course creation and updates?'));
  c.push(prompt('How are ILT workshops scheduled, staffed, and evaluated? Who decides the cadence?'));
  c.push(prompt('Who assigns specialist engagements to specific partners? How is demand managed vs. capacity?'));
  c.push(prompt('How does the governance model scale from 10 partners to 100 partners?'));

  c.push(h2('Cross-Functional RACI — End-to-End'));
  c.push(body('Fill in R (Responsible), A (Accountable), C (Consulted), I (Informed) for each activity.'));
  c.push(raciTable([
    ['Define the overall enablement strategy', '', '', '', '', '', ''],
    ['Create and maintain self-paced courses', '', '', '', '', '', ''],
    ['Design and maintain ILT workshop curriculum', '', '', '', '', '', ''],
    ['Deliver PSM-led workshops and orientations', '', '', '', '', '', ''],
    ['Build and maintain specialist delivery blueprints', '', '', '', '', '', ''],
    ['Assign partners to correct journey paths', '', '', '', '', '', ''],
    ['Conduct gate reviews and stage sign-off', '', '', '', '', '', ''],
    ['Complete journey tasks and submit evidence', '', '', '', '', '', ''],
    ['Deliver supervised delivery oversight (SA pairing)', '', '', '', '', '', ''],
    ['New product enablement readiness (post-GA)', '', '', '', '', '', ''],
    ['Track partner progress and enablement health', '', '', '', '', '', ''],
    ['Award achievements and designations', '', '', '', '', '', ''],
    ['Report enablement metrics to leadership', '', '', '', '', '', ''],
    ['Manage the enablement platform / tooling', '', '', '', '', '', ''],
    ['Handle partner escalations and exceptions', '', '', '', '', '', ''],
  ]));

  c.push(h2('Task Prioritization Framework'));
  c.push(body('Not everything can be built at once. How should enablement initiatives be prioritized?'));
  c.push(prompt('What framework do you use today? Impact vs. effort? Business value vs. complexity? MoSCoW?'));
  c.push(inputLabel('Workshop Input — Prioritization Criteria'));
  c.push(emptyTbl(['Criterion', 'Weight', 'How Assessed', 'Who Scores', 'Example'], 5));
  c.push(inputLabel('Workshop Input — Approval Process'));
  c.push(emptyTbl(['Decision Type', 'Who Proposes', 'Who Reviews', 'Who Approves', 'Turnaround Time'], 5));
  c.push(pb());

  // ── Part 8: Measurement ──
  c.push(h1('Part 9 — Measurement & Impact'));
  c.push(body('Every journey and achievement should connect to measurable business outcomes.'));
  c.push(h2('📈 Pipeline Growth'));
  c.push(bulletBold('Lagging: ', 'Partner-sourced pipeline ($), win rate (%), deal size, time-to-close.'));
  c.push(bulletBold('Leading: ', 'Opportunities registered, co-sell motions, executive presentations delivered.'));
  c.push(bulletBold('Correlation: ', 'Do partners with more Sales-certified resources generate more pipeline?'));
  c.push(h2('🎓 Technical Expertise'));
  c.push(bulletBold('Certifications: ', 'L1/L2 Model Builder, app-specific certs, SA credentials.'));
  c.push(bulletBold('Depth: ', 'Applications covered, cross-domain capability, blueprint contributions.'));
  c.push(bulletBold('Quality: ', 'SA scorecard ratings, model review outcomes, peer assessments.'));
  c.push(h2('⭐ Delivery Excellence'));
  c.push(bulletBold('Satisfaction: ', 'CSAT, NPS, reference willingness.'));
  c.push(bulletBold('Delivery: ', 'On-time %, scope change rate, go-live success, hypercare outcomes.'));
  c.push(bulletBold('Ecosystem: ', 'Supervised-to-independent ratio, mentor-to-mentee ratio, time-to-independence.'));
  c.push(inputLabel('Workshop Input — KPIs'));
  c.push(emptyTbl(['Pillar', 'KPI', 'Data Source', 'Frequency', 'Owner', 'Target'], 8));
  c.push(pb());

  // ── Part 9: Use Cases ──
  c.push(h1('Part 10 — Use Cases & Scenarios'));
  const useCases = [
    ['New partner onboarding', 'A Strategic Partner signs. Zero certified resources. What is Day 1? What journeys do their first 5 hires start on?'],
    ['Expanding into a new product', 'An established Finance partner wants RSC capability. Strong IFP delivery, no RSC experience. How?'],
    ['Scaling 5 → 50 resources', 'A Specialist partner is growing fast. How do journeys onboard 45 new people while maintaining quality?'],
    ['AI product readiness', 'CoModeler and Agent Studio are GA. Partner wants first-mover advantage. No courses exist yet. Now what?'],
    ['Sales team enablement', 'Strong delivery, weak pipeline. Sales team has never sold Anaplan. What journey gets them to first qualified opportunity?'],
    ['Partner re-engagement', 'Partner completed enablement 18 months ago, went inactive. Certs may be stale. How does the framework handle re-entry?'],
    ['Delivery quality issue', 'A partner\'s last two deliveries received CSAT < 3.0. How does the framework respond? Remediation journey?'],
    ['Cross-partner collaboration', 'Two partners need to collaborate on a large deal — one owns Finance, the other owns SC. How do enablement journeys support joint delivery?'],
  ];
  for (const [title, desc] of useCases) {
    c.push(h3(title));
    c.push(body(desc));
    c.push(prompt('How would you handle this? What journeys, assets, gates, and governance apply?'));
    c.push(...blankLines(3));
  }
  c.push(inputLabel('Workshop Input — Additional Scenarios'));
  c.push(emptyTbl(['Scenario', 'Challenge', 'Framework Response', "What's Missing"], 4));
  c.push(pb());

  // ── Part 10: Interactive Exercises ──
  c.push(h1('Part 11 — Interactive Exercises'));
  c.push(body('This section contains structured group exercises to run during the workshop. Each exercise includes timing, instructions, and a template. Mix and match based on the group size and energy level.'));

  // Exercise A: 2x2 Prioritization Quadrant
  c.push(h2('Exercise A — 2×2 Prioritization Quadrant'));
  c.push(body('⏱ Time: 15–20 minutes (5 min individual, 10–15 min group discussion)'));
  c.push(body('Purpose: Prioritize which journeys, assets, or initiatives to build first by plotting them on an Impact vs. Complexity grid.'));
  c.push(h3('Instructions'));
  c.push(bullet('Each participant receives a set of sticky notes (or digital cards) with items to prioritize.'));
  c.push(bullet('Working individually (2 min), each person places their top 5 items on the quadrant.'));
  c.push(bullet('As a group, discuss clusters and disagreements. The goal is alignment on the top-right ("Do First") and bottom-left ("Deprioritize") quadrants.'));
  c.push(bullet('Capture the final placement in the template below.'));
  c.push(h3('Quadrant Template'));
  c.push(tbl(
    ['', 'Low Complexity / Fast', 'High Complexity / Slow'],
    [
      ['HIGH IMPACT', '✅  DO FIRST\n(Quick wins with high return)', '📋  PLAN & INVEST\n(Worth it but needs resources & time)'],
      ['LOW IMPACT', '🔄  FILL IN LATER\n(Easy but not urgent)', '⛔  DEPRIORITIZE\n(Hard and low return — skip for now)'],
    ]
  ));
  c.push(h3('Run it three times'));
  c.push(bulletBold('Round 1 — Journeys: ', 'Which of the 26+ journeys should we build first? Write journey names on cards and place them.'));
  c.push(bulletBold('Round 2 — Content Gaps: ', 'Which missing Academy courses or workshops would unblock the most journeys? Place them.'));
  c.push(bulletBold('Round 3 — Achievements: ', 'Which achievements matter most to customers and to partner tiering? Place them.'));
  c.push(inputLabel('Captured Quadrant — Journeys'));
  c.push(emptyTbl(['Quadrant', 'Items Placed', 'Notes'], 4));
  c.push(inputLabel('Captured Quadrant — Content Gaps'));
  c.push(emptyTbl(['Quadrant', 'Items Placed', 'Notes'], 4));
  c.push(inputLabel('Captured Quadrant — Achievements'));
  c.push(emptyTbl(['Quadrant', 'Items Placed', 'Notes'], 4));

  // Exercise B: Dot Voting
  c.push(h2('Exercise B — Dot Voting'));
  c.push(body('⏱ Time: 5–10 minutes'));
  c.push(body('Purpose: Quickly surface the group\'s collective priorities without lengthy debate.'));
  c.push(h3('Instructions'));
  c.push(bullet('Post the full list of items on the wall or screen (e.g., all 8 roles, all proposed journeys, all content gaps).'));
  c.push(bullet('Each participant gets 3 dots (stickers, markers, or digital votes).'));
  c.push(bullet('Place all 3 dots on the items you think are most important. You can put multiple dots on one item.'));
  c.push(bullet('Count the dots. The top vote-getters are the group\'s priorities.'));
  c.push(h3('Suggested voting rounds'));
  c.push(bulletBold('Vote 1: ', '"Which roles should get their first journey built in the next quarter?"'));
  c.push(bulletBold('Vote 2: ', '"Which gate criterion is most important to get right first?"'));
  c.push(bulletBold('Vote 3: ', '"Which achievement would you highlight to a customer tomorrow if it existed?"'));
  c.push(inputLabel('Dot Voting Results'));
  c.push(emptyTbl(['Item', 'Votes', 'Rank'], 8));

  // Exercise C: Persona Empathy Mapping
  c.push(h2('Exercise C — Persona Empathy Map'));
  c.push(body('⏱ Time: 15 minutes (pick 1–2 personas)'));
  c.push(body('Purpose: Build shared understanding of what a specific role needs by mapping their experience from multiple angles.'));
  c.push(h3('Instructions'));
  c.push(bullet('Select one of the 8 roles (e.g., a brand-new Sales resource at a partner who has never sold Anaplan).'));
  c.push(bullet('As a group, fill in the four quadrants of the empathy map.'));
  c.push(h3('Empathy Map Template'));
  c.push(tbl(
    ['', 'Internal', 'External'],
    [
      ['THINKS & FEELS', '"What are they worried about?\nWhat do they hope for?\nWhat frustrates them about\ncurrent enablement?"', '"What do they hear from\ntheir manager, peers,\nor Anaplan about what\nthey should be doing?"'],
      ['DOES & NEEDS', '"What actions are they taking\ntoday to learn Anaplan?\nWhat workarounds do they use?"', '"What do they actually need\nto succeed in their role?\nWhat would make their\nfirst 90 days easier?"'],
    ]
  ));
  c.push(inputLabel('Empathy Map Capture'));
  c.push(emptyTbl(['Quadrant', 'Key Insights', 'Implications for Journey Design'], 4));

  // Exercise D: Card Sort — Assets to Stages
  c.push(h2('Exercise D — Card Sort: Assets into Stages'));
  c.push(body('⏱ Time: 15–20 minutes'));
  c.push(body('Purpose: Physically assemble a journey by sorting enablement assets into stages. This makes the framework tangible.'));
  c.push(h3('Instructions'));
  c.push(bullet('Print or display cards for 15–20 enablement assets (mix of Academy courses, workshops, and specialist engagements).'));
  c.push(bullet('Print 5 stage headers: Registered, Trained, Certified, Delivering, Expert.'));
  c.push(bullet('Lay the stage headers in a row on the table.'));
  c.push(bullet('Working in pairs, sort the asset cards into the stages where they belong.'));
  c.push(bullet('Compare results across pairs. Discuss disagreements — they reveal assumptions about the journey.'));
  c.push(prompt('Where did pairs disagree? What does the disagreement reveal about how different people think about progression?'));
  c.push(...blankLines(3));

  // Exercise E: Rose / Thorn / Bud
  c.push(h2('Exercise E — Rose / Thorn / Bud'));
  c.push(body('⏱ Time: 10 minutes'));
  c.push(body('Purpose: A structured reflection on the current state of partner enablement before designing the future state.'));
  c.push(h3('Instructions'));
  c.push(bullet('Each participant writes 1–2 sticky notes for each category:'));
  c.push(bulletBold('🌹 Rose — ', 'Something that is working well in partner enablement today.'));
  c.push(bulletBold('🥀 Thorn — ', 'Something that is a pain point or clearly broken.'));
  c.push(bulletBold('🌱 Bud — ', 'Something with potential that hasn\'t been fully developed yet.'));
  c.push(bullet('Post all notes. Group by theme. The themes become the workshop\'s priority topics.'));
  c.push(inputLabel('Rose / Thorn / Bud — Themes'));
  c.push(emptyTbl(['Category', 'Theme', 'Number of Notes', 'Priority?'], 6));

  // Exercise F: "How Might We" Reframing
  c.push(h2('Exercise F — "How Might We" Reframing'));
  c.push(body('⏱ Time: 10 minutes'));
  c.push(body('Purpose: Transform problems and complaints into actionable opportunity statements.'));
  c.push(h3('Instructions'));
  c.push(bullet('Take the top 3–5 Thorns from Exercise E.'));
  c.push(bullet('For each one, reframe it as a "How might we…?" question.'));
  c.push(bullet('Example: Thorn = "Sales partners have no Anaplan-specific training" → "How might we build a Sales enablement journey that gets a new seller to their first qualified opportunity in 30 days?"'));
  c.push(inputLabel('"How Might We" Statements'));
  c.push(emptyTbl(['Thorn (Problem)', '"How Might We…?" (Opportunity)', 'Ideas'], 5));

  // Exercise G: Lightning Decision Jam
  c.push(h2('Exercise G — Lightning Decision Jam'));
  c.push(body('⏱ Time: 20 minutes'));
  c.push(body('Purpose: Move from discussion to decisions fast. Good for the end of the workshop when energy is high and time is short.'));
  c.push(h3('Steps'));
  c.push(bulletBold('1. Problems (2 min): ', 'Everyone writes problems on sticky notes silently. One problem per note.'));
  c.push(bulletBold('2. Vote (2 min): ', 'Dot-vote on the top 3 problems.'));
  c.push(bulletBold('3. Reframe (3 min): ', 'Convert the top 3 into "How Might We" statements.'));
  c.push(bulletBold('4. Solutions (3 min): ', 'Everyone writes solution ideas silently for the top HMW.'));
  c.push(bulletBold('5. Vote (2 min): ', 'Dot-vote on the best solutions.'));
  c.push(bulletBold('6. Action (5 min): ', 'For each winning solution: define the action, owner, and due date.'));
  c.push(inputLabel('Lightning Jam — Decisions Made'));
  c.push(emptyTbl(['HMW Statement', 'Winning Solution', 'Action', 'Owner', 'Due Date'], 3));

  // Exercise H: Before / After Self-Assessment
  c.push(h2('Exercise H — Before / After Self-Assessment'));
  c.push(body('⏱ Time: 5 minutes at the START of the workshop, 5 minutes at the END'));
  c.push(body('Purpose: Capture a subjective baseline before the workshop and measure the shift afterward. This gives the facilitator immediate feedback on which topics landed and which need follow-up. It also gives participants a visible sense of their own growth across the session.'));
  c.push(h3('Instructions'));
  c.push(bullet('At the BEGINNING of the workshop, ask each participant to rate themselves 1–10 on each statement below. Record in the "Before" column.'));
  c.push(bullet('At the END of the workshop, rate again in the "After" column.'));
  c.push(bullet('Discuss: Where did the biggest shifts happen? Where are we still below a 7? Those are the follow-up topics.'));

  c.push(h3('Self-Assessment: Partner Enablement Confidence'));
  c.push(tbl(
    ['Statement', 'Before (1–10)', 'After (1–10)', 'Δ'],
    [
      ['I fully understand the metrics that drive successful partner implementations.', '', '', ''],
      ['I can identify the leading indicators for partner-sourced pipeline.', '', '', ''],
      ['I understand the levers Anaplan can adjust to change partner behavior.', '', '', ''],
      ['I can predict which projects are likely to succeed and lead to expansion.', '', '', ''],
      ['I know what "delivery-ready" looks like for each partner role.', '', '', ''],
      ['I can articulate the difference between an enablement asset, a journey, and an achievement.', '', '', ''],
      ['I understand how gate criteria ensure quality without creating bureaucracy.', '', '', ''],
      ['I know which partner roles are currently underserved by enablement.', '', '', ''],
      ['I can explain how Connected Enablement supports pipeline growth specifically.', '', '', ''],
      ['I can explain how Connected Enablement supports delivery excellence specifically.', '', '', ''],
      ['I understand the RACI for who creates, approves, and delivers enablement.', '', '', ''],
      ['I could recommend the right enablement journey for a specific partner resource today.', '', '', ''],
    ]
  ));

  c.push(h3('Facilitator Notes'));
  c.push(body('Look for:'));
  c.push(bulletBold('Big shifts (Δ ≥ 3): ', 'The workshop content landed. Reinforce with follow-up materials.'));
  c.push(bulletBold('Small shifts (Δ ≤ 1): ', 'The topic needs more depth or a different approach. Consider a follow-up session.'));
  c.push(bulletBold('Consistently low "After" scores: ', 'The group may need foundational context before designing the framework. Don\'t force decisions on topics where confidence is low.'));
  c.push(bulletBold('Disagreement between participants: ', 'If one person rates a 9 and another a 3 on the same statement, that\'s a conversation worth having. It reveals assumptions.'));

  c.push(prompt('Optional: ask 2–3 participants to share their biggest "Before → After" shift and what caused it.'));

  c.push(h3('Open-Ended Reflection (End of Workshop)'));
  c.push(body('In addition to the numerical ratings, ask each participant to write one sentence for each:'));
  c.push(inputLabel('"The most important thing I learned today was…"'));
  c.push(...blankLines(2));
  c.push(inputLabel('"The thing I\'m still uncertain about is…"'));
  c.push(...blankLines(2));
  c.push(inputLabel('"The one thing I will do differently starting next week is…"'));
  c.push(...blankLines(2));

  c.push(pb());

  // ── Part 11: Day 2 — Stakeholder Sessions ──
  c.push(h1('Part 12 — Day 2: Stakeholder & Business Unit Sessions'));
  c.push(body('Day 2 shifts from "design the framework" to "align the organization." The audience changes from the core enablement team to the leaders and owners of the business units whose participation is essential to make Connected Enablement real. Each session is a pitch, an ask, and a commitment.'));

  c.push(h2('Session Format'));
  c.push(body('Each stakeholder session follows a consistent three-part structure:'));
  c.push(bulletBold('1. The Story (10 min) — ', 'Walk through the Connected Enablement framework and show the stakeholder exactly where their team fits. Use the prototype demo. Make it concrete: "Here is what we need from you, here is what you get back."'));
  c.push(bulletBold('2. The Ask (15 min) — ', 'Present specific requests: content to create, reviews to conduct, capacity to allocate, data to provide, decisions to make. Be precise about scope, timeline, and effort.'));
  c.push(bulletBold('3. The Commitment (5 min) — ', 'Agree on next steps, owners, and dates. Capture in the action items table. No session ends without at least one concrete commitment.'));

  c.push(h2('Stakeholder Map'));
  c.push(body('Identify every business unit that touches partner enablement. For each, define: what they own, what we need from them, and what they get back.'));
  c.push(tbl(
    ['Business Unit', 'What They Own', 'What We Need', 'What They Get Back'],
    [
      ['Academy', 'Self-paced course catalog, LMS platform', 'Course creation for journey gaps, curriculum alignment to stages, self-service readiness audit', 'Clear demand signal (which courses are needed, by when, for which journeys), reduced ad-hoc requests'],
      ['Professional Services', 'SA capacity, delivery blueprints, supervised delivery', 'SA time for gate reviews, delivery scorecard data, blueprint updates aligned to journeys', 'Structured partner onramp that reduces SA support burden over time, better-prepared partners'],
      ['Partner Success (PSMs)', 'Partner relationships, journey assignment, gate reviews', 'PSM adoption of journey framework, consistent gate evaluation, progress reporting', 'A system that replaces ad-hoc enablement planning with prescriptive paths, clearer partner health metrics'],
      ['Sales Operations', 'Pipeline data, deal registration, co-sell programs', 'Pipeline metrics by partner certification level, leading indicator data', 'Evidence that enablement drives pipeline, data to justify partner investment'],
      ['Customer Success', 'Post-deployment CSAT, adoption metrics, renewal data', 'Delivery quality data tied to partner enablement level, expansion correlation', 'Better partner quality = better customer outcomes = higher retention'],
      ['Product', 'Product roadmap, GA timelines, feature documentation', 'Early access to product content for enablement development, SME time for course/workshop reviews', 'Faster partner readiness at GA, reduced support tickets from undertrained partners'],
      ['Marketing', 'Partner communications, marketplace listings, co-marketing', 'Achievement badge assets, partner capability messaging, marketplace integration', 'Verified partner capabilities to promote, stronger co-marketing stories'],
      ['Partner Leadership', 'Partner strategy, tier requirements, business planning', 'Tier criteria aligned to achievements, executive sponsorship', 'Objective, measurable partner capability data to inform tiering and investment decisions'],
    ]
  ));
  c.push(pb());

  // Session details per stakeholder
  c.push(h2('Session 1 — Academy'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('The Academy is the engine of Layer 1. Self-paced courses are the most scalable enablement asset. But today, of the 54 courses available, many were created for a general audience and may not be role-specific, journey-aligned, or genuinely self-service. Connected Enablement creates a clear demand signal: every journey stage specifies exactly which courses are needed.'));
  c.push(h3('The Ask'));
  c.push(bullet('Conduct the Academy course review (Part 3 of the workshop guide) — evaluate all 54 courses for currency, self-service readiness, role relevance, and journey alignment.'));
  c.push(bullet('Commit to a quarterly course creation cadence aligned to journey priority (top journeys from the Day 1 quadrant exercise).'));
  c.push(bullet('Establish a feedback loop: when a PSM or partner flags a course as inadequate, what is the process to update or replace it?'));
  c.push(bullet('Provide course completion data by partner and by role for enablement health reporting.'));
  c.push(h3('What They Get Back'));
  c.push(bullet('A prioritized backlog of courses to create — no more guessing what partners need.'));
  c.push(bullet('Course utilization data tied to journey progression — proof of which courses drive outcomes.'));
  c.push(bullet('Reduced ad-hoc "can you create a course on X?" requests — the journey framework absorbs those.'));
  c.push(inputLabel('Session 1 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Session 2 — Professional Services'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('Professional Services owns the highest-value enablement touchpoints: SA pairings, supervised delivery, architecture reviews, and delivery scorecards. These are the gates that determine whether a partner is truly ready to deliver independently. Without PS participation, the framework has no teeth.'));
  c.push(h3('The Ask'));
  c.push(bullet('Allocate SA capacity for gate reviews and supervised delivery oversight — define how many hours per quarter per partner.'));
  c.push(bullet('Formalize the delivery scorecard as a gate criterion (standardize the rubric across SAs).'));
  c.push(bullet('Align specialist engagement formats (architecture reviews, project kickoffs) to journey stages — specify which engagements map to which stage.'));
  c.push(bullet('Provide delivery quality data (CSAT, scorecard ratings) as inputs to journey health reporting.'));
  c.push(h3('What They Get Back'));
  c.push(bullet('Partners arrive at supervised delivery better prepared — less SA hand-holding.'));
  c.push(bullet('A structured pipeline of partners moving toward independence — predictable capacity demand.'));
  c.push(bullet('Data showing that PS investment in enablement reduces long-term support cost.'));
  c.push(inputLabel('Session 2 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Session 3 — Partner Success (PSMs)'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('PSMs are the face of enablement to the partner. They assign journeys, conduct gate reviews, deliver workshops, and track progress. Connected Enablement replaces ad-hoc enablement planning ("what should this partner do next?") with a prescriptive system ("the journey says they need X, Y, Z to reach the next stage").'));
  c.push(h3('The Ask'));
  c.push(bullet('Adopt the journey framework as the primary enablement planning tool — every partner gets a journey, every resource gets a path.'));
  c.push(bullet('Conduct gate evaluations using the standardized criteria — consistent across PSMs.'));
  c.push(bullet('Report journey progress in partner reviews — make it visible to partner leadership.'));
  c.push(bullet('Provide feedback on journey design: what works, what is too rigid, what is missing.'));
  c.push(h3('What They Get Back'));
  c.push(bullet('A system that answers "what should this partner do next?" — no more building enablement plans from scratch.'));
  c.push(bullet('Objective data for partner conversations — "you need X to reach Certified" instead of "maybe try some courses."'));
  c.push(bullet('Visibility into partner health across the portfolio — which partners are progressing, which are stuck.'));
  c.push(inputLabel('Session 3 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Session 4 — Sales Operations'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('Connected Enablement exists to drive business outcomes, not just training completions. Sales Operations owns the pipeline data that proves (or disproves) whether enablement is working. The hypothesis: partners with more certified, journey-progressed resources generate more pipeline, close more deals, and do so faster.'));
  c.push(h3('The Ask'));
  c.push(bullet('Provide pipeline metrics segmented by partner enablement level — are journey-advanced partners performing better?'));
  c.push(bullet('Define the leading indicators for partner-sourced pipeline that enablement should target.'));
  c.push(bullet('Integrate partner enablement data into sales planning — which partners should get co-sell support based on their enablement maturity?'));
  c.push(h3('What They Get Back'));
  c.push(bullet('Data-backed investment decisions — invest enablement resources where pipeline impact is highest.'));
  c.push(bullet('A predictive model: partner enablement level → expected pipeline contribution.'));
  c.push(inputLabel('Session 4 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Session 5 — Customer Success'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('The ultimate test of partner enablement is customer outcomes. Customer Success owns the data that shows whether enabled partners deliver better results: higher CSAT, better adoption, more renewals, more expansion. Connected Enablement creates a traceable path from "partner completed this journey" to "customer got this outcome."'));
  c.push(h3('The Ask'));
  c.push(bullet('Share CSAT and adoption data tied to the delivering partner and their enablement level.'));
  c.push(bullet('Identify leading indicators that predict successful implementations leading to expansion.'));
  c.push(bullet('Participate in defining Delivery Excellence metrics — what does "good" look like from the customer\'s perspective?'));
  c.push(h3('What They Get Back'));
  c.push(bullet('Better partner quality = better customer outcomes = higher retention and NRR.'));
  c.push(bullet('Early warning signals when an underqualified partner is assigned to a critical account.'));
  c.push(inputLabel('Session 5 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Session 6 — Product'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('New products (CoModeler, Agent Studio, Polaris) launch with minimal partner enablement. Partners may wait months post-GA before role-specific training exists. Connected Enablement creates a "new product enablement readiness" process: Product provides early content and SME access, Academy builds the courses, PS builds the blueprints — all before GA, not after.'));
  c.push(h3('The Ask'));
  c.push(bullet('Include "partner enablement readiness" as a GA checklist item — no product launches without at least a foundational journey defined.'));
  c.push(bullet('Provide SME access 90 days before GA for course and blueprint development.'));
  c.push(bullet('Review and validate application-specific enablement content for technical accuracy.'));
  c.push(h3('What They Get Back'));
  c.push(bullet('Faster partner adoption of new products — more implementations, more customer references, faster feedback loop.'));
  c.push(bullet('Fewer support tickets from undertrained partners attempting new product deployments.'));
  c.push(inputLabel('Session 6 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Session 7 — Partner Leadership & Strategy'));
  c.push(body('⏱ 30 minutes'));
  c.push(h3('The Story'));
  c.push(body('Connected Enablement provides objective, measurable partner capability data. This data should inform partner tiering, investment decisions, and strategic planning. Achievements become the language of partner capability — not "they say they can do Finance" but "they have earned the Finance Expert designation backed by certified resources and proven delivery."'));
  c.push(h3('The Ask'));
  c.push(bullet('Align partner tier criteria to achievements — make achievement attainment a factor in tier advancement.'));
  c.push(bullet('Use journey and achievement data in annual partner business planning.'));
  c.push(bullet('Provide executive sponsorship for the Connected Enablement program — signal to the organization that this is a priority.'));
  c.push(h3('What They Get Back'));
  c.push(bullet('Objective partner capability data — no more relying on self-reported competency.'));
  c.push(bullet('A defensible framework for partner investment decisions — invest where capability is demonstrated.'));
  c.push(inputLabel('Session 7 — Commitments'));
  c.push(emptyTbl(['Commitment', 'Owner', 'Due Date', 'Dependencies'], 4));

  c.push(h2('Cross-Cutting Issue — Missing Enablement Assets'));
  c.push(body('This is the single most important operational question in Connected Enablement: what happens when a journey requires an asset that does not exist? This will happen constantly — every new journey, every new product, every new role will expose gaps. Without a clear, repeatable process, gaps become permanent and journeys become aspirational documents rather than actionable paths.'));
  c.push(body('This topic should be raised in EVERY stakeholder session, tailored to that audience. It is not one team\'s problem — it spans Academy, Professional Services, Product, and Partner Success.'));

  c.push(h3('The Lifecycle of a Missing Asset'));
  c.push(body('When someone identifies that an enablement asset is missing, the following questions must be answered:'));
  c.push(tbl(
    ['Question', 'Who Decides', 'Current Answer', 'Desired Answer'],
    [
      ['1. How is the gap identified?', '', 'Ad-hoc: PSM notices, partner complains, SA improvises', ''],
      ['2. Where is the gap logged?', '', 'Email, Slack, sometimes nowhere', ''],
      ['3. How is it prioritized against other gaps?', '', 'Whoever has the loudest voice', ''],
      ['4. Who decides what form the asset takes?\n(Course? Workshop? Blueprint? Doc?)', '', 'Usually defaults to "ask Academy for a course"', ''],
      ['5. Who is responsible for creating it?', '', 'Varies — Academy, PS, or nobody', ''],
      ['6. Who decides the content and scope?', '', 'The creator, with minimal review', ''],
      ['7. Who reviews and approves before release?', '', 'Often no formal review', ''],
      ['8. What is the expected turnaround time?', '', 'Undefined — weeks to never', ''],
      ['9. Will it scale? (Self-service vs. instructor-led)', '', 'Not always considered upfront', ''],
      ['10. Who delivers it if it\'s not self-service?', '', 'Whoever created it, if available', ''],
      ['11. How do we know it\'s working?', '', 'We don\'t — no feedback loop', ''],
      ['12. When is it retired or updated?', '', 'Rarely — content accumulates', ''],
    ]
  ));

  c.push(h3('Proposed Decision Framework'));
  c.push(body('Not every gap needs the same response. The right form depends on urgency, audience size, and longevity.'));
  c.push(tbl(
    ['Situation', 'Recommended Form', 'Created By', 'Turnaround', 'Scalability'],
    [
      ['Critical blocker — partner stuck at gate', 'PSM-delivered session or SA pairing', 'PS / PSM', '1–2 weeks', 'Low (1:1)'],
      ['Multiple partners need the same thing', 'Instructor-led workshop', 'Academy + PS', '4–6 weeks', 'Medium (1:many, scheduled)'],
      ['Foundational knowledge, stable content', 'Self-paced Academy course', 'Academy', '8–12 weeks', 'High (always available)'],
      ['Technical depth, changes with product', 'Delivery blueprint or playbook', 'PS', '4–8 weeks', 'Medium (document)'],
      ['New product, evolving rapidly', 'Interim guide + SME office hours', 'Product + PS', '2–4 weeks', 'Low initially, upgrade later'],
      ['Competitive / GTM positioning', 'Sales playbook + workshop', 'Sales Ops + Academy', '4–6 weeks', 'Medium'],
    ]
  ));

  c.push(h3('RACI — Missing Asset Resolution'));
  c.push(raciTable([
    ['Identify and log the gap', '', '', '', '', '', ''],
    ['Triage and prioritize against backlog', '', '', '', '', '', ''],
    ['Decide the asset form (course, workshop, etc.)', '', '', '', '', '', ''],
    ['Assign creation responsibility', '', '', '', '', '', ''],
    ['Define content scope and requirements', '', '', '', '', '', ''],
    ['Create the asset', '', '', '', '', '', ''],
    ['Review and approve for release', '', '', '', '', '', ''],
    ['Deliver the asset (if not self-service)', '', '', '', '', '', ''],
    ['Measure effectiveness and gather feedback', '', '', '', '', '', ''],
    ['Maintain, update, or retire the asset', '', '', '', '', '', ''],
  ]));

  c.push(h3('Discussion Prompts for Stakeholder Sessions'));
  c.push(prompt('Academy: What is your current capacity for new course development? How many courses per quarter can you realistically produce? What is the minimum lead time?'));
  c.push(prompt('Professional Services: When a gap is identified that only PS can fill (e.g., a delivery blueprint), how is it prioritized against billable work? Who approves the time allocation?'));
  c.push(prompt('Product: For new products approaching GA, at what point does enablement content development start? Who is the SME liaison?'));
  c.push(prompt('PSMs: When you identify a gap in the field, what do you do today? What would you want to happen instead?'));
  c.push(prompt('All: What is an acceptable turnaround time for a critical gap (partner blocked at a gate) vs. a planned gap (new journey being built)?'));
  c.push(prompt('All: How do we prevent the "interim workaround" from becoming the permanent solution? What forces the upgrade from a PSM-delivered session to a scalable Academy course?'));

  c.push(inputLabel('Workshop Input — Gap Resolution Process Design'));
  c.push(emptyTbl(['Process Step', 'Owner', 'Tool / System', 'SLA', 'Escalation Path'], 6));
  c.push(inputLabel('Workshop Input — Known Gaps to Resolve Immediately'));
  c.push(emptyTbl(['Gap Description', 'Blocking Which Journey', 'Recommended Form', 'Proposed Owner', 'Target Date'], 6));

  c.push(pb());

  c.push(h2('Day 2 — Consolidated Timeline'));
  c.push(body('After all sessions, consolidate commitments into a single timeline. Identify dependencies across business units (e.g., Academy can\'t build a course until Product provides SME access).'));
  c.push(inputLabel('Consolidated Timeline'));
  c.push(emptyTbl(['Milestone', 'Business Unit', 'Dependency', 'Target Date', 'Status'], 10));
  c.push(inputLabel('Cross-Team Dependencies'));
  c.push(emptyTbl(['Dependency', 'Blocking Team', 'Blocked Team', 'Resolution Path', 'Escalation Owner'], 5));
  c.push(inputLabel('Day 2 — Open Questions'));
  c.push(emptyTbl(['Question', 'Raised By', 'Needs Input From', 'Target Resolution Date'], 5));

  c.push(pb());

  // ── Part 12: Next Steps ──
  c.push(h1('Part 13 — Next Steps & Prioritization'));
  c.push(h2('What to Build First'));
  c.push(bulletBold('High-impact roles: ', 'Which roles, if enabled first, move the most pipeline or improve delivery fastest?'));
  c.push(bulletBold('High-demand products: ', 'Which product areas have the most partner demand now?'));
  c.push(bulletBold('Quick wins: ', 'Which journeys can be assembled mostly from existing content?'));
  c.push(bulletBold('Content gaps: ', 'Where are the biggest gaps between Academy offerings and journey needs?'));
  c.push(h2('Technology & Platform'));
  c.push(bullet('Journey assignment and tracking'));
  c.push(bullet('Gate evaluation (automated + PSM-reviewed)'));
  c.push(bullet('Achievement assembly and badge issuance'));
  c.push(bullet('Reporting dashboards for PSMs, PAMs, partner leadership'));
  c.push(bullet('Integration with Academy LMS, certification, CRM'));
  c.push(inputLabel('Workshop Input — Prioritization Matrix'));
  c.push(emptyTbl(['Initiative', 'Impact (H/M/L)', 'Effort (H/M/L)', 'Dependencies', 'Owner', 'Target Date'], 8));
  c.push(inputLabel('Workshop Input — Key Decisions'));
  c.push(emptyTbl(['Decision', 'Options', 'Recommendation', 'Owner', 'By When'], 6));
  c.push(inputLabel('Workshop Input — Action Items'));
  c.push(emptyTbl(['Action', 'Owner', 'Due Date', 'Status'], 8));

  return c;
}

async function main() {
  const doc = new Document({
    creator: 'Connected Enablement',
    title: 'Connected Enablement — Workshop Guide',
    numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 200 } } } }] }] },
    sections: [{ properties: {}, children: buildDoc() }]
  });
  const buf = await Packer.toBuffer(doc);
  const outPath = path.join(guideDir, 'Connected-Enablement-Workshop-Guide.docx');
  fs.writeFileSync(outPath, buf);
  console.log(`✓ Workshop guide written to ${path.relative(projectRoot, outPath)}`);
}

main();
