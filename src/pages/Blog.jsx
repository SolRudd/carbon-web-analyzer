// src/pages/Blog.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/why-website-carbon-matters-2025.jsx";
import * as post3 from "../blog/reduce-website-emissions-tips.jsx";
import * as post4 from "../blog/case-study-greening-website.jsx";
import * as post5 from "../blog/save-energy-in-summer.jsx";
import * as post6 from "../blog/plastic-climate-crisis.jsx";
import * as post7 from "../blog/improve-air-quality.jsx";
import { 
  FaLeaf, 
  FaClock, 
  FaUser, 
  FaArrowRight, 
  FaSearch,
  FaTag,
  FaFire,
  FaNewspaper,
  FaChartLine,
  FaStar,
  FaBookmark
} from "react-icons/fa";

const posts = [post1, post2, post3, post4, post5, post6, post7].filter(Boolean);

// Get all unique tags
const allTags = [...new Set(posts.flatMap(p => p.meta.tags || []))];

// Reading time estimation
const getReadingTime = (content) => {
  const words = content.toString().split(' ').length;
  return Math.ceil(words / 200); // Average reading speed
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Sort posts by date (newest first)
  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
  }, []);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return sortedPosts.filter(post => {
      const matchesSearch = searchTerm === "" || 
        post.meta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.meta.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.meta.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = selectedTag === "All" || 
        (post.meta.tags || []).includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [sortedPosts, searchTerm, selectedTag]);

  const featuredPost = sortedPosts[0]; // Most recent as featured
  const regularPosts = sortedPosts.slice(1);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-glow-green transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-3/4 w-[400px] h-[400px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-3 bg-greenbuzz/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-greenbuzz/20 dark:border-green-400/20">
            <FaNewspaper className="text-greenbuzz dark:text-green-400" />
            <span className="text-greenbuzz dark:text-green-400 font-semibold">Knowledge Hub</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-greenbuzz to-green-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
            GreenTracer Blog
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Expert insights on web sustainability, carbon reduction strategies, and environmental technology. 
            Learn how to build a greener digital future.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-greenbuzz dark:text-green-400">{posts.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-greenbuzz dark:text-green-400">{allTags.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-greenbuzz dark:text-green-400">2025</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Latest Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-greenbuzz focus:border-greenbuzz transition-all duration-300 text-lg"
            />
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedTag("All")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedTag === "All"
                  ? "bg-greenbuzz text-white shadow-lg scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-greenbuzz dark:hover:border-green-400"
              }`}
            >
              <FaTag className="inline mr-2" />
              All Posts
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? "bg-greenbuzz text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-greenbuzz dark:hover:border-green-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center text-slate-600 dark:text-slate-400">
            {filteredPosts.length === posts.length ? (
              `Showing all ${posts.length} articles`
            ) : (
              `Found ${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} ${searchTerm ? `for "${searchTerm}"` : `in "${selectedTag}"`}`
            )}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {searchTerm === "" && selectedTag === "All" && featuredPost && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <FaFire className="text-orange-500 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Article</h2>
            </div>
            
            <article className="group bg-gradient-to-r from-greenbuzz/5 to-green-600/5 border-2 border-greenbuzz/20 dark:border-green-400/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex flex-col lg:flex-row">
                {/* Featured Image */}
                <div className="lg:w-1/2 relative overflow-hidden">
                  <img 
                    src={featuredPost.meta.image} 
                    alt={featuredPost.meta.title} 
                    className="w-full h-80 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-greenbuzz text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <FaStar className="mr-1" />
                    Featured
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Featured Content */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-6 text-sm">
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <FaUser className="mr-2" />
                        {featuredPost.meta.author}
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <FaClock className="mr-2" />
                        {new Date(featuredPost.meta.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <FaBookmark className="mr-2" />
                        {getReadingTime(featuredPost.default)} min read
                      </div>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 dark:text-white group-hover:text-greenbuzz dark:group-hover:text-green-400 transition-colors duration-300 leading-tight">
                      {featuredPost.meta.title}
                    </h2>

                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
                      {featuredPost.meta.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {featuredPost.meta.tags?.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-greenbuzz/10 dark:bg-green-400/10 text-greenbuzz dark:text-green-400 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    to={`/blog/${featuredPost.meta.slug}`}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group-hover:shadow-greenbuzz/25 w-fit"
                  >
                    <span>Read Full Article</span>
                    <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {(searchTerm !== "" || selectedTag !== "All") && (
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              {searchTerm ? `Search Results` : `${selectedTag} Articles`}
            </h2>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <FaSearch className="text-6xl text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No articles found
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-10">
              {(searchTerm === "" && selectedTag === "All" ? regularPosts : filteredPosts).map((post, index) => (
                <article 
                  key={post.meta.slug} 
                  className="group bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.01] hover:bg-white/80 dark:hover:bg-white/15"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="lg:w-2/5 relative overflow-hidden">
                      <img 
                        src={post.meta.image} 
                        alt={post.meta.title} 
                        className="w-full h-64 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300">
                        {getReadingTime(post.default)} min read
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 mb-4 text-sm">
                          <div className="flex items-center text-slate-600 dark:text-slate-400">
                            <FaUser className="mr-2" />
                            {post.meta.author}
                          </div>
                          <div className="flex items-center text-slate-600 dark:text-slate-400">
                            <FaClock className="mr-2" />
                            {new Date(post.meta.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-greenbuzz dark:group-hover:text-green-400 transition-colors duration-300 leading-tight">
                          {post.meta.title}
                        </h2>

                        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
                          {post.meta.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.meta.tags?.slice(0, 3).map(tag => (
                            <span 
                              key={tag}
                              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-greenbuzz/10 hover:text-greenbuzz transition-colors duration-200 cursor-pointer"
                              onClick={() => setSelectedTag(tag)}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link 
                        to={`/blog/${post.meta.slug}`}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group-hover:shadow-greenbuzz/25 w-fit"
                      >
                        <span>Read Article</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-2xl p-8">
            <FaChartLine className="text-4xl text-greenbuzz dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Stay Updated on Web Sustainability
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Get the latest insights on reducing your website's carbon footprint, 
              new tools, and industry best practices delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-greenbuzz focus:border-greenbuzz transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-greenbuzz to-green-600 hover:from-greenbuzz-light hover:to-green-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <div className="text-center py-8">
        <Link
          to="/"
          className="inline-block text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}