import React from 'react';
import WorldImage from '../assets/world.png';
import { 
  ArrowRight, 
  Globe, 
  Calculator, 
  Award, 
  Lightbulb,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function Methodology() {
  const steps = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Enter Your URL",
      description: "Paste your website URL into our advanced analyzer"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Instant Analysis",
      description: "Get real-time CO₂ calculations and performance metrics"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Receive Your Grade",
      description: "View your A+ to F rating with detailed breakdown"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Optimize & Improve",
      description: "Apply personalized tips for a greener website"
    }
  ];

  return (
    <section
      id="methodology"
      className="relative overflow-hidden py-20 px-4 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-green-400/15 blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-400/15 blur-2xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20 mb-6">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            How <span className="text-green-600 dark:text-green-400">GreenTrace</span> Works
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Follow these simple steps to accurately measure and reduce your website's carbon footprint with our advanced analysis system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Process Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <div className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                      Step {index + 1}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Enhanced CTA */}
            <div className="pt-6">
              <a
                href="#input-form"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <Globe className="w-5 h-5" />
                Run Your CO₂ Check
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Enhanced Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Multiple glow effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-green-400/20 blur-3xl animate-pulse" />
              <div className="absolute w-60 h-60 bg-blue-400/15 blur-2xl animate-pulse delay-1000" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-green-500 rounded-full animate-bounce opacity-60" />
            <div className="absolute bottom-20 right-20 w-6 h-6 bg-blue-500 rounded-full animate-bounce delay-500 opacity-40" />
            <div className="absolute top-32 right-10 w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-1000 opacity-50" />
            
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl">
              <img
                src={WorldImage}
                alt="Workflow: URL → CO₂ rating → optimization tips"
                className="w-full max-w-sm h-auto filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}