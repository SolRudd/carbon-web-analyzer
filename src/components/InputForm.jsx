// src/components/InputForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import globeSvg from "../assets/bubble.svg";
import { FaLeaf } from 'react-icons/fa';

export default function InputForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let site = url.trim();
    if (!site) return;

    // Auto-prepend protocol
    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/check-carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
      navigate(`/result/${data.slug}`);
    } catch (err) {
      console.error("Error fetching carbon data:", err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="input-form" className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 px-4 transition-colors duration-300">
      {/* decorative green glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="w-full -mt-20 mb-8 pointer-events-none">
          <img
            src={globeSvg}
            alt="Stylized globe illustrating global sustainability"
            className="w-full h-auto pointer-events-none"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white">
          Estimate your web page Carbon Footprint
        </h2>
        <p className="text-center text-base font-medium text-slate-700 dark:text-slate-300">
          Enter your web page address below to get started
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300 dark:border-white/10 p-6 rounded-2xl mx-auto max-w-3xl"
        >
          <input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={loading}
            className="col-span-1 sm:col-span-2 h-12 p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 h-12 bg-greenbuzz hover:bg-greenbuzz-light text-white rounded-full font-semibold text-base border border-greenbuzz hover:border-greenbuzz-light disabled:opacity-50 transition col-span-1"
          >
            <FaLeaf className="mr-2" />
            {loading ? "Checking…" : "Calculate"}
          </button>

          <p className="col-span-1 sm:col-span-3 text-center text-xs text-slate-600 dark:text-slate-400 mt-4">
            By using this carbon calculator, you agree to have your submitted data stored and published in our public database.
          </p>
        </form>

        {loading && <LoadingOverlay />}
      </div>
    </section>
);
}
