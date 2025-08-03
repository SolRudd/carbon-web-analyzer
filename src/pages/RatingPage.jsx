import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async'; // ✅ Import Helmet
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Area, AreaChart
} from "recharts";
import { 
  FaChartBar, FaLeaf, FaAward, FaGlobe, FaRocket, FaBolt, FaShieldAlt, FaLightbulb, 
  FaExternalLinkAlt, FaQuestionCircle, FaTrophy, FaChartLine, FaArrowRight, FaStar, 
  FaUsers, FaHeart, FaEye
} from "react-icons/fa";

const chartData = [
  { grade: "A+", value: 0.095, label: "Ultra-Efficient", count: 12 },
  { grade: "A",  value: 0.186, label: "Efficient", count: 18 },
  { grade: "B",  value: 0.341, label: "Good", count: 25 },
  { grade: "C",  value: 0.493, label: "Average", count: 20 },
  { grade: "D",  value: 0.656, label: "Below Average", count: 15 },
  { grade: "E",  value: 0.846, label: "Less Efficient", count: 8 },
  { grade: "F",  value: 1.0,   label: "Above Global Average", count: 2 },
];

const gradeColors = {
  "A+": "#10b981", "A": "#22c55e", "B": "#84cc16", "C": "#eab308",
  "D": "#f59e0b", "E": "#f97316", "F": "#ef4444",
};

const gradeDetails = [
  {
    grade: "A+", title: "Ultra-Efficient",
    description: "Exceptional performance! Your site is in the top 5% for sustainability.",
    tips: ["Optimized images", "Minimal JavaScript", "Green hosting", "CDN usage"],
    color: "from-green-500 to-green-600", bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700"
  },
  {
    grade: "A", title: "Efficient",
    description: "Great job! Your website has excellent environmental performance.",
    tips: ["Good optimization", "Reasonable file sizes", "Efficient hosting"],
    color: "from-green-400 to-green-500", bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700"
  },
  {
    grade: "B", title: "Good",
    description: "Above average performance with room for improvement.",
    tips: ["Image optimization", "Code minification", "Resource compression"],
    color: "from-lime-400 to-green-500", bgColor: "bg-lime-50 dark:bg-lime-900/20",
    borderColor: "border-lime-200 dark:border-lime-700"
  },
  {
    grade: "C", title: "Average",
    description: "Standard performance. Consider optimization for better results.",
    tips: ["Reduce image sizes", "Minimize plugins", "Optimize CSS/JS"],
    color: "from-yellow-400 to-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700"
  },
  {
    grade: "D", title: "Below Average",
    description: "Your site needs optimization to reduce environmental impact.",
    tips: ["Image compression", "Remove unused code", "Hosting review"],
    color: "from-orange-400 to-orange-500", bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700"
  },
  {
    grade: "E", title: "Less Efficient",
    description: "Significant improvements needed for sustainability.",
    tips: ["Major image optimization", "Code refactoring", "Hosting upgrade"],
    color: "from-red-400 to-red-500", bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700"
  },
  {
    grade: "F", title: "Above Global Average",
    description: "Critical optimization needed. Your site has high emissions.",
    tips: ["Complete audit needed", "Professional optimization", "Green hosting"],
    color: "from-red-500 to-red-600", bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700"
  }
];

