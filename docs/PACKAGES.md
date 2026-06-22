# Packages

The reusable `@softeneers/*` libraries. Each entry is the **contract** a package
must meet to be considered "real" (see `ROADMAP.md` → Definition of done). Today
only `config` and `env` are scaffolded; the rest are planned.

A package is real when it: has `src/`, builds to `dist/`, exports the documented
surface, drops `"private": true`, and is consumed by at least one template.

---

## `@softeneers/config` — ✅ Sprint 3 (built)

Shared, opinionated tooling config so every project formats/lints/types the same.

- **Exports**: `./tsconfig/base.json`, `./eslint` (flat config array),
  `./prettier`; later `./tailwind`, `./tsup`.
- **Peer deps**: `@eslint/js`, `eslint`, `globals`, `prettier`, `typescript`,
  `typescript-eslint` (the consumer installs them).
- **Usage**: `{ "extends": "@softeneers/config/tsconfig/base.json" }`.

## `@softeneers/env` — ✅ Sprint 3 (built)

Fail-fast environment validation; an app must not boot with a bad `.env`.

- **Exports**: `createEnv({ schema, source? })` → frozen typed object;
  `EnvValidationError`; `z` (re-exported Zod).
- **Deps**: `zod`.
- **Usage**: `const env = createEnv({ schema: { PORT: z.coerce.number() } })`.

## `@softeneers/db` — ✅ Sprint 4 (built)

Configured Sequelize (MySQL) factory + connection helpers.

- **Exports**: `createDb(config)` → `Sequelize` (no connect); `assertConnection(db)`;
  re-exports `Sequelize`, `Model`, `DataTypes` (+ types).
- **Deps**: `sequelize` + `mysql2` (Drizzle/Prisma variants later).
- **Pairs with**: the template's `docker-compose.yml` MySQL recipe; `sequelize-cli`
  migrations/seeds in the consuming app.

## `@softeneers/auth` — Sprint 5

Authentication built on **better-auth**.

- **Exports**: `auth` (server instance), session helpers, Express middleware,
  frontend hooks, shared types.
- **Ships with**: login/register template wiring.

## `@softeneers/email` — Sprint 6

Transactional email.

- **Exports**: `sendEmail(...)`, React Email templates (welcome, reset password,
  invoice, order confirmation).
- **Deps**: `resend`, `react-email`.

## `@softeneers/storage` — Sprint 7

S3-compatible object storage (AWS S3, Cloudflare R2, MinIO, RustFS).

- **Exports**: `uploadFile(...)`, `getSignedUrl(...)`, client factory.
- **Deps**: `@aws-sdk/client-s3`.

## `@softeneers/logger` — later

Standard logger + request/error logging; pluggable sinks (PostHog, Axiom).

- **Exports**: `logger`, `requestLogger` middleware.

## `@softeneers/api` — later

Frontend↔backend communication: tRPC/oRPC helpers, shared types, typed client,
middleware. **Exports**: `api` client + router helpers.

## `@softeneers/ui` — later

Reusable React components (Button, Input, Card, Modal, Form, Layout) on Tailwind.

- **Exports**: named components, e.g. `import { Button } from "@softeneers/ui"`.

---

## Versioning

All packages version together via Changesets once publishing begins (Sprint 8).
Scoped packages publish with `npm publish --access public`.
