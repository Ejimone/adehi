import 'server-only'

import { createClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

/**
 * The client every PUBLIC page uses. Deliberately cookie-less.
 *
 * This is the single most important performance decision in the app. The
 * @supabase/ssr helper always reads cookies(), and calling cookies() in a
 * Server Component opts that entire route out of static rendering. Use it on
 * /work/[slug] and every case study silently becomes server-rendered per
 * request, generateStaticParams turns decorative, and the build output flips
 * from ○ to ƒ.
 *
 * Anonymous access is safe here because RLS is the boundary: the anon role can
 * only ever see published rows. See supabase/migrations/*_gabriel_rls.sql.
 */
export const supabasePublic = createClient<Database, 'gabriel'>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    db: { schema: 'gabriel' },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
)
