import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[ARENABASE] Missing Supabase env vars. ' +
    'Copy .env.local.example → .env.local and fill in your project credentials.'
  );
}

/**
 * PUBLIC CLIENT
 * Use this in Server Components, Client Components, and route handlers
 * for all public read operations. Respects Row Level Security.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ADMIN CLIENT FACTORY
 * ⚠️  SERVER-SIDE ONLY — never import this in a Client Component.
 * Uses the service role key which BYPASSES RLS.
 * Call inside: Server Actions, Route Handlers (/app/api), or Server Components.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      '[ARENABASE] Missing SUPABASE_SERVICE_ROLE_KEY. ' +
      'This client must only be used in server-side code.'
    );
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
