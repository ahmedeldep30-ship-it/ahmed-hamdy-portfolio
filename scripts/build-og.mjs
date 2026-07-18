/**
 * Build the social preview card.
 *
 * When a link is pasted into LinkedIn, Slack, WhatsApp or a message, the
 * receiving app fetches the page and builds a card from its og: tags. With no
 * og:image the card is a bare line of text — which is what a recruiter would
 * have seen in the one place Ahmed most wants the site to look considered.
 *
 * The card is designed for the size it is actually seen at — roughly 550px
 * wide in a feed, less in the Featured carousel. That rules out fine detail and
 * anything needing more than about ten words read.
 *
 * No portrait. It is already his LinkedIn profile photo sitting directly beside
 * the card, so repeating it spends the whole image on something the viewer is
 * already looking at. The card shows the method instead: the wide format is not
 * decoration here, it IS the idea — the distance between where a problem is
 * seen and where it began, with the trace running right to left.
 *
 * Run: node scripts/build-og.mjs   (output: public/og-card.png)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'public');
const OUT = path.join(PUB, 'og-card.png');
// The page is written into public/ and opened over file://, not handed to
// setContent. setContent leaves the document on about:blank with a null origin,
// which blocks every file:// subresource — the first version of this script
// produced a card with fallback serif type, silently, because a blocked font
// just falls back. Relative paths from public/ resolve.
const TMP = path.join(PUB, '.og-build.html');

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family:'Manrope'; font-weight:200 800; src:url('fonts/manrope-latin-wght-normal.woff2') format('woff2-variations'); }
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;position:relative;
       background:radial-gradient(circle at 84% 20%,rgba(121,183,255,.17),transparent 26rem),
                  radial-gradient(circle at 6% 84%,rgba(72,224,187,.13),transparent 26rem),
                  linear-gradient(135deg,#04151e 0%,#082632 63%,#0a303a 100%)}
  /* Same dot field as the hero, same opacity, so the card and the page it opens
     are recognisably the same object. */
  .grain{position:absolute;inset:0;opacity:.19;
         background-image:radial-gradient(rgba(255,255,255,.28) .7px,transparent .7px);
         background-size:24px 24px;mask-image:radial-gradient(circle at 36% 36%,black,transparent 66%)}
  .wrap{position:absolute;inset:0;z-index:2;padding:58px 74px 54px;display:flex;flex-direction:column}

  .eyebrow{display:flex;align-items:center;gap:13px;color:#48e0bb;
           font:800 16px 'Manrope';letter-spacing:.14em;text-transform:uppercase}
  .eyebrow i{width:9px;height:9px;border-radius:50%;background:#48e0bb;box-shadow:0 0 0 5px rgba(72,224,187,.16)}

  /* The setup line is the quiet one and the payoff carries the weight. The first
     draft had this backwards — the muted grey sat on "It started somewhere
     else", which is the whole point of the card. */
  h1{margin-top:30px}
  .setup{display:block;color:rgba(255,255,255,.44);font:700 40px/1.15 'Manrope';letter-spacing:-.025em}
  .payoff{display:block;margin-top:6px;color:#fff;font:800 68px/1.05 'Manrope';letter-spacing:-.04em}
  .payoff em{font-style:normal;color:#48e0bb}

  /* The diagram. Full width on purpose: the 1.91:1 ratio every platform crops to
     is exactly the shape of the argument. */
  .track{margin-top:auto;position:relative;height:118px}
  .arrow{position:absolute;top:0;left:50%;transform:translateX(-50%);white-space:nowrap;
         color:rgba(255,255,255,.62);font:800 15px 'Manrope';letter-spacing:.18em;text-transform:uppercase}
  .rail{position:absolute;left:0;right:0;top:52px;height:2px;
        background:linear-gradient(90deg,#48e0bb,rgba(121,183,255,.45) 55%,#ff7a59)}
  .pin{position:absolute;top:38px;width:30px;height:30px;border-radius:50%;border:5px solid #061c26}
  .pin.l{left:-4px;background:#48e0bb;box-shadow:0 0 30px rgba(72,224,187,.85)}
  .pin.r{right:-4px;background:#ff7a59;box-shadow:0 0 30px rgba(255,122,89,.7)}
  .lab{position:absolute;top:92px;font:800 17px 'Manrope';letter-spacing:.1em;text-transform:uppercase}
  .lab.l{left:0;color:#48e0bb}
  .lab.r{right:0;color:#ff7a59}

  .foot{margin-top:34px;padding-top:24px;border-top:1px solid rgba(255,255,255,.13);
        display:flex;justify-content:space-between;color:rgba(255,255,255,.5);
        font:700 16px 'Manrope';letter-spacing:.09em;text-transform:uppercase}
</style></head><body>
  <div class="grain"></div>
  <div class="wrap">
    <div class="eyebrow"><i></i>Ahmed Hamdy</div>
    <h1>
      <span class="setup">It shows up in support.</span>
      <span class="payoff">It started <em>somewhere else</em>.</span>
    </h1>
    <div class="track">
      <div class="arrow">&#8592;&nbsp; traced back</div>
      <div class="rail"></div>
      <div class="pin l"></div><div class="pin r"></div>
      <div class="lab l">Where it started</div>
      <div class="lab r">Where you see it</div>
    </div>
    <div class="foot"><span>Three worked cases</span><span>Business Operations &amp; Process Improvement</span></div>
  </div>
</body></html>`;

fs.writeFileSync(TMP, HTML);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
try {
  await page.goto(pathToFileURL(TMP).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  // A blocked webfont fails silently into a serif fallback — assert, do not hope.
  const ok = await page.evaluate(() => document.fonts.check("800 68px 'Manrope'"));
  if (!ok) throw new Error('Manrope never loaded — the card would ship in a fallback face');

  await page.screenshot({ path: OUT });
} finally {
  await browser.close();
  fs.rmSync(TMP, { force: true });
}

const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`  ✓ public/og-card.png — 1200x630, ${kb} KB (webfont verified present)`);
// LinkedIn's ceiling is 5 MB; WhatsApp's is far lower and it silently skips.
if (fs.statSync(OUT).size > 1024 * 1024) console.log('  ⚠ over 1 MB — some clients will skip the preview');
