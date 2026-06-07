import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: '404 — Offside',
  description: 'This page has been sent off.',
};

const NAV_CARDS = [
  {
    href: '/',
    label: 'Home',
    desc: 'Back to the main pitch',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/fixtures',
    label: 'Fixtures',
    desc: 'See upcoming matches',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    href: '/results',
    label: 'Results',
    desc: 'Latest full-time scores',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    href: '/tournaments',
    label: 'Tournaments',
    desc: 'Browse competitions',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
        <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
        <path d="M12 17v4"/><path d="M8 21h8"/>
        <path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
      </svg>
    ),
  },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      {/* Ambient radial glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>

        {/* ── Referee card + 404 ─────────────────── */}
        <div className={styles.cardStack} aria-hidden="true">
          {/* Shadow card */}
          <div className={`${styles.refCard} ${styles.refCardShadow}`} />
          {/* Main card */}
          <div className={styles.refCard}>
            <span className={styles.cardNumber}>404</span>
          </div>
        </div>

        {/* ── Headline ────────────────────────────── */}
        <h1 className={styles.title}>OFFSIDE.</h1>

        <p className={styles.subtitle}>
          The page you&apos;re looking for has gone offside.<br />
          Let&apos;s get you back in play.
        </p>

        {/* ── Navigation cards ────────────────────── */}
        <nav className={styles.navGrid} aria-label="Navigate back to key sections">
          {NAV_CARDS.map(card => (
            <Link key={card.href} href={card.href} className={styles.navCard}>
              <span className={styles.navIcon}>{card.icon}</span>
              <span className={styles.navLabel}>{card.label}</span>
              <span className={styles.navDesc}>{card.desc}</span>
            </Link>
          ))}
        </nav>

      </div>
    </div>
  );
}