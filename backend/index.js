'use strict';
const path = require('path');
const dotenv = require('dotenv');

const ENV_FILE_PATH = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE_PATH });

const crypto     = require('crypto');
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const axios      = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { inspectBadgeHtml } = require('./lib/badge-verification');
const { parseLeadCapturePayload } = require('./lib/lead-capture');
const {
  calcCO2,
  gradeFor,
  percentileFromCarbon,
  totalGreenReductionPct,
} = require('./lib/metrics');

// ── App Initialization ─────────────────────────────
const app   = express();
const PORT  = Number(process.env.PORT) || 8080;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

if (process.env.NODE_ENV !== 'production') {
  console.info('[startup-env]', {
    cwd: process.cwd(),
    envFilePath: ENV_FILE_PATH,
    hasSupabaseUrl: Boolean((process.env.SUPABASE_URL || '').trim()),
    hasSupabaseAnonKey: Boolean((process.env.SUPABASE_ANON_KEY || '').trim()),
    hasSupabasePublishableKey: Boolean((process.env.SUPABASE_PUBLISHABLE_KEY || '').trim()),
    hasSupabasePublishable: Boolean((process.env.SUPABASE_PUBLISHABLE || '').trim()),
  });
}

// ── Middleware & Security ───────────────────────────
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({
  verify: (req, _res, buf) => {
    if (req.originalUrl === '/api/stripe/webhook') {
      req.rawBody = Buffer.from(buf);
    }
  }
}));

// ── Rate Limiters ───────────────────────────────────
const limiterCheck       = rateLimit({ windowMs: 24*60*60*1000, max: 20 });
const limiterBadge       = rateLimit({ windowMs:    60*1000, max: 60 });
const limiterTraceOrCheck= rateLimit({ windowMs:    60*1000, max: 12 });
const limiterLicenseRead = rateLimit({ windowMs:    60*1000, max: 60 });
const limiterLicenseWrite= rateLimit({ windowMs:    60*1000, max: 20 });
const limiterStripe      = rateLimit({ windowMs:    60*1000, max: 30 });

// ── CORS Rules ──────────────────────────────────────
// allow badge endpoints from anywhere:
const badgeCors = cors({ origin:'*', methods:['GET','POST','OPTIONS'] });

// allow API calls from your frontends (and any badge user)
app.use(cors({
  origin: true,   // echo back whatever Origin header the client sent
  methods: ['GET','POST','PATCH'],
  allowedHeaders: ['Content-Type','X-API-Key', 'X-Admin-Key', 'Authorization']
}));

