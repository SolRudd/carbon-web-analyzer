import React from "react";
import { FaExternalLinkAlt, FaIndustry, FaRecycle, FaGlobe, FaLeaf, FaChartLine, FaLaptop } from "react-icons/fa";
import img from "../assets/blog/plastic-climate.jpg";

// Table of Contents for parent layout/sidebar
export const toc = [
  { id: "intro", text: "Introduction", level: 2 },
  { id: "scale-impact", text: "The Staggering Scale of Plastic's Climate Impact", level: 2 },
  { id: "plastic-connection", text: "The Plastic-Climate Connection: From Oil Well to Landfill", level: 2 },
  { id: "hidden-digital", text: "The Hidden Digital Connection: Plastic in Our Connected World", level: 2 },
  { id: "single-use", text: "Single-Use Plastic: The Climate Emergency Accelerator", level: 2 },
  { id: "practical", text: "Practical Solutions: Reducing Your Plastic Carbon Footprint", level: 2 },
  { id: "future", text: "The Future: Policy, Innovation, and Personal Responsibility", level: 2 },
  { id: "action-plan", text: "Your Plastic Reduction Action Plan", level: 2 },
];

export const meta = {
  title: "How is Plastic Linked to the Climate Crisis? The Hidden Carbon Impact",
  author: "Rayyan Karim",
  date: "2025-07-01",
  tags: ["Climate Change", "Plastic", "Sustainability", "Carbon Tracking"],
  slug: "plastic-climate-crisis",
  image: img,
  excerpt: "Discover the shocking carbon footprint of plastic and learn how to track and reduce your complete environmental impact."
};

