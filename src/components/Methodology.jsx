import React from 'react';
import WorldImage from '../assets/world.png';

export default function Methodology() {
  return (
    <section
      id="methodology"
      className="py-20 px-4 bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Text Content */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
            How <span className="text-greenbuzz">GreenTrace</span> Works
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-prose">
            Follow these simple steps to accurately measure and reduce your website’s carbon footprint:
          </p>
          <ol className="list-decimal list-inside space-y-4 text-base md:text-lg text-slate-700 dark:text-slate-300">
            <li>Paste your website URL into the input form above.</li>
            <li>Click <strong>Calculate</strong> to generate an instant CO₂ estimate per page view.</li>
            <li>View your carbon grade (A+–F) and green hosting confirmation.</li>
            <li>Apply our tailored optimization tips for a truly greener web.</li>
          </ol>
          <a
            href="#input-form"
            className="inline-block mt-4 px-6 py-3 bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold rounded-full transition-colors duration-200 text-base"
          >
            Run Your CO₂ Check
          </a>
        </div>

        {/* Illustration */}
        <div className="relative flex justify-center md:justify-end">
          {/* Subtle green glow behind image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 bg-glow-green blur-3xl" />
          </div>
          <img
            src={WorldImage}
            alt="Workflow: URL → CO₂ rating → optimization tips"
            className="relative w-full max-w-md h-auto"
          />
        </div>
      </div>
    </section>
  );
}
