// src/pages/ApiAccess.jsx
import React from "react";

export default function ApiAccess() {
  return (
    <section
      id="api-access"
      className="
        bg-white dark:bg-slate-950
        text-slate-900 dark:text-white
        min-h-screen py-16 px-4 md:px-8
      "
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-greenbuzz dark:text-greenbuzz-light">
          GreenTrace Carbon API
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Integrate our open API to measure and track the carbon footprint of any website or web app.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Free Non-Commercial Access
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Available at no cost for registered non-profits, charities, and academic researchers. You’ll verify your status via an institutional email address.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Commercial Access
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              For businesses and commercial projects, request a paid plan tailored to your usage. Fill out the form below with your use case details.
            </p>
          </div>
        </div>

        <form className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
            required
          />
          <input
            type="text"
            name="organization"
            placeholder="Organization (optional)"
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white transition"
          />
          <input
            type="number"
            name="testsPerMonth"
            placeholder="Estimated tests per month"
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greenbuzz transition"
          />

          <fieldset className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <legend className="sr-only">Access type</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accessType"
                value="nonCommercial"
                required
                className="focus:ring-greenbuzz text-greenbuzz"
              />
              <span className="text-slate-900 dark:text-white">Non-Commercial</span>
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

          <textarea
            name="message"
            placeholder="Tell us about your project (optional)"
            rows={4}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-greenbuzz"
          />

          {/* Terms of Service note */}
          <p className="text-sm text-slate-700 dark:text-slate-300">
            By submitting this form, you agree to our{' '}
            <a
              href="/terms"
              className="text-greenbuzz hover:text-greenbuzz-light transition-colors duration-200"
            >
              Terms of Service
            </a>.
          </p>

          <button
            type="submit"
            className="w-full bg-greenbuzz hover:bg-greenbuzz-light text-white font-semibold py-3 rounded-full transition"
          >
            Request Access
          </button>
        </form>
      </div>
    </section>
  );
}
