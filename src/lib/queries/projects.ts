import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { supabasePublic } from '@/lib/supabase/public'
import {
  asArray,
  type Metric,
  type ProjectCard,
  type ProjectWithMedia,
} from '@/lib/supabase/types'

import { CACHE_TAGS } from './site'

/**
 * Must be a single string literal, not a `+` concatenation.
 *
 * postgrest-js parses this select at the TYPE level to derive the row shape.
 * Concatenating with `+` widens it to `string`, the parser gives up, and every
 * result becomes GenericStringError.
 */
const LIST_COLUMNS =
  'id,slug,title,tagline,role,year,period,client,stack,tags,summary,metrics,live_url,repo_url,cover_url,cover_alt,poster_url,status,featured,sort_order,seo_title,seo_description,published_at,created_at,updated_at' as const

export const getPublishedProjects = cache(async (): Promise<ProjectCard[]> =>
  unstable_cache(
    async () => {
      const { data, error } = await supabasePublic
        .from('projects')
        .select(LIST_COLUMNS)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw new Error(`getPublishedProjects: ${error.message}`)

      return (data ?? []).map((p) => ({ ...p, metrics: asArray<Metric>(p.metrics) }))
    },
    ['projects-list'],
    { tags: [CACHE_TAGS.projects], revalidate: 3600 },
  )(),
)

export const getFeaturedProjects = cache(async (): Promise<ProjectCard[]> => {
  const all = await getPublishedProjects()
  const featured = all.filter((p) => p.featured)
  // Falling back to the full list keeps the home page from rendering an empty
  // "Selected work" section before anything has been marked featured.
  return featured.length > 0 ? featured : all
})

/**
 * NOTE: `slug` MUST appear in the unstable_cache key array.
 *
 * unstable_cache keys on [sourceHash, ...keyParts] only — closure variables are
 * not part of the key. Omit it and every slug returns whichever project was
 * cached first. This is the single most common way to misuse this API.
 */
export const getPublishedProject = cache(
  async (slug: string): Promise<ProjectWithMedia | null> =>
    unstable_cache(
      async () => {
        const { data, error } = await supabasePublic
          .from('projects')
          .select('*, media:project_media(*)')
          .eq('slug', slug)
          .eq('status', 'published')
          .order('sort_order', { referencedTable: 'project_media', ascending: true })
          .maybeSingle()

        if (error) throw new Error(`getPublishedProject(${slug}): ${error.message}`)
        if (!data) return null

        const { media, ...project } = data as typeof data & {
          media: ProjectWithMedia['media']
        }

        return {
          ...project,
          metrics: asArray<Metric>(project.metrics),
          media: media ?? [],
        }
      },
      ['project', slug],
      { tags: [CACHE_TAGS.projects, CACHE_TAGS.project(slug)], revalidate: 3600 },
    )(),
)

export const getPublishedSlugs = cache(async (): Promise<string[]> =>
  unstable_cache(
    async () => {
      const { data, error } = await supabasePublic
        .from('projects')
        .select('slug')
        .eq('status', 'published')

      if (error) throw new Error(`getPublishedSlugs: ${error.message}`)
      return (data ?? []).map((r) => r.slug)
    },
    ['project-slugs'],
    { tags: [CACHE_TAGS.projects], revalidate: 3600 },
  )(),
)

/** Powers the "next project" link at the foot of a case study. */
export const getAdjacentProject = cache(
  async (slug: string): Promise<ProjectCard | null> => {
    const all = await getPublishedProjects()
    if (all.length < 2) return null
    const i = all.findIndex((p) => p.slug === slug)
    if (i === -1) return all[0] ?? null
    return all[(i + 1) % all.length] ?? null
  },
)
