import { Router } from "express";

import { createBillingPortalSession, createCheckoutSession } from "@softeneers/payments";

import { env } from "../env.js";
import { stripe } from "./stripe.js";

export const paymentsRouter = Router();

// One-time purchase → returns a Stripe Checkout URL to redirect the browser to.
paymentsRouter.post("/checkout", async (_req, res) => {
  const session = await createCheckoutSession(stripe, {
    mode: "payment",
    priceId: env.STRIPE_PRICE_ID,
    successUrl: `${env.APP_URL}/?paid=1`,
    cancelUrl: `${env.APP_URL}/?canceled=1`,
  });
  res.json({ url: session.url });
});

// Subscription checkout.
paymentsRouter.post("/subscribe", async (_req, res) => {
  const session = await createCheckoutSession(stripe, {
    mode: "subscription",
    priceId: env.STRIPE_SUBSCRIPTION_PRICE_ID,
    successUrl: `${env.APP_URL}/?subscribed=1`,
    cancelUrl: `${env.APP_URL}/?canceled=1`,
  });
  res.json({ url: session.url });
});

// Billing portal so a customer can manage their subscription. Pass ?customer=cus_…
paymentsRouter.post("/portal", async (req, res) => {
  const customer = String(req.query.customer ?? "");
  if (!customer) {
    res.status(400).json({ message: "A Stripe customer id (?customer=cus_…) is required." });
    return;
  }
  const session = await createBillingPortalSession(stripe, {
    customer,
    returnUrl: `${env.APP_URL}/`,
  });
  res.json({ url: session.url });
});
