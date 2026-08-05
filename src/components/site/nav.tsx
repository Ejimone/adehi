'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Nav({ name }: { name: string }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation.
  //
  // Adjusting state during render rather than in an effect: this is React's
  // documented pattern for "reset state when a prop changes", it avoids the
  // extra render pass an effect would cause, and unlike closing it from an
  // onClick handler it also covers browser back/forward while the menu is open.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header
        className={cn(
          'ease-void fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-micro)]',
          scrolled && !open
            ? 'border-hairline bg-bg/70 border-b backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="container-void flex h-[4.5rem] items-center justify-between">
          {/* Outfit, not Poiret One. The display face is a single thin weight
              built for large sizes — at 15px it goes spindly and loses contrast
              against the cream. Wide tracking carries the brand character
              instead. */}
          <Link
            href="/"
            className="text-[0.9375rem] tracking-[0.08em] uppercase"
            aria-label={`${name} — home`}
          >
            {name}
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'ease-void text-small relative transition-colors duration-[var(--dur-micro)]',
                  isActive(l.href) ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {l.label}
                {/* Underline rather than a filled pill: it reads quieter and
                    doesn't need a layout animation to feel intentional. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'bg-primary-strong ease-void absolute -bottom-1.5 left-0 h-px transition-[width] duration-[var(--dur-micro)]',
                    isActive(l.href) ? 'w-full' : 'w-0',
                  )}
                />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="text-small -mr-2 px-2 py-2 md:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Full-screen overlay. The previous site had no mobile nav at all — its
          six-item pill simply overflowed below ~640px. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="bg-bg fixed inset-0 z-40 flex flex-col justify-center md:hidden"
      >
        <nav className="container-void flex flex-col gap-2" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-h1 font-display py-2',
                isActive(l.href) ? 'text-ink' : 'text-muted',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
