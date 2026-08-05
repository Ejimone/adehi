import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { supabasePublic } from '@/lib/supabase/public'
import {
  asArray,
  type SiteSettingsResolved,
  type Social,
  type Stat,
} from '@/lib/supabase/types'

export const CACHE_TAGS = {
  site: 'site',
  projects: 'projects',
  project: (slug: string) => `project:${slug}`,
  skills: 'skills',
  experience: 'experience',
  certifications: 'certifications',
  documents: 'documents',
} as const

/**
 * The outer React cache() dedupes within a single request, so generateMetadata,
 * the OG image route, and the page render share one query instead of three.
 * The inner unstable_cache persists across requests until its tag is revalidated.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettingsResolved | null> =>
  unstable_cache(
    async () => {
      const { data, error } = await supabasePublic
        .from('site_settings')
        .select('*')
        .maybeSingle()

      if (error) throw new Error(`getSiteSettings: ${error.message}`)
      if (!data) return null

      return {
        ...data,
        socials: asArray<Social>(data.socials).sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        ),
        stats: asArray<Stat>(data.stats),
      }
    },
    ['site-settings'],
    { tags: [CACHE_TAGS.site], revalidate: 3600 },
  )(),
)
