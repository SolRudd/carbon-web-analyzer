import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Database, Mail, ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";

const sections = [
  {
    title: "What GreenTracer Collects",
    icon: Database,
    body: [
      "For public scans, GreenTracer stores submitted website URLs, normalized domains, public report results, carbon estimates, hosting status, grades, timestamps, and the report slug needed to load result-backed badges.",
      "If you submit the public homepage or calculator form, we collect the work email and consent state you provide so we can send or follow up on the report.",
      "For account features, we store account identifiers, linked domains, licence state, badge public tokens, verification state, and badge install summaries needed to operate the dashboard.",
    ],
  },
  {
    title: "How We Use This Data",
    icon: ShieldCheck,
    body: [
      "We use scan and report data to show public result pages, generate free Carbon Result and Green Hosting badges, and support repeat dashboard scans.",
      "We use account and licence data to control GreenTracer Verified badge eligibility and to show domain, install, and licence status in the dashboard.",
      "We do not use public badge pings to build heavy analytics profiles. Badge install tracking is limited to operational fields such as declared domain, detected host, badge type, first seen, last seen, load count, and status.",
    ],
  },
  {
    title: "Cookies and Local Storage",
    icon: Cookie,
    body: [
      "GreenTracer may use essential cookies or browser storage for session, consent, and interface preferences.",
      "If analytics or performance tooling is enabled, it should be used to understand product reliability and improve the service, not to sell personal data.",
      "You can control cookies through your browser settings, though some account or preference features may not work without essential storage.",
    ],
  },
  {
    title: "Security and Retention",
    icon: ShieldCheck,
    body: [
      "We use reasonable technical and organizational safeguards for stored data. No internet service can guarantee absolute security.",
      "Public scan results may remain available so report pages and result-backed badges continue to work. Account and licence records are retained while needed to provide the service and meet operational or legal requirements.",
    ],
  },
  {
    title: "Contact",
    icon: Mail,
    body: [
      "For privacy questions, contact privacy@greentracer.org.",
      "If you want a public report or account record reviewed, include the relevant domain or report URL so we can identify the record.",
    ],
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How GreenTracer collects, uses, and protects scan, report, account, licence, and badge data."
        imageUrl="https://www.greentracer.org/GreenFavi.png"
        canonicalUrl="https://www.greentracer.org/privacy-policy"
      />

      <div className="min-h-screen bg-slate-100/70 text-slate-900 dark:bg-[#020f1e] dark:text-white">
        <section className="border-b border-slate-200 bg-white px-4 pb-12 pt-28 dark:border-slate-900 dark:bg-[#020f1e] sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              <ShieldCheck size={13} aria-hidden="true" />
              Legal
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              This policy explains how GreenTracer handles data for scans, public reports, free badges, account features, and verified badge licensing.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: April 26, 2026</p>
          </div>
        </section>

        <main className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {sections.map(({ title, icon: Icon, body }) => (
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
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Related Policies</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The cookie information above is part of this privacy policy. Commercial subscription terms and acceptable use are covered separately in the Terms page.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/terms" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  View terms
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
