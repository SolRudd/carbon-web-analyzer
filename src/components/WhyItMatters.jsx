// src/components/WhyItMatters.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Fuel, // For fossil fuels
  CloudDrizzle, // For heavy data transfer
  Cpu, // For inefficient processing
  Trash2, // For digital waste
  Wind, // For renewable energy
  Feather, // For lightweight assets
  Rocket, // For performance/efficiency
  Recycle, // For circular economy
  Sparkles, // For the "aha" moment
  Scaling, // For tangible scale
  Smartphone, // For device charging
  Car // For driving
} from "lucide-react";

// The "Problem" path
const problemPoints = [
  {
    title: "Fossil-Fueled Servers",
    description: "Most of the internet runs on data centers powered by a fossil-fuel-heavy energy grid, operating 24/7.",
    icon: <Fuel className="w-10 h-10 text-red-500" />,
    color: "red"
  },
  {
    title: "Massive Data Transfer",
    description: "Large, unoptimized images, videos, and scripts are sent across the globe, consuming enormous amounts of energy.",
    icon: <CloudDrizzle className="w-10 h-10 text-orange-500" />,
    color: "orange"
  },
  {
    title: "Inefficient Processing",
    description: "Bloated code forces users' devices to work harder, draining batteries and demanding more electricity from the grid.",
    icon: <Cpu className="w-10 h-10 text-yellow-500" />,
    color: "yellow"
  }
];

// The "Solution" path, directly countering the problems
const solutionPoints = [
  {
    title: "Renewable-Powered Hosting",
    description: "Choose hosts that run on 100% renewable energy like wind, solar, and hydro to power your site cleanly.",
    icon: <Wind className="w-10 h-10 text-green-500" />,
    color: "green"
  },
  {
    title: "Optimized & Lean Assets",
    description: "By compressing assets and using modern formats, we can cut page size by over 70%, saving vast amounts of energy.",
    icon: <Feather className="w-10 h-10 text-teal-500" />,
    color: "teal"
  },
  {
    title: "Performance-First Design",
    description: "Clean, efficient code respects the user's device, providing a faster experience and a lower carbon footprint.",
    icon: <Rocket className="w-10 h-10 text-blue-500" />,
    color: "blue"
  }
];

export default function WhyItMatters() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };
  
  const glowColors = {
    red: "shadow-red-500/20",
    orange: "shadow-orange-500/20",
    yellow: "shadow-yellow-500/20",
    green: "shadow-green-500/20",
    teal: "shadow-teal-500/20",
    blue: "shadow-blue-500/20",
  };
  
  return (
    <section id="impact" className="relative bg-slate-50 dark:bg-slate-950 py-24 px-4 transition-colors duration-300">
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.1),_transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(59,130,246,0.1),_transparent_40%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Section Title Block */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The Two Paths of the Web
          </motion.h2>
          <motion.p 
            className="max-w-3xl mx-auto mt-6 text-lg text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Every website makes a choice. It can follow the path of digital excess, or it can choose a sustainable, efficient future. Here's what that choice looks like.
          </motion.p>
        </div>

        {/* The Two Paths Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Column 1: The Problem */}
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-3xl font-bold text-center text-red-600 dark:text-red-500">The High-Carbon Web</h3>
            {problemPoints.map((point, index) => (
              <motion.div
                key={index}
                className={`group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:${glowColors[point.color]} transition-all duration-300 transform hover:-translate-y-1`}
                variants={itemVariants}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{point.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{point.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Column 2: The Solution */}
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
             <h3 className="text-3xl font-bold text-center text-green-600 dark:text-green-500">The Sustainable Web</h3>
             {solutionPoints.map((point, index) => (
              <motion.div
                key={index}
                className={`group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:${glowColors[point.color]} transition-all duration-300 transform hover:-translate-y-1`}
                variants={itemVariants}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{point.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{point.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* NEW "Tangible Impact" Section */}
        <div className="max-w-4xl mx-auto mt-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Making It Tangible
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                So what does reducing website CO₂ actually mean? Let's break it down. Saving just <strong className="text-green-600 dark:text-green-400">1 kg of CO₂</strong> from your website's annual emissions is equivalent to:
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={containerVariants}
            >
              <motion.div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800" variants={itemVariants}>
                <Scaling className="w-8 h-8 mx-auto mb-3 text-blue-500"/>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">~3,100 hours</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">of boiling a kettle</div>
              </motion.div>
              <motion.div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800" variants={itemVariants}>
                <Smartphone className="w-8 h-8 mx-auto mb-3 text-green-500"/>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">~122,000</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">smartphone charges</div>
              </motion.div>
              <motion.div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800" variants={itemVariants}>
                <Car className="w-8 h-8 mx-auto mb-3 text-red-500"/>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">~4.5 miles</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">driven in a typical car</div>
              </motion.div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}