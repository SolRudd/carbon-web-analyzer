// src/pages/ApiAccess.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ApiAccess() {
  return (
    <section
      id="api-access"
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen py-20 px-4 md:px-8 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-greenbuzz dark:text-greenbuzz-light">
            GreenTrace Carbon API
          </h1>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
            Integrate our open API to measure and track the carbon footprint of any website or web app.
          </p>
        </header>

        {/* Access Details */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Free Non‑Commercial Access
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Available at no cost for registered non‑profits, charities, and academic researchers with an institutional email.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Commercial Access
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              For businesses and commercial projects, request a tailored paid plan by filling out the form below with your use case details.
            </p>
          </div>
        </section>

        {/* Access Request Form */}
        <form className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="sr-only">First name</span>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                required
                className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
              />
            </label>
            <label className="block">
              <span className="sr-only">Last name</span>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                required
                className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
              />
            </label>
          </div>

          <label className="block">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
            />
          </label>

          <label className="block">
            <span className="sr-only">Organization (optional)</span>
            <input
              type="text"
              name="organization"
              placeholder="Organization (optional)"
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-greenbuzz"
            />
          </label>

          <label className="block">
            <span className="sr-only">Estimated tests per month</span>
            <input
              type="number"
              name="testsPerMonth"
              placeholder="Estimated tests per month"
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
            />
          </label>

          <fieldset className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <legend className="text-lg font-semibold text-slate-900 dark:text-white">Access Type</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accessType"
                value="nonCommercial"
                required
                className="focus:ring-greenbuzz text-greenbuzz"
              />
              <span className="text-slate-900 dark:text-white">Non‑Commercial</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accessType"
                value="commercial"
                required
                className="focus:ring-greenbuzz text-greenbuzz"
              />
              <span className="text-slate-900 dark:text-white">Commercial</span>
            </label>
          </fieldset>

          <label className="block">
            <span className="sr-only">Project details</span>
            <textarea
              name="message"
              placeholder="Tell us about your project (optional)"
              rows={4}
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
            />
          </label>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            By submitting this form, you agree to our{' '}
            <Link to="/terms" className="underline text-greenbuzz hover:text-greenbuzz-light transition-colors duration-200">
              Terms of Service
            </Link>
            .
          </p>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold rounded-full transition-colors duration-200"
          >
            Request Access
          </button>
        </form>

        {/* Additional CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link
            to="/badge"
            className="px-6 py-3 bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold rounded-full transition-transform hover:scale-105"
          >
            Get Your Badge
          </Link>
          <Link
            to="/faq"
            className="px-6 py-3 border-2 border-greenbuzz text-greenbuzz hover:bg-greenbuzz hover:text-white rounded-full transition-colors duration-200"
          >
            Go to FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
