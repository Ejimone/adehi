import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from './database.types'

/**
 * Session-bound client. Use ONLY inside /gabriel and Server Actions.
 *
 * It reads cookies, which forces dynamic rendering — correct for the admin
 * (which must never be cached) and wrong for public pages. Public pages use
 * supabasePublic instead.
 *
 * Writes still go through RLS rather than around it, so a bug in the route
 * gate cannot by itself grant write access without an admin_users row.
 */
export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient<Database, 'gabriel'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      db: { schema: 'gabriel' },
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Thrown when called during a Server Component render, where
            // cookies are read-only. Middleware refreshes the session instead,
            // so this is safe to swallow.
          }
        },
      },
    },
  )
}
