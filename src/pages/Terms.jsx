import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, FileText, Scale, ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";

const termsSections = [
  {
    title: "Use of GreenTracer",
    icon: FileText,
    body: [
      "GreenTracer provides website sustainability scans, public report pages, report-backed badges, and account tools for managing verified badge status.",
      "You are responsible for submitting URLs and domains you are authorized to test or manage. Public reports may be visible to anyone with the result URL.",
    ],
  },
  {
    title: "Badge Claims",
    icon: BadgeCheck,
    body: [
      "Carbon Result and Green Hosting badges are free public badges backed by saved report data. They must not be used to imply paid verification, membership, or broader environmental claims.",
      "GreenTracer Verified is a paid or manually approved supporter/member badge controlled by account, licence, and domain state. It does not represent a perfect carbon score.",
    ],
  },
  {
    title: "Open Methodology",
    icon: ShieldCheck,
    body: [
      "GreenTracer publishes selected methodology and scoring assumptions so results can be understood and questioned.",
      "Operational infrastructure, API keys, rate limits, and private systems remain protected. GreenTracer is operated by BuzzBoost Ltd and may offer paid hosted tools, verification, partnerships, or enterprise services in future.",
    ],
  },
  {
    title: "Subscriptions and Licences",
    icon: Scale,
    body: [
      "Paid plans are expected to control verified badge rights, dashboard licence state, and future directory/profile visibility. Subscription billing and lifecycle behavior will be governed by the checkout and billing terms presented at purchase.",
      "Inactive, expired, suspended, or cancelled licences may disable verified badge eligibility while leaving free public report badges unaffected.",
    ],
  },
  {
    title: "Accuracy and Availability",
    icon: ShieldCheck,
    body: [
      "Carbon results are modelled estimates based on measurable inputs and published assumptions. They are useful for comparison and prioritization but are not an exact footprint, regulatory audit, or full lifecycle assessment.",
      "GreenTracer may change, suspend, or limit parts of the service to protect reliability, security, or product integrity.",
    ],
  },
];

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Terms"
        description="GreenTracer terms for scans, public reports, free badges, verified badges, subscriptions, and responsible use."
        imageUrl="https://www.greentracer.org/GreenFavi.png"
        canonicalUrl="https://www.greentracer.org/terms"
      />

      <div className="min-h-screen bg-slate-100/70 text-slate-900 dark:bg-[#020f1e] dark:text-white">
        <section className="border-b border-slate-200 bg-white px-4 pb-12 pt-28 dark:border-slate-900 dark:bg-[#020f1e] sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              <Scale size={13} aria-hidden="true" />
              Legal
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl">
              Terms
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              These terms outline the intended use of GreenTracer scans, public reports, free badges, verified badges, and licence-controlled features.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: April 26, 2026</p>
          </div>
        </section>

        <main className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {termsSections.map(({ title, icon: Icon, body }) => (
              <section key={title} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300">
                    {React.createElement(Icon, { size: 17, "aria-hidden": true })}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.01em] text-slate-950 dark:text-white">{title}</h2>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Contact</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                For questions about these terms, contact support@greentracer.org.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/privacy" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  View privacy policy
                </Link>
                <Link to="/faq" className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                  Read FAQ
                </Link>
              </div>
            </section>

            <div className="py-5">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300">
                <ArrowLeft size={15} aria-hidden="true" />
                Back to homepage
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
