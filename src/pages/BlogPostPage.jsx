import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaLeaf, 
  FaClock, 
  FaUser, 
  FaList,
  FaBolt,
  FaEye,
  FaChevronUp,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaCopy,
  FaCheck,
  FaBars,
  FaTimes,
  FaCertificate
} from "react-icons/fa";
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/why-website-carbon-matters-2025.jsx";
import * as post3 from "../blog/reduce-website-emissions-tips.jsx";
import * as post4 from "../blog/case-study-greening-website.jsx";
import * as post5 from "../blog/save-energy-in-summer.jsx";
import * as post6 from "../blog/plastic-climate-crisis.jsx";
import * as post7 from "../blog/improve-air-quality.jsx";

const posts = [post1, post2, post3, post4, post5, post6, post7];

// --- Table of Contents ---
const TableOfContents = ({ toc = [], isOpen, setIsOpen }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!toc?.length) return;
    const onScroll = () => {
      let found = '';
      for (const heading of toc) {
        const el = document.getElementById(heading.id);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top < 120) found = heading.id;
        }
      }
      setActiveId(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  if (!toc?.length) return null;

  return (
    <>
      {/* Mobile TOC Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Table of Contents</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <nav className="space-y-2">
              {toc.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => {
                    const el = document.getElementById(heading.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${
                    activeId === heading.id
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-l-4 border-green-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={{ paddingLeft: `${heading.level * 12}px` }}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
      {/* Desktop TOC Sidebar */}
     <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 w-64 max-h-96 overflow-y-auto toc-scrollbar bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xl z-40">

        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
          <FaList className="text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Contents</h3>
        </div>
        <nav className="space-y-1">
          {toc.map((heading) => (
            <button
              key={heading.id}
              onClick={() => {
                const el = document.getElementById(heading.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block w-full text-left py-1.5 px-2 rounded-lg transition-all duration-200 text-sm ${
                activeId === heading.id
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-l-2 border-green-500 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              style={{ paddingLeft: `${(heading.level - 1) * 8 + 8}px` }}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

// --- Reading Progress ---
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercentage = (scrolled / maxHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progressPercentage)));
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-50">
      <div 
        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// --- Share Buttons ---
const ShareButtons = ({ title, excerpt, url }) => {
  const [copied, setCopied] = useState(false);
  const shareData = {
    title,
    text: excerpt,
    url: url || window.location.href
  };
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log('Share failed:', error);
    }
  };
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareData.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
  };
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Share:</span>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all duration-200 text-sm"
      >
        {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
      >
        <FaTwitter />
      </a>
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      >
        <FaLinkedin />
      </a>
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
      >
        <FaFacebook />
      </a>
    </div>
  );
};

// --- Scroll to Top ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  if (!isVisible) return null;
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
    >
      <FaChevronUp />
    </button>
  );
};

// --- Reading Time ---
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const textContent = content?.replace ? content.replace(/<[^>]*>/g, '') : '';
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

// --- Main BlogPostPage ---
export default function BlogPostPage() {
  const { slug } = useParams();
  const [tocOpen, setTocOpen] = useState(false);

  if (!slug) return <div>Loading...</div>;
  const post = posts.find(p => p?.meta?.slug === slug);

  if (!post) return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20 animate-pulse" />
      </div>
      <div className="relative z-10 text-center bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-2xl p-12 shadow-xl">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-red-600 to-orange-600 dark:from-white dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent">
          Post Not Found
        </h1>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The article you're looking for doesn't exist or may have been moved.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Searching for: "{slug}"
        </p>
        <Link 
          to="/blog" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blog
        </Link>
      </div>
    </section>
  );

  // Use reading time from post.content if available, else fallback
  const readingTime = calculateReadingTime(post.content || '');
  const relatedPosts = posts.filter(p => p?.meta?.slug !== slug).slice(0, 3);

  return (
    <main className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <ReadingProgress />
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-green-400/20 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-400/20 blur-2xl opacity-15 animate-pulse delay-1000" />
      </div>
      {/* Hero Image Section */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <img 
          src={post.meta.image} 
          alt={post.meta.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400/10b981/ffffff?text=GreenTracer+Blog';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Navigation Overlay */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white rounded-full font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>
          {/* Mobile TOC Button */}
          <button
            onClick={() => setTocOpen(true)}
            className="lg:hidden inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white rounded-full font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg border border-white/20"
          >
            <FaBars className="mr-2" />
            Contents
          </button>
        </div>
      </div>
      {/* Table of Contents */}
      <TableOfContents 
        toc={post.toc || []}
        isOpen={tocOpen}
        setIsOpen={setTocOpen}
      />
      {/* Content Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 -mt-32 pb-16">
        {/* Article Header Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <FaLeaf className="mr-2" />
              <span className="font-medium">GreenTracer Blog</span>
            </div>
            <div className="w-1 h-1 bg-slate-400 rounded-full hidden sm:block"></div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <FaUser className="mr-2" />
              {post.meta.author}
            </div>
            <div className="w-1 h-1 bg-slate-400 rounded-full hidden sm:block"></div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <FaClock className="mr-2" />
              {new Date(post.meta.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="w-1 h-1 bg-slate-400 rounded-full hidden sm:block"></div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <FaBolt className="mr-2" />
              {readingTime} min read
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
            {post.meta.title}
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
            {post.meta.excerpt}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ShareButtons 
              title={post.meta.title} 
              excerpt={post.meta.excerpt} 
              url={window.location.href} 
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FaEye />
                <span className="text-sm">Est. {Math.floor(readingTime * 200)} words</span>
              </div>
            </div>
          </div>
        </div>
        {/* --- Blog Content --- */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-2xl p-8 lg:p-12 shadow-xl">
          <div 
            className="blog-content prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-green-600 dark:prose-a:text-green-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-headings:scroll-mt-24"
          >
            {React.createElement(post.default)}
          </div>
        </div>
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={index}
                  to={`/blog/${relatedPost.meta.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                >
                  <img 
                    src={relatedPost.meta.image} 
                    alt={relatedPost.meta.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                      {relatedPost.meta.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                      {relatedPost.meta.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-500">
                      <FaClock />
                      {new Date(relatedPost.meta.date).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-8">
          <FaLeaf className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Ready to reduce your website's carbon footprint?
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Use our carbon calculator to analyze your website's environmental impact and get your green badge
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaBolt className="mr-2" />
              Test Your Site
            </Link>
            <Link
              to="/badge"
              className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
            >
              <FaCertificate className="mr-2" />
              Get Your Badge
            </Link>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </main>
  );
}
