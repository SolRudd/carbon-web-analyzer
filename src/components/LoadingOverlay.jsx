import React, { useEffect, useState } from "react";
import { TreeDeciduous as TreeIcon } from "lucide-react";

export default function LoadingOverlay() {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  let status;
  if (secs < 10) status = "Checking…";
  else if (secs < 30) status = "Still working…";
  else status = "This may take up to 90 seconds on busy servers.";

  return (
    <div className="fixed inset-0 bg-white/70 dark:bg-[#020f1e]/70 backdrop-blur-md flex flex-col justify-center items-center z-50">
      {/* Quote */}
      <div className="mb-8 text-center max-w-lg">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          “The internet could use 20% of global electricity by 2025.”
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Learn more about sustainable web design at{" "}
          <a
            href="https://www.smashingmagazine.com/2020/11/sustainable-web-development/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-greenbuzz"
          >
            Smashing Magazine
          </a>
        </p>
      </div>

      {/* Pulsing trees */}
      <div className="flex items-center justify-center space-x-8 mb-6">
        {[...Array(3)].map((_, i) => (
          <TreeIcon
            key={i}
            className="text-greenbuzz"
            style={{
              fontSize: `${64 + i * 32}px`,
              animation: `pulse 1.2s ${i * 0.4}s ease-in-out infinite`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Dynamic message */}
      <p className="text-2xl font-medium text-greenbuzz animate-pulse">
        {status} ({secs}s)
      </p>
    </div>
  );
}
