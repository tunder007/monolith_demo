import { createFileRoute } from '@tanstack/react-router'

import { constructWebhookEvent, createStripe } from '@softeneers/payments'

import { env } from '../../../server/env'

const stripe = createStripe(env.STRIPE_SECRET_KEY)

// Catch-all Stripe webhook server route. Reads the raw body for signature
// verification and handles both payment and subscription events.
export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get('stripe-signature')
        if (!signature) return new Response('Missing stripe-signature header.', { status: 400 })

        let event
        try {
          event = constructWebhookEvent(stripe, await request.text(), signature, env.STRIPE_WEBHOOK_SECRET)
        } catch (error) {
          console.error('Stripe webhook signature verification failed:', error)
          return new Response('Invalid signature.', { status: 400 })
        }

        switch (event.type) {
          case 'checkout.session.completed':
            console.log('✓ checkout.session.completed', event.data.object.id)
            break
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            console.log(`✓ ${event.type}`, event.data.object.id)
            break
          default:
            console.log('Unhandled Stripe event:', event.type)
        }

        return Response.json({ received: true })
      },
    },
  },
})
