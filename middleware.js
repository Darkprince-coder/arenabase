import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

/**
 * Route guard for all /admin/* paths.
 *
 * Flow:
 *  - Unauthenticated user hits /admin/* → redirect /admin/login
 *  - Authenticated user hits /admin/login → redirect /admin
 *  - Everything else passes through unchanged
 *
 * Uses @supabase/ssr to read the session from request cookies.
 * Always calls getUser() (not getSession()) — validates the JWT server-side.
 */
export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() re-validates the token with Supabase Auth — never use getSession() here
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage  = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')

  // Not logged in → send to login
  if (!user && isAdminRoute && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Already logged in → skip login page
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
