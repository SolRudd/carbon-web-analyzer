// src/pages/Home.jsx
import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import Showcase from "../components/Showcase";
import ImpactSection from "../components/ImpactSection";
import Footer from "../components/Footer";

const Home = () => (
  <div className="bg-slate-950 text-white min-h-screen flex flex-col">
    <Header />

    <main className="flex-grow w-full">
      {/* Each section component should handle its own internal padding & container width */}
      <Hero />
      <InputForm />
      <Showcase />
      <ImpactSection />
    </main>

    <Footer />
  </div>
);

export default Home;
