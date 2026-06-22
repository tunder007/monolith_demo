import { Hono } from "hono";

import { sendEmail } from "@softeneers/email";

import { env } from "../env.js";
import { mailer } from "./mailer.js";

export const email = new Hono();

// Demo: send a welcome email. POST { "to": "a@b.com", "name": "Ada" }
email.post("/welcome", async (c) => {
  const body = await c.req.json().catch(() => ({}) as Record<string, unknown>);
  const to = typeof body.to === "string" ? body.to : "";
  const name = typeof body.name === "string" ? body.name : "there";
  if (!to) return c.json({ message: "to (email address) is required." }, 400);
  await sendEmail(mailer, {
    from: env.EMAIL_FROM,
    to,
    subject: "Welcome!",
    html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining.</p>`,
    text: `Welcome, ${name}! Thanks for joining.`,
  });
  return c.json({ sent: true });
});
