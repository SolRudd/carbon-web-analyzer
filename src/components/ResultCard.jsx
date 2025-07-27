// src/components/ResultCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import GradeBadge from "./GradeBadge";
import ScaleBar from "./ScaleBar";

export default function ResultCard({ result, onRetest }) {
  if (!result) return null;
  const { url, grade, percentile = 0, timestamp, cached = false } = result;

  // Format date
  const testedOn = new Date(timestamp).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Colour map for grade
  const colourMap = {
    "A+": "text-green-400",
    A: "text-green-500",
    B: "text-lime-400",
    C: "text-yellow-400",
    D: "text-orange-500",
    E: "text-red-400",
    F: "text-red-600",
  };
  const gradeClass = colourMap[grade] || "text-gray-600";

  // Heading emoji & text per grade
  const headingMap = {
    "A+": { emoji: "🏆", text: "Outstanding!" },
    A: { emoji: "🌟", text: "Excellent!" },
    B: { emoji: "👍", text: "Great job!" },
    C: { emoji: "👌", text: "Not bad!" },
    D: { emoji: "⚠️", text: "Needs improvement!" },
    E: { emoji: "⚠️", text: "Consider optimizing!" },
    F: { emoji: "🚨", text: "Oops! Lots of work needed!" },
  };
  const { emoji, text: headingText } = headingMap[grade] || {
    emoji: "🔍",
    text: "Analysis",
  };

  // Always show "cleaner than X%"
  const displayPct = Math.round(percentile);

  const copyUrl = () => navigator.clipboard.writeText(window.location.href);

  return (
    <section className="py-8 px-4">
      <div
        className="
          mx-auto max-w-4xl
          bg-white dark:bg-slate-900
          p-8 sm:p-12
          rounded-3xl
          shadow-2xl
          border border-slate-200 dark:border-slate-800
          relative overflow-visible
        "
      >
        {/* 1) Grade badge */}
        <div
          className="
            mb-6
            flex justify-center
            sm:absolute sm:-top-0 sm:left-4
          "
        >
          <GradeBadge grade={grade} />
        </div>

        {/* 2) Main content */}
        <div className="ml-0 sm:ml-32">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Carbon results for{" "}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              {new URL(url).hostname}
            </a>
            :
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            {emoji} {headingText} This page rates{" "}
            <span className={gradeClass}>{grade}</span>
          </h2>

          <p className="text-md sm:text-lg text-slate-700 dark:text-slate-300 mb-6">
            This page is{" "}
            <span className={`font-semibold ${gradeClass}`}>
              cleaner than {displayPct}%  
            </span>{" "}
            of all pages tested.
          </p>

          <ScaleBar grade={grade} />

          <div className="mt-6">
            <Link
              to="/how-it-works"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Learn about our rating system
            </Link>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-slate-600 dark:text-slate-400">
            <span>Last tested on {testedOn}.</span>
            {cached && process.env.NODE_ENV === "production" ? (
              <button
                disabled
                className="mt-2 sm:mt-0 text-gray-400 dark:text-gray-600 underline cursor-not-allowed"
              >
                Next re-test in 7 days
              </button>
            ) : (
              <button
                onClick={onRetest}
                className="mt-2 sm:mt-0 text-green-500 dark:text-green-400 underline hover:text-green-600"
              >
                Re-test
              </button>
            )}
          </div>
        </div>

        {/* 3) Copy URL button */}
        <button
          onClick={copyUrl}
          className="
            flex justify-center
            w-full mt-8
            bg-green-500 hover:bg-green-400 text-white
            px-6 py-3 rounded-full
            transition
            sm:absolute sm:bottom-8 sm:right-8 sm:w-auto sm:mt-0
          "
        >
          <span>Copy URL</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16h8M8 12h8m-5-8h.01M16 4h2a2 2 0 012 2v2
                 m0 8v2a2 2 0 01-2 2h-2
                 m-8 0H6a2 2 0 01-2-2v-2
                 m0-8V6a2 2 0 012-2h2"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
