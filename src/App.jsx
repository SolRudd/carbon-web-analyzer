import React from "react";
import { Routes, Route } from "react-router-dom"; 
import { API_BASE } from "./config";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Faq from "./pages/Faq";
import Badge from "./pages/Badge";
import ResultPage from "./pages/ResultPage";
import RatingPage from "./pages/RatingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";
import Calculator from "./pages/Calculator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Pricing from "./pages/Pricing";
import LicenseStatus from "./pages/LicenseStatus";
import Verify from "./pages/Verify";
import VerifiedProfile from "./pages/VerifiedProfile";
import CookieConsentBanner from "./components/CookieConsentBanner";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

if (import.meta.env.DEV) console.log("⚡️ API_BASE is:", API_BASE);

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-[#020f1e] dark:text-white transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/badge" element={<Badge />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/license-status" element={<LicenseStatus />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/verified/:domain" element={<VerifiedProfile />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Blog Routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Results detail */}
          <Route path="/result/:slug" element={<ResultPage />} />

          {/* Rating system page */}
          <Route path="/rating" element={<RatingPage />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CookieConsentBanner />
    </div>
  );
}

export default App;
