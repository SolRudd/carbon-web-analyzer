// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

            {/* Results detail */}
            <Route path="/result/:slug" element={<ResultPage />} />

            {/* New standalone rating system page */}
            <Route path="/rating" element={<RatingPage />} />

            {/* 404 fallback: catch any undefined route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
