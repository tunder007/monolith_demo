import assert from "node:assert/strict";
import { test } from "node:test";

import { createEmailClient, render, ResetPasswordEmail, WelcomeEmail } from "../dist/index.js";

test("WelcomeEmail renders to HTML with the recipient name", async () => {
  // React SSR splits text nodes with comment markers, so match tokens, not the
  // exact phrase.
  const html = await render(WelcomeEmail({ name: "Ada", productName: "Softeneers" }));
  assert.match(html, /Welcome/);
  assert.match(html, /Ada/);
  assert.match(html, /Softeneers/);
});

test("ResetPasswordEmail renders with the reset link", async () => {
  const html = await render(ResetPasswordEmail({ resetUrl: "https://example.com/reset?t=abc" }));
  assert.match(html, /https:\/\/example\.com\/reset\?t=abc/);
});

test("createEmailClient returns a Resend client without sending", () => {
  const client = createEmailClient("re_test_key");
  assert.equal(typeof client.emails.send, "function");
});
