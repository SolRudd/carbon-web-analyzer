// src/components/TestCTA.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TestCTA() {
  return (
    <section className="relative overflow-hidden bg-transparent py-16 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Test another web page and see its planet impact
        </h2>
        {/* Subtext */}
        <p className="text-base text-slate-700 dark:text-slate-400">
          Jump right back to the calculator and run a new URL.
        </p>
        {/* “Calculate” button styled exactly like your InputForm */}
        <Link
          to="/#input-form"
          className="
            inline-flex items-center justify-center
            px-6 py-3 sm:px-8 sm:py-4
            bg-greenbuzz hover:bg-greenbuzz-light
            text-white dark:text-slate-900
            font-semibold text-base
            rounded-full
            border border-greenbuzz hover:border-greenbuzz-light
            transition-transform transform hover:scale-105
          "
        >
          Calculate another URL
        </Link>
      </div>
    </section>
  );
}
