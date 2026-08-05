import 'server-only'

import { createSupabaseServer } from '@/lib/supabase/server'
import type {
  Certification,
  ContactMessage,
  Experience,
  PortfolioDocument,
  Project,
  ProjectMedia,
  SiteSettings,
} from '@/lib/supabase/types'

/**
 * Admin reads.
 *
 * These use the session-bound client, not the public one, and are never cached
 * — the admin must always see current state including drafts. RLS still applies
 * on every call, so a bug in the route gate cannot by itself surface a draft.
 */

export async function adminGetProjects(): Promise<Project[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`adminGetProjects: ${error.message}`)
  return data ?? []
}

export async function adminGetProject(
  id: string,
): Promise<(Project & { media: ProjectMedia[] }) | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('projects')
    .select('*, media:project_media(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`adminGetProject(${id}): ${error.message}`)
  if (!data) return null

  const { media, ...project } = data as typeof data & { media: ProjectMedia[] }
  return { ...project, media: media ?? [] }
}

export async function adminGetSettings(): Promise<SiteSettings | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('site_settings').select('*').maybeSingle()
  if (error) throw new Error(`adminGetSettings: ${error.message}`)
  return data
}

export async function adminGetMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`adminGetMessages: ${error.message}`)
  return data ?? []
}

export async function adminGetDocuments(): Promise<PortfolioDocument[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`adminGetDocuments: ${error.message}`)
  return data ?? []
}

export async function adminGetExperience(): Promise<Experience[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw new Error(`adminGetExperience: ${error.message}`)
  return data ?? []
}

export async function adminGetCertifications(): Promise<Certification[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`adminGetCertifications: ${error.message}`)
  return data ?? []
}
