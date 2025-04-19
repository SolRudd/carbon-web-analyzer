// src/components/Features.jsx
import React from "react";
import { Leaf, ShieldCheck, Globe } from "lucide-react";

const features = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Accurate CO₂ Metrics",
    description: "Based on global research and sustainable web design practices.",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Green Hosting Detection",
    description: "Detects if a site uses renewable‑powered servers.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Free & Open Source",
    description: "Built for the community. Transparent, privacy‑respecting, and open.",
  },
];

const Features = () => (
  <section
    className="
      w-full 
      bg-white dark:bg-slate-950 
      text-slate-900 dark:text-slate-100 
      py-16 px-4 
      transition-colors duration-300
    "
  >
    <div className="max-w-[1400px] mx-auto text-center space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold">
        Why Use Carbon Web Checker?
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="
              flex flex-col items-center text-center
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              rounded-2xl p-8
              shadow-lg hover:shadow-2xl
              transform hover:scale-105
              transition-all duration-300
            "
          >
            <div
              className="
                mb-4 p-4 
                bg-green-50 dark:bg-green-900 
                rounded-full
              "
            >
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
              {f.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
