import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase auth session cookie on each admin request.
 *
 * This is NOT the security boundary. Middleware runs on the edge, has had
 * bypass CVEs (notably the x-middleware-subrequest header bypass), and cannot
 * cheaply check admin_users. The authoritative gate is the (admin) layout, and
 * behind that, RLS. This only keeps the session token fresh so the layout has
 * something valid to check.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          for (const { name, value } of list) request.cookies.set(name, value)
          response = NextResponse.next({ request })
          for (const { name, value, options } of list) {
            response.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // getUser(), never getSession().
  //
  // getSession() reads the cookie and decodes it WITHOUT verifying the JWT
  // signature against the auth server, so a forged cookie passes it. That is a
  // real authentication bypass, not a style preference.
  await supabase.auth.getUser()

  return response
}

export const config = {
  // Only the admin needs session refresh. Running this on public routes would
  // add a Supabase round trip to pages that are otherwise fully static.
  matcher: ['/gabriel/:path*'],
}
