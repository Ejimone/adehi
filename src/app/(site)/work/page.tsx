import type { Metadata } from 'next'

import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { ProjectCard } from '@/components/work/project-card'
import { getPublishedProjects } from '@/lib/queries/projects'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected engineering work and case studies.',
  alternates: { canonical: '/work' },
}

export default async function WorkPage() {
  const projects = await getPublishedProjects()

  return (
    <main className="pt-[9rem] pb-12">
      <Container>
        <SectionLabel className="mb-10">Work</SectionLabel>
        <h1 className="text-h1 font-display max-w-[14ch]">Things I&rsquo;ve built.</h1>

        {projects.length === 0 ? (
          // Honest empty state. Better than a grid of invented projects, which
          // is exactly what the previous version of this site shipped.
          <p className="text-muted text-lead mt-14 max-w-[46ch]">
            Case studies are being written up. In the meantime, the fastest route is to
            get in touch directly.
          </p>
        ) : (
          <div className="mt-20 grid gap-x-10 gap-y-20 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.slug}
                project={p}
                index={i}
                priority={i < 2}
                className={i % 2 === 1 ? 'md:mt-24' : undefined}
              />
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
