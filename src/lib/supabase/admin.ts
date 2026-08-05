import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * Used in exactly one place: the /cv route, which needs to sign a URL for the
 * private gabriel-documents bucket. Nothing else should import this.
 *
 * Two mechanisms keep the key out of the browser, neither relying on anyone
 * remembering a rule:
 *   1. No NEXT_PUBLIC_ prefix, so Next never inlines it into client bundles.
 *   2. The `server-only` import makes the build FAIL if this module ever ends
 *      up in the client graph.
 *
 * Constructed lazily rather than at module scope. At module scope, an unset
 * SUPABASE_SECRET_KEY throws during `next build`'s page-data collection and
 * fails the ENTIRE build — so the site could not be built at all until the key
 * was configured. This way a missing key degrades exactly one route, at request
 * time, which is the correct blast radius.
 */
let client: SupabaseClient<Database, 'gabriel'> | null = null

export function getSupabaseAdmin(): SupabaseClient<Database, 'gabriel'> | null {
  const key = process.env.SUPABASE_SECRET_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!key || !url) return null

  client ??= createClient<Database, 'gabriel'>(url, key, {
    db: { schema: 'gabriel' },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return client
}
