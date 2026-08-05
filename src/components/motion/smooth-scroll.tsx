'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

/**
 * Lenis smooth scroll.
 *
 * `children` is deliberately just passed through: JSX handed to a client
 * component as children is still rendered on the SERVER and shipped in the RSC
 * payload. So wrapping the whole site in this costs the Lenis runtime and
 * nothing else — every page below stays server-rendered and indexable.
 *
 * Hijacking scroll is a real accessibility liability, so this is fully disabled
 * under prefers-reduced-motion rather than merely shortened. Native scrolling
 * then applies, and nothing else on the page depends on Lenis being present.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.1,
      // Matches --ease-void closely enough that Lenis and CSS transitions feel
      // like one system rather than two.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // App Router restores scroll itself, but Lenis holds its own position and
  // would otherwise land the next route mid-page.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return <>{children}</>
}
