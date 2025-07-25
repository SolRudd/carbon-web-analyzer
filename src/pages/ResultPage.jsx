import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import ResultCard from "../components/ResultCard";
import ResultDetails from "../components/ResultDetails";
import ImpactStats from "../components/ImpactStats";
import ImpactSection from "../components/ImpactSection";
import BadgePromo from "../components/BadgePromo";
import TestCTA from "../components/TestCTA";

// Pull in your Vercel env var or default to relative
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function ResultPage() {
  const { slug } = useParams();
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Fetch cached result on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/results/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server ${res.status}`);
        return res.json();
      })
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Manual re‑test (cached trace)
  const handleRetest = async () => {
    if (!result?.url) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/trace?site=${encodeURIComponent(result.url)}`
      );
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const fresh = await res.json();
      setResult(fresh);
    } catch (err) {
      alert("Re‑test failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Error: {error}</p>
        <Link to="/" className="text-greenbuzz underline">
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="mx-auto max-w-4xl space-y-12">
        <ResultCard result={result} onRetest={handleRetest} />
        <ResultDetails
          carbonEstimate={Number(result.carbonEstimate)}
          greenHost={Boolean(result.greenHost)}
          reductionPct={Number(result.reductionPct)}
          grade={result.grade}
          percentile={result.percentile}
        />
        <ImpactStats
          carbonPerView={Number(result.carbonEstimate)}
          siteUrl={result.url}
          grade={result.grade}
        />
        <ImpactSection />
        <BadgePromo siteUrl={result.url} />
        <TestCTA />
      </div>
    </section>
  );
}
