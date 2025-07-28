import img from "../assets/blog/web-carbon-2025.jpg";
export const meta = {
  title: "Why Your Website’s Carbon Footprint Matters in 2025",
  author: "Sol Rudd",
  date: "2025-07-27",
  tags: ["Web Sustainability", "Digital Carbon", "Green Hosting"],
  slug: "why-website-carbon-matters-2025",
  image: img,
  excerpt: "In 2025, a green website is no longer optional. Find out why digital emissions are critical for every business."
};
export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Low-carbon web design illustration" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p><i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i></p>
      <p>
        As digital services expand, the carbon footprint of our online activity is growing fast. With over 5 billion internet users, every website request, image, and video adds up — globally matching the aviation industry for CO₂ emissions.
      </p>
      <h2>The true impact of web emissions</h2>
      <ul>
        <li>The average website produces 60kg CO₂ a year — equal to a car driving 270 miles.</li>
        <li>Modern data centres can consume more electricity than small towns.</li>
      </ul>
      <blockquote>
        “If the internet was a country, it would be the world’s 7th largest polluter.” – <a href="https://www.websitecarbon.com/about/" target="_blank" rel="noopener">Website Carbon</a>
      </blockquote>
      <p>
        Start measuring and reducing your site’s emissions today — and show your results with a <a href="/badge">GreenTrace badge</a>.
      </p>
    </article>
  );
}
