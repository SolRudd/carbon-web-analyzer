-- Hardened GreenTracer badge install tracking
-- Additive migration over the older badge_pings table.

create table if not exists public.badge_pings (
  id bigserial primary key,
  site_url text not null default '',
  host_domain text not null default '',
  badge_type text not null default 'greentracer_verified',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  ping_count integer not null default 1
);

alter table public.badge_pings
  add column if not exists declared_domain text not null default '',
  add column if not exists detected_host text not null default '',
  add column if not exists load_count integer not null default 1,
  add column if not exists status text not null default 'unknown_domain',
  add column if not exists licence_id uuid null,
  add column if not exists user_id uuid null,
  add column if not exists badge_public_token text not null default '',
  add column if not exists updated_at timestamptz not null default now();

alter table public.badge_pings
  alter column badge_type set default 'greentracer_verified',
  alter column status set default 'unknown_domain';

alter table public.badge_pings
  drop constraint if exists badge_pings_type_check,
  drop constraint if exists badge_pings_status_check;

update public.badge_pings
   set badge_type = case
         when badge_type in ('carbon_tested', 'green_hosting', 'greentracer_verified') then badge_type
         when badge_type in ('carbon', 'tested') then 'carbon_tested'
         when badge_type in ('hosting', 'green_hosting_checked') then 'green_hosting'
         when badge_type in ('verified', 'member') then 'greentracer_verified'
         else 'greentracer_verified'
       end,
       status = case
         when status in ('active', 'pending', 'badge_missing', 'domain_mismatch', 'licence_inactive', 'unknown_domain', 'unavailable') then status
         when status in ('verified', 'connected') then 'active'
         when status in ('inactive', 'not_verified', 'disabled') then 'licence_inactive'
         else 'unknown_domain'
       end,
       declared_domain = coalesce(nullif(declared_domain, ''), site_url, ''),
       detected_host = coalesce(nullif(detected_host, ''), host_domain, ''),
       load_count = greatest(coalesce(load_count, 1), coalesce(ping_count, 1)),
       badge_public_token = coalesce(nullif(badge_public_token, ''), 'legacy:' || id::text),
       updated_at = now()
 where declared_domain = ''
    or detected_host = ''
    or badge_public_token = ''
    or load_count < ping_count
    or badge_type not in ('carbon_tested', 'green_hosting', 'greentracer_verified')
    or status not in ('active', 'pending', 'badge_missing', 'domain_mismatch', 'licence_inactive', 'unknown_domain', 'unavailable');

alter table public.badge_pings
  add constraint badge_pings_status_check
  check (status in (
    'active',
    'pending',
    'badge_missing',
    'domain_mismatch',
    'licence_inactive',
    'unknown_domain',
    'unavailable'
  ));

alter table public.badge_pings
  add constraint badge_pings_type_check
  check (badge_type in ('carbon_tested', 'green_hosting', 'greentracer_verified'));

create unique index if not exists badge_pings_install_uidx
  on public.badge_pings (badge_public_token, declared_domain, detected_host, badge_type);

create index if not exists badge_pings_declared_domain_idx
  on public.badge_pings (declared_domain);

create index if not exists badge_pings_detected_host_idx
  on public.badge_pings (detected_host);

create index if not exists badge_pings_status_idx
  on public.badge_pings (status);

create index if not exists badge_pings_licence_id_idx
  on public.badge_pings (licence_id);

create index if not exists badge_pings_user_id_idx
  on public.badge_pings (user_id);

create index if not exists badge_pings_badge_public_token_idx
  on public.badge_pings (badge_public_token);

create index if not exists badge_pings_last_seen_idx
  on public.badge_pings (last_seen_at desc);

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
