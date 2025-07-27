// src/components/LoadingOverlay.jsx
import React, { useState, useEffect } from "react";
import { TreeDeciduous as TreeIcon }  from "lucide-react";

export default function LoadingOverlay() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const status =
    secs < 10  ? "Checking…" :
    secs < 30  ? "Still working…" :
                 "This may take up to 90 seconds on busy servers.";

  return (
    <div className="fixed inset-0 bg-white/70 dark:bg-black/70 backdrop-blur flex flex-col items-center justify-center z-50">
      <div className="mb-8 text-center max-w-md">
        <p className="text-2xl font-semibold mb-2">“The internet could use 20% of global electricity by 2025.”</p>
        <p className="text-sm">
          Learn more at{" "}
          <a href="https://www.smashingmagazine.com/2020/11/sustainable-web-development/" target="_blank" rel="noreferrer" className="underline">
            Smashing Magazine
          </a>
        </p>
      </div>

      <div className="flex space-x-8 mb-6">
        {[0,1,2].map(i => (
          <TreeIcon key={i} className="text-green-600" style={{
            fontSize: `${64 + i*32}px`,
            animation: `pulse 1.2s ${i*0.4}s ease-in-out infinite`
          }}/>
        ))}
      </div>

      <p className="text-2xl font-medium text-green-600 animate-pulse">
        {status} ({secs}s)
      </p>
    </div>
  );
}