// ── Badge & Static File Routes ──────────────────────
app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req,res) => {
  res.type('application/javascript');
  res.set('Cache-Control','public,max-age=3600');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

// Helper: Validate hex colour
function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// ⬇︎ New: truly static SVG badge
app.get('/api/badge.svg', badgeCors, limiterBadge, async (req, res) => {
  const theme = (req.query.theme||'auto').toLowerCase();
  const site  = req.query.url;
  const customBgColor = req.query.bgColor;
  const customAccentColor = req.query.accentColor;
  
  if (!site) {
    res.set('Content-Type','image/svg+xml');
    return res.status(400).send(`<svg><text x="0" y="15" fill="red">Missing url</text></svg>`);
  }

  let data;
  try {
    const r = await axios.get(
      `https://${req.get('host')}/api/trace?site=${encodeURIComponent(site)}`,
      { timeout:5000 }
    );
    data = r.data;
  } catch (e) {
    if (e.response && e.response.status === 404) {
      res.set('Content-Type','image/svg+xml');
      return res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="40">
        <rect width="240" height="40" fill="#f3f4f6" rx="4"/>
        <text x="10" y="25" fill="#374151" font-family="Inter,system-ui" font-size="12" font-weight="500">
          No data - run a scan first
        </text>
      </svg>`);
    }
    res.set('Content-Type','image/svg+xml');
    return res.status(500).send(`<svg><text x="0" y="15" fill="red">Error</text></svg>`);
  }

  const light = { fg:'#0F172A', bg:'#fff', border:'#16A34A', sub:'#475569' };
  const dark  = { fg:'#e5e7eb', bg:'#1f2937', border:'#16A34A', sub:'#94a3b8' };
  let pick = theme==='dark'
    ? dark
    : theme==='light'
      ? light
      : (req.get('sec-ch-prefers-color-scheme')==='dark' ? dark : light);

  // Apply custom colours if provided and valid
  if (customBgColor && isValidHex(customBgColor)) {
    pick.bg = customBgColor;
  }
  if (customAccentColor && isValidHex(customAccentColor)) {
    pick.border = customAccentColor;
  }

  const co2 = Number(data.carbonEstimate||0).toFixed(2);
  const pct = data.percentile!=null ? data.percentile : '--';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="40">
  <rect width="120" height="40" fill="${pick.bg}" rx="4"/>
  <rect x="120" width="120" height="40" fill="${pick.border}" rx="4"/>
  <text x="8" y="25" fill="${pick.fg}" font-family="Inter,system-ui" font-size="14" font-weight="600">
    ${co2}g CO₂/view
  </text>
  <text x="132" y="25" fill="#fff" font-family="Inter,system-ui" font-size="14" font-weight="600">
    Cleaner ${pct}%
  </text>
</svg>`;
  res.set({
    'Content-Type':'image/svg+xml',
    'Cache-Control':'public,max-age=3600'
  });
  res.send(svg);
});
// ⬆︎ End static SVG badge

app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', (_req,res) => res.send('OK'));

// ── Stripe checkout + webhook (Ticket 2.1 + 2.2) ──
app.post('/api/stripe/create-checkout-session', limiterStripe, async (req, res) => {
  const { stripe, error } = getStripeClient();
  if (error) return res.status(503).json({ error });

  const priceId = process.env.STRIPE_PRICE_ID_VERIFIED_BADGE;
  if (!priceId) return res.status(503).json({ error: 'Stripe price is not configured.' });

  const domain = normalizeDomain(req.body?.domain);
  if (!domain) return res.status(400).json({ error: 'Valid domain is required.' });
  const checkoutMode = String(process.env.STRIPE_CHECKOUT_MODE || 'payment').toLowerCase() === 'subscription'
    ? 'subscription'
    : 'payment';

  const plan = 'verified_badge_license_annual';
  const licenseType = 'paid';
  const siteBase = resolveSiteBase(req);
  const successUrl = `${siteBase}/license-status?checkout=success&domain=${encodeURIComponent(domain)}`;
  const cancelUrl = `${siteBase}/pricing?checkout=cancel&domain=${encodeURIComponent(domain)}`;

  try {
    const sessionPayload = {
      mode: checkoutMode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: domain,
      allow_promotion_codes: true,
      metadata: {
        domain,
        plan,
        license_type: licenseType
      },
    };

    if (checkoutMode === 'subscription') {
      sessionPayload.subscription_data = {
        metadata: {
          domain,
          plan,
          license_type: licenseType
        }
      };
    } else {
      sessionPayload.payment_intent_data = {
        metadata: {
          domain,
          plan,
          license_type: licenseType
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);

    await upsertLicenseByDomain({
      domain,
      plan,
      status: 'inactive',
      license_type: licenseType,
      payment_reference: session.id
    });

    return res.json({ ok: true, sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('[stripe/create-checkout-session] failed:', err.message);
    return res.status(500).json({
      error: 'Failed to create checkout session.',
      details: process.env.NODE_ENV === 'production' ? undefined : (err.message || String(err)),
      checkoutMode: process.env.NODE_ENV === 'production' ? undefined : checkoutMode
    });
  }
});

app.post('/api/stripe/webhook', limiterStripe, async (req, res) => {
  const { stripe, error } = getStripeClient();
  if (error) return res.status(503).json({ error });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(503).json({ error: 'Stripe webhook secret is not configured.' });

  const signature = req.get('stripe-signature');
  if (!signature) return res.status(400).send('Missing Stripe signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody || JSON.stringify(req.body), signature, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleStripeEvent(event);
    return res.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook] handler failed:', err.message);
    return res.status(500).send('Webhook handler failed');
  }
});

// ── License endpoints (Ticket 1.2 + 1.3) ──────────
app.get('/api/license/check', limiterLicenseRead, async (req, res) => {
  const domainInput = req.query.domain;
  const tokenInput = req.query.token;
  const domain = normalizeDomain(domainInput);
  const token = typeof tokenInput === 'string' && tokenInput.trim() ? tokenInput.trim() : null;

  if (!domain && !token) {
    if (typeof domainInput === 'string' && domainInput.trim()) {
      return res.status(400).json({ error: 'Invalid domain format. Provide a valid domain (example.com) and/or token.' });
    }
    return res.status(400).json({ error: 'Provide domain and/or token.' });
  }

  let query = supabase.from('licenses').select('*');
  if (domain) query = query.eq('domain', domain);
  if (token) query = query.eq('issued_token_or_key', token);

  const { data, error } = await query
    .order('updated_at', { ascending: false })
    .limit(1);
  if (error) {
    return res.status(500).json({
      error: 'License lookup failed.',
      details: process.env.NODE_ENV === 'production'
        ? undefined
        : `${error.message || String(error)} (domain=${domain || 'none'}, tokenProvided=${Boolean(token)})`
    });
  }
  const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
  if (!row) return res.json({ licensed: false, status: 'none', domain: domain || null });

  const payload = mapLicensePublic(row);
  return res.json(payload);
});

app.get('/api/license/verify-badge', limiterLicenseRead, async (req, res) => {
  const domain = normalizeDomain(req.query.domain);
  const expectedBadgeTypeRaw = String(req.query.expectedBadgeType || '').toLowerCase();
  const expectedBadgeType = ['carbon', 'hosting', 'member'].includes(expectedBadgeTypeRaw)
    ? expectedBadgeTypeRaw
    : null;

  if (!domain) {
    return res.status(400).json({ error: 'Valid domain is required.' });
  }

  const candidates = [`https://${domain}`, `http://${domain}`];
  let html = '';
  let checkedUrl = candidates[0];
  let finalUrl = null;
  let httpStatus = null;
  let fetchError = null;

  for (const candidate of candidates) {
    try {
      const response = await axios.get(candidate, {
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: () => true
      });
      checkedUrl = candidate;
      html = typeof response.data === 'string' ? response.data : '';
      httpStatus = response.status;
      finalUrl = response.request?.res?.responseUrl || candidate;
      if (response.status >= 200 && response.status < 500) break;
    } catch (err) {
      checkedUrl = candidate;
      fetchError = err.message || 'Failed to fetch site HTML.';
    }
  }

  if (!html) {
    return res.json({
      state: 'needs_review',
      domain,
      checkedUrl,
      finalUrl,
      httpStatus,
      expectedBadgeType,
      checks: {
        scriptDetected: false,
        containerDetected: false,
        dataUrlDetected: false
      },
      detectedBadgeTypes: [],
      issues: ['site_fetch_failed'],
      message: 'Unable to fetch website HTML for automatic badge verification.',
      fetchError: fetchError || null
    });
  }

  const verification = inspectBadgeHtml(html, expectedBadgeType);

  return res.json({
    state: verification.state,
    domain,
    checkedUrl,
    finalUrl,
    httpStatus,
    expectedBadgeType,
    checks: verification.checks,
    detectedBadgeTypes: verification.detectedBadgeTypes,
    issues: verification.issues
  });
});

async function fetchSupabaseAuthUser(accessToken) {
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const clientKey = getSupabaseClientAuthKey();
  if (!supabaseUrl || !clientKey || !accessToken) return null;

  try {
    const response = await axios.get(`${supabaseUrl}/auth/v1/user`, {
      timeout: 10000,
      headers: {
        apikey: clientKey,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data || null;
  } catch {
    return null;
  }
}

function getSupabaseClientAuthKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE ||
    ''
  ).trim();
}

function hasAccountAuthServerConfig() {
  return Boolean(
    (process.env.SUPABASE_URL || '').trim() &&
    getSupabaseClientAuthKey()
  );
}

async function requireAccountAuth(req, res, next) {
  // Keep this explicit so local setup/debugging failures are obvious.
  if (!hasAccountAuthServerConfig()) {
    return res.status(503).json({
      error: 'Account auth is not configured on backend. Set SUPABASE_URL and one client key: SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY.'
    });
  }

  const authHeader = req.get('authorization') || req.get('Authorization') || '';
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = tokenMatch ? tokenMatch[1].trim() : '';
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token.' });
  }

  const user = await fetchSupabaseAuthUser(token);
  if (!user?.id) {
    return res.status(401).json({ error: 'Invalid or expired auth token.' });
  }

  req.accountUser = {
    id: user.id,
    email: user.email || null
  };
  return next();
}

app.get('/api/account/me/dashboard', limiterLicenseRead, requireAccountAuth, async (req, res) => {
  const userId = req.accountUser.id;
  const { data, error } = await supabase
    .from('account_domains')
    .select('domain')
    .eq('user_id', userId)
    .order('domain', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: 'Failed to load account domains.',
      details: process.env.NODE_ENV === 'production' ? undefined : (error.message || String(error))
    });
  }

  const domains = await Promise.all(
    (data || []).map(async (row) => ({
      domain: row.domain,
      license: await getLicenseStateForDomain(row.domain)
    }))
  );

  return res.json({
    user: req.accountUser,
    domains
  });
});

app.post('/api/account/me/domains', limiterLicenseWrite, requireAccountAuth, async (req, res) => {
  const normalizedDomain = normalizeDomain(req.body?.domain);
  if (!normalizedDomain) {
    return res.status(400).json({ error: 'Valid domain is required.' });
  }

  const payload = {
    user_id: req.accountUser.id,
    domain: normalizedDomain
  };

  const { error } = await supabase
    .from('account_domains')
    .upsert(payload, { onConflict: 'user_id,domain' });

  if (error) {
    return res.status(500).json({
      error: 'Failed to save account domain.',
      details: process.env.NODE_ENV === 'production' ? undefined : (error.message || String(error))
    });
  }

  return res.status(201).json({
    ok: true,
    domain: normalizedDomain
  });
});

app.post('/api/account/me/domains/remove', limiterLicenseWrite, requireAccountAuth, async (req, res) => {
  const normalizedDomain = normalizeDomain(req.body?.domain);
  if (!normalizedDomain) {
    return res.status(400).json({ error: 'Valid domain is required.' });
  }

  const { error } = await supabase
    .from('account_domains')
    .delete()
    .eq('user_id', req.accountUser.id)
    .eq('domain', normalizedDomain);

  if (error) {
    return res.status(500).json({
      error: 'Failed to remove account domain.',
      details: process.env.NODE_ENV === 'production' ? undefined : (error.message || String(error))
    });
  }

  return res.json({ ok: true, domain: normalizedDomain });
});

app.post('/api/admin/licenses', limiterLicenseWrite, requireLicenseAdmin, async (req, res) => {
  const {
    domain,
    plan = 'verified_badge_license_annual',
    status = 'inactive',
    license_type = 'paid',
    start_date = null,
    end_date = null,
    payment_reference = null,
    issued_token_or_key = null,
    notes = null
  } = req.body || {};

  const normalizedDomain = normalizeDomain(domain);
  if (!normalizedDomain) return res.status(400).json({ error: 'Valid domain is required.' });

  const token = issued_token_or_key || crypto.randomUUID();

  const payload = {
    domain: normalizedDomain,
    plan,
    status,
    license_type,
    start_date,
    end_date,
    payment_reference,
    issued_token_or_key: token,
    notes
  };

  const { data, error } = await supabase
    .from('licenses')
    .upsert(payload, { onConflict: 'domain' })
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: 'License create/update failed.' });
  return res.status(201).json({ ok: true, license: mapLicenseAdmin(data), token: data.issued_token_or_key });
});

app.patch('/api/admin/licenses/:id', limiterLicenseWrite, requireLicenseAdmin, async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'License id is required.' });

  const allowedFields = [
    'plan', 'status', 'license_type', 'start_date', 'end_date',
    'payment_reference', 'issued_token_or_key', 'notes'
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No allowed fields provided for update.' });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('licenses')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: 'License update failed.' });
  return res.json({ ok: true, license: mapLicenseAdmin(data) });
});

