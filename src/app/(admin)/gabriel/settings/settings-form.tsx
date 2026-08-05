'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { AdminButton, Field, TextArea } from '@/components/admin/ui'
import type { SiteSettings, Social } from '@/lib/supabase/types'

import { saveSettings, type SettingsResult } from './actions'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <AdminButton type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save settings'}
    </AdminButton>
  )
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction] = useActionState<SettingsResult, FormData>(saveSettings, null)

  const socials = Array.isArray(settings?.socials) ? (settings.socials as Social[]) : []

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <Field
        label="Full name"
        name="full_name"
        defaultValue={settings?.full_name}
        required
      />
      <Field
        label="Role title"
        name="role_title"
        defaultValue={settings?.role_title}
        hint="Used in SEO and structured data."
      />
      <TextArea
        label="Hero lines"
        name="hero_lines"
        defaultValue={settings?.hero_lines?.join('\n')}
        rows={3}
        hint="One line per row. These are the huge display words on the home page."
      />
      <TextArea
        label="Tagline"
        name="tagline"
        defaultValue={settings?.tagline}
        rows={2}
      />

      <Field label="Email" name="email" type="email" defaultValue={settings?.email} />
      <Field label="Location" name="location" defaultValue={settings?.location} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Availability label"
          name="availability_label"
          defaultValue={settings?.availability_label}
        />
        <label className="text-small flex items-end gap-3 pb-3">
          <input
            type="checkbox"
            name="available"
            defaultChecked={settings?.available}
            className="size-4"
          />
          Currently available
        </label>
      </div>

      <TextArea
        label="Socials"
        name="socials"
        defaultValue={socials.map((s) => `${s.label} | ${s.url}`).join('\n')}
        rows={5}
        hint="One per line, as: Label | https://url"
      />

      <TextArea
        label="Hero portraits"
        name="portraits"
        defaultValue={settings?.portraits?.join('\n')}
        rows={4}
        hint="One image URL per line. The first three become the overlapping circles in the hero."
      />
      <Field
        label="Primary portrait URL"
        name="portrait_url"
        defaultValue={settings?.portrait_url}
        hint="Used for the About page, structured data and social previews."
      />

      <TextArea
        label="Short bio"
        name="bio_short"
        defaultValue={settings?.bio_short}
        rows={3}
      />
      <TextArea
        label="Bio (Markdown)"
        name="bio_md"
        defaultValue={settings?.bio_md}
        rows={10}
        mono
        hint="Rendered to HTML on save."
      />

      <Field label="SEO title" name="seo_title" defaultValue={settings?.seo_title} />
      <TextArea
        label="SEO description"
        name="seo_description"
        defaultValue={settings?.seo_description}
        rows={2}
      />

      {state?.ok === false ? (
        <p role="alert" className="text-small text-[#b3261e]">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p role="status" className="text-small text-primary-strong">
          Saved. The public site updates on its next request.
        </p>
      ) : null}

      <Submit />
    </form>
  )
}
