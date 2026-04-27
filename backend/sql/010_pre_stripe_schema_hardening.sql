-- GreenTracer pre-Stripe schema hardening
-- Safe additive migration. No table drops, truncates, deletes, or data resets.
-- Purpose: make the core scan, badge, licence, account-domain, and install
-- tracking assumptions true even when earlier migrations were applied partially.

create extension if not exists "pgcrypto";

create table if not exists public.results (
  id bigserial primary key,
  slug text,
  url text,
  green_host boolean default false,
  carbon_estimate numeric default 0,
  percentile numeric default 0,
  reduction_pct numeric default 0,
  grade text null,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.results
  add column if not exists slug text,
  add column if not exists url text,
  add column if not exists green_host boolean default false,
  add column if not exists carbon_estimate numeric default 0,
  add column if not exists percentile numeric default 0,
  add column if not exists reduction_pct numeric default 0,
  add column if not exists grade text null,
  add column if not exists result_data jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists results_slug_uidx
  on public.results (slug)
  where slug is not null;

create index if not exists results_created_at_idx
  on public.results (created_at desc);

alter table public.results enable row level security;

create table if not exists public.contact_leads (
  id bigserial primary key,
  email text,
  domain text,
  site_url text,
  source text default 'homepage_hero',
  consent_to_contact boolean default true,
  result_slug text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_leads
  add column if not exists email text,
  add column if not exists domain text,
  add column if not exists site_url text,
  add column if not exists source text default 'homepage_hero',
  add column if not exists consent_to_contact boolean default true,
  add column if not exists result_slug text null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists contact_leads_email_domain_source_uidx
  on public.contact_leads (email, domain, source)
  where email is not null
    and domain is not null
    and source is not null;

create index if not exists contact_leads_domain_idx
  on public.contact_leads (domain);

create index if not exists contact_leads_result_slug_idx
  on public.contact_leads (result_slug);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads (created_at desc);

alter table public.contact_leads enable row level security;

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  domain text,
  plan text default 'verified_badge_license_annual',
  status text default 'inactive',
  license_type text default 'paid',
  start_date timestamptz null,
  end_date timestamptz null,
  payment_reference text null,
  issued_token_or_key text default encode(gen_random_bytes(16), 'hex'),
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.licenses
  add column if not exists domain text,
  add column if not exists plan text default 'verified_badge_license_annual',
  add column if not exists status text default 'inactive',
  add column if not exists license_type text default 'paid',
  add column if not exists start_date timestamptz null,
  add column if not exists end_date timestamptz null,
  add column if not exists payment_reference text null,
  add column if not exists issued_token_or_key text default encode(gen_random_bytes(16), 'hex'),
  add column if not exists notes text null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists badge_public_token text,
  add column if not exists badge_enabled boolean not null default true,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists is_public_verification_enabled boolean not null default true,
  add column if not exists verified_at timestamptz null,
  add column if not exists latest_co2_per_page numeric null,
  add column if not exists latest_scan_at timestamptz null,
  add column if not exists latest_result_slug text null,
  add column if not exists last_badge_request_at timestamptz null,
  add column if not exists plan_slug text null,
  add column if not exists stripe_customer_id text null,
  add column if not exists stripe_subscription_id text null,
  add column if not exists stripe_price_id text null,
  add column if not exists stripe_checkout_session_id text null,
  add column if not exists stripe_subscription_status text null,
  add column if not exists stripe_current_period_start timestamptz null,
  add column if not exists stripe_current_period_end timestamptz null,
  add column if not exists stripe_cancel_at_period_end boolean not null default false,
  add column if not exists stripe_last_event_id text null;

alter table public.licenses
  alter column issued_token_or_key set default encode(gen_random_bytes(16), 'hex'),
  alter column badge_public_token set default ('gtb_' || encode(gen_random_bytes(18), 'hex'));

update public.licenses
   set issued_token_or_key = encode(gen_random_bytes(16), 'hex')
 where issued_token_or_key is null;

update public.licenses
   set badge_public_token = 'gtb_' || encode(gen_random_bytes(18), 'hex')
 where badge_public_token is null;

create unique index if not exists licenses_domain_uidx
  on public.licenses (domain)
  where domain is not null;

create unique index if not exists licenses_token_uidx
  on public.licenses (issued_token_or_key)
  where issued_token_or_key is not null;

create unique index if not exists licenses_badge_public_token_uidx
  on public.licenses (badge_public_token)
  where badge_public_token is not null;

create index if not exists licenses_status_idx
  on public.licenses (status);

create index if not exists licenses_plan_slug_idx
  on public.licenses (plan_slug);

create index if not exists licenses_stripe_customer_id_idx
  on public.licenses (stripe_customer_id);

create index if not exists licenses_stripe_subscription_id_idx
  on public.licenses (stripe_subscription_id);

create index if not exists licenses_stripe_checkout_session_id_idx
  on public.licenses (stripe_checkout_session_id);

create index if not exists licenses_latest_result_slug_idx
  on public.licenses (latest_result_slug);

alter table public.licenses enable row level security;

create table if not exists public.account_domains (
  id bigserial primary key,
  user_id uuid,
  domain text,
  created_at timestamptz not null default now()
);

alter table public.account_domains
  add column if not exists user_id uuid,
  add column if not exists domain text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists badge_public_token text,
  add column if not exists badge_enabled boolean not null default false,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists verified_at timestamptz null,
  add column if not exists latest_co2_per_page numeric null,
  add column if not exists latest_scan_at timestamptz null,
  add column if not exists latest_result_slug text null,
  add column if not exists last_badge_request_at timestamptz null,
  add column if not exists public_verification_enabled boolean not null default true;

create unique index if not exists account_domains_user_domain_uidx
  on public.account_domains (user_id, domain)
  where user_id is not null
    and domain is not null;

create unique index if not exists account_domains_badge_public_token_uidx
  on public.account_domains (badge_public_token)
  where badge_public_token is not null;

create index if not exists account_domains_domain_idx
  on public.account_domains (domain);

create index if not exists account_domains_user_id_idx
  on public.account_domains (user_id);

create index if not exists account_domains_latest_result_slug_idx
  on public.account_domains (latest_result_slug);

alter table public.account_domains enable row level security;

create table if not exists public.badge_pings (
  id bigserial primary key,
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
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists badge_pings_install_uidx
  on public.badge_pings (badge_public_token, declared_domain, detected_host, badge_type);

create index if not exists badge_pings_declared_domain_idx
  on public.badge_pings (declared_domain);

create index if not exists badge_pings_detected_host_idx
  on public.badge_pings (detected_host);

create index if not exists badge_pings_badge_type_idx
  on public.badge_pings (badge_type);

create index if not exists badge_pings_status_idx
  on public.badge_pings (status);

create index if not exists badge_pings_last_seen_idx
  on public.badge_pings (last_seen_at desc);

create index if not exists badge_pings_badge_public_token_idx
  on public.badge_pings (badge_public_token);

alter table public.badge_pings enable row level security;

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
  )
  on conflict (badge_public_token, declared_domain, detected_host, badge_type)
  do update
     set last_seen_at = now(),
         updated_at = now(),
         load_count = public.badge_pings.load_count + 1,
         ping_count = public.badge_pings.ping_count + 1,
         status = excluded.status,
         licence_id = excluded.licence_id,
         user_id = excluded.user_id,
         site_url = excluded.site_url,
         host_domain = excluded.host_domain;
end;
$$;
