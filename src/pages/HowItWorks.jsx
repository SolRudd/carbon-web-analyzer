// src/pages/HowItWorks.jsx
import React from "react";
import { Link } from "react-router-dom";

// Internal workings steps with titles and descriptions
const steps = [
  {
    title: "URL Domain Extraction",
    description: (
      <>We parse the URL to isolate the <strong>domain</strong> for hosting verification.</>
    ),
  },
  {
    title: "Green Hosting Check",
    description: (
      <>We call the <strong>Green Web Foundation API</strong> to verify renewable-energy hosting (green hosts earn an emissions credit).</>
    ),
  },
  {
    title: "Page Size Measurement",
    description: (
      <>Using <strong>Puppeteer</strong>, we load your page and sum all resource transfer sizes (via <code>performance</code> entries) to get total bytes transferred.</>
    ),
  },
  {
    title: "Convert to Energy",
    description: (
      <>We convert bytes → gigabytes and multiply by <strong>0.81 kWh/GB</strong> (data centre + network energy intensity).</>
    ),
  },
  {
    title: "Calculate CO₂ Emissions",
    description: (
      <>We multiply energy used by <strong>442 gCO₂/kWh</strong> (global average intensity) for grams of CO₂ per page view.</>
    ),
  },
  {
    title: "Assign Carbon Grade",
    description: (
      <>Your grams-per-view result is translated into a grade (<strong>A+–F</strong>) based on predefined thresholds.</>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-20 px-4 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-greenbuzz dark:text-greenbuzz-light">
          How GreenTrace Works Internally
        </h1>
        <p className="text-lg text-center text-slate-700 dark:text-slate-300">
          A transparent look at every step— from raw data to your final carbon grade.
        </p>

        <div className="space-y-6">
          {steps.map((step, i) => {
            const stepId = `step-${i + 1}`;
            return (
              <div
                key={i}
                id={stepId}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 sm:p-6 flex items-start gap-4 transition-colors duration-200"
              >
                {/* Number badge */}
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-greenbuzz text-white rounded-full font-bold">
                  {i + 1}
                </span>

                {/* Step content */}
                <div>
                  <h2 className="text-2xl font-semibold mb-1 text-slate-900 dark:text-white">
                    {step.title}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calls to action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4	mt-12">
          <Link
            to="/badge"
            className="px-6 py-3 bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold rounded-full transition-transform hover:scale-105"
          >
            Embed the Verification Badge
          </Link>
          <Link
            to="/api-access"
            className="px-6 py-3 border-2 border-greenbuzz text-greenbuzz hover:bg-greenbuzz hover:text-white rounded-full transition-colors"
          >
            View API Access
          </Link>
        </div>

        {/* Back home */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="text-slate-600 dark:text-slate-400 underline hover:text-slate-800 dark:hover:text-white"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
