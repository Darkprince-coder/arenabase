import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import styles from './layout.module.css'

export const metadata = {
  title: {
    default: 'Admin | ARENABASE',
    template: '%s — Admin | ARENABASE',
  },
  robots: { index: false, follow: false },
}

/**
 * Admin shell layout.
 *
 * Defence in depth: middleware already redirects unauthenticated requests,
 * but we verify again here server-side in case middleware is bypassed
 * (e.g. during a Next.js edge-cache miss or misconfiguration).
 *
 * Renders: sidebar (sticky) + scrollable main content area.
 * The public Navbar is visible above this — it sits in the root layout.
 */
export default async function AdminLayout({ children }) {
  /* ── Auth guard ─────────────────────────────────── */
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // No user → just render children (middleware already redirects protected routes).
// Returning early here prevents a redirect loop on /admin/login itself.
if (!user) {
  return <>{children}</>
}

  return (
    <div className={styles.shell}>
      {/* ── Left: sticky sidebar ─────────────────── */}
      <AdminSidebar userEmail={user.email} />

      {/* ── Right: scrollable content ────────────── */}
      <div className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}
