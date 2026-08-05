import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import type { ProjectCard as ProjectCardType } from '@/lib/supabase/types'

/**
 * When a project has no cover image, this renders a typographic plate instead
 * of an empty grey box. That matters more than it sounds: the site ships before
 * any screenshots exist, and a wall of broken image frames would read as
 * unfinished where a set of type plates reads as a deliberate choice.
 */
function CoverFallback({ title, index }: { title: string; index: number }) {
  return (
    <div className="bg-wash absolute inset-0 flex items-center justify-center overflow-hidden">
      <span
        aria-hidden="true"
        className="text-ink/[0.06] font-display text-[clamp(6rem,22vw,16rem)] leading-none tracking-tighter select-none"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="text-muted text-micro absolute bottom-5 left-6 font-sans uppercase">
        {title}
      </span>
    </div>
  )
}

export function ProjectCard({
  project,
  index,
  priority = false,
  className,
}: {
  project: ProjectCardType
  index: number
  priority?: boolean
  className?: string
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn('group ease-void block', className)}
      aria-label={`${project.title} — ${project.tagline || 'case study'}`}
    >
      <div className="border-hairline bg-bg relative aspect-[16/10] overflow-hidden rounded-2xl border">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={project.cover_alt || project.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="ease-void object-cover transition-transform duration-[var(--dur-macro)] group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback title={project.title} index={index} />
        )}
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-6">
        <h3 className="text-h3 font-display">{project.title}</h3>
        {project.year ? (
          <span className="text-muted text-micro shrink-0 font-sans">{project.year}</span>
        ) : null}
      </div>

      {project.tagline ? (
        <p className="text-muted mt-2 max-w-[46ch]">{project.tagline}</p>
      ) : null}

      {project.stack.length > 0 ? (
        <p className="text-muted text-micro mt-4 font-sans uppercase">
          {project.stack.slice(0, 4).join(' · ')}
        </p>
      ) : null}
    </Link>
  )
}
