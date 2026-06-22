# Layer 1 — Packages & combinations

**Goal of this layer:** understand the reusable `@softeneers/*` packages and how
each template/toggle combination puts them to work. For just spinning up a
project, see [Layer 0](./layer-0-quickstart.md). For a deep, standalone reference
on any one package, see [Layer 2](./layer-2-reference/README.md).

## The packages at a glance

Every package is small, single-purpose, dependency-light, published to npm
(`0.1.0`), and usable on its own — install only what you need.

| Package | One-liner | Deep reference |
| ------- | --------- | -------------- |
| `@softeneers/config`  | Shared tsconfig / ESLint / Prettier presets so every project lints & types the same | [config](./layer-2-reference/config.md) |
| `@softeneers/env`     | Fail-fast, typed environment validation over Zod | [env](./layer-2-reference/env.md) |
| `@softeneers/db`      | A configured Sequelize/MySQL factory + connection helper | [db](./layer-2-reference/db.md) |
| `@softeneers/auth`    | Email+password auth on better-auth, with Node/Express helpers | [auth](./layer-2-reference/auth.md) |
| `@softeneers/email`   | Transactional email via Resend + React Email templates | [email](./layer-2-reference/email.md) |
| `@softeneers/storage` | S3-compatible object storage (S3 / R2 / MinIO) | [storage](./layer-2-reference/storage.md) |

Install any of them directly:

```bash
npm i @softeneers/env @softeneers/db @softeneers/auth
```

## How the templates compose them

The generator wires packages into a project based on the template and its
toggles. A toggle being **off** means that package isn't installed at all.

| | `env` | `db` | `auth` | `config` | `email` | `storage` |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| `express-api`    | always | `--db` | `--auth` | — | add it yourself | add it yourself |
| `hono-api`       | always | `--db` | `--auth` | — | add it yourself | add it yourself |
| `tanstack-start` | always | `--db` | `--auth` | — | add it yourself | add it yourself |
| `next-fullstack` | — | built-in MySQL | — | — | — | — |
| `minimal`        | — | — | — | — | — | — |

- **`env` is always present** in the API/fullstack templates — config should be
  validated before an app boots.
- **`db` and `auth`** light up their packages when you pass `--db` / `--auth`.
- **`config`, `email`, `storage`** aren't auto-wired yet; add them when you need
  them (each is one `npm i` plus a few lines — see its Layer 2 page).

## Taking advantage of each combination

Think of a generated project as a base you extend by turning packages on.

### Just an API (default)

`-t express-api` (or `hono-api`) with no toggles → a typed REST API with a CRUD
example backed by an in-memory store, and `@softeneers/env` validating config.
Great for prototypes and tests — zero infrastructure.

### API + database (`--db`)

Adds `@softeneers/db`: the CRUD now persists to MySQL via Sequelize, with tables
auto-created and seeded on first connect. If MySQL isn't running, the app
**falls back to the in-memory store**, so `npm run dev` always works. Promote to
real persistence by starting MySQL (`--docker` gives you a `docker-compose.yml`).

### API + auth (`--auth`)

Adds `@softeneers/auth`: better-auth is mounted at `/api/auth/*` with
email+password enabled. `sign-up`/`sign-in`/`get-session` work immediately
(better-auth uses an in-memory store until you give it a database).

### Fullstack (`tanstack-start`)

The same `env`/`db`/`auth` story, but the cars CRUD is driven through type-safe
**server functions** and rendered as a React UI. `--db`/`--auth` behave exactly
as above; the server functions keep the DB code off the client.

### Adding the rest

`@softeneers/email` (transactional mail) and `@softeneers/storage` (file
uploads) are independent — drop them into any template when a feature needs
them. Their Layer 2 pages have copy-paste setups.

## Where to go next

- **Spin something up:** [Layer 0 — Quickstart](./layer-0-quickstart.md)
- **Go deep on a package:** [Layer 2 — Reference](./layer-2-reference/README.md)
- **Why the framework is shaped this way:** [ARCHITECTURE.md](./ARCHITECTURE.md)
  and the authoritative [DECISIONS.md](./DECISIONS.md)
