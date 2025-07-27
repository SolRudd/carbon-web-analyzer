// src/components/InputForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import globeSvg from "../assets/bubble.svg";
import { FaLeaf, FaChartLine } from "react-icons/fa";
import { API_BASE } from "../config";

export default function InputForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔍 handleSubmit start, raw url:", url);

    let site = url.trim();
    if (!site) {
      console.warn("🚨 Empty URL, aborting");
      return;
    }

    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`;
      console.log("🔄 Prepended protocol, now:", site);
    }

    setLoading(true);

    try {
      console.log("⛓️ Fetching:", `${API_BASE}/api/check-carbon`, { url: site });
      
      // Start the API call
      const apiPromise = fetch(`${API_BASE}/api/check-carbon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site }),
      });

      // Wait at least 45 seconds for the game experience
      const [res] = await Promise.all([
        apiPromise,
        new Promise(resolve => setTimeout(resolve, 15000)) // 15 seconds minimum
      ]);
      
      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON in response");
      });
      
      console.log("✅ Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      navigate(`/result/${data.slug}`);
      
    } catch (err) {
      console.error("❌ Error fetching carbon data:", err);
      alert("❌ " + err.message);
    } finally {
      console.log("⏹️ handleSubmit finished");
      setLoading(false);
    }
  };

  return (
    <section
      id="input-form"
      className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 px-4 transition-colors duration-300"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-25 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="w-full -mt-20 mb-8 pointer-events-none">
          <img
            src={globeSvg}
            alt="Stylized globe illustrating global sustainability"
            className="w-full h-auto pointer-events-none hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent">
            Estimate your web page Carbon Footprint
          </h2>
          <p className="text-center text-base font-medium text-slate-700 dark:text-slate-300 max-w-md mx-auto">
            Enter your web page address below to get started with our comprehensive environmental analysis
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-300 dark:border-white/20 p-6 rounded-2xl mx-auto max-w-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={loading}
            className="col-span-1 sm:col-span-2 h-12 p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-greenbuzz focus:border-greenbuzz transition-all duration-300 hover:shadow-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 h-12 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold text-base border-0 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl col-span-1"
          >
            {loading ? (
              <>
                <FaChartLine className="mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <FaLeaf className="mr-2" />
                Calculate
              </>
            )}
          </button>

          <p className="col-span-1 sm:col-span-3 text-center text-xs text-slate-600 dark:text-slate-400 mt-4 opacity-75">
            By using this carbon calculator, you agree to have your submitted data stored and published in our public database.
          </p>
        </form>

        {loading && <LoadingOverlay />}
      </div>
    </section>
  );
}