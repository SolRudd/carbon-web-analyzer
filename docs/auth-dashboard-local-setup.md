# Auth + Dashboard Local Setup (GreenTracer)

This guide is the single source for local setup and debugging of the new account dashboard foundation.

## 1) Required environment variables

### Frontend (`.env.local` at project root)

```bash
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
# Optional compatibility alias:
# VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
```

### Backend (`backend/.env`)

```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
PAGESPEED_API_KEY=<your-pagespeed-key>
PORT=8080
DEBUG_TTL_ZERO=false
```

Notes:
- `SUPABASE_ANON_KEY` is required by account endpoints to validate JWT bearer tokens.
- Stripe keys are optional for this auth/dashboard local test pass.

## 2) Required SQL migration

Run in Supabase SQL editor:

- `backend/sql/001_create_licenses.sql`
- `backend/sql/002_create_account_domains.sql`

## 3) Supabase Auth settings

In Supabase dashboard:

1. Enable Email/Password provider.
2. For easiest local testing, disable email confirmation temporarily.
3. If email confirmation stays enabled, verify inbox before first login.
4. Enable Google provider for social login groundwork.
5. In Google provider settings, add local redirect URL:
   - `http://localhost:5173/dashboard`

## 4) Local run sequence

From project root:

```bash
# Terminal A
cd backend
npm install
npm start

# Terminal B
cd ..
npm install
npm run dev
```

## 5) End-to-end auth/dashboard test (from zero)

1. Open `http://localhost:5173/login`.
2. Click `Sign up` and create a user.
3. If confirmation is required, confirm email, then log in.
4. Confirm redirect to `/dashboard`.
5. Add a domain like `example.com`.
6. Confirm domain appears in dashboard list.
7. Confirm license status displays (`none` or real value from `licenses` table).
8. Use quick actions to open:
   - badge setup
   - license status (prefilled domain)
   - badge verification
9. Click sign out and confirm `/dashboard` redirects back to `/login`.
10. Click `Continue with Google` and confirm OAuth redirects back to `/dashboard` with an active session.

## 6) Debug checklist

### If login page says "Auth is not configured"

Check frontend env keys:
- `VITE_SUPABASE_URL`
- one of:
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PUBLISHABLE`

Then restart Vite.

### If dashboard API returns config error

Check backend env keys:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Then restart backend.

### If dashboard loads but no licenses appear

Expected when no matching row exists in `licenses` for that domain.
License status defaults safely to `none`.

### If auth keeps expiring

- Check system clock is correct.
- Ensure refresh token flow is not blocked.
- Clear localStorage key `gt_auth_session_v1` and log in again.

## 7) What this pass does not require

- Stripe webhook testing
- account billing
- team/multi-user dashboards
- report history features
