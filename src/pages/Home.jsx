import React from "react";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import HowItWorks from "../components/Methodology";  // ← new
import Showcase from "../components/Showcase";
import ImpactSection from "../components/ImpactSection";

const Home = () => (
  <>
    <main className="flex-grow w-full">
      <Hero />
      <InputForm />
      <HowItWorks />       {/* ← inserted here */}
      <Showcase />
      <ImpactSection />
    </main>
  </>
);

export default Home;
