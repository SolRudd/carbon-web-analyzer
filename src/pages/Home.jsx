// src/pages/Home.jsx
import React from "react";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import Showcase from "../components/Showcase";
import ImpactSection from "../components/ImpactSection";

const Home = () => (
  <div className="bg-slate-950 text-white min-h-screen flex flex-col">
    <main className="flex-grow w-full">
      <Hero />
      <InputForm />
      <Showcase />
      <ImpactSection />
    </main>
  </div>
);

export default Home;
