import { createServerFn } from '@tanstack/react-start'

import { createEmailClient, sendEmail } from '@softeneers/email'

import { env } from './env'

const mailer = createEmailClient(env.RESEND_API_KEY)

// Server function: send a welcome email. Call from the client as
// `await sendWelcomeEmail({ data: { to, name } })`.
export const sendWelcomeEmail = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>
    const to = typeof d.to === 'string' ? d.to : ''
    if (!to) throw new Error('to (email address) is required.')
    return { to, name: typeof d.name === 'string' ? d.name : 'there' }
  })
  .handler(async ({ data }) => {
    await sendEmail(mailer, {
      from: env.EMAIL_FROM,
      to: data.to,
      subject: 'Welcome!',
      html: `<h1>Welcome, ${data.name}!</h1><p>Thanks for joining.</p>`,
      text: `Welcome, ${data.name}! Thanks for joining.`,
    })
    return { sent: true }
  })
