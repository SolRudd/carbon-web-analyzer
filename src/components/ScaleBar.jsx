import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function ScaleBar({ grade }) {
  const grades = ["A+", "A", "B", "C", "D", "E", "F"];

  const userIndex = grades.indexOf(grade);
  const userPct = userIndex !== -1 ? (userIndex / (grades.length - 1)) * 100 : 0;

  const avgIndex = grades.indexOf("E");
  const avgPct = avgIndex !== -1 ? (avgIndex / (grades.length - 1)) * 100 : 0;

  const gradeColors = {
    "A+": "text-green-400",
    A: "text-green-500",
    B: "text-lime-400",
    C: "text-yellow-400",
    D: "text-orange-500",
    E: "text-red-400",
    F: "text-red-600",
  };

  return (
    <div className="relative mt-16 w-full max-w-2xl mx-auto">
      {/* Gradient Track */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-10 w-full rounded-full overflow-hidden shadow-2xl border border-white/20 dark:border-slate-700/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 via-yellow-400/80 to-red-600/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-white/10" /> {/* NO blur here! */}

        {/* Grade Labels */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          {grades.map((g, index) => (
            <motion.span
              key={g}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              className={`text-sm sm:text-base font-bold drop-shadow-lg transition-all duration-300 ${
                g === grade
                  ? 'text-white scale-110'
                  : 'text-slate-800 dark:text-white/90'
              }`}
            >
              {g}
            </motion.span>
          ))}
        </div>

        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${userPct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="absolute top-0 left-0 h-full bg-white/20"
        />
      </motion.div>

      {/* Global Average Indicator */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute flex flex-col items-center -translate-x-1/2"
        style={{ left: `${avgPct}%`, top: '-4rem' }}
      >
        <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm whitespace-nowrap mb-1 px-2 py-1 bg-white/80 dark:bg-slate-800/80 rounded-full">
          Global Average
        </span>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-blue-600 dark:text-blue-400 text-xl"
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Global Average Marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.4, ease: "backOut" }}
        className="absolute -top-1 -translate-x-1/2"
        style={{ left: `${avgPct}%` }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-xl border-2 border-blue-500/30 ring-4 ring-blue-500/10">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      </motion.div>

      {/* User Grade Bubble */}
      {userIndex !== -1 && (
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.1 }}
          className="absolute -top-4 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 -translate-x-1/2"
          style={{ left: `${userPct}%` }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-white shadow-2xl ring-4 ring-white/50 dark:ring-slate-800/50" /> {/* NO blur! */}
          {/* Main bubble */}
          <div className="relative rounded-full bg-white dark:bg-slate-800 shadow-2xl border-4 border-white dark:border-slate-700 w-full h-full flex items-center justify-center">
            <span className={`text-xl sm:text-2xl font-extrabold ${gradeColors[grade] || 'text-slate-900 dark:text-white'}`}>
              {grade}
            </span>
          </div>

          {/* Animated ring for top grades */}
          {(grade === "A+" || grade === "A") && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border-2 border-green-500/50"
            />
          )}
        </motion.div>
      )}

      </div>
  );
}
