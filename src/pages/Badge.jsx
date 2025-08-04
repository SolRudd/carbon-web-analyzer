import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async'; // ✅ Import Helmet
import { 
  FaCertificate,
  FaCode, 
  FaRocket, 
  FaCopy, 
  FaCheck, 
  FaEye, 
  FaPalette, 
  FaGlobe, 
  FaShieldAlt, 
  FaLightbulb,
  FaQuestionCircle,
  FaExternalLinkAlt,
  FaDownload,
  FaSync,
  FaCog,
  FaMoon,
  FaSun,
  FaMobile,
  FaDesktop
} from "react-icons/fa";

const badgeTypes = [
  // ... (Your badgeTypes array is perfect, no changes needed)
  {
    id: "auto",
    title: "Auto Badge",
    subtitle: "Smart & Responsive",
    icon: <FaRocket className="text-2xl" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
    recommended: true,
    features: ["Auto light/dark detection", "Responsive design", "Auto-updates", "Fast loading"]
  },
  {
    id: "svg-light",
    title: "SVG Light",
    subtitle: "Static Light Mode",
    icon: <FaSun className="text-2xl" />,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    features: ["Light backgrounds", "No JavaScript", "Fast loading", "SEO friendly"]
  },
  {
    id: "svg-dark",
    title: "SVG Dark",
    subtitle: "Static Dark Mode",
    icon: <FaMoon className="text-2xl" />,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    features: ["Dark backgrounds", "No JavaScript", "Fast loading", "SEO friendly"]
  }
];

// ✅ Use your production origin + the new badge script we built
const codeSnippets = {
  auto: `<div class="greentrace-badge" data-url="https://YOURDOMAIN.com" data-theme="auto"></div>
<script src="https://www.greentracer.org/greentrace-badge.min.js" defer></script>`,

  "svg-light": `<a href="https://www.greentracer.org?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://www.greentracer.org/api/badge.svg?theme=light&url=https://YOURDOMAIN.com"
       alt="GreenTracer Badge (Light)" width="160" />
</a>`,

  "svg-dark": `<a href="https://www.greentracer.org?ref=badge" target="_blank" rel="noopener noreferrer">
  <img src="https://www.greentracer.org/api/badge.svg?theme=dark&url=https://YOURDOMAIN.com"
       alt="GreenTracer Badge (Dark)" width="160" />
</a>`
};

