import "dotenv/config";

import { createEnv, z } from "@softeneers/env";

// Validated, typed environment. Boot fails fast with a readable message if the
// .env is wrong. Variables for a feature exist only when that toggle is on.
export const env = createEnv({
  schema: {
    PORT: z.coerce.number().default(4000),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    // #if db
    DB_HOST: z.string().default("127.0.0.1"),
    DB_PORT: z.coerce.number().default(3306),
    DB_NAME: z.string().default("app_dev"),
    DB_USER: z.string().default("root"),
    DB_PASSWORD: z.string().default(""),
    // #endif
    // #if auth
    AUTH_SECRET: z.string().min(16).default("dev-secret-change-me-to-a-long-random-string"),
    AUTH_BASE_URL: z.string().default("http://localhost:4000"),
    // #endif
    // #if email
    RESEND_API_KEY: z.string().default("re_set_me_in_dotenv"),
    EMAIL_FROM: z.string().default("onboarding@resend.dev"),
    // #endif
    // #if storage
    S3_ACCESS_KEY_ID: z.string().default(""),
    S3_SECRET_ACCESS_KEY: z.string().default(""),
    S3_BUCKET: z.string().default("uploads"),
    S3_REGION: z.string().default("auto"),
    S3_ENDPOINT: z.string().default(""),
    // #endif
    // #if payments
    APP_URL: z.string().default("http://localhost:4000"),
    STRIPE_SECRET_KEY: z.string().default("sk_test_set_me_in_dotenv"),
    STRIPE_WEBHOOK_SECRET: z.string().default("whsec_set_me_in_dotenv"),
    STRIPE_PRICE_ID: z.string().default("price_set_me_in_dotenv"),
    STRIPE_SUBSCRIPTION_PRICE_ID: z.string().default("price_set_me_in_dotenv"),
    // #endif
  },
});
