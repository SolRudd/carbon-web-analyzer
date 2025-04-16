import React from "react";

const showcaseSites = [
  {
    name: "Do Nation",
    image: "https://carbonwebchecker.netlify.app/images/donation.jpg", // Placeholder or local file
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
    <section className="bg-slate-950 py-16 px-4 text-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Beautiful, Low Carbon Websites
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          These efficient sites use compressed images, clean code, and green hosting.
          They’re great examples of sustainable web practices.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {showcaseSites.map((site, index) => (
          <a
            key={index}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={site.image}
              alt={site.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{site.name}</h3>
              <p className="text-slate-400 text-sm">{site.co2}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Showcase;
