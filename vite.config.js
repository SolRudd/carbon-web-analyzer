import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Prerenderer } from 'vite-plugin-prerenderer';
import path from 'path';
import glob from 'fast-glob';

/**
 * Dynamically finds all blog post files and converts them into URL routes
 * for the prerenderer. This ensures all posts are automatically included.
 */
const getBlogRoutes = async () => {
  const blogDir = path.join(process.cwd(), 'src', 'blog');
  // Assumes your blog posts are .jsx files and export a `meta` object with a `slug`.
  const files = await glob('*.jsx', { cwd: blogDir });
  return files.map(file => {
    // This creates the URL path, e.g., /blog/my-first-post
    const slug = file.replace(/\.jsx$/, '');
    return `/blog/${slug}`;
  });
};


export default defineConfig(async () => {
  // Fetch all the blog routes automatically.
  const blogRoutes = await getBlogRoutes();

  return {
    plugins: [
      react(),
      // Add the Prerenderer plugin. This runs after the build is complete.
      new Prerenderer({
        // The directory Vite builds to. We'll use 'build' to match your old config.
        staticDir: path.join(process.cwd(), 'build'),
        
        // The renderer to use. Puppeteer is a headless browser that runs your JS.
        renderer: '@prerenderer/renderer-puppeteer',
        
        // Define all the routes to be pre-rendered.
        routes: [
          '/',
          '/how-it-works',
          '/rating-system',
          '/blog',
          '/badge',
          '/faq',
          '/api',
          '/privacy',
          ...blogRoutes, // Add all the blog posts found automatically
        ],
      }),
    ],

    // Your existing server proxy settings for local development.
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

    // Updated build configuration.
    build: {
      // The output directory.
      outDir: 'build',
      // Minification is enabled by default in production.
      // No need to set target; Vite handles modern browser compatibility.
      sourcemap: false,
      chunkSizeWarningLimit: 600,
    },
  };
});