// src/components/BadgePromo.jsx
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
    <section className="py-12 px-4 w-full bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="
        mx-auto max-w-4xl
        rounded-3xl
        bg-gradient-to-br from-slate-100/80 to-slate-200/90 dark:from-slate-800/70 dark:to-slate-900/90
        border border-slate-200/60 dark:border-slate-700/60
        shadow-[0_8px_48px_-8px_rgb(0,208,160,0.06)] dark:shadow-[0_8px_48px_-8px_rgb(0,208,160,0.15)]
        backdrop-blur-md
        p-8 md:p-12
        flex flex-col md:flex-row gap-8 items-center
        relative
        transition-all duration-300
      "
      style={{
        boxShadow:
          "0 2px 32px 0 rgba(0,255,180,0.07), 0 1.5px 16px 0 rgba(0,80,255,0.10)",
      }}
      >
        {/* Left column: Text/CTA */}
        <div className="flex-1 flex flex-col gap-6 items-start">
          <h2 className="
            text-2xl md:text-3xl font-extrabold mb-2
            bg-gradient-to-r from-green-600 to-blue-500 dark:from-green-400 dark:to-green-600
            bg-clip-text text-transparent
          ">
            Preview the Website Carbon Badge
          </h2>
          <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-md leading-relaxed">
            Drop this badge into your site’s footer to show your <span className="text-green-600 dark:text-green-400 font-semibold">verified carbon footprint</span> and let your visitors see your real environmental impact!
          </p>
          <Link
            to="/badge"
            className="
              inline-flex items-center gap-2
              px-7 py-3 mt-1 rounded-full font-semibold text-lg
              bg-gradient-to-r from-green-600 to-blue-500 dark:from-green-500 dark:to-green-600
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
          bg-white dark:bg-slate-800/80
          border border-slate-200 dark:border-slate-700/60 rounded-2xl
          p-6
          shadow-md dark:shadow-lg
          w-full max-w-xs
          transition-colors duration-300
        ">
          <CarbonBadge url={previewUrl} data={previewData} />
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center">
            (Shown for: <span className="font-mono break-all">{previewUrl}</span>)
          </div>
        </div>
        {/* Glow effect, can be commented if too strong */}
        <div className="absolute -inset-2 -z-10 pointer-events-none">
          <div className="absolute w-full h-full rounded-3xl bg-green-400/5 dark:bg-green-600/5 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
