import React from "react";
import { FaChartLine, FaEnvelope, FaFileAlt, FaLeaf, FaSearchDollar, FaUsers } from "react-icons/fa";

export const meta = {
  title: "Website Carbon Reports for Sales Teams: Turning a Scan Into a Commercial Conversation",
  author: "Sol Rudd",
  date: "2026-04-09",
  readingMinutes: 4,
  tags: ["Reporting", "Sales", "GreenTracer", "Sustainability"],
  slug: "website-carbon-reports-for-sales-teams-2026",
  image: "/assets/blog/reports-for-sales-2026.webp",
  imageAvif: "/assets/blog/reports-for-sales-2026.webp",
  excerpt:
    "A carbon scan becomes commercially useful when it gives a team something concrete to talk about. That means clearer reports, clearer outreach, and a visible next step.",
};

export const toc = [
  { id: "intro", text: "Why a scan alone is not enough", level: 2 },
  { id: "reporting", text: "What a usable report needs", level: 2 },
  { id: "outreach", text: "How outreach gets easier", level: 2 },
  { id: "handoff", text: "The handoff from insight to action", level: 2 },
  { id: "closing", text: "What GreenTracer should emphasize", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">
      <p
        id="intro"
        className="text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-greenbuzz dark:first-letter:text-green-400"
      >
        Most scan tools stop at the moment of diagnosis. The site is heavy, the hosting is not green, the score is
        average, and that is the end of the interaction. But if you are trying to build a commercial sustainability
        product, that is not enough. The report has to help someone move from &quot;interesting&quot; to &quot;we should do
        something about this&quot;.
      </p>

      <h2 id="reporting" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What a usable report needs
      </h2>
      <p className="text-lg leading-relaxed">
        A report is commercially useful when it is short enough to scan, concrete enough to trust, and specific enough
        to act on. That means a clean carbon number, a percentile, a hosting state, and a visible next step.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaFileAlt className="mb-3 text-xl text-green-500" />
          <p className="font-bold text-slate-900 dark:text-white">Good report trait</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Someone can understand the result in under a minute and share it internally.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaChartLine className="mb-3 text-xl text-blue-500" />
          <p className="font-bold text-slate-900 dark:text-white">Better report trait</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            It also makes the next action obvious, whether that is badge setup, hosting review, or paid verification.
          </p>
        </div>
      </div>

      <h2 id="outreach" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        How outreach gets easier
      </h2>
      <p className="text-lg leading-relaxed">
        Outreach is much easier when the prospect has already generated the report. Instead of a cold pitch, the
        conversation starts from a known result tied to their own domain. That changes tone immediately.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-green-50 p-8 dark:border-slate-700 dark:from-slate-900/60 dark:to-green-900/10">
        <p className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <FaEnvelope className="text-green-600 dark:text-green-400" />
          The email capture matters because it turns a public utility into a follow-up path.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Once the user submits the scan with a valid email and consent, GreenTracer has a legitimate path to send the
          report context, explain the badge options, and follow up with a paid verification offer.
        </p>
      </div>

      <h2 id="handoff" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        The handoff from insight to action
      </h2>
      <div className="space-y-4">
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaSearchDollar className="mt-1 text-xl text-violet-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Scan</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Establish the baseline and capture the domain plus contact details.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaUsers className="mt-1 text-xl text-blue-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Review</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Show the carbon score, hosting status, and the strongest commercial interpretation of the result.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaLeaf className="mt-1 text-xl text-emerald-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Act</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Move the user toward badge adoption, verification, or a deeper sustainability review.
            </p>
          </div>
        </div>
      </div>

      <h2 id="closing" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What GreenTracer should emphasize
      </h2>
      <p className="text-lg leading-relaxed">
        The stronger story is not just &quot;we analyze your site&quot;. It is &quot;we give you a report that can drive trust,
        outreach, and verification&quot;. That is the difference between a handy tool and a commercial platform.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <a href="/" className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5 no-underline transition-colors hover:border-green-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-green-600">
          <FaLeaf className="mt-1 text-xl text-green-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Generate a report</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Start with a live result that can become the basis of a follow-up conversation.
            </p>
          </div>
        </a>
        <a href="/pricing" className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5 no-underline transition-colors hover:border-green-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-green-600">
          <FaFileAlt className="mt-1 text-xl text-green-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">See the paid path</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Move from a free report into verification, licensing, and the commercial layer you control directly.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
