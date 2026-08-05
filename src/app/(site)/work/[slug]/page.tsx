import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import {
  getAdjacentProject,
  getPublishedProject,
  getPublishedSlugs,
} from '@/lib/queries/projects'
import { creativeWorkSchema } from '@/lib/seo/schema'
import type { Metric } from '@/lib/supabase/types'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  // Next 16: params is a Promise. Forgetting to await it is the single most
  // common migration error and fails at runtime, not at build.
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  // React cache() means this shares one query with the page render below.
  const project = await getPublishedProject(slug)
  if (!project) return {}

  return {
    title: project.seo_title || project.title,
    description: project.seo_description || project.summary || project.tagline,
    keywords: project.stack,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.seo_description || project.summary || project.tagline,
      url: `/work/${project.slug}`,
      ...(project.published_at && { publishedTime: project.published_at }),
    },
  }
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-hairline border-t py-4">
      <dt className="text-muted text-micro font-sans uppercase">{label}</dt>
      <dd className="text-small mt-2">{value}</dd>
    </div>
  )
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPublishedProject(slug)
  if (!project) notFound()

  const next = await getAdjacentProject(slug)
  const metrics = project.metrics as Metric[]

  return (
    <main className="pt-[9rem]">
      <JsonLd data={creativeWorkSchema(project)} />

      {/* Title and prose are plain server-rendered HTML. Phase 4 mounts WebGL
          behind this, never around it — a canvas wrapper with ssr:false would
          make the server emit an empty div and hand Google a blank page. */}
      <Container>
        <SectionLabel className="mb-10">Case study</SectionLabel>
        <h1 className="text-h1 font-display max-w-[16ch]">{project.title}</h1>
        {project.tagline ? (
          <p className="text-lead text-muted mt-8 max-w-[52ch]">{project.tagline}</p>
        ) : null}
      </Container>

      {project.cover_url ? (
        <Container className="mt-16">
          <div className="border-hairline relative aspect-[16/9] overflow-hidden rounded-2xl border">
            <Image
              src={project.cover_url}
              alt={project.cover_alt || project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Container>
      ) : null}

      <Container className="mt-20">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[18rem_1fr]">
          <aside>
            <dl>
              {project.role ? <MetaRow label="Role" value={project.role} /> : null}
              {project.period || project.year ? (
                <MetaRow label="Period" value={project.period || String(project.year)} />
              ) : null}
              {project.client ? <MetaRow label="Client" value={project.client} /> : null}
              {project.stack.length > 0 ? (
                <MetaRow label="Stack" value={project.stack.join(', ')} />
              ) : null}
            </dl>

            {project.live_url || project.repo_url ? (
              <div className="border-hairline mt-8 flex flex-col gap-3 border-t pt-6">
                {project.live_url ? (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small hover:text-muted ease-void transition-colors duration-[var(--dur-micro)]"
                  >
                    Visit live site ↗
                  </a>
                ) : null}
                {project.repo_url ? (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small hover:text-muted ease-void transition-colors duration-[var(--dur-micro)]"
                  >
                    Source ↗
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>

          <div>
            {project.summary ? (
              <p className="text-lead max-w-[var(--measure)]">{project.summary}</p>
            ) : null}

            {project.body_html ? (
              <article
                className="prose-void mt-12 max-w-[var(--measure)]"
                dangerouslySetInnerHTML={{ __html: project.body_html }}
              />
            ) : null}

            {metrics.length > 0 ? (
              <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="text-muted text-micro font-sans uppercase">
                      {m.label}
                    </dt>
                    <dd className="text-h2 font-display mt-3">{m.value}</dd>
                    {m.note ? (
                      <p className="text-muted text-small mt-2">{m.note}</p>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </Container>

      {project.media.length > 0 ? (
        <Container className="mt-28">
          <div className="grid gap-8">
            {project.media.map((m) => (
              <figure key={m.id}>
                <div className="border-hairline relative overflow-hidden rounded-2xl border">
                  <Image
                    src={m.url}
                    alt={m.alt || ''}
                    width={m.width ?? 1600}
                    height={m.height ?? 900}
                    sizes="100vw"
                    className="h-auto w-full object-cover"
                  />
                </div>
                {m.caption ? (
                  <figcaption className="text-muted text-small mt-4">
                    {m.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </Container>
      ) : null}

      {next && next.slug !== project.slug ? (
        <Container className="mt-32">
          <Link
            href={`/work/${next.slug}`}
            className="group border-hairline block border-t pt-10"
          >
            <span className="text-muted text-micro font-sans uppercase">
              Next project
            </span>
            <h2 className="text-h1 font-display ease-void group-hover:text-muted mt-5 transition-colors duration-[var(--dur-micro)]">
              {next.title}
            </h2>
          </Link>
        </Container>
      ) : null}
    </main>
  )
}
