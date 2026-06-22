# Roadmap

Derived from `TODO.md` §10 (implementation order) and §14 (the MVP). Each sprint
is a shippable increment. Status is tracked here as the source of truth.

## The MVP (TODO §14)

A working `npx create-softeneers-app my-app` that generates:

```
my-app/
  apps/web, apps/server
  packages/config, packages/env
  package.json, pnpm-workspace.yaml, turbo.json, docker-compose.yml, README.md
```

If that works end-to-end, the foundation of the framework exists. Everything
after the MVP is additive.

## Sprint status

| Sprint | Goal                                                           | Status     |
| ------ | -------------------------------------------------------------- | ---------- |
| 0      | Scaffold: monorepo skeleton, docs, template relocation         | ✅ done    |
| 1      | Monorepo setup (pnpm + turbo + Next/Express template + README) | ✅ done¹   |
| 2      | CLI that copies the template (`create-softeneers-app`)         | ✅ done    |
| 3      | `@softeneers/config` + `@softeneers/env` + lint/format         | ✅ done    |
| 4      | `@softeneers/db` + Docker MySQL + migrations + seed            | ✅ done    |
| 5      | `@softeneers/auth` (better-auth) + login/register template     | ⏳ next    |
| 6      | `@softeneers/email` (Resend + React Email)                     | ⬜ pending |
| 7      | `@softeneers/storage` (S3-compatible) + upload helper          | ⬜ pending |
| 8      | Docs site + examples + `npm publish`                           | ⬜ pending |

¹ The template is relocated and standalone. Converting it into a pnpm/turbo
mini-monorepo that _consumes_ the shared packages happens alongside Sprint 3.

## What "done" already covered (Sprint 0)

- [x] Repo restructured into the `softeneers-framework` monorepo
- [x] `pnpm-workspace.yaml`, `turbo.json`, root `package.json`, `.npmrc`
- [x] `apps/cli` scaffold (bin wired, generation stubbed)
- [x] `packages/config`, `packages/env` stubs with documented contracts
- [x] Monolith moved into `templates/next-fullstack` (web + server), deps stripped
- [x] Template root files + `docker-compose.yml`
- [x] Design docs: ARCHITECTURE, ROADMAP, CLI-SPEC, PACKAGES
- [x] Framework README

## Sprint 2 — the CLI (done)

Implemented under `apps/cli/src/` per `CLI-SPEC.md`:

1. **Copy.** `create-softeneers-app <dir>` copies `templates/next-fullstack`,
   excluding `node_modules`/`.next`/`dist`/`.turbo`/lockfiles/real `.env`.
2. **Transform.** Rewrites root `package.json` `name`, generates `.env` from every
   `.env.example`, substitutes `{{PROJECT_NAME}}` in the README.
3. **Prompts.** `@clack/prompts` wizard (project name + template select; other
   templates shown as "coming soon"), gated behind `--yes`/`--template`.
4. **Verified end-to-end:** `--yes` generation produces the expected tree; a real
   `pnpm install` succeeds and **both apps build** (`server` `tsc` ✓, `web`
   `next build` ✓). Edge cases covered: `--help`/`--version`, unavailable
   template, unknown option, non-empty target dir.

> Remaining for full parity: granular stack sub-prompts (ORM/auth/email/storage)
> activate as their templates land; runtime `docker compose up` + `db:migrate`
> verification needs a Docker host (not run in CI yet).

## Sprint 3 — config + env + lint/format (done)

- `@softeneers/config`: real `tsconfig/base.json`, flat ESLint preset, Prettier
  preset; lint stack declared as `peerDependencies`.
- `@softeneers/env`: `createEnv({ schema })` over Zod, returns a frozen typed
  object, throws `EnvValidationError` with a readable summary; smoke-tested.
- Dogfooded: CLI extends the base tsconfig; root `eslint.config.js` /
  `prettier.config.js` use the presets; `npm run lint` / `format` / `typecheck`
  pass.

> **npm-first / PM-agnostic** was folded in here per scope guidance: the repo,
> the template, and the CLI work with **npm or pnpm**. Concretely — npm
> `workspaces` + `pnpm-workspace.yaml` both ship; `package-lock.json` is the
> committed lockfile (pnpm-lock gitignored); the CLI auto-detects the PM
> (default npm), supports `create-softeneers-app .` (current dir), and writes the
> generated `packageManager` field to match. Verified: a generated project
> installs and builds under **npm** end-to-end.

> Build-tooling note: tooling is hoisted to the root (one shared copy). Declaring
> `typescript`/`tsx` per-package made npm leave dangling `.bin` symlinks; and a
> workspace package owning the typescript-eslint dep graph crashed npm's link
> resolver — both avoided by keeping tooling at the root and using peerDeps in
> `@softeneers/config`.

> Still deferred: converting the `next-fullstack` template to _consume_ the
> published `@softeneers/config`/`env` (awaits publish, Sprint 8).

## Definition of done per package (Sprints 3–7)

A `@softeneers/*` package is "real" when it: has source under `src/`, builds to
`dist/`, exports the contract in `PACKAGES.md`, drops `"private": true`, and is
consumed by the `next-fullstack` template via a `workspace:`/published dep.

## Publishing (Sprint 8)

Publish `create-softeneers-app` first, then scoped packages with
`npm publish --access public`. Adopt Changesets for versioning before the first
public release.
