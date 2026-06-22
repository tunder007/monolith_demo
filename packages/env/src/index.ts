import { z } from "zod";

export { z };

export interface CreateEnvOptions<T extends z.ZodRawShape> {
  /** The schema describing required/optional variables. */
  schema: T;
  /** Source of values. Defaults to process.env. */
  source?: Record<string, string | undefined>;
}

/** Thrown when one or more environment variables fail validation. */
export class EnvValidationError extends Error {
  constructor(public readonly issues: z.ZodIssue[]) {
    const lines = issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`);
    super(`Invalid environment variables:\n${lines.join("\n")}`);
    this.name = "EnvValidationError";
  }
}

/**
 * Validate `source` (default `process.env`) against `schema` and return a typed,
 * frozen object. Throws `EnvValidationError` with a readable summary on failure
 * so an app never boots with a broken `.env`.
 *
 * @example
 * const env = createEnv({
 *   schema: {
 *     PORT: z.coerce.number().default(4000),
 *     DB_HOST: z.string().min(1),
 *   },
 * });
 * env.PORT; // number
 */
export function createEnv<T extends z.ZodRawShape>(
  options: CreateEnvOptions<T>,
): Readonly<z.infer<z.ZodObject<T>>> {
  const { schema, source = process.env } = options;
  const result = z.object(schema).safeParse(source);
  if (!result.success) {
    throw new EnvValidationError(result.error.issues);
  }
  return Object.freeze(result.data);
}
