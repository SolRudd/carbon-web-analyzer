import React, { useState, useEffect } from "react";
import CarbonBadge from "./CarbonBadge";
import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa";
import { API_BASE } from "../config";

export default function BadgePromo({ siteUrl }) {
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
    <section className="py-12 px-4 w-full">
      <div className="
        mx-auto max-w-4xl
        rounded-3xl
        bg-gradient-to-br from-slate-900/80 to-slate-950/90
        border border-slate-800/60
        shadow-[0_8px_48px_-8px_rgb(0,208,160,0.06)]
        backdrop-blur-md
        p-8 md:p-12
        flex flex-col md:flex-row gap-8 items-center
        relative
        "
        style={{
          boxShadow:
            "0 2px 32px 0 rgba(0,255,180,0.07), 0 1.5px 16px 0 rgba(0,80,255,0.10)",
        }}
      >
        {/* Left column: Text/CTA */}
        <div className="flex-1 flex flex-col gap-6 items-start md:items-start">
          <h2 className="
            text-2xl md:text-3xl font-extrabold mb-2
            bg-gradient-to-r from-slate-100 via-green-400 to-green-300
            dark:from-white dark:via-green-300 dark:to-blue-300
            bg-clip-text text-transparent
          ">
            Preview the Website Carbon Badge
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-md leading-relaxed">
            Drop this badge into your site’s footer to show your <span className="text-green-400 font-semibold">verified carbon footprint</span> and let your visitors see your real environmental impact!
          </p>
          <Link
            to="/badge"
            className="
              inline-flex items-center gap-2
              px-7 py-3 mt-1 rounded-full font-semibold text-lg
              bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600
              text-white shadow-lg hover:shadow-green-500/40
              transition-all duration-300
              group
            "
          >
            <FaRocket className="mr-2 group-hover:animate-bounce" />
            Badge Setup Instructions
          </Link>
        </div>
        {/* Right column: Live badge */}
        <div className="
          flex-1 flex flex-col items-center gap-3
          bg-gradient-to-br from-slate-900/80 to-slate-800/90
          border border-slate-700/60 rounded-2xl
          p-6
          shadow-md
          w-full max-w-xs
        ">
          <CarbonBadge url={previewUrl} data={previewData} />
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            (Shown for: <span className="font-mono">{previewUrl}</span>)
          </div>
        </div>
        {/* Glow effect, can be commented if too strong */}
        <div className="absolute -inset-2 -z-1 pointer-events-none">
          <div className="absolute w-full h-full rounded-3xl bg-green-400/5 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
