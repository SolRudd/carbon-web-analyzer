import React from "react";

// Import all blog posts
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/save-energy-in-summer.jsx";
import * as post3 from "../blog/plastic-climate-crisis.jsx";
import * as post4 from "../blog/improve-air-quality.jsx";

const posts = [post1, post2, post3, post4];

export default function Blog() {
  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold mb-10">GreenTracer Blog</h1>
      <div className="space-y-10">
        {posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date)).map((p) => (
          <article key={p.meta.slug} className="rounded-lg bg-white/90 dark:bg-slate-900/90 shadow p-6 flex flex-col md:flex-row gap-6">
            <img src={p.meta.image} alt={p.meta.title} className="w-40 h-32 object-cover rounded" />
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <a href={`/blog/${p.meta.slug}`} className="text-greenbuzz hover:underline">{p.meta.title}</a>
              </h2>
              <p className="text-sm text-slate-500">{p.meta.author} • {new Date(p.meta.date).toLocaleDateString()}</p>
              <p className="mt-2">{p.meta.excerpt}</p>
              <a href={`/blog/${p.meta.slug}`} className="inline-block mt-4 text-greenbuzz hover:underline">Read more →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
