// src/pages/Faq.jsx
import React from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How does the carbon checker calculate emissions?",
    answer:
      "We measure the data transferred per page view, apply energy intensity factors, and adjust for renewable hosting to estimate CO₂ per visit.",
    emoji: "💡",
  },
  {
    question: "Why should I care about website carbon footprint?",
    answer:
      "Every byte transferred online consumes energy. Optimizing for efficiency reduces your site's environmental impact and improves performance for users.",
    emoji: "🌱",
  },
  {
    question: "My host isn't showing as green, what gives?",
    answer:
      "We rely on the Green Web Foundation database. If your provider isn’t listed or you’re behind a CDN, the green status may not appear.",
    emoji: "🚫",
  },
  {
    question: "Why don't results update immediately after changes?",
    answer:
      "Results are cached for 7 days to limit unnecessary rechecks. If you need fresh data sooner, use our upcoming 'Retest' button.",
    emoji: "🔄",
  },
  {
    question: "Can I display my carbon score on my site?",
    answer:
      "Absolutely! Use our embeddable badge snippet or API to showcase your site's sustainability to visitors.",
    emoji: "🔗",
  },
  {
    question: "Do you offer advanced sustainability reports?",
    answer:
      "Yes—soon we'll launch in-depth site audits and custom reports to help you dive deeper into optimization opportunities.",
    emoji: "🧪",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      className={
        "bg-white dark:bg-slate-950 " +
        "text-slate-900 dark:text-white " +
        "py-20 px-4 md:px-8 " +
        "transition-colors duration-300"
      }
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-greenbuzz dark:text-greenbuzz-light">
            Got Questions? We've Got Answers!
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 mt-4">
            Everything you need to know about measuring and reducing your website's carbon footprint.
          </p>
        </div>

        {/* Grid of FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={
                "bg-slate-100 dark:bg-slate-800 rounded-lg p-6 " +
                "transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {item.question}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className={
              "inline-block bg-greenbuzz hover:bg-greenbuzz-light text-white " +
              "font-semibold py-3 px-6 rounded-full transition-colors duration-200"
            }
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
