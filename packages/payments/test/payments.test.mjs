import assert from "node:assert/strict";
import { test } from "node:test";

import { constructWebhookEvent, createStripe, Stripe } from "../dist/index.js";

test("createStripe builds a Stripe client without a network call", () => {
  const stripe = createStripe("sk_test_123");
  assert.ok(stripe instanceof Stripe);
});

test("constructWebhookEvent rejects an invalid signature", () => {
  const stripe = createStripe("sk_test_123");
  assert.throws(
    () => constructWebhookEvent(stripe, JSON.stringify({ id: "evt_1" }), "bad-sig", "whsec_x"),
    /signature/i,
  );
});

test("constructWebhookEvent verifies a correctly-signed payload", () => {
  const stripe = createStripe("sk_test_123");
  const secret = "whsec_testsecret";
  const payload = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  const event = constructWebhookEvent(stripe, payload, header, secret);
  assert.equal(event.type, "checkout.session.completed");
});
