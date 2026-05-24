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
  cornerRadius,
  borderStyle,
  showIcon,
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
      cornerRadius={cornerRadius}
      borderStyle={borderStyle}
      showIcon={showIcon}
      ariaLabel="GreenTracer badge preview"
    />
  );
}
