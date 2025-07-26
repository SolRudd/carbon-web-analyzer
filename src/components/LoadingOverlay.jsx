import React, { useState, useEffect } from "react";
import { TreeDeciduous as TreeIcon } from "lucide-react";

export default function LoadingOverlay() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  let status = secs < 10
    ? "Checking…"
    : secs < 30
      ? "Still working…"
      : "This may take up to 90 seconds on busy servers.";

  return (
    <div className="fixed inset-0 bg-white/70 dark:bg-[#020f1e]/70 backdrop-blur-md flex flex-col justify-center items-center z-50">
      <div className="mb-8 text-center max-w-lg">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          “The internet could use 20% of global electricity by 2025.”
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Learn more at{" "}
          <a
            href="https://www.smashingmagazine.com/2020/11/sustainable-web-development/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-greenbuzz"
          >
            Smashing Magazine
          </a>
        </p>
      </div>
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
      <p className="text-2xl font-medium text-greenbuzz animate-pulse">
        {status} ({secs}s)
      </p>
    </div>
  );
}
