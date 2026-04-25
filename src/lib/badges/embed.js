const VARIANT_SIZES = {
  compact: { width: 240, height: 40 },
  standard: { width: 300, height: 50 },
};

function cleanBaseUrl(value, fallback) {
  const raw = String(value || "").trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
  return fallback;
}

function cleanToken(value) {
  return String(value || "").trim() || "PUBLIC_TOKEN";
}

export function normalizeBadgeVariant(variant) {
  return Object.prototype.hasOwnProperty.call(VARIANT_SIZES, variant) ? variant : "compact";
}

export function getBadgeEmbedSize(variant) {
  return VARIANT_SIZES[normalizeBadgeVariant(variant)];
}

export function buildBadgeImageUrl({ token, apiBase, variant = "compact", showMetric = true }) {
  const base = cleanBaseUrl(apiBase, "https://api.greentracer.org");
  const publicToken = cleanToken(token);
  const params = new URLSearchParams();
  if (normalizeBadgeVariant(variant) !== "compact") params.set("variant", variant);
  if (!showMetric) params.set("metric", "false");
  const query = params.toString();
  return `${base}/api/badge/${encodeURIComponent(publicToken)}${query ? `?${query}` : ""}`;
}

export function buildBadgeVerifyUrl({ token, siteBase }) {
  const base = cleanBaseUrl(siteBase, "https://www.greentracer.org");
  return `${base}/verify/${encodeURIComponent(cleanToken(token))}`;
}

export function buildBadgeEmbedCode({
  token,
  apiBase,
  siteBase,
  variant = "compact",
  showMetric = true,
}) {
  const normalizedVariant = normalizeBadgeVariant(variant);
  const { width, height } = getBadgeEmbedSize(normalizedVariant);
  const publicToken = cleanToken(token);
  const href = buildBadgeVerifyUrl({ token: publicToken, siteBase });
  const src = buildBadgeImageUrl({
    token: publicToken,
    apiBase,
    variant: normalizedVariant,
    showMetric,
  });

  return `<a href="${href}" target="_blank" rel="noopener">
  <img
    src="${src}"
    alt="GreenTracer Verified"
    width="${width}"
    height="${height}"
  />
</a>`;
}
