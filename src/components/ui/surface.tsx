import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * The site's one card treatment.
 *
 * Hover is pure CSS rather than Framer Motion's whileHover — the old codebase
 * paid for a motion runtime on every card to animate two properties a
 * transition handles for free.
 */
export function Surface({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
}) {
  return (
    <div
      className={cn(
        'border-line bg-raised rounded-2xl border',
        interactive &&
          'ease-void hover:bg-raised-hi hover:border-line transition-[background-color,transform,border-color] duration-[var(--dur-micro)] hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </div>
  )
}
