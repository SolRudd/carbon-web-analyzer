-- Badge install tracking table
-- Records which websites have the GreenTracer badge embedded
-- One row per (site_url, host_domain) pair, updated on each ping

CREATE TABLE IF NOT EXISTS badge_pings (
  id               BIGSERIAL PRIMARY KEY,
  site_url         TEXT NOT NULL,
  host_domain      TEXT NOT NULL DEFAULT '',
  badge_type       TEXT NOT NULL DEFAULT 'carbon',
  first_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ping_count       INTEGER NOT NULL DEFAULT 1
);

-- Unique install tracking: one row per site + host combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_badge_pings_unique
  ON badge_pings (site_url, host_domain);

-- For querying all badges installed on a given host domain
CREATE INDEX IF NOT EXISTS idx_badge_pings_host_domain
  ON badge_pings (host_domain);

-- For querying all hosts displaying a specific site's badge
CREATE INDEX IF NOT EXISTS idx_badge_pings_site_url
  ON badge_pings (site_url);

-- For admin dashboard: most recently active badges
CREATE INDEX IF NOT EXISTS idx_badge_pings_last_seen
  ON badge_pings (last_seen_at DESC);

-- RPC helper used by the backend to atomically increment ping_count
CREATE OR REPLACE FUNCTION increment_badge_ping(p_site_url TEXT, p_host_domain TEXT)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE badge_pings
     SET ping_count   = ping_count + 1,
         last_seen_at = NOW()
   WHERE site_url    = p_site_url
     AND host_domain = p_host_domain;
$$;
