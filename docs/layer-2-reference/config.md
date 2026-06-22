# `@softeneers/config`

Shared, opinionated tooling configuration so every project — the framework, the
templates, and your apps — lints, formats, and type-checks the same way. It is
**config only**: no runtime code.

## Install

```bash
npm i -D @softeneers/config @eslint/js eslint globals prettier typescript typescript-eslint
```

The lint/format stack is declared as **peer dependencies** (you install them
once at your repo root), so the package stays tiny and never pins your toolchain.

## Exports

| Export | What it is |
| ------ | ---------- |
| `@softeneers/config/tsconfig/base.json` | Strict, modern TypeScript base config |
| `@softeneers/config/eslint`             | Flat ESLint config array |
| `@softeneers/config/prettier`           | Prettier options object |

## Usage

**TypeScript** — extend the base in your `tsconfig.json`:

```json
{
  "extends": "@softeneers/config/tsconfig/base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

**ESLint** — spread the preset in your flat config (`eslint.config.js`):

```js
import config from "@softeneers/config/eslint";

export default [...config];
```

**Prettier** — re-export the preset (`prettier.config.js`):

```js
export { default } from "@softeneers/config/prettier";
```

## Why peer dependencies

Per [DECISIONS.md](../DECISIONS.md) D-03, build tooling lives at the repo root as
one shared copy. If `@softeneers/config` bundled `eslint`/`typescript` itself,
consumers would end up with duplicate, conflicting tool versions. Declaring them
as peers means the consumer owns one canonical version and the preset just
configures it.

## Roadmap

Planned additional presets: `./tailwind`, `./tsup`.
