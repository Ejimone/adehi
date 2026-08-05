import Link from 'next/link'

import { AdminButton, Empty, PageHead } from '@/components/admin/ui'
import { adminGetProjects } from '@/lib/queries/admin'

import { toggleStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const projects = await adminGetProjects()

  return (
    <>
      <PageHead
        title="Projects"
        action={
          <Link
            href="/gabriel/projects/new"
            className="bg-primary-strong text-bg text-small rounded-full px-5 py-2.5 font-medium transition-colors hover:opacity-90"
          >
            New project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <Empty>No projects yet. Create one to get started.</Empty>
      ) : (
        <ul className="border-hairline divide-hairline divide-y rounded-2xl border">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/gabriel/projects/${p.id}`}
                  className="text-small hover:text-primary-strong transition-colors"
                >
                  {p.title}
                </Link>
                <p className="text-muted text-small mt-1 truncate opacity-70">
                  /work/{p.slug}
                  {p.year ? ` · ${p.year}` : ''}
                </p>
              </div>

              <span
                className={
                  p.status === 'published'
                    ? 'text-primary-strong text-micro uppercase'
                    : 'text-muted text-micro uppercase'
                }
              >
                {p.status}
              </span>

              <form action={toggleStatus}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="slug" value={p.slug} />
                <input
                  type="hidden"
                  name="next"
                  value={p.status === 'published' ? 'draft' : 'published'}
                />
                <AdminButton variant="ghost" type="submit">
                  {p.status === 'published' ? 'Unpublish' : 'Publish'}
                </AdminButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
