'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { cn } from '@/lib/cn'
import type { ActionResult } from '@/lib/schemas'

import { submitContact } from './actions'

const field =
  'bg-wash border-hairline text-ink placeholder:text-muted/60 ease-void w-full rounded-xl border px-4 py-3 text-small transition-colors duration-[var(--dur-micro)] focus:border-paper/30 focus:outline-none'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary-strong text-bg text-small ease-void rounded-full px-6 py-3 font-medium transition-opacity duration-[var(--dur-micro)] active:scale-[0.98] disabled:opacity-50"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return (
    <p role="alert" className="text-small mt-2 text-[#ff6b6b]">
      {errors[0]}
    </p>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    submitContact,
    null,
  )

  if (state?.ok) {
    return (
      <div className="border-hairline bg-wash rounded-2xl border p-8" role="status">
        <p className="text-h3 font-display">Message sent.</p>
        <p className="text-muted mt-3">I&rsquo;ll get back to you shortly.</p>
      </div>
    )
  }

  const errs = state?.ok === false ? state.fieldErrors : undefined

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="name"
          className="text-muted text-micro mb-2 block font-sans uppercase"
        >
          Name
        </label>
        <input id="name" name="name" required maxLength={120} className={field} />
        <FieldError errors={errs?.name} />
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-muted text-micro mb-2 block font-sans uppercase"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          className={field}
        />
        <FieldError errors={errs?.email} />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="text-muted text-micro mb-2 block font-sans uppercase"
        >
          Subject <span className="normal-case">(optional)</span>
        </label>
        <input id="subject" name="subject" maxLength={200} className={field} />
        <FieldError errors={errs?.subject} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-muted text-micro mb-2 block font-sans uppercase"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          className={cn(field, 'resize-y')}
        />
        <FieldError errors={errs?.message} />
      </div>

      {/* Honeypot: off-screen rather than display:none, and explicitly hidden
          from assistive tech and autofill so no real user ever fills it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state?.ok === false ? (
        <p role="alert" className="text-small text-[#ff6b6b]">
          {state.error}
        </p>
      ) : null}

      <Submit />
    </form>
  )
}
