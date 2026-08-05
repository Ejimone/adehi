'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * Scroll-triggered reveal.
 *
 * Two deliberate choices:
 *
 * 1. No animation library. This is one IntersectionObserver and a CSS
 *    transition — reaching for Framer Motion here would ship ~35KB gzipped to
 *    every page to animate opacity and translateY.
 *
 * 2. `children` is passed straight through, so JSX handed in from a Server
 *    Component stays server-rendered and fully indexable. This wrapper must
 *    never be dynamically imported with ssr:false — that would make the server
 *    emit an empty div and hand crawlers a blank page.
 *
 * The hidden-until-revealed state lives behind a `.js` class on <html> (set by
 * an inline script before first paint). Without it, a JS failure would leave
 * every revealed section permanently invisible.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'shown')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  )
}
