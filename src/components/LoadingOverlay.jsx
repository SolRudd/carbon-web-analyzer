// src/components/LoadingOverlay.jsx
import React, { useState, useEffect } from 'react';
import { FaLeaf, FaRecycle, FaBolt } from 'react-icons/fa';

export default function LoadingOverlay() {
  const [facts, setFacts] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const ecoFacts = [
    "🌱 Every webpage visit produces an average of 4.6g of CO₂",
    "🌍 The internet consumes 4% of global electricity",
    "💚 Green hosting can reduce emissions by up to 60%",
    "⚡ Optimizing images can cut your page size in half",
    "🌳 One tree absorbs 48lbs of CO₂ per year",
    "🔋 Renewable energy makes websites 90% cleaner",
    "📱 Mobile-first design reduces data transfer",
    "🎯 Caching can reduce server requests by 80%",
  ];

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Cycle eco facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFacts((prev) => (prev + 1) % ecoFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh', minWidth: '100vw', maxWidth: '100vw', maxHeight: '100svh' }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Countdown and Explanation */}
        {countdown > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">🌍 Your Request is Loading</h1>
            <p className="text-lg mb-8">
              While we process your data, here’s something to think about:
            </p>
            <div className="text-6xl font-bold">{countdown}</div>
          </div>
        )}

        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        {countdown === 0 && (
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-3 sm:p-8">
            {/* Loading Animation */}
            <div className="text-center mb-4 sm:mb-8">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaLeaf className="text-3xl sm:text-4xl text-green-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Deep Carbon Analysis
              </h2>

              <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-lg sm:text-xl">
                <FaBolt className="text-yellow-400 animate-bounce" />
                <span>Processing environmental data...</span>
                <FaRecycle className="text-green-400 animate-spin" />
              </div>
            </div>

            {/* Facts */}
            <div className="max-w-xs sm:max-w-lg text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-6 mb-4 sm:mb-6">
              <div className="text-xs sm:text-sm opacity-75 mb-2">💡 Eco Fact #{facts + 1}</div>
              <div className="text-sm sm:text-lg font-medium">{ecoFacts[facts]}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}