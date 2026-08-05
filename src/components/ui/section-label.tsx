import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * Mono micro-label with a leading rule. The wide tracking from --text-micro is
 * what makes it read as a label rather than small copy.
 *
 * `index` renders a monospaced ordinal — the running numbering down the page is
 * a large part of what makes the layout feel authored rather than assembled.
 */
export function SectionLabel({
  children,
  index,
  className,
}: {
  children: ReactNode
  index?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {index ? <span className="text-muted text-micro font-mono">{index}</span> : null}
      <span className="bg-line h-px w-10 shrink-0" aria-hidden="true" />
      <span className="text-muted text-micro font-mono uppercase">{children}</span>
    </div>
  )
}
