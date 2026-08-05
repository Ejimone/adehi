'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { CACHE_TAGS } from '@/lib/queries/site'
import { renderMarkdown } from '@/lib/markdown'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { ProjectStatus } from '@/lib/supabase/database.types'

export type SaveResult = { ok: true; slug: string } | { ok: false; error: string }

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function list(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Invalidate everything a project edit can affect.
 *
 * This is the whole reason the site updates without a redeploy.
 *
 * updateTag rather than revalidateTag: it is Server-Action-only and expires the
 * entry immediately with read-your-own-writes semantics, so after saving you
 * see your own change straight away. revalidateTag only marks the entry stale
 * against a cacheLife profile, which can serve the previous page once more —
 * exactly the "did that save?" confusion worth avoiding in a CMS.
 */
function revalidateProject(slug: string, previousSlug?: string | null) {
  updateTag(CACHE_TAGS.projects)
  updateTag(CACHE_TAGS.project(slug))
  if (previousSlug && previousSlug !== slug) {
    // The old URL has to start 404ing, so its tag and path go too.
    updateTag(CACHE_TAGS.project(previousSlug))
    revalidatePath(`/work/${previousSlug}`)
  }
  revalidatePath('/')
  revalidatePath('/work')
  revalidatePath(`/work/${slug}`)
  revalidatePath('/sitemap.xml')
}

export async function saveProject(
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const id = String(formData.get('id') ?? '') || null
  const previousSlug = String(formData.get('previous_slug') ?? '') || null
  const title = String(formData.get('title') ?? '').trim()

  if (!title) return { ok: false, error: 'Title is required.' }

  const slug = slugify(String(formData.get('slug') ?? '') || title)
  if (!slug) return { ok: false, error: 'Could not derive a valid slug from that title.' }

  const bodyMd = String(formData.get('body_md') ?? '')
  // Markdown is rendered here, on write — so the public bundle ships no
  // markdown parser and case-study pages do zero parsing at request time.
  const bodyHtml = await renderMarkdown(bodyMd)

  const yearRaw = String(formData.get('year') ?? '').trim()
  const year = yearRaw ? Number(yearRaw) : null
  if (year !== null && (!Number.isInteger(year) || year < 1990 || year > 2100)) {
    return { ok: false, error: 'Year must be between 1990 and 2100.' }
  }

  const row = {
    slug,
    title,
    tagline: String(formData.get('tagline') ?? ''),
    role: String(formData.get('role') ?? '') || null,
    year,
    period: String(formData.get('period') ?? '') || null,
    client: String(formData.get('client') ?? '') || null,
    stack: list(formData.get('stack')),
    tags: list(formData.get('tags')),
    summary: String(formData.get('summary') ?? ''),
    body_md: bodyMd,
    body_html: bodyHtml,
    live_url: String(formData.get('live_url') ?? '') || null,
    repo_url: String(formData.get('repo_url') ?? '') || null,
    cover_url: String(formData.get('cover_url') ?? '') || null,
    cover_alt: String(formData.get('cover_alt') ?? ''),
    status: (String(formData.get('status') ?? 'draft') as ProjectStatus) ?? 'draft',
    featured: formData.get('featured') === 'on',
  }

  const supabase = await createSupabaseServer()

  const { data, error } = id
    ? await supabase.from('projects').update(row).eq('id', id).select('slug').single()
    : await supabase.from('projects').insert(row).select('slug').single()

  // Returned rather than thrown: in production Next redacts thrown Server Action
  // errors to a generic string, so the real Postgres message would be lost.
  if (error) {
    if (error.code === '23505')
      return { ok: false, error: `The slug "${slug}" is taken.` }
    return { ok: false, error: error.message }
  }

  revalidateProject(data.slug, previousSlug)
  revalidatePath('/gabriel/projects')

  return { ok: true, slug: data.slug }
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const slug = String(formData.get('slug') ?? '')
  if (!id) return

  const supabase = await createSupabaseServer()
  await supabase.from('projects').delete().eq('id', id)

  revalidateProject(slug)
  revalidatePath('/gabriel/projects')
  redirect('/gabriel/projects')
}

export async function toggleStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const slug = String(formData.get('slug') ?? '')
  const next = String(formData.get('next') ?? 'draft') as ProjectStatus
  if (!id) return

  const supabase = await createSupabaseServer()
  await supabase.from('projects').update({ status: next }).eq('id', id)

  revalidateProject(slug)
  revalidatePath('/gabriel/projects')
}
