# @softeneers/email

Transactional email for Softeneers projects: a [Resend](https://resend.com)
client, a `sendEmail` helper, and ready-made [React Email](https://react.email)
templates.

## Usage

```ts
import { createEmailClient, sendEmail, WelcomeEmail } from "@softeneers/email";

const email = createEmailClient(env.RESEND_API_KEY);

await sendEmail(email, {
  from: "hello@yourapp.com",
  to: user.email,
  subject: "Welcome!",
  react: WelcomeEmail({ name: user.name, productName: "YourApp" }),
});
```

## API

- `createEmailClient(apiKey)` — a Resend client (no network call on construct).
- `sendEmail(client, { from, to, subject, react | html | text })` — renders a
  React template to HTML when `react` is given; throws if none of react/html/text.
- Templates: `WelcomeEmail`, `ResetPasswordEmail` (extend with your own).
- Re-exports `render` (React Email) and `Resend`.

Pair with [`@softeneers/env`](../env/README.md) to validate `RESEND_API_KEY`.
