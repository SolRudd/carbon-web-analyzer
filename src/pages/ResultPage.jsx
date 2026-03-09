// src/routes/ResultPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaChartLine,
  FaClipboardCheck,
  FaExternalLinkAlt,
  FaLeaf,
  FaRedo,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";

import LoadingOverlay from "../components/LoadingOverlay";
import ImpactStats from "../components/ImpactStats";
import BadgePromo from "../components/BadgePromo";
import TestCTA from "../components/TestCTA";
import CompanyInfoSection from "../components/CompanyInfoSection";
import { API_BASE } from "../config";

const INDEX_RESULTS_FLAG = String(import.meta.env.VITE_INDEX_RESULTS || "").toLowerCase() === "true";

function ErrorDisplay({ message }) {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-500">Error</h1>
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
      <Link to="/" className="underline text-green-600 dark:text-green-400 mt-6 inline-block">
        &larr; Back to Homepage
      </Link>
    </div>
  );
}

const gradeColorMap = {
  "A+": "text-emerald-500",
  A: "text-green-500",
  B: "text-lime-500",
  C: "text-yellow-500",
  D: "text-orange-500",
  E: "text-red-500",
  F: "text-red-600",
};

const getPerformanceInsight = (percentile) => {
  const pct = Number(percentile) || 0;
  if (pct >= 75) return "Strong delivery efficiency compared with tested pages.";
  if (pct >= 50) return "Moderate efficiency. There is room to improve payload and runtime costs.";
  return "Lower-than-average efficiency signal. Prioritize performance optimization opportunities.";
};

