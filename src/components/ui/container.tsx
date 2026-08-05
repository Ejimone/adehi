import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * The only horizontal rhythm on the site. Gutter is fluid (--gutter), so there
 * are no container breakpoints to keep in sync anywhere.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('container-void', className)}>{children}</div>
}

/**
 * Constrains prose to a readable measure (~68ch). Reach for this around body
 * copy only — display type should run wide.
 */
export function Measure({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('max-w-[var(--measure)]', className)}>{children}</div>
}
