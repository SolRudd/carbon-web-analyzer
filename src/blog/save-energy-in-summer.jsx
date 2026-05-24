import React from "react";
import { FaCode, FaRocket, FaShieldAlt } from "react-icons/fa";

export const meta = {
  title: "The GreenTracer Badge: A Trust Signal for the Sustainable Web",
  author: "Sol Rudd",
  date: "2025-08-15",
  readingMinutes: 3,
  tags: ["GreenTracer", "Badges", "Web Sustainability", "Digital Ethics"],
  slug: "save-energy-in-summer",
  image: "/assets/blog/summer-energy.webp",
  imageAvif: "/assets/blog/summer-energy.webp",
  excerpt: "Your visitors can't see the emissions your website produces. The GreenTracer badge changes that — turning your carbon data into a live, credible trust signal that updates automatically.",
};

export const toc = [
  { id: "intro", text: "Why Transparency Beats Claims", level: 2 },
  { id: "what-badge-does", text: "What the Badge Actually Does", level: 2 },
  { id: "badge-types", text: "One Official Badge", level: 2 },
  { id: "how-it-works", text: "How It Works (Technically)", level: 2 },
  { id: "adding-badge", text: "Adding the Badge in 3 Minutes", level: 2 },
  { id: "customisation", text: "Badge Design", level: 2 },
  { id: "business-case", text: "The Business Case for Transparency", level: 2 },
  { id: "next-steps", text: "Next Steps", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">

      <p id="intro" className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        Any company can publish a sustainability page. It costs nothing to write "we care about the environment" and mean nothing by it. That's the problem the GreenTracer badge was built to solve: replacing claims with a live, verifiable record. When a visitor clicks the badge, they can see the domain, status, latest result information, and verification timestamp behind the claim.
      </p>

      <h2 id="what-badge-does" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        What the Badge Actually Does
      </h2>
      <p className="text-lg leading-relaxed">
        The badge is a small trust mark you embed in your website footer. Free report badges are generated from public scan results, while GreenTracer Verified is tied to your account domain and active supporter entitlement. No page-weight penalty, no iframes, no tracking cookies.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border border-green-100 dark:border-green-800/30">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-green-600 dark:text-green-400" /> What gets displayed
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-green-100 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Carbon Result</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A free report badge that can show the latest scan grade.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-green-100 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Green Hosting</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A free report badge when GreenTracer detects green hosting.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-green-100 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white mb-1">GreenTracer Verified</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A paid supporter badge controlled by licence and domain state.</p>
          </div>
        </div>
      </div>

      <h2 id="badge-types" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Three Badge Families
      </h2>
      <p className="text-lg leading-relaxed">
        GreenTracer now separates report-based badges from the paid supporter badge. Carbon Result and Green Hosting come from scan data; GreenTracer Verified comes from licence and domain state.
      </p>

      <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex-shrink-0 mt-1">
          <FaShieldAlt className="text-green-500 text-xl" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">GreenTracer Verified</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A fixed dark badge for active supporters with a verified domain. It links to the public directory profile and is disabled when entitlement or verification is inactive.</p>
        </div>
      </div>

      <h2 id="how-it-works" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        How It Works (Technically)
      </h2>
      <p className="text-lg leading-relaxed">
        The recommended badge is served from <code className="text-green-600 dark:text-green-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm">api.greentracer.org</code>. GreenTracer generates public badge URLs automatically and links each badge to the appropriate report or directory page.
      </p>
      <p className="text-lg leading-relaxed">
        The browser loads a small public badge and a lightweight install ping. There is no API key in the page and no private account or billing data exposed.
      </p>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">How the badge loads</div>
        <div className="p-5">
          <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{`<div
  class="greentrace-badge"
  data-public-token="gtb_xxxxx"
  data-domain="yourdomain.com"
  data-badge-type="greentracer_verified"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" async></script>`}</pre>
        </div>
      </div>

      <h2 id="adding-badge" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Adding the Badge in 3 Minutes
      </h2>
      <p className="text-lg leading-relaxed">
        Embedding the badge takes two steps: activate a verified badge record for your site, then copy the generated snippet from your dashboard.
      </p>
      <ol className="space-y-4 list-decimal list-inside text-lg leading-relaxed">
        <li><strong>Verify your site</strong> — use your GreenTracer account and verification flow to activate the badge for your domain.</li>
        <li><strong>Copy the snippet</strong> — visit your dashboard and copy the generated code.</li>
        <li><strong>Paste into your HTML</strong> — anywhere in your page body, typically the footer.</li>
      </ol>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">Embed snippet</div>
        <div className="p-5">
          <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{`<div
  class="greentrace-badge"
  data-public-token="gtb_xxxxx"
  data-domain="yourdomain.com"
  data-badge-type="greentracer_verified"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" async></script>`}</pre>
        </div>
      </div>

      <h2 id="customisation" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Badge Design
      </h2>
      <p className="text-lg leading-relaxed">
        The badge families share the same compact design system, but the labels stay specific so a free report badge never implies paid verification.
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
