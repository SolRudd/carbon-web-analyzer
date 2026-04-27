import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import GreenTracerBadge from "./badges/GreenTracerBadge";

export default function CarbonBadge({
  data: preData = null,
  token = "",
  resultSlug = "",
  badgeType = "greentracer_verified",
  className = "",
}) {
  const [data, setData] = useState(preData);
  const [loading, setLoading] = useState(Boolean((token || resultSlug) && !preData));
  const [failed, setFailed] = useState(false);
  const publicToken = String(token || "").trim();
  const slug = String(resultSlug || "").trim();
  const type = String(badgeType || "greentracer_verified").trim();

  useEffect(() => {
    if (preData) {
      setData(preData);
      setLoading(false);
      setFailed(false);
      return;
    }

    if (!publicToken && !slug) {
      setData(null);
      setLoading(false);
      setFailed(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setFailed(false);

    const endpoint = slug
      ? `${API_BASE}/api/badge/result/${encodeURIComponent(slug)}/data?type=${encodeURIComponent(type)}`
      : `${API_BASE}/api/badge/${encodeURIComponent(publicToken)}/data`;

    fetch(endpoint, {
      mode: "cors",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setFailed(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [preData, publicToken, slug, type]);

  if (loading) {
    return <GreenTracerBadge status="pending" badgeType={type} className={className} />;
  }

  if (failed || !data) {
    return <GreenTracerBadge status="unavailable" badgeType={type} className={className} />;
  }

  return (
    <GreenTracerBadge
      status={data.publicStatus || "unavailable"}
      badgeType={data.badgeType || type}
      domain={data.domain}
      href={data.reportUrl || data.verificationUrl}
      valueText={data.valueText || ""}
      className={className}
    />
  );
}
