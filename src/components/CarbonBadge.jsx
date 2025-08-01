// src/components/CarbonBadge.jsx

import React, { useState, useEffect } from 'react';
import { API_BASE } from "../config";
import GreenTraceLogo from "../assets/GreenTraceLogo.svg";

/**
 * Utility to normalize URLs, matching backend logic.
 * Ensures: protocol present, lowercased host, trimmed trailing slash.
 * Returns a string like: https://domain.com/path
 */
function cleanUrl(url) {
  try {
    let u = url.trim();
    if (!/^https?:\/\//.test(u)) u = 'https://' + u;
    const parsed = new URL(u);
    let host = parsed.hostname.toLowerCase();
    let pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.protocol + '//' + host + pathname;
  } catch {
    return url; // fallback, in case of malformed input
  }
}

/**
 * CarbonBadge
 * Displays a dynamic badge with the site's CO₂ score and percentile.
 *
 * Props:
 *   - url (string): website URL to fetch/report carbon data for
 *   - data (object, optional): if provided, skips API fetch
 *
 * - Pulls badge data from API or session cache.
 * - Shows error, loading, or badge.
 * - Fully responsive & light/dark aware.
 */
export default function CarbonBadge({ url, data: preData }) {
  // Internal state for fetched data and error status
  const [data, setData] = useState(preData);
  const [err, setErr]   = useState(false);

  useEffect(() => {
    if (preData) return; // If data is passed as prop, skip fetch

    const cleaned = cleanUrl(url);
    const key = `carbon:${cleaned}`;
    const cached = sessionStorage.getItem(key);

    // Use session cache if available for snappy UX
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    // Fetch badge data from backend API
    fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(cleaned)}`)
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(d => {
        sessionStorage.setItem(key, JSON.stringify(d));
        setData(d);
      })
      .catch(() => setErr(true));
  }, [url, preData]);

  // Loading and error states
  if (err)
    return (
      <div className="text-red-500 text-xs" title="Badge failed to load">
        Badge failed to load
      </div>
    );
  if (!data)
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400" title="Loading badge…">
        Loading badge…
      </div>
    );

  // Badge info
  const co2   = data.carbonEstimate?.toFixed(2) || "–";
  const pct   = typeof data.percentile === "number" ? data.percentile : "–";
  const slug  = (() => {
    try {
      return new URL(url).hostname.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    } catch {
      return "site";
    }
  })();

  // Theme colors (match your Tailwind setup)
  const isDark = document.documentElement.classList.contains('dark');
  const badgeBg = isDark ? '#18181b' : '#fff';
  const textColor = isDark ? '#e5e7eb' : '#0F172A';

  // Main badge rendering
  return (
    <div className="inline-flex flex-col items-center text-center">
      <a
        href={`/result/${slug}`}
        aria-label="View full carbon analysis"
        className="inline-flex overflow-hidden rounded shadow hover:scale-105 transition ring-emerald-400/30 hover:ring-2"
        style={{ textDecoration: "none" }}
      >
        {/* CO₂/visit pill */}
        <div
          className="px-3 py-1 font-mono text-xs font-semibold"
          style={{
            background: badgeBg,
            color: textColor,
            border: "1px solid #16A34A",
            borderRight: "none",
            borderRadius: "4px 0 0 4px",
            minWidth: 78
          }}
        >
          {co2}g CO₂/view
        </div>
        {/* Logo and Brand pill */}
        <div
          className="px-3 py-1 bg-greenbuzz text-white flex items-center gap-2 font-sans font-bold tracking-tight"
          style={{
            borderRadius: "0 4px 4px 0",
            fontSize: 13,
            border: "1px solid #16A34A",
            borderLeft: "none",
            background: "#16A34A"
          }}
        >
          <img
            src={GreenTraceLogo}
            alt="GreenTrace"
            className="h-4 w-4 mr-1"
            loading="lazy"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
          GreenTrace
        </div>
      </a>
      {/* Percentile/description text */}
      <div
        className="mt-1 text-xs"
        style={{ color: isDark ? '#a3a3a3' : '#334155', minHeight: 16 }}
      >
        Cleaner than {pct}% of pages tested
      </div>
    </div>
  );
}
