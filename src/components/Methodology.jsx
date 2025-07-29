// src/components/Methodology.jsx
import React from 'react';
import { motion } from 'framer-motion'; // For animations
import WorldImage from '../assets/world.png'; // Your existing world image
import {
  ArrowRight,
  Globe,
  Calculator,
  Award,
  Lightbulb,
  CheckCircle, // Keeping CheckCircle if needed, otherwise Zap is used for "How It Works"
  Zap // Used for "How It Works" tag
} from 'lucide-react';

export default function Methodology() {
  const steps = [
    {
      icon: <Globe className="w-8 h-8 text-white group-hover:text-green-200 transition-colors" />, // Larger icons, adapted color
      title: "Enter Your URL",
      description: "Paste your website URL into our advanced analyzer for an initial scan."
    },
    {
      icon: <Calculator className="w-8 h-8 text-white group-hover:text-blue-200 transition-colors" />,
      title: "Instant Analysis",
      description: "Get real-time CO₂ calculations, energy consumption, and performance metrics."
    },
    {
      icon: <Award className="w-8 h-8 text-white group-hover:text-purple-200 transition-colors" />,
      title: "Receive Your Grade",
      description: "View your comprehensive sustainability score (A+ to F) with a detailed breakdown."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-white group-hover:text-yellow-200 transition-colors" />,
      title: "Optimize & Improve",
      description: "Apply personalized, actionable tips and recommendations for a greener website."
    }
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: steps.length * 0.1 + 0.5 } }
  };

  return (
    <section
      id="methodology"
      className="relative overflow-hidden py-20 px-4 sm:px-6 bg-white dark:bg-slate-950 transition-colors duration-300" // Use full white/slate-950 for background
    >
      {/* Dynamic Animated Background - more subtle and adapting */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-3xl animate-pulse-slow"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20 mb-6"
            variants={itemVariants}
          >
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold text-lg">How It Works</span>
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6 leading-tight"
            variants={itemVariants}
          >
            How <span className="text-green-600 dark:text-green-400">GreenTrace</span> Works
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Our intuitive system guides you through a few simple steps to accurately measure and significantly reduce your website's digital carbon footprint.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Process Steps */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="flex items-start gap-6 group" variants={itemVariants}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 group-hover:from-green-600 group-hover:to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"> {/* Larger, gradient, subtle hover scale */}
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white"> {/* Larger title */}
                      {step.title}
                    </h3>
                    <div className="text-base bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-1 rounded-full font-medium"> {/* Larger step badge */}
                      Step {index + 1}
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"> {/* Larger description */}
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Enhanced CTA */}
            <motion.div variants={ctaVariants} className="pt-6">
              <a
                href="#input-form"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/40 text-xl group" // Consistent CTA style
              >
                <Globe className="w-6 h-6" /> {/* Larger icon */}
                Run Your CO₂ Check
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /> {/* Larger icon */}
              </a>
            </motion.div>
          </motion.div>

          {/* Enhanced Illustration with WorldImage */}
          <motion.div
            className="relative flex justify-center lg:justify-end p-6" // Added padding to the container
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} // Delay to animate after steps
          >
            {/* Background glowing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse opacity-70 dark:opacity-40" />
              <div className="absolute w-72 h-72 bg-blue-400/15 rounded-full blur-2xl animate-pulse delay-500 opacity-60 dark:opacity-30" />
            </div>

            {/* World Image container with modern styling */}
            <div className="relative z-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"> {/* Added blur, border, shadow, hover effect */}
              <img
                src={WorldImage}
                alt="Diagram showing website analysis workflow"
                className="w-full h-auto max-w-sm filter drop-shadow-xl" // Ensure image adapts, consistent shadow
              />
              {/* Overlay elements (optional, for extra visual flair) */}
              <div className="absolute top-8 left-8 p-3 bg-green-500/80 rounded-full shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-8 right-8 p-3 bg-blue-500/80 rounded-full shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}