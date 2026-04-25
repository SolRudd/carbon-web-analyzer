import React from "react";
import { FaServer, FaLeaf, FaShieldAlt, FaGlobe, FaChartLine, FaBolt } from "react-icons/fa";

export const meta = {
  title: "Why Green Hosting Matters: The Carbon Cost of Data Centres",
  author: "Sol Rudd",
  date: "2025-07-22",
  readingMinutes: 4,
  tags: ["Green Hosting", "Data Centres", "Carbon Reduction", "Web Sustainability"],
  slug: "plastic-climate-crisis",
  image: "/assets/blog/plastic-climate.webp",
  imageAvif: "/assets/blog/plastic-climate.avif",
  excerpt: "Data centres consume roughly 1–2% of global electricity. Whether that power is renewable or fossil-fuelled determines whether your website is part of the problem or part of the solution.",
};

export const toc = [
  { id: "intro", text: "The Infrastructure Behind Every Page Load", level: 2 },
  { id: "scale", text: "Data Centre Energy: The Numbers", level: 2 },
  { id: "what-is-green", text: "What 'Green Hosting' Actually Means", level: 2 },
  { id: "how-to-check", text: "How to Check If Your Host Is Green", level: 2 },
  { id: "impact-on-score", text: "Impact on Your GreenTracer Score", level: 2 },
  { id: "top-green-hosts", text: "Hosting Providers with Green Credentials", level: 2 },
  { id: "moving-host", text: "Is It Worth Switching Host?", level: 2 },
  { id: "beyond-hosting", text: "Beyond Hosting: The Full Picture", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">

      <p id="intro" className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        Every time someone visits your website, data travels from a server to their device. That server lives in a data centre — a building filled with computers, cooling systems, and power infrastructure. Where that electricity comes from, and how efficiently it's used, has a direct bearing on the carbon footprint of every page your site serves. Most website owners give this no thought. They probably should.
      </p>

      <h2 id="scale" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Data Centre Energy: The Numbers
      </h2>
      <p className="text-lg leading-relaxed">
        Global data centres consumed an estimated 200–250 TWh of electricity in 2023 — roughly equivalent to the entire annual electricity consumption of the United Kingdom. That figure has been growing year-on-year as cloud services, streaming, and AI workloads expand. The internet as a whole accounts for approximately 2–4% of global CO₂ emissions, depending on the methodology used, and data centres sit at the heart of that number.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-3xl font-bold text-red-500 dark:text-red-400 mb-2">~200–250 TWh</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Global data centre electricity consumption per year</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-3xl font-bold text-orange-500 dark:text-orange-400 mb-2">2–4%</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Share of global CO₂ emissions attributed to the internet</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">Up to 25%</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Carbon reduction for sites on verified green hosting (GreenTracer model)</p>
        </div>
      </div>

      <h2 id="what-is-green" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        What "Green Hosting" Actually Means
      </h2>
      <p className="text-lg leading-relaxed">
        The term is used loosely, so it's worth unpacking. True green hosting means the electricity powering the data centre comes from renewable sources — solar, wind, or hydro — either directly through a power purchase agreement (PPA), or offset through renewable energy certificates (RECs).
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaBolt className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Direct renewable energy (best)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Data centre is physically powered by on-site or locally sourced wind/solar. The electrons are genuinely clean. Google and Microsoft's major European facilities work this way.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaLeaf className="text-green-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Renewable Energy Certificates (good)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The host buys certificates that prove renewable electricity was added to the grid in proportion to what they consumed. Less direct but still meaningful.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaServer className="text-red-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Carbon offsets only (marketing)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Some hosts claim to be "carbon neutral" through offset purchases alone. This doesn't reduce actual emissions — it's a financial instrument, not an energy decision. Treat these claims with scepticism.</p>
          </div>
        </div>
      </div>

      <h2 id="how-to-check" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        How to Check If Your Host Is Green
      </h2>
      <p className="text-lg leading-relaxed">
        The most reliable independent source is the <strong>Green Web Foundation</strong>, a Dutch non-profit that maintains a database of hosting providers verified to use renewable energy. GreenTracer checks every site against this database automatically as part of every scan.
      </p>
      <p className="text-lg leading-relaxed">
        When you run a scan on GreenTracer, the result clearly shows whether your hosting provider is green-verified. If it is, your result page shows "Green Hosting Verified" and you're eligible to display the hosting badge. If it isn't, the report will flag this as an area for improvement.
      </p>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl p-6">
        <p className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
          <FaShieldAlt /> How GreenTracer verifies hosting
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          GreenTracer queries the Green Web Foundation API for the hostname of your site during each carbon scan. The result is cached alongside your carbon data. The hosting badge in your embed snippet only renders if the cached result shows your host is green — there's no manual approval required, and no way to fake it.
        </p>
      </div>

      <h2 id="impact-on-score" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Impact on Your GreenTracer Score
      </h2>
      <p className="text-lg leading-relaxed">
        In GreenTracer's carbon calculation, green hosting reduces the data centre energy component by approximately 25% — which translates to roughly an 8–12% overall reduction in your site's carbon score, depending on your page weight. It won't move you from an F to an A on its own, but it's a meaningful and easy win that stacks with other optimisations.
      </p>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Carbon calculation: hosting impact</p>
        </div>
        <div className="p-5 space-y-3 font-mono text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Non-green host, 2MB page:</span>
            <span className="text-red-500">~0.48g CO₂</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Green host, same 2MB page:</span>
            <span className="text-green-500">~0.42g CO₂</span>
          </div>
          <div className="flex justify-between text-slate-700 dark:text-slate-300 font-semibold border-t border-slate-200 dark:border-slate-700 pt-3">
            <span>Reduction:</span>
            <span className="text-green-500">~12.5%</span>
          </div>
        </div>
      </div>

      <h2 id="top-green-hosts" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Hosting Providers with Green Credentials
      </h2>
      <p className="text-lg leading-relaxed">
        The following major providers appear in the Green Web Foundation's verified database for their primary data centre locations. This is not an exhaustive list, and verification status can change — always check your specific hosting region.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          { name: "Google Cloud (europe-west)", detail: "100% renewable match + direct PPAs" },
          { name: "Amazon AWS (eu-west regions)", detail: "RE100 commitment, regional variation" },
          { name: "Hetzner (Germany/Finland)", detail: "Hydroelectric-powered, GWF verified" },
          { name: "Cloudflare Pages", detail: "Renewable-matched CDN edge network" },
          { name: "Vercel (EU regions)", detail: "Built on AWS, renewable matched" },
          { name: "Krystal Hosting (UK)", detail: "100% renewable, UK-based" },
        ].map(h => (
          <div key={h.name} className="flex gap-3 p-4 bg-white dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <FaLeaf className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{h.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{h.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="moving-host" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Is It Worth Switching Host?
      </h2>
      <p className="text-lg leading-relaxed">
        For most sites the answer is: eventually yes, but not at the expense of performance or reliability. A fast, well-optimised site on a non-green host often has a lower total carbon score than a slow, heavy site on a green host. The biggest carbon lever on most websites is still page weight — reducing transfer size through better images, leaner JS, and efficient caching has a larger impact than hosting alone.
      </p>
      <p className="text-lg leading-relaxed">
        That said, if you're already optimising load times and performance, switching to a green host is the next natural step. Many modern developer-friendly providers — Vercel, Netlify, Hetzner — are green by default without any premium or configuration required.
      </p>

      <h2 id="beyond-hosting" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Beyond Hosting: The Full Picture
      </h2>
      <p className="text-lg leading-relaxed">
        Hosting is one component in GreenTracer's three-factor model: data centre energy, network transmission, and end-user device consumption. Green hosting addresses only the first. The other two — how much data you send and how long the user's device works to render it — are determined by your code, assets, and architecture. GreenTracer measures all three together to give you a single, comparable score.
      </p>
      <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
        <FaChartLine className="text-green-500 text-xl flex-shrink-0 mt-1" />
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          Run a scan on <a href="/" className="text-green-600 dark:text-green-400 underline underline-offset-2">GreenTracer</a> to see exactly how your site scores across all three components — and whether your host is green-verified today.
        </p>
      </div>

    </div>
  );
}
