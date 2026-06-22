import { Link, createFileRoute, useRouter } from '@tanstack/react-router'

import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/account')({ component: Account })

function Account() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="mx-auto max-w-sm p-8 text-gray-500">Loading…</div>
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-sm p-8">
        <p>You're not signed in.</p>
        <Link to="/login" className="mt-3 inline-block text-blue-600 hover:underline">
          Go to sign in →
        </Link>
      </div>
    )
  }

  async function signOut() {
    await authClient.signOut()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="mx-auto max-w-sm p-8">
      <h1 className="text-3xl font-bold">Account</h1>
      <p className="mt-3">
        Signed in as <strong>{session.user.email}</strong>
        {session.user.name ? ` (${session.user.name})` : ''}.
      </p>
      <button
        className="mt-6 rounded border border-gray-300 px-4 py-2 font-medium"
        type="button"
        onClick={signOut}
      >
        Sign out
      </button>
    </div>
  )
}
