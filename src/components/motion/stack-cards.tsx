'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

/**
 * Scroll-driven card stack.
 *
 * The stacking itself is pure CSS: each child is `position: sticky` with an
 * incrementally larger `top`, so cards come to rest on top of one another as
 * you scroll. That works with no JavaScript at all.
 *
 * GSAP then adds only the depth cue — cards scale down and dim slightly as the
 * next one covers them. If GSAP fails to load, or the user prefers reduced
 * motion, the sticky stack still reads correctly; it just loses the parallax.
 * Motion is a layer on top, never the thing holding the layout together.
 *
 * ScrollTrigger is imported dynamically so GSAP (~28KB gz) is not in the
 * initial bundle for a page nobody has scrolled yet.
 */
export function StackCards({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const root = ref.current
    if (!root) return

    let cleanup = () => {}
    let cancelled = false

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const cards = Array.from(root.children) as HTMLElement[]
      const ctx = gsap.context(() => {
        cards.forEach((card, i) => {
          // The last card never recedes — nothing covers it.
          if (i === cards.length - 1) return

          gsap.to(card, {
            scale: 0.94,
            opacity: 0.55,
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          })
        })
      }, root)

      cleanup = () => ctx.revert()
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
