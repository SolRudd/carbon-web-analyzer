-- Private backend-owned tables should not be directly exposed through anon keys.
-- Safe security migration: enables RLS only. The backend uses the service role
-- key and therefore continues to read/write these tables through API routes.

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_pings ENABLE ROW LEVEL SECURITY;
