import img from "../assets/blog/reduce-website-emissions.jpg";
export const meta = {
  title: "How to Reduce Website Emissions: 5 Practical Tips",
  author: "Sol Rudd",
  date: "2025-07-25",
  tags: ["Green Web", "Performance", "Sustainability"],
  slug: "reduce-website-emissions-tips",
  image: img,
  excerpt: "Quick wins and proven tactics for building a faster, cleaner, and more sustainable site."
};
export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Web performance and sustainability" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p><i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i></p>
      <ol>
        <li><b>Use green hosting:</b> Pick providers powered by renewables. <a href="https://www.thegreenwebfoundation.org/" target="_blank" rel="noopener">Check here</a>.</li>
        <li><b>Compress images:</b> Serve next-gen formats and resize for mobile.</li>
        <li><b>Eliminate unused code:</b> Tree-shake, minify JS/CSS, and audit with Lighthouse.</li>
        <li><b>Lazy-load media:</b> Don’t load videos or images until needed.</li>
        <li><b>Cache aggressively:</b> Use CDN and server-side caching to minimize server hits.</li>
      </ol>
      <p>
        Even small improvements reduce carbon for every visitor — and improve speed, SEO, and user experience.
      </p>
      <p>
        Learn more with <a href="https://www.websitecarbon.com/blog/" target="_blank" rel="noopener">WebsiteCarbon Blog</a>.
      </p>
    </article>
  );
}
