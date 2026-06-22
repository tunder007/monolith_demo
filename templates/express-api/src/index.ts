import cors from "cors";
import express from "express";

import { carRouter } from "./cars/routes.js";
import { env } from "./env.js";
// #if auth
import { toNodeHandler } from "@softeneers/auth";

import { auth } from "./auth/auth.js";
// #endif
// #if email
import { emailRouter } from "./email/routes.js";
// #endif
// #if storage
import { storageRouter } from "./storage/routes.js";
// #endif
// #if payments
import { paymentsRouter } from "./payments/routes.js";
import { stripeWebhookHandler } from "./payments/webhook.js";
// #endif

const app = express();

// #if auth
// better-auth handles its own body parsing, so mount it before express.json().
app.all("/api/auth/*splat", toNodeHandler(auth));
// #endif
// #if payments
// Stripe webhook signature verification needs the raw body — mount before express.json().
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);
// #endif

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/cars", carRouter);
// #if email
app.use("/api/email", emailRouter);
// #endif
// #if storage
app.use("/api/files", storageRouter);
// #endif
// #if payments
app.use("/api/payments", paymentsRouter);
// #endif

app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal server error." });
  },
);

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
