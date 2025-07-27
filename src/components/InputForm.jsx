// src/components/InputForm.jsx
import React, { useState } from "react";
import { useNavigate }      from "react-router-dom";
import LoadingOverlay       from "./LoadingOverlay";
import globeSvg             from "../assets/bubble.svg";
import { FaLeaf }           from "react-icons/fa";
import { API_BASE }         from "../config";

export default function InputForm() {
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let site = url.trim();
    if (!site) return;

    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), 40_000);

      const res = await fetch(`${API_BASE}/api/check-carbon`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: site }),
        signal:  controller.signal
      });
      clearTimeout(timer);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server ${res.status}`);

      navigate(`/result/${data.slug}`);
    } catch (err) {
      console.error("Error fetching carbon data:", err);
      if (err.name === "AbortError") {
        alert("⏱️ Request timed out. Please try again in a minute.");
      } else {
        alert("❌ " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen flex flex-col items-center">
      <img src={globeSvg} alt="" className="w-64 mb-8" />
      <h1 className="text-3xl font-bold mb-4">Estimate your web page Carbon Footprint</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={loading}
          className="col-span-2 p-4 rounded-full border"
        />
        <button
          type="submit"
          disabled={loading}
          className="col-span-1 bg-green-600 text-white rounded-full flex items-center justify-center"
        >
          <FaLeaf className="mr-2" />
          {loading ? "Checking…" : "Calculate"}
        </button>
      </form>

      {loading && <LoadingOverlay />}
    </section>
  );
}
