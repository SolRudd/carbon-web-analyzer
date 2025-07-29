// src/pages/Home.jsx
import React from "react";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import HowItWorks from "../components/Methodology"; // Your existing "How It Works" component
import WhyItMatters from "../components/WhyItMatters"; // The newly crafted "Why It Matters" section
//import Showcase from "../components/Showcase";
//import ImpactSection from "../components/ImpactSection";
import CompanyInfoSection from "../components/CompanyInfoSection"; // <--- CORRECTED PATH HERE!

const Home = () => (
  <>
    <main className="flex-grow w-full">
      <Hero />
      <InputForm />
      <HowItWorks />
      <WhyItMatters /> {/* This is where your new, creative "Why It Matters" section is placed */}
      <CompanyInfoSection />
    </main>
  </>
);

export default Home;