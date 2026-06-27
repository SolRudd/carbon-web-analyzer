-- GreenTracer authenticated dashboard safe setup
-- Run manually in Supabase SQL editor.
--
-- Safety contract:
-- - Additive/idempotent setup for an existing live database.
-- - No destructive table, row, column, sequence, or type operations are used.
-- - Existing scan/report rows and identifiers are preserved.
-- - Keeps the existing backend/service-role architecture. This file does not enable
--   or tighten RLS, because doing so blindly could break existing production flows.

create extension if not exists "pgcrypto";

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  slug text,
  url text,
  normalized_domain text,
  grade text,
  carbon_estimate numeric,
  percentile numeric,
  green_host boolean default false,
  reduction_pct numeric,
  result_data jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  user_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.results
  add column if not exists slug text,
  add column if not exists url text,
  add column if not exists normalized_domain text,
  add column if not exists grade text,
  add column if not exists carbon_estimate numeric,
  add column if not exists percentile numeric,
  add column if not exists green_host boolean default false,
  add column if not exists reduction_pct numeric,
  add column if not exists result_data jsonb default '{}'::jsonb,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists user_id uuid null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists results_slug_idx
  on public.results (slug)
  where slug is not null;

create index if not exists results_url_idx
  on public.results (url);

create index if not exists results_normalized_domain_idx
  on public.results (normalized_domain);

create index if not exists results_user_id_idx
  on public.results (user_id);

create index if not exists results_created_at_idx
  on public.results (created_at desc);

create table if not exists public.account_domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  domain text,
  normalized_domain text,
  status text default 'active',
  badge_public_token text,
  badge_enabled boolean not null default false,
  verification_status text not null default 'pending',
  public_verification_enabled boolean not null default true,
  verified_at timestamptz null,
  latest_co2_per_page numeric null,
  latest_scan_at timestamptz null,
  latest_result_slug text null,
  last_badge_request_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.account_domains
  add column if not exists user_id uuid,
  add column if not exists domain text,
  add column if not exists normalized_domain text,
  add column if not exists status text default 'active',
  add column if not exists badge_public_token text,
  add column if not exists badge_enabled boolean not null default false,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists public_verification_enabled boolean not null default true,
  add column if not exists verified_at timestamptz null,
  add column if not exists latest_co2_per_page numeric null,
  add column if not exists latest_scan_at timestamptz null,
  add column if not exists latest_result_slug text null,
  add column if not exists last_badge_request_at timestamptz null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists account_domains_user_domain_idx
  on public.account_domains (user_id, domain)
  where user_id is not null
    and domain is not null;

create index if not exists account_domains_badge_public_token_idx
  on public.account_domains (badge_public_token)
  where badge_public_token is not null;

create index if not exists account_domains_user_id_idx
  on public.account_domains (user_id);

create index if not exists account_domains_domain_idx
  on public.account_domains (domain);

create index if not exists account_domains_normalized_domain_idx
  on public.account_domains (normalized_domain);

create index if not exists account_domains_status_idx
  on public.account_domains (status);

create index if not exists account_domains_verification_status_idx
  on public.account_domains (verification_status);

