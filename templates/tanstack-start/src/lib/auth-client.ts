import { createAuthClient } from 'better-auth/react'

// Talks to the better-auth routes mounted at /api/auth/* (same origin).
export const authClient = createAuthClient()
