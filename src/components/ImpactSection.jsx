// src/components/ImpactSection.jsx
import React from "react";
import { motion } from "framer-motion"; // Import motion for animations
import GreenWebLogo   from "../assets/greenweb.svg";
import KrystalLogo    from "../assets/krystal.svg";
import GitHubLogo     from "../assets/github.png";
import WordPressLogo  from "../assets/wordpress.png";
import { ArrowRightCircle } from "lucide-react"; // For a more modern arrow icon

const partners = [
  { src: GreenWebLogo,   alt: "The Green Web Foundation" },
  { src: KrystalLogo,     alt: "Krystal Hosting" },
  { src: GitHubLogo,      alt: "GitHub" },
  { src: WordPressLogo,   alt: "WordPress" },
];

export default function ImpactSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      id="impact"
      className="
        relative overflow-hidden // Added for background effects
        w-full
        bg-white dark:bg-slate-950 // Main section background
        text-slate-900 dark:text-white
        py-20 px-4 md:px-8
        transition-colors duration-300
      "
    >
      {/* Subtle Background Effects (similar to other sections for consistency) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
        >
          Partnering for a Sustainable Digital Future
        </motion.h2>

        {/* Intro copy */}
        <motion.p
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-slate-700 dark:text-slate-300" // Ensure text color adapts
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
        >
          Work with **BuzzBoost Digital**, on-demand web development experts in
          sustainable design and performance optimization. Let’s achieve
          your low-carbon goals and help contribute to a greener web.
        </motion.p>

        {/* Logo Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {partners.map(({ src, alt }, i) => (
            <motion.div
              key={i}
              className="
                bg-slate-100/50 dark:bg-slate-800/50 // Adapting background for cards
                border border-gray-200 dark:border-slate-700
                p-4 rounded-xl
                flex items-center justify-center
                shadow-md hover:shadow-xl
                transition-all duration-200 hover:scale-105 // Added scale on hover
              "
              variants={itemVariants}
            >
              <img
                src={src}
                alt={alt}
                className={`
                  ${i === 0 ? "max-h-10" : "max-h-12"} w-auto
                  transition-filter duration-300
                  ${alt === "The Green Web Foundation" || alt === "Krystal Hosting" ? "" : "dark:filter dark:brightness-0 dark:invert"} // Only invert if the logo isn't already green/white
                `}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Work-with-us CTA */}
        <motion.div
          className="mt-12 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h3
            className="text-2xl font-semibold text-slate-800 dark:text-white" // Ensure text color adapts
            variants={itemVariants}
          >
            Ready to make a real impact? Let’s connect!
          </motion.h3>
          <motion.a
            href="https://buzzboost.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 // Dynamic gradient for CTA
              text-white font-bold
              px-8 py-4 rounded-full
              transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/40 // Enhanced hover effects
            "
            variants={itemVariants}
          >
            Explore BuzzBoost Digital
            <ArrowRightCircle className="ml-3 w-5 h-5" /> {/* Modern icon */}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}