app.post('/api/admin/licenses/:id/suspend', limiterLicenseWrite, requireLicenseAdmin, async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'License id is required.' });

  const { data, error } = await supabase
    .from('licenses')
    .update({
      status: 'suspended',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: 'License suspend failed.' });
  return res.json({ ok: true, license: mapLicenseAdmin(data) });
});

// ── “Trace” endpoint: only return cached ───────────
app.get('/api/trace', badgeCors, limiterBadge, async (req,res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });
  const row = await getCached(slugify(site));
  if (!row) return res.status(404).json({ error:'No data—run a check first.' });
  res.json(row);
});

// ── Badge install tracking (fire-and-forget from badge script) ─
const limiterBadgePing = rateLimit({ windowMs: 60*1000, max: 30 });

app.post('/api/badge/ping', badgeCors, limiterBadgePing, async (req, res) => {
  // Respond immediately – tracking is best-effort, never blocks rendering
  res.json({ ok: true });

  try {
    const siteUrl  = String(req.body?.site  || '').trim().slice(0, 500);
    const hostDomain = String(req.body?.host || '').trim().slice(0, 255);
    const badgeType  = ['carbon','hosting','member'].includes(req.body?.type)
      ? req.body.type
      : 'carbon';

    if (!siteUrl) return;

    await supabase
      .from('badge_pings')
      .upsert(
        {
          site_url:     siteUrl,
          host_domain:  hostDomain,
          badge_type:   badgeType,
          last_seen_at: new Date().toISOString(),
          ping_count:   1
        },
        {
          onConflict: 'site_url,host_domain',
          ignoreDuplicates: false
        }
      );

    // Increment ping_count on conflict (Supabase doesn't support expressions in upsert,
    // so we do a separate update if the row already existed)
    await supabase.rpc('increment_badge_ping', {
      p_site_url:    siteUrl,
      p_host_domain: hostDomain
    }).catch(() => null); // non-critical – ignore if RPC not set up yet
  } catch (err) {
    // Swallow – tracking must never affect badge rendering
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[badge/ping] tracking error:', err.message);
    }
  }
});

