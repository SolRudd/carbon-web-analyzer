import React from "react";

export default function GradeBadge({ grade }) {
  const colorMap = {
    "A+": "bg-green-400",
    A:   "bg-green-500",
    B:   "bg-lime-400",
    C:   "bg-yellow-400",
    D:   "bg-orange-500",
    E:   "bg-red-400",
    F:   "bg-red-600",
  };
  const bgColor = colorMap[grade] || "bg-gray-400";

  return (
    <div
      className={`
        mx-auto mb-6           /* center + space below on mobile */
        w-20 h-20              /* base size */
        rounded-full           /* circle */
        ${bgColor}             /* grade color */
        text-white
        shadow-lg
        flex items-center justify-center
        text-3xl font-extrabold

        sm:absolute            /* on sm+ pin absolutely */
        sm:top-6 sm:left-6
        sm:mx-0 sm:mb-0
        sm:w-24 sm:h-24         /* larger on desktop */
        sm:text-4xl
      `}
    >
      {grade}
    </div>
  );
}
