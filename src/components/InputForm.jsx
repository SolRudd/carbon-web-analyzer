import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import { FaLeaf } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { API_BASE } from "../config";

// THIS IS THE FIX: A helper function to clean and standardize URLs before testing.
// It removes 'www.' to ensure consistency.
function normalizeUrl(inputUrl) {
  let url = inputUrl.trim();
  if (!url) return '';
  if (!/^(https?:\/\/)/i.test(url)) {
    url = `https://${url}`;
  }
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname.startsWith('www.')) {
      urlObject.hostname = urlObject.hostname.substring(4);
    }
    return urlObject.origin + urlObject.pathname.replace(/\/+$/, '');
  } catch {
    return inputUrl; // Fallback for any invalid URLs
  }
}


export default function InputForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // We use the new helper function here to clean the URL
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const apiPromise = fetch(`${API_BASE}/api/check-carbon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // We send the clean, standardized URL to the backend
        body: JSON.stringify({ url: cleanUrl }),
      });

      const [res] = await Promise.all([
        apiPromise,
        new Promise((resolve) => setTimeout(resolve, 2000)), // Minimum 2s loading time for UX
      ]);

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON response from server.");
      });

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status} status.`);
      }

      navigate(`/result/${data.slug}`);
    } catch (err) {
      console.error("❌ Error fetching carbon data:", err);
      alert(`Oops! Something went wrong: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section
      id="input-form"
      className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 sm:py-24 px-4 transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-10">
        <div className="text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent">
            Run a Website Sustainability Report
          </h2>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test any page to generate a report with carbon impact, hosting verification status, and trust-ready outputs for your team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-5 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 rounded-3xl shadow-[0_20px_60px_-36px_rgba(15,23,42,0.5)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              id="url"
              type="text"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
              className="col-span-1 sm:col-span-2 h-14 px-5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              inputMode="url"
              aria-label="Website URL"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_10px_28px_-16px_rgba(22,163,74,0.8)] col-span-1"
              aria-live="polite"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin w-5 h-5" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FaLeaf className="mr-2 w-4 h-4" />
                  Run Test
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 text-sm">
            <a href="https://buzzboost.co.uk/contact/" target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-300">
              Book a website review
            </a>
            <Link to="/badge" className="text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-300">
              Explore trust badges
            </Link>
            <Link to="/how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-300">
              Understand methodology
            </Link>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 opacity-90">
            By using this carbon calculator, you agree to have your submitted data processed for analysis and potentially published in our public database for transparency.
          </p>
        </form>

        {loading && <LoadingOverlay />}
      </div>
    </section>
  );
}
