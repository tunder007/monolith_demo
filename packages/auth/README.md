# @softeneers/auth

Authentication built on [better-auth](https://better-auth.com): a configured
server instance plus Express/Node helpers.

## Usage

```ts
import { createAuth, toNodeHandler, getSession } from "@softeneers/auth";

export const auth = createAuth({
  database: pool, // a mysql2 Pool (e.g. from your DB layer), Kysely dialect, or adapter
  secret: env.AUTH_SECRET,
  baseURL: env.BASE_URL,
});

// Express: mount better-auth's routes
app.all("/api/auth/*", toNodeHandler(auth));

// Read the current session in a route
app.get("/me", async (req, res) => {
  const session = await getSession(auth, req.headers);
  res.json(session); // null when unauthenticated
});
```

## API

- `createAuth(options)` — better-auth instance; email+password enabled by
  default, every option overridable.
- `getSession(auth, headers)` — session payload (or `null`) from Node headers.
- Re-exports `toNodeHandler`, `fromNodeHeaders`, `BetterAuthError`, and the
  `Auth` / `AuthOptions` types.

Pair with [`@softeneers/db`](../db/README.md) for the database and
[`@softeneers/env`](../env/README.md) to validate `AUTH_SECRET` / `BASE_URL`.
A login/register UI for the `next-fullstack` template is tracked in the roadmap.
