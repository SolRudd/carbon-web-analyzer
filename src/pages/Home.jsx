import React, { Suspense, lazy } from "react";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";

// Lazy imports (below the fold)
const HowItWorks       = lazy(() => import("../components/Methodology"));
const WhyItMatters     = lazy(() => import("../components/WhyItMatters"));
const CompanyInfoSection = lazy(() => import("../components/CompanyInfoSection"));

const Fallback = () => <div className="sr-only">Loading…</div>;

const Home = () => (
  <>
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
