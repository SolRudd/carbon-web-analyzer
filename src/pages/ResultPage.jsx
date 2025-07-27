import React, { useState, useEffect } from 'react';
import { useParams, Link }         from 'react-router-dom';
import LoadingOverlay              from '../components/LoadingOverlay';
import ResultCard                  from '../components/ResultCard';
import ResultDetails               from '../components/ResultDetails';
import ImpactStats                 from '../components/ImpactStats';
import ImpactSection               from '../components/ImpactSection';
import BadgePromo                  from '../components/BadgePromo';
import TestCTA                     from '../components/TestCTA';

export default function ResultPage() {
  const { slug } = useParams();
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/results/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error(`Server ${r.status}`);
        return r.json();
      })
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(()=>setLoading(false));
  }, [slug]);

  const handleRetest = async () => {
    if (!result?.url) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/check-carbon', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: result.url })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error||`Server ${r.status}`);
      setResult(data);
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
        <Link to="/" className="underline text-greenbuzz">Back Home</Link>
      </div>
    );

  return (
    <section className="py-16 px-4 min-h-screen bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-4xl space-y-12">
        <ResultCard    result={result} onRetest={handleRetest} />
        <ResultDetails
          carbonEstimate={+result.carbonEstimate}
          greenHost={!!result.greenHost}
          reductionPct={+result.reductionPct}
          grade={result.grade}
          percentile={result.percentile}
        />
        <ImpactStats   carbonPerView={+result.carbonEstimate} siteUrl={result.url} grade={result.grade} />
        <ImpactSection />
        <BadgePromo    siteUrl={result.url} />
        <TestCTA />
      </div>
    </section>
  );
}
