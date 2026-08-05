import Link from 'next/link'

import type { Social } from '@/lib/supabase/types'

export function Footer({
  name,
  email,
  socials,
  hasCv,
}: {
  name: string
  email: string
  socials: Social[]
  hasCv: boolean
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-line mt-32 border-t">
      <div className="container-void py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* Only render the email block if there actually is one. An empty
                mailto: is worse than no link at all. */}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="text-h3 font-display ease-void hover:text-muted transition-colors duration-[var(--dur-micro)]"
              >
                {email}
              </a>
            ) : null}
            <p className="text-muted mt-4 font-mono text-micro uppercase">
              © {year} {name}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3" aria-label="Footer">
            {socials.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-paper text-small ease-void transition-colors duration-[var(--dur-micro)]"
              >
                {s.label}
              </a>
            ))}
            {hasCv ? (
              <a
                href="/cv"
                className="text-muted hover:text-paper text-small ease-void transition-colors duration-[var(--dur-micro)]"
              >
                CV
              </a>
            ) : null}
            <Link
              href="/work"
              className="text-muted hover:text-paper text-small ease-void transition-colors duration-[var(--dur-micro)]"
            >
              Work
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
