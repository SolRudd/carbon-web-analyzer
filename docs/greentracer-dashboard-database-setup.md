# GreenTracer Dashboard Database Setup

Use this when preparing an existing Supabase project for the authenticated GreenTracer dashboard.

## Files To Run

1. Run this setup file in the Supabase SQL editor:

   `supabase/manual-run/greentracer_dashboard_safe_setup.sql`

2. Then run this verification file:

   `supabase/manual-run/verify_greentracer_dashboard_setup.sql`

The verification file is SELECT-only and is safe to run repeatedly.

## What The Setup Creates Or Adds

The setup is additive and idempotent. It uses:

- `create extension if not exists`
- `create table if not exists`
- `alter table ... add column if not exists`
- `create index if not exists`
- `create or replace function`
- `drop trigger if exists` followed by `create trigger`

It prepares:

- `results` for saved scan/report data.
- `account_domains` for user-managed domains.
- `licenses` for GreenTracer Verified, manual approval, and future Stripe fields.
- `badge_pings` for badge install/load diagnostics.
- `record_badge_ping(...)` for the existing `/api/badge/ping` flow.
- `increment_badge_ping(...)` for legacy badge ping compatibility.
- `greentracer_touch_updated_at()` and simple `updated_at` triggers.

The setup adds lookup indexes for dashboard and badge queries. It avoids adding
new uniqueness requirements, so existing duplicate live rows cannot make the
manual setup fail.

## What It Does Not Touch

It does not:

- Reset the database.
- Drop tables.
- Truncate tables.
- Delete records.
- Drop columns.
- Rename existing tables.
- Reset sequences.
- Bulk rewrite existing scan/report rows.
- Change carbon scoring logic.
- Change scan/backend behaviour.
- Expose private tokens or secrets.

## Existing Field Names

The current backend uses these badge install fields:

- `badge_public_token`
- `declared_domain`
- `detected_host`
- `badge_type`
- `source_url`
- `site_url`
- `host_domain`
- `load_count`
- `ping_count`

The setup keeps those names instead of adding duplicate `public_token`, `domain`, or `referrer` columns.

## RLS Notes

This setup does not enable or tighten RLS.

Reason: the current server uses authenticated backend routes and service-role Supabase access for dashboard, scan, license, and badge-ping writes. Enabling restrictive RLS blindly on a live database could break production flows.

Use the verification SQL to inspect current RLS status:

`supabase/manual-run/verify_greentracer_dashboard_setup.sql`

If browser-side direct Supabase writes are introduced later, add conservative authenticated-user policies in a separate reviewed migration.

## Stop Conditions

Stop and do not run the setup if the SQL contains any of the following:

- `drop table`
- `truncate`
- `delete from`
- `alter table ... drop column`
- destructive type changes to `results`
- sequence resets
- anything intended to wipe existing scan/report data

The only `drop` statements expected in the setup are `drop trigger if exists`, which is used to safely recreate `updated_at` triggers.

## Manual Supabase Steps

1. Open Supabase SQL editor for the live project.
2. Paste and run `supabase/manual-run/greentracer_dashboard_safe_setup.sql`.
3. Paste and run `supabase/manual-run/verify_greentracer_dashboard_setup.sql`.
4. Confirm:
   - `results`, `account_domains`, `licenses`, and `badge_pings` are present.
   - Required columns show `present`.
   - Key indexes show `present`.
   - `record_badge_ping` exists.
   - Row counts look plausible and were not reset.
   - RLS status matches the current deployment expectation.

## After Running

Smoke-test:

- Login.
- Add a domain.
- Run a dashboard scan.
- Open the saved report.
- Copy a Carbon Result badge snippet.
- Load the badge on a test page and confirm `/api/badge/ping` remains non-blocking.
