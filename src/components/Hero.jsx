import React from "react";
import { Globe, Leaf, ShieldCheck } from "lucide-react";

const heroFeatures = [
  { icon: <Globe className="w-6 h-6 text-green-400" />, title: "Low CO₂", description: "Under 0.5g per visit." },
  { icon: <Leaf className="w-6 h-6 text-green-400" />, title: "Green Hosting", description: "Real-time renewable check." },
  { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, title: "Insights", description: "Tips to optimize your site." },
];

export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center text-center
      bg-white dark:bg-slate-950
      text-slate-900 dark:text-white
      pt-16 pb-10 transition-colors duration-300 overflow-hidden"
    >
      {/* Pill Tag */}
      <div className="mb-4 relative z-10">
        <span className="bg-green-400/20 text-green-900 dark:text-green-300 px-4 py-1 rounded-full uppercase text-s tracking-wide">
          Carbon Web Checker
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-0 max-w-2xl space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          How Sustainable Is Your Website or App?
        </h1>
        <p className="text-lg sm:text-xl md:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
          Instantly measure your site’s carbon footprint—fast, free, and open-source.
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 pb-7 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#input-form"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition-transform transform hover:scale-105"
          >
            🌍 Run Your CO₂ Check
          </a>
          <a
            href="#impact"
            className="px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-full transition-colors"
          >
            Why It Matters
          </a>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {heroFeatures.map((f, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2">
              {f.icon}
              <h3 className="text-base md:text-lg font-semibold">{f.title}</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 text-center">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
