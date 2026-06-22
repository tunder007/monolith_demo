import type { ReactElement } from "react";

import { render } from "@react-email/render";
import { Resend } from "resend";

export { Resend } from "resend";
export { render };
export * from "./templates/welcome.js";
export * from "./templates/reset-password.js";

/** Create a Resend client. Does not make any network call. */
export function createEmailClient(apiKey: string): Resend {
  return new Resend(apiKey);
}

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  /** A React Email element; rendered to HTML if `html` is not provided. */
  react?: ReactElement;
  html?: string;
  text?: string;
}

/**
 * Send an email via Resend. Provide `react` (rendered to HTML), `html`, or
 * `text`. Throws if none of the three is supplied.
 */
export async function sendEmail(client: Resend, options: SendEmailOptions) {
  const html = options.html ?? (options.react ? await render(options.react) : undefined);
  if (!html && !options.text) {
    throw new Error("sendEmail requires one of: react, html, or text.");
  }
  return client.emails.send({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html,
    text: options.text,
  } as Parameters<Resend["emails"]["send"]>[0]);
}
