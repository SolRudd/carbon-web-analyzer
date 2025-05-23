import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LightBulbIcon } from "@heroicons/react/24/outline";

const chartData = [
  { grade: "A+", value: 0.095, label: "Ultra-Efficient" },
  { grade: "A",  value: 0.186, label: "Efficient" },
  { grade: "B",  value: 0.341, label: "Good" },
  { grade: "C",  value: 0.493, label: "Average" },
  { grade: "D",  value: 0.656, label: "Below Average" },
  { grade: "E",  value: 0.846, label: "Less Efficient" },
  { grade: "F",  value: 1.0,   label: "Above Global Average" },
];

const gradeColors = {
  "A+": "#22c55e",
  "A":  "#4ade80",
  "B":  "#facc15",
  "C":  "#facc15",
  "D":  "#f97316",
  "E":  "#f97316",
  "F":  "#ef4444",
};

// Hook: watches Tailwind's dark mode and updates in real time
function useTailwindDark() {
  const [dark, setDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setDark(html.classList.contains("dark"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export default function RatingPage() {
  const isDark = useTailwindDark();
  const tickColor = isDark ? "#fff" : "#334155"; // switches with mode

  return (
    <main className="
      min-h-screen
      bg-white text-slate-900
      dark:bg-slate-900 dark:text-white
      transition-colors duration-300
    ">
      <header className="
        px-4 py-6 border-b border-slate-200
        dark:border-slate-700
      ">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-end">
          <div className="flex-1 flex items-center w-full md:w-auto">
            <Link to="/" className="text-greenbuzz hover:underline flex items-center gap-1">
              <LightBulbIcon className="h-5 w-5" aria-hidden="true" /> Back to Calculator
            </Link>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-xl md:text-3xl font-extrabold">
              GreenTracer Carbon Rating System
            </h1>
            <p className="mt-1 text-greenbuzz font-semibold text-sm md:text-base">
              by{" "}
              <a
                href="https://buzzboost.co.uk"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                BuzzBoost Digital
              </a>
            </p>
          </div>
          <div className="flex-1"></div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Intro Section */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed">
            The web is responsible for <strong>2–4% of global CO₂ emissions</strong>—as much as aviation.
            <strong> GreenTracer</strong> is a free tool from{" "}
            <a
              href="https://buzzboost.co.uk"
              className="text-greenbuzz hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BuzzBoost Digital
            </a>
            {" "}that rates your website’s carbon impact using a simple A+ to F grade.
          </p>
          <p className="text-lg leading-relaxed">
            Our system translates grams of CO₂ per page view into clear grades: <strong>A+</strong> means ultra-efficient, <strong>F</strong> means above the global average. Lower emissions, better rating.
          </p>
        </section>

        {/* How It Works */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <p className="mt-2 leading-relaxed">
            We benchmark your site against the <strong>global average for desktop web pages</strong>. Grades A+ to E mean you’re ahead of the curve—F means you’re above the worldwide average (time to optimise!).
          </p>
        </section>

        {/* Rating Scale Table + Chart */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The GreenTracer Carbon Rating Scale</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 dark:border-slate-600">
                  <th className="py-2 pr-4 font-semibold">Grade</th>
                  <th className="py-2 pr-4 font-semibold">Max g CO₂/view</th>
                  <th className="py-2 font-semibold">Efficiency Level</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map(({ grade, value, label }) => (
                  <tr key={grade} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 pr-4 font-medium" style={{ color: gradeColors[grade] }}>{grade}</td>
                    <td className="py-2 pr-4">
                      {grade !== "F"
                        ? `≤ ${value.toFixed(3)}`
                        : "≥ 0.847"
                      }
                    </td>
                    <td className="py-2">{label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            * All values are grams of CO₂ equivalent per page view.
          </p>

          {/* Bar Chart Section */}
          <div className="
            bg-slate-100 dark:bg-slate-800
            p-6 rounded-md shadow-md
            transition-colors duration-300
          ">
            <h3
              className="text-xl font-semibold mb-4 text-center"
              style={{ color: tickColor }}
            >
              Visualising the Rating Scale
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 15, right: 30, left: 20, bottom: 40 }}>
                <XAxis
                  dataKey="grade"
                  tick={{ fill: tickColor, fontSize: 16, fontWeight: 700 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: tickColor, fontSize: 13 }}
                  axisLine={false}
                  label={{
                    value: "g CO₂e/view",
                    angle: -90,
                    position: "insideLeft",
                    fill: tickColor,
                    offset: -5,
                    fontSize: 13,
                  }}
                />
                <Tooltip
                  formatter={(value, _, { payload }) => [
                    `${value.toFixed(3)} g CO₂e`,
                    `Grade ${payload.grade}`,
                  ]}
                  contentStyle={{
                    backgroundColor: "#020f1e",
                    color: "#fff",
                    border: "1px solid #00c471",
                  }}
                  itemStyle={{ color: "#00c471" }}
                  labelStyle={{ color: "#fff" }}
                  cursor={{ fill: "#00c47122" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.grade} fill={gradeColors[entry.grade]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Each bar shows the highest CO₂e allowed for that grade.
            </p>
          </div>
        </section>

        {/* Discover Your Grade */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Discover Your Website's Grade</h2>
          <p className="leading-relaxed">
            Already checked your site? Click “Re-test” on your results to see your new <strong>GreenTracer</strong> rating.
            Need to lower your emissions?{" "}
            <a
              href="https://buzzboost.co.uk"
              className="text-greenbuzz hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BuzzBoost Digital
            </a>{" "}
            offers expert web optimisation.
          </p>
          <Link
            to="/#input-form"
            className="inline-block bg-greenbuzz px-6 py-3 rounded-md font-semibold text-white hover:bg-greenbuzz-light transition-transform hover:scale-105 mt-2"
          >
            Run a CO₂ Check & Get Your Grade
          </Link>
        </section>

        {/* Why It Matters */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why It Matters</h2>
          <p className="leading-relaxed">
            The web’s energy use is still growing—and so is its carbon footprint. The GreenTracer system, built by{" "}
            <a
              href="https://buzzboost.co.uk"
              className="text-greenbuzz hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BuzzBoost Digital
            </a>
            , helps you spot and reduce your digital impact.
          </p>
        </section>

        {/* Join the Movement */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Join the Movement</h2>
            <p className="leading-relaxed">
              Help us build a greener internet.{" "}
              <Link to="/#input-form" className="text-greenbuzz hover:underline">Test your site</Link>,
              share your grade, and grab sustainability tips on our{" "}
              <Link to="/blog" className="text-greenbuzz hover:underline">blog</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Thank You</h3>
            <p className="leading-relaxed">
              Cheers to everyone working toward a more sustainable web.<br />
              <span className="text-greenbuzz font-semibold">Built and maintained by <a href="https://buzzboost.co.uk" className="hover:underline" target="_blank" rel="noopener noreferrer">BuzzBoost Digital</a>.</span>
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
