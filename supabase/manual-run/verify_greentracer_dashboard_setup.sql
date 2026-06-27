-- GreenTracer dashboard setup verification
-- SELECT-only checks. Safe to run on production.

select
  'required_tables' as check_name,
  table_name,
  case when table_name is not null then 'present' else 'missing' end as status
from (
  values
    ('results'),
    ('account_domains'),
    ('licenses'),
    ('badge_pings')
) as required(table_name)
where exists (
  select 1
  from information_schema.tables t
  where t.table_schema = 'public'
    and t.table_name = required.table_name
);

select
  'missing_required_tables' as check_name,
  required.table_name
from (
  values
    ('results'),
    ('account_domains'),
    ('licenses'),
    ('badge_pings')
) as required(table_name)
where not exists (
  select 1
  from information_schema.tables t
  where t.table_schema = 'public'
    and t.table_name = required.table_name
);

select
  'required_columns' as check_name,
  required.table_name,
  required.column_name,
  case when c.column_name is null then 'missing' else 'present' end as status,
  c.data_type,
  c.udt_name
from (
  values
    ('results', 'id'),
    ('results', 'slug'),
    ('results', 'url'),
    ('results', 'normalized_domain'),
    ('results', 'grade'),
    ('results', 'carbon_estimate'),
    ('results', 'percentile'),
    ('results', 'green_host'),
    ('results', 'reduction_pct'),
    ('results', 'created_at'),
    ('results', 'updated_at'),
    ('results', 'user_id'),
    ('results', 'metadata'),
    ('account_domains', 'id'),
    ('account_domains', 'user_id'),
    ('account_domains', 'domain'),
    ('account_domains', 'normalized_domain'),
    ('account_domains', 'status'),
    ('account_domains', 'badge_public_token'),
    ('account_domains', 'badge_enabled'),
    ('account_domains', 'verification_status'),
    ('account_domains', 'public_verification_enabled'),
    ('account_domains', 'latest_co2_per_page'),
    ('account_domains', 'latest_scan_at'),
    ('account_domains', 'latest_result_slug'),
    ('account_domains', 'created_at'),
    ('account_domains', 'updated_at'),
    ('licenses', 'id'),
    ('licenses', 'user_id'),
    ('licenses', 'domain'),
    ('licenses', 'normalized_domain'),
    ('licenses', 'status'),
    ('licenses', 'license_type'),
    ('licenses', 'stripe_customer_id'),
    ('licenses', 'stripe_subscription_id'),
    ('licenses', 'stripe_subscription_status'),
    ('licenses', 'stripe_current_period_end'),
    ('licenses', 'stripe_cancel_at_period_end'),
    ('licenses', 'start_date'),
    ('licenses', 'end_date'),
    ('licenses', 'created_at'),
    ('licenses', 'updated_at'),
    ('badge_pings', 'id'),
    ('badge_pings', 'badge_type'),
    ('badge_pings', 'badge_public_token'),
    ('badge_pings', 'declared_domain'),
    ('badge_pings', 'detected_host'),
    ('badge_pings', 'site_url'),
    ('badge_pings', 'host_domain'),
    ('badge_pings', 'source_url'),
    ('badge_pings', 'status'),
    ('badge_pings', 'first_seen_at'),
    ('badge_pings', 'last_seen_at'),
    ('badge_pings', 'load_count'),
    ('badge_pings', 'ping_count'),
    ('badge_pings', 'created_at'),
    ('badge_pings', 'updated_at')
) as required(table_name, column_name)
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = required.table_name
 and c.column_name = required.column_name
order by required.table_name, required.column_name;

select
  'required_indexes' as check_name,
  required.index_name,
  case when i.indexname is null then 'missing' else 'present' end as status,
  i.tablename,
  i.indexdef
from (
  values
    ('results_slug_idx'),
    ('results_created_at_idx'),
    ('results_normalized_domain_idx'),
    ('account_domains_user_domain_idx'),
    ('account_domains_user_id_idx'),
    ('account_domains_domain_idx'),
    ('account_domains_normalized_domain_idx'),
    ('licenses_domain_idx'),
    ('licenses_status_idx'),
    ('licenses_user_id_idx'),
    ('licenses_stripe_customer_id_idx'),
    ('licenses_stripe_subscription_id_idx'),
    ('badge_pings_install_idx'),
    ('badge_pings_badge_public_token_idx'),
    ('badge_pings_badge_type_idx'),
    ('badge_pings_last_seen_idx')
) as required(index_name)
left join pg_indexes i
  on i.schemaname = 'public'
 and i.indexname = required.index_name
order by required.index_name;

select
  'row_counts' as check_name,
  'results' as table_name,
  count(*)::bigint as row_count
from public.results
union all
select
  'row_counts' as check_name,
  'account_domains' as table_name,
  count(*)::bigint as row_count
from public.account_domains
union all
select
  'row_counts' as check_name,
  'licenses' as table_name,
  count(*)::bigint as row_count
from public.licenses
union all
select
  'row_counts' as check_name,
  'badge_pings' as table_name,
  count(*)::bigint as row_count
from public.badge_pings;

select
  'rls_status' as check_name,
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('results', 'account_domains', 'licenses', 'badge_pings')
  and c.relkind = 'r'
order by c.relname;

select
  'functions' as check_name,
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('record_badge_ping', 'increment_badge_ping', 'greentracer_touch_updated_at')
order by p.proname;

select
  'trigger_status' as check_name,
  event_object_table as table_name,
  trigger_name,
  action_timing,
  event_manipulation
from information_schema.triggers
where trigger_schema = 'public'
  and trigger_name in (
    'greentracer_results_touch_updated_at',
    'greentracer_account_domains_touch_updated_at',
    'greentracer_licenses_touch_updated_at',
    'greentracer_badge_pings_touch_updated_at'
  )
order by event_object_table, trigger_name;
