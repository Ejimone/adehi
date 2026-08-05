import type { ProjectWithMedia, SiteSettingsResolved } from '@/lib/supabase/types'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3111'

export function personSchema(
  s: SiteSettingsResolved | null,
): Record<string, unknown> | null {
  if (!s) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: s.full_name,
    url: siteUrl,
    ...(s.role_title && { jobTitle: s.role_title }),
    ...(s.email && { email: `mailto:${s.email}` }),
    ...(s.portrait_url && { image: s.portrait_url }),
    ...(s.bio_short && { description: s.bio_short }),
    ...(s.location && {
      address: { '@type': 'PostalAddress', addressLocality: s.location },
    }),
    // Omit sameAs entirely when there are no socials — an empty array is a
    // Rich Results warning rather than a neutral no-op.
    ...(s.socials.length > 0 && { sameAs: s.socials.map((x) => x.url) }),
    ...(s.seo_keywords.length > 0 && { knowsAbout: s.seo_keywords }),
  }
}

export function creativeWorkSchema(p: ProjectWithMedia): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': p.repo_url ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${siteUrl}/work/${p.slug}#work`,
    name: p.title,
    headline: p.title,
    ...(p.tagline && { abstract: p.tagline }),
    ...(p.summary && { description: p.summary }),
    url: `${siteUrl}/work/${p.slug}`,
    ...(p.cover_url && { image: p.cover_url }),
    ...(p.published_at && { datePublished: p.published_at }),
    dateModified: p.updated_at,
    ...(p.stack.length > 0 && { keywords: p.stack.join(', ') }),
    ...(p.repo_url && { codeRepository: p.repo_url, programmingLanguage: p.stack }),
    // Ties every case study back to the single Person node in the site layout.
    author: { '@id': `${siteUrl}/#person` },
  }
}
