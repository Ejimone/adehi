import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Variant = 'solid' | 'ghost'

const base =
  'ease-void inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-small font-medium transition-[background-color,border-color,color,transform] duration-[var(--dur-micro)] active:scale-[0.98]'

const variants: Record<Variant, string> = {
  solid: 'bg-paper text-void hover:bg-paper/90',
  ghost: 'border-line text-paper hover:bg-raised hover:border-paper/25 border',
}

/**
 * The site has exactly two button treatments. Resisting a third is most of what
 * keeps a monochrome palette from turning into a grey mush of near-identical
 * surfaces.
 *
 * Arrow glyph is decorative and marked aria-hidden — the label carries meaning.
 */
export function Action({
  href,
  children,
  variant = 'solid',
  className,
  arrow = true,
  ...rest
}: {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  arrow?: boolean
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className' | 'children'>) {
  const external = href.startsWith('http') || href.startsWith('mailto:')

  const content = (
    <>
      {children}
      {arrow ? (
        <span aria-hidden="true" className="text-[0.9em] leading-none">
          ↗
        </span>
      ) : null}
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], className)}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {content}
    </Link>
  )
}
