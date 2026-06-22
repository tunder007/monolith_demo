# `@softeneers/env`

Fail-fast, **typed** environment validation. An app should never boot with a
broken `.env`; `createEnv` validates `process.env` against a schema once at
startup and either returns a frozen, fully-typed object or throws a readable
error listing exactly what's wrong.

## Install

```bash
npm i @softeneers/env
```

Runtime dependency: `zod` (re-exported, so you don't install it separately).

## API

### `createEnv({ schema, source? })`

```ts
function createEnv<T extends z.ZodRawShape>(options: {
  schema: T;
  source?: Record<string, string | undefined>; // defaults to process.env
}): Readonly<z.infer<z.ZodObject<T>>>;
```

Validates `source` (default `process.env`) against `schema`. Returns a
`Object.freeze`-d, typed result on success; throws `EnvValidationError` on
failure.

### `EnvValidationError`

Thrown when validation fails. `.issues` holds the raw Zod issues; the message is
a human-readable, multi-line summary:

```
Invalid environment variables:
  - PORT: Expected number, received nan
  - DB_HOST: String must contain at least 1 character(s)
```

### `z`

Zod, re-exported, so your schema and the validator always use the same version.

## Usage

```ts
import { createEnv, z } from "@softeneers/env";

export const env = createEnv({
  schema: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(4000),
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(3306),
  },
});

env.PORT;    // number  (coerced + typed)
env.DB_HOST; // string
```

Pair it with `dotenv` to load a `.env` file first:

```ts
import "dotenv/config";
import { createEnv, z } from "@softeneers/env";
// ...
```

## Notes

- **Coercion matters:** env vars are always strings — use `z.coerce.number()` /
  `z.coerce.boolean()` so you get real types out.
- The result is **frozen** — treat config as immutable.
- `source` lets you validate something other than `process.env` (handy in tests).

See [DECISIONS.md](../DECISIONS.md) D-05 for why the API is `createEnv(schema)`
rather than a pre-built `env` export.
