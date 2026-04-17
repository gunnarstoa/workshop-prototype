import { chromium } from 'playwright';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  AlignmentType,
  PageBreak
} from 'docx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const guideDir = path.join(projectRoot, 'guide');
const shotsDir = path.join(guideDir, 'screenshots');

fs.mkdirSync(shotsDir, { recursive: true });

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const VIEWPORT = { width: 1400, height: 900 };

// Settle time for the staged reveal (five cards fade in with stagger up to 400ms delay + 600ms fade)
const REVEAL_SETTLE_MS = 1200;

// ── Scenario definitions ──────────────────────────────────────────────────
const scenarios = [
  {
    id: 'delivery-rsc-solo',
    title: 'Scenario 1 — Delivery Resource, Retail & Supply Chain, Delivering Solo',
    summary:
      "A partner Delivery resource — the hands-on implementer of Anaplan applications — already delivering solo on client projects. The wizard tailors the recommended journey to Retail & Supply Chain delivery work and an experienced practitioner. You'll see that the items recommended are almost entirely about configuring applications, loading data, and earning delivery credentials — nothing about value propositions, demos, or pipeline.",
    steps: [
      {
        heading: 'Step 1 · Select your role',
        narrative:
          "By the time you reach this step, the opening reveal has run and all eight persona cards are visible. Role is the first and most important filter because it determines almost everything else about the journey. A Delivery resource's enablement journey has almost nothing in common with a Sales resource's, and the wizard needs to know which branch to take before any other question makes sense.",
        action: 'Click the 🛠 Delivery card (3rd card in the top row).',
        click: { selector: '.wiz-persona-card', index: 2 }
      },
      {
        heading: 'Step 2 · Narrow by product area',
        narrative:
          'Role alone is not enough. A Delivery resource working on Retail & Supply Chain applications needs very different enablement from one working on Finance or AI Products. The out-of-the-box content, the common extensions, the data patterns, and the certification paths all differ by product area. This step tells the wizard which body of delivery content to recommend.',
        action: 'Click the 📦 Retail & Supply Chain card (2nd card).',
        click: { selector: '.wiz-option-card', index: 1 }
      },
      {
        heading: 'Step 3 · Confirm experience level',
        narrative:
          'Step 3 asks about current Anaplan delivery experience. Where you start on the path is completely different depending on whether you have delivered zero projects or twenty. Someone new gets foundations; someone 1–2 projects in gets supervised-delivery content; someone delivering solo gets advanced patterns, contribution-back material, and blueprint-level references.',
        action: 'Click the 🏅 Independent — delivering solo card (3rd card).',
        click: { selector: '.wiz-option-card', index: 2 }
      },
      {
        heading: 'Step 4 · Review your recommended journey',
        narrative:
          "The wizard assembles a ten-item Delivery enablement journey — Anaplan Essentials through Pass 2 Supervised Projects — shaped by your three answers. Notice what is NOT here: nothing about RFP response, business-case building, executive presentations, or competitive positioning. Those belong to the Sales journey, which is entirely separate. This journey is targeted specifically at someone who will be configuring and deploying Anaplan RSC applications for clients.",
        action: null,
        click: null
      }
    ]
  },
  {
    id: 'delivery-lead-large-new',
    title: 'Scenario 2 — Delivery Lead, Large Enterprise Rollouts, New to Project Management',
    summary:
      'A Delivery Lead — the project manager of an Anaplan implementation — responsible for statements of work, sprint cadence, risk, budget, and client communication. In this scenario the Delivery Lead is new to project management generally, and will be running large multi-month enterprise rollouts. The recommended journey will look almost nothing like Scenario 1 even though both sit under the broad "Delivery" umbrella. Notably, Delivery Lead is one of the five roles hidden behind the opening reveal — a deliberate choice to emphasize that the partner ecosystem includes roles most enablement programs overlook.',
    steps: [
      {
        heading: 'Step 1 · Select your role',
        narrative:
          'Delivery Lead is a distinct role from Delivery. A Delivery Lead owns project management, statements of work, sprint cadence, and client communication — not the technical configuration of Anaplan applications. The skills, deliverables, and daily work are fundamentally different. Picking Delivery Lead here routes the wizard down a completely different branch than the Delivery path in Scenario 1.',
        action: 'Click the 📋 Delivery Lead card (4th card in the top row).',
        click: { selector: '.wiz-persona-card', index: 3 }
      },
      {
        heading: 'Step 2 · Narrow by engagement size',
        narrative:
          'For a Delivery Lead the next filter is not product area — it is engagement size. Leading a three-month single-app deployment is a fundamentally different job from leading a twelve-month multi-module program. The methodology, the contract templates, the governance cadence, and the staffing model all differ with scope. This step tells the wizard which delivery playbook to load.',
        action: 'Click the 🏢 Large — enterprise rollouts, 6+ months card (3rd card).',
        click: { selector: '.wiz-option-card', index: 2 }
      },
      {
        heading: 'Step 3 · Confirm PM experience',
        narrative:
          'Step 3 asks where you are on the project management journey. A new PM needs foundational project management discipline plus Anaplan-specific delivery overlays. An experienced PM new to Anaplan gets the Anaplan-specific layer on top of PM skills they already have. An experienced Anaplan Delivery Lead gets advanced material and program-level content.',
        action: 'Click the 🌱 New to project management card (1st card).',
        click: { selector: '.wiz-option-card', index: 0 }
      },
      {
        heading: 'Step 4 · Review your recommended journey',
        narrative:
          "The recommended Delivery Lead journey centres on project management foundations — Anaplan Delivery Methodology, SOW Templates, Sprint Planning, Risk Management, Client Communication — with delivery-execution bookends (Go-Live & Hypercare, Project Retrospective). Almost none of these items appear anywhere in Scenario 1's Delivery journey. That's by design: the work is different, so the enablement is different.",
        action: null,
        click: null
      }
    ]
  }
];

