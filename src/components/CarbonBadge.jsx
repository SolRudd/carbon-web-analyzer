// src/components/CarbonBadge.jsx
import React, { useState, useEffect } from "react";
import { API_BASE, RESULTS_BASE } from "../config";

// NOTE: singular "/result"
const RESULTS_PATH = "/result";

export default function CarbonBadge({ url, data: preData }) {
  const [data, setData] = useState(preData || null);
  const [err, setErr] = useState(false);

  // Normalize URL
  const target = (() => {
    try {
      const u = new URL(url);
      return u.protocol + "//" + u.hostname + u.pathname.replace(/\/+$/, "");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (preData || !target) return;

    const key = `carbon:${target}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      console.log("⚡️ CarbonBadge: using cache for", target);
      setData(JSON.parse(cached));
      return;
    }

    console.log("⚡️ CarbonBadge: fetching slug for", target);
    fetch(
      `${API_BASE}/api/trace-or-check?site=${encodeURIComponent(target)}`,
      { mode: "cors" }
    )
      .then((r) => {
        console.log("⚡️ CarbonBadge: response status", r.status);
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((d) => {
        console.log("⚡️ CarbonBadge: got data", d);
        setData(d);
        sessionStorage.setItem(key, JSON.stringify(d));
      })
      .catch((e) => {
        console.error("⚡️ CarbonBadge: fetch error", e);
        setErr(true);
      });
  }, [target, preData]);

  if (!target) return null;
  if (err)
    return <div className="text-red-500 text-xs">Badge failed to load</div>;
  if (!data) return <div className="text-xs">Loading badge…</div>;

  const co2 = Number(data.carbonEstimate || 0).toFixed(2);
  const pct = data.percentile ?? "--";
  const slug = data.slug; // must be non-empty
  const href = `${RESULTS_BASE}${RESULTS_PATH}/${encodeURIComponent(slug)}`;

  console.log("⚡️ CarbonBadge: badge link →", href);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="View GreenTracer carbon report"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#020f1e] border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 no-underline group"
    >
      <svg className="w-4 h-4 text-greenbuzz" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tracking-wider uppercase">
        GreenTracer Verified
      </span>
      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-1.5 border-l border-slate-200 dark:border-slate-700">
        {co2}g CO₂
      </span>
    </a>
  );
}
