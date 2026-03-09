import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_STORAGE_KEY = "greentracer_cookie_consent";

const getConsentPayload = (analyticsGranted) => ({
  analytics_storage: analyticsGranted ? "granted" : "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
});

const updateGoogleConsent = (analyticsGranted) => {
  if (typeof window === "undefined") return;

  const payload = getConsentPayload(analyticsGranted);

  if (typeof window.gtag !== "function") {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  try {
    window.gtag("consent", "update", payload);
  } catch (error) {
    console.warn("Consent update failed:", error);
  }
};

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (savedChoice === "accepted") {
      updateGoogleConsent(true);
      return;
    }

    if (savedChoice === "rejected") {
      updateGoogleConsent(false);
      return;
    }

    setShowBanner(true);
  }, []);

  const saveConsentChoice = (choice) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    }
  };

  const handleAccept = () => {
    saveConsentChoice("accepted");
    updateGoogleConsent(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    saveConsentChoice("rejected");
    updateGoogleConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          We use analytics cookies to improve GreenTracer. You can accept or reject non-essential cookies.
          See our{" "}
          <Link to="/privacy-policy" className="font-medium text-green-700 underline hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
