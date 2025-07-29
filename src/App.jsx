// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { API_BASE } from "./config";                      // ← import your API_BASE

import Header         from "./components/Header";
import Footer         from "./components/Footer";
import Home           from "./pages/Home";
import HowItWorks     from "./pages/HowItWorks";
import Faq            from "./pages/Faq";
import ApiAccess      from "./pages/ApiAccess";
import Badge          from "./pages/Badge";
import ResultPage     from "./pages/ResultPage";
import RatingPage     from "./pages/RatingPage";
import NotFoundPage   from "./pages/NotFoundPage";
import Blog           from "./pages/Blog";
import BlogPostPage   from "./pages/BlogPostPage";
import PrivacyPolicy  from "./pages/PrivacyPolicy";       // Import the new PrivacyPolicy page
import CookieConsentBanner from "./components/CookieConsentBanner"; // Import the new CookieConsentBanner


// Log once at startup so you can verify in the browser console:
console.log("⚡️ API_BASE is:", API_BASE);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-[#020f1e] dark:text-white transition-colors duration-300">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/api-access" element={<ApiAccess />} />
            <Route path="/badge" element={<Badge />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* Privacy Policy Route */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* New route for Privacy Policy */}

            {/* Results detail */}
            <Route path="/result/:slug" element={<ResultPage />} />

            {/* New standalone rating system page */}
            <Route path="/rating" element={<RatingPage />} />

            {/* 404 fallback: catch any undefined route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Render the Cookie Consent Banner outside of <main> but within the main div */}
        <CookieConsentBanner />
      </div>
    </Router>
  );
}

export default App;