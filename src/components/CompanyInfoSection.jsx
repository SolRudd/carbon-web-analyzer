// src/components/CompanyInfoSection.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Rocket, Code, Search, BarChart, Sparkles, ArrowRight } from "lucide-react";

// Import tri-format logo assets (created by npm run img:all)
import buzzboostPng from "../assets/buzzboost.png";
import buzzboostWebp from "../assets/buzzboost.webp";
import buzzboostAvif from "../assets/buzzboost.avif";

const serviceHighlights = [
  {
    icon: <Code className="w-8 h-8 text-green-500 dark:text-green-400" aria-hidden="true" />,
    title: "Sustainable Web Design",
    description: "Building high-performance, visually stunning, and eco-friendly websites from the ground up."
  },
  {
    icon: <Search className="w-8 h-8 text-blue-500 dark:text-blue-400" aria-hidden="true" />,
    title: "Eco-Conscious SEO",
    description: "Optimizing your online visibility to drive targeted traffic responsibly, with green practices at its core."
  },
  {
    icon: <BarChart className="w-8 h-8 text-purple-500 dark:text-purple-400" aria-hidden="true" />,
    title: "Impactful Digital Strategy",
    description: "Crafting comprehensive digital marketing strategies that deliver measurable results and reduce your carbon footprint."
  }
];

export default function CompanyInfoSection() {
  const prefersReduced = useReducedMotion();

  const containerVariants = prefersReduced
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.1, duration: 0.6, ease: "easeOut" }
        }
      };

  const itemVariants = prefersReduced
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <section
      id="company-info"
      className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      role="region"
      aria-labelledby="company-info-heading"
    >
      {/* Decorative background (not announced) */}
      <div className="absolute inset-0 opacity-10 dark:opacity-15" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        {!prefersReduced && (
          <>
            <motion.div
              initial={{ scale: 0.8, rotate: 0, x: "-50%", y: "-50%" }}
              animate={{ scale: 1.2, rotate: 10, x: "-40%", y: "-60%" }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
              className="absolute top-1/4 left-1/4 w-[50rem] h-[50rem] bg-green-400/10 dark:bg-green-400/15 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ scale: 0.8, rotate: 0, x: "50%", y: "50%" }}
              animate={{ scale: 1.1, rotate: -15, x: "60%", y: "40%" }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
              className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-blue-400/10 dark:bg-blue-400/15 rounded-full blur-3xl"
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Side: Agency Introduction and CTA */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={containerVariants}
        >
          {/* Agency Logo (AVIF/WebP/PNG with lazy loading) */}
          <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-6">
            <a
              href="https://buzzboost.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block p-4 bg-slate-100/50 dark:bg-white/10 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <picture>
                <source type="image/avif" srcSet={buzzboostAvif} />
                <source type="image/webp" srcSet={buzzboostWebp} />
                <img
                  src={buzzboostPng}
                  alt="BuzzBoost Digital"
                  loading="lazy"
                  decoding="async"
                  className="h-20 md:h-24 w-auto"
                />
              </picture>
            </a>
          </motion.div>

          <motion.h2
            id="company-info-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Powered by Sustainable Digital Excellence
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            variants={itemVariants}
          >
            This Carbon Web Checker is a testament to our commitment at{" "}
            <a
              href="https://buzzboost.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            >
              BuzzBoost Digital
            </a>{" "}
            to a greener internet. We don't just measure impact; we help you create a sustainable and
            successful online presence.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4">
            <a
              href="https://buzzboost.co.uk/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/40 text-xl"
            >
              <Rocket className="w-6 h-6 mr-3" aria-hidden="true" />
              Boost Your Green Digital Presence
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Service Highlights / Pillars */}
        <motion.div
          className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 rounded-3xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {serviceHighlights.map((service, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-start text-left bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md transform hover:-translate-y-2 transition-transform duration-300"
              variants={itemVariants}
            >
              <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}

          {/* Dedicated callout */}
          <motion.div
            className="flex flex-col items-start text-left bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md transform hover:-translate-y-2 transition-transform duration-300"
            variants={itemVariants}
          >
            <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
              <Sparkles className="w-8 h-8 text-yellow-500 dark:text-yellow-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Ready for a Brighter Digital Future?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Our team of experts is ready to transform your online presence with cutting-edge, sustainable strategies.
            </p>
            <a
              href="https://buzzboost.co.uk/services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors group"
            >
              Explore Our Services
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
