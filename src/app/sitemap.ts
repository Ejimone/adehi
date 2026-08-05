import type { MetadataRoute } from 'next'

import { getPublishedProjects } from '@/lib/queries/projects'
import { siteUrl } from '@/lib/seo/schema'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects()

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    {
      url: `${siteUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
  // /gabriel and /styleguide are deliberately absent.
}
