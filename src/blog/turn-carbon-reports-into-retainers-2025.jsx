import React from "react";
import { FaChartLine, FaFileAlt, FaHandshake, FaLeaf, FaShieldAlt, FaSyncAlt } from "react-icons/fa";

export const meta = {
  title: "Turn Carbon Reports Into Monthly Retainers: A Smarter Sustainability Offer for 2025",
  author: "Sol Rudd",
  date: "2025-08-28",
  readingMinutes: 5,
  tags: ["Agency", "Reporting", "GreenTracer", "Commercial"],
  slug: "turn-carbon-reports-into-retainers-2025",
  image: "/assets/blog/report-retainer-2025.png",
  imageAvif: "/assets/blog/report-retainer-2025.png",
  excerpt:
    "A one-off sustainability report is useful. A recurring reporting rhythm is a product. This is how agencies can turn carbon reporting into a retained service clients keep renewing.",
};

export const toc = [
  { id: "intro", text: "Why one-off reports stall", level: 2 },
  { id: "retainer-model", text: "What a retained offer looks like", level: 2 },
  { id: "monthly-stack", text: "The monthly reporting stack", level: 2 },
  { id: "client-language", text: "How to position it to clients", level: 2 },
  { id: "close", text: "Where GreenTracer fits", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">
      <p
        id="intro"
        className="text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-greenbuzz dark:first-letter:text-green-400"
      >
        The problem with a one-off website carbon report is that it often dies in the inbox. A client reads the score,
        agrees the site should improve, then moves on to a launch, campaign, or redesign deadline. If you want
        sustainability work to stick, it needs a cadence. That is why the stronger commercial offer is not a report on
        its own. It is a monthly reporting and verification layer the client keeps coming back to.
      </p>

      <h2 id="retainer-model" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What a retained offer looks like
      </h2>
      <p className="text-lg leading-relaxed">
        A retained sustainability offer should feel like an operating layer, not a PDF. The client needs a baseline,
        a visible status signal, and a rhythm of checks tied to changes on the site. Once those three pieces exist, the
        work stops feeling experimental and starts feeling like governance.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaChartLine className="mb-3 text-xl text-emerald-500" />
          <p className="font-bold text-slate-900 dark:text-white">Baseline report</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Start with a clear carbon number, a percentile, and hosting status the client can understand immediately.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaShieldAlt className="mb-3 text-xl text-blue-500" />
          <p className="font-bold text-slate-900 dark:text-white">Verification layer</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Give them a badge, a status page, or an active verification marker they can publish.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaSyncAlt className="mb-3 text-xl text-violet-500" />
          <p className="font-bold text-slate-900 dark:text-white">Review rhythm</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Reassess after campaigns, uploads, design changes, and infrastructure moves instead of once a year.
          </p>
        </div>
      </div>

      <h2 id="monthly-stack" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        The monthly reporting stack
      </h2>
      <div className="space-y-4">
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaLeaf className="mt-1 text-xl text-green-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">1. Fresh scan</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Re-run the site and compare the headline carbon output against the last accepted baseline.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaFileAlt className="mt-1 text-xl text-blue-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">2. Narrative summary</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Explain what changed, why it matters commercially, and what the next highest-impact action is.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaHandshake className="mt-1 text-xl text-amber-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">3. Client-facing status</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Keep the badge or verification page aligned with the latest approved state so the client can publish with confidence.
            </p>
          </div>
        </div>
      </div>

      <h2 id="client-language" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        How to position it to clients
      </h2>
      <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-8 dark:border-green-800/30 dark:from-green-900/20 dark:to-emerald-900/20">
        <p className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <FaHandshake className="text-green-600 dark:text-green-400" />
          Sell continuity, not guilt.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Clients respond better to a promise of maintained trust, lighter websites, and a cleaner public sustainability
          story than to a vague warning about emissions. The retainer works when it sounds like brand protection and
          operational clarity.
        </p>
      </div>

      <h2 id="close" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        Where GreenTracer fits
      </h2>
      <p className="text-lg leading-relaxed">
        GreenTracer is useful here because it gives the agency both sides of the offer: the free or lightweight entry
        point that gets the first report in front of a client, and the trust infrastructure that turns that report into
        a recurring managed service.
      </p>
    </div>
  );
}
