import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCopy, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import ScaleBar from "./ScaleBar";

export default function ResultCard({ result, onRetest }) {
  if (!result) return null;
  const { url, grade, percentile = 0, timestamp, cached = false } = result;
  const testedOn = new Date(timestamp).toLocaleDateString(undefined, {
    day: "numeric", month: "long", year: "numeric"
  });

  // Visual and text maps
  const colourMap = {
    "A+": "text-green-500",
    A:    "text-green-600",
    B:    "text-lime-500",
    C:    "text-yellow-500",
    D:    "text-orange-500",
    E:    "text-red-500",
    F:    "text-red-600",
  };
  const gradeClass = colourMap[grade] || "text-gray-600";

  // Headline and advice per grade
  const gradeCopy = {
    "A+": {
      emoji: "🏆", headline: "World-Class Sustainability",
      summary: "Your page is among the cleanest on the internet. Amazing work—keep setting the standard!"
    },
    A: {
      emoji: "🌟", headline: "Excellent Performance",
      summary: "Your site is super efficient and well above global averages. A little fine-tuning could push you to the top."
    },
    B: {
      emoji: "👍", headline: "Solid & Efficient",
      summary: "Your carbon impact is lower than most sites. With a few tweaks, you could reach excellence."
    },
    C: {
      emoji: "👌", headline: "Good—but Room to Grow",
      summary: "You’re doing okay, but there’s clear opportunity to reduce your site’s footprint and outperform the web average."
    },
    D: {
      emoji: "⚠️", headline: "Needs Improvement",
      summary: "Your site’s emissions are higher than average. Review your images, code, and hosting for quick wins."
    },
    E: {
      emoji: "🚨", headline: "High Impact: Action Needed",
      summary: "This website generates significant carbon emissions. We recommend an audit and sustainable rebuild."
    },
    F: {
      emoji: "🔥", headline: "Very High Impact",
      summary: "Your page is among the least efficient. Immediate action is needed—consider a full redesign for sustainability."
    }
  };
  const copy = gradeCopy[grade] || {
    emoji: "🔍", headline: "No Grade",
    summary: "We couldn't assign a grade. Please try again or contact support."
  };

  const displayPct = Math.round(percentile);
  const copyUrl = () => navigator.clipboard.writeText(window.location.href);

  return (
    <section className="relative py-8 px-2 md:px-4 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[420px] h-[420px] bg-green-400/20 blur-3xl animate-pulse opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px] bg-blue-400/20 blur-2xl animate-pulse opacity-20 delay-1000" />
      </div>

      <div className={`
        relative mx-auto max-w-2xl md:max-w-4xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        rounded-2xl shadow-xl md:shadow-2xl
        p-4 sm:p-8 md:p-12
        transition-shadow duration-300
        flex flex-col
        ${["A+", "A", "B"].includes(grade) ? "shadow-green-400/20 dark:shadow-green-400/40" : ""}
      `}>

        {/* Summary/info row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tested:</p>
            <span className="font-medium text-slate-800 dark:text-slate-200">{testedOn}</span>
            {cached && process.env.NODE_ENV === "production" ? (
              <span className="ml-4 text-xs text-gray-400">(cached, auto retest in 7 days)</span>
            ) : null}
          </div>
          <div className="text-xs sm:text-sm text-right">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="underline text-green-600 dark:text-green-400 break-all"
              title={url}
            >
              {new URL(url).hostname}
            </a>
          </div>
        </div>

        {/* Main Result/Grade */}
        <div className="flex flex-col items-center gap-2 mb-1">
          <span className={`
            inline-flex items-center gap-2 px-5 py-2 rounded-full border-2
            border-slate-300 dark:border-slate-700
            ${gradeClass} font-bold text-base md:text-lg bg-white/60 dark:bg-slate-900/50
          `}>
            {copy.emoji} Grade: {grade}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold my-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent text-center">
            {copy.headline}
          </h2>
        </div>

        {/* Advisory subline */}
        <div className={`text-center mb-2`}>
          <span className="block text-base sm:text-lg text-slate-700 dark:text-slate-300">{copy.summary}</span>
        </div>

        {/* Percentile Stat */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 my-2">
          {["A+", "A"].includes(grade) && (
            <CheckCircle2 className="w-7 h-7 text-green-500 animate-bounce" />
          )}
          {["D", "E", "F"].includes(grade) && (
            <AlertTriangle className="w-7 h-7 text-orange-400 animate-pulse" />
          )}
          <span className={`text-3xl sm:text-4xl font-bold ${gradeClass}`}>
            {displayPct}%
          </span>
          <span className="ml-0 md:ml-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 flex items-center gap-1">
            cleaner than all pages tested
            <Info className="w-5 h-5 text-slate-400" title="Percentile is based on all tested public pages." />
          </span>
        </div>

        {/* Scale bar */}
        <div className="my-6">
          <ScaleBar grade={grade} />
        </div>

        {/* Retest & Info row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 text-sm">
          <Link
            to="/how-it-works"
            className="underline text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            What does this grade mean?
          </Link>
          {cached && process.env.NODE_ENV === "production" ? (
            <button
              disabled
              className="underline text-gray-400 cursor-not-allowed"
            >
              Next re-test in 7 days
            </button>
          ) : (
            <button
              onClick={onRetest}
              className="underline text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
            >
              Re-test this page
            </button>
          )}
        </div>

        {/* Copy link button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={copyUrl}
            className="
              flex items-center gap-2
              px-6 py-3
              bg-gradient-to-r from-green-600 to-blue-600
              hover:from-green-700 hover:to-blue-500
              text-white font-semibold
              rounded-full
              transition-all duration-300 transform hover:scale-105 shadow-lg
            "
            title="Copy this results page link"
          >
            <ClipboardCopy className="w-5 h-5" />
            Copy Page Link
          </button>
        </div>
      </div>
    </section>
  );
}
