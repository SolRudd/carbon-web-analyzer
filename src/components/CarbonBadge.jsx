import React, { useState, useEffect } from 'react';
import { API_BASE } from "../config";

// Clean URL just like backend!
function cleanUrl(url) {
  try {
    let u = url.trim();
    if (!/^https?:\/\//.test(u)) u = 'https://' + u;
    const parsed = new URL(u);
    let host = parsed.hostname.toLowerCase();
    let pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.protocol + '//' + host + pathname;
  } catch {
    return url;
  }
}

export default function CarbonBadge({ url, data: preData }) {
  const [data, setData] = useState(preData);
  const [err, setErr]   = useState(false);

  useEffect(() => {
    if (preData) return;
    const cleaned = cleanUrl(url);
    const key = `carbon:${cleaned}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }
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

  if (err)      return <div className="text-red-500 text-xs">Badge failed to load</div>;
  if (!data)    return <div className="text-xs">Loading badge…</div>;

  const co2 = data.carbonEstimate.toFixed(2);
  const pct = data.percentile;
  const slug = new URL(url).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase();

  const isDark = document.documentElement.classList.contains('dark');
  const badgeBg = isDark ? '#18181b' : '#fff';
  const textColor = isDark ? '#e5e7eb' : '#0F172A';

  return (
    <div className="inline-flex flex-col items-center text-center">
      <a
        href={`/result/${slug}`}
        className="inline-flex overflow-hidden rounded shadow hover:scale-105 transition"
      >
        <div className="px-3 py-1" style={{background: badgeBg, color: textColor, border: "1px solid #16A34A"}}>
          {co2}g CO₂/view
        </div>
        <div className="px-3 py-1 bg-greenbuzz text-white">GreenTrace</div>
      </a>
      <div className="mt-1 text-xs" style={{color: isDark ? '#a3a3a3' : '#334155'}}>
        Cleaner than {pct}% of pages tested
      </div>
    </div>
  );
}
