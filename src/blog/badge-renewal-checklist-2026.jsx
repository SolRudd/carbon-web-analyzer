import React from "react";
import { FaBolt, FaCalendarAlt, FaCertificate, FaClock, FaShieldAlt, FaSyncAlt } from "react-icons/fa";

export const meta = {
  title: "The 2026 Badge Renewal Checklist: Keeping Your Verification Signal Trustworthy",
  author: "Sol Rudd",
  date: "2026-01-22",
  readingMinutes: 4,
  tags: ["Badges", "Verification", "Renewal", "GreenTracer"],
  slug: "badge-renewal-checklist-2026",
  image: "/assets/blog/badge-renewal-2026.png",
  imageAvif: "/assets/blog/badge-renewal-2026.png",
  excerpt:
    "A sustainability badge only works while the underlying claim is still current. This checklist covers what teams need to review before they renew a public verification signal.",
};

export const toc = [
  { id: "intro", text: "Why renewal matters", level: 2 },
  { id: "checklist", text: "The renewal checklist", level: 2 },
  { id: "risk", text: "What happens when status drifts", level: 2 },
  { id: "ops", text: "Make it part of operations", level: 2 },
  { id: "close", text: "Keep the signal live", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">
      <p
        id="intro"
        className="text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-greenbuzz dark:first-letter:text-green-400"
      >
        A sustainability badge is only credible while the claim behind it still reflects reality. Sites change. Teams
        add campaigns. Hosting moves. Carbon scores drift. That is why badge renewal should be treated as part of
        operations, not a yearly admin task. The point is not to make renewal feel heavy. The point is to keep the
        trust signal honest.
      </p>

      <h2 id="checklist" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        The renewal checklist
      </h2>
      <div className="space-y-4">
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaCalendarAlt className="mt-1 text-xl text-green-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Re-run the baseline scan</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Confirm the published badge still aligns with the live report and current carbon output.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaShieldAlt className="mt-1 text-xl text-blue-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Check hosting proof again</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Hosting claims are part of trust. Make sure the infrastructure still maps to the verified green-hosting state.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaCertificate className="mt-1 text-xl text-violet-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Review badge scope</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Keep the message narrow. A carbon badge should not imply wider claims than the system actually verifies.
            </p>
          </div>
        </div>
      </div>

      <h2 id="risk" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What happens when status drifts
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaClock className="mb-3 text-xl text-amber-500" />
          <p className="font-bold text-slate-900 dark:text-white">Outdated trust</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            The badge still looks active even though the published state is stale.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaBolt className="mb-3 text-xl text-red-500" />
          <p className="font-bold text-slate-900 dark:text-white">Changed performance</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Heavier pages or new scripts shift the carbon score enough to make the old badge feel misleading.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaSyncAlt className="mb-3 text-xl text-blue-500" />
          <p className="font-bold text-slate-900 dark:text-white">Broken continuity</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Teams lose the habit of checking the live status, so verification becomes decorative instead of operational.
          </p>
        </div>
      </div>

      <h2 id="ops" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        Make it part of operations
      </h2>
      <p className="text-lg leading-relaxed">
        The best way to keep renewal easy is to tie it to the moments when the site already changes: redesigns, major
        content launches, infrastructure moves, and annual reporting cycles. When the badge is reviewed alongside those
        events, the renewal process becomes normal maintenance rather than a last-minute scramble.
      </p>

      <h2 id="close" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        Keep the signal live
      </h2>
      <p className="text-lg leading-relaxed">
        A badge is strongest when it acts like a live trust layer. Renewal is how you keep that promise intact. It is
        not there to create friction. It is there to stop a public sustainability claim drifting away from the real
        website beneath it.
      </p>
    </div>
  );
}
