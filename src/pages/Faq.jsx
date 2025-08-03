import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async'; // ✅ Import Helmet
import { 
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaLightbulb,
  FaServer,
  FaCertificate,
  FaChartLine,
  FaCog,
  FaExternalLinkAlt,
  FaRocket,
  FaShieldAlt,
  FaGlobe
} from "react-icons/fa";

const faqCategories = [
  // ... (Your categories are perfect, no changes needed)
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <FaRocket className="text-xl" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700"
  },
  {
    id: "how-it-works",
    title: "How It Works",
    icon: <FaCog className="text-xl" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700"
  },
  {
    id: "badge-api",
    title: "Badge & API",
    icon: <FaCertificate className="text-xl" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700"
  },
  {
    id: "technical",
    title: "Technical Details",
    icon: <FaServer className="text-xl" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700"
  }
];

const faqs = [
  // ... (Your FAQs are perfect, no changes needed)
  // Getting Started
  {
    category: "getting-started",
    question: "How do I check my website's carbon footprint?",
    answer: "Simply enter your website URL in our calculator on the homepage. Our system will analyze your site using Google PageSpeed Insights API, check for green hosting via the Green Web Foundation, and calculate your CO₂ emissions per page view. Results are ready in about 15-30 seconds.",
    emoji: "🚀",
    tags: ["calculator", "getting started", "analysis"]
  },
  {
    category: "getting-started",
    question: "Why should I care about my website's carbon footprint?",
    answer: "Digital emissions now account for 4% of global greenhouse gases—equivalent to the aviation industry. A typical website produces 60kg CO₂ annually. Beyond environmental responsibility, green websites are faster, cheaper to host, and rank better in search engines. Many countries are implementing digital carbon reporting requirements.",
    emoji: "🌱",
    tags: ["environment", "benefits", "performance"]
  },
  {
    category: "getting-started",
    question: "Is the carbon calculator free to use?",
    answer: "Yes! Our basic carbon calculator is completely free with no limits. You can test any website and get detailed results including CO₂ per page view, grade (A+ to F), and percentile ranking. Premium features like historical tracking and advanced reports will be available soon.",
    emoji: "💰",
    tags: ["pricing", "free", "limits"]
  },

  // How It Works
  {
    category: "how-it-works",
    question: "How accurate are your carbon calculations?",
    answer: "We use industry-standard methodologies: Google PageSpeed Insights for page weight, 0.81 kWh/GB energy intensity (covering data centers + networks), and 442g CO₂/kWh global electricity carbon intensity. Green hosting gets a 9% discount. Our calculations match methods used by Website Carbon Calculator and other recognized tools.",
    emoji: "🎯",
    tags: ["accuracy", "methodology", "standards"]
  },
  {
    category: "how-it-works",
    question: "What data sources do you use?",
    answer: "We integrate with Google PageSpeed Insights API for real page weight measurement and the Green Web Foundation database for renewable energy verification. All calculations use peer-reviewed energy intensity factors and global electricity carbon averages from the International Energy Agency.",
    emoji: "📊",
    tags: ["data sources", "apis", "methodology"]
  },
  {
    category: "how-it-works",
    question: "Why don't results update immediately after I make changes?",
    answer: "Results are cached for 24 hours to prevent unnecessary API calls and ensure consistent measurements. This also reflects real-world CDN behavior. If you need fresh data sooner, contact us about priority re-testing options coming soon.",
    emoji: "🔄",
    tags: ["caching", "updates", "timing"]
  },
  {
    category: "how-it-works",
    question: "My green host isn't showing as green, why?",
    answer: "We rely on the Green Web Foundation's verified database of renewable energy providers. If your host isn't listed, is behind a CDN like Cloudflare, or uses third-party services, the green status may not appear. You can submit your host to Green Web Foundation for verification.",
    emoji: "🌿",
    tags: ["green hosting", "verification", "issues"]
  },

  // Badge & API
  {
    category: "badge-api",
    question: "How do I add the carbon badge to my website?",
    answer: (
      <>
        Add this code where you want the badge: <br />
        <code className="break-all block bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs mt-2 mb-2">
          {`<div class="greentrace-badge" data-url="your-site.com"></div>
<script src="https://api.greentracer.org/greentrace-badge.js"></script>`}
        </code>
        The badge will automatically display your latest carbon score and update when visitors load your page.
      </>
    ),
    emoji: "🏷️",
    tags: ["badge", "embed", "installation"]
  },
  {
    category: "badge-api",
    question: "Can I customize the badge appearance?",
    answer: "Currently, our badge uses a standard design optimized for readability and trust. Custom styling options including colors, sizes, and themes are planned for our premium tier. The badge automatically adapts to light/dark themes and is fully responsive.",
    emoji: "🎨",
    tags: ["badge", "customization", "styling"]
  },
  {
    category: "badge-api",
    question: "Is there an API I can use programmatically?",
    answer: "Yes! Use GET /api/trace?site=yoursite.com to fetch carbon data for any tested website. Results include CO₂ per view, grade, percentile, and green hosting status. Full API documentation with rate limits and authentication coming soon.",
    emoji: "⚡",
    tags: ["api", "integration", "development"]
  },
  {
    category: "badge-api",
    question: "Can I use the badge on multiple websites?",
    answer: "Absolutely! Our badge script works on any website and automatically detects the domain. You can embed badges for different sites by setting the data-url attribute. Each badge independently fetches and displays the correct carbon score.",
    emoji: "🌐",
    tags: ["badge", "multiple sites", "domains"]
  },

  // Technical Details
  {
    category: "technical",
    question: "What technologies power GreenTrace?",
    answer: "Frontend: React with Tailwind CSS hosted on Vercel. Backend: Node.js with Express, PostgreSQL database for permanent storage, and integrations with Google PageSpeed Insights and Green Web Foundation APIs. All infrastructure runs on renewable energy where possible.",
    emoji: "⚙️",
    tags: ["technology", "stack", "infrastructure"]
  },
  {
    category: "technical",
    question: "How do you handle data privacy and storage?",
    answer: "We store only publicly accessible data: URL, page size, hosting provider, and calculated carbon metrics. No personal information, analytics, or tracking data is collected. All data is stored securely in PostgreSQL with 24-hour caching for performance.",
    emoji: "🔒",
    tags: ["privacy", "data storage", "security"]
  },
  {
    category: "technical",
    question: "What are your rate limits and fair use policy?",
    answer: "Free tier: 20 carbon checks per day, 60 badge loads per minute. We use rate limiting to ensure service availability for all users. Higher limits and priority processing available in our upcoming premium plans. Enterprise options for high-volume usage available on request.",
    emoji: "⏱️",
    tags: ["rate limits", "fair use", "limits"]
  },
  {
    category: "technical",
    question: "Do you offer historical tracking and trends?",
    answer: "Yes! All carbon checks are permanently stored, enabling historical tracking and trend analysis. You can see how your site's carbon footprint changes over time as you implement optimizations. Detailed trend reports and alerts coming in our premium tier.",
    emoji: "📈",
    tags: ["history", "tracking", "trends"]
  }
];


