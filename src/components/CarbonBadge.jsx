import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, RESULTS_BASE } from "../config";
import GreenTracerBadge from "./badges/GreenTracerBadge";
import { formatCo2PerPage } from "../lib/badges/formatters";

const RESULTS_PATH = "/result";

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol + "//" + u.hostname + u.pathname.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function slugifyFromUrl(url) {
  try {
    const u = new URL(url);
    return (u.hostname + u.pathname).replace(/\/$/, "").replace(/[^a-z0-9]/gi, "-").toLowerCase();
  } catch {
    return "";
  }
}

export default function CarbonBadge({
  url,
  data: preData = null,
  token = "",
  variant = "compact",
  className = "",
}) {
  const [data, setData] = useState(preData);
  const [loading, setLoading] = useState(Boolean(!preData));
  const [failed, setFailed] = useState(false);
  const target = useMemo(() => normalizeUrl(url), [url]);
  const publicToken = String(token || "").trim();

  useEffect(() => {
    if (preData) {
      setData(preData);
      setLoading(false);
      setFailed(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setFailed(false);

    const endpoint = publicToken
      ? `${API_BASE}/api/badge/${encodeURIComponent(publicToken)}/data`
      : target
        ? `${API_BASE}/api/trace-or-check?site=${encodeURIComponent(target)}`
        : "";

    if (!endpoint) {
      setLoading(false);
      setFailed(true);
      return () => controller.abort();
    }

    fetch(endpoint, { mode: "cors", signal: controller.signal })
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
  }, [preData, publicToken, target]);

  if (loading) {
    return <GreenTracerBadge variant={variant} status="pending" showMetric={false} className={className} />;
  }

  if (failed || !data) {
    return <GreenTracerBadge variant={variant} status="unavailable" showMetric={false} className={className} />;
  }

  if (publicToken || data.publicStatus) {
    return (
      <GreenTracerBadge
        variant={variant}
        status={data.publicStatus || "unavailable"}
        metric={data.metric}
        metricText={data.metricText}
        domain={data.domain}
        href={data.verificationUrl}
        showMetric={data.showMetric}
        className={className}
      />
    );
  }

  const metric = Number(data.carbonEstimate || 0);
  const slug = data.slug || slugifyFromUrl(target);
  const href = slug ? `${RESULTS_BASE}${RESULTS_PATH}/${encodeURIComponent(slug)}` : "";

  return (
    <GreenTracerBadge
      variant={variant}
      status="verified"
      metric={metric}
      metricText={formatCo2PerPage(metric)}
      href={href}
      showMetric
      className={className}
    />
  );
}
