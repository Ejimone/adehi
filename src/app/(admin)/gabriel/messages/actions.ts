'use server'

import { revalidatePath } from 'next/cache'

import { createSupabaseServer } from '@/lib/supabase/server'
import type { MessageStatus } from '@/lib/supabase/database.types'

export async function setMessageStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '') as MessageStatus
  if (!id) return

  const supabase = await createSupabaseServer()
  await supabase.from('contact_messages').update({ status }).eq('id', id)

  // Inbox only — messages never appear on the public site, so nothing public
  // needs revalidating here.
  revalidatePath('/gabriel/messages')
  revalidatePath('/gabriel')
}

export async function deleteMessage(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createSupabaseServer()
  await supabase.from('contact_messages').delete().eq('id', id)

  revalidatePath('/gabriel/messages')
  revalidatePath('/gabriel')
}
