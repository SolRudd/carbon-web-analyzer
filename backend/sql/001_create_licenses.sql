-- GreenTracer Ticket 1.2: Lean licensing data model
-- Run in Supabase SQL editor (or migration pipeline) before enabling license endpoints.

create extension if not exists "pgcrypto";

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique,
  plan text not null default 'verified_badge_license_annual',
  status text not null default 'inactive',
  license_type text not null default 'paid',
  start_date timestamptz null,
  end_date timestamptz null,
  payment_reference text null,
  issued_token_or_key text not null unique,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint licenses_status_check
    check (status in ('inactive', 'active', 'trial', 'charity', 'partner', 'internal', 'suspended', 'expired')),
  constraint licenses_type_check
    check (license_type in ('paid', 'charity', 'partner', 'trial', 'internal'))
);

create index if not exists licenses_domain_idx on public.licenses (domain);
create index if not exists licenses_token_idx on public.licenses (issued_token_or_key);
create index if not exists licenses_status_idx on public.licenses (status);

