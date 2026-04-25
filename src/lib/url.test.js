import test from "node:test";
import assert from "node:assert/strict";

import { normalizeWebsiteUrl } from "./url.js";

test("normalizeWebsiteUrl standardizes hostnames and trims trailing slashes", () => {
  assert.equal(normalizeWebsiteUrl(" https://www.Example.com/path/ "), "https://example.com/path");
});

test("normalizeWebsiteUrl prepends https when a protocol is missing", () => {
  assert.equal(normalizeWebsiteUrl("example.com/about"), "https://example.com/about");
});

test("normalizeWebsiteUrl returns an empty string for invalid input", () => {
  assert.equal(normalizeWebsiteUrl("not a real url"), "");
  assert.equal(normalizeWebsiteUrl(""), "");
});
