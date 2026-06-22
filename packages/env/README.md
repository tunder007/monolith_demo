# @softeneers/env

Fail-fast environment validation so an app never boots with a broken `.env`.
Wraps [Zod](https://zod.dev) and throws a readable error listing every problem.

## Usage

```ts
import { createEnv, z } from "@softeneers/env";

export const env = createEnv({
  schema: {
    PORT: z.coerce.number().default(4000),
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(3306),
    FRONTEND_URL: z.string().url(),
  },
});

env.PORT; // number — typed, validated, frozen
```

If validation fails, `createEnv` throws `EnvValidationError`:

```
Invalid environment variables:
  - DB_HOST: Required
  - FRONTEND_URL: Invalid url
```

## API

- `createEnv({ schema, source? })` — validate `source` (default `process.env`)
  against a Zod raw shape; returns a frozen, typed object.
- `EnvValidationError` — error thrown on failure, with `.issues`.
- `z` — re-exported Zod, so consumers don't need a separate dependency.
