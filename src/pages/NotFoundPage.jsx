// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4">404</h1>
      <p className="text-xl mb-8">
        Oops — we couldn’t find that page.
      </p>
      <Link
        to="/"
        className="inline-block bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold px-6 py-3 rounded-full transition"
      >
        Go back home
      </Link>
    </section>
  );
}
