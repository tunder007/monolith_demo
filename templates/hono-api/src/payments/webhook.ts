import type { Context } from "hono";

import { constructWebhookEvent } from "@softeneers/payments";

import { env } from "../env.js";
import { stripe } from "./stripe.js";

// Stripe webhook handler. Reads the raw body via c.req.text() (needed for
// signature verification) and handles both payment and subscription events.
export async function stripeWebhook(c: Context) {
  const signature = c.req.header("stripe-signature");
  if (!signature) return c.text("Missing stripe-signature header.", 400);

  let event;
  try {
    event = constructWebhookEvent(stripe, await c.req.text(), signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return c.text("Invalid signature.", 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("✓ checkout.session.completed", event.data.object.id);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log(`✓ ${event.type}`, event.data.object.id);
      break;
    default:
      console.log("Unhandled Stripe event:", event.type);
  }

  return c.json({ received: true });
}
