# Softeneers Framework

A **modular fullstack project generator**. Not a from-scratch framework — a CLI
plus reusable packages built on top of established tools (Next.js, Express,
Sequelize/MySQL, better-auth, Docker). The goal is one command:

```bash
npx create-softeneers-app@latest my-app
```

…that scaffolds an organized, scalable, standardized project from a template.

**🌐 Live site:** <https://softeneers-landing.vercel.app>

> **Status:** live on npm. `create-softeneers-app` (and the six `@softeneers/*`
> packages) are published; the generator ships **five templates** — `next-fullstack`,
> `express-api`, `hono-api`, `tanstack-start`, `minimal` — with composable
> `db`/`auth`/`docker` toggles, each build-verified across its combinations. See
> [`docs/ROADMAP.md`](./docs/ROADMAP.md) and [`docs/CLI-SPEC.md`](./docs/CLI-SPEC.md).

## Monorepo map

```
apps/
  cli/          create-softeneers-app — the generator (working)
  docs/         static docs site, generated from the Markdown (npm run build)
  landing/      Next.js marketing site → https://softeneers-landing.vercel.app
packages/
  config/       @softeneers/config — shared tsconfig/eslint/prettier
  env/          @softeneers/env — env validation (Zod)
  db/           @softeneers/db — Sequelize/MySQL factory + helpers
  auth/         @softeneers/auth — better-auth + Express helpers
  email/        @softeneers/email — Resend + React Email templates
  storage/      @softeneers/storage — S3-compatible (S3/R2/MinIO)
templates/
  next-fullstack/   Next.js + Express + Sequelize + MySQL (seeded from a working monolith)
  express-api/      Express 5 + TypeScript REST API (cars CRUD) · db/auth/docker toggles
  hono-api/         Hono + TypeScript API (cars CRUD)           · db/auth/docker toggles
  tanstack-start/   TanStack Start fullstack React app          · db/auth/docker toggles
  minimal/          Zero-framework Node + TypeScript starter
```

Built with **npm workspaces + Turborepo** (npm-first; pnpm also works). Node ≥ 18.

## Documentation

The docs are organized in **three layers** (full index: [`docs/README.md`](./docs/README.md)):

| Layer / doc | What's in it |
| ----------- | ------------ |
| [Layer 0 — Quickstart](./docs/layer-0-quickstart.md) | Spin up & run a project in any combination |
| [Layer 1 — Packages](./docs/layer-1-packages.md) | The `@softeneers/*` packages and how combinations use them |
| [Layer 2 — Reference](./docs/layer-2-reference/README.md) | Each package as standalone software (full API) |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Layout, package vs template, conventions |
| [`docs/CLI-SPEC.md`](./docs/CLI-SPEC.md) | `create-softeneers-app` contract + toggle engine |
| [`docs/DECISIONS.md`](./docs/DECISIONS.md) | Authoritative decisions / tiebreaker |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Sprints and current status |
| [`docs/PUBLISHING.md`](./docs/PUBLISHING.md) | How packages get to npm |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Setup, conventions, adding packages/templates |

## Working in this repo

npm-first, but pnpm works too (both workspace configs ship).

```bash
npm install         # install workspace deps
npm run build       # turbo run build across packages + apps
npm run dev         # turbo run dev
npm run lint        # eslint . (single root pass)
npm run typecheck
```

The `next-fullstack` template is standalone — to run the generated-style app
directly, see [`templates/next-fullstack/README.md`](./templates/next-fullstack/README.md).

## Try the generator (from source)

```bash
npm run build
node apps/cli/dist/index.js my-app --yes   # or: node apps/cli/dist/index.js .   (current dir)
```

## What's next

The express/hono/tanstack templates already consume the published
`@softeneers/*` packages (`env`/`db`/`auth`) via their toggles. Remaining work:
convert `next-fullstack` to consume them too, expand the `auth` toggle into a
ready-made sign-in/up UI per template, and add `@softeneers/email`/`storage`
toggles. See [`docs/ROADMAP.md`](./docs/ROADMAP.md).
