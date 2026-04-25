import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, user, configured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">Checking session...</p>
      </section>
    );
  }

  if (!configured) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
          Auth is not configured. Set <code>VITE_SUPABASE_URL</code> and either <code>VITE_SUPABASE_ANON_KEY</code> or <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>, then restart the frontend.
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
