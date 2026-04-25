/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  beginGoogleLogin,
  fetchAuthUser,
  hasAuthConfig,
  persistSession,
  readOAuthSessionFromUrlHash,
  readStoredSession,
  refreshAccessToken,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "../lib/supabaseAuth";

const AuthContext = createContext(null);

function isExpiringSoon(session) {
  if (!session?.expires_at) return true;
  const now = Math.floor(Date.now() / 1000);
  return session.expires_at - now < 60;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!hasAuthConfig()) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        // Handle OAuth callback hash session first, then fall back to persisted session.
        const hashSession = readOAuthSessionFromUrlHash();
        const stored = readStoredSession();
        const baseSession = hashSession || stored;

        if (!baseSession) {
          if (!cancelled) setLoading(false);
          return;
        }

        let nextSession = baseSession;
        if (isExpiringSoon(baseSession)) {
          const refreshed = await refreshAccessToken(baseSession.refresh_token);
          nextSession = refreshed.session;
        }

        if (!nextSession?.access_token) throw new Error("Session unavailable.");

        const authUser = await fetchAuthUser(nextSession.access_token);
        if (cancelled) return;

        setSession(nextSession);
        setUser(authUser);
        persistSession(nextSession);
      } catch {
        if (cancelled) return;
        setSession(null);
        setUser(null);
        persistSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await signInWithEmail(email, password);
    setSession(data.session);
    setUser(data.user);
    persistSession(data.session);
    return data;
  }, []);

  const signup = useCallback(async ({ email, password }) => {
    const data = await signUpWithEmail(email, password);
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
      persistSession(data.session);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    const token = session?.access_token;
    setSession(null);
    setUser(null);
    persistSession(null);
    await signOut(token);
  }, [session?.access_token]);

  const loginWithGoogle = useCallback(() => {
    beginGoogleLogin("/dashboard");
  }, []);

  const getValidAccessToken = useCallback(async () => {
    if (!session?.access_token) return null;

    if (!isExpiringSoon(session)) {
      return session.access_token;
    }

    try {
      const refreshed = await refreshAccessToken(session.refresh_token);
      if (!refreshed?.session?.access_token) {
        setSession(null);
        setUser(null);
        persistSession(null);
        return null;
      }

      setSession(refreshed.session);
      if (refreshed.user) setUser(refreshed.user);
      persistSession(refreshed.session);
      return refreshed.session.access_token;
    } catch {
      setSession(null);
      setUser(null);
      persistSession(null);
      return null;
    }
  }, [session]);

  const value = useMemo(
    () => ({
      configured: hasAuthConfig(),
      loading,
      user,
      session,
      login,
      signup,
      logout,
      loginWithGoogle,
      getValidAccessToken,
    }),
    [getValidAccessToken, loading, login, loginWithGoogle, logout, session, signup, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider.");
  return ctx;
}
