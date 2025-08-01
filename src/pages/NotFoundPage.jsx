import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, Home, Leaf, Globe, ArrowRight } from 'lucide-react';

// Floating particle component for environmental ambiance
const FloatingParticle = ({ delay = 0, direction = 1 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [0, -80 * direction],
      x: [0, (Math.random() - 0.5) * 60]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 4
    }}
    className="absolute w-2 h-2 bg-green-400 rounded-full blur-sm"
  />
);

export default function NotFoundPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-white px-4 py-20 text-center dark:bg-slate-950 transition-colors duration-300">
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary glow - matching your brand */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-[50rem] h-[30rem] bg-green-400/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl"
        />
        
        {/* Secondary glow */}
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[50rem] h-[30rem] bg-blue-400/20 rounded-full transform translate-x-1/2 translate-y-1/2 blur-3xl"
        />

        {/* Organic background shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-green-300/10 to-blue-300/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-lg"
        />
      </div>

      {/* Floating environmental particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: '5%'
            }}
          >
            <FloatingParticle delay={i * 0.4} direction={Math.random() > 0.5 ? 1 : -1} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center space-y-8 max-w-2xl mx-auto"
      >
        
        {/* Enhanced icon container */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-green-400/30"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-green-500/40"
          />
          
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/20 dark:border-green-400/20 shadow-2xl">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600 blur-xl opacity-20 scale-110" />
            
            <SearchX className="relative z-10 h-14 w-14 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>
        
        {/* Enhanced typography section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.h1 
            className="text-7xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            404
          </motion.h1>
          
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white leading-tight"
          >
            This Page Has Gone{" "}
            <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400">
              Off-Grid
              <Leaf className="w-8 h-8" />
            </span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-lg text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            It seems the page you're looking for doesn't exist or has been moved to a more{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">sustainable location</span>. 
            Let's get you back on the right path! 🌱
          </motion.p>
        </motion.div>

        {/* Enhanced action buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          {/* Primary CTA */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-8 py-4 font-semibold text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Return to Homepage</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#input-form"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center justify-center gap-3 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-8 py-4 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
          >
            <Globe className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span>Test a Website</span>
          </motion.a>
        </motion.div>

        {/* Fun fact section */}
        <motion.div
          variants={itemVariants}
          className="pt-8 max-w-md"
        >
          <div className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Did you know? A well-optimized 404 page can save energy by reducing bounce rates!</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}