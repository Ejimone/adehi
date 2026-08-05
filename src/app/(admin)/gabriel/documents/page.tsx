import { AdminButton, Empty, PageHead } from '@/components/admin/ui'
import { adminGetDocuments } from '@/lib/queries/admin'

import { makeCurrent } from './actions'
import { CvUpload } from './cv-upload'

export const dynamic = 'force-dynamic'

export default async function AdminDocumentsPage() {
  const documents = await adminGetDocuments()

  return (
    <>
      <PageHead title="CV" />

      <CvUpload />

      <h2 className="text-h3 font-display mt-12 mb-4">Versions</h2>

      {documents.length === 0 ? (
        <Empty>No CV uploaded yet.</Empty>
      ) : (
        <ul className="border-hairline divide-hairline divide-y rounded-2xl border">
          {documents.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
              <div className="min-w-0 flex-1">
                <p className="text-small truncate">{d.filename}</p>
                <p className="text-muted text-small mt-1 opacity-70">
                  v{d.version} · {new Date(d.created_at).toLocaleDateString('en-GB')}
                  {d.size_bytes ? ` · ${Math.round(d.size_bytes / 1024)}KB` : ''}
                </p>
              </div>

              {d.is_current ? (
                <span className="text-primary-strong text-micro uppercase">Current</span>
              ) : (
                <form action={makeCurrent}>
                  <input type="hidden" name="id" value={d.id} />
                  <AdminButton variant="ghost" type="submit">
                    Make current
                  </AdminButton>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
