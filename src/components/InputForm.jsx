// src/components/InputForm.jsx
import React, { useState } from "react";

function InputForm() {
  const [url, setUrl] = useState("");

  return (
    <section className="bg-[#020f1e] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          🌍 Carbon Web Checker
        </h2>
        <p className="text-slate-300 mb-8">
          Instantly check your site’s CO₂ footprint.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Scanned: ${url}`);
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <input
            type="url"
            placeholder="Enter website URL"
            className="w-full sm:w-2/3 p-3 rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Run Check
          </button>
        </form>
      </div>
    </section>
  );
}

export default InputForm;
