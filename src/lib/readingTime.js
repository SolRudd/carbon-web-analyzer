const WORDS_PER_MINUTE = 220;

function normalizeReadingText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function estimateReadingMinutesFromText(text, wordsPerMinute = WORDS_PER_MINUTE) {
  const matches = normalizeReadingText(text).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g);
  const wordCount = matches ? matches.length : 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function estimatePostReadingMinutes(post) {
  const fallbackText = [
    post?.meta?.title,
    post?.meta?.excerpt,
    ...(post?.toc || []).map((heading) => heading?.text).filter(Boolean),
  ].join(" ");

  return estimateReadingMinutesFromText(fallbackText);
}

export function getPostReadingMinutes(post) {
  const explicitMinutes = Number(post?.meta?.readingMinutes);
  if (Number.isFinite(explicitMinutes) && explicitMinutes > 0) {
    return Math.round(explicitMinutes);
  }

  return estimatePostReadingMinutes(post);
}
