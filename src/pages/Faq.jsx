// src/pages/Faq.jsx
import React from "react";

const Faq = () => {
  return (
    <section className="bg-[#020f1e] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              💡 How does the carbon checker work?
            </h2>
            <p className="text-slate-300">
              It estimates CO₂ emissions per page load based on data size, energy
              usage, and the green status of the hosting provider. We keep it
              simple, fast, and educational.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              🌱 Why does it matter?
            </h2>
            <p className="text-slate-300">
              Websites run on electricity. Cleaner, leaner sites = lower impact on
              the planet. The tool helps raise awareness and encourages greener
              design decisions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              🚫 Why is my website not showing a green host?
            </h2>
            <p className="text-slate-300">
              We use data from The Green Web Foundation. If your host isn’t listed,
              they might not be registered. If you're using a CDN, it may mask your
              actual host.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              🔄 Why are the results the same after changes?
            </h2>
            <p className="text-slate-300">
              To save energy, results are cached. We’ll add a “retest” feature soon
              so you can manually trigger a fresh check.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              🔗 Can I add the badge to my website?
            </h2>
            <p className="text-slate-300">
              Yep! Once you’ve tested a site, we’ll provide HTML you can copy and
              paste to show off your rating.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              🧪 Do you offer deeper analysis?
            </h2>
            <p className="text-slate-300">
              We're building out custom sustainability reports soon. You’ll be able
              to book a review for your entire site or portfolio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