export default function Faq() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  // ✅ SEO: Create the FAQ schema from your 'faqs' data array.
  // This filters out any answers that are not simple strings for schema compatibility.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
      .filter(faq => typeof faq.answer === 'string') // Important: Schema requires a string answer.
      .map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchTerm === "" || 
        (typeof faq.question === "string" && faq.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof faq.answer === "string" && faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(faq.tags) && faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFaq = (index) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFaqs(newExpanded);
  };

  const getCategoryInfo = (categoryId) => {
    return faqCategories.find(cat => cat.id === categoryId) || {};
  };

  return (
    <>
      {/* ✅ SEO: Full advanced Helmet setup for the FAQ page */}
      <Helmet>
        {/* -- Primary Meta Tags -- */}
        <title>FAQ | GreenTracer Support Center</title>
        <meta name="description" content="Find answers to frequently asked questions about our website carbon calculator, green hosting verification, API, and the GreenTracer badge." />
        <link rel="canonical" href="https://www.greentracer.org/faq" />

        {/* -- Open Graph / Facebook -- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/faq" />
        <meta property="og:title" content="FAQ | GreenTracer Support Center" />
        <meta property="og:description" content="Find answers to frequently asked questions about our website carbon calculator, green hosting verification, API, and the GreenTracer badge." />
        <meta property="og:image" content="https://www.greentracer.org/your-social-share-image.jpg" />

        {/* -- Twitter -- */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/faq" />
        <meta property="twitter:title" content="FAQ | GreenTracer Support Center" />
        <meta property="twitter:description" content="Find answers to frequently asked questions about our website carbon calculator, green hosting verification, API, and the GreenTracer badge." />
        <meta property="twitter:image" content="https://www.greentracer.org/your-social-share-image.jpg" />

        {/* -- Schema.org Markup -- */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 pointer-events-none">
            {/* ✅ Performance: Added 'motion-safe' to respect user settings */}
            <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 motion-safe:animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 motion-safe:animate-pulse" />
            <div className="absolute bottom-1/4 left-3/4 w-[400px] h-[400px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 motion-safe:animate-pulse" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20">
              <FaQuestionCircle className="text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Support Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-green-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Everything you need to know about measuring, reducing, and tracking your website's carbon footprint. 
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{faqs.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{faqCategories.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">24/7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* ... The rest of your JSX component is perfect, no changes needed ... */}
        <section className="py-8 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-lg"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-400 hover:scale-105"
                }`}
              >
                <FaGlobe />
                All Categories
              </button>
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white shadow-lg scale-105"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-400 hover:scale-105"
                  }`}
                >
                  {category.icon}
                  {category.title}
                </button>
              ))}
            </div>
            <div className="text-center text-slate-600 dark:text-slate-400">
              {filteredFaqs.length === faqs.length ? (
                `Showing all ${faqs.length} questions`
              ) : (
                `Found ${filteredFaqs.length} question${filteredFaqs.length !== 1 ? 's' : ''} ${searchTerm ? `for "${searchTerm}"` : `in "${faqCategories.find(c => c.id === selectedCategory)?.title}"`}`
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <FaQuestionCircle className="text-6xl text-slate-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No questions found
                </h3>
                <p className="text-slate-500 dark:text-slate-500 mb-6">
                  Try adjusting your search terms or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300"
                >
                  Show All Questions
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFaqs.map((faq, index) => {
                  const categoryInfo = getCategoryInfo(faq.category);
                  const isExpanded = expandedFaqs.has(index);
                  
                  return (
                    <div
                      key={index}
                      className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${categoryInfo.borderColor || 'border-slate-200 dark:border-slate-700'} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full p-6 md:p-8 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${categoryInfo.color || 'from-slate-500 to-slate-600'} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                              <span className="text-2xl">{faq.emoji}</span>
                            </div>
                            <div className={`hidden sm:flex w-8 h-8 ${categoryInfo.bgColor || 'bg-slate-100 dark:bg-slate-700'} rounded-lg items-center justify-center ${categoryInfo.borderColor || 'border border-slate-200 dark:border-slate-600'}`}>
                              {categoryInfo.icon}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                              {faq.question}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {faq.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          <FaChevronDown className="text-slate-400 text-xl" />
                        </div>
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className={`p-6 md:p-8 pt-0 ${categoryInfo.bgColor || 'bg-slate-50 dark:bg-slate-700/30'} border-t ${categoryInfo.borderColor || 'border-slate-200 dark:border-slate-600'}`}>
                          <div className="flex items-start gap-4">
                            <FaLightbulb className="text-2xl mt-1 text-yellow-500" />
                            <div className="flex-1">
                              <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed space-y-4">
                                {faq.answer}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-4">
                                {faq.tags.map(tag => (
                                  <button
                                    key={tag}
                                    onClick={() => setSearchTerm(tag)}
                                    className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 rounded-full text-sm font-medium hover:border-green-500 hover:text-green-600 transition-colors duration-200"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 dark:border-green-400/20 rounded-2xl p-8">
              <FaShieldAlt className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Still Need Help?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Can't find the answer you're looking for? Our team is here to help you optimize 
                your website's carbon footprint and implement sustainable practices.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/badge"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaCertificate className="mr-2" />
                  Get Your Badge
                </Link>
                <a
                  href="mailto:support@greentracer.org"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaQuestionCircle className="mr-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="text-center py-8">
          <Link
            to="/"
            className="inline-block text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}