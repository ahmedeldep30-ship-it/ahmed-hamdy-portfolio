/**
 * Asset processing: source-assets/ (private, gitignored) → src/assets/ (committed).
 *
 * Rules enforced here:
 *  · Originals are never committed. Only optimized, approved copies.
 *  · No upscaling — a screenshot is never enlarged past its source resolution,
 *    which is what makes interface text turn artificial.
 *  · WebP at a quality high enough to keep UI text readable (screenshots need
 *    more than photos; q=82 with effort=6 keeps 12px Arabic glyphs legible).
 *
 * Run: npm run assets
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const JOBS = [
  {
    from: path.join(ROOT, 'source-assets', 'formula4you'),
    to: path.join(ROOT, 'src', 'assets', 'formula4you'),
    maxWidth: 1600,
    quality: 82,
  },
  {
    from: path.join(ROOT, 'source-assets', 'portrait'),
    to: path.join(ROOT, 'src', 'assets', 'portrait'),
    maxWidth: 900,
    quality: 86,
  },
];

let processed = 0;
let skipped = 0;

for (const job of JOBS) {
  if (!existsSync(job.from)) {
    console.warn(`  ! missing source dir: ${path.relative(ROOT, job.from)}`);
    continue;
  }
  await mkdir(job.to, { recursive: true });
  const files = (await readdir(job.from)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

  for (const file of files) {
    const src = path.join(job.from, file);
    const out = path.join(job.to, file.replace(/\.(png|jpe?g|webp)$/i, '.webp'));

    const image = sharp(src);
    const meta = await image.metadata();
    const srcW = meta.width ?? 0;

    // Never upscale.
    const targetW = Math.min(job.maxWidth, srcW);

    await image
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: job.quality, effort: 6 })
      .toFile(out);

    const before = (await stat(src)).size;
    const after = (await stat(out)).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(
      `  ✓ ${path.basename(out).padEnd(48)} ${srcW}→${targetW}px  ` +
        `${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (−${pct}%)`
    );
    processed++;
  }
}

console.log(`\nProcessed ${processed} asset(s). Skipped ${skipped}.`);
console.log('Originals remain in source-assets/ and are gitignored.');
