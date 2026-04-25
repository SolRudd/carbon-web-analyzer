export function normalizeWebsiteUrl(inputUrl) {
  let url = String(inputUrl || "").trim();

  if (!url) return "";

  if (!/^(https?:\/\/)/i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const urlObject = new URL(url);

    if (urlObject.hostname.startsWith("www.")) {
      urlObject.hostname = urlObject.hostname.substring(4);
    }

    return urlObject.origin + urlObject.pathname.replace(/\/+$/, "");
  } catch {
    return "";
  }
}
