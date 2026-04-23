/**
 * Captures all Day 2 slide screenshots, including every build step,
 * scrubber positions, journey-builder states, and the RACI modal.
 */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE = 'http://localhost:5175';
const OUT  = path.resolve('./guide/screenshots/day2');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const pg      = await browser.newPage();
await pg.setViewportSize({ width: 1440, height: 900 });

// ── helpers ─────────────────────────────────────────────────────────────────
async function shot(name) {
  const file = path.join(OUT, name + '.png');
  await pg.screenshot({ path: file, fullPage: false });
  console.log('✓', name);
}

async function load(route) {
  await pg.goto(BASE + route, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(600);
}

/** Click the main stage area N times, pausing between clicks. */
async function advance(n, pause = 280) {
  for (let i = 0; i < n; i++) {
    await pg.mouse.click(720, 400);
    await pg.waitForTimeout(pause);
  }
}

/** Click a specific CSS selector. */
async function click(sel, opts = {}) {
  await pg.locator(sel).first().click(opts);
  await pg.waitForTimeout(350);
}

// ── Slide 22: Cross-Functional Team Review ──────────────────────────────────
await load('/cross-functional-review');
await shot('slide-22-cross-functional-review');

// ── Slide 23: Who's Who ─────────────────────────────────────────────────────
await load('/whos-who');
await shot('slide-23-whos-who');

// ── Slide 24: Mentimeter Join ───────────────────────────────────────────────
await load('/mentimeter-join');
await shot('slide-24-mentimeter-join');

// ── Slide 25: Mentimeter Results ────────────────────────────────────────────
await load('/mentimeter');
await shot('slide-25-mentimeter');

// ── Slide 26: What We Need ──────────────────────────────────────────────────
await load('/what-we-need');
await shot('slide-26-what-we-need');

// ── Slide 27: Current → Future State ───────────────────────────────────────
await load('/current-future');
await shot('slide-27-current-future');

// ── Slide 28: Journey Detail ────────────────────────────────────────────────
await load('/journey-detail');
await shot('slide-28-a-default');

// Hover Stage 1 (Registered) on the first visible tab (Sales)
const stage1 = pg.locator('.jd-stage-btn').first();
await stage1.hover();
await pg.waitForTimeout(350);
await shot('slide-28-b-stage-detail-open');

// Switch to Delivery tab and hover Stage 3 (Certified)
const deliveryTab = pg.locator('.jd-tab').filter({ hasText: 'Delivery' });
if (await deliveryTab.count() > 0) {
  await deliveryTab.click();
  await pg.waitForTimeout(300);
  const stage3 = pg.locator('.jd-stage-btn').nth(2); // 0-indexed → stage 3
  await stage3.hover();
  await pg.waitForTimeout(350);
  await shot('slide-28-c-delivery-stage3');
}

// ── Slide 29: Journey Builder 2 (Competency Track) ──────────────────────────
await load('/journey-builder-2');
await shot('slide-29-a-role-select');

// Select Sales role
const salesCard = pg.locator('.jb-role-card, .role-card, [class*="role"]').filter({ hasText: 'Sales' }).first();
await salesCard.click();
await pg.waitForTimeout(400);
await shot('slide-29-b-area-select');

// Select Finance area
const financeCard = pg.locator('[class*="area"], .area-card').filter({ hasText: 'Finance' }).first();
if (await financeCard.count() > 0) {
  await financeCard.click();
  await pg.waitForTimeout(400);
  await shot('slide-29-c-journey-cards');

  // Click a stage button inside a journey card to open detail
  const stageBtn = pg.locator('.jb-stage, .stage-btn, [class*="stage"]').first();
  if (await stageBtn.count() > 0) {
    await stageBtn.click();
    await pg.waitForTimeout(400);
    await shot('slide-29-d-stage-detail');
  }
}

// ── Slide 30: Build-2 (The Framework — interactive build) ───────────────────
// Key steps: 1 (blank start), 3 (Self-Paced populated), 5 (ILT populated),
//            7 (Specialist populated), 9 (drag assets to stages),
//            11 (many journeys), 12 (3 IFP variants), 13 (featured achievements), 15 (all)

await load('/build-2');
await shot('slide-30-step01');            // step 1: blank

await advance(2);
await shot('slide-30-step03-sp');         // step 3: self-paced card populated

await advance(2);
await shot('slide-30-step05-ilt');        // step 5: ILT card populated

await advance(2);
await shot('slide-30-step07-specialist'); // step 7: specialist card populated

await advance(2);
await shot('slide-30-step09-drag');       // step 9: drag-to-stages UI

await advance(2);
await shot('slide-30-step11-journeys');   // step 11: many journey cards

await advance(1);
await shot('slide-30-step12-ifp-trio');   // step 12: IFP three-role highlight

await advance(1);
await shot('slide-30-step13-achievements'); // step 13: featured achievements (Layer 3)

await advance(1);
await shot('slide-30-step14-all-ach');    // step 14: all achievements + "More"

// ── Slide 31: Scrubber-2 (Three Layers Over Time) ───────────────────────────
await load('/scrubber-2');
await shot('slide-31-a-month0');

// Click at ~33% across the scrubber strip (≈ month 4)
{
  const strip = pg.locator('svg').last();
  const box = await strip.boundingBox();
  if (box) {
    await pg.mouse.click(box.x + box.width * 0.33, box.y + box.height * 0.5);
    await pg.waitForTimeout(350);
  }
}
await shot('slide-31-b-month4');

// Click at ~66% (≈ month 8)
{
  const strip = pg.locator('svg').last();
  const box = await strip.boundingBox();
  if (box) {
    await pg.mouse.click(box.x + box.width * 0.66, box.y + box.height * 0.5);
    await pg.waitForTimeout(350);
  }
}
await shot('slide-31-c-month8');

// Click at ~95% (end / fully built out)
{
  const strip = pg.locator('svg').last();
  const box = await strip.boundingBox();
  if (box) {
    await pg.mouse.click(box.x + box.width * 0.95, box.y + box.height * 0.5);
    await pg.waitForTimeout(350);
  }
}
await shot('slide-31-d-full');

// ── Slide 32: Build-3 (Framework + RACI modal) ──────────────────────────────
// build-3 starts at buildStep=9 — need to reset to step 0 first
await load('/build-3');
// Click ↺ Replay button if visible, otherwise we start at default step 9
const resetBtn = pg.locator('.build-reset');
if (await resetBtn.count() > 0) {
  await resetBtn.click();
  await pg.waitForTimeout(400);
}
await shot('slide-32-step01-blank');

await advance(1);
await shot('slide-32-step02-layer1');         // Layer 1 visible

await advance(1);
await shot('slide-32-step03-sp-empty');       // self-paced card (empty)

await advance(1);
await shot('slide-32-step04-sp-populated');   // self-paced card populated

await advance(4);
await shot('slide-32-step09-drag');           // drag-to-stages

// RACI modal — blank state
const raciBtn = pg.locator('.raci-trigger');
await raciBtn.click();
await pg.waitForTimeout(400);
await shot('slide-32-raci-blank');

// RACI modal — populated with Digital Learning data
const populateBtn = pg.locator('.raci-populate-btn');
await populateBtn.click();
await pg.waitForTimeout(500);
await shot('slide-32-raci-populated');

// Close modal and continue build
await pg.locator('.raci-dialog-close').click();
await pg.waitForTimeout(350);

await advance(2);
await shot('slide-32-step11-journeys');       // many journey cards

await advance(1);
await shot('slide-32-step12-ifp-trio');       // IFP three-role highlight

await advance(1);
await shot('slide-32-step13-achievements');   // featured achievements

await advance(1);
await shot('slide-32-step14-all-ach');        // all achievements

// ── Slide 33: Call to Action ─────────────────────────────────────────────────
await load('/call-to-action');
await shot('slide-33-call-to-action');

await browser.close();
console.log('\nDone — screenshots in', OUT);
