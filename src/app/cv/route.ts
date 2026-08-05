import { redirect } from 'next/navigation'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Signed URLs expire, so this redirect must never be cached.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * A permanent, shareable CV link: https://<site>/cv
 *
 * The alternatives are both worse. Handing out storage URLs means the link
 * changes every time a new revision is uploaded, so anything already printed or
 * sent goes stale. Upserting to a fixed key like cv/current.pdf gets cached by
 * the CDN and needs a ?v= buster — which changes the URL again, defeating the
 * whole point.
 *
 * Instead the bucket stays private, each upload gets its own path, and this
 * route resolves whichever row is currently flagged and signs it on the spot.
 * Superseded revisions stay unreachable because their paths never leave the
 * server.
 */
export async function GET() {
  const supabaseAdmin = getSupabaseAdmin()
  // No service-role key configured yet — the CV link is simply not live.
  if (!supabaseAdmin) return new Response('Not Found', { status: 404 })

  const { data: doc } = await supabaseAdmin
    .from('documents')
    .select('storage_path, filename')
    .eq('kind', 'cv')
    .eq('is_current', true)
    .maybeSingle()

  if (!doc) return new Response('Not Found', { status: 404 })

  const { data: signed } = await supabaseAdmin.storage
    .from('gabriel-documents')
    .createSignedUrl(doc.storage_path, 60, { download: doc.filename })

  if (!signed) return new Response('Not Found', { status: 404 })

  redirect(signed.signedUrl)
}
