import * as post1 from "./carbon-footprints-energy-providers.jsx";
import * as post2 from "./why-website-carbon-matters-2025.jsx";
import * as post3 from "./reduce-website-emissions-tips.jsx";
import * as post4 from "./case-study-greening-website.jsx";
import * as post5 from "./save-energy-in-summer.jsx";
import * as post6 from "./plastic-climate-crisis.jsx";
import * as post7 from "./improve-air-quality.jsx";
import * as post8 from "./verified-sustainability-badges-2026.jsx";
import * as post9 from "./from-free-scan-to-paid-verification-2026.jsx";
import * as post10 from "./website-carbon-reports-for-sales-teams-2026.jsx";
import * as post11 from "./turn-carbon-reports-into-retainers-2025.jsx";
import * as post12 from "./green-hosting-proof-without-greenwashing-2025.jsx";
import * as post13 from "./badge-renewal-checklist-2026.jsx";
import * as post14 from "./what-a-website-sustainability-calculator-should-show-2026.jsx";

export const blogPosts = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
  post11,
  post12,
  post13,
  post14,
]
  .filter(Boolean)
  .map((post) => ({
    ...post,
    meta: {
      ...post.meta,
      imageAvif: post.meta.imageAvif || post.meta.image,
      imagePosition: post.meta.imagePosition || "50% 50%",
      cardImagePosition: post.meta.cardImagePosition || post.meta.imagePosition || "50% 50%",
      heroImagePosition: post.meta.heroImagePosition || post.meta.imagePosition || "50% 50%",
      relatedImagePosition:
        post.meta.relatedImagePosition || post.meta.cardImagePosition || post.meta.imagePosition || "50% 50%",
    },
  }));
