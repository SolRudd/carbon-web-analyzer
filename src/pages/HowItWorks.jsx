// src/pages/HowItWorks.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  FaGlobe, 
  FaLeaf, 
  FaRuler, 
  FaBolt, 
  FaSmog, 
  FaTrophy,
  FaDatabase,
  FaExternalLinkAlt,
  FaCog,
  FaChartLine,
  FaServer,
  FaNetworkWired
} from "react-icons/fa";

const steps = [
  // ... (Your steps array is perfect, no changes needed)
  {
    title: "URL Parsing & Domain Extraction",
    description: "We intelligently parse your URL, clean trailing slashes, and extract the hostname for precise analysis. Our system handles all URL formats automatically.",
    icon: <FaGlobe className="text-2xl" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
    details: [
      "Automatic protocol detection (http/https)",
      "Trailing slash normalization", 
      "Subdomain and path handling",
      "Invalid URL error protection"
    ]
  },
  {
    title: "Green Hosting Verification",
    description: "We check the Green Web Foundation to verify renewable-energy hosting. Green hosts receive an overall ~8% reduction by applying a 25% improvement to the data-centre portion only.",
    icon: <FaLeaf className="text-2xl" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
    details: [
      "Real-time Green Web Foundation API call",
      "Renewable energy certification check",
      "25% cleaner data-centre → ~8% overall reduction",
      "Global hosting provider database"
    ]
  },
  {
    title: "Page Weight Analysis",
    description: "Using Google's PageSpeed Insights API, we measure total page weight across all resources: images, CSS, JavaScript, fonts, and third-party content.",
    icon: <FaRuler className="text-2xl" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700",
    details: [
      "Google PageSpeed Insights integration",
      "Takes the larger of desktop & mobile",
      "All resource types included",
      "HTML-only fallback estimator if PSI is unavailable"
    ]
  },
  {
    title: "Energy Consumption Calculation",
    description: "We convert page size to energy using the SWDM split: total 0.197 kWh/GB made up of data-centre, network, and user-device portions.",
    icon: <FaBolt className="text-2xl" />,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    details: [
      "SWDM total: 0.197 kWh/GB",
      "Breakdown: 0.060 DC, 0.014 Network, 0.123 User",
      "Megabytes → kilowatt-hours conversion",
      "Green-host saving applied to DC portion only"
    ]
  },
  {
    title: "CO₂ Emissions Estimation",
    description: "Energy consumption is multiplied by the global electricity carbon intensity (442 g CO₂/kWh) to calculate grams of CO₂ per page view.",
    icon: <FaSmog className="text-2xl" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    details: [
      "442 g CO₂/kWh global average intensity",
      "Per-page-view carbon calculation",
      "Green hosting reflected in DC share",
      "Rounded to 2 decimals for readability"
    ]
  },
  {
    title: "Performance Grading & Benchmarking",
    description: "Your CO₂ result is assigned a grade (A+ to F) and compared against our dataset to show how you rank versus other websites tested.",
    icon: <FaTrophy className="text-2xl" />,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-700",
    details: [
      "A+ to F grade assignment",
      "Percentile ranking calculation",
      "Comparison with global results",
      "Actionable performance suggestions"
    ]
  },
  {
    title: "Persistent Data Storage",
    description: "Results are stored in PostgreSQL (Supabase) with a 24-hour cache window for re-checks, enabling badge generation, historical views, and API access for your carbon data.",
    icon: <FaDatabase className="text-2xl" />,
    color: "from-teal-500 to-green-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-700",
    details: [
      "PostgreSQL (Supabase) persistent storage",
      "24-hour caching to avoid noisy re-tests",
      "Historical trend tracking (roadmap)",
      "Badge & public API integration"
    ]
  }
];

