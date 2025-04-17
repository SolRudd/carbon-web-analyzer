// src/components/InputForm.jsx
import React, { useState } from "react";
import LoadingOverlay from "./LoadingOverlay";
import ResultCard from "./ResultCard";

function InputForm() {
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

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Carbon check failed:", error);
      alert("Failed to check. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}

      <section className="bg-[#020f1e] py-16 px-4" id="input-form">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🌍 Carbon Web Checker
          </h2>
          <p className="text-slate-300 mb-8">
            Instantly check your site’s CO₂ footprint.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              type="url"
              placeholder="Enter website URL"
              className="w-full sm:w-2/3 p-3 rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-md transition"
            >
              {loading ? "Checking..." : "Run Check"}
            </button>
          </form>

          {result && <ResultCard result={result} />}
        </div>
      </section>
    </>
  );
}

export default InputForm;
