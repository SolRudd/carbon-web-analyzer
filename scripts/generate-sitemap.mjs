import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';
import glob from 'fast-glob';

// --- CONFIGURATION ---
const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, '') || 'https://www.greentracer.org';
const INCLUDE_RESULTS = String(process.env.INCLUDE_RESULTS).toLowerCase() === 'true';
const API_BASE = process.env.VITE_API_BASE?.replace(/\/+$/, '');

// --- HELPERS ---
const today = new Date().toISOString().split('T')[0];

function urlTag(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`;
}

// --- DYNAMIC CONTENT FETCHING ---

/**
 * Dynamically imports all blog posts from the src/blog directory
 * and extracts their metadata.
 */
async function getBlogPosts() {
  const posts = [];
  const blogDir = path.join(process.cwd(), 'src', 'blog');
  const files = await glob('*.jsx', { cwd: blogDir });

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    // Use a dynamic import to load the module
    const postModule = await import(path.resolve(filePath));
    if (postModule.meta) {
      posts.push(postModule.meta);
    }
  }
  return posts;
}

/**
 * Fetches all result slugs from the live API if configured to do so.
 */
async function fetchResultSlugs() {
  if (!INCLUDE_RESULTS || !API_BASE) {
    if (INCLUDE_RESULTS) {
      console.warn('ℹ️ INCLUDE_RESULTS=true but VITE_API_BASE is not set. Skipping results.');
    }
    return [];
  }
  
  try {
    const apiURL = new URL('/api/results/all-slugs', API_BASE).toString();
    console.log('Fetching result slugs from live API:', apiURL);
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

// --- SITEMAP GENERATION ---

async function generateSitemap() {
  // 1. Static Pages
  const staticPages = ['/', '/how-it-works', '/rating', '/blog', '/badge', '/faq', '/api-access', '/privacy-policy'];
  const staticXml = staticPages
    .map(p => urlTag(`${SITE_URL}${p}`, today, 'monthly', p === '/' ? '1.0' : '0.8'))
    .join('\n');

  // 2. Blog Posts (Now fully automatic)
  const blogPosts = await getBlogPosts();
  const blogXml = blogPosts
    .map(meta => {
      if (!meta.slug) return '';
      return urlTag(`${SITE_URL}/blog/${meta.slug}`, meta.date || today, 'yearly', '0.9');
    })
    .filter(Boolean)
    .join('\n');

  // 3. API Results
  const resultSlugs = await fetchResultSlugs();
  const resultsXml = resultSlugs
    .map(slug => urlTag(`${SITE_URL}/result/${slug}`, today, 'weekly', '0.6'))
    .join('\n');

  // 4. Combine and Write File
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${blogXml}
${resultsXml}
</urlset>
`;

  await fs.mkdir('public', { recursive: true });
  await fs.writeFile('public/sitemap.xml', xml, 'utf8');
  console.log('✅ Sitemap generated automatically at public/sitemap.xml');
}

// --- EXECUTION ---

generateSitemap().catch(err => {
  console.error('❌ Unexpected error generating sitemap:', err);
  // Fallback logic remains the same
  const fallbackPages = ['/', '/how-it-works', '/rating', '/blog', '/badge', '/faq', '/api-access', '/privacy-policy'];
  const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackPages.map(p => urlTag(`${SITE_URL}${p}`, today, 'monthly', p === '/' ? '1.0' : '0.8')).join('\n')}
</urlset>`;
  fs.mkdir('public', { recursive: true })
    .then(() => fs.writeFile('public/sitemap.xml', fallbackXml, 'utf8'))
    .then(() => console.log('✅ Wrote fallback sitemap'))
    .catch(e => console.error('❌ Failed to write fallback sitemap:', e));
});
