'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { signIn, type AuthResult } from './actions'

const field =
  'bg-white border-hairline text-ink w-full rounded-xl border px-4 py-3 text-small focus:border-primary/50 focus:outline-none'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary-strong text-bg text-small w-full rounded-full px-6 py-3 font-medium transition-colors hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Signing in…' : 'Continue'}
    </button>
  )
}

/**
 * Deliberately anonymous: no name, no logo, no "Admin" heading, no link back to
 * the site. Someone who guesses the URL learns nothing about whose it is.
 *
 * The obscurity is only the outer layer — the real boundary is Supabase Auth
 * plus the admin_users check in the layout, plus RLS on every table.
 */
export function LoginForm() {
  const [state, formAction] = useActionState<AuthResult, FormData>(signIn, null)

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form action={formAction} className="w-full max-w-[22rem] space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="Email"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            className={field}
          />
        </div>

        {state?.ok === false ? (
          <p role="alert" className="text-small text-[#b3261e]">
            {state.error}
          </p>
        ) : null}

        <Submit />
      </form>
    </main>
  )
}
