import img from "../assets/blog/plastic-climate.jpg";
export const meta = {
  title: "How is Plastic Linked to the Climate Crisis?",
  author: "Good Energy",
  date: "2025-07-01",
  tags: ["Climate Change", "Plastic", "Sustainability"],
  slug: "plastic-climate-crisis",
  image: img,
  excerpt: "Discover the hidden carbon footprint of plastic and how to reduce your impact."
};

export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Plastic and climate crisis" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p><i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i></p>
      <p>
        The plastic industry accounts for about 3.4% of global greenhouse gas emissions. From manufacturing to disposal, plastic contributes to the climate crisis at every stage.
      </p>
      <ul>
        <li>Plastic is made from fossil fuels.</li>
        <li>Production and transportation are energy-intensive.</li>
        <li>Most plastic is single-use and not recycled.</li>
      </ul>
      <p>
        For tips on reducing plastic in your life, see <a href="https://www.wwf.org.uk/updates/how-reduce-plastic-waste" target="_blank" rel="noopener">WWF: How to Reduce Plastic Waste</a>.
      </p>
    </article>
  );
}
