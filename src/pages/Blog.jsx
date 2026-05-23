import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaArrowRight,
  FaBookmark,
  FaChartLine,
  FaClock,
  FaNewspaper,
  FaSearch,
  FaStar,
  FaTag,
  FaTerminal,
  FaUser,
} from "react-icons/fa";
import {
  getPostReadingMinutes,
  estimatePostReadingMinutes,
} from "../lib/readingTime";
import { blogPosts } from "../blog/posts";

const pageStyles = `
  /* ── Dark mode (default) ── */
  .gt-page {
    --gt-bg: #04111f;
    --gt-panel: rgba(7, 24, 39, 0.9);
    --gt-panel-2: rgba(9, 29, 46, 0.96);
    --gt-border: rgba(255,255,255,0.08);
    --gt-border-strong: rgba(74, 222, 128, 0.24);
    --gt-text: #f8fafc;
    --gt-muted: #94a3b8;
    --gt-muted-2: #64748b;
    --gt-green: #22c55e;
    --gt-green-2: #16a34a;
    --gt-green-3: #4ade80;
    --gt-white-btn: #f8fafc;
    --gt-dark-btn: #0f172a;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 24%),
      linear-gradient(180deg, #03101d 0%, #04111f 35%, #04111f 100%);
    color: var(--gt-text);
  }

  /* ── Light mode override ── */
  html:not(.dark) .gt-page {
    --gt-bg: #ffffff;
    --gt-panel: rgba(255, 255, 255, 0.85);
    --gt-panel-2: rgba(248, 250, 252, 0.95);
    --gt-border: rgba(0,0,0,0.07);
    --gt-border-strong: rgba(22, 163, 74, 0.22);
    --gt-text: #0f172a;
    --gt-muted: #475569;
    --gt-muted-2: #64748b;
    --gt-green: #16a34a;
    --gt-green-2: #15803d;
    --gt-green-3: #16a34a;
    --gt-white-btn: #0f172a;
    --gt-dark-btn: #f8fafc;
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.04), transparent 24%),
      linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #ffffff 100%);
    color: var(--gt-text);
  }

  html:not(.dark) .gt-hero-grid {
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
  }

  html:not(.dark) .gt-panel {
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
    border-color: rgba(0,0,0,0.07);
    box-shadow: 0 4px 24px -8px rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-chip {
    background: rgba(255,255,255,0.9);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-icon-box {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: var(--gt-green);
  }

  html:not(.dark) .gt-search {
    background: rgba(255,255,255,0.95);
    border-color: rgba(0,0,0,0.10);
  }

  html:not(.dark) .gt-input {
    color: #0f172a;
  }

  html:not(.dark) .gt-input::placeholder {
    color: #94a3b8;
  }

  html:not(.dark) .gt-tag-btn {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: #475569;
  }

  html:not(.dark) .gt-tag-btn:hover {
    background: rgba(0,0,0,0.05);
    border-color: rgba(22,163,74,0.25);
    color: #0f172a;
  }

  html:not(.dark) .gt-btn--ghost {
    background: rgba(0,0,0,0.04);
    color: #0f172a;
    border-color: rgba(0,0,0,0.10);
  }

  html:not(.dark) .gt-trust-pill {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: #475569;
  }

  html:not(.dark) .gt-overlay {
    background: linear-gradient(to top, rgba(248,250,252,0.72), rgba(248,250,252,0.12), transparent);
  }

  html:not(.dark) .gt-divider {
    border-top-color: rgba(0,0,0,0.07);
  }

  html:not(.dark) .gt-stat__value {
    color: var(--gt-green);
  }

  .gt-display {
    font-family: Georgia, Cambria, "Times New Roman", serif;
    letter-spacing: -0.03em;
  }

  .gt-mono {
    font-family: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  }

  .gt-hero-grid {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.10));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.10));
  }

  .gt-panel {
    background: linear-gradient(180deg, var(--gt-panel) 0%, var(--gt-panel-2) 100%);
    border: 1px solid var(--gt-border);
    border-radius: 28px;
    backdrop-filter: blur(10px);
    box-shadow: 0 18px 60px -32px rgba(0,0,0,0.6);
  }

  .gt-card {
    position: relative;
    overflow: hidden;
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
  }

  .gt-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.12);
  }

  .gt-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid var(--gt-border);
    background: rgba(5, 19, 31, 0.7);
  }

  .gt-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 14px;
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-green-3);
    flex: 0 0 auto;
  }

  .gt-btn,
  .gt-link-btn {
    min-height: 54px;
    border-radius: 999px;
    font-weight: 800;
    transition: transform .18s ease, filter .18s ease, background .18s ease, border-color .18s ease;
  }

  .gt-btn:hover,
  .gt-link-btn:hover {
    transform: translateY(-1px);
  }

  .gt-btn--light {
    background: var(--gt-white-btn);
    color: var(--gt-dark-btn);
  }

  .gt-btn--green {
    background: linear-gradient(135deg, var(--gt-green-2) 0%, var(--gt-green) 100%);
    color: white;
  }

  .gt-btn--ghost {
    background: rgba(255,255,255,0.06);
    color: white;
    border: 1px solid var(--gt-border);
  }

  .gt-btn--light:hover,
  .gt-btn--green:hover,
  .gt-btn--ghost:hover {
    filter: brightness(1.03);
  }

  .gt-btn:focus-visible,
  .gt-link-btn:focus-visible,
  .gt-input:focus-visible,
  .gt-tag-btn:focus-visible {
    outline: 2px solid var(--gt-green-3);
    outline-offset: 2px;
  }

  .gt-search {
    border: 1px solid var(--gt-border);
    background: rgba(6, 22, 35, 0.84);
    border-radius: 18px;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .gt-search:focus-within {
    border-color: rgba(74, 222, 128, 0.4);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }

  .gt-input {
    background: transparent;
    color: white;
  }

  .gt-input::placeholder {
    color: var(--gt-muted);
  }

  .gt-tag-btn {
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-muted);
    border-radius: 999px;
    transition: all .18s ease;
  }

  .gt-tag-btn:hover {
    color: white;
    border-color: rgba(74, 222, 128, 0.28);
    background: rgba(255,255,255,0.06);
  }

  .gt-tag-btn.is-active {
    background: linear-gradient(135deg, var(--gt-green-2) 0%, var(--gt-green) 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 12px 24px -14px rgba(34,197,94,0.65);
  }

  .gt-stat {
    min-width: 110px;
  }

  .gt-stat__value {
    color: var(--gt-green-3);
  }

  .gt-overlay {
    background: linear-gradient(to top, rgba(2,8,23,0.72), rgba(2,8,23,0.12), transparent);
  }

  .gt-featured-image {
    min-height: 320px;
  }

  .gt-divider {
    border-top: 1px solid var(--gt-border);
  }

  .gt-post-card__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .gt-post-card__excerpt {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .gt-section-clean {
    background: transparent;
  }

  .gt-trust-pill {
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-muted);
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }

  /* Light mode typography */
  html:not(.dark) .gt-page h1,
  html:not(.dark) .gt-page h2,
  html:not(.dark) .gt-page h3 {
    color: #0f172a;
  }

  html:not(.dark) .gt-page .text-slate-300 {
    color: #475569;
  }

  html:not(.dark) .gt-post-card__title {
    color: #0f172a;
  }

  html:not(.dark) .gt-page section {
    border-color: rgba(0,0,0,0.06) !important;
  }

  @media (max-width: 767px) {
    .gt-featured-image {
      min-height: 240px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-card,
    .gt-btn,
    .gt-link-btn,
    .gt-tag-btn {
      transition: none !important;
    }

    .gt-card:hover,
    .gt-btn:hover,
    .gt-link-btn:hover {
      transform: none !important;
    }
  }
`;

