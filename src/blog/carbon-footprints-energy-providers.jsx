// src/blog/carbon-footprints-energy-providers.jsx
import img from "../assets/blog/energy-carbon.jpg";
export const meta = {
  title: "Understanding Website Carbon Footprints: How Does Your Energy Provider Rank?",
  author: "Imogen Suter",
  date: "2023-10-09",
  tags: ["Eco-friendly", "Energy", "Web Sustainability"],
  slug: "carbon-footprints-energy-providers",
  image: img,
  excerpt: "Discover how your energy company's website ranks for sustainability and why digital carbon footprints matter."
};

export default function Post() {
  return (
    <article className="prose dark:prose-invert max-w-2xl mx-auto py-8">
      <img src={img} alt="Energy company carbon ranking" className="rounded-xl mb-6 w-full" />
      <h1>{meta.title}</h1>
      <p>
        <i>By {meta.author} • {new Date(meta.date).toLocaleDateString()}</i>
      </p>
      <p>
        Although it’s hard to imagine, the internet’s carbon footprint is now almost 4% of all global emissions. Every website you visit contributes to this – including those run by your energy provider.
      </p>
      <h2>Why do websites have a carbon footprint?</h2>
      <ul>
        <li><b>Device manufacturing & usage:</b> Phones, laptops, and tablets use energy to operate and are carbon-intensive to produce.</li>
        <li><b>Transmission networks:</b> WiFi, 4G/5G, and cables all require infrastructure and electricity.</li>
        <li><b>Data centres:</b> Servers and cloud hosting consume huge amounts of energy (especially for images, video, or poorly coded sites).</li>
      </ul>
      <blockquote>
        The average website produces <b>60kg of CO₂ per year</b> – about the same as a petrol car driving 270 miles.
      </blockquote>
      <h2>How do UK energy providers compare?</h2>
      <p>
        We reviewed public Website Carbon scores for popular UK energy suppliers. Some surprising results!
      </p>
      <table>
        <thead>
          <tr>
            <th>Energy Provider</th>
            <th>Ranking</th>
            <th>Powered By</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Good Energy</td>
            <td>Greener than 86%</td>
            <td>Renewables</td>
          </tr>
          <tr>
            <td>British Gas</td>
            <td>Greener than 79%</td>
            <td>Standard</td>
          </tr>
          <tr>
            <td>Green Energy UK</td>
            <td>Greener than 73%</td>
            <td>Renewables</td>
          </tr>
          <tr>
            <td>EDF</td>
            <td>Greener than 67%</td>
            <td>Standard</td>
          </tr>
          <tr>
            <td>E.On</td>
            <td>Dirtier than 51%</td>
            <td>Renewables</td>
          </tr>
          <tr>
            <td>Ecotricity</td>
            <td>Dirtier than 60%</td>
            <td>Standard</td>
          </tr>
          <tr>
            <td>Ovo Energy</td>
            <td>Dirtier than 65%</td>
            <td>Standard</td>
          </tr>
          <tr>
            <td>Octopus Energy</td>
            <td>Dirtier than 68%</td>
            <td>Renewables</td>
          </tr>
          <tr>
            <td>Scottish Power</td>
            <td>Dirtier than 86%</td>
            <td>Renewables</td>
          </tr>
        </tbody>
      </table>
      <p>
        Surprised? A “green” provider doesn’t always mean a green website. Code quality, hosting, and image size all matter.
      </p>
      <h2>How to check your own website</h2>
      <ul>
        <li>
          Try <a href="https://www.websitecarbon.com" target="_blank" rel="noopener">Website Carbon</a> for a quick check.
        </li>
        <li>
          Or use <a href="https://greentracer.org" target="_blank" rel="noopener">GreenTracer</a> to get a free, open report with a badge for your site.
        </li>
      </ul>
      <blockquote>
        Website carbon footprint should be a key consideration for every company, especially those serving customers online.
      </blockquote>
      <h2>What can your business do?</h2>
      <ul>
        <li>Switch to green hosting (check <a href="https://www.thegreenwebfoundation.org/" target="_blank" rel="noopener">The Green Web Foundation</a>)</li>
        <li>Compress images, limit video, and simplify page structure</li>
        <li>Use tools like <a href="https://greentracer.org" target="_blank" rel="noopener">GreenTracer</a> to monitor progress</li>
        <li>Show your impact with a badge in your footer!</li>
      </ul>
      <hr />
      <p>
        <b>Want to know more?</b> Read our latest guides or <a href="/contact">contact us</a> for a free digital audit.
      </p>
    </article>
  );
}
