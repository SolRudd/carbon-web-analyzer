import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const src = 'backend/public/greentrace-badge.js';
const out = 'backend/public/badge-loader.min.js';

if (!existsSync(src)) {
  console.log(`ℹ️ Skipping minify: ${src} not found.`);
  process.exit(0);
}

execSync(`terser ${src} --compress --mangle --output ${out}`, { stdio: 'inherit' });
console.log(`✅ Minified to ${out}`);
