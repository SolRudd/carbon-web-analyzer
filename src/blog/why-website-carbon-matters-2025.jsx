import React from "react";
import { 
  FaExternalLinkAlt, FaChartLine, FaServer, FaLeaf, FaShoppingCart, 
  FaLaptopCode, FaNewspaper, FaImage, FaCode, FaRocket 
} from "react-icons/fa";
// ✅ Image Optimization: Switched from .jpg to the lighter .webp format

export const toc = [
  { id: "intro", text: "Why Your Digital Footprint Matters", level: 2 },
  { id: "hidden-cost", text: "The Invisible Cost of the Internet", level: 2 },
  { id: "business-impact", text: "The Business Case: A Sector-by-Sector Audit", level: 2 },
  { id: "three-pillars", text: "The Three Pillars of Website Emissions", level: 2 },
  { id: "pillar-one", text: "Pillar 1: Infrastructure & Hosting Energy", level: 3 },
  { id: "pillar-two", text: "Pillar 2: Data Transfer & Asset Bloat", level: 3 },
  { id: "pillar-three", text: "Pillar 3: Code & End-User Processing", level: 3 },
  { id: "action-plan", text: "Your 30-Day Green Website Action Plan", level: 2 },
  { id: "future", text: "The Future of Green Web Development", level: 2 },
];

export const meta = {
  title: "Why Your Website's Carbon Footprint Matters in 2025: A Complete Guide",
  author: "Sol Rudd",
  date: "2025-07-27",
  tags: ["Web Sustainability", "Digital Carbon", "Green Hosting", "Web Performance"],
  slug: "why-website-carbon-matters-2025",
  image: "/assets/blog/web-carbon-2025.webp",
  imageAvif: "/assets/blog/web-carbon-2025.avif",
  excerpt: "In 2025, a green website is no longer optional. This guide breaks down why digital emissions are critical for every business and provides a complete action plan for reduction."
};

