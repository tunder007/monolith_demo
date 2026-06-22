import { createEmailClient } from "@softeneers/email";

import { env } from "../env.js";

// A Resend client. No network call until you send.
export const mailer = createEmailClient(env.RESEND_API_KEY);
