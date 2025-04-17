// src/pages/Badge.jsx
import React from "react";

const Badge = () => {
  return (
    <section className="bg-[#020f1e] text-white py-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-green-400">
          🌿 Website Carbon Badge
        </h1>

        <p className="text-slate-300 text-lg mb-6 text-center max-w-3xl mx-auto">
          Add a lightweight badge to your site that automatically shows your page’s
          estimated carbon footprint. Raise awareness, inspire action, and show
          visitors you care about sustainability.
        </p>

        <div className="bg-slate-900 border border-slate-700 p-6 rounded-md mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-2">Embed this snippet:</h2>
          <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap break-words">
{`<div id="wcb" class="carbonbadge"></div>
<script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>`}
          </pre>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-green-400 mb-2">Dark Theme Option:</h2>
          <p className="text-slate-300 mb-2">
            For dark backgrounds, simply add <code className="text-green-400">wcb-d</code> to the class:
          </p>
          <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap break-words">
{`<div id="wcb" class="carbonbadge wcb-d"></div>
<script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>`}
          </pre>
        </div>

        <div className="mb-12 text-slate-400 text-sm">
          <p className="mb-2">
            💡 Results are cached for 7 days. The badge is ultra lightweight and open
            source. You can explore custom integrations via wrappers like
            react-carbonbadge or vue-carbonbadge.
          </p>
          <p>
            See more in our <a href="/faq" className="underline text-green-400">FAQ</a> or explore the
            source code on <a href="https://gitlab.com/wholegrain/website-carbon-badges" target="_blank" rel="noopener noreferrer" className="underline text-green-400">GitLab</a>.
          </p>
        </div>

        <div className="text-center">
          <p className="text-slate-300">
            Questions or feedback? Get in touch or explore our
            <a href="/api-access" className="underline text-green-400 ml-1">API access</a> for more advanced usage.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Badge;


