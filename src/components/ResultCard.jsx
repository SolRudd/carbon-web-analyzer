// src/components/ResultCard.jsx
import React from "react";

export default function ResultCard({ result }) {
  return (
    <section className="bg-[#030f1f] py-16 text-center text-white">
      <div className="max-w-xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl border border-green-500">
        <h3 className="text-4xl font-bold text-green-400 mb-4">🎉 A+ Carbon Score!</h3>
        <p className="text-lg mb-2">
          Results for: <span className="text-white font-semibold">{result.url}</span>
        </p>
        <p className="text-green-300 text-xl mb-4">{result.carbonEstimate}</p>
        <p className="text-sm text-slate-400 mb-6">
          {result.greenHost
            ? "✅ Green Hosting Confirmed"
            : "❌ Non-green hosting"}
        </p>
        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg">
          Copy Badge HTML
        </button>
      </div>
    </section>
  );
}
