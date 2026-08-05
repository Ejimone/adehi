import type { Database } from './database.types'

type Tables = Database['gabriel']['Tables']

export type SiteSettings = Tables['site_settings']['Row']
export type Project = Tables['projects']['Row']
export type ProjectInsert = Tables['projects']['Insert']
export type ProjectMedia = Tables['project_media']['Row']
export type Experience = Tables['experience']['Row']
export type SkillCategory = Tables['skill_categories']['Row']
export type Skill = Tables['skills']['Row']
export type Certification = Tables['certifications']['Row']
export type PortfolioDocument = Tables['documents']['Row']
export type ContactMessage = Tables['contact_messages']['Row']

/**
 * jsonb columns come back as `Json`, which is useless at the call site.
 * Narrow them exactly once, here, rather than casting at every consumer.
 */
export type Social = { label: string; url: string; sort_order?: number }
export type Stat = { label: string; value: string }
export type Metric = { label: string; value: string; note?: string }

export type SiteSettingsResolved = Omit<SiteSettings, 'socials' | 'stats'> & {
  socials: Social[]
  stats: Stat[]
}

export type ProjectResolved = Omit<Project, 'metrics'> & { metrics: Metric[] }

export type ProjectWithMedia = ProjectResolved & { media: ProjectMedia[] }

/**
 * What index grids and cards actually need. body_md/body_html are excluded
 * deliberately — the rendered HTML of every case study is large, and pulling it
 * into a list query would ship the entire site's prose to render six cards.
 */
export type ProjectCard = Omit<ProjectResolved, 'body_md' | 'body_html'>

export type SkillGroup = SkillCategory & { skills: Skill[] }

/** Narrow an unknown jsonb array without throwing on malformed data. */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}
