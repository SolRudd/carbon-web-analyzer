/* src/components/ResultCard.jsx */
import React from "react";

export default function ResultCard({ result }) {
  return (
    <section className="py-16 text-center
      bg-white dark:bg-[#030f1f]
      transition-colors duration-300
    ">
      <div className="max-w-xl mx-auto
        bg-slate-50 dark:bg-slate-900
        p-8 rounded-2xl shadow-xl
        border border-green-500
        transition-colors duration-300
      ">
        <h3 className="text-4xl font-bold
          text-green-600 dark:text-green-400 mb-2
        ">
          🎉 {result.grade} Carbon Score!
        </h3>
        <p className="text-lg mb-2 text-slate-900 dark:text-white">
          Results for: <span className="font-semibold">{result.url}</span>
        </p>
        <p className="text-green-600 dark:text-green-300 text-xl mb-4">
          {result.carbonEstimate}
        </p>
        <p className="text-sm mb-6 text-slate-700 dark:text-slate-300">
          {result.greenHost
            ? "✅ Green Hosting Confirmed"
            : "❌ Non-green hosting"}
        </p>
        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-colors duration-200">
          Copy Badge HTML
        </button>
      </div>
    </section>
  );
}
