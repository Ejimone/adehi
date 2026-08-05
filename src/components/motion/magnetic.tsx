'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

/**
 * Magnetic hover: the element drifts toward the cursor within its own bounds.
 *
 * Pointer-driven transform only — no state, so moving the mouse never triggers
 * a React render. Restricted to devices with a fine pointer: on touch there is
 * no hover to respond to, and the listeners would only cost battery.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }

    const onLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </span>
  )
}
