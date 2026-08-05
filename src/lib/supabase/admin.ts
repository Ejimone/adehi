import 'server-only'

import { createClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * Used in exactly one place: the /cv route, which needs to mint a signed URL
 * for the private gabriel-documents bucket. Nothing else should import this.
 *
 * Two mechanisms keep the key out of the browser, neither of which relies on
 * anyone remembering a rule:
 *   1. No NEXT_PUBLIC_ prefix, so Next never inlines it into client bundles.
 *   2. The `server-only` import above makes the build FAIL if this module ever
 *      ends up in the client graph.
 */
export const supabaseAdmin = createClient<Database, 'gabriel'>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    db: { schema: 'gabriel' },
    auth: { persistSession: false, autoRefreshToken: false },
  },
)
