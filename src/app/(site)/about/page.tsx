import type { Metadata } from 'next'
import Image from 'next/image'

import { Action } from '@/components/ui/action'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import {
  getCertifications,
  getCurrentCv,
  getExperience,
  getSkillGroups,
} from '@/lib/queries/about'
import { getSiteSettings } from '@/lib/queries/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/about' },
}

function formatRange(start: string, end: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  return `${fmt(start)} — ${end ? fmt(end) : 'Present'}`
}

export default async function AboutPage() {
  const [settings, experience, skillGroups, certifications, cv] = await Promise.all([
    getSiteSettings(),
    getExperience(),
    getSkillGroups(),
    getCertifications(),
    getCurrentCv(),
  ])

  // Section indices are derived, not hardcoded. Every section here is
  // conditional on having content, so fixed 01/02/03 labels would skip numbers
  // — an empty experience list would leave the page starting at "02".
  const sections = [
    experience.length > 0 && 'experience',
    skillGroups.length > 0 && 'toolkit',
    certifications.length > 0 && 'credentials',
  ].filter(Boolean) as string[]

  const idx = (key: string) => String(sections.indexOf(key) + 1).padStart(2, '0')

  return (
    <main className="pt-[9rem]">
      <Container>
        <SectionLabel className="mb-10">About</SectionLabel>

        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[1fr_20rem]">
          <div>
            <h1 className="text-h1 font-display max-w-[14ch]">
              {settings?.full_name ?? 'Gabriel Adehi'}
            </h1>

            {settings?.bio_short ? (
              <p className="text-lead mt-10 max-w-[var(--measure)]">
                {settings.bio_short}
              </p>
            ) : null}

            {settings?.bio_html ? (
              <article
                className="prose-void mt-8 max-w-[var(--measure)]"
                dangerouslySetInnerHTML={{ __html: settings.bio_html }}
              />
            ) : null}

            <div className="mt-12 flex flex-wrap items-center gap-4">
              {cv ? <Action href="/cv">Download CV</Action> : null}
              <Action href="/contact" variant="ghost">
                Get in touch
              </Action>
            </div>
          </div>

          {/* Phase 4 replaces this with the particle portrait. It has to hold up
              as a still, since mobile and reduced-motion never see the canvas. */}
          {settings?.portrait_url ? (
            <div className="border-hairline relative aspect-[4/5] overflow-hidden rounded-2xl border">
              <Image
                src={settings.portrait_url}
                alt={settings.full_name}
                fill
                priority
                sizes="(min-width: 1024px) 20rem, 100vw"
                className="object-cover grayscale"
              />
            </div>
          ) : null}
        </div>
      </Container>

      {experience.length > 0 ? (
        <Container className="mt-32">
          <SectionLabel index={idx('experience')} className="mb-14">
            {' '}
            Experience
          </SectionLabel>
          <ul>
            {experience.map((e) => (
              <li
                key={e.id}
                className="border-hairline grid gap-4 border-t py-8 sm:grid-cols-[14rem_1fr]"
              >
                <div className="text-muted text-micro font-sans uppercase">
                  {formatRange(e.start_date, e.end_date)}
                </div>
                <div>
                  <h3 className="text-h3 font-display">{e.role}</h3>
                  <p className="text-muted text-small mt-1">
                    {e.org_url ? (
                      <a
                        href={e.org_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ink ease-void transition-colors duration-[var(--dur-micro)]"
                      >
                        {e.org} ↗
                      </a>
                    ) : (
                      e.org
                    )}
                    {e.location ? ` · ${e.location}` : ''}
                  </p>
                  {e.summary ? <p className="text-muted mt-4">{e.summary}</p> : null}
                  {e.bullets.length > 0 ? (
                    <ul className="text-muted mt-4 list-disc space-y-1.5 pl-5">
                      {e.bullets.map((b) => (
                        <li key={b} className="text-small">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {skillGroups.length > 0 ? (
        <Container className="mt-32">
          <SectionLabel index={idx('toolkit')} className="mb-14">
            Toolkit
          </SectionLabel>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <div key={group.id}>
                <h3 className="text-h3 font-display border-hairline border-b pb-4">
                  {group.name}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {group.skills.map((s) => (
                    <li key={s.id} className="text-muted text-small">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      ) : null}

      {certifications.length > 0 ? (
        <Container className="mt-32">
          <SectionLabel index={idx('credentials')} className="mb-14">
            Credentials
          </SectionLabel>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.id} className="border-hairline border-t py-6">
                <h3 className="text-small">{c.title}</h3>
                <p className="text-muted text-small mt-1">
                  {c.credential_url ? (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-ink ease-void transition-colors duration-[var(--dur-micro)]"
                    >
                      {c.issuer} ↗
                    </a>
                  ) : (
                    c.issuer
                  )}
                  {c.issued_on ? ` · ${new Date(c.issued_on).getFullYear()}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </main>
  )
}
