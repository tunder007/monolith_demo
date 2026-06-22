# Layer 2 — Reference

**Goal of this layer:** treat each `@softeneers/*` package as a standalone piece
of software — what it is, its full API, how to use it, and what it depends on.
Each page stands on its own; you can adopt any package without the rest.

For the bird's-eye view of how packages combine, see
[Layer 1](../layer-1-packages.md). To just scaffold a project, see
[Layer 0](../layer-0-quickstart.md).

## Packages

- [`@softeneers/config`](./config.md) — shared tsconfig / ESLint / Prettier presets
- [`@softeneers/env`](./env.md) — typed, fail-fast environment validation
- [`@softeneers/db`](./db.md) — Sequelize/MySQL factory + connection helper
- [`@softeneers/auth`](./auth.md) — email+password auth on better-auth
- [`@softeneers/email`](./email.md) — transactional email via Resend + React Email
- [`@softeneers/storage`](./storage.md) — S3-compatible object storage

Each is published to npm at `0.1.0`, ships TypeScript types and a `node:test`
suite, and builds from `src/` to `dist/`.
