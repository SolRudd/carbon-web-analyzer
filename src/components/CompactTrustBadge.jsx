import React from "react";
import GreenTracerBadge from "./badges/GreenTracerBadge";

export default function CompactTrustBadge({
  href = "",
  label = "",
  className = "",
  ariaLabel = "GreenTracer badge",
}) {
  const status = /pending/i.test(label)
    ? "pending"
    : /licen[cs]e inactive/i.test(label)
      ? "licence_inactive"
      : /mismatch/i.test(label)
      ? "domain_mismatch"
      : /inactive|unavailable|not/i.test(label)
          ? "not_active"
      : "active";

  return (
    <GreenTracerBadge
      href={href}
      status={status}
      badgeType="greentracer_verified"
      label={label && label.startsWith("GreenTracer") ? label : ""}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}
