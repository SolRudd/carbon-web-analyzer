// src/routes/ResultPage.jsx - FINAL, COMPLETE CODE

import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import your components (adjust paths if you need to)
import LoadingOverlay from '../components/LoadingOverlay';
import ResultCard from '../components/ResultCard';
import ResultDetails from '../components/ResultDetails';
import ImpactStats from '../components/ImpactStats';
import ImpactSection from '../components/ImpactSection';
import CompanyInfoSection from "../components/CompanyInfoSection";
import BadgePromo from '../components/BadgePromo';
import TestCTA from '../components/TestCTA';
import { API_BASE } from '../config';

const INDEX_RESULTS_FLAG = String(import.meta.env.VITE_INDEX_RESULTS || '').toLowerCase() === 'true';

// A simple component to show errors on this page
function ErrorDisplay({ message }) {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-500">Error</h1>
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
      <Link to="/" className="underline text-green-600 dark:text-green-400 mt-6 inline-block">
        &larr; Back to Homepage
      </Link>
    </div>
  );
}

export default function ResultPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    // THIS IS THE FIX: This asks the "smart" question to the server.
    fetch(`${API_BASE}/api/trace-or-check?site=${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Could not find a report for this URL. Please try testing it from the homepage.');
        }
        return res.json();
      })
      .then(data => {
        setResult(data);
      })
      .catch(err => {
        console.error("Failed to fetch result:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleRetest = () => {
    fetchData();
  };

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorDisplay message={error} />;
  if (!result) return <ErrorDisplay message="Result data is unavailable." />;

  const shouldIndex = INDEX_RESULTS_FLAG;
  const canonical = `https://www.greentracer.org${location.pathname}`;
  const pageTitle = `Carbon Report for ${result.url} | GreenTracer`;
  const pageDescription = `An automated carbon footprint analysis for ${result.url}, showing a score of ${result.carbonEstimate}g CO₂e per page view and a grade of ${result.grade}.`;
  
  const reportSchema = shouldIndex ? {
    "@context": "https://schema.org",
    "@type": "Report",
    "name": `Website Carbon Report for ${result.url}`,
    "description": pageDescription,
    "url": canonical,
    "author": { "@type": "Organization", "name": "GreenTracer" },
    "datePublished": new Date(result.timestamp).toISOString(),
    "reportNumber": result.id
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"} />
        <meta name="googlebot" content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
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
            carbonEstimate={result.carbonEstimate}
            greenHost={result.greenHost}
            reductionPct={result.reductionPct}
            grade={result.grade}
            percentile={result.percentile}
          />
          <ImpactStats 
            carbonPerView={result.carbonEstimate} 
            siteUrl={result.url} 
            grade={result.grade} 
          />
          <ImpactSection />
          <BadgePromo siteUrl={result.url} greenHost={!!result.greenHost} />
          <TestCTA />
        </div>
        <div className="mt-24">
          <CompanyInfoSection />
        </div>
      </section>
    </>
  );
}
