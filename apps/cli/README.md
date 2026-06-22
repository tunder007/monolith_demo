# create-softeneers-app

The Softeneers Framework project generator. Run it to scaffold a new project
from one of the bundled templates:

```bash
npx create-softeneers-app@latest my-app
```

## Status

**Implemented** for the `next-fullstack` template: interactive wizard, copy +
transform, `git init`, dependency install, and next-step output. Other templates
are listed in the wizard as "coming soon".

```bash
npx create-softeneers-app@latest my-app                 # interactive
npx create-softeneers-app@latest my-app --yes --pm npm  # non-interactive
```

Flags: `--template <slug>`, `--yes`/`-y`, `--no-install`, `--no-git`,
`--pm <pnpm|npm|yarn>`, `--help`, `--version`. See
[`../../docs/CLI-SPEC.md`](../../docs/CLI-SPEC.md) for the full contract.

## Local development

```bash
npm run build -w create-softeneers-app    # tsc + bundle templates → dist/ + templates/
node apps/cli/dist/index.js my-app --yes  # run the built CLI
npm run dev  -w create-softeneers-app -- my-app   # run from source via tsx
```
