# Softeneers Framework

A **modular fullstack project generator**. Not a from-scratch framework — a CLI
plus reusable packages built on top of established tools (Next.js, Express,
Sequelize/MySQL, better-auth, Docker). The goal is one command:

```bash
npx create-softeneers-app@latest my-app
```

…that scaffolds an organized, scalable, standardized project from a template.

> **Status:** the monorepo, the `next-fullstack` template, the CLI, and the
> `@softeneers/config` + `@softeneers/env` packages work end-to-end —
> `create-softeneers-app` generates an installable, buildable project (verified
> under npm). The remaining `@softeneers/*` packages are planned. See
> [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Monorepo map

```
apps/
  cli/          create-softeneers-app — the generator (working)
  docs/         documentation site (future)
packages/
  config/       @softeneers/config — shared tsconfig/eslint/prettier (built)
  env/          @softeneers/env — env validation (built)
templates/
  next-fullstack/   Next.js + Express + Sequelize + MySQL (seeded from a working monolith)
```

Built with **npm workspaces + Turborepo** (npm-first; pnpm also works). Node ≥ 18.

## Documentation

| Doc                                              | What's in it                                         |
| ------------------------------------------------ | ---------------------------------------------------- |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Layout, package vs template, data flow, conventions  |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md)           | The 8 sprints, the MVP, current status               |
| [`docs/CLI-SPEC.md`](./docs/CLI-SPEC.md)         | `create-softeneers-app` prompts + algorithm          |
| [`docs/PACKAGES.md`](./docs/PACKAGES.md)         | Contract for each `@softeneers/*` package            |
| [`TODO.md`](./TODO.md)                           | The original getting-started plan (source of intent) |

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

**Sprint 4**: `@softeneers/db` (Sequelize + mysql2) with a Docker MySQL recipe,
migrations and seed helpers, consumed by the `next-fullstack` template. See the
roadmap for the full sequence.
