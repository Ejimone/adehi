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

export function Nav({ name, available }: { name: string; available: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on route change, and lock the page behind the overlay while it's open.
  useEffect(() => setOpen(false), [pathname])

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
            ? 'border-line bg-void/70 border-b backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="container-void flex h-[4.5rem] items-center justify-between">
          <Link
            href="/"
            className="text-small font-display tracking-tight"
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
                  isActive(l.href) ? 'text-paper' : 'text-muted hover:text-paper',
                )}
              >
                {l.label}
                {/* Underline rather than a filled pill: it reads quieter and
                    doesn't need a layout animation to feel intentional. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'bg-paper ease-void absolute -bottom-1.5 left-0 h-px transition-[width] duration-[var(--dur-micro)]',
                    isActive(l.href) ? 'w-full' : 'w-0',
                  )}
                />
              </Link>
            ))}

            {available ? (
              <span className="text-muted flex items-center gap-2 font-mono text-micro uppercase">
                <span className="bg-paper inline-block size-1.5 rounded-full" />
                Available
              </span>
            ) : null}
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
        className="bg-void fixed inset-0 z-40 flex flex-col justify-center md:hidden"
      >
        <nav className="container-void flex flex-col gap-2" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-h1 font-display py-2',
                isActive(l.href) ? 'text-paper' : 'text-muted',
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
