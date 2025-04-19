import React from "react";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import Showcase from "../components/Showcase";
import ImpactSection from "../components/ImpactSection";

const Home = () => (
  <>
    <main className="flex-grow w-full">
      <Hero />
      <InputForm />
      <Showcase />
      <ImpactSection />
    </main>
  </>
);

export default Home;

