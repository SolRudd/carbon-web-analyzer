// src/pages/HowItWorks.jsx
import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Data Transfer Over the Wire",
    description: "When a page loads, we measure how much data travels from the server to the user to estimate energy use.",
  },
  {
    title: "Energy Intensity of Web Data",
    description: "We apply an average energy‑per‑GB factor that accounts for data centers, network infrastructure, and devices.",
  },
  {
    title: "Green Hosting Verification",
    description: "We use the Green Web Foundation to check if your host runs on renewable energy; green hosts earn an emissions credit.",
  },
  {
    title: "Carbon Intensity of Electricity",
    description: "Our model uses global grid averages, adjusting for detected renewable‑powered infrastructure.",
  },
  {
    title: "Traffic Volume",
    description: "Multiply page‑load emissions by your monthly or annual traffic to see the full impact.",
  },
  {
    title: "Bonus: Repeat Visitors",
    description: "Cached assets on repeat visits lower data transfer, and we factor that reduction into your score.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="
        bg-white dark:bg-slate-900
        text-slate-900 dark:text-white
        py-20 px-4
        transition-colors duration-300
      "
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="
          text-4xl md:text-5xl font-extrabold text-center
          text-green-600 dark:text-green-400
        ">
          How GreenTrace Works
        </h1>
        <p className="
          text-lg text-center
          text-slate-700 dark:text-slate-300
        ">
          Crunch the numbers, measure your site’s carbon footprint, and get actionable insights to reduce your digital impact.
        </p>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="
                bg-slate-100 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                rounded-lg p-6
                transition-colors duration-200
              "
            >
              <h2 className="
                text-2xl font-semibold mb-2
                text-slate-900 dark:text-white
              ">
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
            className="
              inline-block bg-green-600 hover:bg-green-500
              text-white font-semibold
              py-3 px-6 rounded-md
              transition-colors duration-200
            "
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
