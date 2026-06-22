import assert from "node:assert/strict";
import { test } from "node:test";

import { createEnv, EnvValidationError, z } from "../dist/index.js";

test("valid env: defaults, coercion, freeze", () => {
  const env = createEnv({
    schema: { PORT: z.coerce.number().default(4000), DB_HOST: z.string().min(1) },
    source: { DB_HOST: "localhost" },
  });
  assert.equal(env.PORT, 4000);
  assert.equal(env.DB_HOST, "localhost");
  assert.equal(Object.isFrozen(env), true);
});

test("invalid env throws EnvValidationError with issues", () => {
  assert.throws(
    () => createEnv({ schema: { DB_HOST: z.string().min(1) }, source: {} }),
    (err) => {
      assert.ok(err instanceof EnvValidationError);
      assert.ok(err.issues.length >= 1);
      assert.match(err.message, /Invalid environment variables/);
      return true;
    },
  );
});

test("explicit source overrides process.env", () => {
  const env = createEnv({ schema: { X: z.string() }, source: { X: "from-source" } });
  assert.equal(env.X, "from-source");
});
