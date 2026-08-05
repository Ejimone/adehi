import type { ReactNode } from 'react'

import { Footer } from '@/components/site/footer'
import { Grain } from '@/components/site/grain'
import { Nav } from '@/components/site/nav'
import { JsonLd } from '@/components/seo/json-ld'
import { getCurrentCv } from '@/lib/queries/about'
import { getSiteSettings } from '@/lib/queries/site'
import { personSchema } from '@/lib/seo/schema'

/**
 * The public shell. Route groups matter here beyond URL tidiness: (site) and
 * (admin) get separate layout trees, so Next keeps their client modules in
 * separate chunks and /gabriel's editor code never reaches a public page.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, cv] = await Promise.all([getSiteSettings(), getCurrentCv()])

  const name = settings?.full_name || 'Gabriel Adehi'

  return (
    <div className="flex min-h-screen flex-col">
      <Grain />
      <JsonLd data={personSchema(settings)} />
      <Nav name={name} available={settings?.available ?? false} />
      <div className="relative z-10 flex-1">{children}</div>
      <Footer
        name={name}
        email={settings?.email ?? ''}
        socials={settings?.socials ?? []}
        hasCv={Boolean(cv)}
      />
    </div>
  )
}
