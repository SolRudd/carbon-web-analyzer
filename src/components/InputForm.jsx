import React, { useState } from "react";
import ResultCard from "./ResultCard";

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
      className="
        bg-white dark:bg-[#020f1e] 
        text-slate-900 dark:text-slate-300 
        py-20 px-4 
        transition-colors duration-300
      "
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          🌍 Carbon Web Checker
        </h2>
        <p className="mb-8">
          Instantly check your site’s CO₂ footprint.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
        >
          <input
            type="url"
            placeholder="Enter website URL"
            className="
              w-full sm:w-2/3 p-3 rounded-md 
              bg-white dark:bg-slate-800 
              border border-slate-300 dark:border-slate-600 
              text-slate-900 dark:text-white 
              placeholder-slate-500 dark:placeholder-slate-400 
              focus:outline-none focus:ring-2 focus:ring-green-500 
              transition
            "
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="
              w-full sm:w-auto 
              bg-green-600 hover:bg-green-500 
              text-white font-semibold 
              py-3 px-6 rounded-md 
              transition shadow
            "
          >
            {loading ? "Checking…" : "Run Check"}
          </button>
        </form>
        {result && <ResultCard result={result} />}
      </div>
    </section>
  );
};

export default InputForm;
