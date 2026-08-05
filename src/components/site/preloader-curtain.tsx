'use client'

import { useEffect, useState } from 'react'

const SESSION_KEY = 'ga:intro-played'
const DURATION = 1400

/**
 * Intro curtain.
 *
 * The reference uses a carrot; this uses its own mark — a ring bisected by the
 * same vertical hairline that runs down every page, so the loader introduces the
 * site's one structural motif rather than being unrelated decoration.
 *
 * Three things keep it from becoming an annoyance:
 *   - it plays once per session, not on every navigation
 *   - it never blocks: the page underneath is fully rendered the whole time,
 *     so this is a cosmetic overlay, never a gate on content
 *   - it is skipped entirely under prefers-reduced-motion
 *
 * This module is only ever loaded client-side (see preloader.tsx), so reading
 * window/sessionStorage in the initializers below is safe and means the right
 * decision is made on the first render rather than after a visible frame.
 */
export default function PreloaderCurtain() {
  const [play] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem(SESSION_KEY)
  })

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(!play)

  useEffect(() => {
    if (!play) return

    let raf = 0
    const start = performance.now()

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, '1')
      setProgress(100)
      setDone(true)
    }

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1)
      // Ease-out so it decelerates into 100 rather than stopping dead.
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        window.setTimeout(finish, 260)
      }
    }

    raf = requestAnimationFrame(tick)

    // Failsafe. requestAnimationFrame does not fire in a background tab, and
    // some headless/virtualised environments never advance performance.now().
    // Without this the curtain could sit over the page indefinitely with the
    // body scroll-locked — a cosmetic overlay must never be able to trap the
    // site, so a wall-clock timer force-finishes it regardless.
    const failsafe = window.setTimeout(finish, DURATION + 1200)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(failsafe)
    }
  }, [play])

  useEffect(() => {
    if (done) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [done])

  if (!play) return null

  return (
    <div
      aria-hidden="true"
      className="bg-deep ease-void pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center transition-transform duration-[900ms]"
      style={{ transform: done ? 'translateY(-101%)' : 'translateY(0)' }}
    >
      <svg width="44" height="72" viewBox="0 0 44 72" fill="none" aria-hidden="true">
        {/* The spine — the same hairline the whole site is built around. */}
        <line
          x1="22"
          y1="4"
          x2="22"
          y2="68"
          stroke="#fff2e0"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <circle
          cx="22"
          cy="36"
          r="15"
          stroke="#b55500"
          strokeWidth="1.5"
          fill="none"
          style={{
            transformOrigin: '22px 36px',
            transform: `scale(${0.6 + (progress / 100) * 0.4})`,
            opacity: 0.4 + (progress / 100) * 0.6,
            transition: 'transform 120ms linear, opacity 120ms linear',
          }}
        />
      </svg>

      <div className="mt-8 h-px w-40 overflow-hidden bg-[rgb(255_242_224/0.18)]">
        <div
          className="h-full bg-[#b55500]"
          style={{ width: `${progress}%`, transition: 'width 120ms linear' }}
        />
      </div>

      <p className="text-micro mt-5 text-[rgb(255_242_224/0.5)] uppercase">
        {String(progress).padStart(3, '0')}
      </p>
    </div>
  )
}
