/**
 * The hero diagram must be IN the first viewport, so it plays on arrival.
 *
 * Reported: "it should trigger automatically when a visitor first arrives —
 * why does nothing happen upon refreshing or the initial page load?"
 * Measured cause: the figure sat 780px down with the SVG starting at 878px —
 * below the fold at 1920, 1440, 1366 and 1024. The trigger fires on real
 * visibility (correctly), so it simply never fired until you scrolled.
 *
 * This asserts the placement itself: on a fresh load, with no scrolling at all,
 * the diagram must actually play.
 *
 * Run: node scripts/verify-hero-fold.mjs
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.VERIFY_URL ?? 'http://localhost:4330/ahmed-hamdy-portfolio';
let fails = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => { console.error(`  ✗ ${m}`); fails++; };

const browser = await chromium.launch();

async function check(label, contextOpts) {
  const ctx = await browser.newContext({ ...contextOpts, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();

  // Record whether .play ever arrives WITHOUT any scrolling.
  await page.addInitScript(() => {
    window.__auto = null;
    const watch = () => {
      const el = document.querySelector('[data-seam]');
      if (!el) return;
      new MutationObserver(() => {
        if (el.classList.contains('play') && !window.__auto) {
          const r = el.getBoundingClientRect();
          const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
          window.__auto = { top: Math.round(r.top), visibleFrac: +(vis / r.height).toFixed(2), scrollY: Math.round(scrollY) };
        }
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
    else watch();
  });

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2200); // NO scrolling — this is the whole point

  const r = await page.evaluate(() => {
    const el = document.querySelector('[data-seam]');
    // Pick the VISIBLE variant. Selecting '.seam__svg--wide, .seam__svg--tall'
    // returns the desktop one first, which is display:none on mobile — giving a
    // 0×0 box and a meaningless measurement.
    const svg = [...document.querySelectorAll('.seam__svg')]
      .find((n) => n.getBoundingClientRect().height > 0);
    if (!svg) return { noSvg: true };
    const s = svg.getBoundingClientRect();
    return {
      auto: window.__auto,
      svgTop: Math.round(s.top),
      svgBottom: Math.round(s.bottom),
      svgVisible: Math.round(Math.max(0, Math.min(s.bottom, innerHeight) - Math.max(s.top, 0))),
      svgH: Math.round(s.height),
      vh: innerHeight,
      scrolled: Math.round(window.scrollY),
    };
  });

  if (r.noSvg) { bad(`${label}: no visible diagram found`); await ctx.close(); return; }
  const svgFrac = r.svgH ? r.svgVisible / r.svgH : 0;

  if (r.scrolled !== 0) { bad(`${label}: page auto-scrolled (${r.scrolled}px) — test invalid`); await ctx.close(); return; }

  if (!r.auto) {
    bad(`${label}: did NOT play on arrival. SVG top=${r.svgTop} bottom=${r.svgBottom} in a ${r.vh}px viewport (${Math.round(svgFrac * 100)}% of the diagram visible)`);
  } else if (svgFrac < 0.6) {
    bad(`${label}: played, but only ${Math.round(svgFrac * 100)}% of the diagram is above the fold`);
  } else {
    ok(`${label}: plays on arrival with no scrolling — ${Math.round(svgFrac * 100)}% of the diagram in the first viewport (SVG ${r.svgTop}→${r.svgBottom} of ${r.vh}px)`);
  }
  await ctx.close();
}

console.log('\n── Does the diagram play on arrival, without scrolling? ──');
await check('wide 1920×1080', { viewport: { width: 1920, height: 1080 } });
await check('desktop 1440×900', { viewport: { width: 1440, height: 900 } });
await check('laptop 1366×768', { viewport: { width: 1366, height: 768 } });
await check('laptop 1280×800', { viewport: { width: 1280, height: 800 } });
await check('tablet 768×1024', { viewport: { width: 768, height: 1024 } });
await check('mobile 390×844', { ...devices['Pixel 7'] });

await browser.close();
console.log('\n' + (fails ? `FAIL — ${fails}` : 'PASS — the diagnosis plays on arrival at every size'));
if (fails) process.exit(1);
