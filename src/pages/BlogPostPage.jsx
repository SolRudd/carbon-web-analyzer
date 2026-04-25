import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBars,
  FaBolt,
  FaCertificate,
  FaCheck,
  FaChevronUp,
  FaClock,
  FaCopy,
  FaFacebook,
  FaLeaf,
  FaLinkedin,
  FaList,
  FaTimes,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import { getPostReadingMinutes } from "../lib/readingTime";
import { blogPosts } from "../blog/posts";

const posts = blogPosts;

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');

  .gt-article-page {
    --gt-bg: #04111f;
    --gt-panel: rgba(7, 24, 39, 0.92);
    --gt-panel-2: rgba(10, 28, 44, 0.97);
    --gt-border: rgba(255,255,255,0.08);
    --gt-border-strong: rgba(74, 222, 128, 0.22);
    --gt-text: #f8fafc;
    --gt-muted: #d7e2ef;
    --gt-muted-2: #94a3b8;
    --gt-green: #22c55e;
    --gt-green-2: #16a34a;
    --gt-chip-bg: rgba(5, 19, 31, 0.74);
    --gt-soft-bg: rgba(255,255,255,0.05);
    --gt-soft-bg-2: rgba(255,255,255,0.03);
    --gt-hero-overlay-from: rgba(4,17,31,0.98);
    --gt-hero-overlay-via: rgba(4,17,31,0.42);
    --gt-quote-bg: rgba(34,197,94,0.10);
    --gt-inline-code-bg: rgba(15,23,42,0.65);
    --gt-code-bg: rgba(2,8,23,0.88);
    font-family: 'Inter', sans-serif;
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 24%),
      linear-gradient(180deg, #03101d 0%, #04111f 38%, #04111f 100%);
    color: var(--gt-text);
  }

  html:not(.dark) .gt-article-page {
    --gt-panel: rgba(255,255,255,0.92);
    --gt-panel-2: rgba(248,250,252,0.98);
    --gt-border: rgba(0,0,0,0.08);
    --gt-border-strong: rgba(22, 163, 74, 0.18);
    --gt-text: #0f172a;
    --gt-muted: #334155;
    --gt-muted-2: #64748b;
    --gt-green: #16a34a;
    --gt-green-2: #15803d;
    --gt-chip-bg: rgba(255,255,255,0.88);
    --gt-soft-bg: rgba(15,23,42,0.05);
    --gt-soft-bg-2: rgba(15,23,42,0.03);
    --gt-hero-overlay-from: rgba(248,250,252,0.98);
    --gt-hero-overlay-via: rgba(248,250,252,0.26);
    --gt-quote-bg: rgba(22,163,74,0.08);
    --gt-inline-code-bg: rgba(15,23,42,0.06);
    --gt-code-bg: rgba(248,250,252,0.98);
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.04), transparent 24%),
      linear-gradient(180deg, #f8fafc 0%, #ffffff 38%, #ffffff 100%);
    color: var(--gt-text);
  }

  .gt-article-page .gt-display {
    font-family: 'Fraunces', serif;
    letter-spacing: -0.03em;
  }

  .gt-article-page .gt-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .gt-article-grid {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.12));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.12));
  }

  html:not(.dark) .gt-article-grid {
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
  }

  .gt-article-page .gt-panel {
    background: linear-gradient(180deg, var(--gt-panel) 0%, var(--gt-panel-2) 100%);
    border: 1px solid var(--gt-border);
    border-radius: 28px;
    backdrop-filter: blur(12px);
    box-shadow: 0 18px 60px -32px rgba(0,0,0,0.55);
  }

  .gt-article-page .gt-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--gt-border);
    background: var(--gt-chip-bg);
    padding: 8px 14px;
    border-radius: 999px;
  }

  .gt-article-page .gt-eyebrow {
    border: 1px solid var(--gt-border);
    background: var(--gt-chip-bg);
    color: var(--gt-text);
    backdrop-filter: blur(10px);
  }

  .gt-article-page .gt-heading {
    color: var(--gt-text);
  }

  .gt-article-page .gt-subtle {
    color: var(--gt-muted);
  }

  .gt-article-page .gt-subtle-2 {
    color: var(--gt-muted-2);
  }

  .gt-article-page .gt-divider {
    border-color: var(--gt-border);
  }

  .gt-article-page .gt-hero-overlay {
    background: linear-gradient(to top, var(--gt-hero-overlay-from), var(--gt-hero-overlay-via), transparent);
  }

  .gt-article-page .gt-hero-title {
    color: var(--gt-text);
    text-shadow: 0 12px 32px rgba(0,0,0,0.24);
  }

  html:not(.dark) .gt-article-page .gt-hero-title {
    text-shadow: none;
  }

  .gt-article-page .gt-toc-link {
    display: block;
    width: 100%;
    border-radius: 14px;
    padding: 10px 12px;
    color: var(--gt-muted);
    transition: background .2s ease, color .2s ease;
  }

  .gt-article-page .gt-toc-link:hover {
    background: var(--gt-soft-bg);
    color: var(--gt-text);
  }

  .gt-article-page .gt-toc-link.is-active {
    background: rgba(34,197,94,0.14);
    color: var(--gt-text);
    border-left: 3px solid var(--gt-green);
  }

  .gt-article-page .blog-content {
    color: var(--gt-muted);
  }

  .gt-article-page .blog-content a {
    color: var(--gt-green-2);
    text-decoration: none;
  }

  .gt-article-page .blog-content a:hover {
    text-decoration: underline;
  }

  .gt-article-page .blog-content blockquote {
    border-left: 4px solid var(--gt-green);
    background: var(--gt-quote-bg);
    border-radius: 0 16px 16px 0;
    padding: 20px 24px;
  }

  .gt-article-page .blog-content h1,
  .gt-article-page .blog-content h2,
  .gt-article-page .blog-content h3,
  .gt-article-page .blog-content h4,
  .gt-article-page .blog-content strong,
  .gt-article-page .blog-content th {
    color: var(--gt-text);
  }

  .gt-article-page .blog-content p,
  .gt-article-page .blog-content li,
  .gt-article-page .blog-content td {
    color: var(--gt-muted);
  }

  .gt-article-page .blog-content blockquote p {
    color: var(--gt-text);
  }

  .gt-article-page .blog-content hr,
  .gt-article-page .blog-content table,
  .gt-article-page .blog-content th,
  .gt-article-page .blog-content td {
    border-color: var(--gt-border);
  }

  .gt-article-page .blog-content thead {
    background: var(--gt-soft-bg);
  }

  .gt-article-page .blog-content code {
    color: var(--gt-text);
    background: var(--gt-inline-code-bg);
    border: 1px solid var(--gt-border);
    border-radius: 8px;
    padding: 0.15rem 0.4rem;
  }

  .gt-article-page .blog-content pre {
    color: var(--gt-text);
    background: var(--gt-code-bg);
    border: 1px solid var(--gt-border);
    border-radius: 20px;
    padding: 1rem 1.1rem;
    overflow-x: auto;
  }

  .gt-article-page .blog-content pre code {
    background: transparent;
    border: none;
    padding: 0;
  }

  .gt-article-page .blog-content img {
    border-radius: 24px;
    border: 1px solid var(--gt-border);
  }

  .gt-article-page .gt-tag-pill {
    border: 1px solid var(--gt-border);
    background: var(--gt-soft-bg);
    color: var(--gt-muted);
  }

  .gt-article-page .gt-related-card {
    overflow: hidden;
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
  }

  .gt-article-page .gt-related-card:hover {
    transform: translateY(-4px);
    border-color: var(--gt-border-strong);
  }

  .gt-article-page .gt-related-image {
    transition: transform .35s ease;
  }

  .gt-article-page .gt-related-card:hover .gt-related-image {
    transform: scale(1.06);
  }

  .gt-article-page .gt-outline-btn {
    border: 1px solid var(--gt-border-strong);
    color: var(--gt-green);
    background: transparent;
  }

  html:not(.dark) .gt-article-page .gt-outline-btn {
    background: rgba(22,163,74,0.06);
  }

  .gt-article-page .prose :where(code):not(:where([class~="not-prose"] *))::before,
  .gt-article-page .prose :where(code):not(:where([class~="not-prose"] *))::after {
    content: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-article-page .gt-related-card,
    .gt-article-page .gt-related-image,
    .gt-article-page .gt-toc-link {
      transition: none !important;
    }
  }
