// src/pages/Badge.jsx
import React from "react";

export default function Badge() {
  return (
    <section
      id="badge"
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-20 px-4 min-h-screen"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        <h1
          className="text-5xl font-extrabold mb-4 text-center text-greenbuzz dark:text-greenbuzz-light"
        >
          🌿 GreenTrace Verification Badge
        </h1>

        <p
          className="text-lg mb-8 max-w-3xl mx-auto text-center text-slate-700 dark:text-slate-300"
        >
          Embed a compact badge in your footer to verify and showcase your page’s
          carbon footprint via GreenTrace. Encourage transparency, drive awareness,
          and link back to your GreenTrace report.
        </p>

        {/* Embed snippet */}
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-greenbuzz dark:text-greenbuzz-light">
            Embed this Verification Badge:
          </h2>
          <pre className="font-mono text-sm whitespace-pre-wrap break-words text-slate-900 dark:text-slate-100">
{`<!-- Light Theme Verification Badge -->
<a href="https://greentrace.io?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://api.greentrace.io/badge?url={{YOUR_PAGE_URL_ENCODED}}" alt="GreenTrace Verification Badge" style="width:80px;height:auto;border:none;" />
</a>

<!-- Dark Theme Verification Badge -->
<a href="https://greentrace.io?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://api.greentrace.io/badge?theme=dark&url={{YOUR_PAGE_URL_ENCODED}}" alt="GreenTrace Verification Badge (Dark)" style="width:80px;height:auto;border:none;" />
</a>

<!-- Optional JS loader to auto-detect URL and theme -->
<script src="https://api.greentrace.io/badge.js" defer></script>`}
          </pre>
        </div>

        {/* Additional info */}
        <div className="text-center max-w-3xl mx-auto space-y-4 text-slate-600 dark:text-slate-400">
          <p>
            💡 Results are cached for 7 days. The badge is ultra‑lightweight and open
            source. Customize integrations via
            <a href="https://github.com/carbonbadge/react-carbonbadge" target="_blank" rel="noopener noreferrer" className="underline text-greenbuzz dark:text-greenbuzz-light mx-1">
              React
            </a> or
            <a href="https://github.com/carbonbadge/vue-carbonbadge" target="_blank" rel="noopener noreferrer" className="underline text-greenbuzz dark:text-greenbuzz-light mx-1">
              Vue
            </a> wrappers.
          </p>
          <p>
            Learn more in our <a href="/faq" className="underline text-greenbuzz dark:text-greenbuzz-light">FAQ</a> or view source on
            <a href="https://gitlab.com/wholegrain/website-carbon-badges" target="_blank" rel="noopener noreferrer" className="underline text-greenbuzz dark:text-greenbuzz-light mx-1">
              GitLab
            </a>.
          </p>
        </div>

        {/* Footer link */}
        <div className="text-center text-slate-700 dark:text-slate-300">
          <p>
            Questions or feedback? Get in touch or explore our
            <a href="/api-access" className="underline text-greenbuzz dark:text-greenbuzz-light ml-1">
              API Access
            </a> for advanced integrations.
          </p>
        </div>
      </div>
    </section>
  );
}