create index if not exists account_domains_latest_result_slug_idx
  on public.account_domains (latest_result_slug);

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  domain text,
  normalized_domain text,
  plan text default 'verified_badge_license_annual',
  plan_slug text null,
  status text default 'inactive',
  license_type text default 'paid',
  start_date timestamptz null,
  end_date timestamptz null,
  payment_reference text null,
  issued_token_or_key text default encode(gen_random_bytes(16), 'hex'),
  notes text null,
  badge_public_token text default ('gtb_' || encode(gen_random_bytes(18), 'hex')),
  badge_enabled boolean not null default true,
  verification_status text not null default 'pending',
  is_public_verification_enabled boolean not null default true,
  verified_at timestamptz null,
  latest_co2_per_page numeric null,
  latest_scan_at timestamptz null,
  latest_result_slug text null,
  last_badge_request_at timestamptz null,
  stripe_customer_id text null,
  stripe_subscription_id text null,
  stripe_price_id text null,
  stripe_checkout_session_id text null,
  stripe_subscription_status text null,
  stripe_current_period_start timestamptz null,
  stripe_current_period_end timestamptz null,
  stripe_cancel_at_period_end boolean not null default false,
  stripe_last_event_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.licenses
  add column if not exists user_id uuid null,
  add column if not exists domain text,
  add column if not exists normalized_domain text,
  add column if not exists plan text default 'verified_badge_license_annual',
  add column if not exists plan_slug text null,
  add column if not exists status text default 'inactive',
  add column if not exists license_type text default 'paid',
  add column if not exists start_date timestamptz null,
  add column if not exists end_date timestamptz null,
  add column if not exists payment_reference text null,
  add column if not exists issued_token_or_key text default encode(gen_random_bytes(16), 'hex'),
  add column if not exists notes text null,
  add column if not exists badge_public_token text default ('gtb_' || encode(gen_random_bytes(18), 'hex')),
  add column if not exists badge_enabled boolean not null default true,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists is_public_verification_enabled boolean not null default true,
  add column if not exists verified_at timestamptz null,
  add column if not exists latest_co2_per_page numeric null,
  add column if not exists latest_scan_at timestamptz null,
  add column if not exists latest_result_slug text null,
  add column if not exists last_badge_request_at timestamptz null,
  add column if not exists stripe_customer_id text null,
  add column if not exists stripe_subscription_id text null,
  add column if not exists stripe_price_id text null,
  add column if not exists stripe_checkout_session_id text null,
  add column if not exists stripe_subscription_status text null,
  add column if not exists stripe_current_period_start timestamptz null,
  add column if not exists stripe_current_period_end timestamptz null,
  add column if not exists stripe_cancel_at_period_end boolean not null default false,
  add column if not exists stripe_last_event_id text null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists licenses_token_idx
  on public.licenses (issued_token_or_key)
  where issued_token_or_key is not null;

create index if not exists licenses_badge_public_token_idx
  on public.licenses (badge_public_token)
  where badge_public_token is not null;

create index if not exists licenses_user_id_idx
  on public.licenses (user_id);

create index if not exists licenses_domain_idx
  on public.licenses (domain);

create index if not exists licenses_normalized_domain_idx
  on public.licenses (normalized_domain);

create index if not exists licenses_status_idx
  on public.licenses (status);

create index if not exists licenses_plan_slug_idx
  on public.licenses (plan_slug);

create index if not exists licenses_latest_result_slug_idx
  on public.licenses (latest_result_slug);

create index if not exists licenses_stripe_customer_id_idx
  on public.licenses (stripe_customer_id);

create index if not exists licenses_stripe_subscription_id_idx
  on public.licenses (stripe_subscription_id);

create index if not exists licenses_stripe_checkout_session_id_idx
  on public.licenses (stripe_checkout_session_id);

