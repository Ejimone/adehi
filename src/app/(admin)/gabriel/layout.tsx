import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { createSupabaseServer } from '@/lib/supabase/server'

import { signOut } from './actions'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s — Gabriel Adehi" template.
  // Without it the tab reads "Admin — Gabriel Adehi", which tells anyone who
  // guesses this URL both that it is an admin panel and whose it is — undoing
  // the entire point of an unbranded login form.
  title: { absolute: 'Sign in' },
  // Same reason: these are inherited from the root layout and would otherwise
  // put the owner's name into og:title and og:site_name on this page.
  description: null,
  openGraph: null,
  twitter: null,
  // Kept out of the index here rather than via robots.txt — a
  // `Disallow: /gabriel` line would publicly advertise the exact path.
  robots: { index: false, follow: false, nocache: true },
}

// Nothing under /gabriel may ever be cached or statically rendered.
export const dynamic = 'force-dynamic'

const NAV = [
  { href: '/gabriel', label: 'Overview' },
  { href: '/gabriel/projects', label: 'Projects' },
  { href: '/gabriel/settings', label: 'Settings' },
  { href: '/gabriel/documents', label: 'CV' },
  { href: '/gabriel/messages', label: 'Inbox' },
]

/**
 * THE authoritative auth gate.
 *
 * Two checks, both required: a verified session, then membership in
 * gabriel.admin_users. Middleware only refreshes the token — it is not trusted
 * for authorisation, so a missed matcher config cannot expose anything here.
 *
 * Even if both checks were somehow bypassed, RLS would still return nothing:
 * every admin policy is gated on gabriel.is_admin().
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return <LoginForm />

  const { data: admin } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  // Authenticated but not an admin gets the same anonymous form as a stranger,
  // so a valid non-admin login reveals nothing about what lives here.
  if (!admin) return <LoginForm />

  return (
    <div className="min-h-screen">
      <header className="border-hairline bg-bg sticky top-0 z-40 border-b">
        <div className="container-void flex h-16 items-center justify-between gap-6">
          <nav className="flex flex-wrap items-center gap-6" aria-label="Admin">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-small text-muted hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-small text-muted hover:text-ink hidden transition-colors sm:block"
            >
              View site ↗
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-small text-muted hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-void py-12">{children}</main>
    </div>
  )
}
