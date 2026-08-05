'use client'

import { cn } from '@/lib/cn'
import { STAGGER } from '@/lib/motion'

/**
 * Per-character mask reveal for display type.
 *
 * Each character sits in an overflow-hidden wrapper and slides up from below,
 * staggered. Poiret One's thin strokes make this read as drawing rather than
 * sliding, which is the whole reason it is worth doing on this face.
 *
 * Accessibility and SEO both matter here because this renders the H1:
 *   - the component is a normal client component, so it still server-renders;
 *     the text is present in the initial HTML for crawlers
 *   - screen readers get the real word from aria-label on the wrapper, and the
 *     per-character spans are hidden from them — otherwise the text would be
 *     announced one letter at a time
 *   - the animation is CSS keyframes with a per-character delay, so it costs no
 *     JavaScript at runtime and is disabled wholesale by the reduced-motion
 *     block in globals.css
 */
export function SplitLine({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  return (
    <span className={cn('relative block overflow-hidden', className)}>
      {/*
        A real, readable copy of the text for assistive tech.
        aria-label on a plain <span> is not reliably announced, and role="text"
        is Safari-only — so the accessible name comes from actual text content
        that is visually hidden, while the animated per-character spans are
        hidden from the a11y tree to stop it being spelled out letter by letter.
      */}
      <span className="sr-only">{text}</span>
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="animate-rise inline-block will-change-transform"
          style={{ animationDelay: `${delay + i * STAGGER * 0.5}s` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}
