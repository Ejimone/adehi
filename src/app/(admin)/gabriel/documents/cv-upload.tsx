'use client'

import { useRef, useState, useTransition } from 'react'

import { AdminButton } from '@/components/admin/ui'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

import { recordCv } from './actions'

function slugifyFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/\.pdf$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export function CvUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [, startTransition] = useTransition()

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setStatus('That is not a PDF.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setStatus('That file is over the 20MB limit.')
      return
    }

    setBusy(true)
    setStatus('Uploading…')

    const supabase = createSupabaseBrowser()
    // Every revision gets its own path. Never overwrite a fixed key: the CDN
    // would cache it and old links would keep serving the previous file.
    const path = `cv/${Date.now()}-${slugifyFilename(file.name)}.pdf`

    const { error } = await supabase.storage
      .from('gabriel-documents')
      .upload(path, file, {
        // Explicit, not file.type. Browsers frequently report
        // application/octet-stream for drag-and-dropped PDFs, and Storage checks
        // the declared Content-Type against the bucket's MIME allowlist — so
        // relying on file.type produces spurious rejections.
        contentType: 'application/pdf',
        upsert: false,
      })

    if (error) {
      setBusy(false)
      setStatus(`Upload failed: ${error.message}`)
      return
    }

    const fd = new FormData()
    fd.set('storage_path', path)
    fd.set('filename', file.name)
    fd.set('size_bytes', String(file.size))

    startTransition(async () => {
      const result = await recordCv(null, fd)
      setBusy(false)
      if (result?.ok) {
        setStatus('Uploaded. /cv now serves this file.')
        if (inputRef.current) inputRef.current.value = ''
      } else {
        setStatus(result?.ok === false ? result.error : 'Could not save.')
      }
    })
  }

  return (
    <div className="border-hairline rounded-2xl border p-6">
      <p className="text-small">Upload a new CV</p>
      <p className="text-muted text-small mt-1 opacity-70">
        PDF, max 20MB. The permanent link <code>/cv</code> always resolves to whichever
        version is current, so it never needs reprinting.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="text-small max-w-full"
        />
        <AdminButton type="button" onClick={handleUpload} disabled={busy}>
          {busy ? 'Working…' : 'Upload'}
        </AdminButton>
      </div>

      {status ? (
        <p role="status" className="text-small mt-4">
          {status}
        </p>
      ) : null}
    </div>
  )
}
