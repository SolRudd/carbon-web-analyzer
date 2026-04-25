import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Cloud, Leaf, Globe, Activity } from 'lucide-react';

const ecoFacts = [
  "Optimizing images can cut a page's data usage in half.",
  "The internet's carbon footprint is larger than the entire airline industry.",
  "Green web hosting can reduce a server's emissions by over 60%.",
  "A single data center can consume as much electricity as 50,000 homes.",
  "On average, each website visit produces 1.76 grams of CO₂.",
  "Caching static content can reduce server requests by up to 80%.",
  "One tree can absorb about 21 kilograms (48 lbs) of CO₂ per year.",
  "Choosing a system font over a custom one reduces HTTP requests and data.",
];

const analysisStages = [
  { icon: Globe,   label: "Scanning website",         color: "text-blue-500"   },
  { icon: Activity,label: "Measuring performance",    color: "text-amber-500"  },
  { icon: Zap,     label: "Calculating energy use",   color: "text-orange-500" },
  { icon: Leaf,    label: "Computing CO₂ footprint",  color: "text-green-500"  },
];

// Floating particle
const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0,1,0], scale: [0,1,0], y: [-20,-100], x: [0, Math.random()*40 - 20] }}
    transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: Math.random()*3 }}
    className="absolute w-2 h-2 bg-green-400 rounded-full blur-sm"
  />
);

export default function LoadingOverlay() {
  const [factIdx, setFactIdx] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);

  // HARD scroll-lock (no external CSS)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight   = html.style.height;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight   = body.style.height;

    const prevent = (e) => e.preventDefault();
    const opts = { passive: false };

    html.style.overflow = 'hidden';
    html.style.height   = '100%';
    body.style.overflow = 'hidden';
    body.style.height   = '100%';

    window.addEventListener('wheel', prevent, opts);
    window.addEventListener('touchmove', prevent, opts);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height   = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height   = prevBodyHeight;

      window.removeEventListener('wheel', prevent, opts);
      window.removeEventListener('touchmove', prevent, opts);
    };
  }, []);

  useEffect(() => {
    const facts  = setInterval(() => setFactIdx(i => (i+1) % ecoFacts.length), 4000);
    const stages = setInterval(() => setStageIdx(i => (i+1) % analysisStages.length), 2500);
    return () => { clearInterval(facts); clearInterval(stages); };
  }, []);

  const StageIcon = analysisStages[stageIdx].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-[#020f1e]/90 p-4 backdrop-blur-xl" aria-live="polite" aria-busy="true">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale:[1,1.2,1], opacity:[0.2,0.4,0.2] }}
          transition={{ duration:4, repeat:Infinity }}
          className="absolute top-1/2 left-1/2 w-[50rem] h-[30rem] bg-green-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
        />
        <motion.div
          animate={{ scale:[1.2,1,1.2], opacity:[0.2,0.3,0.2] }}
          transition={{ duration:6, repeat:Infinity, delay:2 }}
          className="absolute bottom-0 right-0 w-[50rem] h-[30rem] bg-blue-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"
        />
        <motion.div
          animate={{ rotate:360 }} transition={{ duration:60, repeat:Infinity, ease:'linear' }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-green-300/10 to-blue-300/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate:-360 }} transition={{ duration:45, repeat:Infinity, ease:'linear' }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-lg"
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${20 + Math.random()*60}%`, bottom: '10%' }}>
            <FloatingParticle delay={i * 0.5} />
          </div>
        ))}
      </div>

      {/* Card */}
      <motion.div initial={{ opacity:0, scale:0.8, y:20 }} animate={{ opacity:1, scale:1, y:0 }} transition={{ duration:0.6, ease:[0.25,0.46,0.45,0.94] }} className="relative z-10 w-full max-w-lg">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-2xl backdrop-blur-xl border border-white/20 dark:bg-slate-900/80 dark:border-slate-700/50">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-green-400/20 opacity-50" />
          <div className="relative p-8 text-center">
            {/* Loader */}
            <div className="relative mb-8 flex justify-center">
              <motion.div animate={{ scale:[1,1.4,1], opacity:[0.5,0,0.5] }} transition={{ duration:2, repeat:Infinity }} className="absolute inset-0 rounded-full border-2 border-emerald-400/30" />
              <motion.div animate={{ scale:[1,1.2,1], opacity:[0.7,0,0.7] }} transition={{ duration:2, repeat:Infinity, delay:0.5 }} className="absolute inset-0 rounded-full border-2 border-green-400/40" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-sm">
                <motion.div animate={{ rotate:360 }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}>
                  <Loader2 className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <motion.div key={stageIdx} initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }} transition={{ duration:0.4, ease:'backOut' }} className="absolute inset-0 flex items-center justify-center">
                  <StageIcon className={`h-6 w-6 ${analysisStages[stageIdx].color}`} />
                </motion.div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-8 space-y-3">
              <motion.h2 key={stageIdx} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }} className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                {analysisStages[stageIdx].label}
              </motion.h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Measuring your website's environmental impact</p>
              <div className="flex justify-center space-x-2 mt-4">
                {analysisStages.map((_, i) => (
                  <motion.div key={i} animate={{ scale: i===stageIdx ? 1.2 : 1, opacity: i<=stageIdx ? 1 : 0.3 }} className={`w-2 h-2 rounded-full ${i===stageIdx ? 'bg-emerald-500' : i<stageIdx ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                ))}
              </div>
            </div>

            {/* Eco facts */}
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 dark:via-emerald-700" />
                <span className="px-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-white/50 rounded-full dark:bg-slate-800/50">ECO INSIGHTS</span>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 dark:via-emerald-700" />
              </div>
              <div className="relative h-20 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={factIdx}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed px-4">
                      <Leaf className="inline w-4 h-4 text-emerald-500 mr-2" />
                      {ecoFacts[factIdx]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
