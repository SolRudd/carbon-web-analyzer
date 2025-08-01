import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Zap,
  Smartphone,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from "lucide-react";

// 9 levels for flexibility!
const VIEW_OPTIONS = [1, 10, 100, 1000, 10000, 50000, 100000, 500000, 1000000];

export default function ImpactStats({ carbonPerView = 0, siteUrl }) {
  const [idx, setIdx] = useState(3); // default to 1,000 views/month for balance
  const monthlyViews = VIEW_OPTIONS[idx];

  // 1. Annual CO₂ in grams
  const annualCO2gRaw = carbonPerView * monthlyViews * 12;
  // 2. Display value in grams or kilograms for readability
  const isKg = annualCO2gRaw >= 1000;
  const displayValue = isKg
    ? (annualCO2gRaw / 1000).toFixed(2)
    : Math.round(annualCO2gRaw);
  const displayUnit = isKg ? "kg" : "g";

  // 3. Real-world equivalencies (annual)
  const equivalencies = [
    {
      icon: <Coffee className="w-8 h-8" />,
      value: Math.round(annualCO2gRaw / 18).toLocaleString(),
      label: "Cups of tea brewed",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      value: (annualCO2gRaw / 475).toFixed(1),
      label: "kWh of energy consumed",
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      value: Math.round(annualCO2gRaw / 8.22).toLocaleString(),
      label: "Smartphone charges",
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      value: (annualCO2gRaw / 21770).toFixed(2),
      label: "Trees to absorb CO₂",
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  // 4. Grade calculation for color coding the CO2 output
  const THRESHOLDS = { "A+": 0.095, A: 0.186, B: 0.341, C: 0.493, D: 0.656, E: 0.846 };
  let co2Grade = "F";
  Object.entries(THRESHOLDS).some(([g, t]) => {
    if (carbonPerView <= t) {
      co2Grade = g;
      return true;
    }
    return false;
  });

  const gradeConfig = {
    "A+": { gradient: "from-green-500 via-blue-500 to-blue-500", color: "text-green-400" },
    A: { gradient: "from-green-500 to-blue-500", color: "text-green-500" },
    B: { gradient: "from-lime-400 to-yellow-400", color: "text-lime-400" },
    C: { gradient: "from-yellow-400 to-orange-500", color: "text-yellow-400" },
    D: { gradient: "from-orange-500 to-red-500", color: "text-orange-500" },
    E: { gradient: "from-red-500 to-red-600", color: "text-red-500" },
    F: { gradient: "from-red-600 to-red-700", color: "text-red-600" },
  };
  const currentGrade = gradeConfig[co2Grade] || { gradient: "from-slate-400 to-slate-600", color: "text-slate-500" };

  // Controls
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(VIEW_OPTIONS.length - 1, i + 1));

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6, ease: "easeOut" },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 py-5 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
        <motion.div
          initial={{ scale: 0.9, rotate: 10, x: '50%', y: '-50%' }}
          animate={{ scale: 1.3, rotate: -5, x: '40%', y: '-40%' }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
          className="absolute top-1/4 right-0 w-[50rem] h-[50rem] bg-green-400/10 dark:bg-green-400/15 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.9, rotate: -10, x: '-50%', y: '50%' }}
          animate={{ scale: 1.2, rotate: 5, x: '-60%', y: '40%' }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
          className="absolute bottom-1/4 left-0 w-[40rem] h-[40rem] bg-blue-400/10 dark:bg-blue-400/15 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Section Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20 mb-6">
            <Leaf className="text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold">Climate Impact Analysis</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight tracking-tight">
            Your Annual Digital Footprint
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Change the traffic to see how much impact your site has per year at different audience sizes.
          </p>
        </motion.div>

        {/* Main Impact Card */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/20 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl mb-16"
          variants={itemVariants}
        >
          {/* Traffic Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl mb-8">
            <span className="text-base text-slate-700 dark:text-slate-300 font-semibold mr-0 sm:mr-6 mb-2 sm:mb-0">
              Monthly Website Traffic
            </span>
            <button
              onClick={prev}
              disabled={idx === 0}
              aria-label="Decrease monthly views"
              className="p-3 rounded-full bg-white dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-200" />
            </button>
            <div className="text-center flex-grow">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {monthlyViews.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                views / month
              </p>
            </div>
            <button
              onClick={next}
              disabled={idx === VIEW_OPTIONS.length - 1}
              aria-label="Increase monthly views"
              className="p-3 rounded-full bg-white dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow"
            >
              <ChevronRight className="w-6 h-6 text-slate-800 dark:text-slate-200" />
            </button>
          </div>

          {/* Main Impact Statement */}
          <div className="text-center space-y-2">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{monthlyViews.toLocaleString()} views/month × 12 months</span> <br />
              If your site gets <span className="font-semibold">{monthlyViews.toLocaleString()}</span> visitors per month, the <span className="font-semibold">annual footprint</span> for{" "}
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline underline-offset-2"
              >
                {siteUrl ? new URL(siteUrl).hostname : ""}
              </a>{" "}
              is:
            </p>
            <div className="text-5xl sm:text-7xl font-extrabold py-4">
              <span className={`bg-gradient-to-r ${currentGrade.gradient} bg-clip-text text-transparent`}>
                {displayValue}
              </span>
              <span className="text-3xl sm:text-5xl text-slate-500 dark:text-slate-400 ml-2">
                {displayUnit} CO₂
              </span>
            </div>
            <div className={`inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full border-2 border-slate-300 dark:border-slate-600 ${currentGrade.color} font-bold text-lg`}>
              Grade: {co2Grade}
            </div>
          </div>
        </motion.div>

        {/* Equivalencies Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            This is equivalent to…
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            (Each number shown below is for <span className="font-semibold">{monthlyViews.toLocaleString()}</span> views per month over a year)
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
          {equivalencies.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 transform hover:-translate-y-2 transition-all duration-300"
              variants={itemVariants}
            >
              <div className={`w-16 h-16 ${item.bgColor} ${item.color} rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4`}>
                {item.icon}
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                {item.value}
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div className="mt-24" variants={itemVariants}>
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 dark:border-green-400/20 rounded-3xl p-10 text-center">
            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Ready to Reduce Your Impact?</h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Small optimizations to your website's performance and design can lead to significant environmental benefits at scale.
            </p>
            <a
              href="https://buzzboost.co.uk/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/40 text-xl"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Get a Free Sustainability Audit
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
