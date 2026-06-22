import { createStripe } from "@softeneers/payments";

import { env } from "../env.js";

// A Stripe client. No network call until you actually create a session.
export const stripe = createStripe(env.STRIPE_SECRET_KEY);
