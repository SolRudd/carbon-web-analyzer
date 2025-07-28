import img from "../assets/blog/air-quality.jpg";
export const meta = {
  title: "5 Ways to Improve Your Air Quality for a Healthier Home",
  author: "Jamie-Leigh Hector",
  date: "2025-06-19",
  tags: ["Eco-friendly", "Home", "Air Quality"],
  slug: "improve-air-quality",
  image: img,
  excerpt: "Breathe easier at home with these simple air quality tips."
};

export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Healthy indoor air" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p><i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i></p>
      <ul>
        <li>Open windows regularly to let fresh air in.</li>
        <li>Add air-purifying plants.</li>
        <li>Use natural cleaning products.</li>
        <li>Avoid burning candles or incense too often.</li>
        <li>Keep your home dry and free from mould.</li>
      </ul>
      <p>
        See more home health tips at <a href="https://www.nhs.uk/live-well/healthy-body/how-to-improve-indoor-air-quality/" target="_blank" rel="noopener">NHS: How to Improve Indoor Air Quality</a>.
      </p>
    </article>
  );
}
