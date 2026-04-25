const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "");
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
const SUPABASE_PUBLISHABLE_FALLBACK = (import.meta.env.VITE_SUPABASE_PUBLISHABLE || "").trim();
const SUPABASE_CLIENT_KEY =
  SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_FALLBACK;

const STORAGE_KEY = "gt_auth_session_v1";

const KEY_SOURCE = SUPABASE_ANON_KEY
  ? "VITE_SUPABASE_ANON_KEY"
  : SUPABASE_PUBLISHABLE_KEY
    ? "VITE_SUPABASE_PUBLISHABLE_KEY"
    : SUPABASE_PUBLISHABLE_FALLBACK
      ? "VITE_SUPABASE_PUBLISHABLE"
      : "none";

const DETECTED_ENV_NAMES = Object.keys(import.meta.env)
  .filter((name) => /SUPABASE|VITE_API_URL/i.test(name))
  .sort();

if (import.meta.env.DEV) {
  console.info("[auth-config]", {
    hasUrl: Boolean(SUPABASE_URL),
    url: SUPABASE_URL || "(missing)",
    keySource: KEY_SOURCE,
    hasClientKey: Boolean(SUPABASE_CLIENT_KEY),
    clientKeyPrefix: SUPABASE_CLIENT_KEY ? `${SUPABASE_CLIENT_KEY.slice(0, 12)}...` : "(missing)",
    detectedEnvNames: DETECTED_ENV_NAMES,
  });
}

export function hasAuthConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_CLIENT_KEY);
}

function ensureConfigured() {
  if (!hasAuthConfig()) {
    throw new Error("Supabase auth is not configured.");
  }
}

function authUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SUPABASE_URL}/auth/v1${normalizedPath}`;
}

async function authRequest(path, options = {}) {
  ensureConfigured();

  const requestUrl = authUrl(path);

  const mergedHeaders = new Headers();
  mergedHeaders.set("apikey", SUPABASE_CLIENT_KEY);

  if (!mergedHeaders.has("Content-Type") && options.method !== "GET") {
    mergedHeaders.set("Content-Type", "application/json");
  }

  if (options.headers) {
    const incoming = new Headers(options.headers);
    incoming.forEach((value, key) => {
      if (value != null && value !== "") {
        mergedHeaders.set(key, value);
      }
    });
  }

  if (import.meta.env.DEV) {
    const headerNames = Array.from(mergedHeaders.keys()).sort();
    console.info("[auth-request]", {
      url: requestUrl,
      method: options.method || "GET",
      headerNames,
      hasApiKeyHeader: mergedHeaders.has("apikey"),
      hasAuthorizationHeader: mergedHeaders.has("authorization"),
      apiKeyPrefix: mergedHeaders.get("apikey")
        ? `${String(mergedHeaders.get("apikey")).slice(0, 12)}...`
        : "(missing)",
    });
  }

  const response = await fetch(requestUrl, {
    ...options,
    headers: mergedHeaders,
  });

  const text = await response.text();
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text || "Unknown auth response" };
  }

  if (!response.ok) {
    const msg =
      payload?.msg ||
      payload?.message ||
      payload?.error_description ||
      payload?.error ||
      `Auth request failed (${response.status})`;

    throw new Error(msg);
  }

  return payload;
}

function normalizeSession(data) {
  if (!data) return null;

  if (data.access_token && data.refresh_token) {
    const nowSec = Math.floor(Date.now() / 1000);
    const expiresAt = data.expires_at || nowSec + Number(data.expires_in || 3600);

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
      token_type: data.token_type || "bearer",
      user: data.user || null,
    };
  }

  if (data.session?.access_token && data.session?.refresh_token) {
    return normalizeSession(data.session);
  }

  return null;
}

export function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeSession(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function persistSession(session) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function readOAuthSessionFromUrlHash() {
  if (typeof window === "undefined" || !window.location?.hash) return null;
  const rawHash = window.location.hash.replace(/^#/, "");
  if (!rawHash) return null;

  const params = new URLSearchParams(rawHash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;

  const expiresIn = Number(params.get("expires_in") || 3600);
  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAt = nowSec + (Number.isFinite(expiresIn) ? expiresIn : 3600);

  const cleanedUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", cleanedUrl);

  return normalizeSession({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
    token_type: params.get("token_type") || "bearer",
  });
}

export function readOAuthErrorFromUrlHash() {
  if (typeof window === "undefined" || !window.location?.hash) return null;
  const rawHash = window.location.hash.replace(/^#/, "");
  if (!rawHash) return null;
  const params = new URLSearchParams(rawHash);
  const errorDescription = params.get("error_description") || params.get("error");
  if (!errorDescription) return null;

  const cleanedUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", cleanedUrl);
  return decodeURIComponent(errorDescription);
}

export async function signUpWithEmail(email, password) {
  const payload = await authRequest("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return {
    user: payload.user || null,
    session: normalizeSession(payload),
  };
}

export async function signInWithEmail(email, password) {
  const payload = await authRequest("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return {
    user: payload.user || null,
    session: normalizeSession(payload),
  };
}

export async function refreshAccessToken(refreshToken) {
  const payload = await authRequest("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  return {
    user: payload.user || null,
    session: normalizeSession(payload),
  };
}

export async function fetchAuthUser(accessToken) {
  if (!accessToken) return null;

  return authRequest("/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function signOut(accessToken) {
  if (!accessToken || !hasAuthConfig()) return;

  try {
    await authRequest("/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ scope: "global" }),
    });
  } catch {
    // best-effort signout
  }
}

export function beginGoogleLogin(redirectPath = "/dashboard") {
  ensureConfigured();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const safeRedirectPath = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
  const redirectTo = `${origin}${safeRedirectPath}`;
  const query = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
    apikey: SUPABASE_CLIENT_KEY,
  });
  const oauthUrl = authUrl(`/authorize?${query.toString()}`);

  if (typeof window !== "undefined") {
    window.location.assign(oauthUrl);
  }
}
