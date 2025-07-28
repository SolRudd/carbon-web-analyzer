import React, { useState, useEffect } from "react";
import CarbonBadge from "./CarbonBadge";
import { Link }    from "react-router-dom";
import { API_BASE } from "../config";

export default function BadgePromo({ siteUrl }) {
  // Use whatever siteUrl is passed in, fallback to your default
  const previewUrl = siteUrl || "https://buzzboost.co.uk";
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (previewUrl.startsWith(window.location.origin)) return;
    const key = `carbon:${previewUrl}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setPreviewData(JSON.parse(cached));
    } else {
      fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(previewUrl)}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => {
          sessionStorage.setItem(key, JSON.stringify(d));
          setPreviewData(d);
        })
        .catch(console.error);
    }
  }, [previewUrl]);

  return (
    <section className="py-8 px-4">
      <div className="mx-auto max-w-4xl bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow space-y-8">
        <h2 className="text-2xl font-bold text-center">Preview the Website Carbon Badge</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1 space-y-2">
            <p className="mb-2">
              Drop this badge into your site’s footer to show your verified carbon footprint!
            </p>
            <Link to="/badge" className="inline-block bg-greenbuzz text-white px-4 py-2 rounded mt-4">
              Badge Setup Instructions
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-4 items-center justify-center">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex flex-col items-center">
              <CarbonBadge url={previewUrl} data={previewData} />
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                (Shown for: <span className="font-mono">{previewUrl}</span>)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
