-- Homepage contact lead capture
-- Additive migration only: stores opted-in emails against scanned domains/results.

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

CREATE INDEX IF NOT EXISTS contact_leads_created_at_idx
  ON public.contact_leads (created_at DESC);
