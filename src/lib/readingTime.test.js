import test from "node:test";
import assert from "node:assert/strict";

import {
  getPostReadingMinutes,
  estimatePostReadingMinutes,
  estimateReadingMinutesFromText,
} from "./readingTime.js";

test("estimateReadingMinutesFromText uses a realistic words-per-minute calculation", () => {
  const text = Array.from({ length: 440 }, (_, index) => `word${index}`).join(" ");
  assert.equal(estimateReadingMinutesFromText(text), 2);
});

test("estimatePostReadingMinutes falls back to metadata and toc copy", () => {
  const post = {
    meta: {
      title: "Short guide",
      excerpt: "This is a concise article summary for the reading time fallback.",
    },
    toc: [
      { text: "Intro" },
      { text: "Main section" },
      { text: "Conclusion" },
    ],
  };

  assert.equal(estimatePostReadingMinutes(post), 1);
});

test("getPostReadingMinutes prefers explicit metadata when provided", () => {
  assert.equal(
    getPostReadingMinutes({
      meta: { readingMinutes: 6 },
      toc: [],
    }),
    6
  );
});
