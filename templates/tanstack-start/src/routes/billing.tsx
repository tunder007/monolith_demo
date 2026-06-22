import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { startCheckout, startSubscription } from '../server/payments'

export const Route = createFileRoute('/billing')({ component: Billing })

function Billing() {
  const [status, setStatus] = useState({ paid: false, subscribed: false, canceled: false })

  // Read the Stripe redirect result on the client (avoids a hydration mismatch).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setStatus({
      paid: p.get('paid') === '1',
      subscribed: p.get('subscribed') === '1',
      canceled: p.get('canceled') === '1',
    })
  }, [])

  async function buy() {
    const { url } = await startCheckout()
    if (url) window.location.href = url
  }
  async function subscribe() {
    const { url } = await startSubscription()
    if (url) window.location.href = url
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="mt-1 text-gray-500">Stripe checkout — add your keys to .env and this just works.</p>

      {status.paid && (
        <p className="mt-4 rounded bg-green-50 p-3 text-green-700">Payment successful — thank you!</p>
      )}
      {status.subscribed && (
        <p className="mt-4 rounded bg-green-50 p-3 text-green-700">You're subscribed — thank you!</p>
      )}
      {status.canceled && (
        <p className="mt-4 rounded bg-yellow-50 p-3 text-yellow-700">Checkout canceled.</p>
      )}

      <div className="mt-6 flex gap-3">
        <button className="rounded bg-black px-5 py-2.5 font-medium text-white" type="button" onClick={buy}>
          Buy once
        </button>
        <button
          className="rounded border border-gray-300 px-5 py-2.5 font-medium"
          type="button"
          onClick={subscribe}
        >
          Subscribe
        </button>
      </div>
    </div>
  )
}
