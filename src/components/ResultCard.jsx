import React from "react";
import { Link } from "react-router-dom";
import GradeBadge from "./GradeBadge";
import ScaleBar   from "./ScaleBar";

export default function ResultCard({ result, onRetest }) {
  if (!result) return null;
  const { url, grade, percentile = 0, timestamp } = result;

  const testedOn = new Date(timestamp).toLocaleDateString(undefined, {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });
  const verb = percentile > 50 ? "cleaner than" : "dirtier than";
  const pct  = `${percentile}%`;

  const copyUrl = () => navigator.clipboard.writeText(window.location.href);

  return (
    <section className="pt-8 pb-12 px-4 bg-white dark:bg-slate-950 transition-colors">
      <div className="relative max-w-4xl mx-auto bg-white/95 dark:bg-slate-900/90
                      p-6 sm:p-12 rounded-3xl shadow-2xl border border-green-400/20
                      backdrop-blur-sm overflow-hidden">

        {/* 1) Grade badge */}
        <GradeBadge grade={grade} />

        {/* 2) Main content */}
        <div className="mt-0 sm:ml-32">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Website carbon results for:{" "}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              {new URL(url).hostname}
            </a>
          </p>

          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold
                         text-slate-900 dark:text-white leading-tight">
            Oh no! This web page achieves a carbon rating of{" "}
            <span className={grade === "F" ? "text-red-500" : "text-green-500"}>
              {grade}
            </span>
          </h2>

          <p className="mt-2 text-md sm:text-lg text-slate-700 dark:text-slate-300">
            This page is{" "}
            <span className="font-semibold text-green-500 dark:text-green-400">
              {verb} {pct}
            </span>{" "}
            of all web pages globally
          </p>

          <div className="mt-6">
            <ScaleBar grade={grade} />
          </div>

          <div className="mt-6">
            <Link
              to="/rating-system"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Learn about our rating system
            </Link>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4
                          text-sm text-slate-600 dark:text-slate-400">
            <span>This page was last tested on {testedOn}.</span>
            <button
              onClick={onRetest}
              className="mt-2 sm:mt-0 text-green-500 dark:text-green-400 underline hover:text-green-600"
            >
              Test again
            </button>
          </div>
        </div>

        {/* 3) Copy URL button */}
        <button
          onClick={copyUrl}
          className={`
            w-full sm:w-auto               /* full-width on mobile, auto on desktop */
            mt-8 sm:mt-0                   /* spacing mobile vs desktop */
            sm:absolute sm:bottom-6 sm:right-6  /* pin on desktop */
            bg-green-500 hover:bg-green-400 text-white
            px-6 py-3 rounded-full flex items-center justify-center space-x-2
          `}
        >
          <span>Copy URL</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16h8M8 12h8m-5-8h.01M16 4h2a2 2 0 012 
                 2v2m0 8v2a2 2 0 01-2 2h-2m-8 0H6a2 2 0 01-2-2v-2m0-8V6a2 
                 2 0 012-2h2"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