// ── Playwright helpers ───────────────────────────────────────────────────
async function captureOpeningStates(page) {
  await page.goto(`${BASE}/wizard`);
  await page.waitForSelector('.wiz-persona-card');
  await page.waitForTimeout(300);

  // Initial state: only three persona cards visible, heading reads "Three personas..."
  const initialPath = path.join(shotsDir, 'opening-01-initial.png');
  await page.screenshot({ path: initialPath, fullPage: false });
  console.log(`  ✓ opening: initial (3 cards visible)`);

  // Click on the intro header area (safe non-card spot) to trigger the document-level reveal listener.
  await page.locator('.wiz-intro-question').click();
  await page.waitForTimeout(REVEAL_SETTLE_MS);

  const revealedPath = path.join(shotsDir, 'opening-02-revealed.png');
  await page.screenshot({ path: revealedPath, fullPage: false });
  console.log(`  ✓ opening: revealed (all 8 cards visible)`);

  return { initialPath, revealedPath };
}

async function captureScenario(page, scenario) {
  console.log(`\nCapturing: ${scenario.title}`);
  await page.goto(`${BASE}/wizard`);
  await page.waitForSelector('.wiz-persona-card');
  await page.waitForTimeout(300);

  // Trigger the reveal before any persona click so hidden cards (like Delivery Lead) are clickable.
  await page.locator('.wiz-intro-question').click();
  await page.waitForTimeout(REVEAL_SETTLE_MS);

  const imagePaths = [];
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (i === 0) {
      await page.waitForSelector('.wiz-persona-card');
    } else if (i < scenario.steps.length - 1) {
      await page.waitForSelector('.wiz-option-card');
    } else {
      await page.waitForSelector('.wiz-result-card');
    }
    await page.waitForTimeout(400);

    const imgPath = path.join(shotsDir, `${scenario.id}-step${i + 1}.png`);
    await page.screenshot({ path: imgPath, fullPage: false });
    imagePaths.push(imgPath);
    console.log(`  ✓ step ${i + 1}: ${path.basename(imgPath)}`);

    if (step.click) {
      const locator = page.locator(step.click.selector).nth(step.click.index);
      await locator.click();
    }
  }
  return imagePaths;
}

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const page = await context.newPage();

  console.log('Capturing opening (staged reveal) ...');
  const opening = await captureOpeningStates(page);

  const results = [];
  for (const scenario of scenarios) {
    const imagePaths = await captureScenario(page, scenario);
    results.push({ scenario, imagePaths });
  }

  await browser.close();
  return { opening, results };
}

