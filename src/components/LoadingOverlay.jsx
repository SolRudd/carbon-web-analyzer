// src/components/LoadingOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaLeaf, FaRecycle, FaBolt } from 'react-icons/fa';

export default function LoadingOverlay({ onGameStart }) {
  const containerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [molecules, setMolecules] = useState([]);
  const [facts, setFacts] = useState(0);
  const [particles, setParticles] = useState([]);
  const [level, setLevel] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  const ecoFacts = [
    "🌱 Every webpage visit produces an average of 4.6g of CO₂",
    "🌍 The internet consumes 4% of global electricity",
    "💚 Green hosting can reduce emissions by up to 60%",
    "⚡ Optimizing images can cut your page size in half",
    "🌳 One tree absorbs 48lbs of CO₂ per year",
    "🔋 Renewable energy makes websites 90% cleaner",
    "📱 Mobile-first design reduces data transfer",
    "🎯 Caching can reduce server requests by 80%"
  ];

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
      if (onGameStart) onGameStart();
    }
  }, [countdown, onGameStart]);

  // Timer for elapsed time
  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  // Level system
  useEffect(() => {
    const newLevel = Math.floor(score / 100) + 1;
    setLevel(newLevel);
  }, [score]);

  // Generate molecules, safe for container bounds
  useEffect(() => {
    if (!gameStarted || !containerRef.current) return;
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    const spawnRate = Math.max(600, 1200 - level * 50);
    const interval = setInterval(() => {
      if (molecules.length < 12) {
        const newMolecule = {
          id: Date.now() + Math.random(),
          x: Math.random() * (width - 60) + 20, // pad for safe tap
          y: Math.random() * (height - 200) + 80,
          size: Math.random() * 25 + 25,
          type: Math.random() > 0.8 ? 'good' : Math.random() > 0.6 ? 'bonus' : 'bad',
        };
        setMolecules((prev) => [...prev, newMolecule]);
      }
    }, spawnRate);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [level, molecules.length, gameStarted, containerRef.current]);

  // Cycle facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFacts((prev) => (prev + 1) % ecoFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMoleculeClick = (e, molecule) => {
    e.stopPropagation();

    let points = 5;
    if (molecule.type === 'good') points = 10;
    if (molecule.type === 'bonus') points = 25;

    setScore((prev) => prev + points);

    const particleCount = molecule.type === 'bonus' ? 12 : 8;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: molecule.x,
      y: molecule.y,
      angle: (i * (360 / particleCount)) * (Math.PI / 180),
      speed: Math.random() * 4 + 2,
      color: molecule.type === 'bonus' ? 'gold' : molecule.type === 'good' ? 'green' : 'blue',
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setMolecules((prev) => prev.filter((m) => m.id !== molecule.id));

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 1000);
  };

  const getMoleculeEmoji = (type) => {
    if (type === 'good') return '🌱';
    if (type === 'bonus') return '⭐';
    return '💨';
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden touch-none"
      ref={containerRef}
      style={{ minHeight: '100svh', minWidth: '100vw', maxWidth: '100vw', maxHeight: '100svh' }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Countdown and Explanation */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">🌍 Your Request is Loading</h1>
            <p className="text-lg mb-8">
              While we process your data, play this quick game to pass the time!
            </p>
            <div className="text-6xl font-bold">{countdown > 0 ? countdown : 'Go!'}</div>
          </div>
        )}

        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Clickable Molecules */}
        {gameStarted &&
          molecules.map((molecule) => (
            <div
              key={molecule.id}
              onClick={(e) => handleMoleculeClick(e, molecule)}
              className={`absolute cursor-pointer transition-all duration-200 hover:scale-125 z-20 select-none ${
                molecule.type === 'good'
                  ? 'hover:drop-shadow-[0_0_10px_#22c55e]'
                  : molecule.type === 'bonus'
                  ? 'hover:drop-shadow-[0_0_15px_#fbbf24] animate-pulse'
                  : 'hover:drop-shadow-[0_0_10px_#ef4444]'
              }`}
              style={{
                left: molecule.x,
                top: molecule.y,
                fontSize: molecule.size,
                animation: 'float 3s ease-in-out infinite',
                touchAction: 'none'
              }}
            >
              {getMoleculeEmoji(molecule.type)}
            </div>
          ))}

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-3 h-3 rounded-full animate-ping z-10 pointer-events-none ${
              particle.color === 'gold'
                ? 'bg-yellow-400'
                : particle.color === 'green'
                ? 'bg-green-400'
                : 'bg-blue-400'
            }`}
            style={{
              left: particle.x + Math.cos(particle.angle) * particle.speed * 20,
              top: particle.y + Math.sin(particle.angle) * particle.speed * 20,
            }}
          />
        ))}

        {/* Main Content */}
        {gameStarted && (
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-3 sm:p-8 pointer-events-none">
            {/* HUD */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none text-xs sm:text-base">
              <div className="bg-purple-500/80 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold backdrop-blur-sm">
                🏆 Level {level}
              </div>
              <div className="bg-green-500/80 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-lg backdrop-blur-sm">
                🎯 {score.toLocaleString()}
              </div>
              <div className="bg-blue-500/80 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold backdrop-blur-sm">
                ⏱️ {timeElapsed}s
              </div>
            </div>

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

            {/* Instructions */}
            <div className="text-center text-xs sm:text-sm opacity-90 max-w-xs sm:max-w-lg bg-black/20 rounded-lg p-2 sm:p-4 backdrop-blur-sm">
              <p className="mb-1 sm:mb-2 text-base sm:text-lg font-bold">🎮 Carbon Molecule Hunter</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-[10px] sm:text-xs">
                <div>🌱 Plants<br />+10 pts</div>
                <div>⭐ Bonus<br />+25 pts</div>
                <div>💨 CO₂<br />+5 pts</div>
              </div>
              <p className="mt-1 sm:mt-2 text-yellow-400">
                Level {level} • Next: {Math.max(0, level * 100 - score)} points
              </p>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
