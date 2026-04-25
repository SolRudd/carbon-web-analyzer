-- Ticket: Auth + minimal account dashboard foundation
-- Run in Supabase SQL editor before enabling dashboard domain linking endpoints.

create table if not exists public.account_domains (
  id bigserial primary key,
  user_id uuid not null,
  domain text not null,
  created_at timestamptz not null default now(),
  unique (user_id, domain)
);

create index if not exists account_domains_user_id_idx on public.account_domains (user_id);
create index if not exists account_domains_domain_idx on public.account_domains (domain);
