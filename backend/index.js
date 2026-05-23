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
const { createSupabaseAdminClient, readSupabaseAdminConfig } = require('./lib/supabase-admin');
const { logSupabaseError } = require('./lib/supabase-logging');
const { inspectBadgeHtml } = require('./lib/badge-verification');
const { parseLeadCapturePayload } = require('./lib/lead-capture');
const { getLeadCaptureErrorMessage } = require('./lib/lead-capture-error');
const { renderBadgeSvg } = require('./lib/badges/svg');
const {
  getPublicBadgeData,
  toPublicBadgeJson,
  unavailableBadgeData,
} = require('./lib/badges/get-public-badge-data');
const { getUserBadgeEntitlement } = require('./lib/badges/entitlement');
const {
  classifyBadgePingInput,
  getBadgeInstallSummaryForDomain,
  normalizeBadgeHost,
  normalizeBadgeType,
  recordBadgePing,
} = require('./lib/badges/install-tracking');
const {
  calcCO2,
  gradeFor,
  percentileFromCarbon,
  totalGreenReductionPct,
} = require('./lib/metrics');

// ── App Initialization ─────────────────────────────
const app   = express();
const PORT  = Number(process.env.PORT) || 8080;
const supabaseAdminConfig = readSupabaseAdminConfig();
const supabase = createSupabaseAdminClient();

