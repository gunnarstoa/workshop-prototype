import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, ImageRun
} from 'docx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { injectIntoTemplate } from './inject-into-template.mjs';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const guideDir   = path.join(projectRoot, 'guide');
const ssDir      = path.join(guideDir, 'screenshots', 'day2');
fs.mkdirSync(guideDir, { recursive: true });

const NAVY   = '0A2F46';
const ORANGE = 'FF6100';
const RED    = '991B1B';
const GREEN  = '1A7A47';

// ── helpers ────────────────────────────────────────────────────────────────
function h1(t) {
  return new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 160 } });
}
function h2(t) {
  return new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 } });
}
function h3(t) {
  return new Paragraph({ text: t, heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 100 } });
}
function body(t) {
  return new Paragraph({ spacing: { before: 40, after: 100 }, children: [new TextRun({ text: t, size: 22 })] });
}
function bodyBold(b, r) {
  return new Paragraph({ spacing: { before: 40, after: 100 }, children: [new TextRun({ text: b, bold: true, size: 22 }), new TextRun({ text: r, size: 22 })] });
}
function bullet(t) {
  return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] });
}
function bulletBold(b, r) {
  return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: b, bold: true, size: 22 }), new TextRun({ text: r, size: 22 })] });
}
function prompt(t) {
  return new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: 'DISCUSS  |  ', bold: true, size: 18, color: ORANGE }), new TextRun({ text: t, italics: true, size: 22, color: ORANGE })] });
}
function facilitator(t) {
  return new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: 'FACILITATOR  |  ', bold: true, size: 18, color: NAVY }), new TextRun({ text: t, italics: true, size: 20, color: NAVY })] });
}
function inputLabel(t) {
  const stripped = t.replace(/^Workshop Input\s*[—-]\s*/i, '');
  return new Paragraph({ spacing: { before: 140, after: 60 }, children: [new TextRun({ text: 'WORKSHOP INPUT  |  ', bold: true, size: 18, color: NAVY }), new TextRun({ text: stripped, bold: true, size: 22, color: NAVY })] });
}
function slideRef(n, title, sub) {
  const parts = [
    new TextRun({ text: `Slide ${n}  `, bold: true, size: 18, color: '888888' }),
    new TextRun({ text: title, italics: true, size: 18, color: '888888' }),
  ];
  if (sub) parts.push(new TextRun({ text: `  —  ${sub}`, size: 17, color: 'AAAAAA' }));
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: parts });
}
function blankLines(n) {
  const l = [];
  for (let i = 0; i < n; i++) {
    l.push(new Paragraph({ children: [new TextRun({ text: '_______________________________________________________________________________', size: 20, color: 'CCCCCC' })] }));
  }
  return l;
}
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

function tbl(headers, rows) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: 'D8D6D0' };
  const borders = { top: b, bottom: b, left: b, right: b };
  const w = Math.floor(9000 / headers.length);
  const hCells = headers.map(h =>
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: 'FFFFFF' })] })], shading: { fill: NAVY, type: ShadingType.SOLID }, borders, width: { size: w, type: WidthType.DXA } })
  );
  const dRows = rows.map(row =>
    new TableRow({ children: row.map(cell => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cell, size: 18 })] })], borders, width: { size: w, type: WidthType.DXA } })) })
  );
  return new Table({ rows: [new TableRow({ children: hCells }), ...dRows], width: { size: 9000, type: WidthType.DXA } });
}

function emptyTbl(headers, n = 5) {
  const rows = [];
  for (let i = 0; i < n; i++) rows.push(headers.map(() => ''));
  return tbl(headers, rows);
}

function screenshot(filename, caption) {
  const ssPath = path.join(ssDir, filename);
  if (!fs.existsSync(ssPath)) return body(`[screenshot: ${filename} — not found]`);
  const img = fs.readFileSync(ssPath);
  const items = [
    new Paragraph({
      spacing: { before: 120, after: 0 },
      children: [new ImageRun({ data: img, transformation: { width: 620, height: 387 }, type: 'png' })]
    })
  ];
  if (caption) {
    items.push(new Paragraph({ spacing: { before: 40, after: 120 }, children: [new TextRun({ text: caption, italics: true, size: 17, color: '888888' })] }));
  }
  return items;
}

