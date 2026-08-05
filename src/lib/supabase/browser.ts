'use client'

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from './database.types'

/**
 * Browser client, used ONLY for binary uploads to Storage.
 *
 * This is the single documented exception to "every mutation goes through a
 * Server Action". Server Actions cap request bodies at 1MB by default, and
 * Vercel's functions cap at 4.5MB regardless — so an 8MB screenshot cannot be
 * pushed through one. Uploads therefore go browser → Storage directly, and a
 * Server Action then records the resulting path in the database.
 *
 * Security is unchanged: Storage RLS requires gabriel.is_admin() to write to
 * either bucket, so this client can only upload for a signed-in admin.
 */
export function createSupabaseBrowser() {
  return createBrowserClient<Database, 'gabriel'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { db: { schema: 'gabriel' } },
  )
}
