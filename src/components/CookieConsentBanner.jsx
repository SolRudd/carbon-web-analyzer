// src/components/CookieConsentBanner.jsx
import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import { Link } from 'react-router-dom'; // <--- ADD THIS LINE

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted') {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    // For a simple banner, decline just closes it without setting consent.
    // In a real-world scenario, you might want to set a 'declined' status
    // and disable non-essential cookies.
    setShowBanner(false);
    // Optionally, you could redirect to a privacy policy or show more options
  };

  const bannerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
    exit: { opacity: 0, y: 100, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-md text-white p-6 shadow-2xl rounded-t-2xl md:flex md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6 border-t border-greenbuzz dark:border-green-400"
        >
          <div className="flex items-start md:items-center space-x-4">
            <FaCookieBite className="text-greenbuzz dark:text-green-400 text-3xl flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg mb-1">We use cookies to improve your experience.</p>
              <p className="text-sm text-slate-300">
                This website uses cookies to ensure you get the best experience on our website. By clicking "Accept", you consent to the use of all cookies. You can learn more by reading our{" "}
                <Link to="/privacy-policy" className="text-greenbuzz dark:text-green-400 hover:underline font-medium" onClick={() => setShowBanner(false)}>Privacy Policy</Link>.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <button
              onClick={handleAccept}
              className="w-full sm:w-auto px-6 py-3 bg-greenbuzz hover:bg-green-600 text-white rounded-full font-semibold transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-semibold transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <FaTimes className="mr-2" /> Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
