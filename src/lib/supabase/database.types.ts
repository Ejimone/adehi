/**
 * Types for the `gabriel` schema.
 *
 * Hand-authored to match supabase/migrations/*.sql. Regenerate with:
 *   pnpm db:types
 * which requires SUPABASE_ACCESS_TOKEN. If you change a migration, change this
 * file in the same commit — `pnpm typecheck` is the only thing keeping them
 * honest.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ProjectStatus = 'draft' | 'published' | 'archived'
export type MediaKind = 'image' | 'video' | 'model'
export type DocumentKind = 'cv' | 'transcript' | 'certificate' | 'other'
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived'
export type EntryKind = 'work' | 'education' | 'volunteer'

type SiteSettingsRow = {
  id: boolean
  full_name: string
  role_title: string
  roles: string[]
  tagline: string
  hero_lines: string[]
  bio_short: string
  bio_md: string
  bio_html: string
  location: string
  timezone: string
  email: string
  available: boolean
  availability_label: string
  socials: Json
  stats: Json
  seo_title: string
  seo_description: string
  seo_keywords: string[]
  og_image_url: string | null
  portrait_url: string | null
  updated_at: string
}

type ProjectRow = {
  id: string
  slug: string
  title: string
  tagline: string
  role: string | null
  year: number | null
  period: string | null
  client: string | null
  stack: string[]
  tags: string[]
  summary: string
  body_md: string
  body_html: string
  metrics: Json
  live_url: string | null
  repo_url: string | null
  cover_url: string | null
  cover_alt: string
  poster_url: string | null
  status: ProjectStatus
  featured: boolean
  sort_order: number
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

type ProjectMediaRow = {
  id: string
  project_id: string
  kind: MediaKind
  url: string
  storage_path: string | null
  alt: string
  caption: string
  width: number | null
  height: number | null
  sort_order: number
  created_at: string
}

type ExperienceRow = {
  id: string
  org: string
  org_url: string | null
  role: string
  location: string | null
  kind: EntryKind
  start_date: string
  end_date: string | null
  summary: string
  bullets: string[]
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type SkillCategoryRow = {
  id: string
  name: string
  blurb: string
  sort_order: number
  published: boolean
}

type SkillRow = {
  id: string
  category_id: string
  name: string
  level: number | null
  sort_order: number
}

type CertificationRow = {
  id: string
  title: string
  issuer: string
  issuer_url: string | null
  category: string
  credential_id: string | null
  credential_url: string | null
  issued_on: string | null
  expires_on: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type DocumentRow = {
  id: string
  kind: DocumentKind
  label: string
  storage_path: string
  filename: string
  mime_type: string
  size_bytes: number | null
  version: number
  is_current: boolean
  created_at: string
}

type ContactMessageRow = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: MessageStatus
  source: string
  created_at: string
}

type AdminUserRow = {
  user_id: string
  email: string | null
  created_at: string
}

/** Columns with a DB default or that are generated are optional on insert. */
type Insertable<T, Required extends keyof T> = Partial<T> & Pick<T, Required>

/**
 * Every row type above is a `type` alias, never an `interface`, and that is
 * load-bearing rather than stylistic.
 *
 * postgrest-js constrains Row/Insert/Update to `Record<string, unknown>`.
 * TypeScript gives type aliases of object literals an implicit index signature
 * but does NOT give one to interfaces, so declaring these as interfaces makes
 * the schema fail the GenericSchema constraint — and the failure is silent:
 * every query result degrades to `never` rather than erroring at the
 * definition. Keep them as type aliases.
 */
export type Database = {
  gabriel: {
    Tables: {
      site_settings: {
        Row: SiteSettingsRow
        Insert: Insertable<SiteSettingsRow, never>
        Update: Partial<SiteSettingsRow>
        Relationships: []
      }
      projects: {
        Row: ProjectRow
        Insert: Insertable<ProjectRow, 'slug' | 'title'>
        Update: Partial<ProjectRow>
        Relationships: []
      }
      project_media: {
        Row: ProjectMediaRow
        Insert: Insertable<ProjectMediaRow, 'project_id' | 'url'>
        Update: Partial<ProjectMediaRow>
        Relationships: []
      }
      experience: {
        Row: ExperienceRow
        Insert: Insertable<ExperienceRow, 'org' | 'role' | 'start_date'>
        Update: Partial<ExperienceRow>
        Relationships: []
      }
      skill_categories: {
        Row: SkillCategoryRow
        Insert: Insertable<SkillCategoryRow, 'name'>
        Update: Partial<SkillCategoryRow>
        Relationships: []
      }
      skills: {
        Row: SkillRow
        Insert: Insertable<SkillRow, 'category_id' | 'name'>
        Update: Partial<SkillRow>
        Relationships: []
      }
      certifications: {
        Row: CertificationRow
        Insert: Insertable<CertificationRow, 'title' | 'issuer'>
        Update: Partial<CertificationRow>
        Relationships: []
      }
      documents: {
        Row: DocumentRow
        Insert: Insertable<DocumentRow, 'storage_path' | 'filename'>
        Update: Partial<DocumentRow>
        Relationships: []
      }
      contact_messages: {
        Row: ContactMessageRow
        Insert: Insertable<ContactMessageRow, 'name' | 'email' | 'message'>
        Update: Partial<ContactMessageRow>
        Relationships: []
      }
      admin_users: {
        Row: AdminUserRow
        Insert: Insertable<AdminUserRow, 'user_id'>
        Update: Partial<AdminUserRow>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      reorder_projects: { Args: { p_ids: string[] }; Returns: void }
      set_current_document: { Args: { p_id: string }; Returns: void }
    }
    Enums: {
      project_status: ProjectStatus
      media_kind: MediaKind
      document_kind: DocumentKind
      message_status: MessageStatus
      entry_kind: EntryKind
    }
    CompositeTypes: { [_ in never]: never }
  }
}
