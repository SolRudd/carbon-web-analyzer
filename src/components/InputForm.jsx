// src/components/InputForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay"; // Keep the existing overlay
import { FaLeaf } from "react-icons/fa"; // Keep FaLeaf for the button
import { Loader2 } from "lucide-react"; // Using lucide-react for a modern loading spinner
import { motion } from "framer-motion"; // For smoother animations
import { API_BASE } from "../config";

// ✅ Use optimized sources (AVIF → WebP → PNG)
import bubblePng from "../assets/bubble.png";
import bubbleWebp from "../assets/bubble.webp";
import bubbleAvif from "../assets/bubble.avif";

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
      alert("Please enter a valid URL.");
      return;
    }

    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`;
      console.log("🔄 Prepended protocol, now:", site);
    }

    setLoading(true);

    try {
      console.log("⛓️ Fetching:", `${API_BASE}/api/check-carbon`, { url: site });

      const apiPromise = fetch(`${API_BASE}/api/check-carbon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site }),
      });

      // Keep your “game experience” wait
      const [res] = await Promise.all([
        apiPromise,
        new Promise((resolve) => setTimeout(resolve, 15000)),
      ]);

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON in response from server.");
      });

      console.log("✅ Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status} status.`);
      }

      navigate(`/result/${data.slug}`);
    } catch (err) {
      console.error("❌ Error fetching carbon data:", err);
      alert(`Oops! Something went wrong: ${err.message}. Please try again.`);
    } finally {
      console.log("⏹️ handleSubmit finished");
      setLoading(false);
    }
  };

  // Framer Motion variants for section elements
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const globeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } },
  };

  return (
    <section
      id="input-form"
      className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 sm:py-24 px-4 transition-colors duration-300"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 dark:opacity-20 animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/10 dark:bg-blue-400/5 transform rotate-12 blur-2xl opacity-20 dark:opacity-10 animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-purple-400/10 dark:bg-purple-400/5 transform -rotate-45 blur-2xl opacity-15 dark:opacity-5 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-12">
        <motion.div
          className="w-full -mt-20 sm:-mt-16 mb-8 pointer-events-none max-w-[800px]"
          initial="hidden"
          animate="visible"
          variants={globeVariants}
        >
          {/* ✅ Modern, smaller image pipeline with fallback */}
          <picture>
            <source srcSet={bubbleAvif} type="image/avif" />
            <source srcSet={bubbleWebp} type="image/webp" />
            <img
              src={bubblePng}
              alt="Stylized globe illustrating global sustainability"
              className="w-full h-auto pointer-events-none"
              loading="lazy"
              decoding="async"
              // Optional: if you know the intrinsic dimensions, add width/height to reduce CLS further.
              // width="1600"
              // height="900"
            />
          </picture>
        </motion.div>

        <motion.div
          className="text-center space-y-6"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent">
            Uncover Your Digital Footprint
          </h2>
          <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Enter your web page address below to get a precise, real-time estimate of its environmental impact.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-300 dark:border-white/20 p-8 rounded-3xl mx-auto max-w-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <input
            id="url"
            type="text"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={loading}
            className="col-span-1 sm:col-span-2 h-14 p-5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:shadow-lg placeholder:text-slate-400 dark:placeholder:text-slate-500"
            inputMode="url"
            aria-label="Website URL"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full font-bold text-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl col-span-1"
            aria-live="polite"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin w-6 h-6" />
                Analyzing...
              </>
            ) : (
              <>
                <FaLeaf className="mr-2 w-5 h-5" />
                Calculate Impact
              </>
            )}
          </button>

          <p className="col-span-1 sm:col-span-3 text-center text-sm text-slate-600 dark:text-slate-400 mt-4 opacity-85">
            By using this carbon calculator, you agree to have your submitted data processed for analysis and potentially published in our public database for transparency.
          </p>
        </motion.form>

        {loading && <LoadingOverlay />}
      </div>
    </section>
  );
}
