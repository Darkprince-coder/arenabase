import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Auth-aware Supabase client for Server Components and Server Actions.
 *
 * Use this when you need to:
 *   - Read the currently authenticated user: supabase.auth.getUser()
 *   - Make queries that respect the user's RLS session
 *
 * For admin write operations (INSERT, UPDATE, DELETE) that bypass RLS,
 * keep using createAdminClient() from lib/supabase.js — it uses the
 * service role key.
 *
 * Usage:
 *   const supabase = await createSupabaseServerClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 * Requires: npm install @supabase/ssr
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookie writes are handled by middleware
          }
        },
      },
    }
  )
}
