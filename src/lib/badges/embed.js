import { OFFICIAL_BADGE_SIZE, normalizeBadgeType } from "./formatters";

function cleanBaseUrl(value, fallback) {
  const raw = String(value || "").trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
  return fallback;
}

function cleanToken(value) {
  return String(value || "").trim();
}

function cleanSlug(value) {
  return String(value || "").trim().replace(/-+$/, "");
}

function cleanHex(value) {
  const raw = String(value || "").trim();
  return /^#?[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(raw)
    ? (raw.startsWith("#") ? raw : `#${raw}`).toLowerCase()
    : "";
}

function escapeHtmlAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function getBadgeEmbedSize() {
  return OFFICIAL_BADGE_SIZE;
}

export function buildBadgeImageUrl({ token, apiBase }) {
  const base = cleanBaseUrl(apiBase, "https://api.greentracer.org");
  return `${base}/api/badge/${encodeURIComponent(cleanToken(token) || "gtb_xxxxx")}`;
}

export function buildBadgeVerifyUrl({ token, domain = "", siteBase }) {
  const base = cleanBaseUrl(siteBase, "https://www.greentracer.org");
  const normalizedDomain = String(domain || "").trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
  if (normalizedDomain) return `${base}/verified/${encodeURIComponent(normalizedDomain)}`;
  return `${base}/verify/${encodeURIComponent(cleanToken(token) || "gtb_xxxxx")}`;
}

export function buildBadgeEmbedCode({
  badgeType = "greentracer_verified",
  token = "",
  domain = "",
  resultSlug = "",
  apiBase,
  backgroundColor = "",
  accentColor = "",
}) {
  const type = normalizeBadgeType(badgeType);
  const base = cleanBaseUrl(apiBase, "https://api.greentracer.org");
  const attrs = [
    `class="greentrace-badge"`,
    `data-badge-type="${escapeHtmlAttr(type)}"`,
  ];

  if (domain) attrs.push(`data-domain="${escapeHtmlAttr(domain)}"`);

  if (type === "greentracer_verified") {
    attrs.push(`data-public-token="${escapeHtmlAttr(cleanToken(token) || "gtb_xxxxx")}"`);
  } else {
    const slug = cleanSlug(resultSlug);
    if (slug) attrs.push(`data-result-slug="${escapeHtmlAttr(slug)}"`);
    if (!slug && domain) attrs.push(`data-site="${escapeHtmlAttr(domain)}"`);
  }

  const bg = cleanHex(backgroundColor);
  const accent = cleanHex(accentColor);
  if (bg) attrs.push(`data-bg-color="${escapeHtmlAttr(bg)}"`);
  if (accent) attrs.push(`data-accent-color="${escapeHtmlAttr(accent)}"`);

  return `<div
  ${attrs.join("\n  ")}
></div>
<script src="${base}/greentrace-badge.js" async></script>`;
}
