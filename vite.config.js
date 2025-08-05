// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import glob from 'fast-glob';

// Helper: dynamically generate blog routes
const getBlogRoutes = async () => {
  const blogDir = path.join(process.cwd(), 'src', 'blog');
  const files = await glob('*.jsx', { cwd: blogDir });
  return files.map(file => `/blog/${file.replace(/\.jsx$/, '')}`);
};

export default defineConfig(async ({ command, mode }) => {
  const blogRoutes = await getBlogRoutes();
  const plugins = [react()];

  // ✅ Only run prerendering if NOT on Vercel
  const isVercel = process.env.VERCEL === '1';
  if (command === 'build' && !isVercel) {
    const Prerenderer = (await import('vite-plugin-prerenderer')).default;
    plugins.push(
      new Prerenderer({
        staticDir: path.join(process.cwd(), 'dist'),
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterTime: 5000,
        },
        routes: [
          '/',
          '/how-it-works',
          '/rating-system',
          '/blog',
          '/badge',
          '/faq',
          '/api',
          '/privacy-policy',
          ...blogRoutes,
        ],
      })
    );
  }

  return {
    plugins,
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/greentrace-badge.js': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 2000, // Avoid warnings for large bundles
    },
  };
});