// ── “Trace or Check” endpoint ──────────────────────
app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req,res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });

  const isUrl = /^https?:\/\//i.test(site);
  const lookupKey = isUrl ? slugify(site) : site;
  const cached = await getCached(lookupKey);
  if (cached) {
    if (hasAnyLighthouseScore(cached.lighthouseScores)) return res.json(cached);
    if (cached.url) {
      try {
        const host = new URL(cached.url).hostname;
        const refreshed = await performCarbonCheck(cached.url, host);
        return res.json(refreshed);
      } catch {
        return res.json(cached);
      }
    }
    return res.json(cached);
  }

  if (!isUrl) {
    return res.status(404).json({ error:'No cached result for this slug. Run a fresh check first.' });
  }

  const norm = site;
  let host;
  try { host = new URL(norm).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  try {
    const data = await performCarbonCheck(norm, host);
    res.json(data);
  } catch (e) {
    console.error('[trace-or-check] failed:', e.message);
    res.status(500).json({ error:'Trace failed' });
  }
});

// ── Alias GET for /api/check-carbon ────────────────
app.get('/api/check-carbon', limiterCheck, async (req,res) => {
  const site = req.query.url;
  if (!site) return res.status(400).json({ error:'Missing url query param.' });
  let host;
  try { host = new URL(site).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  try {
    const data = await performCarbonCheck(site, host);
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon GET] failed:', err.message);
    res.status(500).json({ error:'Failed to perform carbon check.' });
  }
});

