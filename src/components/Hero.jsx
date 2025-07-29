import React from "react";
import { Globe, Leaf, Zap, Heart, ScanLine, Server, Gauge, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

// This new array describes the analysis process, telling a story.
const analysisFeatures = [
  {
    icon: <ScanLine className="w-8 h-8 text-blue-500" />,
    title: "Comprehensive Analysis",
    description: "We crawl your site to measure data transfer, network requests, and asset sizes."
  },
  {
    icon: <Server className="w-8 h-8 text-green-500" />,
    title: "Green Hosting Verification",
    description: "Our system checks if your server runs on verifiably renewable energy sources."
  },
  {
    icon: <Gauge className="w-8 h-8 text-purple-500" />,
    title: "Accurate CO₂ Calculation",
    description: "Using the latest models, we convert page weight into a precise CO₂ per-visit estimate."
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    title: "Actionable Insights",
    description: "Receive a tailored report with clear, practical steps to reduce your digital footprint."
  }
];

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Effects (unchanged, they work well) */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-green-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-blue-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse delay-1000" />
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

        {/* ============================================ */}
        {/* === NEW & IMPROVED "ANALYSIS SHOWCASE" === */}
        {/* ============================================ */}
        <motion.div
          className="w-full max-w-6xl mx-auto mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-600/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {analysisFeatures.map((feature, idx) => (
                <React.Fragment key={idx}>
                  <motion.div className="flex flex-col items-center text-center gap-3" variants={itemVariants}>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      {feature.icon}
                    </div>
                    <h3 className="text-md font-bold text-slate-900 dark:text-white mt-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px]">
                      {feature.description}
                    </p>
                  </motion.div>
                  {/* Render a connector line between items */}
                  {idx < analysisFeatures.length - 1 && (
                    <motion.div
                      className="flex-1 h-px w-full md:w-auto md:h-auto bg-slate-200 dark:bg-slate-700"
                      variants={itemVariants}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ==================================== */}
        {/* === UPGRADED "QUICK STATS" CARDS === */}
        {/* ==================================== */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800" variants={itemVariants}>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">4%</div>
            <div className="mt-1 font-semibold text-slate-700 dark:text-slate-300">Global Emissions</div>
            <p className="text-xs text-slate-500 mt-2">The internet's carbon footprint rivals the entire aviation industry.</p>
          </motion.div>
          <motion.div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800" variants={itemVariants}>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">100% Free</div>
            <div className="mt-1 font-semibold text-slate-700 dark:text-slate-300">Open Source</div>
            <p className="text-xs text-slate-500 mt-2">Built for the community, by the community. No hidden fees.</p>
          </motion.div>
          <motion.div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800" variants={itemVariants}>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">5 Seconds</div>
            <div className="mt-1 font-semibold text-slate-700 dark:text-slate-300">Instant Results</div>
            <p className="text-xs text-slate-500 mt-2">Get your complete carbon report and actionable insights in seconds.</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}