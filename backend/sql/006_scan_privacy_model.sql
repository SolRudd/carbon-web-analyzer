-- Scan privacy and public result access model
-- Safe additive migration. No table drops, truncates, deletes, or data resets.

CREATE TABLE IF NOT EXISTS public.results (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  url TEXT NOT NULL,
  green_host BOOLEAN NOT NULL DEFAULT FALSE,
  carbon_estimate NUMERIC NOT NULL DEFAULT 0,
  percentile NUMERIC NOT NULL DEFAULT 0,
  reduction_pct NUMERIC NOT NULL DEFAULT 0,
  grade TEXT NULL,
  result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.results
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS green_host BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS carbon_estimate NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS percentile NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reduction_pct NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grade TEXT NULL,
  ADD COLUMN IF NOT EXISTS result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS results_slug_uidx
  ON public.results (slug);

CREATE TABLE IF NOT EXISTS public.contact_leads (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  domain TEXT NOT NULL,
  site_url TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'homepage_hero',
  consent_to_contact BOOLEAN NOT NULL DEFAULT TRUE,
  result_slug TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT contact_leads_email_domain_source_unique UNIQUE (email, domain, source)
);

CREATE INDEX IF NOT EXISTS contact_leads_domain_idx
  ON public.contact_leads (domain);

CREATE INDEX IF NOT EXISTS contact_leads_email_idx
  ON public.contact_leads (email);

CREATE INDEX IF NOT EXISTS contact_leads_result_slug_idx
  ON public.contact_leads (result_slug);

CREATE INDEX IF NOT EXISTS contact_leads_created_at_idx
  ON public.contact_leads (created_at DESC);

ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS results_slug_idx
  ON public.results (slug);

CREATE INDEX IF NOT EXISTS results_created_at_idx
  ON public.results (created_at DESC);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Policy cleanup plan after backend routes are confirmed in production:
-- 1. Keep public scans writing through POST /api/check-carbon with SUPABASE_SERVICE_ROLE_KEY.
-- 2. Keep public result reads through GET /api/results/:slug.
-- 3. Inspect existing policies:
--      select policyname, cmd, roles, qual, with_check
--      from pg_policies
--      where schemaname = 'public'
--        and tablename = 'results';
-- 4. Drop only known broad anon policies by exact name, for example:
--      drop policy if exists "Allow public result reads" on public.results;
--      drop policy if exists "Allow public result inserts" on public.results;
--      drop policy if exists "Allow public result updates" on public.results;
-- 5. Add account-scoped authenticated policies later only when dashboard ownership is wired.
