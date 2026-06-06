import { createBrowserClient } from '@supabase/ssr'

/**
 * Auth-aware Supabase client for Client Components ('use client').
 *
 * Use this for sign-in, sign-out, and auth state in the browser.
 * It stores the session in cookies (not localStorage), so the server
 * can read it via createSupabaseServerClient().
 *
 * Usage:
 *   const supabase = createSupabaseBrowserClient()
 *   await supabase.auth.signInWithPassword({ email, password })
 *
 * createBrowserClient() returns a singleton per render — safe to call
 * inside components without useMemo.
 *
 * Requires: npm install @supabase/ssr
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
