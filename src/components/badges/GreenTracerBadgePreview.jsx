import React from "react";
import GreenTracerBadge from "./GreenTracerBadge";

export default function GreenTracerBadgePreview({
  variant = "compact",
  status = "verified",
  metric = 0.21,
  metricText = "",
  domain = "example.com",
  showMetric = true,
  href = "",
  className = "",
}) {
  return (
    <GreenTracerBadge
      variant={variant}
      status={status}
      metric={metric}
      metricText={metricText}
      domain={domain}
      href={href}
      showMetric={showMetric}
      className={className}
      ariaLabel="GreenTracer verification badge preview"
    />
  );
}
