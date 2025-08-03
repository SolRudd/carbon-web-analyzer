// src/pages/Home.jsx

import React, { Suspense, lazy } from "react";
import { Helmet } from 'react-helmet-async';
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";

// Lazy imports (below the fold)
const HowItWorks       = lazy(() => import("../components/Methodology"));
const WhyItMatters     = lazy(() => import("../components/WhyItMatters"));
const CompanyInfoSection = lazy(() => import("../components/CompanyInfoSection"));

const Fallback = () => <div className="sr-only">Loading…</div>;

// ✅ SEO: Schema data for the homepage
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GreenTracer",
  "url": "https://www.greentracer.org",
  // Note: Replace with a URL to your logo image
  "logo": "https://www.greentracer.org/GreenTraceLogo.png", 
  "sameAs": [
    // TODO: Add links to your social media profiles here
    // "https://twitter.com/your-profile",
    // "https://www.linkedin.com/company/your-profile"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GreenTracer",
  "url": "https://www.greentracer.org",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.greentracer.org/results?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};


const Home = () => (
  <>
    {/* ✅ SEO: Full advanced Helmet setup for the homepage */}
    <Helmet>
      {/* -- Primary Meta Tags -- */}
      <title>GreenTracer | Website Carbon Emissions Calculator</title>
      <meta name="description" content="How much carbon does your website produce? GreenTracer analyzes your site's emissions and gives you a score. Start building a greener web today." />
      <link rel="canonical" href="https://www.greentracer.org/" />

      {/* -- Open Graph / Facebook -- */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.greentracer.org/" />
      <meta property="og:title" content="GreenTracer | Website Carbon Emissions Calculator" />
      <meta property="og:description" content="Analyze your website's carbon footprint and get your GreenTracer score." />
      {/* Note: Create a great-looking image (1200x630px) for social sharing */}
      <meta property="og:image" content="https://www.greentracer.org/world" />

      {/* -- Twitter -- */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.greentracer.org/" />
      <meta property="twitter:title" content="GreenTracer | Website Carbon Emissions Calculator" />
      <meta property="twitter:description" content="Analyze your website's carbon footprint and get your GreenTracer score." />
      <meta property="twitter:image" content="https://www.greentracer.org/world" />

      {/* -- Schema.org Markup -- */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
    
    <main className="flex-grow w-full">
      <Hero />
      <InputForm />
      <Suspense fallback={<Fallback />}>
        <HowItWorks />
        <WhyItMatters />
        <CompanyInfoSection />
      </Suspense>
    </main>
  </>
);

export default Home;