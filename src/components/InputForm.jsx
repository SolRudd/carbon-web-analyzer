// src/components/InputForm.jsx
import React, { useState } from "react";
import { useNavigate }      from "react-router-dom";
import LoadingOverlay       from "./LoadingOverlay";
import bubbleShape          from "../assets/bubble.svg";

export default function InputForm() {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [url, setUrl]         = useState("");    // the URL the user types
  const [loading, setLoading] = useState(false); // spinner toggle
  const navigate              = useNavigate();   // to redirect on success

  // ─── Handle form submission ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;          // skip empty submissions
    setLoading(true);

    try {
      // POST to our Express backend (via Vite proxy)
      const res = await fetch("/api/check-carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      // parse JSON & handle errors
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      // on success, go to the results page for this slug
      navigate(`/result/${data.slug}`);
    } catch (err) {
      console.error("Error fetching carbon data:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 px-4 transition-colors duration-300">
      {/* ─── Decorative Green Glow ───────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 w-[900px] h-[900px]
                     bg-glow-green transform -translate-x-1/2 -translate-y-1/2
                     blur-3xl opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ─── Hero Bubble SVG ────────────────────────────────────────────────── */}
        <div className="w-full -mt-20 mb-8">
          <img src={bubbleShape} alt="Bubble graphic" className="w-full h-auto" />
        </div>

        {/* ─── Input Form ────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center
                     bg-white/60 dark:bg-white/5 backdrop-blur-md
                     border border-slate-300 dark:border-white/10
                     p-6 rounded-2xl mx-auto max-w-3xl"
        >
          {/* URL Field */}
          <div className="flex-1 text-left">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Enter a website URL to check its carbon footprint:
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full p-4 rounded-full bg-white dark:bg-slate-800
                         border border-slate-300 dark:border-slate-600
                         text-slate-900 dark:text-white shadow-md
                         focus:outline-none focus:ring-2 focus:ring-greenbuzz"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-greenbuzz hover:bg-greenbuzz-light
                       text-white rounded-full font-semibold
                       border border-greenbuzz hover:border-greenbuzz-light
                       disabled:opacity-50 transition"
          >
            {loading ? "Checking…" : "Calculate"}
          </button>
        </form>

        {/* ─── Loading Indicator ─────────────────────────────────────────────── */}
        {loading && <LoadingOverlay />}
      </div>
    </section>
  );
}
