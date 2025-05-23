// src/pages/Badge.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Badge() {
  return (
    <section
      id="badge"
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-20 px-4 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-greenbuzz dark:text-greenbuzz-light mb-4">
            🌿 GreenTracer Verification Badge
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Embed a compact badge in your footer to showcase your page’s carbon footprint via GreenTracer. Increase transparency and link back to your detailed report.
          </p>
        </header>

        {/* Embed Snippet Section */}
        <article className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-greenbuzz dark:text-greenbuzz-light">
            How to Embed
          </h2>
          <pre className="font-mono text-sm whitespace-pre-wrap break-words text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-4 rounded">
{`<!-- Light Mode Badge -->
<a href="https://greentracer.org?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://api.greentracer.org/badge.svg?url={{YOUR_PAGE_URL_ENCODED}}" alt="GreenTracer Badge" width="100" />
</a>

<!-- Dark Mode Badge -->
<a href="https://greentracer.org?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://api.greentracer.org/badge.svg?theme=dark&url={{YOUR_PAGE_URL_ENCODED}}" alt="GreenTracer Badge (Dark)" width="100" />
</a>

<!-- Auto-Detect Loader -->
<div id="greentrace-badge" class="greentracer-badge" data-theme="auto" data-url="{{YOUR_PAGE_URL}}"></div>
<script src="https://cdn.greentracer.org/badge-loader.js" defer></script>`}
          </pre>
        </article>

        {/* Additional Info */}
        <section className="text-center max-w-3xl mx-auto space-y-4 text-slate-600 dark:text-slate-400">
          <p>• Results are cached for 7 days to minimize API calls.</p>
          <p>• The loader script is ultra‑lightweight and open source.</p>
          <p>
            • Customize via our{' '}
            <a href="https://github.com/greentracer/js-badge-loader" target="_blank" rel="noopener noreferrer" className="underline text-greenbuzz dark:text-greenbuzz-light">
              JS Loader Library
            </a>
            .
          </p>
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/badge"
            className="px-6 py-3 bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold rounded-full transition-transform hover:scale-105"
          >
            Get Your Badge
          </Link>
          <Link
            to="/api-access"
            className="px-6 py-3 border-2 border-greenbuzz text-greenbuzz hover:bg-greenbuzz hover:text-white rounded-full transition-colors"
          >
            View API Access
          </Link>
        </div>

        {/* Footer Note */}
        <footer className="text-center text-slate-700 dark:text-slate-300 mt-8">
          <p>
            Questions? See our <Link to="/faq" className="underline text-greenbuzz dark:text-greenbuzz-light">FAQ</Link> or{' '}
            <Link to="/api-access" className="underline text-greenbuzz dark:text-greenbuzz-light">Contact Us</Link>.
          </p>
        </footer>
      </div>
    </section>
  );
}