export default function Badge() {
  const [selectedBadge, setSelectedBadge] = useState("auto");
  const [websiteUrl, setWebsiteUrl] = useState("https://yoursite.com");
  const [copiedCode, setCopiedCode] = useState(false);

  // ✅ SEO: Create the HowTo schema for getting the badge
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Add the GreenTracer Carbon Badge to Your Website",
    "description": "Display your website's carbon score with pride by following these three simple steps to add our responsive badge to your site.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Test Your Website",
        "text": "Visit our homepage and test your website's carbon footprint. You must test each page before the badge will display data.",
        "url": "https://www.greentracer.org/#input-form"
      },
      {
        "@type": "HowToStep",
        "name": "Copy the Code",
        "text": "Choose your preferred badge style on this page, enter your URL, and copy the generated code snippet."
      },
      {
        "@type": "HowToStep",
        "name": "Add to Your Site",
        "text": "Paste the code into your HTML, typically in the footer or sidebar. The badge will automatically display your carbon score."
      }
    ]
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getCurrentCode = () => {
    // Keep your replacement logic as-is so users can paste any URL
    return codeSnippets[selectedBadge].replace(/YOURDOMAIN\.com/g, websiteUrl.replace(/^https?:\/\//, ''));
  };

  const selectedBadgeInfo = badgeTypes.find(badge => badge.id === selectedBadge);

  return (
    <>
      {/* ✅ SEO: Full advanced Helmet setup for the Badge page */}
      <Helmet>
        {/* -- Primary Meta Tags -- */}
        <title>Get Your Website Carbon Badge | GreenTracer</title>
        <meta name="description" content="Display your website's carbon score with pride! Get the code for our responsive, auto-updating sustainability badge and show your environmental commitment." />
        <link rel="canonical" href="https://www.greentracer.org/badge" />

        {/* -- Open Graph / Facebook -- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/badge" />
        <meta property="og:title" content="Get Your Website Carbon Badge | GreenTracer" />
        <meta property="og:description" content="Display your website's carbon score with pride! Get the code for our responsive, auto-updating sustainability badge." />
        <meta property="og:image" content="https://www.greentracer.org/your-social-share-image-for-badge.jpg" />

        {/* -- Twitter -- */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/badge" />
        <meta property="twitter:title" content="Get Your Website Carbon Badge | GreenTracer" />
        <meta property="twitter:description" content="Display your website's carbon score with pride! Get the code for our responsive, auto-updating sustainability badge." />
        <meta property="twitter:image" content="https://www.greentracer.org/your-social-share-image-for-badge.jpg" />

        {/* -- Schema.org Markup -- */}
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>

      <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 pointer-events-none">
            {/* ✅ Performance: Added 'motion-safe' to respect user settings */}
            <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 motion-safe:animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 motion-safe:animate-pulse motion-safe:delay-1000" />
            <div className="absolute bottom-1/4 left-3/4 w-[400px] h-[400px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 motion-safe:animate-pulse motion-safe:delay-2000" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20">
              <FaCertificate className="text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Carbon Badge</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-green-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Show Your Green Credentials
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Display your website's carbon score with pride! Add our beautiful, responsive badge to showcase your environmental commitment to visitors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaRocket className="mr-2" />
                Test Your Site First
              </Link>
              <a
                href="#badge-generator"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
              >
                <FaCode className="mr-2" />
                Get Badge Code
              </a>
            </div>
          </div>
        </section>

        {/* ... The rest of your JSX component is perfect, no other changes needed ... */}
        <section id="badge-generator" className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your Badge Style
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Select the perfect badge for your website and customize it to match your design
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Your Website URL
              </label>
              <div className="relative">
                <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {badgeTypes.map(badge => (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id)}
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedBadge === badge.id ? 'scale-105' : ''
                  }`}
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${
                    selectedBadge === badge.id ? badge.borderColor : 'border-slate-200 dark:border-slate-700'
                  } shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                    
                    {badge.recommended && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                        Recommended
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {badge.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {badge.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {badge.features.map(feature => (
                          <div key={feature} className="flex items-center gap-2">
                            <FaCheck className="text-green-600 dark:text-green-400 text-sm" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedBadge === badge.id && (
                      <div className={`absolute inset-0 border-4 ${badge.borderColor} rounded-2xl pointer-events-none`}>
                        <div className="absolute top-2 left-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className={`p-6 bg-gradient-to-r ${selectedBadgeInfo.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedBadgeInfo.icon}
                      <div>
                        <h3 className="text-xl font-bold">{selectedBadgeInfo.title} Code</h3>
                        <p className="opacity-90">Copy and paste into your HTML</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getCurrentCode())}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                    >
                      {copiedCode ? <FaCheck /> : <FaCopy />}
                      {copiedCode ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 rounded-lg overflow-x-auto">
                    {getCurrentCode()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Get your badge working in just 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Test Your Website</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Visit our homepage and test your website's carbon footprint. You must test each page before the badge will display data.
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold"
                >
                  <FaRocket />
                  Test Now
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Copy the Code</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Choose your preferred badge style above, enter your URL, and copy the generated code snippet.
                </p>
                <a 
                  href="#badge-generator" 
                  className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold"
                >
                  <FaCode />
                  Get Code
                </a>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Add to Your Site</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Paste the code into your HTML (typically in the footer). The badge will automatically display your carbon score.
                </p>
                <div className="inline-flex items-center gap-2 mt-4 text-green-600 dark:text-green-400 font-semibold">
                  <FaCertificate />
                  Done!
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Use Our Badge?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Show your environmental commitment with a professional, trust-building badge
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <FaShieldAlt className="text-2xl" />,
                  title: "Build Trust",
                  description: "Show visitors you care about the environment and sustainability",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: <FaSync className="text-2xl" />,
                  title: "Auto Updates",
                  description: "Badge automatically refreshes with your latest carbon score every 7 days",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <FaMobile className="text-2xl" />,
                  title: "Responsive",
                  description: "Looks perfect on desktop, tablet, and mobile devices",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: <FaLightbulb className="text-2xl" />,
                  title: "Smart Design",
                  description: "Automatically adapts to light and dark themes on your website",
                  color: "from-orange-500 to-red-500"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 dark:border-green-400/20 rounded-2xl p-8">
              <FaQuestionCircle className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Need Help?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Check our FAQ for common questions about badges, or contact our support team for personalized help.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaQuestionCircle className="mr-2" />
                  View FAQ
                </Link>
                
                <a
                  href="mailto:support@greentracer.org"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
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
