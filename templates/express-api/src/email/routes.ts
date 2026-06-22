import { Router } from "express";

import { sendEmail } from "@softeneers/email";

import { env } from "../env.js";
import { mailer } from "./mailer.js";

export const emailRouter = Router();

// Demo: send a welcome email. POST { "to": "a@b.com", "name": "Ada" }
emailRouter.post("/welcome", async (req, res) => {
  const to = typeof req.body?.to === "string" ? req.body.to : "";
  const name = typeof req.body?.name === "string" ? req.body.name : "there";
  if (!to) {
    res.status(400).json({ message: "to (email address) is required." });
    return;
  }
  await sendEmail(mailer, {
    from: env.EMAIL_FROM,
    to,
    subject: "Welcome!",
    html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining.</p>`,
    text: `Welcome, ${name}! Thanks for joining.`,
  });
  res.json({ sent: true });
});
