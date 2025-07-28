import React from "react";
import { FaLeaf, FaClock, FaUser, FaTag, FaShare, FaExternalLinkAlt } from "react-icons/fa";
import img from "../assets/blog/web-carbon-2025.jpg";

export const meta = {
  title: "Why Your Website's Carbon Footprint Matters in 2025",
  author: "Sol Rudd",
  date: "2025-07-27",
  tags: ["Web Sustainability", "Digital Carbon", "Green Hosting"],
  slug: "why-website-carbon-matters-2025",
  image: img,
  excerpt: "In 2025, a green website is no longer optional. Find out why digital emissions are critical for every business."
};

export default function Post() {
  return (
    <article className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-glow-green blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-blue-400/20 blur-2xl opacity-15 animate-pulse delay-1000" />
      </div>

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <img 
          src={img} 
          alt="Low-carbon web design illustration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Article Header */}
      <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div className="flex items-center text-greenbuzz dark:text-green-400">
            <FaLeaf className="mr-2" />
            <span className="font-medium">GreenTracer Blog</span>
          </div>
          <div className="w-1 h-1 bg-slate-400 rounded-full hidden sm:block"></div>
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <FaUser className="mr-2" />
            {meta.author}
          </div>
          <div className="w-1 h-1 bg-slate-400 rounded-full hidden sm:block"></div>
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <FaClock className="mr-2" />
            {new Date(meta.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
          {meta.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {meta.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <FaTag className="text-slate-500 dark:text-slate-400" />
          {meta.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-greenbuzz/10 text-greenbuzz dark:bg-green-400/10 dark:text-green-400 rounded-full text-sm font-medium border border-greenbuzz/20 dark:border-green-400/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Share Button */}
        <button 
          onClick={() => {
            try {
              if (navigator.share) {
                navigator.share({
                  title: meta.title,
                  text: meta.excerpt,
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
          className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium transition-all duration-300 border border-slate-300 dark:border-slate-600 hover:scale-105"
        >
          <FaShare className="mr-2 text-sm" />
          Share Article
        </button>
      </div>

      {/* Article Content */}
      <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl mb-8">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 first-letter:text-4xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-2">
            As digital services expand, the carbon footprint of our online activity is growing fast. With over 5 billion internet users, every website request, image, and video adds up — globally matching the aviation industry for CO₂ emissions.
          </p>

          {/* Section: The true impact */}
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-greenbuzz to-green-600 rounded-full mr-4"></div>
              The true impact of web emissions
            </h2>
            
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-4"></span>
                  <span>The average website produces <strong className="text-red-600 dark:text-red-400">60kg CO₂ a year</strong> — equal to a car driving 270 miles.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-4"></span>
                  <span>Modern data centres can consume more electricity than small towns.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quote Section */}
          <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border-l-4 border-greenbuzz dark:border-green-400 rounded-r-xl p-6 mb-8 relative">
            <div className="absolute -left-2 top-4 w-4 h-4 bg-greenbuzz dark:bg-green-400 rounded-full"></div>
            <blockquote className="text-lg italic text-slate-800 dark:text-slate-200 mb-3">
              "If the internet was a country, it would be the world's 7th largest polluter."
            </blockquote>
            <cite className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              — <a 
                href="https://www.websitecarbon.com/about/" 
                target="_blank" 
                rel="noopener"
                className="ml-1 text-greenbuzz dark:text-green-400 hover:underline flex items-center"
              >
                Website Carbon <FaExternalLinkAlt className="ml-1 text-xs" />
              </a>
            </cite>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-xl p-6 text-center">
            <FaLeaf className="text-3xl text-greenbuzz dark:text-green-400 mx-auto mb-4" />
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
              Start measuring and reducing your site's emissions today — and show your results with a{" "}
              <a 
                href="/badge" 
                className="text-greenbuzz dark:text-green-400 font-semibold hover:underline"
              >
                GreenTrace badge
              </a>.
            </p>
            <a 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaLeaf className="mr-2" />
              Calculate Your Impact
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}