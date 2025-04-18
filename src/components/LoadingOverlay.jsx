/* src/components/LoadingOverlay.jsx */
import React from "react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0
      bg-white dark:bg-[#020f1e]
      text-slate-900 dark:text-white
      flex flex-col justify-center items-center z-50
      transition-colors duration-300
    ">
      <p className="text-xl md:text-2xl font-semibold text-center mb-4">
        “The internet could use 20% of global electricity by 2025.”
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-400 mb-6">
        Source: <a href="https://www.climatechangenews.com/" className="underline">Climate Home News</a>
      </p>
      <p className="text-green-600 dark:text-green-400 animate-pulse">
        We're just loading your results...
      </p>
    </div>
  );
}