export default function Post() {
  return (
    <div className="space-y-8">
      <p id="intro" className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        As digital services expand rapidly across the globe, the carbon footprint of our online activities is becoming impossible to ignore. With over 5 billion internet users worldwide, every website request, image load, and video stream contributes to a growing environmental crisis that now rivals the aviation industry in CO₂ emissions. For businesses, this is no longer a footnote in a sustainability report; it's a core operational and reputational metric.
      </p>

      <h2 id="hidden-cost" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-greenbuzz dark:border-green-400 pl-4">
        The Invisible Environmental Cost of the Internet
      </h2>

      <p className="text-lg leading-relaxed">
        Most businesses today understand their physical carbon footprint—energy usage in offices, transportation, manufacturing. But digital emissions remain largely invisible, despite representing a massive and growing portion of global carbon output. The internet infrastructure powering our connected world consumes approximately <strong>4% of global electricity</strong>, and this figure is expected to double by 2030.
      </p>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
          <FaChartLine className="mr-2" />
          Shocking Digital Carbon Statistics
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li>• The average website produces <strong className="text-red-600 dark:text-red-400">0.5g of CO₂</strong> per page view.</li>
          <li>• A site with 10,000 monthly views generates over <strong className="text-red-600 dark:text-red-400">60kg of CO₂ annually</strong>—equivalent to driving from London to Brighton and back.</li>
          <li>• Data centers alone consume more electricity than many entire countries, including Argentina and the Netherlands.</li>
          <li>• If the internet were a country, it would be the <strong className="text-red-600 dark:text-red-400">7th largest polluter</strong> in the world.</li>
        </ul>
      </div>

      {/* --- Business Impact Audit --- */}
      <h2 id="business-impact" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4">
        The Business Case: A Sector-by-Sector Digital Carbon Audit
      </h2>
      <p className="text-lg leading-relaxed">
        Digital carbon isn't just an environmental issue; it's a business one. Inefficient websites lead to higher costs, poor user experience, and lower conversion rates. We audited typical websites across three major sectors to reveal common pitfalls.
      </p>
      
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border-t-4 border-purple-500">
            <h4 className="font-bold text-xl mb-4 flex items-center"><FaShoppingCart className="mr-2 text-purple-500"/>E-commerce</h4>
            <div className="space-y-2 text-sm">
                <p className="mb-4">High-resolution product images and numerous third-party scripts (payments, reviews, analytics) create significant bloat.</p>
                <div className="flex justify-between"><span>Avg. Page Size:</span> <span className="font-bold text-red-600">2.5 MB</span></div>
                <div className="flex justify-between"><span>Avg. CO₂/visit:</span> <span className="font-bold text-red-600">0.82g</span></div>
                <div className="flex justify-between"><span>Primary Culprit:</span> <span className="font-semibold">Unoptimized Images</span></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border-t-4 border-blue-500">
            <h4 className="font-bold text-xl mb-4 flex items-center"><FaLaptopCode className="mr-2 text-blue-500"/>SaaS / Tech</h4>
            <div className="space-y-2 text-sm">
                <p className="mb-4">Heavy JavaScript frameworks, complex animations, and auto-playing video demos are common, increasing processing demand.</p>
                <div className="flex justify-between"><span>Avg. Page Size:</span> <span className="font-bold text-orange-600">1.8 MB</span></div>
                <div className="flex justify-between"><span>Avg. CO₂/visit:</span> <span className="font-bold text-orange-600">0.65g</span></div>
                <div className="flex justify-between"><span>Primary Culprit:</span> <span className="font-semibold">Bloated JavaScript</span></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border-t-4 border-green-500">
            <h4 className="font-bold text-xl mb-4 flex items-center"><FaNewspaper className="mr-2 text-green-500"/>Media / Blog</h4>
            <div className="space-y-2 text-sm">
                <p className="mb-4">Ad trackers, embedded social media feeds, and large image files for articles contribute to a surprisingly high footprint.</p>
                <div className="flex justify-between"><span>Avg. Page Size:</span> <span className="font-bold text-yellow-600">1.5 MB</span></div>
                <div className="flex justify-between"><span>Avg. CO₂/visit:</span> <span className="font-bold text-yellow-600">0.51g</span></div>
                <div className="flex justify-between"><span>Primary Culprit:</span> <span className="font-semibold">Third-party Scripts</span></div>
            </div>
          </div>
        </div>
      </div>


      {/* --- Three Pillars --- */}
      <h2 id="three-pillars" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-purple-500 pl-4">
        The Three Pillars of Website Emissions
      </h2>
      <p className="text-lg leading-relaxed">
        To effectively reduce your website's carbon footprint, you must address the three core areas where emissions occur: the server infrastructure, the data transferred over the network, and the processing done on the user's device.
      </p>

      <div className="space-y-12">
        {/* Pillar 1: Infrastructure */}
        <div id="pillar-one" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4"><FaServer className="text-2xl text-green-600 dark:text-green-400" /></div>
            <div>
              <h3 className="text-3xl font-bold text-green-800 dark:text-green-300">Pillar 1: Infrastructure & Hosting Energy</h3>
              <p className="text-green-600 dark:text-green-400 font-semibold">Where your data lives matters most.</p>
            </div>
          </div>
          <p className="text-lg mb-6">This is the foundation. The energy mix of your web host's data center is the single largest determinant of your website's carbon footprint. A server running on coal power will always be dirtier than one running on solar, regardless of how optimized the site is.</p>
          <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-lg">
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">The Problem: Fossil-Fueled Data Centers</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Most data centers run on a fossil-fuel-heavy grid.</li>
                <li>Energy is consumed 24/7 for processing and cooling.</li>
                <li>Carbon intensity varies dramatically by region.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">The Solution: Green Infrastructure</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Switch to a host powered by 100% renewable energy.</li>
                <li>Use a Content Delivery Network (CDN) to serve data from locations closer to the user.</li>
                <li>Choose hosts with a low Power Usage Effectiveness (PUE).</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Impact: The most significant single change you can make.</h4>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">Up to 80% Reduction</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">in emissions when switching from a coal-powered host to a renewable one.</p>
          </div>
        </div>

        {/* Pillar 2: Data Transfer */}
        <div id="pillar-two" className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4"><FaImage className="text-2xl text-purple-600 dark:text-purple-400" /></div>
            <div>
              <h3 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Pillar 2: Data Transfer & Asset Bloat</h3>
              <p className="text-purple-600 dark:text-purple-400 font-semibold">Sending less data uses less energy.</p>
            </div>
          </div>
          <p className="text-lg mb-6">Every byte of data sent from your server to a user's browser consumes energy across the network. The total size of your page—dominated by images, videos, and fonts—is a direct driver of your carbon footprint.</p>
          <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-lg">
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">The Problem: Bloated Page Weight</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Large, unoptimized JPG and PNG images.</li>
                <li>Loading multiple heavy custom font files.</li>
                <li>Autoplaying videos and high-resolution backgrounds.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">The Solution: Efficient Asset Management</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Compress images and convert them to modern formats like AVIF/WebP.</li>
                <li>Use system fonts or subset web fonts to load only necessary characters.</li>
                <li>Lazy-load images and videos that are off-screen.</li>
                <li>Enable server compression like Gzip or Brotli.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Impact: Directly reduces page load time and emissions.</h4>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">50-70% Reduction</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">in page size is achievable through asset optimization alone.</p>
          </div>
        </div>
        
        {/* Pillar 3: End-User */}
        <div id="pillar-three" className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4"><FaCode className="text-2xl text-blue-600 dark:text-blue-400" /></div>
            <div>
              <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Pillar 3: Code & End-User Processing</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">Efficient code is green code.</p>
            </div>
          </div>
          <p className="text-lg mb-6">Once data arrives, the user's device must process it. Complex, inefficient code—especially JavaScript—forces the device's CPU to work harder, draining battery life and consuming more electricity. This "end-user" consumption is a significant part of the total footprint.</p>
          <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-lg">
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">The Problem: Inefficient Codebase</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Large, monolithic JavaScript bundles.</li>
                <li>Unused code from plugins or old features.</li>
                <li>Excessive third-party scripts for analytics and ads.</li>
                <li>Frequent, unnecessary re-renders in dynamic apps.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">The Solution: Performance-First Development</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Minimize JavaScript usage wherever possible.</li>
                <li>Implement code-splitting to load code only when needed.</li>
                <li>Remove unused CSS and JavaScript (tree-shaking).</li>
                <li>Implement robust browser caching to avoid re-processing.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Impact: Improves site speed and reduces device battery drain.</h4>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">15-30% Reduction</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">in processing energy and faster perceived performance for users.</p>
          </div>
        </div>
      </div>

      {/* --- Action Plan --- */}
      <h2 id="action-plan" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        Your 30-Day Green Website Action Plan
      </h2>
      <p className="text-lg leading-relaxed">Ready to make a change? Follow this structured 30-day plan to systematically reduce your website's carbon emissions. This is not just about being green; it's about building a better, faster, and more efficient website for everyone.</p>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">The Green Website Challenge</h3>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-green-600 dark:text-green-400">Week 1-2: Audit & Quick Wins</h4>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li><strong>Establish Baseline:</strong> Use a carbon calculator on your top 5 pages.</li>
                <li><strong>Image Optimization:</strong> Run all major site images through a compression tool.</li>
                <li><strong>Enable Caching:</strong> Ensure browser caching and server compression are active.</li>
                <li><strong>Identify Green Hosts:</strong> Research and shortlist 3 verified green hosting providers.</li>
                <li><strong>Script Review:</strong> Remove one non-essential third-party script.</li>
              </ol>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-blue-600 dark:text-blue-400">Week 3-4: Implementation</h4>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li><strong>Migrate Hosting:</strong> Make the switch to your chosen green host.</li>
                <li><strong>Convert to WebP/AVIF:</strong> Systematically replace key JPG/PNG images.</li>
                <li><strong>Optimize Fonts:</strong> Switch to system fonts or subset your web fonts.</li>
                <li><strong>Defer JavaScript:</strong> Defer loading of non-critical JS like chat widgets.</li>
                <li><strong>Measure & Share:</strong> Re-run your carbon audit and share the improvement.</li>
              </ol>
            </div>
        </div>
      </div>

      {/* --- Future --- */}
      <h2 id="future" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-yellow-500 pl-4">
        The Future of Green Web Development
      </h2>
      <p className="text-lg leading-relaxed">
        As we move deeper into 2025, environmental regulations are tightening globally. The European Union's <a href="https://environment.ec.europa.eu/strategy/circular-economy-action-plan_en" target="_blank" rel="noopener" className="text-greenbuzz dark:text-green-400 hover:underline inline-flex items-center">Circular Economy Action Plan <FaExternalLinkAlt className="ml-1 text-xs" /></a> is setting the stage for digital services to be included in corporate sustainability reporting.
      </p>
      <p className="text-lg leading-relaxed">
        Companies that proactively address their digital carbon footprint today will have a significant competitive advantage. Beyond compliance, green websites deliver measurable business benefits: improved performance, lower costs, and an enhanced brand reputation that resonates with climate-conscious consumers. The future of the web is not just fast; it's sustainable.
      </p>
    </div>
  );
}