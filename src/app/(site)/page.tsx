import Link from 'next/link'

import { Magnetic } from '@/components/motion/magnetic'
import { Reveal } from '@/components/motion/reveal'
import { SplitLine } from '@/components/motion/split-line'
import { StackCards } from '@/components/motion/stack-cards'
import { PortraitCluster } from '@/components/site/portrait-cluster'
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

  const name = settings?.full_name ?? 'Gabriel Adehi'
  const heroLines = settings?.hero_lines?.length ? settings.hero_lines : name.split(' ')

  // Derived, not hardcoded — sections are conditional on having content, so
  // fixed labels would skip a number whenever one is empty.
  const sections = [
    projects.length > 0 && 'work',
    skillGroups.length > 0 && 'capabilities',
    'contact',
  ].filter(Boolean) as string[]

  const idx = (key: string) => String(sections.indexOf(key) + 1).padStart(2, '0')

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="flex min-h-[100svh] flex-col justify-between pt-[7rem] pb-10">
        <Container>
          <PortraitCluster
            portraits={settings?.portraits ?? []}
            name={name}
            className="mb-10"
          />

          <h1 className="text-display font-display">
            {heroLines.map((line, i) => (
              <SplitLine key={`${line}-${i}`} text={line} delay={0.15 + i * 0.12} />
            ))}
          </h1>

          {settings?.tagline ? (
            <Reveal delay={500}>
              <p className="text-lead mt-10 max-w-[46ch]">{settings.tagline}</p>
            </Reveal>
          ) : null}

          <Reveal delay={650}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Action href="/work">Selected work</Action>
              </Magnetic>
              <Magnetic>
                <Action href="/about" variant="ghost">
                  About
                </Action>
              </Magnetic>
            </div>
          </Reveal>
        </Container>

        <Container>
          <div className="border-hairline text-muted text-micro flex items-center justify-between border-t pt-5 uppercase">
            <span>Scroll</span>
            <span aria-hidden="true">↓</span>
          </div>
        </Container>
      </section>

      {/* ── Selected work ─────────────────────────────────────────────────── */}
      {projects.length > 0 ? (
        <section className="py-24">
          <Container>
            <div className="mb-14 flex items-end justify-between gap-8">
              <SectionLabel index={idx('work')}>Selected work</SectionLabel>
              <Link
                href="/work"
                className="text-muted hover:text-primary-strong text-small ease-void shrink-0 transition-colors duration-[var(--dur-micro)]"
              >
                All work →
              </Link>
            </div>

            {/* Sticky offsets step down so each card rests slightly below the
                one before it — that ledge is what makes the pile read as a
                stack rather than a single swapped panel. */}
            <StackCards className="relative">
              {projects.slice(0, 4).map((p, i) => (
                <div
                  key={p.slug}
                  className="bg-bg sticky mb-16 origin-top last:mb-0"
                  style={{ top: `${6 + i * 1.25}rem` }}
                >
                  <ProjectCard project={p} index={i} priority={i === 0} />
                </div>
              ))}
            </StackCards>
          </Container>
        </section>
      ) : null}

      {/* ── Capabilities ──────────────────────────────────────────────────── */}
      {skillGroups.length > 0 ? (
        <section className="py-24">
          <Container>
            <SectionLabel index={idx('capabilities')} className="mb-14">
              Capabilities
            </SectionLabel>

            {/* The spine sits between the two columns on wide screens so the
                grid hangs off it. Pushed off-canvas below lg, where a single
                column has nothing to hang from. */}
            <div className="spine grid gap-x-16 gap-y-12 max-lg:[--spine-x:-100vw] lg:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.id} className="lg:odd:pr-10 lg:even:pl-10">
                  <h3 className="text-h3 font-display border-hairline border-b pb-3">
                    {group.name}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
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
      <section className="py-24">
        <Container>
          <SectionLabel index={idx('contact')} className="mb-12">
            Contact
          </SectionLabel>

          <Reveal>
            <h2 className="text-h1 font-display max-w-[15ch]">
              Let&rsquo;s work together.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Action href="/contact">Get in touch</Action>
              </Magnetic>
              {settings?.email ? (
                <Magnetic>
                  <Action href={`mailto:${settings.email}`} variant="ghost">
                    {settings.email}
                  </Action>
                </Magnetic>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  )
}
