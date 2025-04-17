// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // ✅ fix path if needed
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Faq from "./pages/Faq"; // ✅ Add this at the top
import ApiAccess from "./pages/ApiAccess"; // ✅ Added missing import
import Badge from "./pages/Badge"; // ✅ Add this


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/how-it-works" element={<HowItWorks />} />
  <Route path="/faq" element={<Faq />} />
  <Route path="/api-access" element={<ApiAccess />} />
  <Route path="/badge" element={<Badge />} /> {/* ✅ Add this */}
</Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

