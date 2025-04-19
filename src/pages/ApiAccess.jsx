import React from "react";

export default function ApiAccess() {
  return (
    <section
      className="
        bg-white dark:bg-[#020f1e]
        text-slate-900 dark:text-white
        py-16 px-4 min-h-screen
        transition-colors duration-300
      "
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-600 dark:text-green-400">
          Website Carbon API
        </h1>
        <p className="text-slate-700 dark:text-slate-300">
          Our open API allows you to integrate website carbon calculations into your own tools and workflows.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">
          Non-commercial use
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Free access is granted to registered non-profits, charities, and verified academics. You may be asked to verify your status via an institutional or official email address.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">
          Commercial use
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          For businesses or any other commercial purpose, a formal request is required. Please use the form below to request access and share a brief description of your use case.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          API Access Request Form
        </h2>

        <form className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="First name"
              className="
                flex-1 p-3 rounded-md
                bg-white dark:bg-slate-800
                border border-slate-300 dark:border-slate-600
                text-slate-900 dark:text-white
                transition-colors duration-200
              "
              required
            />
            <input
              type="text"
              placeholder="Last name"
              className="
                flex-1 p-3 rounded-md
                bg-white dark:bg-slate-800
                border border-slate-300 dark:border-slate-600
                text-slate-900 dark:text-white
                transition-colors duration-200
              "
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email address"
            className="
              w-full p-3 rounded-md
              bg-white dark:bg-slate-800
              border border-slate-300 dark:border-slate-600
              text-slate-900 dark:text-white
              transition-colors duration-200
            "
            required
          />

          <input
            type="text"
            placeholder="Organisation (optional)"
            className="
              w-full p-3 rounded-md
              bg-white dark:bg-slate-800
              border border-slate-300 dark:border-slate-600
              text-slate-900 dark:text-white
              transition-colors duration-200
            "
          />

          <input
            type="text"
            placeholder="Estimated number of tests per month"
            className="
              w-full p-3 rounded-md
              bg-white dark:bg-slate-800
              border border-slate-300 dark:border-slate-600
              text-slate-900 dark:text-white
              transition-colors duration-200
            "
          />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-slate-900 dark:text-white">Access type:</label>
            <label className="flex items-center gap-2">
              <input type="radio" name="access" value="non-commercial" required />
              <span className="text-slate-700 dark:text-slate-300">Non-commercial</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="access" value="commercial" required />
              <span className="text-slate-700 dark:text-slate-300">Commercial</span>
            </label>
          </div>

          <textarea
            placeholder="Message (optional) — tell us about your project or use case."
            className="
              w-full p-3 rounded-md
              bg-white dark:bg-slate-800
              border border-slate-300 dark:border-slate-600
              text-slate-900 dark:text-white
              transition-colors duration-200
            "
            rows={4}
          />

          <label className="flex items-center gap-2">
            <input type="checkbox" required />
            <span className="text-slate-700 dark:text-slate-300 text-sm">
              I agree to the Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license.
            </span>
          </label>

          <button
            type="submit"
            className="
              bg-green-600 hover:bg-green-500 text-white
              font-semibold py-3 px-6 rounded-md
              transition-colors duration-200
            "
          >
            Request Access
          </button>
        </form>
      </div>
    </section>
  );
}
