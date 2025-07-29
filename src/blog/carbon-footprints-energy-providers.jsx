import React from "react";
import { 
  FaExternalLinkAlt, FaBolt, FaLeaf, FaChartLine, FaIndustry, 
  FaGlobe, FaServer, FaLightbulb 
} from "react-icons/fa";
import img from "../assets/blog/energy-carbon.jpg";

export const meta = {
  title: "The Digital Carbon Paradox: Why Green Energy Companies Have the Dirtiest Websites",
  author: "Imogen Suter",
  date: "2023-10-09",
  tags: ["Eco-friendly", "Energy", "Web Sustainability", "Carbon Tracking"],
  slug: "carbon-footprints-energy-providers",
  image: img,
  excerpt: "A shocking investigation reveals renewable energy companies are failing at digital sustainability — and what this means for climate action."
};

// --- Table of Contents (for sidebar/TOC use) ---
export const toc = [
  {
    id: "intro",
    text: "Introduction",
    level: 2
  },
  {
    id: "hidden-climate-crisis",
    text: "The Hidden Climate Crisis: Digital Emissions from Energy Companies",
    level: 2
  },
  {
    id: "carbon-stats",
    text: "Shocking Digital Carbon Statistics",
    level: 3
  },
  {
    id: "website-carbon-footprint",
    text: "Understanding Website Carbon Footprints: The Full Picture",
    level: 2
  },
  {
    id: "carbon-pillars",
    text: "The Four Pillars of Digital Carbon Emissions",
    level: 3
  },
  {
    id: "carbon-impact-breakdown",
    text: "Average Carbon Impact Breakdown",
    level: 4
  },
  {
    id: "action",
    text: "Take Action: Measure & Reduce Your Digital Carbon",
    level: 3
  }
];

export default function Post() {
  return (
    <div className="space-y-10">
      {/* Intro */}
      <p id="intro" className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        The internet now produces nearly 4% of global carbon emissions — more than the entire aviation industry. But here’s the shocking paradox: even companies built on renewable energy are running some of the dirtiest websites online. Our investigation into UK energy providers’ websites reveals a stark disconnect between their green marketing and their digital reality.
      </p>

      {/* Section: Digital emissions */}
      <h2 id="hidden-climate-crisis" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-red-500 pl-4">
        The Hidden Climate Crisis: Digital Emissions from Energy Companies
      </h2>
      <p className="text-lg leading-relaxed">
        Consumers expect renewable energy providers to lead on sustainability — but our findings reveal their digital platforms are undermining those very values. As customer interactions increasingly shift online, poorly optimized websites are becoming an invisible but major source of emissions.
      </p>

      {/* Shocking Stats */}
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
        <h3 id="carbon-stats" className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
          <FaIndustry className="mr-2" />
          Shocking Digital Carbon Statistics
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li>• The internet consumes <strong className="text-red-600 dark:text-red-400">416.2 TWh</strong> of electricity annually</li>
          <li>• Digital technologies produce <strong>4% of global greenhouse gas emissions</strong></li>
          <li>• The average website generates <strong>4.6g of CO₂</strong> per page view</li>
          <li>• Energy company websites receive <strong>millions of visits</strong> monthly</li>
          <li>• Poor optimization = <strong>60kg CO₂ annually</strong> per 1,000 monthly visitors</li>
        </ul>
      </div>

      {/* Callout */}
      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "If the internet were a country, it would rank 6th in global electricity consumption. Energy companies promoting sustainability while operating carbon-heavy websites are undermining their own climate mission."
        <footer className="text-sm mt-2 not-italic">
          — Track your website's environmental impact with our <a href="/calculator" className="text-greenbuzz dark:text-green-400 hover:underline font-semibold">carbon calculator</a>
        </footer>
      </blockquote>

      {/* Carbon pillars */}
      <h2 id="website-carbon-footprint" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4">
        Understanding Website Carbon Footprints: The Full Picture
      </h2>
      <p className="text-lg leading-relaxed">
        A website’s carbon footprint comes from more than just server energy. It’s a complex chain involving data centers, networks, devices, and even hardware manufacturing. Here’s how it breaks down:
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
        <h3 id="carbon-pillars" className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6">The Four Pillars of Digital Carbon Emissions</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <FaServer className="text-2xl text-blue-600 dark:text-blue-400 mr-3" />,
              title: "1. Data Center Energy",
              text: "Servers running 24/7 consume electricity — for processing, cooling, storage, and network infrastructure.",
              points: ["Server processing & memory", "Cooling systems", "Data storage & backup", "Network infrastructure"]
            },
            {
              icon: <FaGlobe className="text-2xl text-green-600 dark:text-green-400 mr-3" />,
              title: "2. Network Transmission",
              text: "Data moves across the internet through energy-intensive infrastructure: from fiber optics to cell towers.",
              points: ["Backbone networks & routers", "4G/5G cellular towers", "Wi-Fi access points", "CDN edge servers"]
            },
            {
              icon: <span className="text-2xl mr-3">📱</span>,
              title: "3. End-User Devices",
              text: "The devices we use to access websites — phones, laptops, tablets — consume energy to render pages.",
              points: ["Display energy & brightness", "CPU/GPU rendering load", "RAM consumption", "Battery degradation over time"]
            },
            {
              icon: <span className="text-2xl mr-3">⚡</span>,
              title: "4. Manufacturing & E-Waste",
              text: "Embedded emissions from manufacturing devices, servers, and networking equipment.",
              points: ["Device & server production", "Network equipment lifecycle", "Infrastructure turnover", "Premature upgrades due to poor performance"]
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">{pillar.icon} <h4 className="font-semibold">{pillar.title}</h4></div>
              <p className="text-sm mb-3">{pillar.text}</p>
              <ul className="space-y-1 text-xs">{pillar.points.map((p, j) => <li key={j}>• {p}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-100 dark:bg-blue-900/30 p-6 rounded-lg">
          <h4 id="carbon-impact-breakdown" className="font-semibold mb-4 text-center">📊 Average Carbon Impact Breakdown</h4>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              { pct: "42%", label: "Data Centers", color: "blue" },
              { pct: "28%", label: "Network Transmission", color: "green" },
              { pct: "19%", label: "End-User Devices", color: "purple" },
              { pct: "11%", label: "Manufacturing", color: "orange" }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded">
                <div className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.pct}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-xl p-8 text-center">
        <h3 id="action" className="text-2xl font-bold mb-4">Take Action: Measure & Reduce Your Digital Carbon</h3>
        <p className="text-lg mb-6">
          Don’t let your website undermine your sustainability efforts. Get a full carbon analysis and start reducing your emissions today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/calculator" className="bg-greenbuzz hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Get Your Free Carbon Report
          </a>
          <a href="/badge" className="border-2 border-greenbuzz text-greenbuzz dark:text-green-400 hover:bg-greenbuzz hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Display Your Carbon Badge
          </a>
        </div>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "Digital sustainability isn’t optional. It’s a business imperative. Start measuring, optimizing, and leading by example today."
      </blockquote>
    </div>
  );
}
