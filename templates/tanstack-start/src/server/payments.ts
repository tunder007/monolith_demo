import { createServerFn } from '@tanstack/react-start'

import { createBillingPortalSession, createCheckoutSession, createStripe } from '@softeneers/payments'

import { env } from './env'

const stripe = createStripe(env.STRIPE_SECRET_KEY)

// Server functions: the browser calls these directly; the Stripe secret key
// never leaves the server. Each returns a URL to redirect the browser to.
export const startCheckout = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await createCheckoutSession(stripe, {
    mode: 'payment',
    priceId: env.STRIPE_PRICE_ID,
    successUrl: `${env.APP_URL}/billing?paid=1`,
    cancelUrl: `${env.APP_URL}/billing?canceled=1`,
  })
  return { url: session.url }
})

export const startSubscription = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await createCheckoutSession(stripe, {
    mode: 'subscription',
    priceId: env.STRIPE_SUBSCRIPTION_PRICE_ID,
    successUrl: `${env.APP_URL}/billing?subscribed=1`,
    cancelUrl: `${env.APP_URL}/billing?canceled=1`,
  })
  return { url: session.url }
})

export const openBillingPortal = createServerFn({ method: 'POST' })
  .validator((customer: unknown) => String(customer ?? ''))
  .handler(async ({ data: customer }) => {
    if (!customer) throw new Error('A Stripe customer id (cus_…) is required.')
    const session = await createBillingPortalSession(stripe, {
      customer,
      returnUrl: `${env.APP_URL}/billing`,
    })
    return { url: session.url }
  })
