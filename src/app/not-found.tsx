import Link from 'next/link'

import { Container } from '@/components/ui/container'

/**
 * Shared 404. Lives at the root rather than inside (site) so it renders
 * identically for a genuinely missing URL and for an unauthorised hit on the
 * admin — same status, same markup, nothing to compare.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center">
      <Container>
        <p className="text-muted text-micro mb-8 font-sans uppercase">Error 404</p>
        <h1 className="text-display font-display">404</h1>
        <p className="text-lead text-muted mt-10 max-w-[38ch]">
          That page doesn&rsquo;t exist — or it moved.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="bg-primary-strong text-bg text-small ease-void rounded-full px-6 py-3 font-medium transition-opacity duration-[var(--dur-micro)] hover:opacity-90"
          >
            Back home
          </Link>
          <Link
            href="/work"
            className="border-hairline text-ink text-small ease-void hover:bg-wash rounded-full border px-6 py-3 font-medium transition-colors duration-[var(--dur-micro)]"
          >
            See the work
          </Link>
        </div>
      </Container>
    </main>
  )
}
