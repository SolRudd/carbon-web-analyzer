// src/pages/Badge.jsx
import React from "react";

const Badge = () => (
  <section
    className="
      bg-white dark:bg-slate-900
      text-slate-900 dark:text-white
      py-20 px-4 min-h-screen
      transition-colors duration-300
    "
  >
    <div className="max-w-5xl mx-auto space-y-10">
      <h1 className="
        text-5xl font-extrabold mb-4 text-center
        text-green-600 dark:text-green-400
      ">
        🌿 Website Carbon Badge
      </h1>

      <p className="
        text-lg mb-8 max-w-3xl mx-auto text-center
        text-slate-700 dark:text-slate-300
      ">
        Add a lightweight badge to your site that automatically shows your page’s
        estimated carbon footprint. Raise awareness, inspire action, and show
        visitors you care about sustainability.
      </p>

      <div className="
        bg-slate-100 dark:bg-slate-800
        border border-slate-300 dark:border-slate-700
        p-6 rounded-lg max-w-3xl mx-auto space-y-4
        transition-colors duration-200
      ">
        <h2 className="text-xl font-bold text-green-600 dark:text-green-400">Embed this snippet:</h2>
        <pre className="
          font-mono text-sm whitespace-pre-wrap break-words
          text-slate-900 dark:text-slate-100
        ">
{`<div id="wcb" class="carbonbadge"></div>
<script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>`}
        </pre>
      </div>

      <div className="
        bg-slate-100 dark:bg-slate-800
        border border-slate-300 dark:border-slate-700
        p-6 rounded-lg max-w-3xl mx-auto space-y-4
        transition-colors duration-200
      ">
        <h2 className="text-xl font-bold text-green-600 dark:text-green-400">Dark Theme Option:</h2>
        <p className="text-slate-700 dark:text-slate-300">
          For dark backgrounds, simply add <code className="text-green-600 dark:text-green-400">wcb-d</code> to the class:
        </p>
        <pre className="
          font-mono text-sm whitespace-pre-wrap break-words
          text-slate-900 dark:text-slate-100
        ">
{`<div id="wcb" class="carbonbadge wcb-d"></div>
<script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>`}
        </pre>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-4 text-slate-600 dark:text-slate-400">
        <p>
          💡 Results are cached for 7 days. The badge is ultra lightweight and open
          source. You can explore custom integrations via wrappers like
          <a href="https://github.com/carbonbadge/react-carbonbadge" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-green-400"> react-carbonbadge</a> or
          <a href="https://github.com/carbonbadge/vue-carbonbadge" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-green-400"> vue-carbonbadge</a>.
        </p>
        <p>
          See more in our <a href="/faq" className="underline text-green-600 dark:text-green-400">FAQ</a> or explore the
          source code on <a href="https://gitlab.com/wholegrain/website-carbon-badges" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-green-400">GitLab</a>.
        </p>
      </div>

      <div className="text-center text-slate-700 dark:text-slate-300">
        <p>
          Questions or feedback? Get in touch or explore our
          <a href="/api-access" className="underline text-green-600 dark:text-green-400 ml-1">API access</a> for more advanced usage.
        </p>
      </div>
    </div>
  </section>
);

export default Badge;
