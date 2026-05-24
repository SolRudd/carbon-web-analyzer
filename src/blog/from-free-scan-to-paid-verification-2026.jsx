import React from "react";
import { FaBolt, FaCertificate, FaCreditCard, FaLeaf, FaShieldAlt, FaSyncAlt } from "react-icons/fa";

export const meta = {
  title: "From Free Scan to Paid Verification: Designing a Sustainability Product People Will Buy",
  author: "Sol Rudd",
  date: "2026-04-16",
  readingMinutes: 6,
  tags: ["Pricing", "Verification", "Digital Carbon", "Product"],
  slug: "from-free-scan-to-paid-verification-2026",
  image: "/assets/blog/free-to-paid-verification-2026.webp",
  imageAvif: "/assets/blog/free-to-paid-verification-2026.webp",
  excerpt:
    "A free scan gets attention, but paid verification gets commitment. The jump from free utility to paid sustainability product depends on proof, workflow, and repeat value.",
};

export const toc = [
  { id: "intro", text: "Why free is not the product", level: 2 },
  { id: "conversion-gap", text: "The conversion gap", level: 2 },
  { id: "paid-layer", text: "What the paid layer must include", level: 2 },
  { id: "licensing", text: "Why licensing matters", level: 2 },
  { id: "renewal", text: "The annual renewal logic", level: 2 },
  { id: "closing", text: "A stronger GreenTracer offer", level: 2 },
];

export default function Post() {
  return (
    <div className="space-y-10">
      <p
        id="intro"
        className="text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-greenbuzz dark:first-letter:text-green-400"
      >
        Free tools are good at earning attention. They are much worse at earning commitment. That is the core product
        challenge for sustainability software in 2026. A prospect will happily run a free website scan. The harder
        question is why they should pay after that. The answer cannot be &quot;for the same data again&quot;. It has to be
        &quot;for verification, status, workflow, and commercial credibility&quot;.
      </p>

      <h2 id="conversion-gap" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        The conversion gap
      </h2>
      <p className="text-lg leading-relaxed">
        Most free scan tools stop at insight. They tell a team whether the site looks heavy, what the carbon score is,
        and whether hosting is green. That creates curiosity, but it does not create a system of record. A buyer starts
        paying when the tool becomes something they can publish, rely on, and renew.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/30 dark:bg-amber-900/10">
          <p className="font-bold text-slate-900 dark:text-white">Free scan value</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Awareness, benchmark, instant feedback, and first-party lead capture.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800/30 dark:bg-emerald-900/10">
          <p className="font-bold text-slate-900 dark:text-white">Paid verification value</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Public trust signal, active license status, branded badge rights, and recurring reassessment.
          </p>
        </div>
      </div>

      <h2 id="paid-layer" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        What the paid layer must include
      </h2>
      <p className="text-lg leading-relaxed">
        Teams will pay when the product gives them something operational and customer-facing that the free scan does not.
        For GreenTracer, that paid layer should feel like verified status, not just extra UI.
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaCertificate className="mt-1 text-xl text-emerald-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">License-backed member badge</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              The badge should communicate that verification is active, not just that a scan once happened.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaShieldAlt className="mt-1 text-xl text-blue-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Status checks and expiry handling</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Buyers trust systems that can also say when a status has expired or been suspended.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaCreditCard className="mt-1 text-xl text-violet-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Simple paid checkout</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Payment should feel like a clean continuation of the scan flow, not a separate enterprise process.
            </p>
          </div>
        </div>
      </div>

      <h2 id="licensing" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        Why licensing matters
      </h2>
      <p className="text-lg leading-relaxed">
        A license creates a durable relationship between the product, the domain, and the trust signal shown to users.
        That is important because sustainability claims are only useful if they can be governed. Licensing lets you tie
        the domain, the badge, the renewal state, and the public verification output together.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50 p-8 dark:border-slate-700 dark:from-slate-900/60 dark:to-emerald-900/10">
        <p className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <FaLeaf className="text-green-600 dark:text-green-400" />
          Paid verification is not buying a prettier badge. It is buying a governed claim.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That distinction matters because it moves the offer from &quot;nice to have&quot; to something a marketing,
          sustainability, or operations lead can justify internally.
        </p>
      </div>

      <h2 id="renewal" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        The annual renewal logic
      </h2>
      <p className="text-lg leading-relaxed">
        Verification should renew because websites change. Design systems change. hosting changes. performance drifts.
        An annual renewal model makes sense when the product is positioned as ongoing verification, not a one-time
        certificate.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaBolt className="mb-3 text-xl text-green-500" />
          <p className="font-bold text-slate-900 dark:text-white">Year 1</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Initial scan, activation, embed, and publication.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaSyncAlt className="mb-3 text-xl text-blue-500" />
          <p className="font-bold text-slate-900 dark:text-white">During term</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Status remains live while the license is active.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <FaCreditCard className="mb-3 text-xl text-violet-500" />
          <p className="font-bold text-slate-900 dark:text-white">Renewal</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Continue the claim with an active payment-backed status.</p>
        </div>
      </div>

      <h2 id="closing" className="border-l-4 border-green-500 pl-4 text-3xl font-bold text-slate-900 dark:text-white">
        A stronger GreenTracer offer
      </h2>
      <p className="text-lg leading-relaxed">
        The commercial path is clear: free scan for discovery, paid verification for publishing and trust, and renewal
        for continuity. That is a much stronger product story than &quot;pay to unlock the badge&quot;. It explains the value in
        a way buyers can understand.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <a href="/pricing" className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5 no-underline transition-colors hover:border-green-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-green-600">
          <FaCreditCard className="mt-1 text-xl text-green-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">See the pricing path</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Review how the paid badge flow should translate into a simple buyer decision.
            </p>
          </div>
        </a>
        <a href="/license-status" className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5 no-underline transition-colors hover:border-green-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-green-600">
          <FaCertificate className="mt-1 text-xl text-green-500" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Check the status flow</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              This is where trust and payment logic start to come together.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
