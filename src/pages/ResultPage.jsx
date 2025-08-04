// src/routes/ResultPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingOverlay from '../components/LoadingOverlay';
import ResultCard from '../components/ResultCard';
import ResultDetails from '../components/ResultDetails';
import ImpactStats from '../components/ImpactStats';
import ImpactSection from '../components/ImpactSection';
import CompanyInfoSection from "../components/CompanyInfoSection";
import BadgePromo from '../components/BadgePromo';
import TestCTA from '../components/TestCTA';
import { API_BASE } from '../config';

const INDEX_RESULTS_FLAG =
  String(import.meta.env.VITE_INDEX_RESULTS || '').toLowerCase() === 'true';

export default function ResultPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/results/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error(`Could not find a report for this URL. Please test it first.`);
        return r.json();
      })
      .then(data => { if (alive) setResult(data); })
      .catch(err => { if (alive) setError(err.message); })
      .finally(()=> alive && setLoading(false));

    return () => { alive = false; };
  }, [slug]);

  const handleRetest = async () => {
    if (!result?.url) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/api/check-carbon`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
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

  if (error) {
    return (
      <>
        <Helmet>
          <title>Report Not Found</title>
          <meta name="robots" content="noindex,nofollow,noarchive" />
          <meta name="googlebot" content="noindex,nofollow,noarchive" />
        </Helmet>
        <div className="text-center py-20 text-red-600 dark:text-red-500">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <Link to="/" className="underline text-greenbuzz mt-4 inline-block">Back Home</Link>
        </div>
      </>
    );
  }

  // Index gate
  const shouldIndex = INDEX_RESULTS_FLAG;

  // Canonical always matches the live route (handles /result or /results)
  const canonical = `https://www.greentracer.org${location.pathname}`;

  const reportSchema = shouldIndex ? {
    "@context": "https://schema.org",
    "@type": "Report",
    "name": `Website Carbon Report for ${result.url}`,
    "description": `An automated carbon footprint analysis for ${result.url}, showing a score of ${result.carbonEstimate}g CO₂e per page view and a grade of ${result.grade}.`,
    "url": canonical,
    "author": { "@type": "Organization", "name": "GreenTracer" },
    "datePublished": result.timestamp,
    "reportNumber": result.id
  } : null;

  return (
    <>
      <Helmet>
        <meta
          name="robots"
          content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"}
        />
        <meta
          name="googlebot"
          content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"}
        />

        <title>{`Carbon Report for ${result.url} | GreenTracer`}</title>
        <meta
          name="description"
          content={`View the detailed carbon footprint report for ${result.url}. Scored ${result.carbonEstimate}g CO₂e per page view with a grade of ${result.grade}.`}
        />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content={shouldIndex ? "article" : "website"} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={`Carbon Report for ${result.url} | GreenTracer`} />
        <meta property="og:description" content={`Scored ${result.carbonEstimate}g CO₂e per page view with a grade of ${result.grade}.`} />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={`Carbon Report for ${result.url} | GreenTracer`} />
        <meta property="twitter:description" content={`Scored ${result.carbonEstimate}g CO₂e per page view with a grade of ${result.grade}.`} />
        <meta property="twitter:image" content="https://www.greentracer.org/GreenFavi.png" />

        {reportSchema && (
          <script type="application/ld+json">
            {JSON.stringify(reportSchema)}
          </script>
        )}
      </Helmet>

      <section className="py-16 px-4 min-h-screen bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl space-y-12">
          <ResultCard result={result} onRetest={handleRetest} />
          <ResultDetails
            carbonEstimate={+result.carbonEstimate}
            greenHost={!!result.greenHost}
            reductionPct={+result.reductionPct}
            grade={result.grade}
            percentile={result.percentile}
          />
          <ImpactStats carbonPerView={+result.carbonEstimate} siteUrl={result.url} grade={result.grade} />
          <ImpactSection />
          <BadgePromo siteUrl={result.url} />
          <TestCTA />
        </div>
        <div className="mt-24">
          <CompanyInfoSection />
        </div>
      </section>
    </>
  );
}
