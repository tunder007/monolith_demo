import type { Request, Response } from "express";

import { constructWebhookEvent } from "@softeneers/payments";

import { env } from "../env.js";
import { stripe } from "./stripe.js";

// Stripe webhook. Mounted with express.raw() in index.ts because signature
// verification needs the raw request body. Handles both the one-time-payment
// and subscription event sets.
export function stripeWebhookHandler(req: Request, res: Response): void {
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string") {
    res.status(400).send("Missing stripe-signature header.");
    return;
  }

  let event;
  try {
    event = constructWebhookEvent(stripe, req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    res.status(400).send("Invalid signature.");
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: fulfil the order / mark the user as paid.
      console.log("✓ checkout.session.completed", event.data.object.id);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // TODO: sync the subscription state to your database.
      console.log(`✓ ${event.type}`, event.data.object.id);
      break;
    default:
      console.log("Unhandled Stripe event:", event.type);
  }

  res.json({ received: true });
}
