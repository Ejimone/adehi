'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Enter-only page transition.
 *
 * Keyed on pathname so the CSS animation restarts on every navigation. There is
 * deliberately no exit animation: App Router swaps `children` for the new
 * route's RSC payload before an exit could complete, which makes
 * AnimatePresence-style exits unreliable and can strand a half-faded page.
 *
 * `children` passes straight through, so everything below stays server-rendered.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  )
}
