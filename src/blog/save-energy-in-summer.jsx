import React from "react";
import { FaCertificate, FaCode, FaShieldAlt, FaRocket, FaChartLine, FaLeaf, FaGlobe } from "react-icons/fa";

export const meta = {
  title: "The GreenTracer Badge: A Trust Signal for the Sustainable Web",
  author: "Sol Rudd",
  date: "2025-08-15",
  readingMinutes: 3,
  tags: ["GreenTracer", "Badges", "Web Sustainability", "Digital Ethics"],
  slug: "save-energy-in-summer",
  image: "/assets/blog/summer-energy.webp",
  imageAvif: "/assets/blog/summer-energy.avif",
  excerpt: "Your visitors can't see the emissions your website produces. The GreenTracer badge changes that — turning your carbon data into a live, credible trust signal that updates automatically.",
};

export const toc = [
  { id: "intro", text: "Why Transparency Beats Claims", level: 2 },
  { id: "what-badge-does", text: "What the Badge Actually Does", level: 2 },
  { id: "badge-types", text: "Three Badge Types, One Purpose", level: 2 },
  { id: "how-it-works", text: "How It Works (Technically)", level: 2 },
  { id: "adding-badge", text: "Adding the Badge in 3 Minutes", level: 2 },
  { id: "customisation", text: "Brand Customisation", level: 2 },
  { id: "business-case", text: "The Business Case for Transparency", level: 2 },
  { id: "next-steps", text: "Next Steps", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">

      <p id="intro" className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        Any company can publish a sustainability page. It costs nothing to write "we care about the environment" and mean nothing by it. That's the problem the GreenTracer badge was built to solve: replacing claims with live, verifiable data. When a visitor loads your site, the badge fetches your actual carbon score in real time and displays it — not a screenshot, not a one-time audit from three years ago, but the current number.
      </p>

      <h2 id="what-badge-does" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        What the Badge Actually Does
      </h2>
      <p className="text-lg leading-relaxed">
        The badge is a small JavaScript snippet you embed in your website. When it loads, it makes a lightweight request to the GreenTracer API, retrieves the cached carbon analysis for your site, and renders a compact, branded badge inline on your page. No page-weight penalty, no iframes, no tracking cookies.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border border-green-100 dark:border-green-800/30">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <FaChartLine className="text-green-600 dark:text-green-400" /> What gets displayed
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-green-100 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white mb-1">CO₂ per view</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your site's estimated grams of CO₂ per page visit — calculated from transfer size and hosting energy mix.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-green-100 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Global percentile</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">How your site compares to millions of others tested. "Cleaner than 82% of pages" is a meaningful, concrete claim.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-green-100 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Live data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Results update when you run a new scan. The badge reflects your current score, not a historical snapshot.</p>
          </div>
        </div>
      </div>

      <h2 id="badge-types" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Three Badge Types, One Purpose
      </h2>
      <p className="text-lg leading-relaxed">
        GreenTracer offers three distinct badge variants, each communicating a different dimension of your site's sustainability credentials.
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex-shrink-0 mt-1">
            <FaChartLine className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Carbon Badge</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows CO₂ per page view and your percentile ranking. Available to any site that has run a GreenTracer scan. No license required.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex-shrink-0 mt-1">
            <FaShieldAlt className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Green Hosting Verified Badge</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Confirms your site is served from renewable-energy data centres as verified by the Green Web Foundation. Only renders if your latest scan confirms green hosting.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex-shrink-0 mt-1">
            <FaCertificate className="text-emerald-500 text-xl" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Licensed Member Badge</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">For GreenTracer subscribers. Displays your membership status and links to your full audit report. Updates automatically if your license status changes.</p>
          </div>
        </div>
      </div>

      <h2 id="how-it-works" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        How It Works (Technically)
      </h2>
      <p className="text-lg leading-relaxed">
        The recommended badge is served as a static SVG from <code className="text-green-600 dark:text-green-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm">api.greentracer.org</code>. It uses a public badge token and links to a public verification page.
      </p>
      <p className="text-lg leading-relaxed">
        The browser loads one small image. There is no required JavaScript, no API key in the page, and no private account or billing data exposed.
      </p>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">How the badge loads</div>
        <div className="p-5">
          <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{`<a href="https://www.greentracer.org/verify/PUBLIC_TOKEN" target="_blank" rel="noopener">
  <img
    src="https://api.greentracer.org/api/badge/PUBLIC_TOKEN"
    alt="GreenTracer Verified"
    width="240"
    height="40"
  />
</a>`}</pre>
        </div>
      </div>

      <h2 id="adding-badge" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Adding the Badge in 3 Minutes
      </h2>
      <p className="text-lg leading-relaxed">
        Embedding the badge takes two steps: activate a verified badge record for your site, then paste the tokenized snippet.
      </p>
      <ol className="space-y-4 list-decimal list-inside text-lg leading-relaxed">
        <li><strong>Verify your site</strong> — use your GreenTracer license and verification flow to create a public badge token.</li>
        <li><strong>Copy the snippet</strong> — visit the Badge Setup page, choose compact or standard, and copy the generated code.</li>
        <li><strong>Paste into your HTML</strong> — anywhere in your page body, typically the footer.</li>
      </ol>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">Embed snippet</div>
        <div className="p-5">
          <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{`<a href="https://www.greentracer.org/verify/PUBLIC_TOKEN" target="_blank" rel="noopener">
  <img
    src="https://api.greentracer.org/api/badge/PUBLIC_TOKEN"
    alt="GreenTracer Verified"
    width="240"
    height="40"
  />
</a>`}</pre>
        </div>
      </div>

      <h2 id="customisation" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Badge Variants
      </h2>
      <p className="text-lg leading-relaxed">
        Compact is the recommended footer badge. A standard variant is available for trust sections where a little more visual weight is useful.
      </p>
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">Standard variant</div>
        <div className="p-5">
          <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{`<img
  src="https://api.greentracer.org/api/badge/PUBLIC_TOKEN?variant=standard"
  alt="GreenTracer Verified"
  width="300"
  height="50"
/>`}</pre>
        </div>
      </div>
      <p className="text-lg leading-relaxed">
        The live preview on the Badge Setup page shows exactly how your badge will appear before you commit to embedding it.
      </p>

      <h2 id="business-case" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        The Business Case for Transparency
      </h2>
      <div className="bg-gradient-to-r from-slate-50 to-green-50 dark:from-slate-900/60 dark:to-green-900/20 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          Sustainability is increasingly a purchase driver. A 2024 Edelman survey found 71% of consumers consider a company's environmental practices when making buying decisions. Displaying verified carbon data — not vague commitments — turns sustainability into a visible differentiator. It signals that you measure your impact, you're not hiding from it, and you're working to improve it.
        </p>
      </div>

      <h2 id="next-steps" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Next Steps
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <a href="/" className="flex gap-3 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-colors no-underline">
          <FaRocket className="text-green-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Scan Your Site</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Get your carbon score and percentile in seconds.</p>
          </div>
        </a>
        <a href="/badge" className="flex gap-3 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-colors no-underline">
          <FaCode className="text-green-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Configure Your Badge</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Choose your style and copy the embed snippet.</p>
          </div>
        </a>
      </div>

    </div>
  );
}
