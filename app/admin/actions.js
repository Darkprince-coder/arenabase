'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

/**
 * Signs out the current admin user and redirects to /admin/login.
 * Called from AdminSidebar via a <form action={signOut}> element,
 * which allows it to work without JavaScript.
 */
export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
