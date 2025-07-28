import img from "../assets/blog/summer-energy.jpg";
export const meta = {
  title: "How to Save Energy in Summer",
  author: "Jamie-Leigh Hector",
  date: "2025-07-07",
  tags: ["Eco-friendly", "Energy"],
  slug: "save-energy-in-summer",
  image: img,
  excerpt: "Cut costs and emissions with simple summer energy-saving tips for your home and office."
};

export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Summer energy saving" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p><i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i></p>
      <ul>
        <li>Switch off and unplug appliances when not in use.</li>
        <li>Use fans and natural ventilation instead of air conditioning where possible.</li>
        <li>Dry laundry outdoors to avoid using a tumble dryer.</li>
        <li>Keep blinds and curtains closed during the hottest parts of the day.</li>
      </ul>
      <p>
        Learn more about energy-efficient habits at <a href="https://energysavingtrust.org.uk/" target="_blank" rel="noopener">Energy Saving Trust</a>.
      </p>
    </article>
  );
}
