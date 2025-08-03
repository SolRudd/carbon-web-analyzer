import fs from 'fs/promises';
import 'dotenv/config';

// Static config
const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, '') || 'https://www.greentracer.org';
const INCLUDE_RESULTS = String(process.env.INCLUDE_RESULTS).toLowerCase() === 'true';
const API_BASE = process.env.VITE_API_BASE?.replace(/\/+$/, ''); // must include protocol

// Import blog post modules (must export `meta = { slug, date }`)
import * as post1 from '../src/blog/carbon-footprints-energy-providers.jsx';
import * as post2 from '../src/blog/why-website-carbon-matters-2025.jsx';
import * as post3 from '../src/blog/reduce-website-emissions-tips.jsx';
import * as post4 from '../src/blog/case-study-greening-website.jsx';
import * as post5 from '../src/blog/save-energy-in-summer.jsx';
import * as post6 from '../src/blog/plastic-climate-crisis.jsx';
import * as post7 from '../src/blog/improve-air-quality.jsx';

const posts = [post1, post2, post3, post4, post5, post6, post7];

// Helpers
const today = new Date().toISOString().split('T')[0];
const staticPages = ['/', '/how-it-works', '/rating-system', '/blog', '/badge', '/faq', '/api', '/privacy'];

function urlTag(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`;
}

async function fetchResultSlugs() {
  if (!INCLUDE_RESULTS) return [];
  if (!API_BASE) {
    console.warn('ℹ️ INCLUDE_RESULTS=true but VITE_API_BASE is not set. Skipping results.');
    return [];
  }
  let apiURL;
  try {
    apiURL = new URL('/api/results/all-slugs', API_BASE).toString();
  } catch {
    console.warn(`ℹ️ Invalid VITE_API_BASE "${API_BASE}". Skipping results.`);
    return [];
  }

  console.log('Fetching result slugs from live API…', apiURL);
  try {
    const res = await fetch(apiURL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('API did not return an array');
    console.log(`Found ${data.length} result slugs.`);
    return data;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch result slugs: ${err.message}. Skipping results.`);
    return [];
  }
}

async function generateSitemap() {
  const staticXml = staticPages
    .map(p => urlTag(`${SITE_URL}${p}`, today, 'monthly', p === '/' ? '1.0' : '0.8'))
    .join('\n');

  const blogXml = posts
    .map(p => {
      const slug = p?.meta?.slug;
      const date = p?.meta?.date || today;
      if (!slug) return '';
      return urlTag(`${SITE_URL}/blog/${slug}`, date, 'yearly', '0.9');
    })
    .filter(Boolean)
    .join('\n');

  const resultSlugs = await fetchResultSlugs();
  const resultsXml = resultSlugs
    .map(slug => urlTag(`${SITE_URL}/results/${slug}`, today, 'weekly', '0.6'))
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${blogXml}
${resultsXml}
</urlset>
`;

  await fs.mkdir('public', { recursive: true });
  await fs.writeFile('public/sitemap.xml', xml, 'utf8');
  console.log('✅ Sitemap generated at public/sitemap.xml');
}

generateSitemap().catch(err => {
  console.error('❌ Unexpected error generating sitemap:', err);
  const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', '/how-it-works', '/rating-system', '/blog', '/badge', '/faq', '/api', '/privacy']
  .map(p => urlTag(`${SITE_URL}${p}`, today, 'monthly', p === '/' ? '1.0' : '0.8')).join('\n')}
</urlset>`;
  fs.mkdir('public', { recursive: true })
    .then(() => fs.writeFile('public/sitemap.xml', fallback, 'utf8'))
    .then(() => console.log('✅ Wrote fallback sitemap'))
    .catch(e => console.error('❌ Failed to write fallback sitemap:', e));
});
