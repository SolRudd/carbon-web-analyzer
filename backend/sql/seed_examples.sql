-- GreenTracer local seed examples.
-- Safe to run after the current migrations. Uses upserts only.
-- Do not paste production secrets here.

insert into public.licenses (
  domain,
  plan,
  plan_slug,
  status,
  license_type,
  start_date,
  end_date,
  payment_reference,
  issued_token_or_key,
  notes,
  badge_public_token,
  badge_enabled,
  verification_status,
  is_public_verification_enabled,
  verified_at,
  latest_co2_per_page,
  latest_scan_at,
  latest_result_slug,
  updated_at
) values
  (
    'buzzboost.co.uk',
    'manual_active_verified',
    'starter-yearly',
    'active',
    'internal',
    now(),
    null,
    'manual:local:buzzboost-active',
    'manual_license_buzzboost_active',
    'Local seed: manual active verified licence.',
    'gtb_buzzboost_manual_active_2026',
    true,
    'verified',
    true,
    now(),
    0.64,
    now(),
    'sample-public-result-buzzboost-no-green',
    now()
  ),
  (
    'greentracer.app',
    'manual_lifetime_verified',
    'agency-yearly',
    'active',
    'internal',
    now(),
    null,
    'manual:local:greentracer-lifetime',
    'manual_license_greentracer_lifetime',
    'Local seed: manual lifetime verified licence.',
    'gtb_greentracer_manual_lifetime_2026',
    true,
    'verified',
    true,
    now(),
    0.18,
    now(),
    'sample-public-result-greentracer-app',
    now()
  ),
  (
    'expired.greentracer.test',
    'manual_expired_verified',
    'starter-monthly',
    'expired',
    'trial',
    now() - interval '60 days',
    now() - interval '1 day',
    'manual:local:expired',
    'manual_license_expired_example',
    'Local seed: expired licence.',
    'gtb_expired_manual_example_2026',
    true,
    'verified',
    true,
    now() - interval '60 days',
    null,
    now() - interval '60 days',
    null,
    now()
  ),
  (
    'suspended.greentracer.test',
    'manual_suspended_verified',
    'agency-monthly',
    'suspended',
    'paid',
    now() - interval '30 days',
    now() + interval '335 days',
    'manual:local:suspended',
    'manual_license_suspended_example',
    'Local seed: suspended licence.',
    'gtb_suspended_manual_example_2026',
    true,
    'verified',
    true,
    now() - interval '30 days',
    null,
    now() - interval '30 days',
    null,
    now()
  )
on conflict (domain) do update
   set plan = excluded.plan,
       plan_slug = excluded.plan_slug,
       status = excluded.status,
       license_type = excluded.license_type,
       start_date = excluded.start_date,
       end_date = excluded.end_date,
       payment_reference = excluded.payment_reference,
       issued_token_or_key = excluded.issued_token_or_key,
       notes = excluded.notes,
       badge_public_token = excluded.badge_public_token,
       badge_enabled = excluded.badge_enabled,
       verification_status = excluded.verification_status,
       is_public_verification_enabled = excluded.is_public_verification_enabled,
       verified_at = excluded.verified_at,
       latest_co2_per_page = excluded.latest_co2_per_page,
       latest_scan_at = excluded.latest_scan_at,
       latest_result_slug = excluded.latest_result_slug,
       updated_at = now();

insert into public.results (
  slug,
  url,
  green_host,
  carbon_estimate,
  percentile,
  reduction_pct,
  grade,
  result_data,
  updated_at
) values
  (
    'sample-public-result-greentracer-app',
    'https://greentracer.app/',
    true,
    0.18,
    91,
    9,
    'A',
    jsonb_build_object(
      'seed', true,
      'url', 'https://greentracer.app/',
      'greenHost', true,
      'greenHosting', jsonb_build_object(
        'green', true,
        'provider', 'Seed Green Host',
        'source', 'local seed'
      ),
      'sizeInfo', jsonb_build_object('measurementSource', 'seed'),
      'carbon', 0.18,
      'percentile', 91,
      'reductionPct', 9,
      'grade', 'A'
    ),
    now()
  ),
  (
    'sample-public-result-buzzboost-no-green',
    'https://buzzboost.co.uk/',
    false,
    0.64,
    58,
    3,
    'C',
    jsonb_build_object(
      'seed', true,
      'url', 'https://buzzboost.co.uk/',
      'greenHost', false,
      'greenHosting', jsonb_build_object(
        'green', false,
        'provider', null,
        'source', 'local seed'
      ),
      'sizeInfo', jsonb_build_object('measurementSource', 'seed'),
      'carbon', 0.64,
      'percentile', 58,
      'reductionPct', 3,
      'grade', 'C'
    ),
    now()
  )
on conflict (slug) do update
   set url = excluded.url,
       green_host = excluded.green_host,
       carbon_estimate = excluded.carbon_estimate,
       percentile = excluded.percentile,
       reduction_pct = excluded.reduction_pct,
       grade = excluded.grade,
       result_data = excluded.result_data,
       updated_at = now();

-- Account-domain seed.
-- Replace the UUID below with a real auth.users.id for dashboard testing.
insert into public.account_domains (
  user_id,
  domain,
  badge_public_token,
  badge_enabled,
  verification_status,
  public_verification_enabled,
  verified_at,
  latest_co2_per_page,
  latest_scan_at,
  latest_result_slug,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  'greentracer.app',
  'gtb_greentracer_manual_lifetime_2026',
  true,
  'verified',
  true,
  now(),
  0.18,
  now(),
  'sample-public-result-greentracer-app',
  now()
)
on conflict (user_id, domain) do update
   set badge_public_token = excluded.badge_public_token,
       badge_enabled = excluded.badge_enabled,
       verification_status = excluded.verification_status,
       public_verification_enabled = excluded.public_verification_enabled,
       verified_at = excluded.verified_at,
       latest_co2_per_page = excluded.latest_co2_per_page,
       latest_scan_at = excluded.latest_scan_at,
       latest_result_slug = excluded.latest_result_slug,
       updated_at = now();

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
) values
  (
    'sample-public-result-greentracer-app',
    'greentracer.app',
    'greentracer.app',
    'carbon_tested',
    'active',
    null,
    null,
    'greentracer.app',
    'greentracer.app',
    now(),
    now(),
    2,
    2,
    now()
  ),
  (
    'gtb_greentracer_manual_lifetime_2026',
    'greentracer.app',
    'greentracer.app',
    'greentracer_verified',
    'active',
    (select id from public.licenses where domain = 'greentracer.app'),
    '00000000-0000-0000-0000-000000000001',
    'greentracer.app',
    'greentracer.app',
    now(),
    now(),
    1,
    1,
    now()
  )
on conflict (badge_public_token, declared_domain, detected_host, badge_type)
do update
   set status = excluded.status,
       licence_id = excluded.licence_id,
       user_id = excluded.user_id,
       site_url = excluded.site_url,
       host_domain = excluded.host_domain,
       last_seen_at = excluded.last_seen_at,
       load_count = greatest(public.badge_pings.load_count, excluded.load_count),
       ping_count = greatest(public.badge_pings.ping_count, excluded.ping_count),
       updated_at = now();