export default function ResultPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/trace-or-check?site=${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not find a report for this URL. Please try testing it from the homepage.");
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        console.error("Failed to fetch result:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorDisplay message={error} />;
  if (!result) return <ErrorDisplay message="Result data is unavailable." />;

  const shouldIndex = INDEX_RESULTS_FLAG;
  const canonical = `https://www.greentracer.org${location.pathname}`;
  const pageTitle = `Carbon Report for ${result.url} | GreenTracer`;
  const pageDescription = `An automated carbon footprint analysis for ${result.url}, showing a score of ${result.carbonEstimate}g CO₂e per page view and a grade of ${result.grade}.`;

  const testedOn = new Date(result.timestamp).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hostname = (() => {
    try {
      return new URL(result.url).hostname;
    } catch {
      return result.url || slug;
    }
  })();

  const gradeColor = gradeColorMap[result.grade] || "text-slate-500";
  const percentileValue = Math.max(0, Math.min(100, Math.round(Number(result.percentile || 0))));
  const progressAngle = Math.round((percentileValue / 100) * 360);
  const reportSchema = shouldIndex
    ? {
        "@context": "https://schema.org",
        "@type": "Report",
        name: `Website Carbon Report for ${result.url}`,
        description: pageDescription,
        url: canonical,
        author: { "@type": "Organization", name: "GreenTracer" },
        datePublished: new Date(result.timestamp).toISOString(),
      }
    : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"} />
        <meta name="googlebot" content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://www.greentracer.org/GreenFavi.png" />
        {reportSchema && <script type="application/ld+json">{JSON.stringify(reportSchema)}</script>}
      </Helmet>

      <section className="relative min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 sm:py-14 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-44 left-1/3 h-[30rem] w-[30rem] rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl space-y-14">
          <header className="rounded-[2rem] border border-slate-200/90 dark:border-slate-700/70 bg-white/92 dark:bg-slate-900/80 p-7 sm:p-9 lg:p-11 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.5)]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full border border-green-600/20 bg-green-600/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
                  <FaClipboardCheck />
                  Website Sustainability Report
                </p>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.05]">
                    {hostname}
                  </h1>
                  <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-300">
                    Latest saved analysis on {testedOn}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full border border-slate-300/80 dark:border-slate-600 bg-white/80 dark:bg-slate-900/65 px-4 py-1.5 text-sm font-semibold ${gradeColor}`}>
                    Grade {result.grade}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/70 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {Number(result.percentile || 0)}% cleaner than tested pages
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 px-6 py-5 min-w-[270px]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Carbon Intensity</p>
                    <p className="mt-1.5 text-3xl font-bold text-slate-900 dark:text-white tracking-[-0.02em]">
                      {Number(result.carbonEstimate || 0).toFixed(2)}
                      <span className="ml-1 text-lg font-semibold text-slate-500 dark:text-slate-400">g CO₂/view</span>
                    </p>
                  </div>
                  <div
                    className="grid h-[72px] w-[72px] place-items-center rounded-full border border-slate-300/80 dark:border-slate-600"
                    style={{
                      background: `conic-gradient(#16a34a ${progressAngle}deg, rgba(148,163,184,0.25) ${progressAngle}deg 360deg)`,
                    }}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-white dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {percentileValue}%
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Relative efficiency percentile</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://buzzboost.co.uk/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 transition-all duration-200"
                >
                  Book a Free Review
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={result.greenHost ? "https://buzzboost.co.uk/websites/support-plans/" : "https://buzzboost.co.uk/contact/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    result.greenHost
                      ? "border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/45"
                      : "border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/45"
                  }`}
                >
                  {result.greenHost ? "Improve This Score" : "Explore Green Hosting Upgrade"}
                  <FaArrowRight className="text-xs" />
                </a>
                <Link
                  to="/badge"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-[0_10px_28px_-16px_rgba(22,163,74,0.8)]"
                >
                  Configure Badges
                </Link>
              <button
                onClick={fetchData}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white/85 dark:bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <FaRedo className="text-xs" />
                Refresh Report
              </button>
              </div>
            </div>
          </header>

          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-slate-900 dark:text-white">
              Report Insights
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Built from currently available GreenTracer result data.
            </p>
          </section>

          <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <article className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Carbon Result</p>
              <p className="mt-2.5 text-2xl font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
                {Number(result.carbonEstimate || 0).toFixed(2)}g
              </p>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">Per page view (cached report)</p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{percentileValue}% efficiency percentile</p>
            </article>

            <article className={`rounded-2xl border p-5 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)] ${
              result.greenHost
                ? "border-emerald-200/90 dark:border-emerald-800 bg-white dark:bg-slate-900"
                : "border-amber-200/90 dark:border-amber-800 bg-white dark:bg-slate-900"
            }`}>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Green Hosting</p>
              <p className={`mt-2.5 inline-flex items-center gap-2 text-lg font-semibold ${result.greenHost ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                <FaServer className="text-sm opacity-80" />
                {result.greenHost ? "Verified" : "Not Verified"}
              </p>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                {result.greenHost
                  ? `Estimated overall reduction ~${Math.round(Number(result.reductionPct || 0))}%`
                  : "Green Hosting Verified badge is unavailable for this result."}
              </p>
              {!result.greenHost ? (
                <a
                  href="https://buzzboost.co.uk/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
                >
                  Request hosting review
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              ) : (
                <p className="mt-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">Eligible for Green Hosting Verified badge</p>
              )}
            </article>

            <article className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Performance Insight</p>
              <div className="mt-2.5 flex items-center gap-2 text-slate-900 dark:text-white">
                <FaBolt className="text-green-600 dark:text-green-400" />
                <p className="font-semibold">{getPerformanceInsight(result.percentile)}</p>
              </div>
              <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300">
                Based on current carbon intensity percentile ({Number(result.percentile || 0)}%).
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Trust Signals</p>
              <div className="mt-2.5 space-y-2.5">
                <p className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><FaChartLine className="text-slate-400" /> SEO: unavailable in current payload</p>
                <p className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><FaShieldAlt className="text-slate-400" /> Accessibility: unavailable in current payload</p>
                <p className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><FaCheckCircle className="text-slate-400" /> Best practices: unavailable in current payload</p>
              </div>
              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">Source required: stored Lighthouse category scores from PageSpeed response.</p>
            </article>
          </section>

          <BadgePromo siteUrl={result.url} greenHost={!!result.greenHost} />

          <ImpactStats carbonPerView={result.carbonEstimate} siteUrl={result.url} grade={result.grade} />
          <TestCTA />
        </div>

        <div className="relative mt-16">
          <CompanyInfoSection />
        </div>
      </section>
    </>
  );
}
