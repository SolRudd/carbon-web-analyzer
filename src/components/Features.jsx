import React from "react";
import { Leaf, ShieldCheck, Globe } from "lucide-react"; // you can swap for any icons

const features = [
  {
    icon: <Globe className="w-8 h-8 text-green-500" />,
    title: "Accurate CO₂ Metrics",
    description: "Based on global research and sustainable web design practices.",
  },
  {
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    title: "Green Hosting Detection",
    description: "Detects if a site uses renewable-powered servers.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
    title: "Free & Open Source",
    description: "Built for the community. Transparent, privacy-respecting, and open.",
  },
];

const Features = () => (
  <section className="bg-slate-950 py-20 px-6">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Use Carbon Web Checker?</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md hover:shadow-lg transition-all text-left flex flex-col items-center text-center"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;


