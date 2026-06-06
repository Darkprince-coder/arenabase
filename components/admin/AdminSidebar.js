'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { signOut } from '@/app/admin/actions'
import styles from './AdminSidebar.module.css'

/* ── Nav item icons ─────────────────────────────────── */
function DashboardIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function FixturesIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> }
function ResultsIcon()      { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> }
function TournamentIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/></svg> }
function AnnouncementIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function TeamsIcon()        { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function VenuesIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function LogoutIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function PublicIcon()       { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }

/* ── Nav structure ──────────────────────────────────── */
const NAV_ITEMS = [
  { href: '/admin',              label: 'Dashboard',     icon: DashboardIcon,    exact: true },
  { href: '/admin/fixtures',     label: 'Fixtures',      icon: FixturesIcon },
  { href: '/admin/results',      label: 'Results',       icon: ResultsIcon },
  { href: '/admin/tournaments',  label: 'Tournaments',   icon: TournamentIcon },
  { href: '/admin/announcements',label: 'Announcements', icon: AnnouncementIcon },
  { href: '/admin/teams',        label: 'Teams',         icon: TeamsIcon },
  { href: '/admin/venues',       label: 'Venues',        icon: VenuesIcon },
]

/* ── Sidebar ────────────────────────────────────────── */
export default function AdminSidebar({ userEmail = '' }) {
  const pathname = usePathname()

  function isActive(href, exact) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  // Abbreviated email for display
  const displayEmail = userEmail.length > 22
    ? userEmail.slice(0, 20) + '…'
    : userEmail

  return (
    <aside className={styles.sidebar} aria-label="Admin navigation">
      {/* ── Logo ──────────────────────────────────── */}
      <div className={styles.logoRow}>
        <Logo size="sm" />
        <span className={styles.adminBadge}>ADMIN</span>
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav className={styles.nav} aria-label="Admin sections">
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={styles.navIcon}><Icon /></span>
                  <span className={styles.navLabel}>{label}</span>
                  {active && <span className={styles.activePip} aria-hidden="true" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Divider ───────────────────────────────── */}
      <div className={styles.divider} aria-hidden="true" />

      {/* ── View public site link ─────────────────── */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.publicLink}
      >
        <PublicIcon />
        View Public Site
      </a>

      {/* ── User + Logout ─────────────────────────── */}
      <div className={styles.footer}>
        <div className={styles.userRow}>
          <div className={styles.avatar} aria-hidden="true">
            {displayEmail.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userRole}>Super Admin</span>
            <span className={styles.userEmail} title={userEmail}>{displayEmail}</span>
          </div>
        </div>

        {/* signOut is a Server Action — works without JS via form */}
        <form action={signOut}>
          <button type="submit" className={styles.logoutBtn} aria-label="Sign out">
            <LogoutIcon />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
