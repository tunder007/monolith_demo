# CLAUDE.md

Entry contract for AI agents working in this repository. The authoritative,
detailed docs live in [`docs/`](./docs/README.md); this file is the quick map.
When anything seems to conflict, [`docs/DECISIONS.md`](./docs/DECISIONS.md) wins.

**Reading order:** (1) this file, (2) [`docs/README.md`](./docs/README.md) for the
doc index, (3) the specific [`docs/`](./docs/README.md) page for the area you're
changing, (4) [`docs/DECISIONS.md`](./docs/DECISIONS.md) for any tiebreak.

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
  `fragments.ts` (toggle engine), `scaffold.ts`, `prompts.ts`, `index.ts`. Bundles
  `templates/` on build.
- `apps/landing` — Next.js site that is **the human-readable docs + marketing
  view**, generated from the canonical Markdown (`scripts/collect-docs.mjs`).
  **Standalone** (not a workspace member), deployed to Vercel at
  <https://softeneers-landing.vercel.app>; own deps/lockfile + `vercel.json`.
- `packages/{config,env,db,auth,email,storage,payments}` — the `@softeneers/*` libraries.
- `templates/next-fullstack` — the project the CLI copies (Next.js `web` + Express/
  Sequelize/MySQL `server`). Payload, **not** a workspace member.
- `docs/` — three layers (`layer-0-quickstart`, `layer-1-packages`,
  `layer-2-reference/`) + ARCHITECTURE, ROADMAP, CLI-SPEC, DECISIONS, PUBLISHING
  (+ MANIFEST.json).

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
  suite, and has a deep reference page under `docs/layer-2-reference/`.
- Never commit a real `.env` (only `.env.example`).
- **Markdown is the single source of truth for docs** (D-07). Edit the `.md`; the
  human view (the landing site) regenerates from it. No committed `.html` copies.

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
