// src/pages/HowItWorks.jsx
import React from "react";
import { Link } from "react-router-dom";

// Steps reflect the exact backend process
const steps = [
  {
    title: "URL Domain Extraction",
    description: "We parse your URL to isolate the domain for hosting verification.",
  },
  {
    title: "Green Hosting Check",
    description: "We call the Green Web Foundation API to see if your host runs on renewable energy—green hosts earn an emissions credit.",
  },
  {
    title: "Page Size Measurement",
    description: "Using Puppeteer, we load your page and sum all resource transfer sizes (via performance entries) to get total bytes transferred.",
  },
  {
    title: "Convert to Energy Used",
    description: "We convert bytes to gigabytes and multiply by 0.81 kWh/GB (data center + network energy intensity).",
  },
  {
    title: "Calculate CO₂ Emissions",
    description: "We multiply energy used by 442 gCO₂/kWh (global average carbon intensity) for grams of CO₂ per page view.",
  },
  {
    title: "Assign Carbon Grade",
    description: "Your grams per view translate to a grade (A+ through F) based on set thresholds for easy benchmarking.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-20 px-4 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center text-greenbuzz dark:text-greenbuzz-light"
        >
          How GreenTrace Works Internally
        </h1>
        <p className="text-lg text-center text-slate-700 dark:text-slate-300">
          A transparent look at how we derive your carbon footprint score from raw data to a simple grade.
        </p>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 transition-colors duration-200"
            >
              <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">
                {i + 1}. {step.title}
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
