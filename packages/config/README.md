# @softeneers/config

Shared, opinionated configuration consumed across Softeneers projects so that
formatting, linting, and TypeScript settings stay standardized.

## Exports

| Path                                    | Purpose                           |
| --------------------------------------- | --------------------------------- |
| `@softeneers/config/tsconfig/base.json` | Strict base TypeScript config     |
| `@softeneers/config/eslint`             | Shared flat ESLint config (array) |
| `@softeneers/config/prettier`           | Shared Prettier config            |

## Usage

`tsconfig.json`:

```json
{ "extends": "@softeneers/config/tsconfig/base.json" }
```

`eslint.config.js`:

```js
import softeneers from "@softeneers/config/eslint";
export default softeneers; // or: [...softeneers, { rules: { /* overrides */ } }]
```

`prettier.config.js`:

```js
export { default } from "@softeneers/config/prettier";
```

`eslint`, `prettier`, and `typescript` are peer dependencies — the consumer
installs them.
