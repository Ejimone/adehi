'use server'

import { revalidatePath, updateTag } from 'next/cache'

import { CACHE_TAGS } from '@/lib/queries/site'
import { createSupabaseServer } from '@/lib/supabase/server'

export type DocResult = { ok: true } | { ok: false; error: string } | null

/**
 * Records a CV that the browser has already uploaded to Storage, then makes it
 * the current one.
 *
 * The flip is done through the set_current_document RPC rather than two
 * updates from here: it runs in a single transaction and re-checks is_admin()
 * server-side, so there is no window in which two CVs are both current — which
 * the partial unique index would reject anyway.
 */
export async function recordCv(_prev: DocResult, formData: FormData): Promise<DocResult> {
  const storagePath = String(formData.get('storage_path') ?? '')
  const filename = String(formData.get('filename') ?? '')
  const sizeBytes = Number(formData.get('size_bytes') ?? 0) || null

  if (!storagePath || !filename) return { ok: false, error: 'Upload did not complete.' }

  const supabase = await createSupabaseServer()

  const { data: existing } = await supabase
    .from('documents')
    .select('version')
    .eq('kind', 'cv')
    .order('version', { ascending: false })
    .limit(1)

  const nextVersion = (existing?.[0]?.version ?? 0) + 1

  const { data: inserted, error } = await supabase
    .from('documents')
    .insert({
      kind: 'cv',
      label: 'Curriculum Vitae',
      storage_path: storagePath,
      filename,
      mime_type: 'application/pdf',
      size_bytes: sizeBytes,
      version: nextVersion,
      is_current: false,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  const { error: rpcError } = await supabase.rpc('set_current_document', {
    p_id: inserted.id,
  })
  if (rpcError) return { ok: false, error: rpcError.message }

  updateTag(CACHE_TAGS.documents)
  revalidatePath('/', 'layout')
  revalidatePath('/gabriel/documents')

  return { ok: true }
}

export async function makeCurrent(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createSupabaseServer()
  await supabase.rpc('set_current_document', { p_id: id })

  updateTag(CACHE_TAGS.documents)
  revalidatePath('/', 'layout')
  revalidatePath('/gabriel/documents')
}
