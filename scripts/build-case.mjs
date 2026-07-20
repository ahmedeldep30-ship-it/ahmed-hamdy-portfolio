/**
 * Build the Formula4You case study to PDF.
 *
 * Same engine and stylesheet as the CVs, so every document Ahmed sends is one
 * visual system. A case study is a narrative sent directly to a person, not a
 * parser target, so the two-page limit and the stat row are the only checks
 * worth making: does it fit, did the fonts load, are the real numbers present.
 *
 * Run: node scripts/build-case.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'scripts', 'cv', 'formula4you-case.html');
const OUT = path.join(ROOT, 'public', 'assets', 'ahmed-hamdy-formula4you-case.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  await page.goto(pathToFileURL(SRC).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => document.fonts.check("800 25pt 'Manrope'"));
  if (!ok) throw new Error('Manrope never loaded');
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
} finally {
  await browser.close();
}

const raw = fs.readFileSync(OUT).toString('latin1');
const pages = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`  ✓ public/assets/ahmed-hamdy-formula4you-case.pdf — ${kb} KB, ${pages} page(s)`);
if (pages > 2) console.log('  ✗ over two pages — trim');
