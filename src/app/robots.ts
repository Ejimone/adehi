import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/seo/schema'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
  // Note what is NOT here: there is no `Disallow: /gabriel`.
  //
  // robots.txt is a public file, so disallowing the admin path would advertise
  // the exact URL it is meant to hide — it is the first thing any scanner
  // reads. The admin is kept out of the index by a noindex header on the route
  // itself and by omission from the sitemap.
}
