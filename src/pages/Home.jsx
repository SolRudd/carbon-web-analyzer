// src/pages/Home.jsx
import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import Footer from "../components/Footer";
import Features from "../components/Features"; // or adjust the path if it's elsewhere


const Home = () => (
  <div className="bg-slate-950 text-white min-h-screen flex flex-col">
    <Header />

    <main className="flex-grow">
      <Hero />
      <InputForm />
      <Features /> {/* 👈 New section here */}
    </main>

    <Footer />
  </div>
);

export default Home;