`;

const TableOfContents = ({ toc = [], isOpen, setIsOpen }) => {
  const [activeId, setActiveId] = useState("");
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "0% 0% -85% 0%" }
    );

    const elements = toc.map((heading) => document.getElementById(heading.id)).filter(Boolean);
    elements.forEach((element) => observer.current.observe(element));

    return () => observer.current?.disconnect();
  }, [toc]);

  if (!toc?.length) return null;

  const tocNav = (
    <nav className="space-y-2">
      {toc.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(event) => {
            event.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            if (isOpen) setIsOpen(false);
          }}
          className={`gt-toc-link transition-all duration-200 ${activeId === heading.id ? "is-active font-semibold" : ""}`}
          style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="gt-panel fixed right-0 top-0 h-full w-80 rounded-none border-l p-6 overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="gt-heading text-lg font-bold">Table of Contents</h3>
              <button onClick={() => setIsOpen(false)} className="gt-subtle rounded-lg p-2">
                <FaTimes />
              </button>
            </div>
            {tocNav}
          </div>
        </div>
      ) : null}

      <div className="gt-panel fixed left-8 top-1/2 z-40 hidden max-h-[70vh] w-64 -translate-y-1/2 overflow-y-auto rounded-2xl p-4 shadow-xl lg:block">
        <div className="gt-divider mb-4 flex items-center gap-2 border-b pb-2">
          <FaList className="text-green-400" />
          <h3 className="gt-heading text-sm font-semibold">Contents</h3>
        </div>
        {tocNav}
      </div>
    </>
  );
};

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-slate-200 dark:bg-slate-800">
      <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${progress}%` }} />
    </div>
  );
};

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://www.greentracer.org${url}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="gt-subtle text-sm font-medium">Share:</span>
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#1DA1F2] p-2 text-white hover:bg-[#0c85d0]"
      >
        <FaTwitter />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#0077B5] p-2 text-white hover:bg-[#005582]"
      >
        <FaLinkedin />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#1877F2] p-2 text-white hover:bg-[#0b5cce]"
      >
        <FaFacebook />
      </a>
    </div>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-40 rounded-full bg-green-600 p-3 text-white shadow-lg hover:bg-green-700"
    >
      <FaChevronUp />
    </button>
  );
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [tocOpen, setTocOpen] = useState(false);
  const post = posts.find((entry) => entry?.meta?.slug === slug);
  const [readingTime, setReadingTime] = useState(() => (post ? getPostReadingMinutes(post) : 1));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    setReadingTime(getPostReadingMinutes(post));
  }, [post]);

  if (!post) {
    return (
      <>
        <style>{pageStyles}</style>
        <Helmet>
          <title>Post Not Found</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="gt-article-page flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold">Post Not Found</h1>
            <p className="mb-8">The article &quot;{slug}&quot; does not exist.</p>
            <Link to="/blog" className="inline-flex items-center rounded-full bg-green-600 px-6 py-3 text-white">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </section>
      </>
    );
  }

  const { meta, toc, default: PostContent } = post;
  const relatedPosts = posts
    .filter((entry) => entry?.meta?.slug !== slug)
    .map((entry) => ({
      entry,
      sharedTagCount: entry.meta.tags.filter((tag) => meta.tags.includes(tag)).length,
    }))
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      return new Date(b.entry.meta.date) - new Date(a.entry.meta.date);
    })
    .map(({ entry }) => entry)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    image: `https://www.greentracer.org${meta.image}`,
    author: { "@type": "Person", name: meta.author },
    publisher: {
      "@type": "Organization",
      name: "GreenTracer",
      logo: { "@type": "ImageObject", url: "https://www.greentracer.org/GreenTraceLogo.png" },
    },
    datePublished: meta.date,
    dateModified: meta.date,
  };

  return (
    <>
      <style>{pageStyles}</style>
      <Helmet>
        <title>{`${meta.title} | GreenTracer Blog`}</title>
        <meta name="description" content={meta.excerpt} />
        <link rel="canonical" href={`https://www.greentracer.org/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.greentracer.org/blog/${slug}`} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={`https://www.greentracer.org${meta.image}`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.excerpt} />
        <meta property="twitter:image" content={`https://www.greentracer.org${meta.image}`} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <main className="gt-article-page relative min-h-screen overflow-hidden">
        <ReadingProgress />
        <div className="gt-article-grid absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[-140px] h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-8 right-[12%] h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>

        <div className="gt-divider relative h-[48vh] overflow-hidden border-b lg:h-[56vh]">
          <img src={meta.image} alt={meta.title} className="h-full w-full object-cover" />
          <div className="gt-hero-overlay absolute inset-0" />

          <div className="absolute left-8 right-8 top-8 z-20 flex items-center justify-between">
            <Link to="/blog" className="gt-chip gt-mono text-xs font-bold uppercase tracking-[0.18em]">
              <FaArrowLeft className="text-green-400" />
              Back to Blog
            </Link>
            <button onClick={() => setTocOpen(true)} className="gt-chip gt-mono text-xs font-bold uppercase tracking-[0.18em] lg:hidden">
              <FaBars className="text-green-400" />
              Contents
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-5xl px-4 pb-10 sm:px-6">
            <div className="gt-eyebrow mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em]">
              <FaLeaf className="text-green-400" />
              GreenTracer Knowledge Hub
            </div>
            <h1 className="gt-display gt-hero-title max-w-4xl text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl">
              {meta.title}
            </h1>
          </div>
        </div>

        <TableOfContents toc={toc || []} isOpen={tocOpen} setIsOpen={setTocOpen} />

        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-10">
          <div className="gt-panel mb-10 p-8 lg:p-10">
            <div className="gt-subtle-2 mb-6 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em]">
              <div className="gt-chip">
                <FaUser className="text-green-400" />
                {meta.author}
              </div>
              <div className="gt-chip">
                <FaClock className="text-green-400" />
                {new Date(meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="gt-chip">
                <FaBolt className="text-green-400" />
                {readingTime} min read
              </div>
            </div>

            <p className="gt-subtle max-w-3xl text-lg leading-relaxed">{meta.excerpt}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {meta.tags?.map((tag) => (
                <span
                  key={tag}
                  className="gt-tag-pill rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="gt-divider mt-8 border-t pt-6">
              <ShareButtons title={meta.title} url={`/blog/${slug}`} />
            </div>
          </div>

          <div className="gt-panel p-8 lg:p-12">
            <div className="blog-content prose prose-lg max-w-none">
              <PostContent />
            </div>
          </div>

          {relatedPosts.length > 0 ? (
            <div className="mt-16">
              <h2 className="gt-display gt-heading mb-8 text-center text-3xl font-semibold">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.meta.slug}
                    to={`/blog/${relatedPost.meta.slug}`}
                    className="gt-panel gt-related-card group"
                  >
                    <img src={relatedPost.meta.image} alt={relatedPost.meta.title} className="gt-related-image h-48 w-full object-cover" />
                    <div className="p-6">
                      <h3 className="gt-heading mb-2 text-lg font-bold transition-colors group-hover:text-green-400">
                        {relatedPost.meta.title}
                      </h3>
                      <p className="gt-subtle line-clamp-3 text-sm">{relatedPost.meta.excerpt}</p>
                      <div className="gt-subtle-2 mt-4 flex items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <FaClock />
                          {new Date(relatedPost.meta.date).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <FaBolt />
                          {getPostReadingMinutes(relatedPost)} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="gt-panel mt-16 p-8 text-center">
            <FaLeaf className="mx-auto mb-4 text-4xl text-green-400" />
            <h3 className="gt-display gt-heading mb-4 text-2xl font-semibold">
              Ready to reduce your website&apos;s carbon footprint?
            </h3>
            <p className="gt-subtle mb-6">
              Use the carbon checker to generate a report, then turn that result into a public trust signal.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/" className="inline-flex items-center rounded-full bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white">
                <FaBolt className="mr-2" />
                Test Your Site
              </Link>
              <Link to="/badge" className="gt-outline-btn inline-flex items-center rounded-full px-6 py-3 font-semibold hover:bg-green-500/10">
                <FaCertificate className="mr-2" />
                Get Your Badge
              </Link>
            </div>
          </div>
        </div>

        <ScrollToTop />
      </main>
    </>
  );
}
