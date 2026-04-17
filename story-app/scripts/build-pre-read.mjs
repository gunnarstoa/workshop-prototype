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
const guideDir = path.join(__dirname, '..', 'guide');
fs.mkdirSync(guideDir, { recursive: true });

const NAVY = '0A2F46'; const ORANGE = 'FF6100';

function h1(t) { return new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 160 } }); }
function h2(t) { return new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 } }); }
function body(t) { return new Paragraph({ spacing: { before: 40, after: 120 }, children: [new TextRun({ text: t, size: 22 })] }); }
function bodyBold(b, r) { return new Paragraph({ spacing: { before: 40, after: 120 }, children: [new TextRun({ text: b, bold: true, size: 22 }), new TextRun({ text: r, size: 22 })] }); }
function bullet(t) { return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] }); }
function bulletBold(b, r) { return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: b, bold: true, size: 22 }), new TextRun({ text: r, size: 22 })] }); }
function ask(t) { return new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: 'REFLECT  |  ', bold: true, size: 18, color: ORANGE }), new TextRun({ text: t, bold: true, size: 22, color: NAVY })] }); }
function blank(n) { const l = []; for (let i = 0; i < n; i++) l.push(new Paragraph({ children: [new TextRun({ text: '_______________________________________________________________________________', size: 20, color: 'CCCCCC' })] })); return l; }
function pb() { return new Paragraph({ children: [new PageBreak()] }); }
function tbl(headers, rows) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: 'D8D6D0' };
  const borders = { top: b, bottom: b, left: b, right: b };
  const w = Math.floor(9000 / headers.length);
  return new Table({ rows: [
    new TableRow({ children: headers.map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: 'FFFFFF' })] })], shading: { fill: NAVY, type: ShadingType.SOLID }, borders, width: { size: w, type: WidthType.DXA } })) }),
    ...rows.map(row => new TableRow({ children: row.map(cell => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cell, size: 18 })] })], borders, width: { size: w, type: WidthType.DXA } })) }))
  ], width: { size: 9000, type: WidthType.DXA } });
}
function emptyTbl(h, n = 3) { return tbl(h, Array.from({ length: n }, () => h.map(() => ''))); }