const posts = blogPosts;

const allTags = [...new Set(posts.flatMap((p) => p.meta.tags || []))];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
  }, []);

  const filteredPosts = useMemo(() => {
    return sortedPosts.filter((post) => {
      const matchesSearch =
        searchTerm === "" ||
        post.meta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.meta.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.meta.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesTag =
        selectedTag === "All" || (post.meta.tags || []).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [sortedPosts, searchTerm, selectedTag]);

  const featuredPost = sortedPosts[0];
  const regularPosts = sortedPosts.slice(1);

  const visiblePosts =
    searchTerm === "" && selectedTag === "All" ? regularPosts : filteredPosts;

  const getReadingTime = (post) => getPostReadingMinutes(post) || estimatePostReadingMinutes(post);

  const latestYear =
    sortedPosts.length > 0
      ? new Date(sortedPosts[0].meta.date).getFullYear()
      : new Date().getFullYear();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "GreenTracer Blog",
    description:
      "Expert insights on web sustainability, carbon reduction strategies, and environmental technology.",
    url: "https://www.greentracer.org/blog",
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filteredPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.greentracer.org/blog/${post.meta.slug}`,
      name: post.meta.title,
      image: post.meta.image,
    })),
  };

  return (
    <>
      <Helmet>
        <title>GreenTracer Blog | Web Carbon, Green Hosting & Sustainable Web Dev</title>
        <meta
          name="description"
          content="Practical guides on web carbon reduction, green hosting, GreenTracer's grading system, and building a faster, lighter, lower-carbon web."
        />
        <link rel="canonical" href="https://www.greentracer.org/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/blog" />
        <meta
          property="og:title"
          content="GreenTracer Blog | Web Sustainability & Carbon Reduction"
        />
        <meta
          property="og:description"
          content="Expert insights on web sustainability, carbon reduction strategies, and environmental technology."
        />
        <meta
          property="og:image"
          content="https://www.greentracer.org/GreenFavi.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/blog" />
        <meta
          property="twitter:title"
          content="GreenTracer Blog | Web Sustainability & Carbon Reduction"
        />
        <meta
          property="twitter:description"
          content="Expert insights on web sustainability, carbon reduction strategies, and environmental technology."
        />
        <meta
          property="twitter:image"
          content="https://www.greentracer.org/GreenFavi.png"
        />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <div className="gt-page min-h-screen">
        <style>{pageStyles}</style>

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5 px-6 pb-16 pt-28 sm:pt-32">
          <div className="gt-hero-grid absolute inset-0 pointer-events-none opacity-60" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-[-120px] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="gt-chip">
                <FaNewspaper className="text-[11px] text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Knowledge Hub
                </span>
              </div>
            </div>

            <h1 className="gt-display mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-7xl">
              The GreenTracer
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text italic font-light text-transparent">
                engineering log
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Practical guides on web carbon measurement, green hosting, performance
              optimisation, and building a lighter digital footprint — written by the
              team behind GreenTracer.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="gt-trust-pill">Carbon grading explained</span>
              <span className="gt-trust-pill">Green hosting guides</span>
              <span className="gt-trust-pill">GreenTracer badges & API</span>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10">
              <div className="gt-stat text-center">
                <div className="gt-mono gt-stat__value text-2xl font-bold">
                  {posts.length}
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Articles
                </div>
              </div>
              <div className="gt-stat text-center">
                <div className="gt-mono gt-stat__value text-2xl font-bold">
                  {allTags.length}
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Topics
                </div>
              </div>
              <div className="gt-stat text-center">
                <div className="gt-mono gt-stat__value text-2xl font-bold">
                  {latestYear}
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Latest Year
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="gt-section-clean border-b border-white/5 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="gt-panel p-5 sm:p-6">
              <div className="gt-search mx-auto flex max-w-2xl items-center px-4 py-3">
                <FaSearch className="mr-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="gt-input w-full border-none outline-none text-sm sm:text-base"
                  aria-label="Search blog articles"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTag("All")}
                  className={`gt-tag-btn gt-mono px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${
                    selectedTag === "All" ? "is-active" : ""
                  }`}
                >
                  <FaTag className="mr-2 inline text-[10px]" />
                  All Posts
                </button>

                {allTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`gt-tag-btn gt-mono px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${
                      selectedTag === tag ? "is-active" : ""
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        {searchTerm === "" && selectedTag === "All" && featuredPost && (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex items-center gap-3">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                <h2 className="gt-mono text-sm font-bold uppercase tracking-[0.22em] text-green-400">
                  Featured Article
                </h2>
              </div>

              <article className="gt-panel gt-card overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="gt-featured-image relative overflow-hidden">
                    <img
                      src={featuredPost.meta.image}
                      alt={featuredPost.meta.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      style={{ objectPosition: featuredPost.meta.heroImagePosition }}
                    />
                    <div className="gt-overlay absolute inset-0" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                      <FaStar className="text-yellow-400" />
                      Editor’s Pick
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-8 lg:p-12">
                    <div>
                      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        <span className="gt-mono flex items-center gap-2">
                          <FaUser className="text-green-400" />
                          {featuredPost.meta.author}
                        </span>
                        <span className="gt-mono flex items-center gap-2">
                          <FaClock className="text-green-400" />
                          {new Date(featuredPost.meta.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="gt-mono flex items-center gap-2">
                          <FaBookmark className="text-green-400" />
                          {getReadingTime(featuredPost)} min read
                        </span>
                      </div>

                      <h2 className="gt-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                        {featuredPost.meta.title}
                      </h2>

                      <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
                        {featuredPost.meta.excerpt}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {featuredPost.meta.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="gt-mono rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link
                        to={`/blog/${featuredPost.meta.slug}`}
                        className="gt-link-btn gt-btn--light inline-flex items-center justify-center gap-2 px-8 py-4 text-sm"
                      >
                        Read Article
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* RESULTS / ARTICLE GRID */}
        <section className="border-t border-white/5 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            {(searchTerm !== "" || selectedTag !== "All") && (
              <div className="mb-8 flex items-center gap-3">
                <FaTerminal className="text-green-400" />
                <h2 className="gt-mono text-sm font-bold uppercase tracking-[0.22em] text-green-400">
                  Results: {searchTerm ? `"${searchTerm}"` : selectedTag}
                </h2>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="gt-panel rounded-3xl border border-dashed border-white/10 p-14 text-center">
                <FaSearch className="mx-auto mb-4 text-4xl text-slate-500" />
                <h3 className="text-xl font-bold text-white">
                  No matching articles found
                </h3>
                <p className="mt-2 text-slate-400">
                  Try a different keyword or tag.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                  <Link
                    to={`/blog/${post.meta.slug}`}
                    key={post.meta.slug}
                    className="group block"
                  >
                    <article className="gt-panel gt-card flex h-full flex-col overflow-hidden">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={post.meta.image}
                          alt={post.meta.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          style={{ objectPosition: post.meta.cardImagePosition }}
                        />
                        <div className="gt-overlay absolute inset-0 opacity-80" />
                        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                          {getReadingTime(post)} min
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          <span className="gt-mono inline-flex items-center gap-1.5">
                            <FaUser className="text-green-400" />
                            {post.meta.author}
                          </span>
                          <span className="gt-mono inline-flex items-center gap-1.5">
                            <FaClock className="text-green-400" />
                            {new Date(post.meta.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <h3 className="gt-post-card__title text-xl font-bold leading-tight text-white transition-colors group-hover:text-green-300">
                          {post.meta.title}
                        </h3>

                        <p className="gt-post-card__excerpt mt-3 text-sm leading-relaxed text-slate-400">
                          {post.meta.excerpt}
                        </p>

                        <div className="gt-divider mt-6 pt-4" />

                        <div className="mt-auto flex items-center justify-between gap-4 pt-1">
                          <div className="flex min-w-0 flex-wrap gap-2">
                            {post.meta.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="gt-mono text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <FaArrowRight className="flex-shrink-0 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-green-400" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA / NEWSLETTER */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="gt-panel relative overflow-hidden border-white/10 px-8 py-12 sm:px-10 sm:py-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]" />

              <div className="relative z-10">
                <div className="gt-icon-box mx-auto mb-6">
                  <FaChartLine className="text-lg" />
                </div>

                <h2 className="gt-display text-3xl font-bold text-white sm:text-4xl">
                  Stay updated on web sustainability
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                  Get the latest engineering insights, carbon reduction strategies,
                  and GreenTracer updates delivered to your inbox.
                </p>

                <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="gt-input gt-search min-h-[54px] flex-1 px-5 py-4 text-sm"
                    aria-label="Email address"
                  />
                  <button
                    type="button"
                    className="gt-btn gt-btn--green inline-flex items-center justify-center px-6 py-4 text-xs uppercase tracking-[0.16em]"
                  >
                    Subscribe
                  </button>
                </div>

                <p className="gt-mono mt-4 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  No spam. Opt-out anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
