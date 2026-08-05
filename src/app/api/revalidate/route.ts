import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { CACHE_TAGS } from '@/lib/queries/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Safety net for content edited OUTSIDE the admin — the Supabase dashboard, the
 * SQL editor, an MCP call. Edits made through /gabriel already invalidate their
 * own caches in the Server Action, so this is not on the normal path.
 *
 * Wire it up in Supabase: Database → Webhooks → Create, on the tables below,
 * INSERT/UPDATE/DELETE, HTTP POST to https://<site>/api/revalidate with header
 * x-revalidate-secret set to REVALIDATE_SECRET.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET

  // If no secret is configured the endpoint stays closed rather than open.
  if (!secret || req.headers.get('x-revalidate-secret') !== secret) {
    // 404, not 401 — a 401 would confirm the route exists to anyone probing.
    return new NextResponse('Not Found', { status: 404 })
  }

  let body: { table?: string; record?: { slug?: string }; old_record?: { slug?: string } }
  try {
    body = await req.json()
  } catch {
    return new NextResponse('Bad Request', { status: 400 })
  }

  const tags = new Set<string>()

  switch (body.table) {
    case 'projects':
    case 'project_media': {
      tags.add(CACHE_TAGS.projects)
      for (const rec of [body.record, body.old_record]) {
        if (rec?.slug) tags.add(CACHE_TAGS.project(rec.slug))
      }
      revalidatePath('/work')
      break
    }
    case 'site_settings':
      tags.add(CACHE_TAGS.site)
      revalidatePath('/', 'layout')
      break
    case 'skills':
    case 'skill_categories':
      tags.add(CACHE_TAGS.skills)
      break
    case 'experience':
      tags.add(CACHE_TAGS.experience)
      break
    case 'certifications':
      tags.add(CACHE_TAGS.certifications)
      break
    case 'documents':
      tags.add(CACHE_TAGS.documents)
      break
  }

  // revalidateTag, not updateTag: updateTag is Server-Action-only and throws in
  // a route handler. The second argument is required in Next 16 — 'max' expires
  // the entry outright rather than merely marking it stale.
  for (const tag of tags) revalidateTag(tag, 'max')

  revalidatePath('/')

  return NextResponse.json({ revalidated: [...tags] })
}
