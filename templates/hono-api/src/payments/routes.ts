import { Hono } from "hono";

import { createBillingPortalSession, createCheckoutSession } from "@softeneers/payments";

import { env } from "../env.js";
import { stripe } from "./stripe.js";

export const payments = new Hono();

// One-time purchase → returns a Stripe Checkout URL.
payments.post("/checkout", async (c) => {
  const session = await createCheckoutSession(stripe, {
    mode: "payment",
    priceId: env.STRIPE_PRICE_ID,
    successUrl: `${env.APP_URL}/?paid=1`,
    cancelUrl: `${env.APP_URL}/?canceled=1`,
  });
  return c.json({ url: session.url });
});

// Subscription checkout.
payments.post("/subscribe", async (c) => {
  const session = await createCheckoutSession(stripe, {
    mode: "subscription",
    priceId: env.STRIPE_SUBSCRIPTION_PRICE_ID,
    successUrl: `${env.APP_URL}/?subscribed=1`,
    cancelUrl: `${env.APP_URL}/?canceled=1`,
  });
  return c.json({ url: session.url });
});

// Billing portal — pass ?customer=cus_…
payments.post("/portal", async (c) => {
  const customer = c.req.query("customer") ?? "";
  if (!customer) return c.json({ message: "A Stripe customer id (?customer=cus_…) is required." }, 400);
  const session = await createBillingPortalSession(stripe, {
    customer,
    returnUrl: `${env.APP_URL}/`,
  });
  return c.json({ url: session.url });
});
