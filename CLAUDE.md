# CLAUDE.md

Entry contract for AI agents working in this repository. The authoritative,
detailed docs live in [`docs/`](./docs/README.md); this file is the quick map.
When anything seems to conflict, [`docs/DECISIONS.md`](./docs/DECISIONS.md) wins.

## What this is

**Softeneers Framework** — a modular project generator (`create-softeneers-app`)
plus reusable `@softeneers/*` packages, as an **npm-first, package-manager-agnostic**
monorepo (npm workspaces + Turborepo; pnpm also works). Node ≥ 18.

## Commands

```bash
npm ci            # reproducible install (use this, not `npm install`, for a clean tree)
npm run build     # turbo build across packages + apps
npm test          # docs-link test + per-package node:test suites
npm run lint      # eslint . (single root pass)
npm run typecheck # turbo typecheck
npm run format    # prettier --write .
node apps/cli/dist/index.js my-app --yes   # run the generator from source
```

## Layout

- `apps/cli` — `create-softeneers-app`. Source in `src/`: `args.ts`, `templates.ts`,
  `scaffold.ts`, `prompts.ts`, `index.ts`. Bundles `templates/` on build.
- `apps/docs` — zero-dep static docs site generated from the Markdown (`npm run build`).
- `apps/landing` — Next.js marketing/landing page (deployed to Vercel).
- `packages/{config,env,db,auth,email,storage}` — the `@softeneers/*` libraries.
- `templates/next-fullstack` — the project the CLI copies (Next.js `web` + Express/
  Sequelize/MySQL `server`). Payload, **not** a workspace member.
- `docs/` — ARCHITECTURE, ROADMAP, CLI-SPEC, PACKAGES, DECISIONS, PUBLISHING (+ MANIFEST.json).

## Rules (see docs/DECISIONS.md for the full rationale)

- **npm-first, PM-agnostic.** Don't add npm-only or pnpm-only assumptions. Both an
  npm `workspaces` field and `pnpm-workspace.yaml` ship; `package-lock.json` is the
  committed lockfile.
- **Build tooling lives at the root** (one shared `typescript`/`tsx`/`eslint`/…).
  Packages declare only their runtime deps; `@softeneers/config` lists the lint stack
  as `peerDependencies`.
- **Templates are payload** — never workspace members, never import `@softeneers/*`
  from this repo, never ship `node_modules`/build output.
- Tasks run through Turbo; **lint is the one exception** (a single root `eslint .`).
- Every `@softeneers/*` package has `src/`, builds to `dist/`, ships a `node:test`
  suite, and documents its contract in `docs/PACKAGES.md`.
- Never commit a real `.env` (only `.env.example`).

## Verifying a change

```bash
npm run build && npm run lint && npm run typecheck && npm test
# CLI changes — generate into a temp dir and build the result:
cd "$(mktemp -d)" && node /ABS/PATH/apps/cli/dist/index.js demo --yes
cd demo && npm install && npm run build
```

## Environment note

On some Node/npm versions, incremental `npm install` can leave a partially-hoisted
tree (dangling `.bin`, a missing transitive). A clean `npm ci` (or `npm install`
+ `npm dedupe`) always produces a sound tree — prefer `npm ci`.
