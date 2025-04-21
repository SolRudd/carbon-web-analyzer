import React, { useState } from "react";
import ResultCard from "./ResultCard";
import bubbleShape from "../assets/bubble.svg";

const InputForm = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5050/api/check-carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      setResult(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="input-form"
      className="relative isolate overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-20 px-4 transition-colors duration-300"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,196,113,0.12),transparent_70%)] -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Full-width SVG header */}
        <div className="w-full -mt-20 mb-12">
          <img
            src={bubbleShape}
            alt="Bubble Graphic"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="flex flex-col items-center text-center space-y-10 px-4 sm:px-0">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Estimate your web page’s carbon footprint
            </h2>
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-400">
              Check how green your hosting is and see how much CO₂ is produced per visit.<br />
              Reduce your impact with smarter code and sustainable choices.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-3xl bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300 dark:border-white/10 p-6 rounded-2xl shadow-2xl -mt-20"
          >
            <label htmlFor="url" className="sr-only">
              Your web page address
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
              className="flex-1 min-w-[200px] p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-base shadow-md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-full border border-green-600 hover:border-green-500 transition shadow-md text-base"
            >
              {loading ? "Checking…" : "Calculate"}
            </button>
          </form>

          <p className="text-xs text-slate-600 dark:text-slate-500 max-w-md">
            By using this carbon calculator, you agree to your input being used for sustainability analysis and public research.
          </p>
        </div>

        {result && (
          <div className="mt-12 w-full">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </section>
  );
};

export default InputForm;
