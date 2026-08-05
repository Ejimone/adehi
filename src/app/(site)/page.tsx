import Link from 'next/link'

import { Action } from '@/components/ui/action'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { ProjectCard } from '@/components/work/project-card'
import { getSkillGroups } from '@/lib/queries/about'
import { getFeaturedProjects } from '@/lib/queries/projects'
import { getSiteSettings } from '@/lib/queries/site'

export const revalidate = 3600

export default async function HomePage() {
  const [settings, projects, skillGroups] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getSkillGroups(),
  ])

  const heroLines = settings?.hero_lines?.length
    ? settings.hero_lines
    : (settings?.full_name ?? 'Gabriel Adehi').split(' ')

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="flex min-h-[100svh] flex-col justify-between pt-[4.5rem] pb-12">
        <div className="flex flex-1 items-center">
          <Container>
            {settings?.role_title ? (
              <p className="text-muted mb-10 font-mono text-micro uppercase">
                {settings.role_title}
                {settings.location ? ` — ${settings.location}` : ''}
              </p>
            ) : null}

            <h1 className="text-display font-display">
              {heroLines.map((line, i) => (
                <span
                  key={`${line}-${i}`}
                  className={i % 2 === 1 ? 'text-muted block' : 'block'}
                >
                  {line}
                </span>
              ))}
            </h1>

            {settings?.tagline ? (
              <p className="text-lead text-muted mt-12 max-w-[52ch]">{settings.tagline}</p>
            ) : null}

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Action href="/work">Selected work</Action>
              <Action href="/about" variant="ghost">
                About
              </Action>
            </div>
          </Container>
        </div>

        <Container>
          <div className="border-line text-muted flex items-center justify-between border-t pt-6 font-mono text-micro uppercase">
            <span>Scroll</span>
            <span aria-hidden="true">↓</span>
          </div>
        </Container>
      </section>

      {/* ── Selected work ─────────────────────────────────────────────────── */}
      {projects.length > 0 ? (
        <section className="py-28">
          <Container>
            <div className="mb-16 flex items-end justify-between gap-8">
              <SectionLabel index="01">Selected work</SectionLabel>
              <Link
                href="/work"
                className="text-muted hover:text-paper text-small ease-void shrink-0 transition-colors duration-[var(--dur-micro)]"
              >
                All work →
              </Link>
            </div>

            {/* Phase 4 pins these and stacks them on scroll. The static grid is
                the reduced-motion and no-JS presentation, so it has to stand on
                its own rather than look like a broken animation. */}
            <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
              {projects.slice(0, 4).map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  index={i}
                  priority={i === 0}
                  className={i % 2 === 1 ? 'md:mt-24' : undefined}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ── Capabilities ──────────────────────────────────────────────────── */}
      {skillGroups.length > 0 ? (
        <section className="py-28">
          <Container>
            <SectionLabel index="02" className="mb-16">
              Capabilities
            </SectionLabel>

            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {skillGroups.map((group) => (
                <div key={group.id}>
                  <h3 className="text-h3 font-display border-line border-b pb-4">
                    {group.name}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {group.skills.map((skill) => (
                      <li key={skill.id} className="text-muted text-small">
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section className="py-28">
        <Container>
          <SectionLabel index="03" className="mb-14">
            Contact
          </SectionLabel>

          <h2 className="text-h1 font-display max-w-[16ch]">
            Let&rsquo;s build something worth shipping.
          </h2>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Action href="/contact">Get in touch</Action>
            {settings?.email ? (
              <Action href={`mailto:${settings.email}`} variant="ghost">
                {settings.email}
              </Action>
            ) : null}
          </div>
        </Container>
      </section>
    </main>
  )
}
