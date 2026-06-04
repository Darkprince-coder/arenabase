import Link from 'next/link';
import styles from './Footer.module.css';

const QUICK_LINKS = [
  { href: '/',              label: 'Home' },
  { href: '/fixtures',      label: 'Fixtures' },
  { href: '/results',       label: 'Results' },
  { href: '/tournaments',   label: 'Tournaments' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/about',         label: 'About' },
];

const SOCIAL_LINKS = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    href: 'https://x.com',
    label: 'X (Twitter)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
      </svg>
    ),
  },
  {
    href: 'https://tiktok.com',
    label: 'TikTok',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`${styles.inner} container`}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="ARENABASE homepage">
            ARENA<span className={styles.logoAccent}>BASE</span>
          </Link>
          <p className={styles.tagline}>All local sports. One platform.</p>
        </div>

        {/* Quick Links */}
        <nav className={styles.linksBlock} aria-label="Footer navigation">
          <h2 className={styles.blockHeading}>Quick Links</h2>
          <ul className={styles.linkGrid} role="list">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.footerLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div className={styles.socialBlock}>
          <h2 className={styles.blockHeading}>Follow Us</h2>
          <div className={styles.socialRow} role="list">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={label}
                role="listitem"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`${styles.bottomBar} container`}>
        <p className={styles.copyright}>
          © {year} ARENABASE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
