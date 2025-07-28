import React from "react";
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/why-website-carbon-matters-2025.jsx";
import * as post3 from "../blog/reduce-website-emissions-tips.jsx";
import * as post4 from "../blog/case-study-greening-website.jsx";
import * as post5 from "../blog/save-energy-in-summer.jsx";
import * as post6 from "../blog/plastic-climate-crisis.jsx";
import * as post7 from "../blog/improve-air-quality.jsx";
import { FaLeaf, FaClock, FaUser, FaArrowRight } from "react-icons/fa";

const posts = [post1, post2, post3, post4, post5, post6, post7];

export default function Blog() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-screen py-20 px-4 transition-colors duration-300">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-3/4 w-[300px] h-[300px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <FaLeaf className="text-4xl text-greenbuzz mr-4 animate-pulse" />
            <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              GreenTracer Blog
            </h1>
          </div>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Insights, tips, and stories about sustainable web development and environmental technology
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:gap-12">
          {posts
            .filter(Boolean)
            .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
            .map((p, index) => (
              <article 
                key={p.meta.slug} 
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-white/15"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-2/5 relative overflow-hidden">
                    <img 
                      src={p.meta.image} 
                      alt={p.meta.title} 
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <FaUser className="mr-2" />
                          {p.meta.author}
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <FaClock className="mr-2" />
                          {new Date(p.meta.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-greenbuzz dark:group-hover:text-green-400 transition-colors duration-300">
                        <a href={`/blog/${p.meta.slug}`}>
                          {p.meta.title}
                        </a>
                      </h2>

                      <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
                        {p.meta.excerpt}
                      </p>
                    </div>

                    <a 
                      href={`/blog/${p.meta.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group-hover:shadow-greenbuzz/25 w-fit"
                    >
                      <span>Read Article</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}