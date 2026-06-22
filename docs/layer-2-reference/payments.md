# `@softeneers/payments`

Payments on [Stripe](https://stripe.com): a thin wrapper for **one-time
checkout, subscriptions, the billing portal, and verified webhooks**. The
boilerplate (client, session creation, signature verification) lives here; your
app wires the routes and supplies the keys.

## Install

```bash
npm i @softeneers/payments
```

Dependency: `stripe` (re-exported, so you don't add it twice).

## API

| Export | Purpose |
| ------ | ------- |
| `createStripe(secretKey, options?)` | Build a Stripe client (no network call) |
| `createCheckoutSession(stripe, opts)` | Checkout Session — `mode: "payment" \| "subscription"` |
| `createBillingPortalSession(stripe, opts)` | Billing portal for managing a subscription |
| `constructWebhookEvent(stripe, payload, signature, secret)` | Verify + parse a webhook (throws on a bad signature) |
| `Stripe` | The Stripe class, re-exported |

### `createCheckoutSession`

```ts
createCheckoutSession(stripe, {
  mode: "payment" | "subscription",
  priceId: string,            // a Stripe Price id; recurring for subscriptions
  successUrl: string,
  cancelUrl: string,
  quantity?: number,
  customer?: string,          // attach to an existing cus_…
  customerEmail?: string,
  metadata?: Record<string, string>,
}): Promise<Stripe.Checkout.Session> // use .url to redirect
```

### `constructWebhookEvent`

Pass the **raw** request body (never `JSON.parse` it first), the
`stripe-signature` header, and your `STRIPE_WEBHOOK_SECRET`. Returns a typed
`Stripe.Event`; throws if verification fails.

## Usage

```ts
import {
  createStripe, createCheckoutSession, createBillingPortalSession, constructWebhookEvent,
} from "@softeneers/payments";

const stripe = createStripe(process.env.STRIPE_SECRET_KEY);

const session = await createCheckoutSession(stripe, {
  mode: "subscription",
  priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
  successUrl: "https://app.example.com/billing?subscribed=1",
  cancelUrl: "https://app.example.com/billing?canceled=1",
});
// redirect the browser to session.url

// In your webhook route (raw body!):
const event = constructWebhookEvent(stripe, rawBody, signatureHeader, process.env.STRIPE_WEBHOOK_SECRET);
```

## How the templates use it

The **`--payments`** toggle wires three checkout flows and a verified webhook
into `express-api`, `hono-api`, and `tanstack-start`:

| Route | Does |
| ----- | ---- |
| `POST /api/payments/checkout`  | one-time Checkout Session |
| `POST /api/payments/subscribe` | subscription Checkout Session |
| `POST /api/payments/portal?customer=cus_…` | billing portal |
| `POST /api/webhooks/stripe`    | verifies the signature, handles `checkout.session.completed` + `customer.subscription.*` |

`tanstack-start` additionally ships a `/billing` page with **Buy** / **Subscribe**
buttons. The app boots fine without keys — the routes return Stripe errors until
you set them.

## Env

```
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
STRIPE_PRICE_ID=price_…               # one-time price
STRIPE_SUBSCRIPTION_PRICE_ID=price_…  # recurring price
```

Locally, forward webhooks with the Stripe CLI:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```
