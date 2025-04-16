import React from "react";

const ImpactSection = () => {
  return (
    <section id="impact" className="bg-slate-900 text-white py-20 px-4 md:px-8 w-full">
      <div className="max-w-[1400px] mx-auto text-center space-y-16">
        {/* Heading + Intro */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Impact 🌱</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            This tool was created by <strong>BuzzBoost Digital</strong> to inspire sustainable web practices.
            We believe the internet should be fast, accessible, and low-carbon. We're working towards becoming a certified B Corp.
          </p>
        </div>

        {/* Brand Logo Grid (Placeholder for now) */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {["Lavazza", "Volkswagen", "Unilever", "BBC"].map((brand, index) => (
            <div
              key={index}
              className="bg-slate-800 text-slate-300 w-36 h-20 flex items-center justify-center rounded-md shadow-md text-sm font-medium"
            >
              {brand}
            </div>
          ))}
        </div>

        {/* CTA Back to Form */}
        <div>
          <a
            href="#input-form"
            className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Run Your Own Check
          </a>
        </div>

        {/* Quote / Signature */}
        <blockquote className="italic text-slate-400 text-base max-w-xl mx-auto">
          "The web should serve people and the planet. Let’s code a cleaner future."
        </blockquote>

        {/* Optional: BuzzBoost Logo */}
        {/* 
        <img 
          src="/your-logo-path/buzzboost-logo.svg" 
          alt="BuzzBoost Digital Logo" 
          className="mx-auto mt-6 h-10 opacity-80" 
        /> 
        */}
      </div>
    </section>
  );
};

export default ImpactSection;