function useTailwindDark() {
  const [dark, setDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => setDark(html.classList.contains("dark")));
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export default function RatingPage() {
  const isDark = useTailwindDark();
  const [selectedGrade, setSelectedGrade] = useState("A+");
  const [activeChart, setActiveChart] = useState("bar");
  const tickColor = isDark ? "#fff" : "#334155";

  const selectedGradeInfo = gradeDetails.find(g => g.grade === selectedGrade);
  
  // ✅ SEO: Create the WebPage schema for this informational page
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "GreenTracer Carbon Rating System",
    "description": "Learn how GreenTracer grades website environmental impact from A+ to F based on CO₂ emissions, and get tips to improve your score.",
    "url": "https://www.greentracer.org/rating-system",
    "keywords": "carbon rating system, website sustainability grade, CO₂ score, environmental impact rating"
  };

  return (
    <>
      {/* ✅ SEO: Full advanced Helmet setup for the Rating System page */}
      <Helmet>
        {/* -- Primary Meta Tags -- */}
        <title>Carbon Rating System | GreenTracer</title>
        <meta name="description" content="Understand how we grade your website's environmental impact from A+ (Ultra-Efficient) to F. See our science-based CO₂ rating scale and get optimization tips." />
        <link rel="canonical" href="https://www.greentracer.org/rating-system" />

        {/* -- Open Graph / Facebook -- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/rating-system" />
        <meta property="og:title" content="Carbon Rating System | GreenTracer" />
        <meta property="og:description" content="Understand how we grade your website's environmental impact from A+ to F and get optimization tips." />
        <meta property="og:image" content="https://www.greentracer.org/your-social-share-image-for-rating.jpg" />

        {/* -- Twitter -- */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/rating-system" />
        <meta property="twitter:title" content="Carbon Rating System | GreenTracer" />
        <meta property="twitter:description" content="Understand how we grade your website's environmental impact from A+ to F and get optimization tips." />
        <meta property="twitter:image" content="https://www.greentracer.org/your-social-share-image-for-rating.jpg" />

        {/* -- Schema.org Markup -- */}
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
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
              <FaChartBar className="text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Rating System</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              GreenTracer Carbon Rating System
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Understanding how we grade your website's environmental impact. 
              From A+ ultra-efficient to F needs improvement - every grade tells a story.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-white/20">
              <FaHeart className="text-red-500" />
              <span className="text-sm font-medium">
                Built by{" "}
                <a
                  href="https://buzzboost.co.uk"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BuzzBoost Digital
                </a>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Grade Levels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">2-4%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Global Emissions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">Real-time</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Calculations</div>
              </div>
            </div>
          </div>
        </section>

        {/* ...The rest of your component JSX is perfect, no other changes are needed... */}
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <FaGlobe className="text-4xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Global Web Impact</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  The web is responsible for <strong>2–4% of global CO₂ emissions</strong>—equivalent to the aviation industry.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <FaChartLine className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Scientific Approach</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our grades translate grams of CO₂ per page view into clear ratings using industry standards.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Benchmarked Results</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Grades A+ to E mean you're ahead of the curve—F means you're above the global average.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The GreenTracer Rating Scale
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Click on any grade to explore its meaning and optimization tips
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {gradeDetails.map((grade) => (
                <button
                  key={grade.grade}
                  onClick={() => setSelectedGrade(grade.grade)}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                    selectedGrade === grade.grade
                      ? `bg-gradient-to-r ${grade.color} text-white shadow-lg scale-105`
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-500'
                  }`}
                  style={selectedGrade === grade.grade ? {} : { color: gradeColors[grade.grade] }}
                >
                  {grade.grade}
                </button>
              ))}
            </div>

            {selectedGradeInfo && (
              <div className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${selectedGradeInfo.borderColor} p-8 shadow-xl mb-12`}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${selectedGradeInfo.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                        {selectedGradeInfo.grade}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedGradeInfo.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Grade {selectedGradeInfo.grade} websites
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                      {selectedGradeInfo.description}
                    </p>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>CO₂ Threshold:</strong> {
                        selectedGradeInfo.grade !== "F" 
                          ? `≤ ${chartData.find(d => d.grade === selectedGradeInfo.grade)?.value.toFixed(3)} g/view`
                          : "≥ 0.847 g/view"
                      }
                    </div>
                  </div>
                  <div className={`${selectedGradeInfo.bgColor} rounded-xl p-6`}>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaLightbulb className="text-yellow-500" />
                      Optimization Tips:
                    </h4>
                    <ul className="space-y-2">
                      {selectedGradeInfo.tips.map((tip, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <div className={`w-2 h-2 bg-gradient-to-r ${selectedGradeInfo.color} rounded-full`} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveChart("bar")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeChart === "bar"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setActiveChart("area")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeChart === "area"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                }`}
              >
                Area Chart
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-center mb-6" style={{ color: tickColor }}>
                {activeChart === "bar" ? "CO₂ Emissions by Grade" : "Emission Curve Visualization"}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                {activeChart === "bar" ? (
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis dataKey="grade" tick={{ fill: tickColor, fontSize: 16, fontWeight: 700 }} axisLine={false} />
                    <YAxis tick={{ fill: tickColor, fontSize: 13 }} axisLine={false} label={{ value: "g CO₂e/view", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 13 }} />
                    <Tooltip formatter={(value, _, { payload }) => [`${value.toFixed(3)} g CO₂e`, `Grade ${payload.grade} - ${payload.label}`]} contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", color: tickColor, border: `2px solid ${gradeColors[selectedGrade]}`, borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} cursor={{ fill: "rgba(34, 197, 94, 0.1)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry) => (<Cell key={entry.grade} fill={gradeColors[entry.grade]} stroke={selectedGrade === entry.grade ? "#ffffff" : "none"} strokeWidth={selectedGrade === entry.grade ? 3 : 0} />))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis dataKey="grade" tick={{ fill: tickColor, fontSize: 16, fontWeight: 700 }} axisLine={false} />
                    <YAxis tick={{ fill: tickColor, fontSize: 13 }} axisLine={false} label={{ value: "g CO₂e/view", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 13 }} />
                    <Tooltip formatter={(value, _, { payload }) => [`${value.toFixed(3)} g CO₂e`, `Grade ${payload.grade} - ${payload.label}`]} contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", color: tickColor, border: "2px solid #22c55e", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} fill="url(#colorGradient)" />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                )}
              </ResponsiveContainer>
              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {activeChart === "bar" ? "Each bar shows the maximum CO₂e allowed for that grade level" : "Smooth curve showing the progression of emissions across grade levels"}
              </p>
            </div>

            <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <h3 className="text-xl font-bold">Complete Rating Breakdown</h3>
                <p className="opacity-90">Detailed specifications for each grade level</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Grade</th>
                      <th className="px-6 py-4 text-left font-semibold">Max CO₂/view</th>
                      <th className="px-6 py-4 text-left font-semibold">Level</th>
                      <th className="px-6 py-4 text-left font-semibold">Typical Sites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map(({ grade, value, label, count }) => (
                      <tr key={grade} className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 ${selectedGrade === grade ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: gradeColors[grade] }}>{grade}</div>
                            <span className="font-medium">{grade}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono">{grade !== "F" ? `≤ ${value.toFixed(3)}` : "≥ 0.847"}</td>
                        <td className="px-6 py-4">{label}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(count / 25) * 100}%`, backgroundColor: gradeColors[grade] }}/>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">{count}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Why These Grades Matter</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <FaEye className="text-4xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Transparency</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Clear, science-based ratings help you understand your environmental impact and compare with industry standards.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <FaRocket className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Motivation</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Grades provide clear targets for optimization, making it easier to set and achieve sustainability goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 dark:border-green-400/20 rounded-2xl p-8">
              <FaTrophy className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Discover Your Website's Grade
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Get your personalized carbon rating and join thousands of websites working toward a greener internet. 
                Test your site now and see where you stand!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/#input-form"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaRocket className="mr-2" />
                  Test My Website
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaQuestionCircle className="mr-2" />
                  How It Works
                </Link>
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Built with ❤️ by{" "}
                  <a
                    href="https://buzzboost.co.uk"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BuzzBoost Digital
                  </a>
                  {" "}• Help us build a greener internet
                </p>
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