function buildDoc() {
  const c = [];

  // Template provides the cover page — begin with a brief introduction page
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 }, children: [new TextRun({ text: 'Please review this document and complete the short exercises before the workshop.', bold: true, size: 22, color: NAVY })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Time required: approximately 30–40 minutes.', size: 22, color: '555555' })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'Come prepared to share your responses — we will open the workshop with a brief round-table discussion based on your answers.', italics: true, size: 22, color: NAVY })] }));
  c.push(pb());

  // ── What this workshop is about ──
  c.push(h1('What this workshop is about'));
  c.push(body('We are redesigning how Anaplan enables its partner ecosystem. Today, enablement is largely one-size-fits-all: a catalog of Academy courses, a handful of workshops, and an informal path from "new partner" to "delivering independently." That model doesn\'t scale, and it doesn\'t account for the reality that different roles need fundamentally different things.'));
  c.push(body('The workshop will introduce a framework called Connected Enablement, built on three principles:'));
  c.push(bulletBold('Prescriptive — ', 'every role gets a recommended path with defined stages and clear progression criteria.'));
  c.push(bulletBold('Targeted — ', 'the path is shaped by role, product area, and experience level — not one curriculum for everyone.'));
  c.push(bulletBold('Opt-in — ', 'we show the recommended journey, the partner chooses what to pursue.'));
  c.push(body('The workshop is a working session. We will define the building blocks together: which roles need journeys, what goes in each stage, what gates separate stages, and what achievements partners can earn. Your input before the session will make the conversation richer and faster.'));
  c.push(pb());

  // ── The three pillars ──
  c.push(h1('The three pillars'));
  c.push(body('Everything in Connected Enablement ties back to three business outcomes. As you read through the pre-work, keep asking: "Does this support pipeline growth, technical expertise, or delivery excellence — and how would we know?"'));
  c.push(new Paragraph({ spacing: { before: 120, after: 120 }, children: [
    new TextRun({ text: 'Pipeline Growth', bold: true, size: 24, color: NAVY })
  ]}));
  c.push(body('Equip partner sales and pre-sales teams to identify, qualify, position, present, and close Anaplan opportunities across every product and industry.'));
  c.push(new Paragraph({ spacing: { before: 120, after: 120 }, children: [
    new TextRun({ text: 'Technical Expertise', bold: true, size: 24, color: NAVY })
  ]}));
  c.push(body('Build deep, certified capability across model building, application configuration, solution architecture, and the Anaplan platform.'));
  c.push(new Paragraph({ spacing: { before: 120, after: 120 }, children: [
    new TextRun({ text: 'Delivery Excellence', bold: true, size: 24, color: NAVY })
  ]}));
  c.push(body('Ensure every client engagement meets Anaplan\'s quality bar — from supervised delivery through independent practice.'));
  c.push(pb());

  // ── Pre-work exercise 1: Roles ──
  c.push(h1('Exercise 1 — Roles (5 minutes)'));
  c.push(body('Most partner enablement programs focus on two roles: model builders and solution architects. In reality, a partner organization has many more people who interact with Anaplan — and each of them needs something different.'));
  c.push(body('We have identified fourteen roles grouped into five categories that reflect how partner teams are organized. Review the list below and think about whether it captures your partner ecosystem completely.'));
  c.push(tbl(['Category', 'Role', 'What they do'], [
    ['Business Development', 'Sales', 'Build pipeline, qualify opportunities, present the value proposition'],
    ['Business Development', 'Marketing', 'Drive demand generation, content, events, co-marketing'],
    ['Business Development', 'Pre-Sales Technical', 'Lead technical discovery, deliver demos, architect proposed solutions'],
    ['Delivery', 'Model Builder', 'Build and configure Anaplan models for client deployments'],
    ['Delivery', 'Solution Architect', 'Design scalable Anaplan solutions across applications and domains'],
    ['Delivery', 'Program Management', 'Orchestrate multi-workstream programs and portfolios of engagements'],
    ['Delivery', 'Delivery Lead', 'Run projects — SOWs, sprints, resourcing, client communication'],
    ['Advisory', 'Change Management', 'Guide clients through planning transformation and adoption'],
    ['Advisory', 'Industry Lead', 'Drive industry-specific GTM and solution strategy'],
    ['Advisory', 'Data Architect', 'Design client data model, hub strategy, and cloud data platform alignment'],
    ['Advisory', 'Data Integration', 'Move data into and out of Anaplan — ADO, CloudWorks, APIs, ETL'],
    ['Client Management', 'Client Account Lead', 'Own commercial relationship, orchestrate delivery, drive expansion'],
    ['Client Management', 'Technical Account Lead', 'Client-facing technical advisor on solution direction and escalations'],
    ['Practice Management', 'Anaplan Practice Lead', 'Practice strategy, growth, hiring, tiering, business planning'],
  ]));
  c.push(ask('Are there roles missing from this list? Think about your own organization or your partners — who interacts with Anaplan that isn\'t represented here?'));
  c.push(...blank(3));
  c.push(ask('Pick one role from the list that you think is most underserved by current enablement. Why?'));
  c.push(...blank(3));
  c.push(ask('Where do the boundaries between roles feel fuzziest — for example, senior Model Builder vs. Solution Architect, or Data Architect vs. Data Integration?'));
  c.push(...blank(3));
  c.push(pb());

  // ── Pre-work exercise 2: Two kinds of partners ──
  c.push(h1('Exercise 2 — Two Kinds of Partners (10 minutes)'));
  c.push(body('For a moment, put yourself in the shoes of two very different Anaplan partner owners. Read both scenarios, then answer the questions below. The point of this exercise is to get past the idea that there is one kind of partner — and that one enablement program serves them all.'));

  c.push(h2('Scenario A — The Boutique Specialist'));
  c.push(body('You own a boutique Anaplan partner. Your team has grown to 15 people — a deep bench of industry and technical experts who know everything there is to know about CPG Supply Chain challenges, with a specialty in Trade Promotion Management. Your clients trust you and your team completely. You have delivered several complex Anaplan projects, including custom Trade Promotion planning models that your competitors cannot match.'));
  c.push(body('Your team of 15 works on a few new projects each year and provides periodic oversight for changes your existing clients need to their Anaplan deployments. You have no desire to double your business or double your team. Skilled Anaplan resources are hard to come by and take a long time to become technically self-sufficient — and your clients value you precisely because of the consistency and depth you deliver, not because you can scale.'));
  c.push(body('Your engagements are highly configured, deeply customized, and precisely address each client\'s unique business requirements. You deliver great projects, consistently, to a small set of clients who become long-term partners.'));

  c.push(h2('Scenario B — The Global System Integrator'));
  c.push(body('You lead the Anaplan practice at a large Global System Integrator. You have hundreds of Anaplan-trained resources spread across multiple continents, delivering implementations for Fortune 500 clients across every industry Anaplan sells into. Your practice grows 30% year over year — you are constantly hiring, training, and onboarding new resources.'));
  c.push(body('Your delivery model is process-driven and standardized: project templates, consistent methodology, scalable staffing across tiers. Your resources range from junior consultants just out of university to seasoned solution architects with 10+ years of experience. Many work remotely across time zones. Turnover happens — attrition and internal movement are constant. You run both custom client-specific implementations AND large-scale rollouts of Anaplan\'s pre-built applications.'));
  c.push(body('Your competitive advantage is scale, breadth, and the ability to put a team anywhere in the world on a week\'s notice.'));

  c.push(h2('Questions'));

  c.push(ask('Scenario A — What are the biggest challenges this boutique partner faces in being an Anaplan partner?'));
  c.push(...blank(3));
  c.push(ask('Scenario A — What does Anaplan enablement need to provide them? What would get in their way?'));
  c.push(...blank(3));

  c.push(ask('Scenario B — What are the biggest challenges this GSI faces?'));
  c.push(...blank(3));
  c.push(ask('Scenario B — What does Anaplan enablement need to provide them? How is it different from what the boutique needs?'));
  c.push(...blank(3));

  c.push(ask('Big question — Does one enablement program serve both partners, or do they need fundamentally different things? What are the common threads, and where do their needs diverge?'));
  c.push(...blank(4));

  c.push(pb());

  // ── Pre-work exercise 3: A day in the life ──
  c.push(h1('Exercise 3 — A Day in the Life (5 minutes)'));
  c.push(body('Connected Enablement starts from the observation that different roles need completely different things. Consider two people inside the same partner firm:'));
  c.push(bodyBold('A salesperson ', 'needs to know Anaplan\'s value proposition for a specific industry, reference client stories, and position Anaplan\'s strengths against competitors. They will likely never configure a model or populate a list.'));
  c.push(bodyBold('A delivery resource ', 'needs to know what ships out of the box as a Trade Promotion Management application, how to deploy common extensions, and how to load client data. They will likely never respond to an RFP or build an executive pitch.'));
  c.push(body('Their enablement needs share almost no overlap — yet many programs treat them with the same curriculum.'));
  c.push(ask('Think about a role you work with closely. What are the top 3 things that person needs to know or be able to do that current enablement does NOT cover?'));
  c.push(tbl(['Role', 'Gap 1', 'Gap 2', 'Gap 3'], [['', '', '', ''], ['', '', '', '']]));
  c.push(pb());

  // ── Pre-work exercise 4: Stages and gates ──
  c.push(h1('Exercise 4 — What does "ready" look like? (5 minutes)'));
  c.push(body('In the workshop, we will define progression stages for each journey — a partner resource moves from Registered to Trained to Certified to Delivering to Expert (or similar). Between each stage, there are gates: quantified criteria that must be met before progressing.'));
  c.push(body('For example, a Delivery resource might need to:'));
  c.push(bullet('Pass the L1 Model Builder certification to move from Trained → Certified'));
  c.push(bullet('Complete 2 supervised client projects with CSAT ≥ 4.0 to move from Delivering → Expert'));
  c.push(body('These gates ensure quality. Without them, a partner can claim "Expert" status without evidence.'));
  c.push(ask('Think about the role you identified in Exercise 1 (the underserved one). What would "ready to deliver independently" look like for that role? What evidence would you accept?'));
  c.push(...blank(3));
  c.push(ask('What is one gate criterion that exists today (formally or informally) that works well? And one that is missing?'));
  c.push(tbl(['', 'Works Well', 'Missing'], [['Gate criterion', '', '']]));
  c.push(pb());

  // ── Pre-work exercise 5: Achievements ──
  c.push(h1('Exercise 5 — What should partners earn? (5 minutes)'));
  c.push(body('At the top of the framework sit achievements — designations that a partner earns by completing a combination of journeys. Achievements signal deep, proven capability in a domain. Examples:'));
  c.push(bullet('Finance Expert — completed IFP, Financial Close, and Finance Suite journeys'));
  c.push(bullet('AI Products Expert — completed CoModeler and Agent Studio journeys'));
  c.push(bullet('Connected Planning Champion — expert across multiple domains'));
  c.push(body('Achievements matter because they are what customers see. When a customer asks "does this partner know Finance?", the answer should be backed by demonstrated, measured capability — not just "they\'ve done a few projects."'));
  c.push(ask('If you were a customer selecting a partner, what would you want to see? What achievement or designation would give you confidence?'));
  c.push(...blank(3));
  c.push(ask('Should achievements expire? If a partner earned "Finance Expert" two years ago but hasn\'t delivered a Finance project since, is the designation still valid?'));
  c.push(...blank(2));
  c.push(pb());

  // ── Pre-work exercise 6: One thing ──
  c.push(h1('Exercise 6 — One Thing (2 minutes)'));
  c.push(body('This is the question we will open the workshop with. Take a moment to think about it now so you are ready to share.'));
  c.push(ask('If you could fix ONE thing about how Anaplan enables its partners today, what would it be and why?'));
  c.push(...blank(4));
  c.push(pb());

  // ── What to expect at the workshop ──
  c.push(h1('What to expect at the workshop'));
  c.push(body('The workshop will be a working session — not a presentation. We will:'));
  c.push(bullet('Open with a round-table: each participant shares their answer to Exercise 5'));
  c.push(bullet('Walk through the Connected Enablement framework interactively'));
  c.push(bullet('Define the building blocks together: roles, journeys, stages, gates, achievements'));
  c.push(bullet('Identify gaps and priorities'));
  c.push(bullet('Leave with a set of decisions, action items, and owners'));
  c.push(body('Your pre-read responses will directly shape the conversation. There are no wrong answers — the point is to arrive with a perspective, not a polished proposal.'));
  c.push(new Paragraph({ spacing: { before: 200, after: 100 }, children: [
    new TextRun({ text: 'Thank you for investing the time. See you at the workshop.', italics: true, size: 22, color: NAVY })
  ]}));

  return c;
}

async function main() {
  const doc = new Document({
    creator: 'Connected Enablement',
    title: 'Connected Enablement — Workshop Pre-Read',
    styles: {
      default: {
        document: { run: { font: 'Aptos', size: 22, color: '1C2345' } },
        heading1: { run: { font: 'Aptos', size: 36, bold: true, color: '0A2F46' }, paragraph: { spacing: { before: 400, after: 160 } } },
        heading2: { run: { font: 'Aptos', size: 28, bold: true, color: '0A2F46' }, paragraph: { spacing: { before: 320, after: 120 } } }
      }
    },
    numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 200 } } } }] }] },
    sections: [{ properties: {}, children: buildDoc() }]
  });
  const generatedBuf = await Packer.toBuffer(doc);
  const merged = await injectIntoTemplate(generatedBuf, {
    coverTitle: 'Connected Enablement',
    coverSubtitle: 'Workshop Pre-Read'
  });
  const outPath = path.join(guideDir, 'Connected-Enablement-Pre-Read.docx');
  fs.writeFileSync(outPath, merged);
  console.log(`✓ Pre-read written to guide/${path.basename(outPath)}`);
}

main();
