// src/components/ImpactSection.jsx
import React from "react";
import GreenWebLogo   from "../assets/greenweb.svg";
import KrystalLogo    from "../assets/krystal.svg";
import GitHubLogo     from "../assets/github.png";
import WordPressLogo  from "../assets/wordpress.png";

const partners = [
  { src: GreenWebLogo,   alt: "The Green Web Foundation" },
  { src: KrystalLogo,     alt: "Krystal Hosting" },
  { src: GitHubLogo,      alt: "GitHub" },
  { src: WordPressLogo,   alt: "WordPress" },
];

export default function ImpactSection() {
  return (
    <section
      id="impact"
      className="
        w-full
        bg-white dark:bg-slate-950
        text-slate-900 dark:text-white
        py-12 px-4 md:px-8
        transition-colors duration-300
      "
    >
      <div className="max-w-5xl mx-auto text-center space-y-12">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold">
          Digital Sustainability Consulting
        </h2>

        {/* Intro copy */}
        <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Work with <strong>BuzzBoost Digital</strong>, on-demand web development experts in
          sustainable design and performance optimization. Let’s achieve
          your low-carbon goals and help contribute to a greener web.
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
          {partners.map(({ src, alt }, i) => (
            <div
              key={i}
              className="
                bg-white
                dark:bg-slate-800
                border border-gray-200 dark:border-slate-700
                p-4 rounded-xl
                flex items-center justify-center
                shadow-md hover:shadow-xl
                transition-all duration-200
              "
            >
              <img
                src={src}
                alt={alt}
                className={`
                  ${i === 0 ? "max-h-10" : "max-h-12"} w-auto
                  transition-filter duration-300
                  dark:brightness-0 dark:invert
                `}
              />
            </div>
          ))}
        </div>

        {/* Work-with-us CTA */}
        <div className="mt-12 space-y-4">
          <h3 className="text-2xl font-semibold">
            Want to work with us? Let’s make it happen!
          </h3>
          <a
            href="https://buzzboost.co.uk"
            className="
              inline-block
              bg-[#00c471] hover:bg-green-400
              text-white font-semibold
              px-8 py-4 rounded-full
              transition-shadow shadow-md
            "
          >
            Check Our Agency
          </a>
        </div>
      </div>
    </section>
  );
}
