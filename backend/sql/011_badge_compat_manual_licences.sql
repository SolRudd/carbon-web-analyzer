-- GreenTracer badge compatibility and manual licence support.
-- Safe additive migration. No table drops, truncates, deletes, or data resets.

alter table if exists public.badge_pings
  add column if not exists source_url text null;

create index if not exists badge_pings_source_url_idx
  on public.badge_pings (source_url);

alter table if exists public.licenses
  drop constraint if exists licenses_type_check;

alter table if exists public.licenses
  add constraint licenses_type_check
  check (license_type in (
    'paid',
    'charity',
    'partner',
    'trial',
    'internal',
    'non_profit',
    'nonprofit',
    'community',
    'manual_lifetime'
  ));

alter table if exists public.licenses
  drop constraint if exists licenses_status_check;

alter table if exists public.licenses
  add constraint licenses_status_check
  check (status in (
    'inactive',
    'active',
    'trial',
    'charity',
    'partner',
    'internal',
    'suspended',
    'expired',
    'non_profit',
    'nonprofit',
    'community',
    'manual_lifetime'
  ));
