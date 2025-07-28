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
            🌿 Add Your GreenTracer Badge
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Show your website’s carbon score! Run a test below, then add a badge to your site. Badges update automatically every 7 days.
          </p>
        </header>

        {/* Step 1 */}
        <article className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-greenbuzz dark:text-greenbuzz-light">
            1. Test Your Page
          </h2>
          <p>
            Enter your site at <Link to="/" className="underline text-greenbuzz">greentracer.org</Link> and run a test. You must test each page before the badge will display.
          </p>
        </article>

        {/* Step 2 */}
        <article className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-greenbuzz dark:text-greenbuzz-light">
            2. Embed the Badge
          </h2>
          <p>
            Copy one of these snippets into your site’s HTML (e.g., in your footer).
          </p>
          <details className="my-2">
            <summary className="cursor-pointer text-greenbuzz dark:text-greenbuzz-light">JavaScript Auto Badge (Recommended, Light &amp; Dark)</summary>
            <pre className="font-mono text-sm whitespace-pre-wrap break-words bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded">
{`<div class="greentrace-badge" data-url="https://YOURDOMAIN.com"></div>
<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>`}
            </pre>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Auto detects light/dark mode. <b>Change <code>data-url</code> to your site/page.</b>
            </div>
          </details>
          <details>
            <summary className="cursor-pointer text-greenbuzz dark:text-greenbuzz-light">SVG Image Badge (Manual, Light/Dark)</summary>
            <pre className="font-mono text-sm whitespace-pre-wrap break-words bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded">
{`<!-- Light Mode Badge -->
<a href="https://greentracer.org?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://api.greentracer.org/badge.svg?url=https://YOURDOMAIN.com" alt="GreenTracer Badge" width="120" />
</a>

<!-- Dark Mode Badge -->
<a href="https://greentracer.org?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://api.greentracer.org/badge.svg?theme=dark&url=https://YOURDOMAIN.com" alt="GreenTracer Badge (Dark)" width="120" />
</a>
`}
            </pre>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Use <code>?theme=dark</code> for dark backgrounds.
            </div>
          </details>
        </article>

        {/* Tips & FAQ */}
        <section className="text-center max-w-3xl mx-auto space-y-4 text-slate-600 dark:text-slate-400">
          <p>• Badges update automatically every 7 days (run a test if you change your site).</p>
          <p>• Loader script works on any site, including WordPress, Wix, and custom code.</p>
          <p>
            • Need help?{' '}
            <a href="mailto:hello@greentracer.org" className="underline text-greenbuzz dark:text-greenbuzz-light">
              Contact Us
            </a>
            {' '}or see our{' '}
            <Link to="/faq" className="underline text-greenbuzz dark:text-greenbuzz-light">FAQ</Link>.
          </p>
        </section>
      </div>
    </section>
  );
}
