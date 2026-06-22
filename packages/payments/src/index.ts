import Stripe from "stripe";

// Re-export Stripe so consumers don't add a second dependency or risk a version skew.
export { Stripe };
export type { Stripe as StripeNamespace };

/** Options accepted by the Stripe constructor (version-robust). */
export type StripeOptions = ConstructorParameters<typeof Stripe>[1];

/** Create a Stripe client. Does not make any network call. */
export function createStripe(secretKey: string, options?: StripeOptions): Stripe {
  return new Stripe(secretKey, options);
}

export interface CheckoutOptions {
  /** `"payment"` for a one-time purchase, `"subscription"` for recurring. */
  mode: "payment" | "subscription";
  /** A Stripe Price id (`price_…`). For `subscription`, use a recurring price. */
  priceId: string;
  quantity?: number;
  /** Where Stripe redirects after a successful checkout. */
  successUrl: string;
  /** Where Stripe redirects if the customer cancels. */
  cancelUrl: string;
  /** Attach to an existing Stripe customer (`cus_…`). */
  customer?: string;
  /** Pre-fill the email (Stripe creates/links a customer). Ignored if `customer` is set. */
  customerEmail?: string;
  /** Arbitrary key/values echoed back on the resulting objects + webhook events. */
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe Checkout Session for a one-time payment or a subscription, and
 * return it (use `.url` to redirect the browser).
 */
export function createCheckoutSession(
  stripe: Stripe,
  options: CheckoutOptions,
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: options.mode,
    line_items: [{ price: options.priceId, quantity: options.quantity ?? 1 }],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: options.customer,
    customer_email: options.customer ? undefined : options.customerEmail,
    metadata: options.metadata,
  });
}

export interface BillingPortalOptions {
  /** The Stripe customer (`cus_…`) whose subscription to manage. */
  customer: string;
  /** Where Stripe returns the customer after they're done. */
  returnUrl: string;
}

/**
 * Create a Billing Portal session so a customer can manage their subscription,
 * payment methods, and invoices. Return it (use `.url` to redirect).
 */
export function createBillingPortalSession(
  stripe: Stripe,
  options: BillingPortalOptions,
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: options.customer,
    return_url: options.returnUrl,
  });
}

/**
 * Verify and parse a Stripe webhook. `payload` must be the **raw** request body
 * (string or Buffer — do not JSON.parse it first), `signature` the
 * `stripe-signature` header, and `webhookSecret` your `STRIPE_WEBHOOK_SECRET`.
 * Throws `Stripe.errors.StripeSignatureVerificationError` if verification fails.
 */
export function constructWebhookEvent(
  stripe: Stripe,
  payload: string | Buffer,
  signature: string,
  webhookSecret: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
