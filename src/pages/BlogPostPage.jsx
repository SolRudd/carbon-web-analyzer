import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  FaArrowLeft, FaLeaf, FaClock, FaUser, FaList, FaBolt, FaEye, FaChevronUp,
  FaTwitter, FaLinkedin, FaFacebook, FaCopy, FaCheck, FaBars, FaTimes, FaCertificate
} from "react-icons/fa";
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/why-website-carbon-matters-2025.jsx";
import * as post3 from "../blog/reduce-website-emissions-tips.jsx";
import * as post4 from "../blog/case-study-greening-website.jsx";
import * as post5 from "../blog/save-energy-in-summer.jsx";
import * as post6 from "../blog/plastic-climate-crisis.jsx";
import * as post7 from "../blog/improve-air-quality.jsx";

const posts = [post1, post2, post3, post4, post5, post6, post7];

// ✅ FIX: More reliable Table of Contents using IntersectionObserver
const TableOfContents = ({ toc = [], isOpen, setIsOpen }) => {
  const [activeId, setActiveId] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      const visibleEntries = entries.filter(e => e.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    }, { rootMargin: `0% 0% -85% 0%` }); // Highlights when a heading is near the top of the viewport

    const elements = toc.map(heading => document.getElementById(heading.id)).filter(Boolean);
    elements.forEach(el => observer.current.observe(el));
    
    return () => observer.current.disconnect();
  }, [toc]);

  if (!toc?.length) return null;
  
  const tocNav = (
    <nav className="space-y-2">
      {toc.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (isOpen) setIsOpen(false);
          }}
          className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${
            activeId === heading.id
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-l-4 border-green-500 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Table of Contents</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg"><FaTimes /></button>
            </div>
            {tocNav}
          </div>
        </div>
      )}
      <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 w-64 max-h-[70vh] overflow-y-auto toc-scrollbar bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xl z-40">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
          <FaList className="text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-sm">Contents</h3>
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
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-50">
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
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Share:</span>
      <button onClick={copyLink} className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm">
        {copied ? <FaCheck className="text-green-500" /> : <FaCopy />} {copied ? 'Copied!' : 'Copy Link'}
      </button>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1DA1F2] hover:bg-[#0c85d0] text-white rounded-lg"><FaTwitter /></a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0077B5] hover:bg-[#005582] text-white rounded-lg"><FaLinkedin /></a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1877F2] hover:bg-[#0b5cce] text-white rounded-lg"><FaFacebook /></a>
    </div>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  if (!isVisible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 p-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg z-40"><FaChevronUp /></button>
  );
};

const calculateReadingTime = (PostContentComponent) => {
    if (!PostContentComponent) return 0;
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<PostContentComponent />);
    const wordCount = div.innerText.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [tocOpen, setTocOpen] = useState(false);

  // ✅ FIX: Scroll to top when the page (or slug) changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const post = posts.find(p => p?.meta?.slug === slug);

  if (!post) {
    return (
      <>
        <Helmet><title>Post Not Found</title><meta name="robots" content="noindex" /></Helmet>
        <section className="bg-white dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Post Not Found</h1>
            <p className="mb-8">The article "{slug}" doesn't exist.</p>
            <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full"><FaArrowLeft className="mr-2" /> Back to Blog</Link>
          </div>
        </section>
      </>
    );
  }

  const { meta, toc, default: PostContent } = post;
  const readingTime = meta.readingTime || 5; // Fallback reading time
  const relatedPosts = posts.filter(p => p?.meta?.slug !== slug && p.meta.tags.some(tag => meta.tags.includes(tag))).slice(0, 3);
  
  // ✅ SEO: Dynamically generate Article schema for the current post
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta.title,
    "description": meta.excerpt,
    "image": `https://www.greentracer.org${meta.image}`,
    "author": { "@type": "Person", "name": meta.author },
    "publisher": { "@type": "Organization", "name": "GreenTracer", "logo": { "@type": "ImageObject", "url": "https://www.greentracer.org/logo.png" } },
    "datePublished": meta.date,
    "dateModified": meta.date
  };

  return (
    <>
      {/* ✅ SEO: Full advanced Helmet setup for this specific blog post */}
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

      <main className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen">
        <ReadingProgress />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-green-400/20 blur-3xl opacity-20 motion-safe:animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-400/20 blur-2xl opacity-15 motion-safe:animate-pulse motion-safe:delay-1000" />
        </div>
        <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <img src={meta.image} alt={meta.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
            <Link to="/blog" className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full font-semibold shadow-lg"> <FaArrowLeft className="mr-2" /> Back to Blog </Link>
            <button onClick={() => setTocOpen(true)} className="lg:hidden inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full font-semibold shadow-lg"> <FaBars className="mr-2" /> Contents </button>
          </div>
        </div>
        <TableOfContents toc={toc || []} isOpen={tocOpen} setIsOpen={setTocOpen} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 -mt-32 pb-16">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400 font-medium"> <FaLeaf className="mr-2" /> GreenTracer Blog </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400"> <FaUser className="mr-2" /> {meta.author} </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400"> <FaClock className="mr-2" /> {new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400"> <FaBolt className="mr-2" /> {readingTime} min read </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">{meta.title}</h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8">{meta.excerpt}</p>
            <ShareButtons title={meta.title} url={`/blog/${slug}`} />
          </div>
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-2xl p-8 lg:p-12 shadow-xl">
            <div className="blog-content prose prose-lg prose-slate dark:prose-invert max-w-none">
              <PostContent />
            </div>
          </div>
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.meta.slug} to={`/blog/${relatedPost.meta.slug}`} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all overflow-hidden transform hover:scale-105">
                    <img src={relatedPost.meta.image} alt={relatedPost.meta.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform" />
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400">{relatedPost.meta.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">{relatedPost.meta.excerpt}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-slate-500"><FaClock /> {new Date(relatedPost.meta.date).toLocaleDateString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-16 text-center bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-8">
            <FaLeaf className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to reduce your website's carbon footprint?</h3>
            <p className="mb-6">Use our carbon calculator to analyze your website's environmental impact and get your green badge</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white rounded-full font-semibold"><FaBolt className="mr-2" /> Test Your Site</Link>
              <Link to="/badge" className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold"><FaCertificate className="mr-2" /> Get Your Badge</Link>
            </div>
          </div>
        </div>
        <ScrollToTop />
      </main>
    </>
  );
}