const techSpecs = [
  // ... (Your techSpecs array is perfect, no changes needed)
  { 
    label: "Energy Intensity", 
    value: "0.197 kWh/GB (SWDM)", 
    description: "0.060 DC • 0.014 Network • 0.123 User" 
  },
  { 
    label: "Carbon Intensity", 
    value: "442 g CO₂/kWh", 
    description: "Global average electricity carbon intensity" 
  },
  { 
    label: "Green Host Effect", 
    value: "~8% Overall", 
    description: "25% cleaner data-centre portion → ~8% overall" 
  },
  { 
    label: "Data Retention", 
    value: "24 Hours", 
    description: "Cache window before fresh re-check" 
  }
];

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": steps.map(step => ({
      "@type": "Question",
      "name": step.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": step.description
      }
    }))
  };

  return (
    <>
      {/* ✅ SEO: Final Helmet setup with all tags */}
      <Helmet>
        {/* -- Primary Meta Tags -- */}
        <title>How It Works | GreenTracer's Methodology</title>
        <meta name="description" content="A transparent look at our 7-step scientific process for measuring website carbon emissions, from hosting verification to CO₂ calculation." />
        <link rel="canonical" href="https://www.greentracer.org/how-it-works" />
        
        {/* -- Open Graph / Facebook -- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/how-it-works" />
        <meta property="og:title" content="How It Works | GreenTracer's Methodology" />
        <meta property="og:description" content="A transparent look at our 7-step scientific process for measuring website carbon emissions." />
        <meta property="og:image" content="https://www.greentracer.org/your-social-share-image.jpg" />

        {/* -- Twitter -- */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/how-it-works" />
        <meta property="twitter:title" content="How It Works | GreenTracer's Methodology" />
        <meta property="twitter:description" content="A transparent look at our 7-step scientific process for measuring website carbon emissions." />
        <meta property="twitter:image" content="https://www.greentracer.org/your-social-share-image.jpg" />

        {/* -- Schema.org Markup -- */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 pointer-events-none">
            {/* ✅ Performance: Added 'motion-safe' to respect user settings */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 motion-safe:animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 motion-safe:animate-pulse motion-safe:delay-1000" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-greenbuzz/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-greenbuzz/20 dark:border-green-400/20">
              {/* ✅ Performance: Added 'motion-safe' to respect user settings */}
              <FaCog className="text-greenbuzz dark:text-green-400 motion-safe:animate-spin" />
              <span className="text-greenbuzz dark:text-green-400 font-semibold">Behind the Scenes</span>
            </div>
            {/* ... The rest of your JSX is perfect, no other changes needed ... */}
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-greenbuzz to-green-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              How GreenTrace Works
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A transparent, scientific approach to measuring your website's environmental impact. 
              Every calculation is based on industry standards and real-world data.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/20">
                <FaServer className="text-greenbuzz dark:text-green-400" />
                <span className="text-sm font-medium">Google PageSpeed API</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/20">
                <FaLeaf className="text-greenbuzz dark:text-green-400" />
                <span className="text-sm font-medium">Green Web Foundation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/20">
                <FaDatabase className="text-greenbuzz dark:text-green-400" />
                <span className="text-sm font-medium">PostgreSQL (Supabase)</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {techSpecs.map((spec, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl font-bold text-greenbuzz dark:text-green-400 mb-2">
                    {spec.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {spec.label}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {spec.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Our 7-Step Analysis Process
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Each website analysis follows this precise methodology to ensure accurate, 
                consistent carbon footprint measurements.
              </p>
            </div>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative bg-white dark:bg-slate-800 rounded-2xl border-2 ${step.borderColor} p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 relative">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                      {expandedStep === index && (
                        <div className={`mt-6 p-4 ${step.bgColor} rounded-xl border ${step.borderColor}`}>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                            Key Features:
                          </h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`} />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button className="mt-4 text-greenbuzz dark:text-green-400 font-medium hover:underline flex items-center gap-2">
                        {expandedStep === index ? 'Show Less' : 'Learn More'}
                        <FaChartLine className={`transform transition-transform duration-200 ${expandedStep === index ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The rest of the page components are unchanged */}
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Data Flow & Integration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <FaNetworkWired className="text-3xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">External APIs</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Google PageSpeed Insights & Green Web Foundation provide real-time data
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <FaCog className="text-3xl text-greenbuzz mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Processing Engine</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Node.js backend using SWDM (0.197 kWh/GB) and 442 g CO₂/kWh; green-host effect applied to the DC share
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <FaDatabase className="text-3xl text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Data Storage</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  PostgreSQL (Supabase) with a 24-hour cache; powers public badges and result pages
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                Ready to Test Your Website?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Get your detailed carbon footprint analysis in under 30 seconds. 
                See exactly how our process works with your own website.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/#input-form"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaChartLine className="mr-2" />
                  Analyze My Website
                </Link>
                <Link
                  to="/badge"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-greenbuzz text-greenbuzz hover:bg-greenbuzz hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaLeaf className="mr-2" />
                  Get the Badge
                </Link>
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Questions about our methodology? Check out our{" "}
                <Link to="/blog" className="text-greenbuzz dark:text-green-400 hover:underline font-semibold">
                  detailed blog posts
                </Link>{" "}
                or view our{" "}
                <a 
                  href="https://github.com/yourusername/greentracer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-greenbuzz dark:text-green-400 hover:underline font-semibold inline-flex items-center"
                >
                  open source code <FaExternalLinkAlt className="ml-1 text-xs" />
                </a>
              </p>
              <Link
                to="/"
                className="inline-block text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}