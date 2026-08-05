'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { AdminButton, Field, TextArea, fieldClass } from '@/components/admin/ui'
import type { Project } from '@/lib/supabase/types'

import { deleteProject, saveProject, type SaveResult } from './actions'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <AdminButton type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save'}
    </AdminButton>
  )
}

export function ProjectForm({ project }: { project: Project | null }) {
  const [state, formAction] = useActionState<SaveResult | null, FormData>(
    saveProject,
    null,
  )

  return (
    <>
      <form action={formAction} className="max-w-3xl space-y-6">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}
        {project ? (
          <input type="hidden" name="previous_slug" value={project.slug} />
        ) : null}

        <Field label="Title" name="title" defaultValue={project?.title} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={project?.slug}
          hint="Leave blank to generate from the title. Changing this changes the public URL."
        />
        <Field label="Tagline" name="tagline" defaultValue={project?.tagline} />
        <TextArea
          label="Summary"
          name="summary"
          defaultValue={project?.summary}
          rows={3}
          hint="One paragraph, shown above the case-study body."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Role" name="role" defaultValue={project?.role} />
          <Field label="Year" name="year" type="number" defaultValue={project?.year} />
          <Field
            label="Period"
            name="period"
            defaultValue={project?.period}
            hint="e.g. Mar 2025 – Aug 2025"
          />
          <Field label="Client" name="client" defaultValue={project?.client} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Stack"
            name="stack"
            defaultValue={project?.stack.join(', ')}
            hint="Comma separated."
          />
          <Field
            label="Tags"
            name="tags"
            defaultValue={project?.tags.join(', ')}
            hint="Comma separated."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Live URL" name="live_url" defaultValue={project?.live_url} />
          <Field label="Repo URL" name="repo_url" defaultValue={project?.repo_url} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Cover image URL"
            name="cover_url"
            defaultValue={project?.cover_url}
            hint="Upload in Settings → media, then paste the public URL."
          />
          <Field
            label="Cover alt text"
            name="cover_alt"
            defaultValue={project?.cover_alt}
          />
        </div>

        <TextArea
          label="Body (Markdown)"
          name="body_md"
          defaultValue={project?.body_md}
          rows={16}
          mono
          hint="Rendered to HTML when you save, so the public site parses nothing at runtime."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="text-muted text-micro mb-2 block uppercase"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? 'draft'}
              className={fieldClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <label className="text-small flex items-end gap-3 pb-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured}
              className="size-4"
            />
            Featured on the home page
          </label>
        </div>

        {state?.ok === false ? (
          <p role="alert" className="text-small text-[#b3261e]">
            {state.error}
          </p>
        ) : null}

        {state?.ok ? (
          <p role="status" className="text-small text-primary-strong">
            Saved. The public site updates on its next request — no redeploy.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Submit />
          <Link href="/gabriel/projects" className="text-small text-muted hover:text-ink">
            Back to projects
          </Link>
        </div>
      </form>

      {/* Separate form: nesting it inside the save form would be invalid HTML
          and the delete button would submit the wrong action. */}
      {project ? (
        <form action={deleteProject} className="border-hairline mt-12 border-t pt-8">
          <input type="hidden" name="id" value={project.id} />
          <input type="hidden" name="slug" value={project.slug} />
          <AdminButton variant="danger" type="submit">
            Delete project
          </AdminButton>
        </form>
      ) : null}
    </>
  )
}
