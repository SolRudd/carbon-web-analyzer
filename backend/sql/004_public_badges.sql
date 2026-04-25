-- Public GreenTracer verification badges
-- Additive migration: extends licenses into the source of truth for public badge state.

create extension if not exists "pgcrypto";

alter table public.licenses
  add column if not exists badge_public_token text,
  add column if not exists badge_enabled boolean not null default true,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists is_public_verification_enabled boolean not null default true,
  add column if not exists verified_at timestamptz null,
  add column if not exists latest_co2_per_page numeric null,
  add column if not exists latest_scan_at timestamptz null,
  add column if not exists latest_result_slug text null,
  add column if not exists last_badge_request_at timestamptz null;

update public.licenses
   set badge_public_token = encode(gen_random_bytes(16), 'hex')
 where badge_public_token is null;

alter table public.licenses
  alter column badge_public_token set default encode(gen_random_bytes(16), 'hex');

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'licenses_verification_status_check'
       and conrelid = 'public.licenses'::regclass
  ) then
    alter table public.licenses
      add constraint licenses_verification_status_check
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

create unique index if not exists licenses_badge_public_token_uidx
  on public.licenses (badge_public_token)
  where badge_public_token is not null;

create index if not exists licenses_badge_enabled_idx
  on public.licenses (badge_enabled);

create index if not exists licenses_verification_status_idx
  on public.licenses (verification_status);

create index if not exists licenses_latest_result_slug_idx
  on public.licenses (latest_result_slug);
