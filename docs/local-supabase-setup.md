# GreenTracer Local Supabase Setup

This is the pre-Stripe database checklist for the current GreenTracer flows.
All listed migrations are non-destructive: no table drops, truncates, deletes, or data resets.

## Backend Environment

Copy `backend/.env.example` to `backend/.env` and fill in:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
SITE_URL=http://localhost:5173
API_PUBLIC_URL=http://localhost:8080
LICENSE_ADMIN_KEY=<local-admin-key>
```

Stripe variables may be blank for local scan, dashboard, and badge testing.
The backend creates the Stripe client lazily, so missing Stripe keys only make
Stripe checkout/webhook routes return `503`.

## Frontend Environment

Create `.env.local` in the repo root:

```bash
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Migration Order

Run these in Supabase SQL Editor in this order:

1. `backend/sql/001_create_licenses.sql`
2. `backend/sql/002_create_account_domains.sql`
3. `backend/sql/003_create_contact_leads.sql`
4. `backend/sql/004_public_badges.sql`
5. `backend/sql/005_account_domain_badges.sql`
6. `backend/sql/006_scan_privacy_model.sql`
7. `backend/sql/007_badge_install_tracking.sql`
8. `backend/sql/008_badge_type_families.sql`
9. `backend/sql/009_enable_private_table_rls.sql`
10. `backend/sql/010_pre_stripe_schema_hardening.sql`

Notes:

- `003_create_contact_leads.sql` is a legacy lead-capture foundation. It is safe
  to run, but `006_scan_privacy_model.sql` also creates/hardens
  `contact_leads`.
- `badge_pings_migration.sql` is legacy. Do not run it for a fresh setup if you
  run `007` and `008`; if it was already run, `007` upgrades that table.
- `010_pre_stripe_schema_hardening.sql` is an additive safety net for partially
  migrated local/staging databases. It re-asserts required tables, columns,
  indexes, `record_badge_ping`, and future Stripe licence columns without
  deleting data.
- Run `backend/sql/seed_examples.sql` only after the migrations above.

## Migration Map

| Expected object | Used by code | Created/updated by | Safe/additive? | RLS |
| --- | --- | --- | --- | --- |
| `public.results` | public scans, result pages, report-backed badges, dashboard latest report | `006_scan_privacy_model.sql`, re-asserted by `010_pre_stripe_schema_hardening.sql` | Yes. Creates table/columns/indexes if missing. | Enabled by `006`/`010`. |
| `public.contact_leads` | anonymous homepage/calculator lead capture | `003_create_contact_leads.sql`, hardened by `006_scan_privacy_model.sql`, re-asserted by `010_pre_stripe_schema_hardening.sql` | Yes. Adds `result_slug` index and RLS. | Enabled by `006`/`010`. |
| `public.licenses` | licence checks, admin licence routes, verified badge status, Stripe webhook foundation | `001_create_licenses.sql`, extended by `004_public_badges.sql`, re-asserted by `010_pre_stripe_schema_hardening.sql` | Yes. Adds badge columns, latest-report columns, and future Stripe subscription fields. | Enabled by `009`/`010`. Backend uses service role. |
| `public.account_domains` | authenticated dashboard domains, dashboard scans, verified badge entitlement | `002_create_account_domains.sql`, extended by `005_account_domain_badges.sql`, re-asserted by `010_pre_stripe_schema_hardening.sql` | Yes. Adds badge/domain verification and latest-report columns. | Enabled by `009`/`010`. Backend uses service role and filters by authenticated user id. |
| `public.badge_pings` | badge install tracking and dashboard install summary | `007_badge_install_tracking.sql`, canonicalized by `008_badge_type_families.sql`, re-asserted by `010_pre_stripe_schema_hardening.sql` | Non-destructive. Normalizes legacy values, adds columns/indexes/functions. | Enabled by `009`/`010`. Backend uses service role. |
| `public.record_badge_ping(...)` | `POST /api/badge/ping` | `007_badge_install_tracking.sql`, refreshed by `008_badge_type_families.sql` and `010_pre_stripe_schema_hardening.sql` | Yes. `CREATE OR REPLACE FUNCTION`. | Function runs through service-role backend calls. |
| `public.increment_badge_ping(...)` | legacy compatibility only | `badge_pings_migration.sql`, refreshed by `007_badge_install_tracking.sql` | Yes. Legacy helper, not used by current backend. | Function runs through service-role backend calls if used. |

## Backend Key Model

- Table reads/writes use `SUPABASE_SERVICE_ROLE_KEY` through
  `backend/lib/supabase-admin.js`.
- `SUPABASE_SERVICE_KEY` is still accepted as a legacy fallback, but
  `SUPABASE_SERVICE_ROLE_KEY` is preferred.
- Account endpoints use `SUPABASE_ANON_KEY`/publishable key only to validate the
  bearer token with Supabase Auth (`/auth/v1/user`).
- Frontend uses `VITE_SUPABASE_ANON_KEY`/publishable key for auth session calls,
  not for direct table access.
- The current app does not require direct anon/authenticated table policies for
  these core tables. Public reads and writes go through backend API routes.

## Local Seed Examples

After migrations, optionally run:

```sql
-- Supabase SQL Editor
-- paste backend/sql/seed_examples.sql
```

It creates/upserts:

- `buzzboost.co.uk` manual active verified licence.
- `greentracer.app` manual lifetime verified licence.
- `expired.greentracer.test` expired licence.
- `suspended.greentracer.test` suspended licence.
- `sample-public-result-greentracer-app` public result with green hosting.
- `sample-public-result-buzzboost-no-green` public result without green hosting.
- One sample `account_domains` row using a placeholder auth user UUID.
- Public and verified sample `badge_pings` rows.

For real dashboard entitlement testing, create a Supabase Auth user first, copy
`auth.users.id`, then replace the placeholder UUID in `seed_examples.sql` before
running the seed.

## Missing Table Risks

- Missing `results` blocks public scans, `/api/results/:slug`, free badge lookup,
  and dashboard latest-report actions.
- Missing `contact_leads` blocks anonymous public scans after a result is saved.
- Missing `licenses` breaks `/api/license/check`, verified badge data, admin
  licence routes, and future Stripe webhook activation.
- Missing `account_domains` breaks authenticated dashboard domain and scan flows.
- Missing `badge_pings` or `record_badge_ping` does not block badge rendering,
  but dashboard install status becomes unavailable and local dev logs tracking
  errors.

## Verification Commands

```bash
npm --prefix backend test
npx eslint backend/lib/supabase-admin.js backend/lib/supabase-logging.js
git diff --check
```

If frontend files were touched, also run:

```bash
VERCEL=1 npx vite build
```