// ── POST /api/check-carbon ─────────────────────────
app.post('/api/check-carbon', limiterCheck, async (req,res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });
  let host;
  try { host = new URL(site).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  try {
    const contactSource = String(req.body?.contactSource || '').trim().toLowerCase();
    const requiresLeadCapture = contactSource === 'homepage_hero';
    const lead = parseLeadCapturePayload(req.body || {}, {
      requireEmail: requiresLeadCapture,
      requireConsent: requiresLeadCapture
    });
    const data = await performCarbonCheck(site, host);
    if (lead.shouldCapture) {
      try {
        await captureContactLead({
          lead,
          siteUrl: data.url || site,
          domain: normalizeDomain(data.url || site),
          resultSlug: data.slug
        });
      } catch (leadError) {
        console.error('[/api/check-carbon POST] lead capture failed:', leadError.message);
        return res.status(500).json({ error: 'Failed to save contact details for this scan.' });
      }
    }
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon POST] failed:', err.message);
    const statusCode = Number(err.statusCode) || 500;
    res.status(statusCode).json({
      error: statusCode >= 500 ? 'Failed to perform carbon check.' : err.message
    });
  }
});

// ── Helpers ─────────────────────────────────────────
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24*60*60*1000;

function slugify(site) {
  try {
    const u = new URL(site);
    const cleaned = u.origin + u.pathname.replace(/\/+$/,'');
    return (new URL(cleaned).hostname + new URL(cleaned).pathname)
      .replace(/[^a-z0-9]/gi,'-').toLowerCase().replace(/-+$/,'');
  } catch {
    return site.toLowerCase().replace(/[^a-z0-9]/gi,'-').replace(/-+$/,'');
  }
}

function normalizeDomain(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(normalized);
    return url.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return trimmed.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].toLowerCase() || null;
  }
}

