// src/pages/HowItWorks.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
    description: "We check the Green Web Foundation database to verify if your site runs on renewable energy. Green hosts receive a 9% emissions reduction credit.",
    icon: <FaLeaf className="text-2xl" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
    details: [
      "Real-time Green Web Foundation API call",
      "Renewable energy certification check",
      "9% carbon reduction for green hosts",
      "Global hosting provider database"
    ]
  },
  {
    title: "Page Weight Analysis",
    description: "Using Google's PageSpeed Insights API, we measure your total page weight including all resources: images, CSS, JavaScript, fonts, and third-party content.",
    icon: <FaRuler className="text-2xl" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700",
    details: [
      "Google PageSpeed Insights integration",
      "Total byte weight calculation",
      "All resource types included",
      "Real browser loading simulation"
    ]
  },
  {
    title: "Energy Consumption Calculation",
    description: "We convert your page size to energy consumption using the industry-standard 0.81 kWh per GB, covering both data center processing and network transmission.",
    icon: <FaBolt className="text-2xl" />,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    details: [
      "0.81 kWh/GB energy intensity factor",
      "Data center + network energy included",
      "Megabytes to kilowatt-hours conversion",
      "Industry-standard calculations"
    ]
  },
  {
    title: "CO₂ Emissions Estimation",
    description: "Energy consumption is multiplied by the global electricity carbon intensity (442g CO₂/kWh) to calculate grams of CO₂ produced per page view.",
    icon: <FaSmog className="text-2xl" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    details: [
      "442g CO₂/kWh global average intensity",
      "Per-page-view carbon calculation",
      "Green hosting discount applied",
      "Precise to 2 decimal places"
    ]
  },
  {
    title: "Performance Grading & Benchmarking",
    description: "Your CO₂ result is assigned a grade (A+ to F) and compared against our database to show how you rank against other websites tested.",
    icon: <FaTrophy className="text-2xl" />,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-700",
    details: [
      "A+ to F grade assignment",
      "Percentile ranking calculation",
      "Comparison with global database",
      "Performance improvement suggestions"
    ]
  },
  {
    title: "Persistent Data Storage",
    description: "Results are permanently stored in our PostgreSQL database, enabling badge generation, historical tracking, and API access for your carbon data.",
    icon: <FaDatabase className="text-2xl" />,
    color: "from-teal-500 to-green-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-700",
    details: [
      "PostgreSQL permanent storage",
      "24-hour data caching",
      "Historical trend tracking",
      "Badge API integration"
    ]
  }
];

const techSpecs = [
  { 
    label: "Energy Intensity", 
    value: "0.81 kWh/GB", 
    description: "Industry standard for data transfer energy" 
  },
  { 
    label: "Carbon Intensity", 
    value: "442g CO₂/kWh", 
    description: "Global average electricity carbon intensity" 
  },
  { 
    label: "Green Host Discount", 
    value: "9% Reduction", 
    description: "Carbon savings for renewable energy hosting" 
  },
  { 
    label: "Data Retention", 
    value: "24 Hours", 
    description: "Fresh data cache duration" 
  }
];

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(null);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 bg-greenbuzz/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-greenbuzz/20 dark:border-green-400/20">
            <FaCog className="text-greenbuzz dark:text-green-400 animate-spin" />
            <span className="text-greenbuzz dark:text-green-400 font-semibold">Behind the Scenes</span>
          </div>

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
              <span className="text-sm font-medium">PostgreSQL Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
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

      {/* Process Steps */}
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
                {/* Step Header */}
                <div className="flex items-start gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Expandable Details */}
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

                {/* Connection Line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-14 bottom-0 w-0.5 h-8 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-600 transform translate-y-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow Visualization */}
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
                Our Node.js backend calculates carbon footprint using scientific formulas
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <FaDatabase className="text-3xl text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Storage</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                PostgreSQL ensures your results are permanently stored and accessible
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
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
  );
}