'use client'

import { useRef, useState } from 'react'

import { AdminButton } from '@/components/admin/ui'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

/**
 * Uploads an image to the public media bucket and hands back its URL to paste
 * into a cover-image or portrait field.
 *
 * No progress percentage, deliberately. supabase-js `.upload()` is fetch-based
 * and exposes no progress events; a real percentage needs createSignedUploadUrl
 * plus a manual XMLHttpRequest. For portfolio-sized images a busy state is the
 * honest trade rather than a fake bar that jumps 0 → 100.
 */
export function MediaUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setStatus('Pick an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus('That image is over the 10MB bucket limit.')
      return
    }

    setBusy(true)
    setStatus('Uploading…')
    setUrl(null)

    const supabase = createSupabaseBrowser()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `images/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`

    const { error } = await supabase.storage.from('gabriel-media').upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })

    setBusy(false)

    if (error) {
      setStatus(`Upload failed: ${error.message}`)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('gabriel-media').getPublicUrl(path)

    setUrl(publicUrl)
    setStatus('Uploaded. Copy the URL below into the field you need.')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="border-hairline rounded-2xl border p-6">
      <p className="text-small">Upload an image</p>
      <p className="text-muted text-small mt-1 opacity-70">
        JPEG, PNG, WebP or AVIF. Max 10MB.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="text-small max-w-full"
        />
        <AdminButton type="button" onClick={handleUpload} disabled={busy}>
          {busy ? 'Uploading…' : 'Upload'}
        </AdminButton>
      </div>

      {status ? (
        <p role="status" className="text-small mt-4">
          {status}
        </p>
      ) : null}

      {url ? (
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="border-hairline text-small mt-3 w-full rounded-xl border bg-white px-4 py-2.5"
        />
      ) : null}
    </div>
  )
}
