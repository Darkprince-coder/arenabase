'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { signOut } from '@/app/admin/actions'
import styles from './AdminSidebar.module.css'

/* ── Icons ──────────────────────────────────────────── */
function DashboardIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function FixturesIcon()      { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> }
function ResultsIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> }
function TournamentIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/></svg> }
function AnnouncementIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function TeamsIcon()         { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function VenuesIcon()        { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function LogoutIcon()        { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function ExternalIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }
function MenuIcon()          { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg> }
function CloseIcon()         { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }

/* ── Nav items ──────────────────────────────────────── */
const NAV_ITEMS = [
  { href: '/admin',               label: 'Dashboard',     Icon: DashboardIcon,    exact: true },
  { href: '/admin/fixtures',      label: 'Fixtures',      Icon: FixturesIcon },
  { href: '/admin/results',       label: 'Results',       Icon: ResultsIcon },
  { href: '/admin/tournaments',   label: 'Tournaments',   Icon: TournamentIcon },
  { href: '/admin/announcements', label: 'Announcements', Icon: AnnouncementIcon },
  { href: '/admin/teams',         label: 'Teams',         Icon: TeamsIcon },
  { href: '/admin/venues',        label: 'Venues',        Icon: VenuesIcon },
]

/* Map pathnames → readable section labels for mobile header */
const SECTION_LABELS = {
  '/admin/fixtures':      'Fixtures',
  '/admin/results':       'Results',
  '/admin/tournaments':   'Tournaments',
  '/admin/announcements': 'Announcements',
  '/admin/teams':         'Teams',
  '/admin/venues':        'Venues',
  '/admin':               'Dashboard',
}

function getSectionLabel(pathname) {
  const match = Object.keys(SECTION_LABELS)
    .sort((a, b) => b.length - a.length) // longest match first
    .find(key => pathname.startsWith(key))
  return SECTION_LABELS[match] ?? 'Admin'
}

/* ── Shared nav list (used in both sidebar and drawer) ── */
function NavList({ pathname, onNavigate }) {
  function isActive(href, exact) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <nav className={styles.nav} aria-label="Admin sections">
      <ul className={styles.navList} role="list">
        {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}
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
  )
}

/* ── Footer (user info + logout, used in sidebar & drawer) ── */
function SidebarFooter({ displayEmail, userEmail }) {
  return (
    <div className={styles.footer}>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.publicLink}
      >
        <ExternalIcon />
        View Public Site
      </a>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.userRow}>
        <div className={styles.avatar} aria-hidden="true">
          {displayEmail.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userRole}>Super Admin</span>
          <span className={styles.userEmail} title={userEmail}>{displayEmail}</span>
        </div>
      </div>

      <form action={signOut}>
        <button type="submit" className={styles.logoutBtn} aria-label="Sign out">
          <LogoutIcon />
          Sign Out
        </button>
      </form>
    </div>
  )
}

/* ── Main component ─────────────────────────────────── */
export default function AdminSidebar({ userEmail = '' }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  /* Close drawer on route change */
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const displayEmail  = userEmail.length > 22 ? userEmail.slice(0, 20) + '…' : userEmail
  const sectionLabel  = getSectionLabel(pathname)

  return (
    <>
      {/* ─────────────────────────────────────────────
          DESKTOP: sticky left sidebar
          ───────────────────────────────────────────── */}
      <aside className={styles.sidebar} aria-label="Admin navigation">
        {/* Logo row */}
        <div className={styles.logoRow}>
          <Logo size="sm" />
          <span className={styles.adminBadge}>ADMIN</span>
        </div>

        {/* Nav */}
        <NavList pathname={pathname} />

        {/* Footer */}
        <SidebarFooter displayEmail={displayEmail} userEmail={userEmail} />
      </aside>

      {/* ─────────────────────────────────────────────
          MOBILE: fixed top header (hidden on desktop)
          ───────────────────────────────────────────── */}
      <header className={styles.mobileHeader} role="banner">
        <Logo size="sm" />

        <span className={styles.mobileSectionTitle} aria-live="polite">
          {sectionLabel}
        </span>

        <button
          className={styles.hamburger}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="admin-nav-drawer"
        >
          <MenuIcon />
        </button>
      </header>

      {/* ─────────────────────────────────────────────
          MOBILE: slide-in drawer (hidden on desktop)
          ───────────────────────────────────────────── */}
      <div
        id="admin-nav-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className={styles.drawerHeader}>
          <Logo size="sm" />
          <button
            className={styles.closeBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav inside drawer */}
        <NavList pathname={pathname} onNavigate={() => setDrawerOpen(false)} />

        {/* Footer inside drawer */}
        <SidebarFooter displayEmail={displayEmail} userEmail={userEmail} />
      </div>

      {/* ─────────────────────────────────────────────
          MOBILE: backdrop overlay
          ───────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
