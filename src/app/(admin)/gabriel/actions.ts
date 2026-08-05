'use server'

import { redirect } from 'next/navigation'

import { createSupabaseServer } from '@/lib/supabase/server'

export type AuthResult = { ok: false; error: string } | null

export async function signIn(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createSupabaseServer()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  // Never distinguish "no such user" from "wrong password" — that difference
  // turns the form into an account-enumeration oracle.
  if (error) return { ok: false, error: 'Invalid credentials.' }

  redirect('/gabriel')
}

export async function signOut() {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect('/gabriel')
}
