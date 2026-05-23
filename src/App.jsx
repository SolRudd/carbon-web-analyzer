import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom"; 
import { API_BASE } from "./config";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ProtectedRoute from "./components/ProtectedRoute";

const Badge = lazy(() => import("./pages/Badge"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const Calculator = lazy(() => import("./pages/Calculator"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const Faq = lazy(() => import("./pages/Faq"));
const Home = lazy(() => import("./pages/Home"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const LicenseStatus = lazy(() => import("./pages/LicenseStatus"));
const Login = lazy(() => import("./pages/Login"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Pricing = lazy(() => import("./pages/Pricing"));
const RatingPage = lazy(() => import("./pages/RatingPage"));
const ResultResolverPage = lazy(() => import("./pages/ResultResolverPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const Terms = lazy(() => import("./pages/Terms"));
const Verify = lazy(() => import("./pages/Verify"));
const VerifiedProfile = lazy(() => import("./pages/VerifiedProfile"));

if (import.meta.env.DEV) console.log("⚡️ API_BASE is:", API_BASE);

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-[#020f1e] dark:text-white transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen grid place-items-center text-slate-500">Loading…</div>}>
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
                  <DashboardPage />
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
            <Route path="/result" element={<ResultResolverPage />} />

            {/* Rating system page */}
            <Route path="/rating" element={<RatingPage />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <CookieConsentBanner />
    </div>
  );
}

export default App;
