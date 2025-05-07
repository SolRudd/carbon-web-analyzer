// src/components/ScaleBar.jsx
import React from "react";

export default function ScaleBar({ grade }) {
  const grades = ["A+", "A", "B", "C", "D", "E", "F"];

  const userIndex = grades.indexOf(grade);
  const userPct =
    userIndex !== -1 ? (userIndex / (grades.length - 1)) * 100 : 0;

  const avgIndex = grades.indexOf("E");
  const avgPct =
    avgIndex !== -1 ? (avgIndex / (grades.length - 1)) * 100 : 0;

  return (
    <div className="relative mt-20 w-full max-w-2xl mx-auto">
      {/* Gradient Track */}
      <div className="h-8 w-full rounded-full overflow-hidden shadow-inner relative">
        {/* Gradient background */}
        <div className="h-full w-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" />

        {/* Grade Labels - evenly spaced */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          {grades.map((g) => (
            <span
              key={g}
              className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 drop-shadow"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Global Average Indicator */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: `${avgPct}%`,
          transform: "translateX(-50%)",
          top: "-3rem",
        }}
      >
        <span className="text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm whitespace-nowrap">
          Global average
        </span>
        <span className="text-xl leading-none text-green-600 dark:text-green-400">
          ↙
        </span>
      </div>
      <div
        className="absolute -top-6"
        style={{ left: `${avgPct}%`, transform: "translateX(-50%)" }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-md border border-slate-200 dark:border-slate-700">
          <span className="text-lg sm:text-xl">🌐</span>
        </div>
      </div>

      {/* User Grade Bubble */}
      {userIndex !== -1 && (
        <div
          className="absolute -top-8 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl border-4 border-white dark:border-slate-900"
          style={{ left: `${userPct}%`, transform: "translateX(-50%)" }}
        >
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-900">
            {grade}
          </span>
        </div>
      )}
    </div>
  );
}
