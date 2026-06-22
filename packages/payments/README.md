# @softeneers/payments

Payments for Softeneers projects: a thin [Stripe](https://stripe.com) wrapper for
**one-time checkout, subscriptions, the billing portal, and verified webhooks**.
The boilerplate is here; your app just wires the routes and supplies the keys.

## Usage

```ts
import {
  createStripe,
  createCheckoutSession,
  createBillingPortalSession,
  constructWebhookEvent,
} from "@softeneers/payments";

const stripe = createStripe(process.env.STRIPE_SECRET_KEY);

// One-time purchase
const session = await createCheckoutSession(stripe, {
  mode: "payment",
  priceId: process.env.STRIPE_PRICE_ID,
  successUrl: "http://localhost:4000/success",
  cancelUrl: "http://localhost:4000/cancel",
});
// redirect the browser to session.url

// Subscription + self-service billing portal
await createCheckoutSession(stripe, { mode: "subscription", priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID, /* … */ });
await createBillingPortalSession(stripe, { customer: "cus_…", returnUrl: "http://localhost:4000/account" });

// Webhook (pass the RAW body — never JSON.parse first)
const event = constructWebhookEvent(stripe, rawBody, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
```

## API

| Export | Purpose |
| ------ | ------- |
| `createStripe(secretKey, options?)` | Build a Stripe client (no network call) |
| `createCheckoutSession(stripe, opts)` | Checkout Session — `mode: "payment" \| "subscription"` |
| `createBillingPortalSession(stripe, opts)` | Billing portal for managing a subscription |
| `constructWebhookEvent(stripe, payload, signature, secret)` | Verify + parse a webhook event |
| `Stripe` | The Stripe class, re-exported |

## Env

```
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
STRIPE_PRICE_ID=price_…               # one-time price
STRIPE_SUBSCRIPTION_PRICE_ID=price_…  # recurring price
```

Dependency: `stripe`.
