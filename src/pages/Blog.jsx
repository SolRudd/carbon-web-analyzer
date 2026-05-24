import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Clock,
  Filter,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Terminal,
} from "lucide-react";
import {
  getPostReadingMinutes,
  estimatePostReadingMinutes,
} from "../lib/readingTime";
import { blogPosts } from "../blog/posts";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap');

  .gt-blog {
    --gt-bg: #020b13;
    --gt-bg-deep: #01070d;
    --gt-panel: rgba(7, 20, 35, 0.82);
    --gt-panel-soft: rgba(11, 27, 44, 0.76);
    --gt-panel-raised: rgba(13, 32, 51, 0.9);
    --gt-border: rgba(132, 204, 200, 0.18);
    --gt-border-strong: rgba(0, 218, 180, 0.36);
    --gt-text: #f5fbff;
    --gt-muted: #8fa6b8;
    --gt-dim: #5f7285;
    --gt-green: #00d084;
    --gt-teal: #00a19d;
    --gt-cyan: #4dd8ff;
    font-family: 'Inter', sans-serif;
    background:
      radial-gradient(circle at 50% 0%, rgba(0, 208, 132, 0.09), transparent 28rem),
      radial-gradient(circle at 10% 28%, rgba(0, 161, 157, 0.08), transparent 24rem),
      linear-gradient(180deg, var(--gt-bg-deep) 0%, var(--gt-bg) 42%, #01070d 100%);
    color: var(--gt-text);
  }

  .gt-blog-display {
    font-family: 'Fraunces', serif;
    letter-spacing: -0.03em;
  }

  .gt-blog-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .gt-blog-shell {
    position: relative;
    overflow: hidden;
  }

  .gt-blog-shell::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(to right, rgba(132, 204, 200, 0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(132, 204, 200, 0.028) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.76), transparent 46rem);
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.76), transparent 46rem);
  }

  .gt-blog-panel {
    position: relative;
    border: 1px solid var(--gt-border);
    background:
      linear-gradient(145deg, rgba(7, 20, 35, 0.94), rgba(5, 18, 31, 0.74)),
      radial-gradient(circle at top right, rgba(0, 208, 132, 0.08), transparent 18rem);
    box-shadow: 0 24px 80px -48px rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(16px);
  }

  .gt-blog-card {
    position: relative;
    overflow: hidden;
    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .gt-blog-card:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 218, 180, 0.32);
    box-shadow: 0 26px 76px -52px rgba(0, 208, 132, 0.58);
  }

  .gt-blog-pill,
  .gt-blog-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border: 1px solid var(--gt-border);
    background: rgba(11, 27, 44, 0.78);
    color: var(--gt-muted);
  }

  .gt-blog-tag {
    transition: color 160ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }

  .gt-blog-tag:hover {
    color: var(--gt-text);
    border-color: rgba(0, 218, 180, 0.34);
    background: rgba(13, 32, 51, 0.92);
  }

  .gt-blog-tag.is-active {
    color: #001a12;
    border-color: transparent;
    background: linear-gradient(135deg, #00d084, #4dd8ff);
    box-shadow: 0 16px 38px -24px rgba(0, 208, 132, 0.85);
  }

  .gt-blog-input {
    width: 100%;
    min-height: 52px;
    border: 1px solid rgba(132, 204, 200, 0.16);
    border-radius: 16px;
    background: rgba(1, 7, 13, 0.72);
    color: var(--gt-text);
    transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }

  .gt-blog-input::placeholder {
    color: rgba(143, 166, 184, 0.72);
  }

  .gt-blog-input:focus,
  .gt-blog-tag:focus-visible,
  .gt-blog-link:focus-visible,
  .gt-blog-button:focus-visible {
    outline: 2px solid rgba(77, 216, 255, 0.86);
    outline-offset: 3px;
  }

  .gt-blog-input:focus {
    border-color: rgba(0, 218, 180, 0.45);
    background: rgba(1, 7, 13, 0.9);
    box-shadow: 0 0 0 4px rgba(0, 208, 132, 0.09);
  }

  .gt-blog-link,
  .gt-blog-button {
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, color 160ms ease;
  }

  .gt-blog-link:hover,
  .gt-blog-button:hover {
    transform: translateY(-1px);
  }

  .gt-blog-title-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .gt-blog-excerpt-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .gt-blog-image {
    background:
      radial-gradient(circle at 50% 50%, rgba(0, 208, 132, 0.16), transparent 46%),
      #061523;
  }

  .gt-blog-hero-visual {
    min-height: 390px;
    isolation: isolate;
  }

  .gt-blog-hero-orbit {
    position: absolute;
    inset: 8%;
    border-radius: 999px;
    border: 1px solid rgba(0, 208, 132, 0.18);
    transform: rotate(var(--rotate, 0deg));
  }

  .gt-blog-hero-orbit::after {
    content: "";
    position: absolute;
    top: 8%;
    right: 16%;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #00d084;
    box-shadow: 0 0 18px rgba(0, 208, 132, 0.9);
  }

  .gt-blog-mesh {
    background-image:
      radial-gradient(circle, rgba(0, 208, 132, 0.22) 1px, transparent 1.5px),
      linear-gradient(to right, rgba(132, 204, 200, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(132, 204, 200, 0.04) 1px, transparent 1px);
    background-size: 22px 22px, 48px 48px, 48px 48px;
    mask-image: radial-gradient(circle at 50% 48%, black, transparent 68%);
    -webkit-mask-image: radial-gradient(circle at 50% 48%, black, transparent 68%);
  }

  .gt-blog-floating-card {
    border: 1px solid rgba(132, 204, 200, 0.22);
    background: linear-gradient(145deg, rgba(7, 20, 35, 0.94), rgba(1, 7, 13, 0.78));
    box-shadow: 0 22px 56px -36px rgba(0, 208, 132, 0.68);
  }

  .gt-blog-article-image::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(to top, rgba(1, 7, 13, 0.66), rgba(1, 7, 13, 0.05) 48%, transparent),
      radial-gradient(circle at 78% 24%, rgba(77, 216, 255, 0.14), transparent 12rem);
  }

  @media (max-width: 767px) {
    .gt-blog-hero-visual {
      min-height: 300px;
    }

    .gt-blog-tag-row {
      display: flex;
      overflow-x: auto;
      flex-wrap: nowrap;
      justify-content: flex-start;
      padding-bottom: 0.35rem;
      scrollbar-width: none;
    }

    .gt-blog-tag-row::-webkit-scrollbar {
      display: none;
    }

    .gt-blog-tag-row .gt-blog-tag {
      flex: 0 0 auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-blog-card,
    .gt-blog-link,
    .gt-blog-button,
    .gt-blog-tag {
      transition: none !important;
    }

    .gt-blog-card:hover,
    .gt-blog-link:hover,
    .gt-blog-button:hover {
      transform: none !important;
    }
  }
`;

const posts = blogPosts;

const allTags = [...new Set(posts.flatMap((post) => post.meta.tags || []))].sort((a, b) =>
  a.localeCompare(b)
);

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMonthYear(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function getReadingTime(post) {
  return getPostReadingMinutes(post) || estimatePostReadingMinutes(post);
}

function BlogHeroVisual() {
  return (
    <div className="gt-blog-hero-visual relative hidden lg:block" aria-hidden="true">
      <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_52%_48%,rgba(0,208,132,0.18),transparent_34%),radial-gradient(circle_at_55%_52%,rgba(77,216,255,0.09),transparent_50%)]" />
      <div className="gt-blog-mesh absolute inset-0 opacity-55" />
      <div className="gt-blog-hero-orbit [--rotate:-11deg]" />
      <div className="gt-blog-hero-orbit inset-[17%] [--rotate:22deg]" />
      <div className="gt-blog-hero-orbit inset-[29%] [--rotate:70deg]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 620 420" fill="none">
        <path d="M132 178C216 105 395 96 499 170" stroke="#00d084" strokeOpacity=".18" />
        <path d="M128 266C236 338 405 332 504 252" stroke="#4dd8ff" strokeOpacity=".12" />
        <path d="M204 106 310 206 424 103" stroke="#84ccc8" strokeOpacity=".08" />
        <path d="M180 316 310 206 452 314" stroke="#84ccc8" strokeOpacity=".08" />
      </svg>

      <div className="absolute left-1/2 top-1/2 grid h-56 w-56 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[42px] border border-[#00d084]/25 bg-[#071423]/75 shadow-[0_0_90px_rgba(0,208,132,0.2)]">
        <div className="absolute inset-5 rounded-[32px] border border-[#84ccc8]/12" />
        <div className="absolute inset-10 rounded-full border border-[#00d084]/18" />
        <svg className="relative h-32 w-32 text-[#00d084]" viewBox="0 0 180 180" fill="none">
          <path
            d="M90 18 140 42v40c0 35-20 67-50 83-30-16-50-48-50-83V42l50-24Z"
            stroke="currentColor"
            strokeWidth="7"
            fill="rgba(0,208,132,0.07)"
          />
          <path d="M70 96c-14-18-5-43 21-48 7 22 0 39-21 48Z" fill="rgba(0,208,132,0.78)" />
          <path d="M108 97c18-13 17-38-4-50-14 19-14 37 4 50Z" fill="rgba(132,204,200,0.74)" />
          <path d="M89 106c4-21 14-35 28-45" stroke="#f5fbff" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round" />
          <path d="M89 106c-4-18-12-30-26-39" stroke="#f5fbff" strokeOpacity=".48" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {[
        { Icon: BookOpen, className: "left-[9%] top-[28%]", tone: "text-[#00d084]" },
        { Icon: BarChart3, className: "right-[11%] top-[24%]", tone: "text-[#4dd8ff]" },
        { Icon: Terminal, className: "bottom-[16%] left-[18%]", tone: "text-[#84ccc8]" },
        { Icon: ShieldCheck, className: "bottom-[18%] right-[18%]", tone: "text-[#00d084]" },
      ].map(({ Icon: NodeIcon, className, tone }) => (
        <div
          key={className}
          className={`gt-blog-floating-card absolute grid h-20 w-20 place-items-center rounded-3xl ${className}`}
        >
          {React.createElement(NodeIcon, {
            className: `h-7 w-7 ${tone}`,
            strokeWidth: 1.7,
          })}
        </div>
      ))}
    </div>
  );
}

function MetaLine({ post }) {
  return (
    <div className="gt-blog-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f7285]">
      {post.meta.tags?.[0] && (
        <span className="inline-flex items-center gap-1.5 text-[#00d084]">
          <Tag className="h-3 w-3" />
          {post.meta.tags[0]}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3 w-3 text-[#00d084]" />
        {formatDate(post.meta.date)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-[#00d084]" />
        {getReadingTime(post)} min read
      </span>
    </div>
  );
}

function ArticleImage({ post, featured = false }) {
  return (
    <div
      className={`gt-blog-article-image gt-blog-image relative overflow-hidden ${
        featured ? "min-h-[300px] lg:min-h-[390px]" : "aspect-[16/9]"
      }`}
    >
      <img
        src={post.meta.image}
        alt={post.meta.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{
          objectPosition: featured
            ? post.meta.heroImagePosition
            : post.meta.cardImagePosition,
        }}
        loading={featured ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

function TagList({ tags, limit = 3 }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags?.slice(0, limit).map((tag) => (
        <span
          key={tag}
          className="gt-blog-mono rounded-full border border-[#84ccc8]/[0.15] bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8fa6b8]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ArticleCard({ post }) {
  return (
    <Link to={`/blog/${post.meta.slug}`} className="gt-blog-link group block h-full">
      <article className="gt-blog-panel gt-blog-card flex h-full flex-col rounded-[24px]">
        <ArticleImage post={post} />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <MetaLine post={post} />
          <h3 className="gt-blog-title-clamp mt-4 text-xl font-semibold leading-tight text-[#f5fbff] transition-colors group-hover:text-[#00d084]">
            {post.meta.title}
          </h3>
          <p className="gt-blog-excerpt-clamp mt-3 text-sm leading-relaxed text-[#8fa6b8]">
            {post.meta.excerpt}
          </p>
          <div className="mt-5 border-t border-[#84ccc8]/10 pt-4">
            <div className="flex items-center justify-between gap-4">
              <TagList tags={post.meta.tags} limit={2} />
              <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#84ccc8]/[0.15] bg-white/[0.035] text-[#00d084] transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return sortedPosts.filter((post) => {
      const matchesSearch =
        query === "" ||
        post.meta.title.toLowerCase().includes(query) ||
        post.meta.excerpt.toLowerCase().includes(query) ||
        (post.meta.tags || []).some((tag) => tag.toLowerCase().includes(query));

      const matchesTag =
        selectedTag === "All" || (post.meta.tags || []).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [sortedPosts, searchTerm, selectedTag]);

  const featuredPost = sortedPosts[0];
  const regularPosts = sortedPosts.slice(1);
  const isDefaultView = searchTerm.trim() === "" && selectedTag === "All";
  const visiblePosts = isDefaultView ? regularPosts : filteredPosts;
  const latestPostDate = sortedPosts[0]?.meta.date;

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
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
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

      <div className="gt-blog min-h-screen">
        <style>{pageStyles}</style>
        <div className="gt-blog-shell">
          <section className="relative px-5 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:pb-10">
            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,1fr)]">
              <div>
                <div className="gt-blog-pill gt-blog-mono mb-6 w-fit rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00d084]">
                  <BookOpen className="h-3 w-3" />
                  Blog archive
                </div>

                <h1 className="gt-blog-display max-w-4xl text-[clamp(3.25rem,8vw,6.7rem)] font-semibold leading-[0.94] text-[#f5fbff]">
                  The GreenTracer{" "}
                  <span className="block bg-gradient-to-r from-[#00d084] via-[#25e7a1] to-[#4dd8ff] bg-clip-text italic font-light text-transparent">
                    engineering log
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#b8c8d6] sm:text-lg">
                  Practical guides on web carbon measurement, green hosting,
                  performance optimisation, and building a lighter digital footprint
                  - written by the team behind GreenTracer.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["Carbon grading explained", "Green hosting guides", "GreenTracer badges & API"].map(
                    (label) => (
                      <span
                        key={label}
                        className="gt-blog-pill rounded-full px-3.5 py-2 text-sm font-semibold"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#00d084]" />
                        {label}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 border-y border-[#84ccc8]/[0.12] py-5">
                  <div className="flex items-center gap-3">
                    <span className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#84ccc8]/[0.14] bg-white/[0.035] text-[#00d084] sm:inline-flex">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="gt-blog-mono text-2xl font-semibold leading-none text-[#00d084]">
                        {posts.length}
                      </p>
                      <p className="gt-blog-mono mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5f7285]">
                        Articles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#84ccc8]/[0.14] bg-white/[0.035] text-[#00d084] sm:inline-flex">
                      <Tag className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="gt-blog-mono text-2xl font-semibold leading-none text-[#00d084]">
                        {allTags.length}
                      </p>
                      <p className="gt-blog-mono mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5f7285]">
                        Topics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#84ccc8]/[0.14] bg-white/[0.035] text-[#00d084] sm:inline-flex">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="gt-blog-mono text-lg font-semibold leading-none text-[#00d084] sm:text-2xl">
                        {formatMonthYear(latestPostDate)}
                      </p>
                      <p className="gt-blog-mono mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5f7285]">
                        Latest
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <BlogHeroVisual />
            </div>
          </section>

          <section className="relative z-10 px-5 py-8 sm:px-6">
            <div className="gt-blog-panel mx-auto max-w-6xl rounded-[28px] p-4 sm:p-5">
              <label className="sr-only" htmlFor="blog-search">
                Search blog articles
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f7285]" />
                <input
                  id="blog-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search articles, topics, or keywords..."
                  className="gt-blog-input pl-11 pr-4 text-sm"
                />
              </div>

              <div className="gt-blog-tag-row mt-4 flex flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedTag("All")}
                  aria-pressed={selectedTag === "All"}
                  className={`gt-blog-tag gt-blog-mono rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                    selectedTag === "All" ? "is-active" : ""
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  All posts
                </button>

                {allTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    aria-pressed={selectedTag === tag}
                    className={`gt-blog-tag gt-blog-mono rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                      selectedTag === tag ? "is-active" : ""
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {isDefaultView && featuredPost && (
            <section className="relative z-10 px-5 py-12 sm:px-6 sm:py-14">
              <div className="mx-auto max-w-7xl">
                <div className="mb-4 flex items-center gap-2 text-[#00d084]">
                  <Sparkles className="h-4 w-4" />
                  <h2 className="gt-blog-mono text-xs font-semibold uppercase tracking-[0.22em]">
                    Featured article
                  </h2>
                </div>

                <article className="gt-blog-panel gt-blog-card group overflow-hidden rounded-[28px]">
                  <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                    <ArticleImage post={featuredPost} featured />
                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                      <div>
                        <MetaLine post={featuredPost} />
                        <h2 className="gt-blog-display mt-5 text-3xl font-semibold leading-[1.05] text-[#f5fbff] sm:text-4xl lg:text-5xl">
                          {featuredPost.meta.title}
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#b8c8d6]">
                          {featuredPost.meta.excerpt}
                        </p>
                        <div className="mt-6">
                          <TagList tags={featuredPost.meta.tags} limit={4} />
                        </div>
                      </div>

                      <div className="mt-8">
                        <Link
                          to={`/blog/${featuredPost.meta.slug}`}
                          className="gt-blog-link inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5fbff] px-6 text-sm font-semibold text-[#020b13]"
                        >
                          Read full article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          )}

          <section className="relative z-10 px-5 py-12 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="gt-blog-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#00d084]">
                    {isDefaultView ? "All articles" : "Filtered articles"}
                  </p>
                  {!isDefaultView && (
                    <h2 className="mt-2 text-2xl font-semibold text-[#f5fbff]">
                      {visiblePosts.length} result{visiblePosts.length === 1 ? "" : "s"}
                    </h2>
                  )}
                </div>

                {!isDefaultView && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTag("All");
                    }}
                    className="gt-blog-button w-fit rounded-full border border-[#84ccc8]/[0.18] bg-white/[0.035] px-4 py-2 text-sm font-semibold text-[#b8c8d6]"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {visiblePosts.length === 0 ? (
                <div className="gt-blog-panel rounded-[28px] border-dashed p-10 text-center sm:p-14">
                  <Search className="mx-auto h-10 w-10 text-[#5f7285]" />
                  <h3 className="mt-5 text-xl font-semibold text-[#f5fbff]">
                    No matching articles found
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#8fa6b8]">
                    Try a different keyword or topic filter.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visiblePosts.map((post) => (
                    <ArticleCard key={post.meta.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="relative z-10 px-5 pb-20 pt-4 sm:px-6">
            <div className="gt-blog-panel mx-auto max-w-7xl overflow-hidden rounded-[28px] p-5 sm:p-6">
              <div className="relative grid gap-5 lg:grid-cols-[1fr_minmax(320px,0.8fr)] lg:items-center">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_20%,rgba(0,208,132,0.16),transparent_16rem),radial-gradient(circle_at_10%_100%,rgba(77,216,255,0.08),transparent_18rem)]" />
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-[#00d084]/[0.24] bg-[#00d084]/10 text-[#00d084]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-[#f5fbff]">Stay in the loop</h2>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#8fa6b8]">
                      Get new articles, data insights, and product updates.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="blog-newsletter-email">
                    Email address
                  </label>
                  <input
                    id="blog-newsletter-email"
                    type="email"
                    placeholder="you@company.com"
                    className="gt-blog-input min-w-0 flex-1 px-4 text-sm"
                  />
                  <button
                    type="button"
                    className="gt-blog-button inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-[#00d084] px-6 text-sm font-semibold text-[#001a12]"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
