import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <section className="bg-[#020f1e] text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-green-400">
          How It Works
        </h1>

        <p className="text-slate-300 mb-6">
          Calculating the carbon emissions of a website is a challenge — but we’ve built a method to make it easier, more transparent, and impactful.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">1. Data Transfer Over the Wire</h2>
            <p className="text-slate-400">
              When a website loads, data is transferred from the server to the user. We measure how much data is transferred over the wire to estimate how much energy is consumed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">2. Energy Intensity of Web Data</h2>
            <p className="text-slate-400">
              We apply an average energy-per-GB value that accounts for data centers, network infrastructure, and end-user devices.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">3. Green Hosting Verification</h2>
            <p className="text-slate-400">
              We use the <a href="https://www.thegreenwebfoundation.org" target="_blank" rel="noopener noreferrer" className="underline text-green-400">Green Web Foundation</a> to verify if a host uses renewable energy. If so, we reduce the associated emissions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">4. Carbon Intensity of Electricity</h2>
            <p className="text-slate-400">
              We base our calculation on global grid averages, and adjust when we detect renewable-powered infrastructure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">5. Traffic Volume</h2>
            <p className="text-slate-400">
              Multiply the carbon impact per page load by your estimated monthly or annual traffic — and you’ll see the bigger picture.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Bonus: Repeat Visitors</h2>
            <p className="text-slate-400">
              We assume a percentage of repeat visits have cached assets, which slightly reduces data transfer on reloads.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-block bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-md transition font-semibold"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
