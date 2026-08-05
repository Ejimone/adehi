import { z } from 'zod'

/**
 * Shared between the client form and the Server Action, so validation has one
 * definition. Bounds mirror the CHECK constraints in the migration — if these
 * drift, the database rejects the row and the user sees an opaque error.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Required').max(120, 'Too long'),
  email: z.email('Enter a valid email address').max(254),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Required').max(5000, 'Too long'),
  // Honeypot. Real users never see this field, so anything in it is a bot.
  website: z.string().max(0).optional().or(z.literal('')),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ActionResult =
  { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
