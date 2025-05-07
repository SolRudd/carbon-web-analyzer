import React, { useState, useEffect } from "react";
import { useParams, Link }           from "react-router-dom";
import LoadingOverlay                 from "../components/LoadingOverlay";
import ResultCard                     from "../components/ResultCard";

export default function ResultPage() {
  const { slug }            = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // 1) load cached result
  useEffect(() => {
    fetch(`/api/result/${slug}`)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(setResult)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // 2) re-test live
  const handleRetest = async () => {
    if (!result?.url) return;
    setLoading(true);
    try {
      const r = await fetch(
        `/api/trace?site=${encodeURIComponent(result.url)}`
      );
      if (!r.ok) throw new Error(r.statusText);
      setResult(await r.json());
    } catch (e) {
      alert("Re-test failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        <p>Error: {error}</p>
        <Link to="/" className="text-greenbuzz underline">Back Home</Link>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* everything lives inside the card now */}
        <ResultCard result={result} onRetest={handleRetest} />
      </div>
    </section>
  );
}
