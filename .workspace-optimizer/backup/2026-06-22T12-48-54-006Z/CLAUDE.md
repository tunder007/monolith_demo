# CLAUDE.md

Guidance for working in this repository.

## What this is

**Softeneers Framework** — a modular fullstack project generator
(`create-softeneers-app`) plus reusable `@softeneers/*` packages, as a pnpm +
Turborepo monorepo. Read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and
[`docs/ROADMAP.md`](./docs/ROADMAP.md) before substantial changes; the roadmap is
the source of truth for status.

## Commands

```bash
pnpm install                                   # install workspace deps
pnpm build | dev | lint | typecheck            # turbo across apps + packages
pnpm --filter create-softeneers-app build      # build the CLI (tsc + bundle templates)
node apps/cli/dist/index.js my-app --yes       # run the generator
pnpm --filter create-softeneers-app dev -- my-app   # run the CLI from source (tsx)
```

## Layout

- `apps/cli` — `create-softeneers-app`. Source in `src/`: `args.ts`,
  `templates.ts`, `scaffold.ts`, `prompts.ts`, `index.ts`.
- `apps/docs` — future docs site (placeholder).
- `packages/config`, `packages/env` — `@softeneers/*` libs (stubs; Sprint 3).
- `templates/next-fullstack` — the project the CLI copies (Next.js `web` +
  Express/Sequelize/MySQL `server`). Seeded from a working monolith.
- `docs/` — ARCHITECTURE, ROADMAP, CLI-SPEC, PACKAGES.

## Conventions & rules

- **Templates are payload, not code.** `templates/*` are NOT pnpm workspace
  members and must never import `@softeneers/*` from this workspace or carry
  `node_modules`/build output. Keep them self-contained and installable on their own.
- **Run tasks through Turbo**, not tools directly, so caching/topo-order apply.
- Framework code is ESM (`"type": "module"`); compiled CLI imports use `.js`
  extensions (NodeNext).
- The CLI keeps runtime deps minimal — `@clack/prompts` plus Node stdlib only.
- When adding a template, register it in `apps/cli/src/templates.ts` and ensure
  `scripts/copy-templates.mjs` bundles it; verify with a `--yes` generation that
  installs and builds.
- Never commit a real `.env` (gitignored); only `.env.example` ships.

## Verifying CLI changes

Generate into a temp dir, then build the result:

```bash
cd "$(mktemp -d)" && node /path/to/repo/apps/cli/dist/index.js demo --yes
cd demo && pnpm --filter server build && pnpm --filter web build
```
