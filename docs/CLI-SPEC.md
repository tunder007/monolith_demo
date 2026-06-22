# CLI Specification — `create-softeneers-app`

The generator binary. This document is the contract for the implementation under
`apps/cli/src/`. As of Sprint 2 the CLI is **implemented and verified end-to-end**
for the `next-fullstack` template (copy → transform → git init → install → next
steps). Other templates are advertised in the wizard but not yet generatable.

## Invocation

```bash
npx create-softeneers-app@latest my-app      # interactive
npm  create softeneers-app@latest my-app      # equivalent
```

### Arguments & flags

| Form                     | Meaning                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `<directory>` or `.`     | Target dir / project name; `.` scaffolds into the current directory |
| `--template <name>`      | Skip the template prompt (e.g. `next-fullstack`)                    |
| `--yes`, `-y`            | Accept all defaults, no prompts (CI-friendly)                       |
| `--no-install`           | Scaffold only; don't run the package manager install                |
| `--no-git`               | Don't run `git init`                                                |
| `--pm <npm\|pnpm\|yarn>` | Package manager (default: auto-detected from the invoker, else npm) |
| `--version`, `--help`    | Standard                                                            |

The default package manager is auto-detected from `npm_config_user_agent` (set
when run via `npm`/`pnpm`/`yarn create`), falling back to **npm**. The chosen PM
is written into the generated root `package.json` `packageManager` field (with
its real detected version) so Turborepo resolves the workspace; the template
itself ships both an npm `workspaces` field and `pnpm-workspace.yaml`, so the
generated project works under npm or pnpm.

## Prompt flow (interactive)

Mirrors `TODO.md` §2. Built with `@clack/prompts`. Each answer maps to a template
and/or post-copy transform.

```
Project name:        my-app
Project type:        Fullstack app | Frontend only | Backend API only | Monorepo
Frontend:            Next.js | TanStack Start | None
Backend:             Hono | Express | None
Database:            MySQL | PostgreSQL | None
ORM:                 Prisma | Drizzle | Sequelize
Auth:                better-auth | none
Email:               Resend | none
Storage:             S3-compatible | none
Docker:              yes | no
```

For the MVP only one combination is wired: **Fullstack + Next.js + Express +
MySQL + Sequelize + Docker** → the `next-fullstack` template. Other choices are
presented but resolve to "not available yet" until their templates land. The
prompt set is data-driven so options light up as templates are added.

## Generation algorithm

```
1. Resolve target dir (".", a relative, or absolute path); refuse if it is
   non-empty (ignoring .git/.DS_Store). Project name = basename of the dir.
2. Select template dir from templates/<name> (default next-fullstack).
3. Copy recursively, EXCLUDING: node_modules, .next, dist, .turbo, *.log,
   and any real .env (only .env.example is copied).
4. Transform the copy:
     - root package.json: set "name" to the project name.
     - generate .env from .env.example (and per-app .env where templates declare one).
     - drop framework-internal fields the user doesn't need.
5. Conditionally include fragments based on answers (e.g. omit docker-compose.yml
   if Docker = no). MVP: include everything in next-fullstack.
6. git init (unless --no-git).
7. Install dependencies with the chosen PM (unless --no-install).
8. Print next steps.
```

### Copy exclusions (authoritative list)

`node_modules`, `.next`, `out`, `build`, `dist`, `.turbo`, `.git`,
`*.log`, `.DS_Store`, `.env`, `.env.*` (except `.env.example`),
`package-lock.json` / `pnpm-lock.yaml` (regenerated on install).

## Final output

```
Done.

Next steps:

  cd my-app
  pnpm install
  docker compose up -d        # start MySQL
  pnpm dev

Your app: http://localhost:3000   API: http://localhost:4000
```

## Implementation notes

- Runtime deps are minimal: `@clack/prompts` only; everything else from Node's
  stdlib (`fs`, `path`, `child_process`, `url`).
- Source layout (`apps/cli/src/`): `args.ts` (argv parsing + `CliError`),
  `templates.ts` (registry + path resolver), `scaffold.ts` (copy/transform/git/
  install), `prompts.ts` (clack wizard), `index.ts` (orchestration).
- **Template bundling (decided):** templates resolve at runtime from, in order,
  (1) `<pkg>/templates/<slug>` and (2) the monorepo `<pkg>/../../templates/<slug>`.
  The build (`scripts/copy-templates.mjs`, run after `tsc`) copies the monorepo
  `templates/` into `apps/cli/templates/` so the published package — whose `files`
  includes `templates` — is self-contained. That copied dir is a build artifact
  and is gitignored; candidate (2) covers local dev without the copy.
- Exit codes: `0` success, `1` user error (bad args, dir exists, unavailable
  template), `2` internal.
