import Link from 'next/link'

import { PageHead } from '@/components/admin/ui'
import {
  adminGetDocuments,
  adminGetMessages,
  adminGetProjects,
  adminGetSettings,
} from '@/lib/queries/admin'

export const dynamic = 'force-dynamic'

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link
      href={href}
      className="border-hairline hover:bg-wash rounded-2xl border p-6 transition-colors"
    >
      <p className="text-muted text-micro uppercase">{label}</p>
      <p className="text-h2 font-display mt-3">{value}</p>
    </Link>
  )
}

export default async function AdminDashboard() {
  const [projects, messages, documents, settings] = await Promise.all([
    adminGetProjects(),
    adminGetMessages(),
    adminGetDocuments(),
    adminGetSettings(),
  ])

  const published = projects.filter((p) => p.status === 'published').length
  const unread = messages.filter((m) => m.status === 'new').length
  const cv = documents.find((d) => d.kind === 'cv' && d.is_current)

  // Surfaces exactly the gaps that make the public site look unfinished.
  const todo = [
    !settings?.email && 'Add a contact email in Settings',
    (settings?.socials as unknown[] | undefined)?.length === 0 &&
      'Add social links in Settings',
    !settings?.bio_md && 'Write the About bio in Settings',
    (settings?.portraits?.length ?? 0) === 0 && 'Upload hero portraits in Settings',
    published === 0 && 'Publish at least one project',
    !cv && 'Upload a CV',
  ].filter(Boolean) as string[]

  return (
    <>
      <PageHead title="Overview" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Published"
          value={`${published} / ${projects.length}`}
          href="/gabriel/projects"
        />
        <Stat label="Unread messages" value={String(unread)} href="/gabriel/messages" />
        <Stat label="CV" value={cv ? 'Live' : 'None'} href="/gabriel/documents" />
        <Stat
          label="Socials"
          value={String((settings?.socials as unknown[] | undefined)?.length ?? 0)}
          href="/gabriel/settings"
        />
      </div>

      {todo.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-h3 font-display mb-4">Before launch</h2>
          <ul className="border-hairline divide-hairline divide-y rounded-2xl border">
            {todo.map((item) => (
              <li key={item} className="text-small px-6 py-4">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
