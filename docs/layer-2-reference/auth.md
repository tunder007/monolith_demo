# `@softeneers/auth`

Authentication built on [better-auth](https://better-auth.com): a configured
server instance with **email+password** enabled by default, plus the Node/Express
integration helpers re-exported so you add a single dependency.

## Install

```bash
npm i @softeneers/auth
```

`better-auth` comes along as a dependency (and is partially re-exported).

## API

### `createAuth(options)`

```ts
function createAuth(options: AuthOptions): Auth;
```

Returns a better-auth instance with `emailAndPassword: { enabled: true }` merged
in; anything you pass overrides the defaults. Common options: `secret`,
`baseURL`, and `database` (a mysql2 pool / Kysely dialect / adapter). With no
`database`, better-auth uses an in-memory store — perfect for local dev.

### `getSession(auth, headers)`

Resolve the current session from Node/Express request headers; returns the
session payload or `null` when unauthenticated.

### Re-exports

- `toNodeHandler(auth)` — mount better-auth in Express/Node.
- `fromNodeHeaders(headers)` — convert Node headers to the Fetch `Headers` better-auth expects.
- `BetterAuthError`, and the `Auth` / `AuthOptions` types.

## Usage

**Express:**

```ts
import { createAuth, toNodeHandler } from "@softeneers/auth";

export const auth = createAuth({ secret: env.AUTH_SECRET, baseURL: env.AUTH_BASE_URL });

// Mount BEFORE express.json() — better-auth handles its own body parsing.
app.all("/api/auth/*splat", toNodeHandler(auth)); // Express 5 wildcard syntax
```

**Fetch-style frameworks (Hono, TanStack Start):**

```ts
// better-auth speaks the Fetch API — hand it the raw Request, return its Response.
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw)); // Hono
```

Once mounted, the standard better-auth endpoints work — e.g.
`POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`,
`GET /api/auth/get-session`.

## How the templates use it

The `--auth` toggle in `express-api` / `hono-api` / `tanstack-start` creates the
instance and mounts it at `/api/auth/*`. Because better-auth falls back to an
in-memory store, sign-up/in work on `npm run dev` with no database. Set a strong
`AUTH_SECRET` and give better-auth a real `database` before production.

## Roadmap

Ready-made sign-in / sign-up UI per template (currently you wire
`better-auth/react` yourself on the client).
