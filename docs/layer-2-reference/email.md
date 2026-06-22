# `@softeneers/email`

Transactional email: a [Resend](https://resend.com) client, a `sendEmail`
helper, and ready-made [React Email](https://react.email) templates. Compose
emails as React components and send them with one call.

## Install

```bash
npm i @softeneers/email
```

Bundles `resend`, `@react-email/components`, `@react-email/render`, and `react`.

## API

### `createEmailClient(apiKey)`

```ts
function createEmailClient(apiKey: string): Resend;
```

Creates a Resend client. No network call.

### `sendEmail(client, options)`

```ts
function sendEmail(client: Resend, options: {
  from: string;
  to: string | string[];
  subject: string;
  react?: ReactElement;  // rendered to HTML if `html` is omitted
  html?: string;
  text?: string;
}): Promise<...>;
```

Sends an email. Provide one of `react` (rendered via React Email), `html`, or
`text` — it throws if none is supplied.

### Templates & re-exports

- `WelcomeEmail`, `ResetPasswordEmail` — typed React Email components.
- `render(element)` — render a React Email element to an HTML string.
- `Resend` — the underlying client class.

## Usage

```ts
import { createEmailClient, sendEmail, WelcomeEmail } from "@softeneers/email";

const client = createEmailClient(process.env.RESEND_API_KEY!);

await sendEmail(client, {
  from: "hello@yourapp.com",
  to: "ada@example.com",
  subject: "Welcome!",
  react: WelcomeEmail({ name: "Ada", productName: "YourApp" }),
});
```

Render a template to HTML without sending (e.g. for previews or tests):

```ts
import { render, ResetPasswordEmail } from "@softeneers/email";

const html = await render(ResetPasswordEmail({ resetUrl: "https://…" }));
```

## Notes

- Not auto-wired by any template — add it wherever you need to send mail (sign-up
  confirmations, password resets, receipts).
- Extend by adding more React Email templates (invoice, order confirmation) and
  exporting them.
