'use server'

import { supabasePublic } from '@/lib/supabase/public'
import { contactSchema, type ActionResult } from '@/lib/schemas'

export async function submitContact(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    website: formData.get('website'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please check the highlighted fields.',
      fieldErrors: z2fieldErrors(parsed.error),
    }
  }

  // Honeypot tripped. Report success so the bot has no signal to adapt to,
  // but write nothing.
  if (parsed.data.website) return { ok: true }

  // No .select() chained here, deliberately. PostgREST honours
  // Prefer: return=representation, which needs a SELECT policy — and anon has
  // none, by design. Chaining .select() would 403 on a row that inserted fine.
  const { error } = await supabasePublic.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
    status: 'new',
    source: 'contact_form',
  })

  if (error) {
    // Never throw for an expected failure: in production Next redacts thrown
    // Server Action errors to a generic string, so the real cause is lost.
    return { ok: false, error: 'Could not send that. Try again, or email directly.' }
  }

  return { ok: true }
}

function z2fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const out: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    out[key] = [...(out[key] ?? []), issue.message]
  }
  return out
}