create table if not exists public.badge_pings (
  id uuid primary key default gen_random_uuid(),
  site_url text not null default '',
  host_domain text not null default '',
  declared_domain text not null default '',
  detected_host text not null default '',
  badge_type text not null default 'greentracer_verified',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  load_count integer not null default 1,
  ping_count integer not null default 1,
  status text not null default 'unknown_domain',
  licence_id uuid null,
  user_id uuid null,
  badge_public_token text not null default '',
  source_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.badge_pings
  add column if not exists site_url text not null default '',
  add column if not exists host_domain text not null default '',
  add column if not exists declared_domain text not null default '',
  add column if not exists detected_host text not null default '',
  add column if not exists badge_type text not null default 'greentracer_verified',
  add column if not exists first_seen_at timestamptz not null default now(),
  add column if not exists last_seen_at timestamptz not null default now(),
  add column if not exists load_count integer not null default 1,
  add column if not exists ping_count integer not null default 1,
  add column if not exists status text not null default 'unknown_domain',
  add column if not exists licence_id uuid null,
  add column if not exists user_id uuid null,
  add column if not exists badge_public_token text not null default '',
  add column if not exists source_url text null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists badge_pings_install_idx
  on public.badge_pings (badge_public_token, declared_domain, detected_host, badge_type);

create index if not exists badge_pings_badge_public_token_idx
  on public.badge_pings (badge_public_token);

create index if not exists badge_pings_declared_domain_idx
  on public.badge_pings (declared_domain);

create index if not exists badge_pings_detected_host_idx
  on public.badge_pings (detected_host);

create index if not exists badge_pings_badge_type_idx
  on public.badge_pings (badge_type);

create index if not exists badge_pings_status_idx
  on public.badge_pings (status);

create index if not exists badge_pings_licence_id_idx
  on public.badge_pings (licence_id);

create index if not exists badge_pings_user_id_idx
  on public.badge_pings (user_id);

create index if not exists badge_pings_created_at_idx
  on public.badge_pings (created_at desc);

create index if not exists badge_pings_last_seen_idx
  on public.badge_pings (last_seen_at desc);

create index if not exists badge_pings_source_url_idx
  on public.badge_pings (source_url);

create or replace function public.greentracer_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists greentracer_results_touch_updated_at on public.results;
create trigger greentracer_results_touch_updated_at
before update on public.results
for each row
execute function public.greentracer_touch_updated_at();

drop trigger if exists greentracer_account_domains_touch_updated_at on public.account_domains;
create trigger greentracer_account_domains_touch_updated_at
before update on public.account_domains
for each row
execute function public.greentracer_touch_updated_at();

drop trigger if exists greentracer_licenses_touch_updated_at on public.licenses;
create trigger greentracer_licenses_touch_updated_at
before update on public.licenses
for each row
execute function public.greentracer_touch_updated_at();

drop trigger if exists greentracer_badge_pings_touch_updated_at on public.badge_pings;
create trigger greentracer_badge_pings_touch_updated_at
before update on public.badge_pings
for each row
execute function public.greentracer_touch_updated_at();

create or replace function public.record_badge_ping(
  p_badge_public_token text,
  p_declared_domain text,
  p_detected_host text,
  p_badge_type text,
  p_status text,
  p_licence_id uuid,
  p_user_id uuid
)
returns void
language plpgsql
as $$
declare
  v_token text := coalesce(nullif(trim(p_badge_public_token), ''), 'no-token');
  v_declared text := coalesce(nullif(trim(p_declared_domain), ''), '');
  v_detected text := coalesce(nullif(trim(p_detected_host), ''), '');
  v_type text := case
    when p_badge_type in ('carbon_tested', 'green_hosting', 'greentracer_verified') then p_badge_type
    when p_badge_type in ('carbon', 'tested') then 'carbon_tested'
    when p_badge_type in ('hosting', 'green_hosting_checked') then 'green_hosting'
    when p_badge_type in ('verified', 'member') then 'greentracer_verified'
    else 'greentracer_verified'
  end;
  v_status text := case
    when p_status in ('active', 'pending', 'badge_missing', 'domain_mismatch', 'licence_inactive', 'unknown_domain', 'unavailable') then p_status
    else 'unavailable'
  end;
begin
  update public.badge_pings
     set last_seen_at = now(),
         updated_at = now(),
         load_count = public.badge_pings.load_count + 1,
         ping_count = public.badge_pings.ping_count + 1,
         status = v_status,
         licence_id = p_licence_id,
         user_id = p_user_id,
         site_url = v_declared,
         host_domain = v_detected
   where badge_public_token = v_token
     and declared_domain = v_declared
     and detected_host = v_detected
     and badge_type = v_type;

  if found then
    return;
  end if;

  insert into public.badge_pings (
    badge_public_token,
    declared_domain,
    detected_host,
    badge_type,
    status,
    licence_id,
    user_id,
    site_url,
    host_domain,
    first_seen_at,
    last_seen_at,
    load_count,
    ping_count,
    updated_at
  )
  values (
    v_token,
    v_declared,
    v_detected,
    v_type,
    v_status,
    p_licence_id,
    p_user_id,
    v_declared,
    v_detected,
    now(),
    now(),
    1,
    1,
    now()
  );
end;
$$;

create or replace function public.increment_badge_ping(p_site_url text, p_host_domain text)
returns void
language sql
as $$
  update public.badge_pings
     set ping_count = ping_count + 1,
         load_count = load_count + 1,
         last_seen_at = now(),
         updated_at = now()
   where site_url = p_site_url
     and host_domain = p_host_domain;
$$;