// ── document body ────────────────────────────────────────────────────────────
function buildDoc() {
  const c = [];

  // ── Cover summary ─────────────────────────────────────────────────────────
  c.push(h1('Day 2 — Facilitator Guide'));
  c.push(body('This guide covers slides 22–33 of the Connected Enablement prototype. Day 2 shifts the workshop from framework design to cross-functional alignment. Each section below maps to a specific prototype slide, explains what it shows, how to use it, and what decisions or inputs should come out of it.'));

  c.push(tbl(
    ['#', 'Slide Title', 'Type', 'Purpose'],
    [
      ['22', 'Cross-Functional Team Review', 'Section divider',   'Signal the transition from design to alignment'],
      ['23', "Who's Who",                    'Orientation',       'Establish who is in the room and who owns what'],
      ['24', 'Join the Survey',              'Live activity',     'Launch Mentimeter audience poll'],
      ['25', 'Survey Results',               'Live activity',     'Display live results; facilitate discussion'],
      ['26', 'What We Need · What You Gain', 'Framing',          'Set expectations for the cross-functional ask'],
      ['27', 'Current → Future State',       'Reference',         'Shared language for the transformation being designed'],
      ['28', 'Journey Detail',               'Interactive demo',  'Show what a journey looks like role-by-role'],
      ['29', 'Competency Track',             'Interactive demo',  'Show role × product area journey selection'],
      ['30', 'The Framework (Build)',        'Interactive build', 'Layer-by-layer framework reveal for a new audience'],
      ['31', 'Three Layers Over Time',       'Interactive',       'Show how the framework matures over months'],
      ['32', 'The Framework + RACI',        'Interactive + tool', 'Drag-and-drop build with editable RACI modal'],
      ['33', 'Call to Action',               'Closing',           'Commitments and next steps before the room leaves'],
    ]
  ));
  c.push(pb());

  // ── Slide 22: Cross-Functional Team Review ─────────────────────────────────
  c.push(h1('Slide 22 — Cross-Functional Team Review'));
  c.push(slideRef(22, 'Cross-Functional Team Review', 'Section title slide'));
  c.push(...screenshot('slide-22-cross-functional-review.png', 'Slide 22: Section title — dark navy, white headline, orange rule'));

  c.push(h2('What This Slide Is'));
  c.push(body('A section title card. Dark navy background, large white headline, orange horizontal rule. No interactive content. Its purpose is to signal a gear-change: the morning was about understanding the framework; the afternoon is about deciding who owns what.'));

  c.push(h2('How to Use It'));
  c.push(bullet('Pause here before transitioning. Give the room a moment to mentally shift from "learning" to "deciding."'));
  c.push(bullet('Use this slide as the moment to re-state who needs to make a commitment before the day ends.'));
  c.push(bullet('If the morning session ran long, this is a natural reset point — recap the three-layer framework in two sentences, then move on.'));

  c.push(h2('Facilitator Talking Points'));
  c.push(facilitator('"We spent the morning understanding the framework — what assets are, what journeys are, what achievements are. The rest of today is about making it real. That means getting specific about who owns what, what we need from each of you, and what we\'re committing to before we leave."'));
  c.push(facilitator('"Every slide from here is designed to generate a decision or a commitment — not more discussion."'));
  c.push(pb());

  // ── Slide 23: Who's Who ───────────────────────────────────────────────────
  c.push(h1("Slide 23 — Who's Who"));
  c.push(slideRef(23, "Who's Who", 'In the room today'));
  c.push(...screenshot('slide-23-whos-who.png', "Slide 23: Team orientation — 8 business unit cards in a 2×4 grid"));

  c.push(h2('What This Slide Shows'));
  c.push(body('A split layout: the title panel on the left ("Who\'s Who / In the room today"), and eight team cards on the right in a 2×4 grid. Each card has an icon and team name. The eight teams shown are:'));
  c.push(bullet('Solutions Marketing'));
  c.push(bullet('Solutions Consulting'));
  c.push(bullet('Release Management'));
  c.push(bullet('Alliances'));
  c.push(bullet('Professional Services'));
  c.push(bullet('Academy'));
  c.push(bullet('CoE / Product'));
  c.push(bullet('GTM Enablement'));

  c.push(h2('How to Use It'));
  c.push(bullet('Use this slide to quickly orient the room — who is represented, and therefore who is accountable for the commitments made today.'));
  c.push(bullet('If the actual attendee list differs from the slide, call it out explicitly: "We\'re missing X today — that means the Y decision needs to be deferred or someone needs to carry it back."'));
  c.push(bullet('Use the team list as an accountability map: each team on this slide should leave with at least one named action item.'));

  c.push(h2('Facilitation Note'));
  c.push(body('This is a short slide — 2–3 minutes. Its job is to make the cross-functional nature of the session explicit. Every team on that grid has a stake in making the framework work. The goal of the next two hours is to get each of them to say "yes" to a specific commitment.'));

  c.push(prompt('Is everyone who needs to be in this room actually here? If not, who is missing and what does that mean for the decisions we can make today?'));
  c.push(pb());

  // ── Slide 24: Mentimeter Join ──────────────────────────────────────────────
  c.push(h1('Slide 24 — Join the Survey'));
  c.push(slideRef(24, 'Join the Survey', 'Mentimeter audience poll — QR + join code'));
  c.push(...screenshot('slide-24-mentimeter-join.png', 'Slide 24: QR code and menti.com join code on dark navy background'));

  c.push(h2('What This Slide Does'));
  c.push(body('Displays a QR code and the Mentimeter join URL/code so the audience can connect to the live survey on their phones. The slide has two states:'));
  c.push(bulletBold('Display mode (default): ', 'Shows the QR image, "Go to menti.com", and the join code in large orange text.'));
  c.push(bulletBold('Edit mode: ', 'Click "✎ Edit code" at the bottom of the slide to change the join code before the session. The code is saved in localStorage so it persists across page refreshes.'));

  c.push(h2('Setup Before the Session'));
  c.push(bullet('Create your Mentimeter presentation in advance at mentimeter.com.'));
  c.push(bullet('Get your presentation\'s join code (shown in Mentimeter when you start presenting).'));
  c.push(bullet('Before the session, navigate to slide 24 and click "✎ Edit code" at the bottom to enter your code. It will persist until cleared.'));
  c.push(bullet('The default code shown (aluu6kyk3scp) is a placeholder — replace it with your live session code.'));

  c.push(h2('Suggested Survey Questions'));
  c.push(body('Mentimeter works best with quick, high-signal question types. Suggested questions for a Day 2 cross-functional audience:'));
  c.push(tbl(
    ['Question', 'Type', 'Purpose'],
    [
      ['"How clearly do you understand who owns enablement content today?"', 'Scale 1–10', 'Baseline: ownership clarity'],
      ['"Which team do you think is most under-resourced for enablement right now?"', 'Multiple choice', 'Surface friction before RACI discussion'],
      ['"How confident are you that we can deliver a fully digital enablement model in 12 months?"', 'Scale 1–10', 'Confidence check — use to frame ambition vs. reality'],
      ['"What is the single biggest obstacle to making this framework real?"', 'Open text / word cloud', 'Unfiltered blockers — discuss after slide 25'],
      ['"What is the one thing you\'d commit to before leaving today?"', 'Open text', 'Commitment priming — return to during slide 33'],
    ]
  ));

  c.push(h2('Timing'));
  c.push(body('Give the room 90 seconds to scan the QR code and join. Move to slide 25 once the join count stabilizes. Mentimeter shows the number of participants joined in real time in the presenter view.'));
  c.push(pb());

  // ── Slide 25: Mentimeter Results ────────────────────────────────────────────
  c.push(h1('Slide 25 — Survey Results'));
  c.push(slideRef(25, 'Survey Results', 'Live Mentimeter embed'));
  c.push(...screenshot('slide-25-mentimeter.png', 'Slide 25: Live Mentimeter iframe embed — results update in real time'));

  c.push(h2('What This Slide Does'));
  c.push(body('Embeds a live Mentimeter presentation directly in the prototype. Results update in real time as participants vote. The iframe refreshes automatically every 30 seconds as a fallback in case the live WebSocket connection drops.'));
  c.push(bodyBold('Two states: ', ''));
  c.push(bulletBold('No URL saved: ', 'Shows a setup card with a textarea to paste the Mentimeter embed URL or full iframe embed code.'));
  c.push(bulletBold('URL saved: ', 'Shows the live embedded results. Click "✎ Change URL" to update. Click "✕ Clear" to remove.'));

  c.push(h2('Setup'));
  c.push(bullet('In Mentimeter, go to your presentation → Share → Embed → copy the embed URL (not the full iframe tag, just the src URL — or paste the entire iframe code and the slide will extract the URL automatically).'));
  c.push(bullet('Before the session, navigate to slide 25, click "Embed Results" in the setup card, and paste the URL. It saves in localStorage.'));
  c.push(bullet('Alternatively: start Mentimeter in a separate browser window and use the split-screen or alternate-display mode while keeping the prototype on the main screen.'));

  c.push(h2('Facilitation Guide — Running the Results'));
  c.push(body('Advance through Mentimeter questions one at a time. For each result:'));
  c.push(bullet('Read the distribution aloud. "We have a bimodal split here — some of you are very confident, some are not."'));
  c.push(bullet('Ask the outliers to speak first. "Who gave this a 3 or below? What are you seeing that others aren\'t?"'));
  c.push(bullet('For word clouds: cluster themes. "I see \'ownership\', \'resources\', and \'prioritization\' coming up repeatedly — let\'s come back to those in the RACI discussion."'));
  c.push(bullet('Capture the top 3 themes from the open-text question — they become the opening frame for the RACI conversation on slides 32–33.'));

  c.push(prompt('What pattern in these results is most surprising? What confirms what we already knew?'));
  c.push(inputLabel('Survey Results — Key Themes'));
  c.push(emptyTbl(['Question', 'Key Insight', 'Score / Pattern', 'Follow-Up Needed'], 5));
  c.push(pb());

  // ── Slide 26: What We Need / What You Gain ──────────────────────────────────
  c.push(h1('Slide 26 — What We Need · What You Gain'));
  c.push(slideRef(26, 'What We Need · What You Gain', 'The cross-functional ask'));
  c.push(...screenshot('slide-26-what-we-need.png', 'Slide 26: Two-panel — left (What we need from you), right (What\'s in it for us)'));

  c.push(h2('What This Slide Shows'));
  c.push(body('A two-panel layout that frames the cross-functional ask before moving into specifics. The content is editable — click any bullet text on the slide to update it in real time.'));
  c.push(bodyBold('Left panel (dark navy) — "What do we need from you?": ', ''));
  c.push(bullet('Active participation in defining journey ownership and RACI accountability'));
  c.push(bullet('Cross-functional commitment to content reviews, sign-off, and quality standards'));
  c.push(bullet('Alignment on priorities before we scale enablement delivery'));
  c.push(bodyBold('Right panel (cream) — "What\'s in this for us?": ', ''));
  c.push(bullet('A digital and scalable enablement model that reduces reliance on human bandwidth and ad-hoc delivery'));
  c.push(bullet('Consistent partner capability across all roles, products, and regions'));
  c.push(bullet('Measurable outcomes tied to pipeline generation, win rate, and delivery quality'));

  c.push(h2('How to Use It'));
  c.push(bullet('This slide is the pivot point. It acknowledges that you are asking something of each person in the room — and explicitly names what they get back.'));
  c.push(bullet('Customize the bullet points before the session to reflect the specific asks you are making of THIS cross-functional group.'));
  c.push(bullet('Click any bullet text on the slide to edit it live. Changes are not persisted across refreshes — update the source if you want permanent changes.'));
  c.push(bullet('Read both panels aloud. Do not rush this slide. The "What\'s in it for us?" panel needs to land clearly.'));

  c.push(h2('Facilitation Note'));
  c.push(body('The most common failure mode for cross-functional alignment sessions is asking for commitment without naming the return. This slide prevents that. Every person in the room should be able to answer "why does my team care about this?" before the session ends.'));

  c.push(prompt('"Before we go further — does anyone not see their team\'s interest represented on the right panel? What\'s missing?"'));
  c.push(prompt('"Of the three asks on the left, which one is hardest for your team to commit to today? Let\'s name it now rather than later."'));
  c.push(inputLabel('Updated Asks (if modified live)'));
  c.push(emptyTbl(['Original Text', 'Updated Text', 'Why Changed'], 3));
  c.push(pb());

  // ── Slide 27: Current → Future State ────────────────────────────────────────
  c.push(h1('Slide 27 — Current → Future State'));
  c.push(slideRef(27, 'Current → Future State', 'Seven pillars of transformation'));
  c.push(...screenshot('slide-27-current-future.png', 'Slide 27: Current/future state table — seven transformation pillars'));

  c.push(h2('What This Slide Shows'));
  c.push(body('A structured table showing the transformation across seven pillars. Each row shows: the pillar name, a single-word "current state" label (in red), a single-word "future state" label (in green), and a descriptive sentence for each. The seven pillars are:'));
  c.push(tbl(
    ['Pillar', 'Current State', 'Future State'],
    [
      ['Content & Delivery',                'Bespoke & Slow',    'Digital-First & Scalable'],
      ['Enablement Model & Experience',     'Fragmented',        'Connected'],
      ['Learning Approach',                 'Siloed',            'Unified'],
      ['Integration with Partner Program',  'Disconnected',      'Integrated'],
      ['Measurement & Impact',              'Activity-Based',    'Outcome-Driven'],
      ['Enablement Team Focus',             'Bottleneck',        'Strategic'],
      ['Governance & Operations',           'Ad Hoc',            'Governed'],
    ]
  ));

  c.push(h2('How to Use It'));
  c.push(bullet('Use this as a shared reference document — not a slide to "present," but a slide to validate.'));
  c.push(bullet('Ask the room: "Do these descriptions reflect your reality?" The current-state descriptions are deliberately direct. If someone says "that\'s not us," that is important data.'));
  c.push(bullet('Use the future-state descriptions as the design criteria for everything else in Day 2. When a decision comes up, ask: "Which option gets us closer to \'Governed\' / \'Connected\' / \'Outcome-Driven\'?"'));
  c.push(bullet('The table is scrollable in the prototype. On a large screen all 7 rows are typically visible.'));

  c.push(h2('Facilitation — Row by Row'));
  c.push(tbl(
    ['Pillar', 'Key Question', 'Likely Tension'],
    [
      ['Content & Delivery',            '"Are we actually digital-first today — or are we ILT-first with some digital sprinkled in?"',                     'Teams may disagree on what \'digital-first\' means in practice'],
      ['Enablement Model & Experience', '"What would a partner need to experience for us to say we\'re \'Connected\'?"',                                   'Portal vs. journey vs. single source of truth'],
      ['Learning Approach',             '"Where are we duplicating content between internal and partner-facing today?"',                                    'Budget and ownership of shared content'],
      ['Integration with Partner Program', '"Should enablement completion affect tier standing? If so, which achievements?"',                              'Partner program team may not be in the room'],
      ['Measurement & Impact',          '"What is the one metric that would tell us in 6 months whether this is working?"',                                'Pipeline vs. quality vs. satisfaction — different teams prioritize differently'],
      ['Enablement Team Focus',         '"What percentage of PSM and Academy time is currently on \'strategic\' vs. \'admin\'?"',                         'No one wants to admit how much time goes to admin'],
      ['Governance & Operations',       '"What does \'Formal Operating Committee\' mean for this organization — who is on it, how often does it meet?"',  'Ownership without authority is not ownership'],
    ]
  ));

  c.push(prompt('Which row generates the most disagreement in your room? That\'s the one to spend the most time on.'));
  c.push(prompt('"On a scale of 1–10, how far are we from the right column right now? Be honest."'));
  c.push(inputLabel('Pillar Assessment'));
  c.push(emptyTbl(['Pillar', 'Current State Score (1–10)', 'Biggest Gap', 'Owner', 'First Action'], 7));
  c.push(pb());

  // ── Slide 28: Journey Detail ─────────────────────────────────────────────
  c.push(h1('Slide 28 — Journey Detail'));
  c.push(slideRef(28, 'Journey Detail', 'Role tabs with stage hover — structured and intentional progression'));
  c.push(...screenshot('slide-28-a-default.png', 'Slide 28 (default): Role tabs across the top, 5-stage progression strip'));
  c.push(...screenshot('slide-28-b-stage-detail-open.png', 'Slide 28 (stage detail): Hover over Stage 1 (Registered) on Sales tab — detail panel opens'));
  c.push(...screenshot('slide-28-c-delivery-stage3.png', 'Slide 28 (Delivery tab): Stage 3 (Certified) detail panel — Delivery role view'));

  c.push(h2('What This Slide Shows'));
  c.push(body('An interactive role journey viewer. Role tabs run across the top (Sales, Pre-Sales, Delivery, and others). Below the tabs is a 5-stage strip divided into two groups: "Learning" (stages 1–3: Registered, Trained, Certified) and "Doing" (stages 4–5: Delivering, Expert). Hovering any stage shows a detail panel with the assets, activities, and gate criteria for that stage.'));

  c.push(h2('How to Use It'));
  c.push(bullet('Select a role tab at the top to load that role\'s journey. Each role has different assets and gate criteria at each stage.'));
  c.push(bullet('Hover over a stage to open the detail panel. The panel shows: assigned assets, specific activities, milestones, and gate criteria to advance to the next stage.'));
  c.push(bullet('Use this slide when a cross-functional audience asks "but what does a partner actually experience?" — this is the answer.'));
  c.push(bullet('Walk through one role end to end: "A new Delivery resource starts at Stage 1 — Registered. Here\'s what they do. To get to Stage 2 — Trained — they need to complete these courses. To move to Stage 3 — Certified — they pass the L1 Model Builder exam…"'));

  c.push(h2('Best Roles to Demo'));
  c.push(tbl(
    ['Role', 'Best Used When…', 'Key Talking Point'],
    [
      ['Sales',    'Audience includes Sales Ops, GTM, or Marketing', '"A sales resource progresses from Registered to Expert by doing, not just training — the Delivering and Expert stages require closed deals and coached pipeline."'],
      ['Pre-Sales','Audience includes Solutions Consulting or SC',   '"Pre-Sales is where most demo capability lives today — but it\'s informal. This journey makes it explicit and measurable."'],
      ['Delivery', 'Audience includes PS, Academy, or PSMs',         '"Delivery is the longest journey — and has the hardest gates. Stage 4 requires supervised project completion and an SA scorecard of 4.0 or better."'],
    ]
  ));

  c.push(prompt('"Looking at the Delivery journey — who in the room is responsible for approving stage progression from Certified to Delivering today?"'));
  c.push(prompt('"If we had this live tomorrow — which team would be most impacted by having to run gate reviews consistently?"'));
  c.push(pb());

  // ── Slide 29: Competency Track (Journey Builder 2) ──────────────────────────
  c.push(h1('Slide 29 — Competency Track'));
  c.push(slideRef(29, 'Competency Track', 'Role × product area journey builder'));
  c.push(...screenshot('slide-29-a-role-select.png', 'Slide 29 (step 1): Role selection — Sales, Pre-Sales, Delivery cards'));
  c.push(...screenshot('slide-29-b-area-select.png', 'Slide 29 (step 2): Product area selection after choosing Sales role'));
  c.push(...screenshot('slide-29-c-journey-cards.png', 'Slide 29 (step 3): Journey cards revealed for Sales × Finance — IFP and FCR journeys'));
  c.push(...screenshot('slide-29-d-stage-detail.png', 'Slide 29 (step 4): Stage detail panel open inside a journey card'));

  c.push(h2('What This Slide Shows'));
  c.push(body('A three-step interactive journey builder focused on role × product area. Participants select: (1) a role — Sales, Pre-Sales, or Delivery; (2) a product area — Finance, Supply Chain, Retail, Workforce, Sales & Marketing, or AI Specialist (disabled); (3) the resulting journey cards appear, each with its own 5-stage progression strip. Clicking a stage within a journey card reveals the full stage detail.'));

  c.push(h2('Available Journey Combinations'));
  c.push(tbl(
    ['Product Area', 'Sales Journeys', 'Pre-Sales Journeys', 'Delivery Journeys'],
    [
      ['Finance',           'IFP, FCR',      'IFP, FCR',      'IFP, FCR'],
      ['Supply Chain',      'Inventory, Demand', 'Inventory, Demand', 'Inventory, Demand'],
      ['Retail',            'MFP',           'MFP',           'MFP'],
      ['Workforce',         'OWP',           'OWP',           'OWP'],
      ['Sales & Marketing', 'RPM',           'RPM',           'RPM'],
      ['AI Specialist',     'Disabled',      'Disabled',      'Disabled'],
    ]
  ));

  c.push(h2('How to Use It'));
  c.push(bullet('Walk through a specific combination relevant to your audience. If the room has Supply Chain PSMs, go to Delivery → Supply Chain and walk through the Inventory and Demand journeys.'));
  c.push(bullet('Use the "Add journey" button on each journey card to show how a partner resource can hold multiple journeys — e.g., a Delivery resource with both IFP and FCR journeys in Finance.'));
  c.push(bullet('The AI Specialist area is intentionally disabled ("Coming soon") — this creates a natural conversation about the product roadmap and enablement readiness for new products.'));

  c.push(h2('Key Facilitation Moments'));
  c.push(bullet('When a product area produces two journey cards (e.g., Finance → IFP + FCR), ask: "Should a Delivery resource be expected to hold both journeys, or specialize in one?"'));
  c.push(bullet('When clicking through stages, ask who in the room would be responsible for evaluating gate progression for that role.'));
  c.push(bullet('Use the AI Specialist disabled state to open a conversation about new product enablement readiness: "What would it take to enable an AI Specialist journey by the time Agent Studio goes GA?"'));

  c.push(prompt('"Which product area has the most partner demand right now, and do we have a complete journey for it?"'));
  c.push(prompt('"If a partner resource holds both IFP and Supply Chain journeys — are they counted as two journeys for achievement purposes? Who decides that?"'));
  c.push(pb());

  // ── Slide 30: The Framework Build (build-2) ──────────────────────────────────
  c.push(h1('Slide 30 — The Framework (Interactive Build)'));
  c.push(slideRef(30, 'The Framework', 'Click to reveal each layer — assets, journeys, outcomes'));
  c.push(...screenshot('slide-30-step01.png',               'Slide 30 (step 1): Blank canvas — no layers revealed yet'));
  c.push(...screenshot('slide-30-step03-sp.png',            'Slide 30 (step 3): Self-Paced Academy card populated'));
  c.push(...screenshot('slide-30-step05-ilt.png',           'Slide 30 (step 5): ILT / Capstone card populated'));
  c.push(...screenshot('slide-30-step07-specialist.png',    'Slide 30 (step 7): Specialist / Masterclass card populated — Layer 1 complete'));
  c.push(...screenshot('slide-30-step09-drag.png',          'Slide 30 (step 9): Drag-to-stages UI — assets assigned to journey stages'));
  c.push(...screenshot('slide-30-step11-journeys.png',      'Slide 30 (step 11): Many journey cards visible — multi-role, multi-product journeys'));
  c.push(...screenshot('slide-30-step12-ifp-trio.png',      'Slide 30 (step 12): IFP three-role highlight — Sales, Pre-Sales, Delivery IFP journeys'));
  c.push(...screenshot('slide-30-step13-achievements.png',  'Slide 30 (step 13): Layer 3 introduced — featured achievements appear'));
  c.push(...screenshot('slide-30-step14-all-ach.png',       'Slide 30 (step 14): All achievements visible — full framework build complete'));

  c.push(h2('What This Slide Does'));
  c.push(body('A 15-step interactive build of the three-layer Connected Enablement framework. Each click reveals the next element — asset types, journey structure, journey stages, asset assignments, then Layer 3 achievements. This is the same interactive used in Day 1 (slide 8) but presented here for audiences who did not attend Day 1, or as a recap for Day 2 audiences before moving into RACI and commitments.'));

  c.push(h2('When to Use This Slide on Day 2'));
  c.push(bullet('Use it if some Day 2 attendees did not attend Day 1 and need to see the framework before committing to RACI ownership.'));
  c.push(bullet('Use it as a 5-minute recap at the start of Day 2 to re-establish shared context before the cross-functional sessions begin.'));
  c.push(bullet('Skip it (or run it at 2x speed) if everyone in the room was present for Day 1 and the framework is already understood.'));

  c.push(h2('Build Sequence Summary'));
  c.push(tbl(
    ['Steps', 'What Appears', 'Talking Point'],
    [
      ['1–3',   'Layer 1: three asset types',                     'Self-paced Academy, Capstone workshops, Masterclass & Continuous Learning — the building blocks.'],
      ['4–6',   'Layer 2: journey structure introduced',           'Journeys organize assets into a role-specific progression. Every journey has five stages.'],
      ['7–9',   'Assets assigned to journey stages',              'Each stage specifies which assets are required. This is the connective tissue between what we build and how partners grow.'],
      ['10–12', 'Layer 3: achievements introduced',               'Achievements are earned by completing combinations of journeys — they signal multi-domain mastery.'],
      ['13',    'Three featured achievements revealed',            'Agentic CFO, Connected Financial Planning, Connected Supply Chain — the highest-value designations.'],
      ['14–15', 'All eight achievements visible',                  'Partners can hold multiple achievements as their practice grows.'],
    ]
  ));
  c.push(pb());

  // ── Slide 31: Three Layers Over Time (scrubber-2) ────────────────────────────
  c.push(h1('Slide 31 — Three Layers Over Time'));
  c.push(slideRef(31, 'Three Layers Over Time', 'Drag the marker — assets, journeys, and outcomes appear as months pass'));
  c.push(...screenshot('slide-31-a-month0.png',   'Slide 31 (Month 0): Starting state — framework not yet built out'));
  c.push(...screenshot('slide-31-b-month4.png',   'Slide 31 (~Month 4): Layer 1 assets live, first journeys launching'));
  c.push(...screenshot('slide-31-c-month8.png',   'Slide 31 (~Month 8): Layer 2 journeys well populated, achievements beginning'));
  c.push(...screenshot('slide-31-d-full.png',     'Slide 31 (Full): All three layers complete — framework fully built out'));

  c.push(h2('What This Slide Does'));
  c.push(body('A timeline scrubber showing how the three layers mature over 12+ months. Drag the marker left and right to move through time. As the marker advances, new assets, journeys, and achievements appear — reflecting how the framework builds progressively rather than launching all at once.'));

  c.push(h2('How to Use It'));
  c.push(bullet('Use this slide to set expectations about the implementation roadmap. Not everything launches Day 1.'));
  c.push(bullet('Drag the marker to Month 3 and ask: "What needs to be true for us to be here in 3 months?" Then drag to Month 6, Month 9, Month 12.'));
  c.push(bullet('Use this to anchor the 30/60/90 day plan discussion on slide 33 (Call to Action). The scrubber makes the timeline concrete.'));

  c.push(h2('Key Facilitation Moments'));
  c.push(bullet('At Month 1–2: "Layer 1 is foundational — Academy courses need to be available and journey-ready before anything else can work. Who owns making that happen?"'));
  c.push(bullet('At Month 3–4: "The first journeys go live. Which role and product area should they be for? Who needs to sign off before a journey is \'live\'?"'));
  c.push(bullet('At Month 6+: "Achievements start being awarded. What does \'awarded\' mean — automatic when criteria are met, or human-approved? Who is the approver?"'));

  c.push(prompt('"Where on this timeline are we right now — and where do we need to be in 90 days to say we\'re on track?"'));
  c.push(inputLabel('Roadmap Commitment'));
  c.push(emptyTbl(['Milestone', 'Target Month', 'Owner', 'Dependency', 'Status'], 8));
  c.push(pb());

  // ── Slide 32: The Framework + RACI (build-3) ─────────────────────────────────
  c.push(h1('Slide 32 — The Framework + RACI'));
  c.push(slideRef(32, 'The Framework', 'Drag assets from the library into journey stages — editable Digital Learning RACI'));
  c.push(h3('Build Steps'));
  c.push(...screenshot('slide-32-step01-blank.png',       'Slide 32 (step 1): Blank canvas'));
  c.push(...screenshot('slide-32-step02-layer1.png',      'Slide 32 (step 2): Layer 1 visible — asset type cards introduced'));
  c.push(...screenshot('slide-32-step03-sp-empty.png',    'Slide 32 (step 3): Self-Paced card (empty)'));
  c.push(...screenshot('slide-32-step04-sp-populated.png','Slide 32 (step 4): Self-Paced card populated with Academy courses'));
  c.push(...screenshot('slide-32-step09-drag.png',        'Slide 32 (step 9): Drag-to-stages — asset library on left, journey stages on right'));
  c.push(h3('RACI Modal States'));
  c.push(...screenshot('slide-32-raci-blank.png',         'Slide 32 (RACI — blank): Modal open, all cells empty — ready for live facilitation'));
  c.push(...screenshot('slide-32-raci-populated.png',     'Slide 32 (RACI — populated): "Load from Digital Learning" applied — proposed ownership visible'));
  c.push(h3('Continued Build'));
  c.push(...screenshot('slide-32-step11-journeys.png',    'Slide 32 (step 11): Many journey cards — multi-role view'));
  c.push(...screenshot('slide-32-step12-ifp-trio.png',    'Slide 32 (step 12): IFP three-role highlight'));
  c.push(...screenshot('slide-32-step13-achievements.png','Slide 32 (step 13): Featured achievements — Layer 3 introduced'));
  c.push(...screenshot('slide-32-step14-all-ach.png',     'Slide 32 (step 14): All achievements — complete build'));

  c.push(h2('What This Slide Does'));
  c.push(body('The most interactive slide in Day 2. It combines a drag-and-drop framework build (same 15-step reveal as slide 30, but with a live asset library on the left side) with an editable RACI modal covering three roles: Sales, Pre-Sales, and Delivery. The RACI modal is designed to be filled in live during the cross-functional session.'));

  c.push(h2('Two Modes'));
  c.push(tbl(
    ['Mode', 'How to Activate', 'Purpose'],
    [
      ['Framework Build',    'Click anywhere on the main canvas to advance through the 15-step build',             'Orient the audience to the three-layer structure before asking for RACI commitments'],
      ['RACI Modal',         'Click the "RACI" button in the slide header to open the full-screen modal',          'Fill in or review the Digital Learning RACI across Sales, Pre-Sales, and Delivery roles'],
    ]
  ));

  c.push(h2('The RACI Modal'));
  c.push(body('The modal shows three vertical RACI tables — one for Sales, one for Pre-Sales, one for Delivery. Each table has the same four activities: Identify, Create, Certify, Distribute. Columns are: Academy, PSM, Sales (or Pre-Sales or Delivery), PS, GTM, Product, Solutions Marketing.'));
  c.push(bodyBold('Load from Digital Learning button: ', 'Pre-populates all three tables with the current RACI assignments from the source data. Use this to show the proposed ownership, then facilitate discussion on whether the room agrees.'));
  c.push(body('Each cell is editable — click any cell to type R, A, C, or I. Changes are not persisted across page refreshes.'));

  c.push(h2('Facilitation Guide — RACI Session'));
  c.push(body('This is the highest-stakes facilitation moment in Day 2. Follow this structure:'));
  c.push(bullet('Open the modal. Click "↓ Load from Digital Learning" to pre-populate.'));
  c.push(bullet('Start with the "Identify" row. Ask: "Does everyone agree that GTM is Responsible for identifying content needs? Does anyone claim Accountable?" Wait for disagreement.'));
  c.push(bullet('Move to "Create." This is usually where the most debate occurs — Academy, PS, and Solutions Marketing all have legitimate claims.'));
  c.push(bullet('For each row where there is disagreement, note the disagreement in the workshop input table below. Do not resolve it in the moment unless you have a clear decision-maker in the room.'));
  c.push(bullet('"Certify" and "Distribute" typically go faster — Academy usually has clear ownership here.'));
  c.push(bullet('Close the modal and summarize: "We agreed on X, we need to resolve Y before [date]."'));

  c.push(h2('RACI Reference — Proposed Values'));
  c.push(tbl(
    ['Activity', 'Academy', 'PSM', 'Sales', 'PS', 'GTM', 'Product', 'Sol Mktg'],
    [
      ['Identify (Sales)',    'I', 'I', 'I', '',  'R', '',  ''],
      ['Create (Sales)',      'I', 'C', 'I', 'I', 'A', 'I', 'R'],
      ['Certify (Sales)',     'R', 'C', 'C', 'C', 'C', 'I', 'I'],
      ['Distribute (Sales)',  'R', 'I', '',  '',  '',  '',  ''],
    ]
  ));
  c.push(body('Pre-Sales and Delivery tables follow the same structure with role-appropriate adjustments. Load from source using the modal button for the full view.'));

  c.push(prompt('"Who has the authority to say \'this RACI is approved and now governs how we operate\'? Is that person in the room?"'));
  c.push(prompt('"If a cell says \'R\' and that team isn\'t in the room — what\'s the escalation path to get their commitment?"'));
  c.push(inputLabel('RACI Decisions and Open Items'));
  c.push(emptyTbl(['Activity', 'Proposed Owner', 'Agreement?', 'Open Question', 'Resolution Path', 'Due Date'], 8));
  c.push(pb());

  // ── Slide 33: Call to Action ──────────────────────────────────────────────
  c.push(h1('Slide 33 — Call to Action'));
  c.push(slideRef(33, 'Call to Action', 'What happens next — four commitments before the room leaves'));
  c.push(...screenshot('slide-33-call-to-action.png', 'Slide 33: Four numbered action items in the right panel — all text is editable live'));

  c.push(h2('What This Slide Shows'));
  c.push(body('A closing slide with a title panel (dark navy, "What Happens Next") and four numbered action items on the right. All text is editable — click any item title or description to modify it in real time before or during the session.'));

  c.push(h2('Default Action Items'));
  c.push(tbl(
    ['#', 'Title', 'Description'],
    [
      ['01', 'Confirm Journey Ownership',  'Each team leaves today with a clear owner assigned to every journey in scope — no ambiguity on who drives what.'],
      ['02', 'Agree on the RACI',          'Cross-functional sign-off on the digital learning RACI — who creates, who approves, who maintains.'],
      ['03', 'Prioritise the First Wave',  'Identify the top journeys to digitize first — quick wins that prove the model and build momentum.'],
      ['04', 'Schedule the Follow-Up',     'Set the next Operating Committee date before you leave the room — keep the momentum from today alive.'],
    ]
  ));

  c.push(h2('How to Use It'));
  c.push(bullet('Before the session: customize the four action items to reflect the actual commitments you are pursuing from this group.'));
  c.push(bullet('During the session: edit the text live if the discussion surfaces more specific commitments. Click any title or description to update it.'));
  c.push(bullet('End the session on this slide. Read each item aloud. Ask for a named owner and a date for each. Do not leave the room without those.'));
  c.push(bullet('Photograph or screenshot the final state of this slide — it becomes the formal record of the commitments made.'));

  c.push(h2('Closing Facilitation Script'));
  c.push(facilitator('"We have four things we need to leave with today — let\'s go through them one by one and put a name and a date next to each."'));
  c.push(facilitator('"Journey ownership: which of you is leaving this room as the accountable owner for the first journey that goes live? Not \'our team\' — a person\'s name."'));
  c.push(facilitator('"RACI: we documented the open items. Who takes the list and gets sign-off from the teams that weren\'t in the room? And by when?"'));
  c.push(facilitator('"First wave: we\'re saying [journey X] is first. Does everyone agree? Does anyone have a reason that\'s wrong?"'));
  c.push(facilitator('"Operating Committee: does anyone not have their calendar open right now? We\'re setting the next date before we close. I\'ll wait."'));

  c.push(h2('Day 2 Closing Commitments'));
  c.push(inputLabel('Final Commitment Register'));
  c.push(emptyTbl(['Commitment', 'Owner (Name)', 'Team', 'Due Date', 'Dependencies', 'Escalation If Blocked'], 8));
  c.push(inputLabel('Open Items Carried Forward'));
  c.push(emptyTbl(['Item', 'Context', 'Who Needs to Resolve', 'Target Date', 'Risk If Not Resolved'], 6));
  c.push(inputLabel('Next Operating Committee'));
  c.push(...blankLines(1));
  c.push(body('Date: ________________     Time: ________________     Location / Link: ________________'));
  c.push(...blankLines(1));
  c.push(body('Attendees confirmed: ________________________________________________________________________________'));
  c.push(pb());

  // ── Day 2 Master Checklist ────────────────────────────────────────────────
  c.push(h1('Day 2 — Master Checklist'));

  c.push(h2('Before the Session'));
  c.push(tbl(
    ['Task', 'Owner', 'Done?'],
    [
      ['Confirm attendee list — ensure all 8 business units have a named representative',                '', ''],
      ['Create Mentimeter presentation (slides 24–25) and get join code',                               '', ''],
      ['Enter Mentimeter join code on slide 24 ("✎ Edit code")',                                        '', ''],
      ['Enter Mentimeter embed URL on slide 25 ("Embed Results")',                                      '', ''],
      ['Customize slide 26 bullet text to match your specific cross-functional asks',                   '', ''],
      ['Customize slide 33 action items to reflect the commitments you are driving',                    '', ''],
      ['Test the RACI modal on slide 32 — confirm "Load from Digital Learning" populates correctly',   '', ''],
      ['Brief the meeting owner on the slide 22–33 sequence and timing',                               '', ''],
      ['Prepare the Day 1 recap (2–3 sentences on what was decided in the morning)',                   '', ''],
    ]
  ));

  c.push(h2('During the Session'));
  c.push(tbl(
    ['Slide', 'Time', 'Deliverable'],
    [
      ['22', '2 min',  'Gear-change moment — signal the shift from design to decisions'],
      ['23', '3 min',  'Confirm attendees and accountability map'],
      ['24', '3 min',  'Audience joined in Mentimeter'],
      ['25', '15 min', 'Results discussed, top 3 themes captured'],
      ['26', '7 min',  'Cross-functional ask acknowledged — no hidden resistance'],
      ['27', '10 min', 'Each pillar scored, biggest gap identified, owner named'],
      ['28', '8 min',  'Journey structure understood by new attendees'],
      ['29', '8 min',  'Priority role × product area identified'],
      ['30', '5 min',  'Framework recap complete'],
      ['31', '7 min',  'Roadmap milestones committed with dates'],
      ['32', '20 min', 'RACI cells filled, open items documented'],
      ['33', '15 min', 'Four commitments named with owners and dates'],
    ]
  ));
  c.push(body('Total: ~103 minutes. Allow buffer for discussion on slides 25, 27, and 32 — these generate the most debate.'));

  c.push(h2('After the Session'));
  c.push(tbl(
    ['Task', 'Owner', 'Due'],
    [
      ['Send commitment register (slide 33 table) to all attendees within 24 hours',                 '', ''],
      ['Send RACI open items to teams who were not in the room for sign-off',                        '', ''],
      ['Update journey ownership assignments in the tracking system',                                '', ''],
      ['Confirm first Operating Committee date in calendar for all attendees',                       '', ''],
      ['Document survey results from slides 24–25 for leadership reporting',                        '', ''],
      ['Identify first journey to build and assign it to a named owner',                            '', ''],
    ]
  ));

  return c;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const doc = new Document({
    creator: 'Connected Enablement',
    title: 'Connected Enablement — Day 2 Facilitator Guide',
    styles: {
      default: {
        document:  { run: { font: 'Aptos', size: 22, color: '1C2345' } },
        heading1:  { run: { font: 'Aptos', size: 36, bold: true, color: NAVY }, paragraph: { spacing: { before: 400, after: 160 } } },
        heading2:  { run: { font: 'Aptos', size: 28, bold: true, color: NAVY }, paragraph: { spacing: { before: 320, after: 120 } } },
        heading3:  { run: { font: 'Aptos', size: 24, bold: true, color: ORANGE }, paragraph: { spacing: { before: 240, after: 100 } } }
      }
    },
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{
          level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 200 } } }
        }]
      }]
    },
    sections: [{ properties: {}, children: buildDoc() }]
  });

  const generatedBuf = await Packer.toBuffer(doc);
  const merged = await injectIntoTemplate(generatedBuf, {
    coverTitle: 'Connected Enablement',
    coverSubtitle: 'Day 2 — Facilitator Guide'
  });
  const outPath = path.join(guideDir, 'Connected-Enablement-Day2-Guide.docx');
  fs.writeFileSync(outPath, merged);
  console.log(`✓ Day 2 guide written to ${path.relative(projectRoot, outPath)}`);
}

main();