export default function Post() {
  return (
    <div className="space-y-8">
      {/* Author & backlink */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 shadow">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Written by <span className="text-greenbuzz dark:text-green-400 font-semibold">Rayyan Karim</span> — 
          <a
            href="https://rayyankarim.com"
            target="_blank"
            rel="noopener"
            className="ml-1 underline text-blue-700 dark:text-blue-400 hover:text-greenbuzz dark:hover:text-greenbuzz transition"
          >
            rayyankarim.com
          </a>
        </span>
      </div>

      {/* --- INTRO --- */}
      <p className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none" id="intro">
        Every minute, one million plastic bottles are purchased globally, and each one carries a hidden carbon burden that extends far beyond its physical presence. While we see plastic pollution choking our oceans and landscapes, the invisible climate impact of plastic production, transportation, and disposal represents one of the most overlooked contributors to global greenhouse gas emissions—accounting for a staggering 3.4% of the world's total carbon output.
      </p>

      {/* --- SCALE IMPACT --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-red-500 pl-4" id="scale-impact">
        The Staggering Scale of Plastic's Climate Impact
      </h2>
      <p className="text-lg leading-relaxed">
        Most people think of plastic pollution in terms of visual waste—images of sea turtles with straws or massive floating garbage patches. But the climate crisis connection runs much deeper. The plastic industry's carbon footprint rivals that of entire countries, producing more CO₂ emissions annually than the aviation industry, yet it receives far less attention in climate discussions.
      </p>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
          <FaChartLine className="mr-2" />
          Shocking Plastic Carbon Statistics
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li>• Global plastic production generates <strong className="text-red-600 dark:text-red-400">1.8 billion tons of CO₂</strong> annually</li>
          <li>• A single plastic bottle produces <strong>82.8 grams of CO₂</strong> from cradle to grave</li>
          <li>• Plastic packaging accounts for <strong>36% of all plastic production</strong> but 85% of plastic waste</li>
          <li>• Only <strong>9% of all plastic ever made</strong> has been recycled</li>
          <li>• By 2050, plastic production could account for <strong>20% of global oil consumption</strong></li>
          <li>• Microplastics in our digital devices contribute to <strong>e-waste carbon emissions</strong></li>
        </ul>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "Understanding plastic's climate impact is crucial for comprehensive carbon tracking. Just as we measure the emissions from our websites and digital activities, we need to account for the physical materials that enable our connected world."
        <footer className="text-sm mt-2 not-italic">
          — Start tracking your complete carbon footprint with our <a href="/calculator" className="text-greenbuzz dark:text-green-400 hover:underline font-semibold">carbon calculator</a>
        </footer>
      </blockquote>

      {/* --- PLASTIC CONNECTION --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4" id="plastic-connection">
        The Plastic-Climate Connection: From Oil Well to Landfill
      </h2>
      <div className="space-y-8">
        {/* 1. Fossil Fuel Extraction */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">🛢️</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Fossil Fuel Extraction & Refining</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Plastic production begins with extracting crude oil and natural gas, processes that release massive amounts of CO₂. Approximately <strong>4-8% of global oil production</strong> is used to make plastic, with an additional 3-4% used to power plastic manufacturing facilities.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Carbon Impact Breakdown:</h4>
              <ul className="text-sm space-y-1">
                <li>• Oil extraction: 0.5-1.5 kg CO₂ per kg plastic</li>
                <li>• Transportation to refineries: 0.1-0.3 kg CO₂ per kg plastic</li>
                <li>• Refining process: 1.2-2.1 kg CO₂ per kg plastic</li>
              </ul>
            </div>
          </div>
        </div>
        {/* 2. Manufacturing & Processing */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <FaIndustry className="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">2. Manufacturing & Processing</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Converting raw materials into plastic products requires enormous amounts of energy for heating, molding, and chemical processing. Manufacturing facilities operate 24/7, consuming electricity that's often generated from fossil fuels.
            </p>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Energy-Intensive Processes:</h4>
              <ul className="text-sm space-y-1">
                <li>• Polymerization reactions: High heat and pressure required</li>
                <li>• Injection molding: 150-300°C operating temperatures</li>
                <li>• Extrusion: Continuous high-energy processes</li>
                <li>• Quality control: Additional energy for testing and sorting</li>
              </ul>
            </div>
          </div>
        </div>
        {/* 3. Global Transportation */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <FaGlobe className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">3. Global Transportation & Distribution</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Plastic products travel thousands of miles from manufacturing facilities to consumers, often multiple times throughout complex supply chains. This global distribution network generates significant transport emissions.
            </p>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Transportation Emissions:</h4>
              <ul className="text-sm space-y-1">
                <li>• Ocean shipping: 0.01-0.04 kg CO₂ per kg plastic per 1000km</li>
                <li>• Road transport: 0.05-0.15 kg CO₂ per kg plastic per 1000km</li>
                <li>• Air freight: 0.5-1.5 kg CO₂ per kg plastic per 1000km</li>
                <li>• Last-mile delivery: Additional emissions for consumer delivery</li>
              </ul>
            </div>
          </div>
        </div>
        {/* 4. End-of-Life */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">🗑️</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">4. End-of-Life: Waste Management Crisis</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              The final stage of plastic's lifecycle often involves either landfilling, incineration, or—in the worst cases—environmental dumping. Each disposal method carries significant carbon implications.
            </p>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Disposal Method Impacts:</h4>
              <ul className="text-sm space-y-1">
                <li>• Landfilling: Methane emissions as plastic slowly degrades</li>
                <li>• Incineration: Direct CO₂ release, though with energy recovery</li>
                <li>• Ocean dumping: Ongoing environmental damage and carbon cost</li>
                <li>• Recycling: Only 9% globally, significant energy required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- HIDDEN DIGITAL --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-purple-500 pl-4" id="hidden-digital">
        The Hidden Digital Connection: Plastic in Our Connected World
      </h2>
      <p className="text-lg leading-relaxed">
        There's a surprising connection between plastic pollution and digital carbon emissions that most people never consider. The devices we use to browse websites, stream videos, and engage with online content are manufactured using significant amounts of plastic, creating a hidden link between our digital habits and plastic consumption.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-300 flex items-center">
            <FaLaptop className="mr-2" />
            Digital Device Plastic Content
          </h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Smartphones:</strong> 40-50% plastic by weight</li>
            <li>• <strong>Laptops:</strong> 60-70% plastic components</li>
            <li>• <strong>Data center servers:</strong> Extensive plastic cooling systems</li>
            <li>• <strong>Network infrastructure:</strong> Plastic cables and housings</li>
          </ul>
          <p className="text-sm mt-3 text-purple-600 dark:text-purple-400">
            Every digital interaction depends on plastic-intensive infrastructure
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300 flex items-center">
            <FaRecycle className="mr-2" />
            E-Waste Plastic Challenge
          </h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>54 million tons:</strong> Annual global e-waste generation</li>
            <li>• <strong>20% plastic:</strong> Proportion of e-waste that's plastic</li>
            <li>• <strong>2% recycled:</strong> E-waste plastic recycling rate</li>
            <li>• <strong>500+ years:</strong> Time for e-waste plastic to decompose</li>
          </ul>
          <p className="text-sm mt-3 text-green-600 dark:text-green-400">
            Our digital lives create lasting plastic waste
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Comprehensive Carbon Tracking: Beyond Just Digital</h3>
        <p className="mb-4">
          Understanding your complete environmental impact means tracking both your digital carbon footprint (like website emissions) and the physical materials that enable your digital life. Our carbon tracking tools help you measure and monitor both aspects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/calculator" className="bg-greenbuzz hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-center transition-colors">
            Calculate Your Digital Emissions
          </a>
          <a href="/badge" className="border-2 border-greenbuzz text-greenbuzz dark:text-green-400 hover:bg-greenbuzz hover:text-white font-semibold py-2 px-4 rounded text-center transition-colors">
            Track Your Progress
          </a>
        </div>
      </div>

      {/* --- SINGLE-USE --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4" id="single-use">
        Single-Use Plastic: The Climate Emergency Accelerator
      </h2>
      <p className="text-lg leading-relaxed">
        The most devastating aspect of plastic's climate impact comes from single-use items that are used for minutes but persist in the environment for centuries. These products represent the worst possible carbon return on investment—maximum environmental cost for minimal utility.
      </p>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">The Single-Use Catastrophe</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">5 trillion</div>
              <div className="font-semibold mb-1">Plastic bags used annually</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">12 minutes average use time</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">1 million</div>
              <div className="font-semibold mb-1">Bottles bought per minute</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">450 years to decompose</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">500 billion</div>
              <div className="font-semibold mb-1">Cups used annually</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">15 minutes average use</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl">
          <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
            The Carbon Cost of Convenience
          </h3>
          <p className="mb-4">
            Single-use plastics represent one of the most inefficient uses of carbon in human history. Consider a plastic water bottle:
          </p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Production carbon cost:</strong> 82.8g CO₂ per bottle</li>
            <li>• <strong>Transportation emissions:</strong> Additional 15-30g CO₂</li>
            <li>• <strong>Refrigeration at retail:</strong> 5-10g CO₂ per bottle</li>
            <li>• <strong>Disposal emissions:</strong> 3-8g CO₂ per bottle</li>
            <li>• <strong>Total carbon footprint:</strong> ~125g CO₂ for 500ml of water</li>
          </ul>
          <p className="mt-4 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
            That's equivalent to the carbon emissions from browsing websites for 3-4 hours!
          </p>
        </div>
      </div>

      {/* --- PRACTICAL SOLUTIONS --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-teal-500 pl-4" id="practical">
        Practical Solutions: Reducing Your Plastic Carbon Footprint
      </h2>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">High-Impact Plastic Reduction Strategies</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🏠</span>
                Household Changes
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Reusable water bottles:</strong> Save 156 bottles/year per person
                    <div className="text-sm text-slate-600 dark:text-slate-400">Carbon savings: ~19kg CO₂ annually</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Cloth shopping bags:</strong> Replace 500+ plastic bags/year
                    <div className="text-sm text-slate-600 dark:text-slate-400">Carbon savings: ~2.5kg CO₂ annually</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Glass/metal food containers:</strong> Eliminate single-use packaging
                    <div className="text-sm text-slate-600 dark:text-slate-400">Carbon savings: ~12kg CO₂ annually</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Buy in bulk:</strong> Reduce packaging per unit
                    <div className="text-sm text-slate-600 dark:text-slate-400">Carbon savings: ~8kg CO₂ annually</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🏢</span>
                Business Solutions
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Sustainable packaging:</strong> Switch to biodegradable alternatives
                    <div className="text-sm text-slate-600 dark:text-slate-400">Impact: 60-80% packaging carbon reduction</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Digital receipts:</strong> Eliminate thermal paper plastic coating
                    <div className="text-sm text-slate-600 dark:text-slate-400">Also reduces your digital carbon footprint!</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Supplier audits:</strong> Choose partners with plastic reduction goals
                    <div className="text-sm text-slate-600 dark:text-slate-400">Track impact with comprehensive carbon monitoring</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <div>
                    <strong>Employee programs:</strong> Provide reusable alternatives
                    <div className="text-sm text-slate-600 dark:text-slate-400">Measurable impact on company carbon footprint</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2 text-blue-600 dark:text-blue-400" />
            Track Your Plastic Reduction Impact
          </h3>
          <p className="mb-4">
            Just as you can measure your website's carbon emissions, tracking your plastic consumption reduction helps quantify your environmental impact. Small changes compound over time into significant carbon savings.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <div className="font-semibold text-green-600 dark:text-green-400">Monthly Tracking</div>
              <div>Monitor plastic usage patterns</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <div className="font-semibold text-blue-600 dark:text-blue-400">Carbon Calculations</div>
              <div>Quantify emissions saved</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <div className="font-semibold text-purple-600 dark:text-purple-400">Progress Visualization</div>
              <div>See your impact over time</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FUTURE --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-4" id="future">
        The Future: Policy, Innovation, and Personal Responsibility
      </h2>
      <p className="text-lg leading-relaxed">
        Addressing plastic's climate impact requires systemic change, but individual actions create the demand for better alternatives and demonstrate the market viability of sustainable solutions. The same mindset that drives website optimization for carbon reduction applies to plastic consumption—small, measurable improvements that compound over time.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-300">Policy Changes Coming</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Extended Producer Responsibility:</strong> Manufacturers pay for entire lifecycle</li>
            <li>• <strong>Single-use plastic bans:</strong> Expanding globally</li>
            <li>• <strong>Carbon pricing:</strong> Including plastic production emissions</li>
            <li>• <strong>Recycling mandates:</strong> Minimum recycled content requirements</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">Innovation Solutions</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Biodegradable plastics:</strong> Plant-based alternatives</li>
            <li>• <strong>Chemical recycling:</strong> Breaking down to molecular level</li>
            <li>• <strong>Plastic-eating enzymes:</strong> Biological decomposition</li>
            <li>• <strong>Digital alternatives:</strong> Reducing need for physical packaging</li>
          </ul>
        </div>
      </div>
      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "The companies and individuals who start measuring and reducing their plastic carbon footprint today will be the leaders in tomorrow's sustainable economy. Every emission source matters—from websites to water bottles."
        <footer className="text-sm mt-2 not-italic">
          — Learn more at <a 
            href="https://www.wwf.org.uk/updates/how-reduce-plastic-waste" 
            target="_blank" 
            rel="noopener"
            className="text-greenbuzz dark:text-green-400 hover:underline inline-flex items-center"
          >
            WWF: How to Reduce Plastic Waste <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        </footer>
      </blockquote>

      <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-4 text-center">Start Tracking Your Complete Environmental Impact</h3>
        <p className="text-lg mb-6 text-center">
          Plastic consumption and digital carbon emissions are interconnected parts of your environmental footprint. Our tools help you measure, monitor, and reduce both aspects of your climate impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/calculator" className="bg-greenbuzz hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Calculate Your Carbon Footprint
          </a>
          <a href="/badge" className="border-2 border-greenbuzz text-greenbuzz dark:text-green-400 hover:bg-greenbuzz hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Get Your Impact Badge
          </a>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
          Join thousands already tracking their environmental impact. Read our guides on <a href="/blog/why-website-carbon-matters-2025" className="text-greenbuzz dark:text-green-400 hover:underline">digital carbon reduction</a> and <a href="/blog/save-energy-in-summer" className="text-greenbuzz dark:text-green-400 hover:underline">seasonal sustainability strategies</a>.
        </p>
      </div>

      {/* --- ACTION PLAN --- */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-teal-500 pl-4" id="action-plan">
        Your Plastic Reduction Action Plan
      </h2>
      <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaLeaf className="mr-2 text-green-600 dark:text-green-400" />
          Your Plastic Reduction Action Plan
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Week 1-2: Assessment & Easy Wins</h4>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li>Audit your current plastic consumption</li>
              <li>Replace single-use items with reusable alternatives</li>
              <li>Calculate baseline carbon impact from plastic use</li>
              <li>Set up tracking system for progress monitoring</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Week 3-4: Systematic Changes</h4>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li>Research plastic-free alternatives for remaining items</li>
              <li>Change shopping habits to reduce packaging</li>
              <li>Implement workplace or business plastic reduction</li>
              <li>Track and celebrate your carbon emission reductions</li>
            </ol>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Use our carbon tracking tools to monitor both your plastic reduction impact and your digital carbon footprint for comprehensive environmental accountability.
        </p>
      </div>
    </div>
  );
}
