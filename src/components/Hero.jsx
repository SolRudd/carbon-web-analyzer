import React from "react";
import { Globe, Leaf, Zap, Heart } from "lucide-react"; // Removed unused icons
import { motion } from "framer-motion"; // motion is still used for the main container or other elements if you keep animation

export default function Hero() {
  // Removed containerVariants and itemVariants as they were only used for the sections being removed

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Effects (unchanged, they work well) */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute top-0 left-0 w-[50rem] h-[30rem] bg-green-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[30rem] bg-blue-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center pt-20 pb-16 px-4">
        {/* Pill Badge (unchanged) */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide text-sm">
              Carbon Web Checker
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Gradient Title (unchanged) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight tracking-tight">
            How Sustainable Is Your Website?
          </h1>

          {/* Description (unchanged) */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Instantly measure your site's carbon footprint—fast, free, and open-source. 
            Join the movement for a greener internet.
          </p>

          {/* CTA Buttons (unchanged) */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
              href="#input-form"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
            >
              <Globe className="w-5 h-5 mr-2" />
              Run Your CO₂ Check
            </a>
            <a
              href="#impact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full font-semibold transition-all duration-300"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Why It Matters
            </a>
          </div>

          {/* Credit Badge (unchanged) */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">
                Built by{" "}
                <a
                  href="https://buzzboost.co.uk"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BuzzBoost Digital
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}