// src/components/ResultDetails.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaDesktop, 
  FaServer, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaArrowRight,
  FaLeaf,
  FaGlobe,
  FaLightbulb,
  FaRocket,
  FaExternalLinkAlt
} from "react-icons/fa";

export default function ResultDetails({
  carbonEstimate = 0,
  greenHost,
  reductionPct = 0,
}) {
  // 1) CO₂ per view
  const co2 = Number(carbonEstimate).toFixed(2);

  // 2) Hosting savings
  const DEFAULT_POTENTIAL = 0.09;
  const actualRaw = Number(reductionPct) || 0;
  const actualSavePct = Math.round(actualRaw <= 1 ? actualRaw * 100 : actualRaw);
  const potentialSavePct = Math.round(DEFAULT_POTENTIAL * 100);
  const savePct = greenHost ? actualSavePct : potentialSavePct;

  // 3) Grade thresholds → colour
  const THRESHOLDS = { "A+": 0.095, A: 0.186, B: 0.341, C: 0.493, D: 0.656, E: 0.846 };
  let co2Grade = "F";
  Object.entries(THRESHOLDS).some(([g, t]) => {
    if (carbonEstimate <= t) {
      co2Grade = g;
      return true;
    }
    return false;
  });

  const gradeConfig = {
    "A+": {
      gradient: "from-green-500 via-emerald-500 to-blue-500",
      color: "text-green-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    A: {
      gradient: "from-green-500 to-green-600",
      color: "text-green-500",
      bgGradient: "from-green-500/10 to-green-600/10"
    },
    B: {
      gradient: "from-lime-400 to-yellow-500",
      color: "text-lime-500",
      bgGradient: "from-lime-400/10 to-yellow-500/10"
    },
    C: {
      gradient: "from-yellow-400 to-orange-500",
      color: "text-yellow-500",
      bgGradient: "from-yellow-400/10 to-orange-500/10"
    },
    D: {
      gradient: "from-orange-500 to-red-500",
      color: "text-orange-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    },
    E: {
      gradient: "from-red-500 to-red-600",
      color: "text-red-500",
      bgGradient: "from-red-500/10 to-red-600/10"
    },
    F: {
      gradient: "from-red-600 to-red-700",
      color: "text-red-600",
      bgGradient: "from-red-600/10 to-red-700/10"
    },
  };

  const currentGrade = gradeConfig[co2Grade] || gradeConfig.F;

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-green-400/5 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-400/5 transform rotate-45 blur-2xl opacity-40 animate-pulse delay-1000" />
      </div>

      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20 mb-6">
              <FaLeaf className="text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Carbon Analysis Results</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight mb-4">
              Your Website's Environmental Impact
            </h2>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Understanding your digital carbon footprint is the first step towards sustainable web practices
            </p>
          </div>

          {/* Main Results Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* CO₂ Emissions Card */}
            <div className={`bg-gradient-to-r ${currentGrade.bgGradient} border-2 border-green-500/20 dark:border-green-400/20 rounded-3xl p-8 shadow-xl`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <FaDesktop className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Carbon Emissions
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Per page view
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className={`text-5xl md:text-6xl font-extrabold bg-gradient-to-r ${currentGrade.gradient} bg-clip-text text-transparent mb-2`}>
                  {co2}g
                </div>
                <div className="text-xl font-semibold text-slate-600 dark:text-slate-300">
                  CO₂ per view
                </div>
                <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border-2 border-green-500/30 ${currentGrade.color} font-bold text-lg`}>
                  Grade: {co2Grade}
                </div>
              </div>

              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors font-medium group"
              >
                <FaLightbulb className="text-sm" />
                How is this calculated?
                <FaArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Hosting Analysis Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  greenHost 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  {greenHost ? (
                    <FaCheckCircle className="text-2xl" />
                  ) : (
                    <FaExclamationTriangle className="text-2xl" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Hosting Analysis
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Server sustainability
                  </p>
                </div>
              </div>

              {greenHost ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2">
                      Excellent!
                    </div>
                    <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                      This site uses green hosting
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300">
                      Carbon footprint reduced by an estimated{" "}
                      <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                        {savePct}%
                      </span>
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <FaLeaf className="text-sm" />
                      <span className="text-sm font-medium">Sustainable hosting detected</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-orange-500 dark:text-orange-400 mb-2">
                      Opportunity
                    </div>
                    <h4 className="text-xl font-bold text-orange-500 dark:text-orange-400 mb-2">
                      Standard hosting detected
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300">
                      Switching to green hosting could reduce emissions by{" "}
                      <span className="font-bold text-orange-500 dark:text-orange-400 text-lg">
                        {savePct}%
                      </span>
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <FaGlobe className="text-sm" />
                      <span className="text-sm font-medium">Consider green hosting providers</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expert Help Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 dark:border-green-400/20 rounded-3xl p-12">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
                <FaRocket />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Ready to Reduce Your Digital Carbon Footprint?
              </h3>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your website into an eco-friendly powerhouse with expert guidance from sustainability specialists
              </p>

              <div className="space-y-4 mb-8">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Our experts at{" "}
                  <a
                    href="https://buzzboost.co.uk"
                    className="inline-flex items-center gap-2 font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BuzzBoost Digital
                    <FaExternalLinkAlt className="text-sm" />
                  </a>{" "}
                  provide bespoke audits and sustainable digital strategies
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://buzzboost.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaRocket className="mr-2" />
                  Get Expert Help
                </a>
                
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaLightbulb className="mr-2" />
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}