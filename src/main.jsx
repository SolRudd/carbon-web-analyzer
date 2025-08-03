// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HelmetProvider } from 'react-helmet-async'; // ✅ 1. Import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ 2. Wrap your App with the provider */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);