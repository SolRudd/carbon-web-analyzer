// src/pages/ResultPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link }        from "react-router-dom";
import LoadingOverlay             from "../components/LoadingOverlay";
import ResultCard                 from "../components/ResultCard";
import ResultDetails              from "../components/ResultDetails";
import ImpactStats                from "../components/ImpactStats";
import ImpactSection              from "../components/ImpactSection";
import BadgePromo                 from "../components/BadgePromo";
import TestCTA                    from "../components/TestCTA";  // ← Make sure this import is here

export default function ResultPage() {
  const { slug } = useParams();
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Fetch cached result
  useEffect(() => {
    setLoading(true);
    fetch(`/api/results/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server ${res.status}`);
        return res.json();
      })
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Manual re-test
  const handleRetest = async () => {
    if (!result?.url) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/trace?site=${encodeURIComponent(result.url)}`
      );
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const fresh = await res.json();
      setResult(fresh);
    } catch (err) {
      alert("Re-test failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading & error states
  if (loading) return <LoadingOverlay />;
  if (error) return (
    <div className="text-center py-20 text-red-500">
      <p>Error: {error}</p>
      <Link to="/" className="text-greenbuzz underline">Back Home</Link>
    </div>
  );

  // Main render
  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="mx-auto max-w-4xl space-y-12">

        {/* Top-level summary card */}
        <ResultCard result={result} onRetest={handleRetest} />

        {/* Detailed breakdown */}
        <ResultDetails
          carbonEstimate={Number(result.carbonEstimate)}
          greenHost={Boolean(result.greenHost)}
          reductionPct={Number(result.reductionPct)}
          grade={result.grade}
          percentile={result.percentile}
        />

        {/* Impact statistics */}
        <ImpactStats
          carbonPerView={Number(result.carbonEstimate)}
          siteUrl={result.url}
          grade={result.grade}
        />

        {/* Impact section */}
        <ImpactSection />

        {/* Website Carbon Badge promo */}
        <BadgePromo siteUrl={result.url} />

        {/* Test another page CTA */}
        <TestCTA />

      </div>
    </section>
  );
}
