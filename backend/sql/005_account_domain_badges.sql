-- Account-domain owned public badge records
-- Safe additive migration. Do not drop, truncate, or delete existing data.

create extension if not exists "pgcrypto";

alter table public.account_domains
  add column if not exists badge_public_token text,
  add column if not exists badge_enabled boolean not null default false,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists verified_at timestamptz null,
  add column if not exists latest_co2_per_page numeric null,
  add column if not exists latest_scan_at timestamptz null,
  add column if not exists latest_result_slug text null,
  add column if not exists last_badge_request_at timestamptz null,
  add column if not exists public_verification_enabled boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'account_domains_verification_status_check'
       and conrelid = 'public.account_domains'::regclass
  ) then
    alter table public.account_domains
      add constraint account_domains_verification_status_check
      check (verification_status in (
        'pending',
        'needs_review',
        'unverified',
        'verified',
        'approved',
        'active',
        'inactive',
        'disabled',
        'rejected',
        'failed',
        'expired'
      ));
  end if;
end $$;

create unique index if not exists account_domains_badge_public_token_uidx
  on public.account_domains (badge_public_token)
  where badge_public_token is not null;

create index if not exists account_domains_verification_status_idx
  on public.account_domains (verification_status);

create index if not exists account_domains_badge_enabled_idx
  on public.account_domains (badge_enabled);

create index if not exists account_domains_latest_result_slug_idx
  on public.account_domains (latest_result_slug);

create index if not exists account_domains_user_domain_idx
  on public.account_domains (user_id, domain);
