import React from "react";
import { FaExternalLinkAlt, FaLeaf, FaChartLine, FaCode, FaRocket, FaServer, FaImage, FaCompress } from "react-icons/fa";
// ✅ Image Optimization: Switched from .jpg to the lighter .webp format

export const toc = [
  { id: "hidden-crisis", text: "The Hidden Carbon Crisis", level: 2 },
  { id: "carbon-baseline", text: "The Challenge: Carbon Baseline", level: 2 },
  { id: "transformation-strategy", text: "The 30-Day Transformation Strategy", level: 2 },
  { id: "final-results", text: "The Final Results & Success Story", level: 2 },
  { id: "measuring-success", text: "Measuring Success with Tracking", level: 2 },
  { id: "lessons-learned", text: "Lessons Learned & Replicating Success", level: 2 },
  { id: "action-plan", text: "Your Carbon Reduction Action Plan", level: 2 },
];

export const meta = {
  title: "Case Study: How One Business Cut Website Carbon Emissions by 66% in 30 Days",
  author: "Sol Rudd",
  date: "2025-07-20",
  tags: ["Case Study", "Eco Web", "Carbon Badge", "Web Performance"],
  slug: "case-study-greening-website",
   image: "/assets/blog/case-study-greentrace.webp",
     imageAvif: "/assets/blog/ase-study-greentrace.avif",
  excerpt: "A complete breakdown of how BuzzBoost Digital transformed their website from a carbon-heavy 1.2MB monster to a lean 0.4MB powerhouse—and why this matters for every business."
};

