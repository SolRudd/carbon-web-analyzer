// scripts/convert-images.mjs
import fg from 'fast-glob';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const format = (process.argv[2] || 'webp').toLowerCase(); // "webp" or "avif"
if (!['webp', 'avif'].includes(format)) {
  console.error('Usage: node scripts/convert-images.mjs <webp|avif>');
  process.exit(1);
}

const INPUT_GLOBS = ['src/assets/**/*.{png,jpg,jpeg}'];
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 45;

async function convertOne(inputFile) {
  const ext = path.extname(inputFile);
  const base = inputFile.slice(0, -ext.length);
  const outFile = `${base}.${format}`;

  try {
    // Skip if output exists and is newer than input
    const [inStat, outStat] = await Promise.allSettled([
      fs.stat(inputFile),
      fs.stat(outFile),
    ]);

    if (outStat.status === 'fulfilled' && inStat.status === 'fulfilled') {
      if (outStat.value.mtimeMs >= inStat.value.mtimeMs) {
        console.log(`↷ Skipped (up-to-date): ${outFile}`);
        return;
      }
    }

    const img = sharp(inputFile, { sequentialRead: true });
    const meta = await img.metadata();

    const width =
      typeof meta.width === 'number' && meta.width > MAX_WIDTH ? MAX_WIDTH : null;

    let pipeline = img.resize({ width, withoutEnlargement: true });

    if (format === 'webp') {
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
    } else {
      pipeline = pipeline.avif({ quality: AVIF_QUALITY });
    }

    await pipeline.toFile(outFile);
    console.log(`✓ ${inputFile} → ${outFile}`);
  } catch (err) {
    console.error(`✗ Failed: ${inputFile}`);
    console.error(err.message);
  }
}

(async () => {
  const files = await fg(INPUT_GLOBS, { dot: false });
  if (!files.length) {
    console.log('No PNG/JPG images found in src/assets.');
    process.exit(0);
  }

  const CONCURRENCY = 4;
  let i = 0;
  async function nextBatch() {
    const batch = files.slice(i, i + CONCURRENCY);
    i += CONCURRENCY;
    await Promise.all(batch.map(convertOne));
    if (i < files.length) await nextBatch();
  }

  await nextBatch();
})();
