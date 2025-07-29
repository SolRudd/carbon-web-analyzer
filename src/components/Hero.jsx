import React from "react";
import { Globe, Leaf, ShieldCheck, Zap, Heart } from "lucide-react";

const heroFeatures = [
  { 
    icon: <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />, 
    title: "Low CO₂", 
    description: "Under 0.5g per visit." 
  },
  { 
    icon: <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />, 
    title: "Green Hosting", 
    description: "Real-time renewable check." 
  },
  { 
    icon: <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />, 
    title: "Insights", 
    description: "Tips to optimize your site." 
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Enhanced Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-3/4 w-[300px] h-[300px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center pt-16 pb-12 px-4">
        {/* Enhanced Pill Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide text-sm">
              Carbon Web Checker
            </span>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Stunning Gradient Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight tracking-tight">
            How Sustainable Is Your Website or App?
          </h1>

          {/* Enhanced Description */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Instantly measure your site's carbon footprint—fast, free, and open-source. 
            Join the movement for a greener internet.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
              href="#input-form"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Globe className="w-5 h-5 mr-2" />
              Run Your CO₂ Check
            </a>
            <a
              href="#impact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Why It Matters
            </a>
          </div>

          {/* Credit Badge */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-white/20">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">
                Built by{" "}
                <a
                  href="https://buzzboost.co.uk"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BuzzBoost Digital
                </a>
              </span>
            </div>
          </div>

          {/* Enhanced Features Grid - Responsive */}
          <div className="pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {heroFeatures.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-green-500/50 dark:hover:border-green-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="w-12 h-12 bg-green-500/10 dark:bg-green-400/10 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="pt-8 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">2-4%</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Global Web Emissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">Free</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">Instant</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Results</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}