if (process.env.NODE_ENV !== 'production') {
  console.info('[startup-env]', {
    cwd: process.cwd(),
    envFilePath: ENV_FILE_PATH,
    hasSupabaseUrl: supabaseAdminConfig.hasUrl,
    hasSupabaseServiceRoleKey: supabaseAdminConfig.hasServiceRoleKey,
    hasLegacySupabaseServiceKey: supabaseAdminConfig.hasLegacyServiceKey,
    supabaseAdminKeySource: supabaseAdminConfig.keySource,
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

function getRequestedBadgeDomain(req) {
  return normalizeDomain(
    req.query.domain ||
    req.query.url ||
    req.query.site ||
    req.query.declared_domain ||
    req.query.declaredDomain ||
    req.query.detected_host ||
    req.query.detectedHost
  );
}

app.get('/api/badge/result/latest/data', badgeCors, limiterBadge, async (req, res) => {
  const requestedDomain = getRequestedBadgeDomain(req);
  const row = requestedDomain ? await getLatestResultRowByDomain(requestedDomain) : null;
  const data = applyBadgeRequestDomainState(toResultBadgeData(row, {
    badgeType: req.query.type,
    siteBase: resolveSiteBase(req),
    requestedDomain,
  }), req);

  res.set({
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=300,stale-while-revalidate=1800'
      : 'public,max-age=120',
  });
  return res.json(toPublicBadgeJson(data));
});

app.get('/api/badge/result/latest', badgeCors, limiterBadge, async (req, res) => {
  const requestedDomain = getRequestedBadgeDomain(req);
  const row = requestedDomain ? await getLatestResultRowByDomain(requestedDomain) : null;
  const data = applyBadgeRequestDomainState(toResultBadgeData(row, {
    badgeType: req.query.type,
    siteBase: resolveSiteBase(req),
    requestedDomain,
  }), req);
  const svg = renderBadgeSvg(data, getBadgeRenderOptions(req));

  res.set({
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=1800,stale-while-revalidate=86400'
      : 'public,max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  return res.status(200).send(svg);
});

app.get('/api/badge/result/:slug/data', badgeCors, limiterBadge, async (req, res) => {
  const row = await getResultRowBySlug(req.params.slug);
  const data = toResultBadgeData(row, {
    badgeType: req.query.type,
    siteBase: resolveSiteBase(req),
  });

  res.set({
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=300,stale-while-revalidate=1800'
      : 'public,max-age=120',
  });
  return res.json(toPublicBadgeJson(data));
});

app.get('/api/badge/result/:slug', badgeCors, limiterBadge, async (req, res) => {
  const row = await getResultRowBySlug(req.params.slug);
  const data = toResultBadgeData(row, {
    badgeType: req.query.type,
    siteBase: resolveSiteBase(req),
  });
  const svg = renderBadgeSvg(data, getBadgeRenderOptions(req));

  res.set({
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=1800,stale-while-revalidate=86400'
      : 'public,max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  return res.status(200).send(svg);
});

app.get('/api/badge/:token/data', badgeCors, limiterBadge, async (req, res) => {
  const data = applyBadgeRequestDomainState(await getPublicBadgeData(supabase, req.params.token, {
    siteBase: resolveSiteBase(req),
    markRequest: false,
    showMetric: true,
  }), req);

  res.set({
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=120,stale-while-revalidate=600'
      : 'public,max-age=60',
  });
  return res.json(toPublicBadgeJson(data));
});

app.get('/api/badge/:token', badgeCors, limiterBadge, async (req, res) => {
  const data = applyBadgeRequestDomainState(await getPublicBadgeData(supabase, req.params.token, {
    siteBase: resolveSiteBase(req),
    markRequest: true,
    showMetric: false,
  }), req);
  const svg = renderBadgeSvg(data, getBadgeRenderOptions(req));

  res.set({
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=3600,stale-while-revalidate=86400'
      : 'public,max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  return res.status(200).send(svg);
});

app.get('/api/badge.svg', badgeCors, limiterBadge, async (req, res) => {
  const token = req.query.token || req.query.publicToken || req.query.public_token;
  const requestedDomain = getRequestedBadgeDomain(req);
  let data;

  if (token) {
    data = applyBadgeRequestDomainState(await getPublicBadgeData(supabase, token, {
      siteBase: resolveSiteBase(req),
      markRequest: true,
      showMetric: false,
    }), req);
  } else if (requestedDomain || normalizeBadgeType(req.query.type || req.query.badge_type || 'carbon_tested') !== 'greentracer_verified') {
    const row = await getLatestResultRowByDomain(requestedDomain);
    data = applyBadgeRequestDomainState(toResultBadgeData(row, {
      badgeType: req.query.type || req.query.badge_type || 'carbon_tested',
      siteBase: resolveSiteBase(req),
      requestedDomain,
    }), req);
  } else {
    data = unavailableBadgeData(resolveSiteBase(req), 'token_required');
  }

  const svg = renderBadgeSvg(data, getBadgeRenderOptions(req));

  res.set({
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': data.publicStatus === 'active'
      ? 'public,max-age=3600,stale-while-revalidate=86400'
      : 'public,max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  return res.status(200).send(svg);
});

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
    if (isMissingSupabaseRelation(error, 'licenses')) {
      return res.status(503).json({
        error: 'License system is not configured.',
        code: 'LICENSE_TABLE_MISSING',
      });
    }

    logSupabaseError({
      route: 'GET /api/license/check',
      table: 'licenses',
      operation: 'select',
      error,
    });
    return res.status(500).json({ error: 'License lookup failed.' });
  }
  const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
  if (!row) return res.json({ licensed: false, status: 'none', domain: domain || null });

  const payload = mapLicensePublic(row);
  return res.json(payload);
});

app.get('/api/license/verify-badge', limiterLicenseRead, async (req, res) => {
  const domain = normalizeDomain(req.query.domain);
  const expectedBadgeTypeRaw = String(req.query.expectedBadgeType || '').toLowerCase();
  const expectedBadgeType = expectedBadgeTypeRaw
    ? normalizeBadgeType(expectedBadgeTypeRaw)
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
  const siteBase = resolveSiteBase(req);
  const apiBase = resolveApiBase(req);
  const { data, error } = await supabase
    .from('account_domains')
    .select('*')
    .eq('user_id', userId)
    .order('domain', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: 'Failed to load account domains.',
      details: process.env.NODE_ENV === 'production' ? undefined : (error.message || String(error))
    });
  }

  const domains = await Promise.all(
    (data || []).map(async (row) => {
      const license = await getLicenseStateForDomain(row.domain);
      const latestResult = await getLatestResultRowByDomain(row.domain);
      const reportUrl = buildReportUrl({ slug: latestResult?.slug, siteBase });
      const directoryUrl = buildDirectoryUrl({ domain: row.domain, siteBase });
      let badgeInstalls;
      try {
        const [carbonTested, greenHosting, greentracerVerified] = await Promise.all([
          getBadgeInstallSummaryForDomain(supabase, {
            domain: row.domain,
            badgeType: 'carbon_tested'
          }),
          getBadgeInstallSummaryForDomain(supabase, {
            domain: row.domain,
            badgeType: 'green_hosting'
          }),
          getBadgeInstallSummaryForDomain(supabase, {
            domain: row.domain,
            token: row.badge_public_token,
            badgeType: 'greentracer_verified'
          })
        ]);
        badgeInstalls = {
          carbon_tested: carbonTested,
          green_hosting: greenHosting,
          greentracer_verified: greentracerVerified
        };
      } catch (err) {
        const unavailableInstall = {
          state: 'unavailable',
          status: 'unavailable',
          label: 'Unavailable',
          lastSeenAt: null,
          loadCount: 0,
          detectedHost: null,
          declaredDomain: row.domain,
          badgeType: null,
          error: process.env.NODE_ENV === 'production' ? undefined : (err.message || String(err))
        };
        badgeInstalls = {
          carbon_tested: unavailableInstall,
          green_hosting: unavailableInstall,
          greentracer_verified: unavailableInstall
        };
      }
      const verifiedStatus = resolveVerifiedBadgeState({ row, license });

      return {
        domain: row.domain,
        verificationStatus: row.verification_status || 'pending',
        badgeEnabled: row.badge_enabled !== false,
        badgePublicToken: row.badge_public_token || null,
        license,
        latestResult: latestResult ? toPublicResult(latestResult) : null,
        badges: {
          carbon_tested: {
            badgeType: 'carbon_tested',
            status: 'active',
            label: 'Carbon Tested',
            reportUrl,
            embedCode: buildLoaderBadgeEmbedCode({
              badgeType: 'carbon_tested',
              domain: row.domain,
              resultSlug: latestResult?.slug || '',
              grade: latestResult?.grade,
              apiBase
            }),
            install: badgeInstalls.carbon_tested
          },
          green_hosting: {
            badgeType: 'green_hosting',
            status: latestResult?.green_host === true ? 'active' : 'green_hosting_not_detected',
            label: latestResult?.green_host === true ? 'Green Hosting Detected' : 'Green Hosting Checked',
            reportUrl,
            embedCode: buildLoaderBadgeEmbedCode({
              badgeType: 'green_hosting',
              domain: row.domain,
              resultSlug: latestResult?.slug || '',
              apiBase
            }),
            install: badgeInstalls.green_hosting
          },
          greentracer_verified: {
            badgeType: 'greentracer_verified',
            status: verifiedStatus,
            label: getDashboardBadgeStatusLabel(verifiedStatus),
            directoryUrl,
            embedCode: row.badge_public_token ? buildLoaderBadgeEmbedCode({
              badgeType: 'greentracer_verified',
              domain: row.domain,
              token: row.badge_public_token,
              apiBase
            }) : null,
            install: badgeInstalls.greentracer_verified
          }
        },
        badgeInstall: badgeInstalls.greentracer_verified
      };
    })
  );
  let badge;
  try {
    badge = await getUserBadgeEntitlement(supabase, userId, {
      siteBase,
      apiBase
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to load badge entitlement.',
      details: process.env.NODE_ENV === 'production' ? undefined : (err.message || String(err))
    });
  }

  return res.json({
    user: req.accountUser,
    domains,
    badge
  });
});

app.get('/api/account/me/badge', limiterLicenseRead, requireAccountAuth, async (req, res) => {
  try {
    const badge = await getUserBadgeEntitlement(supabase, req.accountUser.id, {
      siteBase: resolveSiteBase(req),
      apiBase: resolveApiBase(req)
    });
    return res.json(badge);
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to load badge entitlement.',
      details: process.env.NODE_ENV === 'production' ? undefined : (err.message || String(err))
    });
  }
});

app.post('/api/account/check-carbon', limiterCheck, requireAccountAuth, async (req, res) => {
  const site = normalizeScanUrl(req.body?.url || req.body?.domain);
  if (!site) return res.status(400).json({ error: 'Valid domain or URL is required.', code: 'VALIDATION_ERROR' });
  const siteBase = resolveSiteBase(req);

  let host;
  try {
    host = new URL(site).hostname;
  } catch {
    return res.status(400).json({ error: 'Bad URL.', code: 'VALIDATION_ERROR' });
  }

  try {
    const data = await performCarbonCheck(site, host);
    const accountLink = await attachAccountScanResult({
      userId: req.accountUser.id,
      result: data,
      requestedUrl: site,
    });
    if (req.accountUser.email) {
      sendResultReportEmail({
        to: req.accountUser.email,
        result: data,
        domain: accountLink.domain,
        siteBase,
      }).catch(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('[account/check-carbon] report email failed for', req.accountUser.email);
        }
      });
    }

    return res.json({
      ...data,
      accountLinked: true,
      accountDomain: accountLink.domain,
    });
  } catch (err) {
    console.error('[/api/account/check-carbon] failed:', err.message);
    const statusCode = Number(err.statusCode) || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Failed to run dashboard scan.' : err.message,
      code: err.code || (statusCode >= 500 ? 'ACCOUNT_SCAN_FAILED' : 'VALIDATION_ERROR'),
    });
  }
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
    notes = null,
    badge_public_token,
    badge_enabled,
    verification_status,
    is_public_verification_enabled,
    verified_at,
    latest_co2_per_page,
    latest_scan_at,
    latest_result_slug
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

  [
    ['badge_public_token', badge_public_token],
    ['badge_enabled', badge_enabled],
    ['verification_status', verification_status],
    ['is_public_verification_enabled', is_public_verification_enabled],
    ['verified_at', verified_at],
    ['latest_co2_per_page', latest_co2_per_page],
    ['latest_scan_at', latest_scan_at],
    ['latest_result_slug', latest_result_slug],
  ].forEach(([field, value]) => {
    if (value !== undefined) payload[field] = value;
  });

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
    'payment_reference', 'issued_token_or_key', 'notes',
    'badge_public_token', 'badge_enabled', 'verification_status',
    'is_public_verification_enabled', 'verified_at', 'latest_co2_per_page',
    'latest_scan_at', 'latest_result_slug'
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
  res.status(204).end();

  try {
    const body = req.body || {};
    const classified = await classifyBadgePingInput(supabase, {
      token: body.public_token || body.publicToken || body.badge_public_token || body.token,
      declaredDomain: body.declared_domain || body.declaredDomain || body.domain || body.site || body.url,
      detectedHost: body.detected_host || body.detectedHost || body.host || getRequestSourceHost(req),
      badgeType: body.badge_type || body.badgeType || body.type,
      resultSlug: body.result_slug || body.resultSlug || body.slug,
      sourceUrl: body.source_url || body.sourceUrl || getSafeBadgeSourceUrl(req),
    });

    await recordBadgePing(supabase, classified);
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
  if (cached) return res.json(cached);

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

app.get('/api/results/all-slugs', badgeCors, limiterLicenseRead, async (_req, res) => {
  const { data, error, status, statusText } = await supabase
    .from('results')
    .select('slug')
    .not('slug', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    logSupabaseError({
      route: 'GET /api/results/all-slugs',
      table: 'results',
      operation: 'select',
      error,
      status,
      statusText,
    });
    return res.status(500).json({ error: 'Failed to load public result slugs.' });
  }

  return res.json({
    slugs: (data || []).map((row) => row.slug).filter(Boolean),
  });
});

app.get('/api/results/:slug', badgeCors, limiterLicenseRead, async (req, res) => {
  const slug = normalizeResultSlug(req.params.slug);
  if (!slug) return res.status(404).json({ error: 'Result not found.' });

  const { data, error, status, statusText } = await supabase
    .from('results')
    .select('slug,url,green_host,carbon_estimate,percentile,reduction_pct,grade,created_at')
    .eq('slug', slug)
    .limit(1);

  if (error) {
    logSupabaseError({
      route: 'GET /api/results/:slug',
      table: 'results',
      operation: 'select',
      error,
      status,
      statusText,
    });
    return res.status(500).json({ error: 'Failed to load result.' });
  }

  const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
  if (!row) return res.status(404).json({ error: 'Result not found.' });

  return res.json(toPublicResult(row));
});

// ── Alias GET for /api/check-carbon ────────────────
app.get('/api/check-carbon', limiterCheck, async (req,res) => {
  return res.status(405).json({
    error: 'Use POST /api/check-carbon with url, contactEmail, and contactConsent.',
    code: 'METHOD_NOT_ALLOWED',
  });
});

// ── POST /api/check-carbon ─────────────────────────
app.post('/api/check-carbon', limiterCheck, async (req,res) => {
  const site = normalizeScanUrl(req.body.url || req.body.domain);
  if (!site) return res.status(400).json({ error:'Missing URL.', code: 'VALIDATION_ERROR' });
  let host;
  try { host = new URL(site).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.', code: 'VALIDATION_ERROR' }); }

  try {
    const lead = parseLeadCapturePayload(req.body || {}, {
      requireEmail: true,
      requireConsent: true
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
          // The scan result remains useful even if lead storage is temporarily unavailable.
        }

        sendResultReportEmail({
          to: lead.email,
          result: data,
          domain: normalizeDomain(data.url || site),
          siteBase: resolveSiteBase(req),
        }).catch((leadError) => {
          console.error('[/api/check-carbon POST] report email failed:', leadError.message);
        });
      }
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon POST] failed:', err.message);
    const statusCode = Number(err.statusCode) || 500;
    res.status(statusCode).json({
      error: statusCode >= 500 ? 'Failed to perform carbon check.' : err.message,
      code: err.code || (statusCode >= 500 ? 'SCAN_FAILED' : 'VALIDATION_ERROR'),
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

function normalizeResultSlug(value) {
  const slug = String(value || '').trim().toLowerCase().replace(/-+$/,'');
  if (!/^[a-z0-9-]{3,220}$/.test(slug)) return null;
  return slug;
}

function normalizeScanUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;

  try {
    const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!parsed.hostname) return null;
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

function toPublicResult(row) {
  const createdAt = row?.created_at || null;
  return {
    slug: row?.slug || null,
    url: row?.url || null,
    green_host: Boolean(row?.green_host),
    greenHost: Boolean(row?.green_host),
    carbon_estimate: Number(row?.carbon_estimate || 0),
    carbonEstimate: Number(row?.carbon_estimate || 0),
    percentile: Number(row?.percentile || 0),
    reduction_pct: Number(row?.reduction_pct || 0),
    reductionPct: Number(row?.reduction_pct || 0),
    grade: row?.grade || null,
    created_at: createdAt,
    createdAt,
    timestamp: createdAt ? new Date(createdAt).getTime() : null,
  };
}

async function getResultRowBySlug(slugInput) {
  const slug = normalizeResultSlug(slugInput);
  if (!slug) return null;

  const { data, error, status, statusText } = await supabase
    .from('results')
    .select('slug,url,green_host,carbon_estimate,percentile,reduction_pct,grade,created_at')
    .eq('slug', slug)
    .limit(1);

  if (error) {
    logSupabaseError({
      route: 'internal getResultRowBySlug',
      table: 'results',
      operation: 'select',
      error,
      status,
      statusText,
    });
    return null;
  }

  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function getLatestResultRowByDomain(domain) {
  const normalized = normalizeDomain(domain);
  if (!normalized) return null;

  const { data, error, status, statusText } = await supabase
    .from('results')
    .select('slug,url,green_host,carbon_estimate,percentile,reduction_pct,grade,created_at')
    .ilike('url', `%${normalized}%`)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) {
    logSupabaseError({
      route: 'internal getLatestResultRowByDomain',
      table: 'results',
      operation: 'select',
      error,
      status,
      statusText,
    });
    return null;
  }

  return (data || []).find((row) => normalizeDomain(row.url) === normalized) || null;
}

function buildReportUrl({ slug, siteBase }) {
  const base = trimPublicBaseUrl(siteBase, 'https://www.greentracer.org');
  return slug ? `${base}/result/${encodeURIComponent(slug)}` : null;
}

function buildDirectoryUrl({ domain, siteBase }) {
  const normalized = normalizeDomain(domain);
  const base = trimPublicBaseUrl(siteBase, 'https://www.greentracer.org');
  return normalized ? `${base}/verified/${encodeURIComponent(normalized)}` : null;
}

function escapeHtmlAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildLoaderBadgeEmbedCode({ badgeType, domain, token = '', resultSlug = '', apiBase }) {
  const type = normalizeBadgeType(badgeType);
  const api = trimPublicBaseUrl(apiBase, 'https://api.greentracer.org');
  const attrs = [
    'class="greentrace-badge"',
    `data-badge-type="${escapeHtmlAttr(type)}"`,
    `data-domain="${escapeHtmlAttr(domain || '')}"`,
  ];

  if (type === 'greentracer_verified') {
    attrs.push(`data-public-token="${escapeHtmlAttr(token)}"`);
  } else {
    if (resultSlug) attrs.push(`data-result-slug="${escapeHtmlAttr(resultSlug)}"`);
    if (!resultSlug && domain) attrs.push(`data-site="${escapeHtmlAttr(domain)}"`);
  }

  return `<div
  ${attrs.join('\n  ')}
></div>
<script src="${api}/greentrace-badge.js" async></script>`;
}

function resolveVerifiedBadgeState({ row, license }) {
  if (!license?.licensed) return license?.status && license.status !== 'none' ? 'licence_inactive' : 'not_active';
  const status = String(row?.verification_status || '').trim().toLowerCase();
  if (['verified', 'active', 'approved'].includes(status)) return 'active';
  return 'pending';
}

function getDashboardBadgeStatusLabel(status) {
  const labels = {
    active: 'Verified Supporter',
    pending: 'Verification pending',
    not_active: 'Badge not active',
    licence_inactive: 'Licence inactive',
    domain_mismatch: 'Domain mismatch',
    green_hosting_not_detected: 'Green hosting not detected',
    unavailable: 'Unavailable'
  };
  return labels[status] || labels.unavailable;
}

function toResultBadgeData(row, { badgeType, siteBase, requestedDomain } = {}) {
  const type = normalizeBadgeType(badgeType || 'carbon_tested');
  const result = row || null;
  const domain = normalizeDomain(result?.url) || normalizeDomain(requestedDomain);
  const reportUrl = buildReportUrl({ slug: result?.slug, siteBase });

  if (!result || !domain) {
    if (type === 'carbon_tested') {
      return {
        publicStatus: 'active',
        badgeType: type,
        label: 'Carbon Tested',
        domain: domain || null,
        showMetric: false,
        valueText: '',
        reportUrl: null,
        verificationUrl: null,
        isClickable: false,
        resultSlug: null,
        internalReason: 'result_missing_fail_open',
      };
    }

    return {
      publicStatus: type === 'green_hosting' ? 'green_hosting_not_detected' : 'not_active',
      badgeType: type,
      label: type === 'green_hosting' ? 'Green Hosting' : 'Badge not active',
      domain: domain || null,
      showMetric: false,
      valueText: '',
      reportUrl: null,
      verificationUrl: null,
      isClickable: false,
      resultSlug: null,
      internalReason: type === 'green_hosting' ? 'result_missing_fail_open' : 'result_missing',
    };
  }

  if (type === 'green_hosting' && result.green_host !== true) {
    return {
      publicStatus: 'green_hosting_not_detected',
      badgeType: type,
      label: 'Green Hosting',
      domain,
      latestScanAt: result.created_at || null,
      showMetric: false,
      valueText: '',
      reportUrl,
      verificationUrl: reportUrl,
      isClickable: Boolean(reportUrl),
      resultSlug: result.slug || null,
    };
  }

  const grade = String(result.grade || '').trim();
  return {
    publicStatus: 'active',
    badgeType: type,
    label: type === 'green_hosting' ? 'Green Hosting Detected' : 'Carbon Tested',
    domain,
    metric: result.carbon_estimate ?? null,
    metricText: null,
    showMetric: false,
    valueText: type === 'carbon_tested' && grade ? `Grade ${grade}` : '',
    gradeText: type === 'carbon_tested' && grade ? `Grade ${grade}` : '',
    latestScanAt: result.created_at || null,
    reportUrl,
    verificationUrl: reportUrl,
    isClickable: Boolean(reportUrl),
    resultSlug: result.slug || null,
  };
}

function trimPublicBaseUrl(value, fallback) {
  const raw = String(value || '').trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '');
  return fallback;
}

function normalizeDomain(input) {
  return typeof input === 'string' ? normalizeBadgeHost(input) : null;
}

function isMissingSupabaseRelation(error, relationName) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || '').toLowerCase();
  const relation = String(relationName || '').toLowerCase();
  return code === '42P01' || Boolean(relation && message.includes(`public.${relation}`) && message.includes('does not exist'));
}

function hostFromHeaderUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  try {
    return normalizeBadgeHost(new URL(raw).hostname);
  } catch {
    return normalizeBadgeHost(raw);
  }
}

function getSafeBadgeSourceUrl(req) {
  const raw = String(req.get('referer') || req.get('referrer') || req.get('origin') || '').trim();
  if (!raw || raw.length > 500) return '';
  try {
    const parsed = new URL(raw);
    parsed.username = '';
    parsed.password = '';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().slice(0, 500);
  } catch {
    return '';
  }
}

function getRequestSourceHost(req) {
  return (
    normalizeBadgeHost(req.query.detected_host || req.query.detectedHost || req.query.host) ||
    hostFromHeaderUrl(req.get('origin')) ||
    hostFromHeaderUrl(req.get('referer')) ||
    hostFromHeaderUrl(req.get('referrer')) ||
    null
  );
}

function getBadgeRenderOptions(req) {
  return {
    colors: {
      backgroundColor: req.query.bg || req.query.background || req.query.bgColor || req.query.backgroundColor,
      accentColor: req.query.accent || req.query.accentColor,
    },
  };
}

function applyBadgeRequestDomainState(data, req) {
  const type = normalizeBadgeType(data?.badgeType || req.query.type || req.query.badge_type || req.query.badgeType);
  if (type !== 'greentracer_verified') return data;

  const domain = normalizeBadgeHost(data?.domain);
  if (!domain) return data;

  const declaredDomain = normalizeBadgeHost(req.query.declared_domain || req.query.declaredDomain || req.query.domain);
  const detectedHost = normalizeBadgeHost(req.query.detected_host || req.query.detectedHost || req.query.host);
  const mismatch = (declaredDomain && declaredDomain !== domain) || (detectedHost && detectedHost !== domain);

  if (!mismatch) return data;

  return {
    ...data,
    publicStatus: 'domain_mismatch',
    label: 'Domain mismatch',
    metric: null,
    metricText: null,
    showMetric: false,
    internalReason: 'domain_mismatch',
  };
}

async function captureContactLead({ lead, siteUrl, domain, resultSlug }) {
  if (!lead?.shouldCapture || !lead.email || !domain || !siteUrl) return;

  if (!supabaseAdminConfig.hasUrl || !supabaseAdminConfig.key) {
    const configError = new Error('Lead capture backend is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    configError.code = 'CONFIG_MISSING';
    throw configError;
  }

  const payload = {
    email: lead.email,
    domain,
    site_url: siteUrl,
    source: lead.source || 'homepage_hero',
    consent_to_contact: true,
    result_slug: resultSlug || null,
    updated_at: new Date().toISOString()
  };

  const { error, status, statusText } = await supabase
    .from('contact_leads')
    .upsert(payload, { onConflict: 'email,domain,source' });

  if (error) {
    logSupabaseError({
      route: 'POST /api/check-carbon',
      table: 'contact_leads',
      operation: 'upsert',
      error,
      payload,
      status,
      statusText,
    });
    const wrappedError = new Error(getLeadCaptureErrorMessage({ ...error, status }));
    wrappedError.code = error.code || null;
    wrappedError.details = error.details || null;
    wrappedError.hint = error.hint || null;
    wrappedError.status = status || null;
    wrappedError.statusText = statusText || null;
    wrappedError.cause = error;
    throw wrappedError;
  }
}

async function sendResultReportEmail({ to, result, domain, siteBase }) {
  const reportEmailEnabled = String(process.env.REPORT_EMAIL_ENABLED || 'true').trim().toLowerCase();
  if (reportEmailEnabled === 'false' || reportEmailEnabled === '0' || reportEmailEnabled === 'off') return;

  const apiKey = String(process.env.SENDGRID_API_KEY || '').trim();
  if (!apiKey) return;

  const fromEmail = String(process.env.REPORT_FROM_EMAIL || '').trim();
  if (!fromEmail) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[report-email] REPORT_FROM_EMAIL is not configured.');
    }
    return;
  }

  if (!to || !result?.slug || !domain) return;
  const normalizedTo = String(to).trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedTo)) return;

  const base = trimPublicBaseUrl(siteBase, 'https://www.greentracer.org');
  const reportUrl = `${base}/result/${encodeURIComponent(result.slug)}`;
  const safeDomain = String(domain || '').trim().toLowerCase();
  const title = `${safeDomain || 'your domain'} Carbon Report`;
  const gradeText = result?.grade ? `Grade ${result.grade}` : 'Scan completed';
  const hostingText = result?.greenHost || result?.green_host ? 'Green hosting detected' : 'Green hosting not detected';
  const carbonText = result?.carbonEstimate || result?.carbon_estimate
    ? `Estimated carbon: ${Number(result.carbonEstimate ?? result.carbon_estimate).toFixed(1)}g CO₂/page`
    : '';

  const emailPayload = {
    personalizations: [
      {
        to: [{ email: normalizedTo }],
      },
    ],
    subject: `${title} — GreenTracer`,
    from: { email: fromEmail, name: 'GreenTracer' },
    content: [
      {
        type: 'text/plain',
        value: [
          `Hi,`,
          '',
          `${title} is ready.`,
          `Result: ${reportUrl}`,
          `Domain: ${safeDomain}`,
          `Grade: ${gradeText}`,
          `Carbon: ${carbonText}`,
          `Hosting: ${hostingText}`,
          '',
          'You can view your full report here: ' + reportUrl,
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
  };

  try {
    await axios.post('https://api.sendgrid.com/v3/mail/send', emailPayload, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[report-email] send failed:', err?.response?.status, err?.response?.data || err.message);
    }
    return;
  }
}

async function attachAccountScanResult({ userId, result, requestedUrl }) {
  const domain = normalizeDomain(result?.url || requestedUrl);
  if (!userId || !domain) {
    const error = new Error('Authenticated scan could not be linked to an account domain.');
    error.statusCode = 400;
    error.code = 'ACCOUNT_DOMAIN_INVALID';
    throw error;
  }

  const basePayload = {
    user_id: userId,
    domain,
  };
  const latestPayload = {
    ...basePayload,
    latest_co2_per_page: result?.carbonEstimate ?? result?.carbon_estimate ?? null,
    latest_scan_at: result?.createdAt || result?.created_at || new Date().toISOString(),
    latest_result_slug: result?.slug || null,
    updated_at: new Date().toISOString(),
  };

  const { error, status, statusText } = await supabase
    .from('account_domains')
    .upsert(latestPayload, { onConflict: 'user_id,domain' });

  if (!error) return { domain };

  if (String(error.message || '').includes('latest_') || String(error.message || '').includes('updated_at')) {
    const retry = await supabase
      .from('account_domains')
      .upsert(basePayload, { onConflict: 'user_id,domain' });

    if (!retry.error) return { domain };

    logSupabaseError({
      route: 'POST /api/account/check-carbon',
      table: 'account_domains',
      operation: 'upsert',
      error: retry.error,
      payload: basePayload,
      status: retry.status,
      statusText: retry.statusText,
    });
    const wrappedError = new Error('Failed to link dashboard scan to your account domain.');
    wrappedError.code = retry.error.code || 'ACCOUNT_SCAN_SAVE_FAILED';
    wrappedError.statusCode = 500;
    wrappedError.cause = retry.error;
    throw wrappedError;
  }

  logSupabaseError({
    route: 'POST /api/account/check-carbon',
    table: 'account_domains',
    operation: 'upsert',
    error,
    payload: latestPayload,
    status,
    statusText,
  });
  const wrappedError = new Error('Failed to link dashboard scan to your account domain.');
  wrappedError.code = error.code || 'ACCOUNT_SCAN_SAVE_FAILED';
  wrappedError.statusCode = 500;
  wrappedError.cause = error;
  throw wrappedError;
}

function mapLicensePublic(row) {
  const now = new Date();
  const endDate = row.end_date ? new Date(row.end_date) : null;
  const isExpired = !!(endDate && endDate < now);
  const activeStatuses = new Set(['active', 'trial', 'charity', 'partner', 'internal', 'non_profit', 'nonprofit', 'community', 'manual_lifetime']);
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
    badgePublicToken: row.badge_public_token || null,
    badgeEnabled: row.badge_enabled !== false,
    verificationStatus: row.verification_status || 'pending',
    publicVerificationEnabled: row.is_public_verification_enabled !== false,
    verifiedAt: row.verified_at || null,
    latestCo2PerPage: row.latest_co2_per_page ?? null,
    latestScanAt: row.latest_scan_at || null,
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

async function updateLicenseBadgeMetricFromResult(row) {
  const domain = normalizeDomain(row?.url);
  if (!domain || row?.carbon_estimate === undefined || row?.carbon_estimate === null) return;

  const updates = {
    latest_co2_per_page: Number(row.carbon_estimate),
    latest_scan_at: row.created_at || new Date().toISOString(),
    latest_result_slug: row.slug || null,
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('licenses')
      .update(updates)
      .eq('domain', domain);
    if (error) throw error;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[badge-metric] metric update skipped:', err.message);
    }
  }

  try {
    await supabase
      .from('account_domains')
      .update(updates)
      .eq('domain', domain);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[badge-metric] account domain metric update skipped:', err.message);
    }
  }
}

function resolveSiteBase(req) {
  const fromEnv = (process.env.SITE_URL || process.env.FRONTEND_URL || '').trim();
  if (/^https?:\/\//i.test(fromEnv)) return fromEnv.replace(/\/+$/, '');

  const origin = String(req.get('origin') || '').trim();
  if (/^https?:\/\//i.test(origin)) return origin.replace(/\/+$/, '');

  return 'https://www.greentracer.org';
}

function resolveApiBase(req) {
  const fromEnv = (process.env.API_PUBLIC_URL || process.env.API_BASE_URL || process.env.BACKEND_URL || '').trim();
  if (/^https?:\/\//i.test(fromEnv)) return fromEnv.replace(/\/+$/, '');

  const protocol = req.protocol || 'https';
  const host = String(req.get('host') || '').trim();
  if (host) return `${protocol}://${host}`.replace(/\/+$/, '');

  return 'https://api.greentracer.org';
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
  const { data: row, error, status, statusText } = await supabase
    .from('results')
    .select('slug,url,green_host,carbon_estimate,percentile,reduction_pct,grade,created_at')
    .eq('slug', s)
    .single();
  if (error) {
    if (status !== 406) {
      logSupabaseError({
        route: 'internal getCached',
        table: 'results',
        operation: 'select',
        error,
        status,
        statusText,
      });
    }
    return null;
  }
  if (error || !row) return null;
  if (TTL!==0 && Date.now() - new Date(row.created_at).getTime() > TTL) return null;
  return toPublicResult(row);
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

  const payload = {
    slug,
    url:             sizeInfo.finalUrl||norm,
    green_host:      green,
    carbon_estimate: carbon,
    percentile,
    reduction_pct:   reductionPct,
    grade,
    result_data:     { sizeInfo, carbon, percentile, reductionPct, grade, lighthouseScores, lighthouseMeta }
  };

  const { data: row, error, status, statusText } = await supabase
    .from('results')
    .upsert(payload, { onConflict: 'slug' })
    .select().single();

  if (error) {
    logSupabaseError({
      route: 'POST /api/check-carbon',
      table: 'results',
      operation: 'upsert',
      error,
      payload,
      status,
      statusText,
    });
    const wrappedError = new Error('Result save failed.');
    wrappedError.code = 'RESULT_SAVE_FAILED';
    wrappedError.statusCode = 500;
    wrappedError.cause = error;
    throw wrappedError;
  }

  await updateLicenseBadgeMetricFromResult(row);
  return toPublicResult(row);
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
