// src/components/Hero.jsx
import React from "react";
import { CheckCircle } from "lucide-react";

const Hero = () => (
  <section className="bg-[#020f1e] text-white py-32 px-4 relative overflow-hidden">
    <div className="max-w-[1400px] mx-auto text-center px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
        Check Your Website’s Carbon Footprint.
      </h1>
      <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
        Use Carbon Web Checker to measure and reduce your site's environmental impact.
        A cleaner internet starts with awareness.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <a
          href="#input-form"
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-md transition shadow"
        >
          Run Your CO₂ Check
        </a>
        <a
          href="#impact"
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-md transition border border-slate-600"
        >
          Learn Why It Matters
        </a>
      </div>

      <p className="text-sm text-slate-400">No sign-up needed. Fast, free, and open-source.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 text-sm text-slate-300 max-w-3xl mx-auto">
        {[
          "High-impact CO₂ analysis",
          "Supports green hosting awareness",
          "Built for transparency + trust",
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-2 justify-center">
            <CheckCircle className="text-green-500 w-5 h-5" />
            {text}
          </div>
        ))}
      </div>
    </div>

{/* Subtle glow + fake sparkles using radial and noise texture */}
<div className="absolute inset-0 z-0 pointer-events-none">
  {/* Green spotlight radial glow */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#00c47133_0%,_transparent_60%)]" />

  {/* Optional grainy sparkle (optional if you want extra subtle texture) */}
  <div
    className="absolute inset-0 mix-blend-soft-light opacity-[0.03] bg-[url('/noise.svg')] bg-cover"
    aria-hidden="true"
  />
</div>

  </section>
);

export default Hero;

