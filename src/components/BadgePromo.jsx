import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCopy, FaShieldAlt } from "react-icons/fa";
import { API_BASE, RESULTS_BASE } from "../config";
import GreenTracerBadge from "./badges/GreenTracerBadge";
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

export default function BadgePromo({ siteUrl }) {
  const [copied, setCopied] = useState(false);
  const [badgeRecord, setBadgeRecord] = useState(null);
  const domain = useMemo(() => normalizeDomain(siteUrl), [siteUrl]);

  useEffect(() => {
    if (!domain) return;
    const controller = new AbortController();
    fetch(`${API_BASE}/api/license/check?domain=${encodeURIComponent(domain)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setBadgeRecord(data || null))
      .catch((err) => {
        if (err.name !== "AbortError") setBadgeRecord(null);
      });
    return () => controller.abort();
  }, [domain]);

  const publicToken = badgeRecord?.badgePublicToken || "";
  const verificationStatus = String(badgeRecord?.verificationStatus || "").toLowerCase();
  const isVerified = ["verified", "approved", "active"].includes(verificationStatus) && badgeRecord?.licensed;
  const embedSnippet = buildBadgeEmbedCode({
    token: publicToken || "PUBLIC_TOKEN",
    apiBase: API_BASE,
    siteBase: RESULTS_BASE,
    variant: "compact",
  });

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-green-600/25 bg-green-600/10 px-4 py-1.5 text-[11px] font-semibold uppercase text-green-700 dark:text-green-300">
            <FaShieldAlt />
            Verification Badge
          </p>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Publish a compact GreenTracer badge
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The launch badge is a public-token SVG linked to a verification page. It uses the same visual system as the app preview and does not expose API keys.
          </p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <GreenTracerBadge
            variant="compact"
            status={isVerified ? "verified" : "pending"}
            metric={badgeRecord?.latestCo2PerPage}
            domain={domain}
            showMetric={Boolean(badgeRecord?.latestCo2PerPage)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-[#020f1e]/40">
        {publicToken ? (
          <>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Recommended Embed</p>
              <button
                type="button"
                onClick={copySnippet}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200"
              >
                <FaCopy />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-all rounded-xl border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {embedSnippet}
            </pre>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            No public badge token is available for this domain yet. Create or activate the verified badge record, then use the badge setup page to copy the final embed.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/badge?site=${encodeURIComponent(domain || "")}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Open Badge Setup
        </Link>
        <Link
          to="/pricing"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          Manage Licensing
        </Link>
      </div>
    </section>
  );
}
