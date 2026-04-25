import React from "react";
import { FaBolt, FaBullseye, FaChartLine, FaLeaf, FaListUl, FaServer } from "react-icons/fa";

export const meta = {
  title: "What a Website Sustainability Calculator Should Show in 2026",
  author: "Sol Rudd",
  date: "2026-03-12",
  readingMinutes: 5,
  tags: ["Calculator", "Reporting", "GreenTracer", "Product"],
  slug: "what-a-website-sustainability-calculator-should-show-2026",
  image: "/assets/blog/calculator-signals-2026.png",
  imageAvif: "/assets/blog/calculator-signals-2026.png",
  excerpt:
    "A calculator is only useful if the result is actionable. In 2026, teams expect a website sustainability tool to show more than a single carbon number.",
};

export const toc = [
  { id: "intro", text: "The calculator is not the product", level: 2 },
  { id: "headline", text: "The headline signals users expect", level: 2 },
  { id: "actionable", text: "What makes a result actionable", level: 2 },
  { id: "commercial", text: "Where the commercial layer starts", level: 2 },
  { id: "close", text: "What GreenTracer should keep doing", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">
      <p
        id="intro"
        className="text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-greenbuzz dark:first-letter:text-green-400"
      >
        A website sustainability calculator gets attention because it answers a clear question fast. But a single
        number is not enough anymore. By 2026, users expect a calculator to tell them what the number means, how it
        compares, whether the hosting setup helps or hurts, and what they should do next. That is where a good tool
        stops feeling like a novelty and starts feeling like infrastructure.
      </p>

      <h2 id="headline" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        The headline signals users expect
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaLeaf className="mb-3 text-xl text-green-500" />
          <p className="font-bold text-slate-900 dark:text-white">CO2 per page view</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            The carbon number still matters because it is the fastest way to anchor the result.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaChartLine className="mb-3 text-xl text-blue-500" />
          <p className="font-bold text-slate-900 dark:text-white">Relative grade or percentile</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Teams need context so they can tell whether the number is strong, average, or weak.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaServer className="mb-3 text-xl text-violet-500" />
          <p className="font-bold text-slate-900 dark:text-white">Hosting verification</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Hosting matters because infrastructure credibility changes how a sustainability claim is received.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaBullseye className="mb-3 text-xl text-amber-500" />
          <p className="font-bold text-slate-900 dark:text-white">Clear next step</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            The best calculators do not stop at diagnosis. They point toward improvement, verification, or publication.
          </p>
        </div>
      </div>

      <h2 id="actionable" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What makes a result actionable
      </h2>
      <p className="text-lg leading-relaxed">
        Actionable means the person reading the result knows what to do next without hunting for another explanation.
        That usually requires a short interpretation layer: what is driving the footprint, whether the host helps, and
        which change would improve the result fastest.
      </p>

      <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-8 dark:border-green-800/30 dark:from-green-900/20 dark:to-emerald-900/20">
        <p className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <FaListUl className="text-green-600 dark:text-green-400" />
          Users do not just want a score. They want a decision.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The calculator should help them decide whether to optimize assets, review hosting, publish a badge, or move
          into a paid verification step.
        </p>
      </div>

      <h2 id="commercial" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        Where the commercial layer starts
      </h2>
      <p className="text-lg leading-relaxed">
        The calculator wins top-of-funnel attention, but the commercial layer begins when the result becomes something
        a team can save, share, and stand behind publicly. That is where status pages, badges, licensing, and renewed
        verification start to matter.
      </p>

      <h2 id="close" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What GreenTracer should keep doing
      </h2>
      <p className="text-lg leading-relaxed">
        GreenTracer is strongest when the calculator remains fast and clear, while the product around it helps teams
        turn a scan into a trust signal. That combination is much more valuable than a calculator that produces a score
        and leaves the user stranded.
      </p>
    </div>
  );
}
