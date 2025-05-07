// src/components/LoadingOverlay.jsx
import React from "react";
import { TreeDeciduous as TreeIcon } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white/70 dark:bg-[#020f1e]/70 backdrop-blur-md flex flex-col justify-center items-center z-50">
      {/* Quote and Source */}
      <div className="mb-8 text-center max-w-lg">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          “The internet could use 20% of global electricity by 2025.”
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Source: <a href="https://www.climatechangenews.com/" className="underline hover:text-greenbuzz">Climate Home News</a>
        </p>
      </div>

      {/* Enhanced growth animation: multiple pulsing tree icons */}
      <div className="flex items-center justify-center space-x-8 mb-6">
        {[...Array(3)].map((_, i) => (
          <TreeIcon
            key={i}
            className="text-greenbuzz"
            style={{
              fontSize: `${64 + i * 32}px`,
              animation: `pulse 1.2s ${i * 0.4}s ease-in-out infinite`
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Loading text */}
      <p className="text-2xl font-medium text-greenbuzz animate-pulse">
        Loading your results...
      </p>
    </div>
  );
}
