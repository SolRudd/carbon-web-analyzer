// src/components/TestCTA.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";

export default function TestCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 py-20 px-4 transition-colors duration-300">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-400/20 blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 blur-2xl opacity-25 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Gradient Title */}
        <h2
          className="
            text-4xl sm:text-5xl md:text-6xl font-extrabold
            bg-gradient-to-r from-slate-900 via-green-600 to-blue-600
            bg-clip-text text-transparent leading-tight
          "
        >
          Test another web page & see its planetary impact
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Jump right back to the calculator and run a new URL—instantly view its
          carbon footprint and grade.
        </p>

        {/* CTA Button */}
        <Link
          to="/#input-form"
          className="
            inline-flex items-center justify-center gap-2
            px-8 py-4
            bg-gradient-to-r from-green-600 to-green-600
            hover:from-green-700 hover:to-green-500
            text-white font-semibold
            rounded-full shadow-lg
            transform hover:scale-105 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
          "
        >
          <ArrowRightCircle className="w-5 h-5" />
          Calculate another URL
        </Link>
      </div>
    </section>
  );
}