// ── Word document helpers ────────────────────────────────────────────────
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 320, after: 140 }
  });
}

function body(text) {
  return new Paragraph({
    spacing: { before: 60, after: 120 },
    children: [new TextRun({ text, size: 22 })]
  });
}

function bulletStrong(boldLead, rest) {
  return new Paragraph({
    numbering: { reference: 'bullet-list', level: 0 },
    children: [
      new TextRun({ text: boldLead, bold: true, size: 22 }),
      new TextRun({ text: rest, size: 22 })
    ]
  });
}

function imageParagraph(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        data: buffer,
        transformation: { width: 620, height: 398 },
        type: 'png'
      })
    ],
    spacing: { before: 120, after: 120 }
  });
}

function actionCallout(text) {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    children: [
      new TextRun({ text: 'Action: ', bold: true, size: 22, color: 'FF6100' }),
      new TextRun({ text, size: 22 })
    ]
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 20, after: 180 },
    children: [new TextRun({ text, italics: true, size: 20, color: '666666' })]
  });
}

// ── Compose the document ─────────────────────────────────────────────────
function buildChildren({ opening, results }) {
  const children = [];

  // Cover
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 200 },
      children: [
        new TextRun({ text: 'Connected Enablement', bold: true, size: 56, color: '0A2F46' })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'Wizard — User Guide', bold: true, size: 36, color: 'FF6100' })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: "How role, product area, and experience level shape each user's enablement journey",
          italics: true,
          size: 24,
          color: '555555'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'A short walkthrough of two real paths a partner would take through the Enablement Wizard — showing that even two users inside the same broad "Delivery" space arrive at almost entirely different recommended journeys.',
          size: 22,
          color: '333333'
        })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // The principle
  children.push(heading('The principle behind role-specific enablement', HeadingLevel.HEADING_1));
  children.push(
    body(
      "Partners aren't monolithic. A typical Anaplan partner organization has sales, pre-sales, delivery, solution architects, delivery leads, practice leads, industry leads, and client account leads — each with fundamentally different work. Treating them with a single enablement curriculum wastes their time and leaves real gaps. The common pattern — enablement as an undifferentiated stream of model-building and solution-architecture content — assumes every partner resource is a technical implementer. Most aren't."
    )
  );
  children.push(
    body(
      'The Connected Enablement wizard starts from a simple observation: the right enablement for each role is almost entirely different. Consider two examples, drawn from roles that live side by side inside the same partner firm:'
    )
  );
  children.push(
    new Paragraph({
      numbering: { reference: 'bullet-list', level: 0 },
      children: [
        new TextRun({ text: 'A salesperson ', bold: true, size: 22 }),
        new TextRun({
          text:
            "needs to know Anaplan's unique value proposition for a specific industry, reference client stories and use cases, and how to position Anaplan's strengths while exposing competitor weaknesses. They will likely never need to configure a model, build a list, tune integration performance, or populate a test scenario for a prospect.",
          size: 22
        })
      ]
    })
  );
  children.push(
    new Paragraph({
      numbering: { reference: 'bullet-list', level: 0 },
      children: [
        new TextRun({ text: 'A delivery resource ', bold: true, size: 22 }),
        new TextRun({
          text:
            'needs to know what ships out of the box as a Trade Promotion Management application, how to deploy common extensions, configure the standard dimensions, load client data, and tune the model for production. They will likely never need to respond to an RFP, build an executive pitch deck, or run a competitive comparison against a rival platform.',
          size: 22
        })
      ]
    })
  );
  children.push(
    body(
      "The wizard's job is to route each user to a journey tailored to the way they actually work. Role is the first cut — but it isn't the last. A Retail & Supply Chain salesperson and a Finance salesperson still need different case studies, different competitive stories, and different product value propositions — so the wizard's second step narrows by product area (for technical roles), by engagement size (for delivery leads), or by vertical (for industry leads). And for every role, experience level changes where you start on the path: someone brand-new to Anaplan needs foundations; someone with active pipeline needs advanced plays; someone already delivering solo needs blueprint and mentorship material."
    )
  );
  children.push(
    body(
      'Every journey the wizard produces is therefore three things at once: prescriptive (this is the recommended path given your inputs), targeted (it is shaped by role, focus area, and experience), and opt-in (keep what is relevant, set aside what is not).'
    )
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // How the wizard works — with opening reveal screenshots
  children.push(heading('How the wizard works', HeadingLevel.HEADING_1));
  children.push(
    body(
      'The Enablement Wizard is the first slide of the Connected Enablement demo. It is a four-step guided experience that assembles a tailored recommended journey from a short role-plus-focus-plus-experience sequence. Each step uses the same friendly card interaction — click a card to answer and advance automatically. The Back button at the bottom of every step lets you revise any answer.'
    )
  );
  children.push(bulletStrong('Step 1 — ', 'Select your role from eight persona cards.'));
  children.push(
    bulletStrong(
      'Step 2 — ',
      'Narrow the focus. Depending on the role, this is product area, engagement size, or industry vertical.'
    )
  );
  children.push(bulletStrong('Step 3 — ', 'Confirm your experience or maturity level.'));
  children.push(
    bulletStrong(
      'Step 4 — ',
      'Review the recommended enablement journey and click Start my journey.'
    )
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Opening reveal
  children.push(heading('The opening reveal', HeadingLevel.HEADING_1));
  children.push(
    body(
      'The wizard opens with a small but deliberate story moment. Only three persona cards are initially visible — Sales, Pre-Sales, and Delivery — the roles every partner recognizes. The heading above them reads "Three personas. Three distinct journeys." This mirrors the common, narrow mental model most partners have about enablement: sales, pre-sales, delivery, done.'
    )
  );
  children.push(imageParagraph(opening.initialPath));
  children.push(caption('Initial state — three roles visible, "Three personas. Three distinct journeys."'));
  children.push(
    body(
      'A single click anywhere on the page — the blank area below the heading, the heading itself, or any visible card — triggers the reveal. The five remaining persona cards fade in with a staggered delay, and the heading rewrites itself to "Eight personas. Eight distinct journeys." The effect is short (about a second end-to-end) but the message is emphatic: the partner ecosystem is broader than the three familiar roles. Delivery Lead, Solution Architect, Practice Lead, Industry Lead, and Client Account Lead all have their own enablement journeys, each as distinct as the three roles everyone already knows.'
    )
  );
  children.push(imageParagraph(opening.revealedPath));
  children.push(caption('Revealed state — all eight roles visible, heading now reads "Eight personas. Eight distinct journeys."'));
  children.push(
    body(
      'From this point on, clicking any of the eight cards advances the wizard. The scenarios that follow both assume the reveal has already happened, so step 1 in each begins with the full set visible.'
    )
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Scenarios
  for (let s = 0; s < results.length; s++) {
    const { scenario, imagePaths } = results[s];

    children.push(heading(scenario.title, HeadingLevel.HEADING_1));
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 160 },
        children: [
          new TextRun({ text: scenario.summary, size: 22, italics: true, color: '444444' })
        ]
      })
    );

    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      children.push(heading(step.heading, HeadingLevel.HEADING_2));
      children.push(body(step.narrative));
      if (step.action) {
        children.push(actionCallout(step.action));
      }
      children.push(imageParagraph(imagePaths[i]));
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Closing — what this comparison shows
  children.push(heading('What this comparison shows', HeadingLevel.HEADING_1));
  children.push(
    body(
      'Put the two recommended journeys side by side. Both users chose "Delivery" in the broad sense — one as a hands-on implementer, one as a project manager — yet the content they need shares almost no overlap.'
    )
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({ text: 'Scenario 1 — Delivery Resource: ', bold: true, size: 22 }),
        new TextRun({
          text:
            'Anaplan Essentials · Essentials of Model Building · L1 Model Builder Certification · Application Configurator · Data Integration · Delivery Workshop · Delivery Blueprint · SA Pairing · Pass 2 Supervised Projects.',
          size: 22
        })
      ]
    })
  );
  children.push(
    new Paragraph({
      spacing: { before: 40, after: 140 },
      children: [
        new TextRun({ text: 'Scenario 2 — Delivery Lead: ', bold: true, size: 22 }),
        new TextRun({
          text:
            'Anaplan Delivery Methodology · SOW Templates · Sprint Planning · Resource Allocation · Budget & Scope Management · Risk Management · Client Communication · QA & Model Review · Go-Live & Hypercare · Project Retrospective.',
          size: 22
        })
      ]
    })
  );
  children.push(
    body(
      'Between these two journeys — both inside "Delivery" as a broad area — there is not a single shared item. The Delivery resource is learning to configure and deploy Anaplan applications. The Delivery Lead is learning to plan, contract, staff, run, and close projects. Both are essential. Both are Delivery-adjacent. But the enablement each needs is entirely different, and pretending otherwise is how you end up with partners who have sat through hours of model-building content but have no idea how to write a statement of work.'
    )
  );
  children.push(
    body(
      'Now extend that observation across all eight personas. A Sales resource shares nothing with either of these two. A Pre-Sales resource shares some foundational platform work with Delivery, then diverges into discovery, demos, and gap-fit analysis. A Solution Architect builds on delivery fundamentals and branches into design and architecture. A Practice Lead focuses almost entirely on strategy, hiring, and designations. An Industry Lead focuses almost entirely on vertical-specific positioning and references. A Client Account Lead focuses on relationships, scope, and expansion. Eight roles. Eight journeys. No overlap where overlap would be noise.'
    )
  );
  children.push(
    body(
      'Eight personas, each with two follow-up questions, each producing a distinct recommended journey. That is what "prescriptive, targeted, opt-in" looks like in practice — and it is what the Connected Enablement wizard is designed to deliver, at scale, without requiring a human to assemble the right path for each individual.'
    )
  );

  return children;
}

async function buildDoc(artifacts) {
  const doc = new Document({
    creator: 'Connected Enablement Prototype',
    title: 'Connected Enablement Wizard — User Guide',
    description: 'A two-scenario walkthrough of the Enablement Wizard',
    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [
            {
              level: 0,
              format: 'bullet',
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 400, hanging: 200 } } }
            }
          ]
        }
      ]
    },
    sections: [
      {
        properties: {},
        children: buildChildren(artifacts)
      }
    ]
  });

  const buf = await Packer.toBuffer(doc);
  const outPath = path.join(guideDir, 'Connected-Enablement-User-Guide.docx');
  fs.writeFileSync(outPath, buf);
  console.log(`\n✓ Word document written to ${path.relative(projectRoot, outPath)}`);
  return outPath;
}

// ── Main ─────────────────────────────────────────────────────────────────
(async () => {
  console.log(`Capturing screenshots from ${BASE} ...`);
  const artifacts = await capture();
  console.log('\nBuilding Word document ...');
  await buildDoc(artifacts);
  console.log('Done.\n');
})();