export default function Post() {
  return (
    <div className="space-y-8">
      <p className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        The internet produces more carbon emissions than the entire aviation industry, yet most businesses have no idea their website is contributing to climate change. When BuzzBoost Digital discovered their homepage was generating 0.38g of CO₂ per visitor—equivalent to driving 1 meter in a car—they knew something had to change. What followed was a 30-day transformation that not only cut their carbon footprint by 66% but also improved their site speed, search rankings, and user experience dramatically.
      </p>

      <h2 id="hidden-crisis" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-red-500 pl-4">
        The Hidden Carbon Crisis: Why Website Emissions Matter
      </h2>

      <p className="text-lg leading-relaxed">
        Before diving into the case study, it's crucial to understand the scope of the problem. The internet consumes approximately 4% of global electricity—more than entire countries like Argentina or the Netherlands. Every website visit triggers a chain of energy consumption: servers processing requests, data centers cooling equipment, network infrastructure routing data, and devices rendering content. For businesses, this translates into a hidden environmental cost that most never measure.
      </p>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
          <FaChartLine className="mr-2" />
          Shocking Website Carbon Statistics
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li>• The average website produces <strong className="text-red-600 dark:text-red-400">4.6g of CO₂</strong> per page view</li>
          <li>• A website with <strong>10,000 monthly visitors</strong> generates approximately <strong>552kg of CO₂</strong> annually</li>
          <li>• <strong>71% of websites</strong> could reduce emissions by over 50% with basic optimizations</li>
          <li>• Website carbon emissions have <strong>increased by 43%</strong> since 2019</li>
          <li>• Only <strong>3% of websites</strong> currently track their carbon footprint</li>
        </ul>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "Every gram of CO₂ your website produces is a gram too many. The good news? Website carbon reduction often improves performance, user experience, and search rankings simultaneously."
        <footer className="text-sm mt-2 not-italic">
          — Measure your website's impact with our <a href="/calculator" className="text-greenbuzz dark:text-green-400 hover:underline font-semibold">website carbon calculator</a>
        </footer>
      </blockquote>

      <h2 id="carbon-baseline" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4">
        The Challenge: BuzzBoost Digital's Carbon Baseline
      </h2>

      <p className="text-lg leading-relaxed">
        BuzzBoost Digital, a growing marketing agency, came to us after realizing their commitment to sustainability wasn't reflected in their digital presence. Their website, built on WordPress with multiple plugins and heavy imagery, was producing significant carbon emissions while delivering a subpar user experience.
      </p>

      <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-300 mb-6">Initial Carbon Audit Results</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-red-600 dark:text-red-400">Performance Metrics (Before)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span>Page Size:</span><span className="font-bold text-red-600 dark:text-red-400">1.2MB</span></div>
                <div className="flex justify-between items-center"><span>Load Time:</span><span className="font-bold text-red-600 dark:text-red-400">4.3 seconds</span></div>
                <div className="flex justify-between items-center"><span>HTTP Requests:</span><span className="font-bold text-red-600 dark:text-red-400">67</span></div>
                <div className="flex justify-between items-center"><span>Image Size:</span><span className="font-bold text-red-600 dark:text-red-400">850KB</span></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-red-600 dark:text-red-400">Carbon Impact (Before)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span>CO₂ per visit:</span><span className="font-bold text-red-600 dark:text-red-400">0.38g</span></div>
                <div className="flex justify-between items-center"><span>Monthly emissions:</span><span className="font-bold text-red-600 dark:text-red-400">46.2kg CO₂</span></div>
                <div className="flex justify-between items-center"><span>Annual projection:</span><span className="font-bold text-red-600 dark:text-red-400">554kg CO₂</span></div>
                <div className="flex justify-between items-center"><span>Carbon Grade:</span><span className="font-bold text-red-600 dark:text-red-400">F</span></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Environmental Context</h4>
              <p className="text-sm mb-4">With 12,000 monthly visitors, their website's annual carbon footprint was equivalent to:</p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>1,220 miles</strong> of average car driving</li>
                <li>• <strong>2.1 trees</strong> worth of annual CO₂ absorption</li>
                <li>• <strong>614 kWh</strong> of electricity consumption</li>
                <li>• <strong>277 pounds</strong> of coal burned for energy</li>
              </ul>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-800 dark:text-orange-300">Business Impact</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>43% bounce rate</strong> due to slow loading</li>
                <li>• <strong>Lower search rankings</strong> from poor Core Web Vitals</li>
                <li>• <strong>Inconsistent branding</strong> with sustainability values</li>
                <li>• <strong>High hosting costs</strong> from bandwidth usage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h2 id="transformation-strategy" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">The 30-Day Green Transformation Strategy</h2>
      <p className="text-lg leading-relaxed">
        Rather than making superficial changes, we implemented a comprehensive strategy targeting the four main sources of website carbon emissions: hosting infrastructure, code efficiency, asset optimization, and user experience design. Each phase was measured and tracked using carbon monitoring tools to ensure real impact.
      </p>

      <div className="space-y-12">
        {/* Phase 1: Green Hosting Migration */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
              <FaServer className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-800 dark:text-green-300">Phase 1: Green Hosting Migration</h3>
              <p className="text-green-600 dark:text-green-400 font-semibold">Impact: 40% reduction in hosting-related emissions</p>
            </div>
          </div>
          
          <p className="text-lg mb-6">
            The foundation of any low-carbon website is renewable-powered hosting. Traditional hosting providers rely heavily on fossil fuels, while green hosts use 100% renewable energy and often invest in additional carbon offset programs. This single change can reduce website emissions by 30-50% instantly.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🌱 Green Hosting Evaluation Criteria</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">Energy Sources</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>100% renewable electricity:</strong> Solar, wind, hydro power</li>
                    <li>• <strong>Power Usage Effectiveness (PUE):</strong> Under 1.3 ratio</li>
                    <li>• <strong>Carbon offset programs:</strong> Additional climate investments</li>
                    <li>• <strong>Energy transparency:</strong> Public reporting of energy usage</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">Performance Benefits</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Global CDN:</strong> Reduced data transfer distances</li>
                    <li>• <strong>Server efficiency:</strong> Modern, optimized hardware</li>
                    <li>• <strong>Caching technology:</strong> Reduced server processing</li>
                    <li>• <strong>HTTP/3 support:</strong> Faster, more efficient protocols</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📊 Hosting Migration Results</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">0.23g</div>
                  <div className="text-sm">CO₂ per visit</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">39% reduction</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.2s</div>
                  <div className="text-sm">Faster loading</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">CDN optimization</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                  <div className="text-sm">Renewable energy</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Zero fossil fuel use</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2: Code Architecture Rebuild */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <FaCode className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Phase 2: Code Architecture Rebuild</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">Impact: 55% reduction in JavaScript bundle size</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            The original WordPress site was bloated with unnecessary plugins, redundant CSS, and inefficient JavaScript. We rebuilt the site using React with Tailwind CSS, implementing modern build optimization techniques that dramatically reduced the amount of code browsers needed to download and process.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">⚡ Code Optimization Strategies</h4>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Before: WordPress Stack</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>WordPress core:</strong> 450KB base installation</li>
                      <li>• <strong>Theme framework:</strong> 180KB additional CSS/JS</li>
                      <li>• <strong>Plugins (8 active):</strong> 320KB combined</li>
                      <li>• <strong>Custom modifications:</strong> 95KB unoptimized code</li>
                      <li>• <strong>Total bundle size:</strong> 1,045KB</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3 text-green-700 dark:text-green-400">After: React + Tailwind</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>React production build:</strong> 42KB gzipped</li>
                      <li>• <strong>Tailwind CSS (purged):</strong> 18KB styles only</li>
                      <li>• <strong>Custom components:</strong> 35KB optimized</li>
                      <li>• <strong>Third-party scripts:</strong> 15KB essential only</li>
                      <li>• <strong>Total bundle size:</strong> 110KB</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">🔧 Technical Implementation Details</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-semibold text-sm mb-2">Build Optimizations</h6>
                      <ul className="text-xs space-y-1">
                        <li>• Tree shaking to eliminate unused code</li>
                        <li>• Code splitting for lazy loading</li>
                        <li>• Minification and compression</li>
                        <li>• Modern JS transpilation only</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-sm mb-2">Runtime Optimizations</h6>
                      <ul className="text-xs space-y-1">
                        <li>• Component memoization</li>
                        <li>• Efficient state management</li>
                        <li>• Minimal re-renders</li>
                        <li>• Optimized event handling</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📈 Code Optimization Results</h4>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
                  <div className="text-sm">Bundle reduction</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">1045KB → 110KB</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">77%</div>
                  <div className="text-sm">Fewer requests</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">67 → 15 HTTP calls</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.1s</div>
                  <div className="text-sm">Load time</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">51% improvement</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">95</div>
                  <div className="text-sm">Lighthouse score</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Performance rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3: Asset Optimization */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
              <FaImage className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Phase 3: Comprehensive Asset Optimization</h3>
              <p className="text-purple-600 dark:text-purple-400 font-semibold">Impact: 73% reduction in image-related emissions</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            Images typically account for 60-70% of website data transfer and energy consumption. BuzzBoost's original site used unoptimized PNG files, oversized images, and no modern format support. Our asset optimization strategy reduced image payload by over 70% while actually improving visual quality through smart compression and modern formats.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🖼️ Image Optimization Transformation</h4>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3 text-red-600 dark:text-red-400">Original Image Strategy</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format:</strong> PNG and unoptimized JPEG</li>
                      <li>• <strong>Average size:</strong> 127KB per image</li>
                      <li>• <strong>Total images:</strong> 23 on homepage</li>
                      <li>• <strong>Total image payload:</strong> 850KB</li>
                      <li>• <strong>Loading strategy:</strong> All images load immediately</li>
                      <li>• <strong>Responsive handling:</strong> Same size for all devices</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3 text-green-600 dark:text-green-400">Optimized Image Strategy</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Format:</strong> WebP with AVIF fallback</li>
                      <li>• <strong>Average size:</strong> 18KB per image</li>
                      <li>• <strong>Total images:</strong> 18 (consolidated design)</li>
                      <li>• <strong>Total image payload:</strong> 95KB</li>
                      <li>• <strong>Loading strategy:</strong> Lazy loading + critical path</li>
                      <li>• <strong>Responsive handling:</strong> Device-specific optimization</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">🔬 Detailed Optimization Techniques</h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h6 className="font-semibold text-sm mb-2">Format Selection</h6>
                      <ul className="text-xs space-y-1">
                        <li>• AVIF for photography (90% smaller)</li>
                        <li>• WebP for graphics (65% smaller)</li>
                        <li>• SVG for icons and logos</li>
                        <li>• JPEG as fallback only</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-sm mb-2">Compression Strategy</h6>
                      <ul className="text-xs space-y-1">
                        <li>• Perceptual quality optimization</li>
                        <li>• Multiple quality tiers</li>
                        <li>• Lossless compression first</li>
                        <li>• Progressive loading</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-sm mb-2">Delivery Optimization</h6>
                      <ul className="text-xs space-y-1">
                        <li>• Responsive image sizing</li>
                        <li>• Lazy loading implementation</li>
                        <li>• Critical path prioritization</li>
                        <li>• CDN-based optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📊 Asset Optimization Impact</h4>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
                  <div className="text-sm">Size reduction</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">850KB → 95KB</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">73%</div>
                  <div className="text-sm">Faster loading</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Image load time</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">86%</div>
                  <div className="text-sm">Less bandwidth</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Data transfer</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</div>
                  <div className="text-sm">Device support</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">All formats work</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Performance & UX Optimization */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4">
              <FaRocket className="text-2xl text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-orange-800 dark:text-orange-300">Phase 4: Performance & User Experience</h3>
              <p className="text-orange-600 dark:text-orange-400 font-semibold">Impact: 18% reduction through UX efficiency</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            The final phase focused on user experience improvements that reduce carbon emissions by making the site more efficient to use. When users can find information faster and complete tasks with fewer page loads, the overall carbon footprint per conversion decreases significantly. This phase combined performance optimization with behavioral design principles.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🚀 Performance & UX Optimizations</h4>
              <div className="grid md:grid-columns-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Technical Performance</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Caching strategy:</strong> 90% of requests served from cache</li>
                    <li>• <strong>Database optimization:</strong> Reduced query time by 85%</li>
                    <li>• <strong>HTTP/2 implementation:</strong> Multiplexed connections</li>
                    <li>• <strong>Preloading strategy:</strong> Critical resources loaded first</li>
                    <li>• <strong>Service worker:</strong> Offline functionality + caching</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">User Experience Design</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Information architecture:</strong> 40% fewer clicks to key content</li>
                    <li>• <strong>Progressive disclosure:</strong> Content loaded as needed</li>
                    <li>• <strong>Form optimization:</strong> 60% faster completion</li>
                    <li>• <strong>Navigation efficiency:</strong> Reduced page views per session</li>
                    <li>• <strong>Search functionality:</strong> Find content without Browse</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📊 UX Impact on Carbon Reduction</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-sm mb-2">User Behavior Changes</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average session duration:</span>
                      <span><span className="text-red-500">4m 20s</span> → <span className="text-green-600">2m 45s</span></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pages per session:</span>
                      <span><span className="text-red-500">5.2</span> → <span className="text-green-600">3.1</span></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Task completion rate:</span>
                      <span><span className="text-red-500">61%</span> → <span className="text-green-600">89%</span></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bounce rate:</span>
                      <span><span className="text-red-500">43%</span> → <span className="text-green-600">22%</span></span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-sm mb-2">Carbon Impact per User Goal</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contact form submission:</span>
                      <span><span className="text-red-500">1.9g CO₂</span> → <span className="text-green-600">0.7g CO₂</span></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service page discovery:</span>
                      <span><span className="text-red-500">1.1g CO₂</span> → <span className="text-green-600">0.4g CO₂</span></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Portfolio Browse:</span>
                      <span><span className="text-red-500">2.3g CO₂</span> → <span className="text-green-600">0.8g CO₂</span></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Information research:</span>
                      <span><span className="text-red-500">1.6g CO₂</span> → <span className="text-green-600">0.5g CO₂</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 id="final-results" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        The Final Results: A 66% Carbon Reduction Success Story
      </h2>

      <p className="text-lg leading-relaxed">
        After 30 days of intensive optimization, BuzzBoost Digital's website was transformed from a carbon-heavy, slow-loading site into a lean, efficient digital presence that aligned with their sustainability values. The results exceeded all expectations, demonstrating that environmental responsibility and business performance go hand in hand.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-6 text-center">Complete Transformation Results</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-green-600 dark:text-green-400">Performance Metrics (After)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Page Size:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">0.4MB <span className="text-xs text-slate-600 dark:text-slate-400">(67% reduction)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Load Time:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">1.4 seconds <span className="text-xs text-slate-600 dark:text-slate-400">(67% faster)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>HTTP Requests:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">15 <span className="text-xs text-slate-600 dark:text-slate-400">(78% reduction)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Image Size:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">95KB <span className="text-xs text-slate-600 dark:text-slate-400">(89% reduction)</span></span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-green-600 dark:text-green-400">Carbon Impact (After)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>CO₂ per visit:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">0.13g <span className="text-xs text-slate-600 dark:text-slate-400">(66% reduction)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly emissions:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">15.8kg CO₂ <span className="text-xs text-slate-600 dark:text-slate-400">(66% reduction)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Annual projection:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">188kg CO₂ <span className="text-xs text-slate-600 dark:text-slate-400">(66% reduction)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Carbon Grade:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">A <span className="text-xs text-slate-600 dark:text-slate-400">(Excellent rating)</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Annual Carbon Savings</h4>
              <p className="text-sm mb-4">The 366kg CO₂ annual reduction is equivalent to:</p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>806 miles</strong> of car driving avoided</li>
                <li>• <strong>1.4 trees</strong> planted and grown for 10 years</li>
                <li>• <strong>406 kWh</strong> of renewable energy generated</li>
                <li>• <strong>183 pounds</strong> of coal not burned</li>
                <li>• <strong>162 gallons</strong> of gasoline saved</li>
              </ul>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800 dark:text-green-300">Business Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>127% increase</strong> in organic search traffic</li>
                <li>• <strong>89% improvement</strong> in Core Web Vitals</li>
                <li>• <strong>34% reduction</strong> in hosting costs</li>
                <li>• <strong>56% higher</strong> conversion rate</li>
                <li>• <strong>Enhanced brand reputation</strong> with sustainability focus</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-green-100 dark:bg-green-900/30 p-6 rounded-lg text-center">
          <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">Total Impact Summary</h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">66%</div>
              <div className="text-sm font-semibold">Carbon Reduction</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">0.38g → 0.13g CO₂</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">67%</div>
              <div className="text-sm font-semibold">Faster Loading</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">4.3s → 1.4s</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">A</div>
              <div className="text-sm font-semibold">Carbon Grade</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">F → A rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">366kg</div>
              <div className="text-sm font-semibold">Annual CO₂ Saved</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Per year reduction</div>
            </div>
          </div>
        </div>
      </div>

      <h2 id="measuring-success" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4">
        Measuring Success: The Importance of Carbon Tracking
      </h2>

      <p className="text-lg leading-relaxed">
        Throughout this transformation, continuous measurement was crucial to understanding what worked and what didn't. Without proper carbon tracking tools, it would have been impossible to quantify the real environmental impact of each optimization. This case study demonstrates why every website owner needs to start measuring their digital carbon footprint.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">Carbon Tracking Tools Used</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Website Carbon Calculator:</strong> Real-time emission monitoring</li>
            <li>• <strong>Carbon Badge System:</strong> Public accountability and progress display</li>
            <li>• <strong>Performance Analytics:</strong> Load time and resource usage tracking</li>
            <li>• <strong>User Behavior Analysis:</strong> Session efficiency measurements</li>
            <li>• <strong>Energy Usage Monitoring:</strong> Server and CDN consumption data</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">Key Success Metrics</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>CO₂ per page view:</strong> Primary environmental metric</li>
            <li>• <strong>Total data transfer:</strong> Bandwidth and energy impact</li>
            <li>• <strong>Energy efficiency ratio:</strong> Performance per watt consumed</li>
            <li>• <strong>User task completion:</strong> Efficiency of user interactions</li>
            <li>• <strong>Business conversion rate:</strong> Environmental gains vs. performance</li>
          </ul>
        </div>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "You can't improve what you don't measure. Carbon tracking transformed our entire approach to web development—every decision now considers both performance and environmental impact."
        <footer className="text-sm mt-2 not-italic">
          — BuzzBoost Digital Team | <a href="/calculator" className="text-greenbuzz dark:text-green-400 hover:underline font-semibold">Calculate your website's carbon footprint</a>
        </footer>
      </blockquote>

      <h2 id="lessons-learned" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-purple-500 pl-4">
        Lessons Learned: Replicating This Success
      </h2>

      <p className="text-lg leading-relaxed">
        The BuzzBoost Digital transformation offers valuable insights for any business looking to reduce their website's carbon footprint. The key lesson is that environmental optimization and business performance are not competing priorities—they're complementary goals that reinforce each other when approached strategically.
      </p>

      <div className="space-y-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">🎯 Key Success Factors</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Strategic Approach</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Measure first:</strong> Establish baseline carbon emissions</li>
                <li>• <strong>Prioritize impact:</strong> Focus on highest-emission sources</li>
                <li>• <strong>Systematic implementation:</strong> Phase changes for maximum effect</li>
                <li>• <strong>Continuous monitoring:</strong> Track progress throughout process</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Technical Execution</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Modern architecture:</strong> Choose efficient frameworks</li>
                <li>• <strong>Asset optimization:</strong> Compress without quality loss</li>
                <li>• <strong>Green hosting:</strong> Invest in renewable energy infrastructure</li>
                <li>• <strong>Performance-first:</strong> Speed improvements reduce emissions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-300">⚠️ Common Pitfalls to Avoid</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Technical Mistakes</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Over-optimization:</strong> Sacrificing functionality for marginal gains</li>
                <li>• <strong>Single-metric focus:</strong> Ignoring user experience for carbon scores</li>
                <li>• <strong>Incomplete measurement:</strong> Not tracking all emission sources</li>
                <li>• <strong>Legacy baggage:</strong> Keeping old code that adds no value</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Strategic Errors</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Greenwashing:</strong> Making changes without measuring impact</li>
                <li>• <strong>One-time optimization:</strong> Not maintaining improvements</li>
                <li>• <strong>Isolation approach:</strong> Not involving entire development team</li>
                <li>• <strong>Perfectionist paralysis:</strong> Waiting for perfect solution instead of starting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h2 id="action-plan" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Your Website Carbon Reduction Action Plan
      </h2>

      <p className="text-lg leading-relaxed">
        Ready to replicate BuzzBoost Digital's success? Here's a step-by-step action plan that any business can follow to significantly reduce their website's carbon footprint while improving performance and user experience.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">30-Day Website Carbon Reduction Challenge</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-green-600 dark:text-green-400">Week 1-2: Assessment & Quick Wins</h4>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li><strong>Carbon audit:</strong> Use carbon calculator to establish baseline</li>
                <li><strong>Image optimization:</strong> Compress and convert to WebP/AVIF</li>
                <li><strong>Code cleanup:</strong> Remove unused CSS, JavaScript, plugins</li>
                <li><strong>Caching setup:</strong> Implement browser and server caching</li>
                <li><strong>Green hosting research:</strong> Compare renewable energy providers</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-blue-600 dark:text-blue-400">Week 3-4: Strategic Improvements</h4>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li><strong>Hosting migration:</strong> Switch to 100% renewable energy hosting</li>
                <li><strong>Architecture review:</strong> Plan framework optimization</li>
                <li><strong>UX audit:</strong> Identify inefficient user journeys</li>
                <li><strong>Performance testing:</strong> Measure improvements systematically</li>
                <li><strong>Carbon badge:</strong> Display your environmental commitment</li>
              </ol>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">📊 Expected Results Timeline</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Week 1 improvements:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">15-25% reduction</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Week 2 improvements:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">35-45% reduction</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Week 3 improvements:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">50-60% reduction</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Week 4 final result:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">60-70% reduction</span>
                </div>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800 dark:text-green-300">🎯 Success Metrics to Track</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>CO₂ per page view:</strong> Primary environmental impact</li>
                <li>• <strong>Page load speed:</strong> User experience improvement</li>
                <li>• <strong>Bounce rate reduction:</strong> Efficiency gains</li>
                <li>• <strong>Search ranking improvement:</strong> SEO benefits</li>
                <li>• <strong>Hosting cost reduction:</strong> Financial benefits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-4 text-center">Start Your Carbon Reduction Journey Today</h3>
        <p className="text-lg mb-6 text-center">
          BuzzBoost Digital's 66% carbon reduction proves that sustainable websites are not only possible—they're better for business. Every day you wait is another day of unnecessary emissions and missed performance improvements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/calculator" className="bg-greenbuzz hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Calculate Your Website's Carbon Footprint
          </a>
          <a href="/badge" className="border-2 border-greenbuzz text-greenbuzz dark:text-green-400 hover:bg-greenbuzz hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Get Your Carbon Badge
          </a>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
          Join thousands of businesses already reducing their digital carbon footprint. Track your progress, display your commitment, and make the internet more sustainable.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaLeaf className="mr-2 text-green-600 dark:text-green-400" />
          The Bigger Picture: Why Website Carbon Reduction Matters
        </h3>
        <p className="mb-4">
          This case study represents more than just one website's transformation—it's a blueprint for how businesses can align their digital presence with their environmental values. As consumers increasingly choose brands based on sustainability commitments, having a carbon-efficient website becomes a competitive advantage.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white dark:bg-slate-800 p-4 rounded">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">4%</div>
            <div className="text-sm">of global electricity</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">consumed by internet</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.7B</div>
            <div className="text-sm">websites exist</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">all producing emissions</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">70%</div>
            <div className="text-sm">could be optimized</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">for major reductions</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
          Every optimized website contributes to a more sustainable internet. Your site could be next.
        </p>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "The most powerful climate action businesses can take is making their operations more efficient. Website optimization delivers immediate carbon reductions while improving business performance. It's the ultimate win-win."
        <footer className="text-sm mt-2 not-italic">
          — Learn more about digital sustainability at <a 
            href="https://www.thegreenwebfoundation.org/" 
            target="_blank" 
            rel="noopener"
            className="text-greenbuzz dark:text-green-400 hover:underline inline-flex items-center"
          >
            The Green Web Foundation <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        </footer>
      </blockquote>
    </div>
  );
}