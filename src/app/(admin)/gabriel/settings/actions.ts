'use server'

import { revalidatePath, updateTag } from 'next/cache'

import { renderMarkdown } from '@/lib/markdown'
import { CACHE_TAGS } from '@/lib/queries/site'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { Social } from '@/lib/supabase/types'

export type SettingsResult = { ok: true } | { ok: false; error: string } | null

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Socials are edited as "Label | https://url" per line rather than raw JSON.
 * Hand-editing JSON in a textarea is a reliable way to break a page with a
 * stray comma, and this format cannot produce invalid data — a line without a
 * URL is simply dropped.
 */
function parseSocials(value: FormDataEntryValue | null): Social[] {
  const out: Social[] = []
  lines(value).forEach((line, i) => {
    const [label, url] = line.split('|').map((s) => s.trim())
    if (!url) return
    out.push({ label: label || url, url, sort_order: i })
  })
  return out
}

export async function saveSettings(
  _prev: SettingsResult,
  formData: FormData,
): Promise<SettingsResult> {
  const bioMd = String(formData.get('bio_md') ?? '')

  const row = {
    id: true,
    full_name: String(formData.get('full_name') ?? ''),
    role_title: String(formData.get('role_title') ?? ''),
    tagline: String(formData.get('tagline') ?? ''),
    hero_lines: lines(formData.get('hero_lines')),
    bio_short: String(formData.get('bio_short') ?? ''),
    bio_md: bioMd,
    bio_html: await renderMarkdown(bioMd),
    location: String(formData.get('location') ?? ''),
    email: String(formData.get('email') ?? ''),
    available: formData.get('available') === 'on',
    availability_label: String(formData.get('availability_label') ?? ''),
    socials: parseSocials(formData.get('socials')),
    portraits: lines(formData.get('portraits')),
    portrait_url: String(formData.get('portrait_url') ?? '') || null,
    seo_title: String(formData.get('seo_title') ?? ''),
    seo_description: String(formData.get('seo_description') ?? ''),
  }

  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('site_settings').upsert(row, { onConflict: 'id' })

  if (error) return { ok: false, error: error.message }

  updateTag(CACHE_TAGS.site)
  // Settings feed the nav and footer, which live in the shared layout — so the
  // whole tree has to be revalidated, not just the home page.
  revalidatePath('/', 'layout')

  return { ok: true }
}
