import { AdminButton, Empty, PageHead } from '@/components/admin/ui'
import { adminGetMessages } from '@/lib/queries/admin'

import { deleteMessage, setMessageStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const messages = await adminGetMessages()
  const unread = messages.filter((m) => m.status === 'new').length

  return (
    <>
      <PageHead
        title={unread > 0 ? `Inbox (${unread} new)` : 'Inbox'}
        action={
          <p className="text-muted text-small">
            {messages.length} message{messages.length === 1 ? '' : 's'}
          </p>
        }
      />

      {messages.length === 0 ? (
        <Empty>No messages yet.</Empty>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={
                m.status === 'new'
                  ? 'border-primary/40 bg-wash rounded-2xl border p-6'
                  : 'border-hairline rounded-2xl border p-6'
              }
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="text-small">{m.name}</p>
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(
                      m.subject ? `Re: ${m.subject}` : 'Re: your message',
                    )}`}
                    className="text-muted text-small hover:text-primary-strong transition-colors"
                  >
                    {m.email}
                  </a>
                </div>
                <p className="text-muted text-small opacity-70">
                  {new Date(m.created_at).toLocaleString('en-GB')}
                </p>
              </div>

              {m.subject ? (
                <p className="text-small mt-4 font-medium">{m.subject}</p>
              ) : null}

              {/* whitespace-pre-wrap so line breaks the sender typed survive,
                  while React's escaping keeps the content inert. */}
              <p className="text-small mt-3 whitespace-pre-wrap">{m.message}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                {m.status !== 'read' ? (
                  <form action={setMessageStatus}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="status" value="read" />
                    <AdminButton variant="ghost" type="submit">
                      Mark read
                    </AdminButton>
                  </form>
                ) : null}
                {m.status !== 'replied' ? (
                  <form action={setMessageStatus}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="status" value="replied" />
                    <AdminButton variant="ghost" type="submit">
                      Mark replied
                    </AdminButton>
                  </form>
                ) : null}
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <AdminButton variant="danger" type="submit">
                    Delete
                  </AdminButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
