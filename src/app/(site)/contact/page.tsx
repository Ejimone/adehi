import type { Metadata } from 'next'

import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSiteSettings } from '@/lib/queries/site'

import { ContactForm } from './contact-form'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <main className="pt-[9rem]">
      <Container>
        <SectionLabel className="mb-10">Contact</SectionLabel>
        <h1 className="text-h1 font-display max-w-[14ch]">
          Let&rsquo;s build something worth shipping.
        </h1>

        <div className="mt-20 grid gap-x-16 gap-y-16 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-[var(--measure)]">
            <ContactForm />
          </div>

          <aside className="space-y-8">
            {settings?.available ? (
              <div>
                <p className="text-muted text-micro font-sans uppercase">Status</p>
                <p className="text-small mt-3 flex items-center gap-2.5">
                  <span className="bg-primary-strong inline-block size-1.5 rounded-full" />
                  {settings.availability_label}
                </p>
              </div>
            ) : null}

            {settings?.email ? (
              <div>
                <p className="text-muted text-micro font-sans uppercase">Email</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-small hover:text-muted ease-void mt-3 block transition-colors duration-[var(--dur-micro)]"
                >
                  {settings.email}
                </a>
              </div>
            ) : null}

            {settings?.location ? (
              <div>
                <p className="text-muted text-micro font-sans uppercase">Based in</p>
                <p className="text-small mt-3">{settings.location}</p>
              </div>
            ) : null}

            {settings && settings.socials.length > 0 ? (
              <div>
                <p className="text-muted text-micro font-sans uppercase">Elsewhere</p>
                <ul className="mt-3 space-y-2">
                  {settings.socials.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-small hover:text-muted ease-void transition-colors duration-[var(--dur-micro)]"
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </main>
  )
}
