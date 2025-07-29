import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaCode, 
  FaRocket, 
  FaShieldAlt, 
  FaChartLine, 
  FaGlobe, 
  FaBolt, 
  FaCheck, 
  FaStar,
  FaUniversity,
  FaBuilding,
  FaCopy,
  FaPlay,
  FaBook,
  FaUsers,
  FaHeart,
  FaLightbulb,
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaExternalLinkAlt,
  FaArrowRight,
  FaCog,
  FaDatabase,
  FaCloud
} from "react-icons/fa";

const apiFeatures = [
  {
    icon: <FaBolt className="text-2xl" />,
    title: "Lightning Fast",
    description: "Get carbon footprint results in under 15 seconds with our optimized API",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <FaShieldAlt className="text-2xl" />,
    title: "Enterprise Security",
    description: "Rate limiting, API keys, and secure endpoints for production use",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <FaChartLine className="text-2xl" />,
    title: "Real-time Analytics",
    description: "Track API usage, performance metrics, and carbon impact over time",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <FaGlobe className="text-2xl" />,
    title: "Global Coverage",
    description: "Test any website worldwide with our distributed infrastructure",
    color: "from-purple-500 to-pink-500"
  }
];

const useCases = [
  {
    icon: <FaUniversity className="text-xl" />,
    title: "Academic Research",
    description: "Study digital sustainability trends and environmental impact",
    type: "Non-Commercial",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700"
  },
  {
    icon: <FaHeart className="text-xl" />,
    title: "Non-Profits",
    description: "Track and improve your organization's digital carbon footprint",
    type: "Non-Commercial",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700"
  },
  {
    icon: <FaBuilding className="text-xl" />,
    title: "Enterprise Monitoring",
    description: "Integrate carbon tracking into your business operations",
    type: "Commercial",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700"
  },
  {
    icon: <FaCog className="text-xl" />,
    title: "SaaS Integration",
    description: "Add sustainability features to your web applications",
    type: "Commercial",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700"
  }
];

const codeExample = `// Example API Call
const response = await fetch('https://api.greentracer.org/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://yoursite.com',
    options: {
      mobile: false,
      cache: true
    }
  })
});

const data = await response.json();
console.log(data);

// Response
{
  "url": "https://yoursite.com",
  "carbon": {
    "grams_per_view": 0.45,
    "grade": "A+",
    "percentile": 85
  },
  "performance": {
    "size_kb": 1240,
    "requests": 15,
    "load_time": 1.2
  },
  "green_hosting": true,
  "timestamp": "2025-01-29T00:06:25.000Z"
}`;

export default function ApiAccess() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    testsPerMonth: '',
    accessType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Request submitted successfully! We\'ll get back to you within 24 hours.');
    }, 2000);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeExample);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-3/4 w-[400px] h-[400px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20">
            <FaCode className="text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold">Developer API</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
            GreenTrace Carbon API
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Integrate powerful carbon footprint analysis into your applications. 
            Measure, track, and optimize digital sustainability at scale.
          </p>

          {/* API Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">15s</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">99.9%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">RESTful</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">JSON API</div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a
              href="#request-form"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaRocket className="mr-2" />
              Request Access
            </a>
            <a
              href="#documentation"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
            >
              <FaBook className="mr-2" />
              View Docs
            </a>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful API Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Built for developers, designed for scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:scale-105">
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

      {/* Code Example */}
      <section id="documentation" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Integration
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Get started with just a few lines of code
            </p>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-slate-400 text-sm font-mono">api-example.js</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition-colors duration-200"
              >
                {copySuccess ? <FaCheck className="text-green-400" /> : <FaCopy />}
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-slate-100 text-sm overflow-x-auto">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect for Every Use Case
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From research to enterprise - we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${useCase.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                <div className={`p-6 ${useCase.bgColor}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {useCase.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        useCase.type === 'Non-Commercial' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {useCase.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Access Level
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Flexible options for every project size and budget
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Non-Commercial */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                  <FaUniversity />
                </div>
                <h3 className="text-2xl font-bold mb-2">Non-Commercial</h3>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">FREE</div>
                <p className="text-slate-600 dark:text-slate-400">Perfect for research and non-profits</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Up to 1,000 requests/month',
                  'Full API access',
                  'Email support',
                  'Academic research friendly',
                  'Non-profit organizations',
                  'Open source projects'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FaCheck className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                <strong>Requirements:</strong> Institutional email address, proof of non-profit status, or academic affiliation.
              </p>
            </div>

            {/* Commercial */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-xl p-8 relative">
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                  <FaBuilding />
                </div>
                <h3 className="text-2xl font-bold mb-2">Commercial</h3>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">Custom</div>
                <p className="text-slate-600 dark:text-slate-400">Tailored for your business needs</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited requests',
                  'Priority support',
                  'Custom rate limits',
                  'SLA guarantees',
                  'Dedicated account manager',
                  'Custom integrations'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FaCheck className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                <strong>Pricing:</strong> Based on usage volume, features needed, and support level required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section id="request-form" className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Request API Access
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Tell us about your project and we'll get you set up quickly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Organization
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="Your company, university, or organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Estimated Tests Per Month
              </label>
              <input
                type="number"
                name="testsPerMonth"
                value={formData.testsPerMonth}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
                Access Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-transparent cursor-pointer hover:border-green-500 transition-all duration-200">
                  <input
                    type="radio"
                    name="accessType"
                    value="nonCommercial"
                    checked={formData.accessType === 'nonCommercial'}
                    onChange={handleInputChange}
                    required
                    className="mr-3 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Non-Commercial</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Free for research & non-profits</div>
                  </div>
                </label>
                <label className="flex items-center p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-transparent cursor-pointer hover:border-purple-500 transition-all duration-200">
                  <input
                    type="radio"
                    name="accessType"
                    value="commercial"
                    checked={formData.accessType === 'commercial'}
                    onChange={handleInputChange}
                    required
                    className="mr-3 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Commercial</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Custom pricing for business use</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Project Details
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="Tell us about your project, expected usage, and any specific requirements..."
              />
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              By submitting this form, you agree to our{' '}
              <Link to="/terms" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline">
                Privacy Policy
              </Link>.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaRocket />
                  Request API Access
                </div>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Support & Contact */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 dark:border-green-400/20 rounded-2xl p-8">
            <FaQuestionCircle className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Need Help Getting Started?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Our team is here to help you integrate GreenTrace API into your project. 
              Get personalized support and technical guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaBook className="mr-2" />
                View Documentation
              </Link>
              
              <a
                href="mailto:api@greentracer.org"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
              >
                <FaEnvelope className="mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Back Home */}
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