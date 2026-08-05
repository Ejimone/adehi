/**
 * Shared motion constants, mirroring the CSS tokens in globals.css.
 *
 * Duplicated here because GSAP and Framer take numbers, not CSS variables. If
 * these drift from the CSS the site develops two different motion feels, which
 * is exactly the incoherence the single-curve rule exists to prevent.
 */

/** --ease-void. Expo-out. */
export const EASE = [0.16, 1, 0.3, 1] as const

/** GSAP wants a string; this is the same curve. */
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const DUR = {
  micro: 0.4,
  macro: 0.8,
  hero: 1.2,
} as const

export const STAGGER = 0.06

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
