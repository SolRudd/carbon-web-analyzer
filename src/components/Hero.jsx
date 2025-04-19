/* src/components/Hero.jsx */
import React from "react";
import { CheckCircle } from "lucide-react";

const Hero = () => (
  <section className="relative overflow-hidden
    bg-white dark:bg-[#020f1e]
    text-slate-900 dark:text-white
    py-32 px-4
    transition-colors duration-300
  ">
    <div className="max-w-[1400px] mx-auto text-center px-6 relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
        How Sustainable Is<br />
        Your Website or App?
      </h1>
      <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto mb-10">
        Instantly check your digital carbon footprint. Promote green hosting, lighter code, and better design.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <a
          href="#input-form"
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 shadow"
        >
          Run Your CO₂ Check
        </a>
        <a
          href="#impact"
          className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 border border-slate-300 dark:border-slate-600"
        >
          Why It Matters
        </a>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No sign-up needed. Fast, free, and open-source.
      </p>
      {/* Mini feature badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-sm text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
        {[
          "Low CO₂ per view",
          "Green host status",
          "Actionable insights",
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-2 justify-center">
            <CheckCircle className="text-green-500 w-5 h-5" />
            {text}
          </div>
        ))}
      </div>
    </div>
    {/* Background glow + noise */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] transform -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_#00c47122_0%,_transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[url('/noise.svg')] mix-blend-soft-light opacity-[0.03] bg-cover" aria-hidden="true" />
    </div>
  </section>
);

export default Hero;