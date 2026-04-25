// src/components/BadgePromo.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaLeaf, FaShieldAlt, FaCopy } from "react-icons/fa";
import CarbonBadge from "./CarbonBadge";

const normalizeSiteUrl = (raw) => {
  try {
    const u = new URL((raw || "").includes("://") ? raw : `https://${raw}`);
    return u.href.replace(/\/$/, "");
  } catch {
    return "https://yoursite.com";
  }
};

export default function BadgePromo({ siteUrl, greenHost = false }) {
  const [copiedKey, setCopiedKey] = useState("");
  const normalized = useMemo(() => normalizeSiteUrl(siteUrl), [siteUrl]);

  const copySnippet = async (key, snippet) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1800);
    } catch (err) {
      console.error("Failed to copy badge snippet:", err);
    }
  };

  const carbonSnippet = `<div class="greentrace-badge" data-url="${normalized}" data-theme="auto"></div>
<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>`;

  const hostingSnippet = `<div class="greentrace-badge" data-url="${normalized}" data-badge-type="hosting" data-theme="auto"></div>
<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>`;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 dark:border-slate-700/70 bg-white/92 dark:bg-slate-900/80 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.5)] p-6 sm:p-8 lg:p-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-1/3 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-7">
        <div className="flex flex-col gap-3.5">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-green-600/25 bg-green-600/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
            <FaShieldAlt />
            Trust Badges
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.01em] text-slate-900 dark:text-white">
            Publish Verified GreenTracer Badges
          </h2>
          <p className="text-[15px] text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Use a lightweight embed to display your verified carbon impact and, when eligible, your green hosting status.
            Both badges use saved GreenTracer results and do not trigger new scans.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {greenHost
              ? "Both Carbon and Hosting badges are eligible for this report."
              : "Carbon badge is ready. Hosting badge will unlock once green hosting is verified."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <article className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Carbon Impact Badge</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Shows CO₂ per view + percentile trust signal.</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <FaCheckCircle />
                Available
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-[#020f1e]/40 p-4 flex justify-center">
              <CarbonBadge url={normalized} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Embed Code</p>
                <button
                  onClick={() => copySnippet("carbon", carbonSnippet)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 transition-colors"
                >
                  <FaCopy />
                  {copiedKey === "carbon" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/85 dark:bg-[#020f1e]/75 p-3 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all leading-relaxed">
                {carbonSnippet}
              </pre>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Green Hosting Verified</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Displays hosting verification from latest saved result.</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  greenHost
                    ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/12 text-amber-700 dark:text-amber-300"
                }`}
              >
                <FaLeaf />
                {greenHost ? "Verified" : "Not Eligible"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-[#020f1e]/40 p-4 flex items-center justify-center min-h-[92px]">
              {greenHost ? (
                <div className="inline-flex flex-col items-center">
                  <div className="inline-flex overflow-hidden border rounded-[10px] shadow-[0_6px_16px_-10px_rgba(15,23,42,0.16)]" style={{ borderColor: "rgba(22,163,74,0.38)" }}>
                    <div className="px-3.5 py-[7px] text-[13px] font-semibold tracking-[0.01em] bg-white text-slate-900">
                      Green Hosting Verified
                    </div>
                    <div className="px-[15px] py-[6px] bg-[#16A34A] border-l" style={{ borderColor: "rgba(22,163,74,0.22)" }}>
                      <img src="/GreenTraceLogo.png" alt="GreenTracer" className="h-[18px] w-auto block filter brightness-0 invert" loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <div className="mt-[5px] text-[12px] font-medium tracking-[0.01em] text-slate-600 dark:text-slate-400">
                    Verified from latest saved GreenTracer result
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center max-w-sm">
                  Hosting badge is unavailable for this result because green hosting is not currently verified.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Embed Code</p>
                <button
                  onClick={() => copySnippet("hosting", hostingSnippet)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 transition-colors"
                >
                  <FaCopy />
                  {copiedKey === "hosting" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/85 dark:bg-[#020f1e]/75 p-3 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all leading-relaxed">
                {hostingSnippet}
              </pre>
            </div>
          </article>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/70">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Need brand-aligned colors and theme controls? Use the full badge setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/badge"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-[0_10px_28px_-16px_rgba(22,163,74,0.8)]"
            >
              Open Badge Setup
            </Link>
            <a
              href={greenHost ? "https://buzzboost.co.uk/websites/support-plans/" : "https://buzzboost.co.uk/contact/"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                greenHost
                  ? "border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/45"
                  : "border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/45"
              }`}
            >
              {greenHost ? "Improve Badge Performance" : "Request Hosting Upgrade Review"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