async function captureContactLead({ lead, siteUrl, domain, resultSlug }) {
  if (!lead?.shouldCapture || !lead.email || !domain || !siteUrl) return;

  const payload = {
    email: lead.email,
    domain,
    site_url: siteUrl,
    source: lead.source || 'homepage_hero',
    consent_to_contact: true,
    result_slug: resultSlug || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('contact_leads')
    .upsert(payload, { onConflict: 'email,domain,source' });

  if (error) {
    throw error;
  }
}

function mapLicensePublic(row) {
  const now = new Date();
  const endDate = row.end_date ? new Date(row.end_date) : null;
  const isExpired = !!(endDate && endDate < now);
  const activeStatuses = new Set(['active', 'trial', 'charity', 'partner', 'internal']);
  return {
    id: row.id,
    domain: row.domain,
    plan: row.plan,
    status: row.status,
    licenseType: row.license_type,
    startDate: row.start_date,
    endDate: row.end_date,
    licensed: activeStatuses.has(String(row.status || '').toLowerCase()) && !isExpired,
    expired: isExpired
  };
}

function mapLicenseAdmin(row) {
  return {
    ...mapLicensePublic(row),
    paymentReference: row.payment_reference || null,
    notes: row.notes || null
  };
}

const DEFAULT_LICENSE_STATE = Object.freeze({
  licensed: false,
  status: 'none',
  licenseType: null,
  plan: null,
  startDate: null,
  endDate: null,
  expired: false
});

async function getLicenseStateForDomain(domain) {
  if (!domain) return DEFAULT_LICENSE_STATE;
  try {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('domain', domain)
      .order('updated_at', { ascending: false })
      .limit(1);
    if (error || !Array.isArray(data) || data.length === 0) return DEFAULT_LICENSE_STATE;
    return mapLicensePublic(data[0]);
  } catch {
    return DEFAULT_LICENSE_STATE;
  }
}

function resolveSiteBase(req) {
  const fromEnv = (process.env.SITE_URL || process.env.FRONTEND_URL || '').trim();
  if (/^https?:\/\//i.test(fromEnv)) return fromEnv.replace(/\/+$/, '');

  const origin = String(req.get('origin') || '').trim();
  if (/^https?:\/\//i.test(origin)) return origin.replace(/\/+$/, '');

  return 'https://www.greentracer.org';
}

function requireLicenseAdmin(req, res, next) {
  const configured = process.env.LICENSE_ADMIN_KEY || process.env.ADMIN_API_KEY || '';
  if (!configured) return res.status(503).json({ error: 'Admin license key is not configured.' });
  const provided = req.get('x-admin-key') || req.get('x-api-key') || '';
  if (!provided || provided !== configured) return res.status(401).json({ error: 'Unauthorized.' });
  return next();
}

let stripeClient = null;
function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return { error: 'Stripe secret key is not configured.' };
  try {
    const Stripe = require('stripe');
    if (!stripeClient) {
      stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return { stripe: stripeClient };
  } catch {
    return { error: 'Stripe SDK is not available. Install backend dependency "stripe".' };
  }
}

async function getLicenseRowByDomain(domain) {
  const normalized = normalizeDomain(domain);
  if (!normalized) return null;
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('domain', normalized)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (error || !Array.isArray(data) || data.length === 0) return null;
  return data[0];
}

async function upsertLicenseByDomain({
  domain,
  plan = 'verified_badge_license_annual',
  status = 'inactive',
  license_type = 'paid',
  start_date = null,
  end_date = null,
  payment_reference = null,
  notes = null
}) {
  const normalized = normalizeDomain(domain);
  if (!normalized) throw new Error('Domain is required for license upsert.');

  const existing = await getLicenseRowByDomain(normalized);
  const payload = {
    domain: normalized,
    plan,
    status,
    license_type,
    start_date,
    end_date,
    payment_reference,
    notes,
    issued_token_or_key: existing?.issued_token_or_key || crypto.randomUUID(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('licenses')
    .upsert(payload, { onConflict: 'domain' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

function addYearISO(date = new Date()) {
  const d = new Date(date);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString();
}

async function handleStripeEvent(event) {
  const type = event.type;
  const object = event.data?.object || {};
  const meta = object.metadata || {};
  const domain = normalizeDomain(meta.domain || object.client_reference_id);
  if (!domain) return;

  if (process.env.NODE_ENV !== 'production') {
    console.info('[stripe/webhook] event', {
      type,
      mode: object.mode || null,
      paymentStatus: object.payment_status || null,
      domain
    });
  }

  if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
    const paymentStatus = String(object.payment_status || '').toLowerCase();
    const checkoutMode = String(object.mode || '').toLowerCase();
    if (type === 'checkout.session.completed' && checkoutMode === 'payment' && paymentStatus && paymentStatus !== 'paid') {
      return;
    }
    const paymentRef = object.payment_intent || object.id || event.id;
    await upsertLicenseByDomain({
      domain,
      plan: meta.plan || 'verified_badge_license_annual',
      status: 'active',
      license_type: meta.license_type || 'paid',
      start_date: new Date().toISOString(),
      end_date: addYearISO(),
      payment_reference: String(paymentRef),
      notes: `Activated by Stripe ${type}`
    });
    return;
  }

  if (type === 'checkout.session.expired' || type === 'checkout.session.async_payment_failed') {
    const existing = await getLicenseRowByDomain(domain);
    if (!existing) return;
    const sessionRef = object.id || '';
    const existingRef = existing.payment_reference || '';
    if (String(existing.status).toLowerCase() === 'active' && existingRef && existingRef !== sessionRef) {
      return;
    }
    await upsertLicenseByDomain({
      domain,
      plan: existing.plan,
      status: 'inactive',
      license_type: existing.license_type || 'paid',
      start_date: existing.start_date,
      end_date: existing.end_date,
      payment_reference: sessionRef || existingRef || null,
      notes: `Updated by Stripe ${type}`
    });
  }
}

async function getCached(slug) {
  const s = slug.toLowerCase().replace(/-+$/,'');
  const { data: row, error } = await supabase
    .from('results').select('*').eq('slug', s).single();
  if (error || !row) return null;
  if (TTL!==0 && Date.now() - new Date(row.created_at).getTime() > TTL) return null;
  const info = row.result_data || {};
  const lighthouseScores = normalizeLighthouseScores(info.lighthouseScores);
  const lighthouseMeta = info.lighthouseMeta || {};
  const license = await getLicenseStateForDomain(normalizeDomain(row.url));
  return {
    slug:           row.slug,
    url:            row.url,
    greenHost:      !!row.green_host,
    carbonEstimate: +row.carbon_estimate,
    percentile:     +row.percentile,
    reductionPct:   +row.reduction_pct,
    grade:          row.grade,
    lighthouseScores,
    lighthouseStatus: hasAnyLighthouseScore(lighthouseScores) ? 'available' : (info.lighthouseMeta?.status || 'unavailable'),
    lighthouseSource: lighthouseMeta.source || null,
    lighthouseReason: lighthouseMeta.reason || null,
    license,
    timestamp:      new Date(row.created_at).getTime()
  };
}

async function performCarbonCheck(norm, host) {
  const [ green, sizeInfo ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
  const sizeMB       = (sizeInfo.bytes||0)/(1024*1024);
  const carbon        = calcCO2(sizeMB, green);
  const percentile    = percentileFromCarbon(carbon);
  const reductionPct  = green ? totalGreenReductionPct() : 0;
  const slug          = slugify(sizeInfo.finalUrl||norm);
  const grade         = gradeFor(carbon);
  const lighthouseScores = normalizeLighthouseScores(sizeInfo.lighthouseScores);
  const lighthouseStatus = hasAnyLighthouseScore(lighthouseScores) ? 'available' : 'unavailable';
  const lighthouseMeta = {
    status: lighthouseStatus,
    source: sizeInfo.measurementSource || 'unknown',
    reason: sizeInfo.lighthouseReason || null
  };

  const { data: row, error } = await supabase
    .from('results')
    .upsert({
      slug,
      url:             sizeInfo.finalUrl||norm,
      green_host:      green,
      carbon_estimate: carbon,
      percentile,
      reduction_pct:   reductionPct,
      grade,
      result_data:     { sizeInfo, carbon, percentile, reductionPct, grade, lighthouseScores, lighthouseMeta }
    }, { onConflict:['slug'] })
    .select().single();

  if (error) throw error;
  const license = await getLicenseStateForDomain(normalizeDomain(row.url));
  return {
    slug:           row.slug,
    url:            row.url,
    greenHost:      !!row.green_host,
    carbonEstimate: +row.carbon_estimate,
    percentile:     +row.percentile,
    reductionPct:   +row.reduction_pct,
    grade:          row.grade,
    lighthouseScores,
    lighthouseStatus,
    lighthouseSource: lighthouseMeta.source,
    lighthouseReason: lighthouseMeta.reason,
    license,
    timestamp:      new Date(row.created_at).getTime()
  };
}

async function runPSI(url, strat, key) {
  const params = new URLSearchParams({ url, strategy: strat });
  params.append('category', 'performance');
  params.append('category', 'accessibility');
  params.append('category', 'best-practices');
  params.append('category', 'seo');
  if (key) params.append('key', key);
  const api=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
  const r=await axios.get(api,{timeout:30000});
  const lr=r.data.lighthouseResult;
  const b=lr?.audits?.['total-byte-weight']?.numericValue||0;
  const items=lr?.audits?.['resource-summary']?.details?.items||[];
  const sum=items.reduce((s,i)=>s+(i.transferSize||0),0);
  const categories = lr?.categories || {};
  const toPct = (score) =>
    typeof score === 'number' && Number.isFinite(score)
      ? Math.max(0, Math.min(100, Math.round(score * 100)))
      : null;
  return {
    bytes:Math.max(b,sum),
    finalUrl:lr.finalDisplayedUrl||url,
    lighthouseScores: normalizeLighthouseScores({
      performance:   toPct(categories.performance?.score),
      accessibility: toPct(categories.accessibility?.score),
      'best-practices': toPct(categories['best-practices']?.score),
      seo:           toPct(categories.seo?.score)
    })
  };
}

function mergeLighthouseScores(primary, secondary) {
  const a = normalizeLighthouseScores(primary);
  const b = normalizeLighthouseScores(secondary);
  if (!a && !b) return null;
  return normalizeLighthouseScores({
    performance: a?.performance ?? b?.performance,
    accessibility: a?.accessibility ?? b?.accessibility,
    'best-practices': a?.['best-practices'] ?? b?.['best-practices'],
    seo: a?.seo ?? b?.seo
  });
}

function normalizeLighthouseScores(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const normalize = (v) =>
    typeof v === 'number' && Number.isFinite(v)
      ? Math.max(0, Math.min(100, Math.round(v)))
      : null;
  return {
    performance: normalize(raw.performance),
    accessibility: normalize(raw.accessibility),
    'best-practices': normalize(raw['best-practices'] ?? raw.bestPractices),
    bestPractices: normalize(raw.bestPractices ?? raw['best-practices']),
    seo: normalize(raw.seo)
  };
}

function hasAnyLighthouseScore(scores) {
  if (!scores || typeof scores !== 'object') return false;
  return ['performance', 'accessibility', 'best-practices', 'bestPractices', 'seo']
    .some((k) => typeof scores[k] === 'number' && Number.isFinite(scores[k]));
}

async function htmlOnlyEstimateMB(url) {
  try {
    const r = await axios.get(url,{timeout:12000,headers:{'User-Agent':'Mozilla/5.0'}});
    const b = Buffer.byteLength(r.data||'','utf8');
    const e = Math.max(b*7, b+80*1024);
    return e/(1024*1024);
  } catch {
    return 1.7;
  }
}

async function fetchSize(url) {
  const key = process.env.PAGESPEED_API_KEY;
  try {
    const [d,m]=await Promise.allSettled([
      runPSI(url,'desktop',key),
      runPSI(url,'mobile', key)
    ]);
    const desktop = d.status==='fulfilled' ? d.value : null;
    const mobile = m.status==='fulfilled' ? m.value : null;
    let best = desktop;
    if(mobile && (!best || mobile.bytes > best.bytes)) best = mobile;
    if(best){
      const lighthouseScores = mergeLighthouseScores(desktop?.lighthouseScores, mobile?.lighthouseScores);
      return { ...best, lighthouseScores, measurementSource: 'psi', lighthouseReason: null };
    }
    throw new Error('PSI both failed');
  } catch {
    const mb=await htmlOnlyEstimateMB(url);
    return {
      bytes:mb*1024*1024,
      finalUrl:url,
      lighthouseScores:null,
      measurementSource:'html-fallback',
      lighthouseReason:'psi-unavailable'
    };
  }
}

async function checkGreen(host) {
  try {
    const { data } = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${host}`,
      { timeout:8000 }
    );
    return !!data.green;
  } catch {
    return false;
  }
}

// ── Start Server ────────────────────────────────────
app.listen(PORT,'0.0.0.0',()=> {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});
