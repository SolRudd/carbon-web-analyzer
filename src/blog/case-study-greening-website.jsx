import img from "../assets/blog/case-study-greentrace.jpg";
export const meta = {
  title: "Case Study: Greening a Business Website from 1.2MB to 0.4MB",
  author: "Sol Rudd",
  date: "2025-07-20",
  tags: ["Case Study", "Eco Web", "Carbon Badge"],
  slug: "case-study-greening-website",
  image: img,
  excerpt: "How one business cut web emissions by 66% and improved speed and rankings in the process."
};
export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Website carbon case study" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p><i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i></p>
      <h2>Background</h2>
      <p>
        When BuzzBoost Digital set out to cut their website emissions, they started at 1.2MB per page and a carbon score of 0.38g CO₂/view. Here’s what they did:
      </p>
      <ul>
        <li>Switched to a green host (100% renewables)</li>
        <li>Rebuilt the homepage in React + Tailwind for smaller bundles</li>
        <li>Replaced PNGs with SVGs and compressed all images</li>
        <li>Removed old scripts, added caching</li>
      </ul>
      <p>
        The results? 0.4MB average page size, “A” grade carbon badge, and a much faster user experience.
      </p>
      <h2>Lessons Learned</h2>
      <ul>
        <li>Small optimizations add up to major emissions cuts</li>
        <li>Use tools like <a href="https://greentracer.org" target="_blank" rel="noopener">GreenTrace</a> to track your progress</li>
      </ul>
      <blockquote>
        “You can’t improve what you don’t measure. Get your badge and show the world your site is cleaner.” – BuzzBoost Digital
      </blockquote>
    </article>
  );
}
