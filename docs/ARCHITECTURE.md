# Architecture

Softeneers Framework is **not** a from-scratch framework like Next.js. It is a
**modular project generator plus a set of reusable packages** built on top of
established tools. The deliverable users touch is one command:

```bash
npx create-softeneers-app@latest my-app
```

This document describes how the monorepo that produces that command is laid out.

## Monorepo layout

```
softeneers-framework/
  apps/
    cli/          create-softeneers-app — the generator binary
    docs/         documentation site (future)
  packages/
    config/       @softeneers/config — shared tsconfig/eslint/prettier
    env/          @softeneers/env — env validation
    (db, auth, email, storage, logger, api, ui — added per ROADMAP)
  templates/
    next-fullstack/   the project the CLI copies; a mini-monorepo itself
  package.json          root, private, workspace orchestrator
  pnpm-workspace.yaml   workspace members (apps/*, packages/* — NOT templates/*)
  turbo.json            task pipeline
```

Tooling: **npm workspaces + Turborepo**, npm-first but package-manager-agnostic.
The repo ships both an npm `workspaces` field and a `pnpm-workspace.yaml`, so it
works with **npm or pnpm**; `packageManager` is pinned to npm (Turbo requires it
to resolve the workspace). The committed lockfile is `package-lock.json`;
`pnpm-lock.yaml` is gitignored. Node ≥ 18.

## The two kinds of directories

There is one distinction that drives every decision in this repo:

| Kind         | Lives in      | Workspace member? | Role                                                   |
| ------------ | ------------- | ----------------- | ------------------------------------------------------ |
| **Package**  | `packages/*`  | yes               | Published `@softeneers/*` libraries, consumed by apps  |
| **App**      | `apps/*`      | yes               | Things we run/build here (the CLI, the docs site)      |
| **Template** | `templates/*` | **no**            | Source copied _verbatim_ into a generated user project |

Templates are deliberately excluded from the workspace globs (both the npm
`workspaces` field and `pnpm-workspace.yaml`). They are payload, not code we link
against — if a PM hoisted their deps or symlinked them, the copy the CLI ships
would be wrong. A template is a self-contained project that happens to live in
this repo, and it is itself PM-agnostic (ships both workspace configs; the CLI
writes its `packageManager` field to match the user's chosen PM at generation).

## The `next-fullstack` template

This is the first template and is seeded from a working monolith (Next.js +
Express + Sequelize + MySQL, a cars CRUD). It is itself a mini-monorepo so the
generated project matches the structure in `TODO.md` §11:

```
templates/next-fullstack/
  apps/
    web/      Next.js 16 + React 19 + Tailwind v4   (the browser app)
    server/   Express 5 + Sequelize 6 + mysql2      (the JSON API)
  packages/   (config, env — wired in a later sprint)
  docker-compose.yml   MySQL 8 for local dev
  package.json (npm workspaces) / pnpm-workspace.yaml / turbo.json
  .env.example
```

### Request / data flow

```
Browser ──HTTP──▶ apps/web (Next.js)
                     │  fetch(`${API_URL}/api/cars`)
                     ▼
                 apps/server (Express)  ── /api/cars router ──▶ controller
                     │
                     ▼
                 Sequelize models ──▶ MySQL (docker-compose)
```

- `apps/web` talks to the API base URL (configurable; defaults to
  `http://localhost:4000`). The cars UI lives at `app/masini/page.tsx`.
- `apps/server` exposes `/health` and `/api/cars` (full CRUD). DB credentials
  come from env via `config/config.cjs`; migrations + seeders under
  `migrations/` and `seeders/` are driven by `sequelize-cli`.

## Conventions

- **Package names**: every shared library is scoped `@softeneers/<name>` and
  imported by that name (`import { env } from "@softeneers/env"`).
- **Module system**: framework tooling (root, CLI, packages) is ESM
  (`"type": "module"`). The seeded `server` template is currently CommonJS —
  migrating it is a later, optional task (see ROADMAP).
- **Build tooling lives at the root**, not per-package (one `typescript`, `tsx`,
  `eslint`, etc., hoisted and shared). Per-package tooling devDeps caused npm to
  leave dangling `.bin` symlinks, so packages declare only their own runtime
  deps; shared tooling is a root concern. `@softeneers/config` lists the lint
  stack as `peerDependencies` (for publish correctness) — the consumer provides them.
- **Task running**: never call a tool directly at the root; go through Turbo
  (`npm run build` → `turbo run build`) so caching and topological order apply.
  Lint is the one exception — a single root `eslint .` pass (`npm run lint`).
- **Templates never import `@softeneers/*` from this workspace.** When a
  template needs a package it depends on the published version (after the
  package is real and the template is converted). Today they are plain,
  standalone apps.

## Build & dependency graph

`turbo.json` defines `build`, `dev`, `typecheck`, `clean`. `build` and
`typecheck` depend on upstream builds (`^build`) so `packages/*` compile before
the apps that consume them. `dev` is persistent and uncached. The CLI `build`
declares both `dist/**` and `templates/**` as outputs so the bundled templates
are cached and restored. Lint runs outside Turbo (root `eslint .`).

## Status

The monorepo, the `next-fullstack` template, the CLI (`create-softeneers-app`),
and the `@softeneers/config` + `@softeneers/env` packages are implemented and
verified. The remaining `@softeneers/*` packages are planned. See
[`ROADMAP.md`](./ROADMAP.md) for status and what is next.
