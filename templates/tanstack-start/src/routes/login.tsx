import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/login')({ component: Login })

function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const res =
      mode === 'in'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name })
    setBusy(false)
    if (res.error) {
      setError(res.error.message ?? 'Something went wrong.')
      return
    }
    router.navigate({ to: '/account' })
  }

  return (
    <div className="mx-auto max-w-sm p-8">
      <h1 className="text-3xl font-bold">{mode === 'in' ? 'Sign in' : 'Create account'}</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === 'up' && (
          <input
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
          type="submit"
          disabled={busy}
        >
          {mode === 'in' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <button
        className="mt-4 text-sm text-gray-500 hover:underline"
        type="button"
        onClick={() => setMode(mode === 'in' ? 'up' : 'in')}
      >
        {mode === 'in' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
      </button>
    </div>
  )
}
