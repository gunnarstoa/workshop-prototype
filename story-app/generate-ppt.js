import pptxgen from 'pptxgenjs';
import { chromium } from 'playwright';
import { writeFileSync, unlinkSync } from 'fs';

// ── Screenshot each slide from the running dev server ─────────────────────
// Viewport sized so app-main = exactly 13.33" × 7.5" proportions:
//   main_width  = 1333 - 5 (accent bar) = 1328
//   main_height = viewport_height - 58 (header) - 48 (nav) = 750
//   → viewport: 1333 × 856

const VIEWPORT = { width: 1333, height: 856 };
const BASE     = 'http://localhost:5173';

const SLIDES = [
  { route: '/executive-summary', file: 'tmp-slide35.png' },
  { route: '/workback-plan',     file: 'tmp-slide36.png' },
  { route: '/immediate-impact',  file: 'tmp-slide37.png' },
];

console.log('Launching browser…');
const browser = await chromium.launch();
const ctx     = await browser.newContext({ viewport: VIEWPORT });
const pg      = await ctx.newPage();

for (const s of SLIDES) {
  console.log(`  Screenshotting ${s.route}…`);
  await pg.goto(BASE + s.route, { waitUntil: 'networkidle' });
  const el = pg.locator('.app-main');
  await el.screenshot({ path: s.file, type: 'png' });
  console.log(`  Saved ${s.file}`);
}

await browser.close();
console.log('Browser closed.\n');

// ── Build the PowerPoint ───────────────────────────────────────────────────
const prs = new pptxgen();
prs.layout = 'LAYOUT_WIDE'; // 13.33" × 7.5"

for (const s of SLIDES) {
  const slide = prs.addSlide();
  slide.addImage({ path: s.file, x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: 'contain', w: 13.33, h: 7.5 } });
}

await prs.writeFile({ fileName: '../workshop-slides-35-37.pptx' });
console.log('Generated: workshop-slides-35-37.pptx');

// ── Clean up temp PNGs ────────────────────────────────────────────────────
for (const s of SLIDES) {
  try { unlinkSync(s.file); } catch (_) {}
}
console.log('Done.');
