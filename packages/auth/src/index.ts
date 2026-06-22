import type { IncomingHttpHeaders } from "node:http";

import { betterAuth } from "better-auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

// Express/Node integration helpers, re-exported so consumers add one dependency.
export { fromNodeHeaders, toNodeHandler };
export { BetterAuthError } from "better-auth";

export type AuthOptions = Parameters<typeof betterAuth>[0];

/**
 * Create a configured better-auth instance with email+password enabled by
 * default. Pass `database` (a mysql2 Pool, Kysely dialect, or adapter — anything
 * better-auth accepts), `secret`, and `baseURL`; any option you pass overrides
 * the defaults.
 *
 * @example
 * import { createAuth, toNodeHandler } from "@softeneers/auth";
 * export const auth = createAuth({ database: pool, secret: env.AUTH_SECRET, baseURL: env.BASE_URL });
 * app.all("/api/auth/*", toNodeHandler(auth)); // Express
 */
export function createAuth(options: AuthOptions) {
  return betterAuth({
    emailAndPassword: { enabled: true },
    ...options,
  });
}

/** The configured auth instance type (inferred from {@link createAuth}). */
export type Auth = ReturnType<typeof createAuth>;

/**
 * Resolve the current session from Node/Express request headers. Returns the
 * better-auth session payload, or null when unauthenticated.
 */
export function getSession(auth: Auth, headers: IncomingHttpHeaders) {
  return auth.api.getSession({ headers: fromNodeHeaders(headers) });
}
