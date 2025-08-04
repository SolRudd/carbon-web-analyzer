// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from 'react-router-dom'; // ✅ 1. Import router
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter> {/* ✅ 2. Add the router here */}
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);