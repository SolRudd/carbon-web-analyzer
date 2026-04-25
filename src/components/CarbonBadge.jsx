// src/components/CarbonBadge.jsx
import React, { useState, useEffect } from "react";
import { API_BASE, RESULTS_BASE } from "../config";
import CompactTrustBadge from "./CompactTrustBadge";

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
      setData(JSON.parse(cached));
      return;
    }

    fetch(
      `${API_BASE}/api/trace-or-check?site=${encodeURIComponent(target)}`,
      { mode: "cors" }
    )
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((d) => {
        setData(d);
        sessionStorage.setItem(key, JSON.stringify(d));
      })
      .catch((e) => {
        console.error("CarbonBadge fetch error:", e);
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

  return (
    <CompactTrustBadge
      href={href}
      label={`Cleaner than ${pct}%`}
      value={`${co2}g CO₂/view`}
      ariaLabel="View GreenTracer carbon report"
    />
  );
}
