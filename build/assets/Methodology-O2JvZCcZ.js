import { c as createLucideIcon, j as jsxRuntimeExports, m as motion, Z as Zap, G as Globe, A as ArrowRight } from "./index-B_lJR2hl.js";
/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$3);
/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }]
];
const Calculator = createLucideIcon("calculator", __iconNode$2);
/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
const worldPng = "/assets/world-CfeXAp0Z.png";
const worldWebp = "/assets/world-DN0WbRhh.webp";
const worldAvif = "/assets/world-oRXdI-gT.avif";
function Methodology() {
  const steps = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-8 h-8 text-white group-hover:text-green-200 transition-colors" }),
      title: "Enter Your URL",
      description: "Paste your website URL into our advanced analyzer for an initial scan."
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-8 h-8 text-white group-hover:text-blue-200 transition-colors" }),
      title: "Instant Analysis",
      description: "Get real-time CO₂ calculations, energy consumption, and performance metrics."
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-8 h-8 text-white group-hover:text-purple-200 transition-colors" }),
      title: "Receive Your Grade",
      description: "View your comprehensive sustainability score (A+ to F) with a detailed breakdown."
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "w-8 h-8 text-white group-hover:text-yellow-200 transition-colors" }),
      title: "Optimize & Improve",
      description: "Apply personalized, actionable tips and recommendations for a greener website."
    }
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: steps.length * 0.1 + 0.5 } }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "methodology",
      className: "relative overflow-hidden py-20 px-4 sm:px-6 bg-white dark:bg-slate-950 transition-colors duration-300",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none opacity-20 dark:opacity-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 1.5, ease: "easeOut" },
              className: "absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-3xl animate-pulse-slow"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 1.5, ease: "easeOut", delay: 0.5 },
              className: "absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "text-center mb-16",
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.3 },
              variants: containerVariants,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20 mb-6",
                    variants: itemVariants,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-green-600 dark:text-green-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400 font-semibold text-lg", children: "How It Works" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.h2,
                  {
                    className: "text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6 leading-tight",
                    variants: itemVariants,
                    children: [
                      "How ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400", children: "GreenTrace" }),
                      " Works"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    className: "text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed",
                    variants: itemVariants,
                    children: "Our intuitive system guides you through a few simple steps to accurately measure and significantly reduce your website's digital carbon footprint."
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "space-y-8",
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.3 },
                variants: containerVariants,
                children: [
                  steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "flex items-start gap-6 group", variants: itemVariants, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 group-hover:from-green-600 group-hover:to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105", children: step.icon }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: step.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-1 rounded-full font-medium", children: [
                          "Step ",
                          index + 1
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-slate-600 dark:text-slate-400 leading-relaxed", children: step.description })
                    ] })
                  ] }, index)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: ctaVariants, className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: "#input-form",
                      className: "inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/40 text-xl group",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-6 h-6" }),
                        "Run Your CO₂ Check",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" })
                      ]
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "relative flex justify-center lg:justify-end p-6",
                initial: { opacity: 0, x: 50 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true, amount: 0.3 },
                transition: { duration: 0.8, ease: "easeOut", delay: 0.5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-center justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse opacity-70 dark:opacity-40" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute w-72 h-72 bg-blue-400/15 rounded-full blur-2xl animate-pulse delay-500 opacity-60 dark:opacity-30" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("source", { srcSet: worldAvif, type: "image/avif" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("source", { srcSet: worldWebp, type: "image/webp" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: worldPng,
                          alt: "Diagram showing website analysis workflow",
                          className: "w-full h-auto max-w-sm filter drop-shadow-xl",
                          loading: "lazy",
                          decoding: "async"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-8 left-8 p-3 bg-green-500/80 rounded-full shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8 text-white" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-8 right-8 p-3 bg-blue-500/80 rounded-full shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-8 h-8 text-white" }) })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  Methodology as default
};
