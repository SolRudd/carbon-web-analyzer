import React from "react";
import { useParams, Link } from "react-router-dom";
import * as post1 from "../blog/carbon-footprints-energy-providers.jsx";
import * as post2 from "../blog/save-energy-in-summer.jsx";
import * as post3 from "../blog/plastic-climate-crisis.jsx";
import * as post4 from "../blog/improve-air-quality.jsx";

const posts = [post1, post2, post3, post4];

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find(p => p.meta.slug === slug);

  if (!post) return (
    <section className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="text-2xl font-bold mb-6">Post not found</h1>
      <Link
        to="/blog"
        className="inline-block bg-greenbuzz text-white px-4 py-2 rounded hover:bg-greenbuzz-light transition"
      >
        ← Back to Blog
      </Link>
    </section>
  );

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/blog"
          className="inline-block mb-8 bg-greenbuzz text-white px-5 py-2 rounded-full font-semibold hover:bg-greenbuzz-light transition"
        >
          ← Back to Blog
        </Link>
        {React.createElement(post.default)}
      </div>
    </main>
  );
}
