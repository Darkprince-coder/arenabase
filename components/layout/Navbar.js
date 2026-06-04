'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/',              label: 'Home' },
  { href: '/fixtures',      label: 'Fixtures' },
  { href: '/results',       label: 'Results' },
  { href: '/tournaments',   label: 'Tournaments' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/about',         label: 'About' },
];

export default function Navbar() {
  const pathname   = usePathname();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  /* ── Scroll shadow ──────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close on route change ──────────────────────── */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* ── Lock body scroll when menu open ───────────── */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* ── Trap focus in mobile menu ──────────────────── */
  useEffect(() => {
    if (open && menuRef.current) {
      const focusable = menuRef.current.querySelectorAll('a, button');
      if (focusable.length) focusable[0].focus();
    }
  }, [open]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <nav
          className={`${styles.nav} container`}
          aria-label="Main navigation"
        >
          {/* ── Logo ──────────────────────────────── */}
          <Link href="/" className={styles.logo} aria-label="ARENABASE — go to homepage">
            ARENA<span className={styles.logoAccent}>BASE</span>
          </Link>

          {/* ── Desktop Links ─────────────────────── */}
          <ul className={styles.desktopLinks} role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ''}`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                  {isActive(href) && <span className={styles.activeBar} aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop Actions ───────────────────── */}
          <div className={styles.actions}>
            <Link href="/admin" className={styles.adminBtn}>
              Admin Login
            </Link>
          </div>

          {/* ── Hamburger ─────────────────────────── */}
          <button
            className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={styles.bar} aria-hidden="true" />
            <span className={styles.bar} aria-hidden="true" />
            <span className={styles.bar} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* ── Mobile Drawer ───────────────────────────── */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-label="Navigation menu"
      >
        <ul className={styles.drawerLinks} role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.drawerLink} ${isActive(href) ? styles.drawerLinkActive : ''}`}
                aria-current={isActive(href) ? 'page' : undefined}
                tabIndex={open ? 0 : -1}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/admin"
          className={styles.drawerAdminBtn}
          tabIndex={open ? 0 : -1}
        >
          Admin Login
        </Link>
      </div>

      {/* ── Backdrop ────────────────────────────────── */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
