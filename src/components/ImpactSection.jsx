import React from "react";

const ImpactSection = () => (
  <section
    id="impact"
    className="
      w-full 
      bg-white dark:bg-slate-900 
      text-slate-900 dark:text-white 
      py-20 px-4 md:px-8 
      transition-colors duration-300
    "
  >
    <div className="max-w-[1400px] mx-auto text-center space-y-16">
      {/* Heading + Intro */}
      <div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Built for Impact <span role="img" aria-label="seedling">🌱</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-slate-700 dark:text-slate-300">
          This tool was created by <strong>BuzzBoost Digital</strong> to inspire sustainable web practices.
          We believe the internet should be fast, accessible, and low-carbon. We're working towards becoming a certified B Corp.
        </p>
      </div>

      {/* Brand Logo Grid */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {["Lavazza", "Volkswagen", "Unilever", "BBC"].map((brand, i) => (
          <div
            key={i}
            className="
              w-36 h-20 
              flex items-center justify-center 
              rounded-md shadow-md 
              bg-slate-100 dark:bg-slate-800 
              text-slate-700 dark:text-slate-300 
              font-medium text-sm 
              transition-colors duration-300
            "
          >
            {brand}
          </div>
        ))}
      </div>

      {/* CTA Back to Form */}
      <div>
        <a
          href="#input-form"
          className="
            inline-block 
            bg-green-600 hover:bg-green-500 
            text-white font-semibold 
            px-6 py-3 rounded-md 
            transition
          "
        >
          Run Your Own Check
        </a>
      </div>

      {/* Quote / Signature */}
      <blockquote className="italic text-base max-w-xl mx-auto text-slate-600 dark:text-slate-400">
        "The web should serve people and the planet. Let’s code a cleaner future."
      </blockquote>
    </div>
  </section>
);

export default ImpactSection;

