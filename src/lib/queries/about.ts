import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { supabasePublic } from '@/lib/supabase/public'
import type {
  Certification,
  Experience,
  PortfolioDocument,
  Skill,
  SkillGroup,
} from '@/lib/supabase/types'

import { CACHE_TAGS } from './site'

export const getSkillGroups = cache(async (): Promise<SkillGroup[]> =>
  unstable_cache(
    async () => {
      const { data, error } = await supabasePublic
        .from('skill_categories')
        .select('*, skills(*)')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('sort_order', { referencedTable: 'skills', ascending: true })

      if (error) throw new Error(`getSkillGroups: ${error.message}`)

      return (data ?? []).map((c) => {
        const { skills, ...category } = c as typeof c & { skills: Skill[] }
        return { ...category, skills: skills ?? [] }
      })
    },
    ['skill-groups'],
    { tags: [CACHE_TAGS.skills], revalidate: 3600 },
  )(),
)

export const getExperience = cache(async (): Promise<Experience[]> =>
  unstable_cache(
    async () => {
      const { data, error } = await supabasePublic
        .from('experience')
        .select('*')
        .eq('published', true)
        .order('start_date', { ascending: false })

      if (error) throw new Error(`getExperience: ${error.message}`)
      return data ?? []
    },
    ['experience'],
    { tags: [CACHE_TAGS.experience], revalidate: 3600 },
  )(),
)

export const getCertifications = cache(async (): Promise<Certification[]> =>
  unstable_cache(
    async () => {
      const { data, error } = await supabasePublic
        .from('certifications')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('issued_on', { ascending: false })

      if (error) throw new Error(`getCertifications: ${error.message}`)
      return data ?? []
    },
    ['certifications'],
    { tags: [CACHE_TAGS.certifications], revalidate: 3600 },
  )(),
)

/**
 * Only used to decide whether to render the CV link. The download itself goes
 * through /cv, which signs a fresh URL server-side — storage paths never reach
 * the browser, so superseded revisions stay unreachable.
 */
export const getCurrentCv = cache(
  async (): Promise<Pick<PortfolioDocument, 'label' | 'filename'> | null> =>
    unstable_cache(
      async () => {
        const { data, error } = await supabasePublic
          .from('documents')
          .select('label, filename')
          .eq('kind', 'cv')
          .eq('is_current', true)
          .maybeSingle()

        if (error) throw new Error(`getCurrentCv: ${error.message}`)
        return data
      },
      ['current-cv'],
      { tags: [CACHE_TAGS.documents], revalidate: 3600 },
    )(),
)
