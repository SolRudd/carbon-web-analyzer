# Stripe Test-Mode Sign-Off (GreenTracer)

Use this checklist to verify the paid flow end-to-end in local test mode.

## 1) Required backend env (`backend/.env`)

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_VERIFIED_BADGE=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=http://localhost:5173
```

Keep existing required backend keys too (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, etc).

## 2) Stripe Dashboard setup

1. Use Stripe **Test Mode**.
2. Create one product/price for the Verified Badge License.
3. Copy the `price_...` id into `STRIPE_PRICE_ID_VERIFIED_BADGE`.

## 3) Local webhook forwarding

Run Stripe CLI in a new terminal:

```bash
stripe listen --forward-to http://localhost:8080/api/stripe/webhook
```

Copy the emitted `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

## 4) Start app

```bash
# terminal A
cd backend && npm start

# terminal B
npm run dev
```

## 5) Paid flow test

1. Open `http://localhost:5173/pricing`.
2. Enter a valid domain (e.g. `example.com`) in the checkout domain field.
3. Click `Start Test Checkout` or plan CTA.
4. Complete Stripe checkout with a test card.
5. Confirm redirect to `/license-status?checkout=success&domain=...`.
6. Confirm license status becomes `active` (poll may take a few seconds).

## 6) Dashboard verification

1. Log in and open `/dashboard`.
2. Add the same domain if not linked already.
3. Click `Refresh statuses`.
4. Confirm domain row shows status `active` and member badge eligibility.

## 7) Negative checks

- Cancel checkout: confirm return to `/pricing?checkout=cancel&domain=...` with cancel message.
- Failed async payment: ensure webhook can set status back to `inactive` where appropriate.

## 8) Notes

- Stripe activation is webhook-driven; success redirect alone is not considered final activation.
- Existing free badge behavior remains non-blocking.
