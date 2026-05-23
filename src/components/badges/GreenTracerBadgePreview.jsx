import React from "react";
import GreenTracerBadge from "./GreenTracerBadge";

export default function GreenTracerBadgePreview({
  status = "active",
  badgeType = "greentracer_verified",
  domain = "example.com",
  href = "",
  valueText = "",
  customColors = null,
  className = "",
}) {
  return (
    <GreenTracerBadge
      status={status}
      badgeType={badgeType}
      domain={domain}
      href={href}
      valueText={valueText}
      customColors={customColors}
      className={className}
      ariaLabel="GreenTracer badge preview"
    />
  );
}
