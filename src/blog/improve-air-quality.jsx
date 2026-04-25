import React from "react";
import { FaChartLine, FaLeaf, FaBolt, FaServer, FaGlobe, FaRocket } from "react-icons/fa";

export const meta = {
  title: "From A+ to F: Understanding GreenTracer's Carbon Grading System",
  author: "Sol Rudd",
  date: "2025-06-28",
  readingMinutes: 5,
  tags: ["Carbon Grading", "Web Performance", "Metrics", "GreenTracer"],
  slug: "improve-air-quality",
  image: "/assets/blog/air-quality.webp",
  imageAvif: "/assets/blog/air-quality.avif",
  excerpt: "GreenTracer assigns every website a carbon grade from A+ to F. Here's exactly what each grade means, how the score is calculated, and what the most effective steps are to move up the table.",
};

export const toc = [
  { id: "intro", text: "Why Grade Carbon at All?", level: 2 },
  { id: "grade-table", text: "The Grade Table", level: 2 },
  { id: "calculation", text: "How the Score Is Calculated", level: 2 },
  { id: "three-factors", text: "The Three Carbon Factors", level: 2 },
  { id: "percentile", text: "Percentile vs Grade", level: 2 },
  { id: "common-scores", text: "What Most Sites Score", level: 2 },
  { id: "improve", text: "How to Improve Your Grade", level: 2 },
  { id: "tools", text: "Using GreenTracer to Track Progress", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">

      <p id="intro" className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        Carbon emissions are abstract. "Your site produces 0.62 grams of CO₂ per page view" means something to engineers who've spent time reading the literature. To everyone else, it means nothing. The grade system exists to bridge that gap — to translate a complex, multi-factor calculation into a single, immediately understandable signal. A site graded A is genuinely efficient. One graded F has serious work to do.
      </p>

      <h2 id="grade-table" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        The Grade Table
      </h2>
      <p className="text-lg leading-relaxed">
        GreenTracer uses six grades, derived from CO₂ per page view in grams, measured at the median visit (transfer size only, not cached subsequent loads):
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Grade</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">CO₂ per view</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">What this looks like</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { grade: "A+", co2: "≤ 0.095g", desc: "Highly optimised static sites, minimal JS, compressed assets, green hosting. Exceptional.", color: "text-emerald-600 dark:text-emerald-400" },
              { grade: "A",  co2: "≤ 0.186g", desc: "Well-built sites with good asset practices. Better than the large majority of the web.", color: "text-green-600 dark:text-green-400" },
              { grade: "B",  co2: "≤ 0.341g", desc: "Average-to-good. Competent development with some room for improvement.", color: "text-lime-600 dark:text-lime-400" },
              { grade: "C",  co2: "≤ 0.493g", desc: "Below average. Likely carrying some bloated JS or unoptimised images.", color: "text-yellow-600 dark:text-yellow-400" },
              { grade: "D",  co2: "≤ 0.656g", desc: "Noticeably heavy. Multiple clear optimisation opportunities.", color: "text-orange-600 dark:text-orange-400" },
              { grade: "E",  co2: "≤ 0.846g", desc: "Significantly inefficient. Large pages, likely uncompressed assets and render-blocking scripts.", color: "text-red-500 dark:text-red-400" },
              { grade: "F",  co2: "> 0.846g", desc: "Worst tier. Unusually large pages or very heavy runtimes. Immediate action warranted.", color: "text-red-700 dark:text-red-300 font-bold" },
            ].map(row => (
              <tr key={row.grade} className="bg-white dark:bg-transparent">
                <td className={`px-5 py-3 font-bold text-lg ${row.color}`}>{row.grade}</td>
                <td className="px-5 py-3 font-mono text-slate-700 dark:text-slate-300">{row.co2}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="calculation" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        How the Score Is Calculated
      </h2>
      <p className="text-lg leading-relaxed">
        GreenTracer uses the Sustainable Web Design Model (SWDM), a methodology developed by Wholegrain Digital and the Green Web Foundation. The formula converts page transfer size — measured via Google PageSpeed Insights — into kilowatt-hours, then into grams of CO₂.
      </p>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">Carbon calculation (simplified)</div>
        <div className="p-5">
          <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{`// Input: page transfer size in megabytes
const gb = sizeMB / 1024;

// Three energy segments (kWh/GB)
const datacenterKwh = gb * 0.06 * (isGreenHost ? 0.75 : 1);
const networkKwh    = gb * 0.014;
const deviceKwh     = gb * 0.123;

const totalKwh = datacenterKwh + networkKwh + deviceKwh;

// Global average: 442g CO₂ per kWh
const carbonGrams = totalKwh * 442;`}</pre>
        </div>
      </div>

      <p className="text-lg leading-relaxed">
        The page weight is measured using both desktop and mobile PageSpeed Insights runs, taking the higher of the two transfer sizes to ensure the score reflects the worst-case visitor experience. If PageSpeed data is unavailable, GreenTracer falls back to a direct HTML size estimate.
      </p>

      <h2 id="three-factors" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        The Three Carbon Factors
      </h2>
      <div className="space-y-4">
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaServer className="text-blue-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Data centre energy (0.06 kWh/GB)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Energy used to serve your files from the host server. Reduced by ~25% if your host uses verified renewable energy. This is where green hosting has its effect.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaGlobe className="text-indigo-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Network transmission (0.014 kWh/GB)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Energy used by routers, switches, and exchanges to carry data across the internet. Smaller than the other two but still influenced by transfer size.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaBolt className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">End-user device (0.123 kWh/GB)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Energy consumed by the visitor's device to download, parse, and render your page. This is the largest single factor — and the most directly impacted by your JavaScript bundle size.</p>
          </div>
        </div>
      </div>

      <h2 id="percentile" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Percentile vs Grade
      </h2>
      <p className="text-lg leading-relaxed">
        Alongside the letter grade, GreenTracer shows your percentile: "Cleaner than X% of pages tested." These two numbers communicate different things.
      </p>
      <p className="text-lg leading-relaxed">
        The <strong>grade</strong> is an absolute threshold — a site either is or isn't below 0.186g CO₂/view for an A. The <strong>percentile</strong> is relative — it tells you how you compare to the real-world distribution of sites GreenTracer has analysed. A site scoring 0.35g CO₂ (grade B) might rank in the 65th percentile, meaning it's lighter than 65% of sites — because the web median is significantly heavier than people expect.
      </p>

      <h2 id="common-scores" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        What Most Sites Score
      </h2>
      <p className="text-lg leading-relaxed">
        Based on GreenTracer's analysis data, the majority of commercial websites score in the C–E range. Marketing sites and content platforms — with their large hero images, embedded video, and heavy JavaScript frameworks — are frequent D and E scorers. Lean documentation sites, portfolios, and text-first blogs often reach A or A+.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-2xl font-bold text-emerald-500 mb-1">A / A+</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Lean docs sites, static blogs, portfolios. No heavy frameworks, minimal JS.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-2xl font-bold text-yellow-500 mb-1">B / C</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Typical React/Next.js apps. Competent but opportunity remains with asset optimisation.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-2xl font-bold text-red-500 mb-1">D / E / F</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise marketing sites, e-commerce, heavy CMSs with unoptimised assets.</p>
        </div>
      </div>

      <h2 id="improve" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        How to Improve Your Grade
      </h2>
      <p className="text-lg leading-relaxed">
        The dominant variable in almost every carbon score is <strong>transfer size</strong>. Every byte you remove is a linear reduction in carbon. Here are the highest-leverage actions, roughly ordered by impact:
      </p>
      <ol className="space-y-3 list-decimal list-inside text-base leading-relaxed">
        <li><strong>Optimise and compress images</strong> — convert to WebP/AVIF, add proper dimensions, lazy-load off-screen images. Images are the single largest contributor to transfer size on most sites.</li>
        <li><strong>Reduce JavaScript bundle size</strong> — audit with Lighthouse, remove unused dependencies, use code splitting. JS is the largest contributor to device-side energy consumption.</li>
        <li><strong>Enable effective caching</strong> — long cache TTLs on static assets mean returning visitors consume near-zero transfer. Not reflected in GreenTracer's first-visit metric but reduces real-world emissions substantially.</li>
        <li><strong>Use a green host</strong> — verified renewable energy gives an automatic 8–12% reduction in your carbon score with zero code changes required.</li>
        <li><strong>Serve via a CDN</strong> — edge nodes reduce network transmission distance and energy. Most modern deployment platforms (Vercel, Netlify, Cloudflare) do this automatically.</li>
        <li><strong>Remove third-party scripts</strong> — chat widgets, A/B testing tools, ad networks, and analytics scripts all add transfer weight and execution cost. Audit and remove anything you're not actively using.</li>
      </ol>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-7 border border-green-100 dark:border-green-800/30">
        <p className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
          <FaLeaf /> Realistic improvement expectations
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          A focused optimisation effort — images converted to WebP, JS bundle reduced by 30%, green hosting enabled — can typically move a site one to two grade levels. A poorly optimised 4MB page can often reach 1MB with targeted effort, shifting from an E to a B or better.
        </p>
      </div>

      <h2 id="tools" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Using GreenTracer to Track Progress
      </h2>
      <p className="text-lg leading-relaxed">
        Every time you run a scan, GreenTracer saves the result. You can scan your site before and after an optimisation sprint to measure exactly how much carbon you've saved per page view. The badge in your footer then automatically reflects the updated score.
      </p>
      <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
        <FaRocket className="text-green-500 text-xl flex-shrink-0 mt-1" />
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <a href="/" className="text-green-600 dark:text-green-400 underline underline-offset-2 font-medium">Run your first scan</a> — enter your URL on the GreenTracer homepage to get your current grade, percentile, Lighthouse scores, and green hosting status in under 30 seconds.
        </p>
      </div>

    </div>
  );
}
