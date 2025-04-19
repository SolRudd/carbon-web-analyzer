import React from "react";

const showcaseSites = [
  {
    name: "Do Nation",
    image: "https://carbonwebchecker.netlify.app/images/donation.jpg",
    co2: "0.29g CO₂/page",
    url: "https://www.wearedonation.com",
  },
  {
    name: "C40 Cities",
    image: "https://carbonwebchecker.netlify.app/images/c40.jpg",
    co2: "0.34g CO₂/page",
    url: "https://www.c40.org",
  },
  {
    name: "Riverford Organic",
    image: "https://carbonwebchecker.netlify.app/images/riverford.jpg",
    co2: "0.23g CO₂/page",
    url: "https://www.riverford.co.uk",
  },
  {
    name: "Low Tech Magazine",
    image: "https://carbonwebchecker.netlify.app/images/lowtech.jpg",
    co2: "0.40g CO₂/page",
    url: "https://www.lowtechmagazine.com",
  },
];

function Showcase() {
  return (
    <section
      className="
        w-full
        bg-white dark:bg-[#020f1e]
        text-slate-900 dark:text-white
        py-20 px-4 md:px-8
        transition-colors duration-300
      "
    >
      <div className="max-w-[1400px] mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Beautiful, Low Carbon Websites
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
          These sites excel at efficiency – compressed images, clean code, and green hosting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        {showcaseSites.map((site, i) => (
          <a
            key={i}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              rounded-xl overflow-hidden
              shadow-md hover:shadow-xl
              transform hover:-translate-y-1 hover:scale-105
              transition-all duration-300
            "
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={site.image}
                alt={site.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {site.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {site.co2}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Showcase;
