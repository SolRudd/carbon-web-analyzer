// src/pages/ResultPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import ResultCard     from "../components/ResultCard";
import ResultDetails  from "../components/ResultDetails";
import ImpactStats    from "../components/ImpactStats";
import ImpactSection  from "../components/ImpactSection";
import BadgePromo     from "../components/BadgePromo";
import TestCTA        from "../components/TestCTA";
import { API_BASE }   from "../config";  // ← use shared config

export default function ResultPage() {
  const { slug } = useParams();
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // 1) Fetch cached result on mount
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

  // 2) Manual “Re‑test”
  const handleRetest = async () => {
    if (!result?.url) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/check-carbon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.url })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server ${res.status}`);
      }
      const fresh = await res.json();
      setResult(fresh);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (error)  
    return (
      <div className="text-center py-20 text-red-600">
        <p>Error: {error}</p>
        <Link to="/" className="underline text-green-600">Back Home</Link>
      </div>
    );

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-900 min-h-screen">
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
