import React from "react";
import GreenTracerBadge from "./badges/GreenTracerBadge";

export default function CompactTrustBadge({
  href = "",
  label = "",
  value = "",
  className = "",
  ariaLabel = "GreenTracer badge",
}) {
  const status = /pending/i.test(label)
    ? "pending"
    : /inactive|unavailable|not/i.test(label)
      ? "inactive"
      : "verified";

  return (
    <GreenTracerBadge
      href={href}
      status={status}
      label={label && label.startsWith("GreenTracer") ? label : ""}
      metricText={value}
      showMetric={Boolean(value)}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}
