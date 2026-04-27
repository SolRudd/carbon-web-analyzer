import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaShieldAlt } from "react-icons/fa";
import GreenTracerBadge from "./badges/GreenTracerBadge";
import { API_BASE } from "../config";
import { buildBadgeEmbedCode } from "../lib/badges/embed";

const normalizeDomain = (raw) =>
  (() => {
    try {
      const value = String(raw || "").trim();
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      return url.hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return String(raw || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split("/")[0]
        .toLowerCase();
    }
  })();

export default function BadgePromo({ siteUrl, greenHost = false, resultSlug = "", grade = "" }) {
  const [copied, setCopied] = useState("");
  const domain = useMemo(() => normalizeDomain(siteUrl), [siteUrl]);
  const reportHref = resultSlug ? `/result/${encodeURIComponent(resultSlug)}` : "";
  const gradeText = grade ? `Grade ${grade}` : "";
  const builderParams = new URLSearchParams({
    result: resultSlug || "",
    domain: domain || "",
    green: greenHost ? "1" : "0",
  });
  const carbonBuilderHref = `/badge?type=carbon_tested&${builderParams.toString()}`;
  const greenBuilderHref = `/badge?type=green_hosting&${builderParams.toString()}`;
  const carbonSnippet = buildBadgeEmbedCode({
    badgeType: "carbon_tested",
    domain,
    resultSlug,
    apiBase: API_BASE,
  });
  const greenSnippet = buildBadgeEmbedCode({
    badgeType: "green_hosting",
    domain,
    resultSlug,
    apiBase: API_BASE,
  });

  const copySnippet = async (code, key) => {
    if (!code || !resultSlug) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  return (
    <section id="badge-options" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
            <FaShieldAlt aria-hidden="true" />
            Badge options
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-slate-900 dark:text-white">
            Publish the right GreenTracer badge
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Carbon Tested and Green Hosting badges come from this report. GreenTracer Verified is the paid supporter badge managed from your dashboard.
          </p>
          {domain && (
            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              Domain: {domain}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[500px]">
          <GreenTracerBadge
            status="active"
            badgeType="carbon_tested"
            domain={domain}
            href={reportHref}
            valueText={gradeText}
          />
          {greenHost ? (
            <GreenTracerBadge
              status="active"
              badgeType="green_hosting"
              domain={domain}
              href={reportHref}
            />
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
              Green Hosting badge is available only when this report detects green hosting.
            </div>
          )}
          <div className="sm:col-span-2">
            <GreenTracerBadge
              status="licence_inactive"
              badgeType="greentracer_verified"
              domain={domain}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {reportHref && (
          <Link
            to={reportHref}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            View report
          </Link>
        )}
        {greenHost && (
          <button
            type="button"
            onClick={() => copySnippet(greenSnippet, "green")}
            disabled={!resultSlug}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-700 disabled:opacity-50 dark:border-emerald-700 dark:text-emerald-300"
          >
            <FaLeaf aria-hidden="true" />
            {copied === "green" ? "Copied Green Hosting code" : "Copy Green Hosting embed code"}
          </button>
        )}
        <button
          type="button"
          onClick={() => copySnippet(carbonSnippet, "carbon")}
          disabled={!resultSlug}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {copied === "carbon" ? "Copied Carbon Tested code" : "Copy Carbon Tested embed code"}
        </button>
        <Link
          to={carbonBuilderHref}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          Customize Carbon badge
        </Link>
        {greenHost && (
          <Link
            to={greenBuilderHref}
            className="inline-flex items-center justify-center rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
          >
            Customize Green Hosting badge
          </Link>
        )}
        <Link
          to="/pricing"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          Upgrade for Verified
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          Manage domain
        </Link>
      </div>
    </section>
  );
}
