// src/components/ImpactSection.jsx
import React from "react";
import { motion } from "framer-motion";
import GreenWebLogo   from "../assets/greenweb.svg";
import KrystalLogo    from "../assets/krystal.svg";
import GitHubLogo     from "../assets/github.png";
import WordPressLogo  from "../assets/wordpress.png";
import { Handshake, ArrowRightCircle } from "lucide-react";

const partners = [
  { src: GreenWebLogo,   alt: "The Green Web Foundation" },
  { src: KrystalLogo,    alt: "Krystal Hosting" },
  { src: GitHubLogo,     alt: "GitHub" },
  { src: WordPressLogo,  alt: "WordPress" },
];

export default function ImpactSection() {
  return (
    <section
      id="impact"
      className="
        relative overflow-hidden
        w-full
        bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950
        text-slate-900 dark:text-white
        py-16 px-4 md:px-8
        transition-colors duration-300
      "
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-green-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 right-1/2 translate-x-1/2 w-[24rem] h-[24rem] bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        {/* Headline & icon */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="inline-flex items-center gap-2 text-green-500 dark:text-green-400 text-3xl md:text-4xl font-extrabold mb-1">
            <Handshake className="w-8 h-8 mr-1" />  
            Partnered for Positive Impact
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Collaboration that Drives Greener Results
          </h2>
          <p className="mt-2 text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            We’re not just a digital agency—we’re part of a movement. <span className="font-semibold text-green-600 dark:text-green-400">BuzzBoost Digital</span> works hand-in-hand with the best sustainable tech partners to help you achieve your low-carbon goals, prove your credentials, and contribute to a better internet.
          </p>
        </motion.div>

        {/* Partner logos */}
        <motion.div
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 my-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.09, duration: 0.6 } }
          }}
        >
          {partners.map(({ src, alt }, i) => (
            <motion.div
              key={i}
              className="
                bg-white dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                rounded-xl p-3
                flex items-center justify-center
                shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105
                min-h-[60px]
              "
              whileHover={{ scale: 1.08 }}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-10 w-auto dark:filter dark:brightness-0 dark:invert transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-2 mt-6"
        >
          <span className="text-base md:text-lg font-semibold mb-2">
            Ready to make a real impact?
          </span>
          <a
            href="https://buzzboost.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore BuzzBoost Digital
            <ArrowRightCircle className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
