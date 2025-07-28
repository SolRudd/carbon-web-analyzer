import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaLeaf, FaClock, FaUser, FaShare } from "react-icons/fa";
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/why-website-carbon-matters-2025.jsx";
import * as post3 from "../blog/reduce-website-emissions-tips.jsx";
import * as post4 from "../blog/case-study-greening-website.jsx";
import * as post5 from "../blog/save-energy-in-summer.jsx";
import * as post6 from "../blog/plastic-climate-crisis.jsx";
import * as post7 from "../blog/improve-air-quality.jsx";

const posts = [post1, post2, post3, post4, post5, post6, post7];

export default function BlogPostPage() {
  const { slug } = useParams();
  
  // Add loading check
  if (!slug) {
    return <div>Loading...</div>;
  }
  
  const post = posts.find(p => p?.meta?.slug === slug);

  // Debug info (remove in production)
  console.log("URL slug:", slug);
  console.log("Available posts:", posts.map(p => p?.meta?.slug).filter(Boolean));
  console.log("Found post:", post);

  if (!post) return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20 animate-pulse" />
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
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blog
        </Link>
      </div>
    </section>
  );

  return (
    <main className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-glow-green blur-3xl opacity-20 animate-pulse" />
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
        
        {/* Back Button Overlay */}
        <div className="absolute top-8 left-8">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white rounded-full font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 -mt-32 pb-16">
        {/* Article Header Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div className="flex items-center text-greenbuzz dark:text-green-400">
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
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
            {post.meta.title}
          </h1>

          <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
            {post.meta.excerpt}
          </p>

          <button 
            onClick={() => {
              try {
                if (navigator.share) {
                  navigator.share({
                    title: post.meta.title,
                    text: post.meta.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              } catch (error) {
                console.log('Share failed:', error);
              }
            }}
            className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium transition-all duration-300 border border-slate-300 dark:border-slate-600"
          >
            <FaShare className="mr-2 text-sm" />
            Share Article
          </button>
        </div>

        {/* Article Content */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-2xl p-8 lg:p-12 shadow-xl">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-greenbuzz dark:prose-a:text-green-400 prose-strong:text-slate-900 dark:prose-strong:text-white">
            {React.createElement(post.default)}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 rounded-2xl p-8">
          <FaLeaf className="text-4xl text-greenbuzz dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Ready to reduce your website's carbon footprint?
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Use our carbon calculator to analyze your website's environmental impact
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaLeaf className="mr-2" />
            Calculate Now
          </Link>
        </div>
      </div>
    </main>
  );
}