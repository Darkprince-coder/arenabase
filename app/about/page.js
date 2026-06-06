import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import styles from './page.module.css';

export const metadata = {
  title: 'About',
  description:
    'Learn about ARENABASE — the platform bringing local football fixtures, results and tournaments in Kajiado onto one fast, reliable website.',
  openGraph: {
    title: 'About | ARENABASE',
    description: 'ARENABASE is Kajiado\'s home for local football. Fixtures, results, tournaments and announcements — all in one place.',
  },
};

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="about-heading">
        <div className={`${styles.heroInner} container`}>
          <div className={styles.logoWrap} aria-hidden="true">
            <Logo size="xl" />
          </div>
          <h1 id="about-heading" className={styles.heroTitle}>
            Local Sports.<br />
            <span className={styles.accent}>One Platform.</span>
          </h1>
          <p className={styles.heroSub}>
            ARENABASE is the digital home for grassroots football in Kajiado, Kenya —
            bringing fixtures, results, tournaments and announcements out of WhatsApp
            groups and Facebook pages, onto a fast, reliable platform anyone can visit.
          </p>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────── */}
      <section className={`${styles.section} container`} aria-labelledby="mission-heading">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel} aria-hidden="true">Our Mission</div>
          <h2 id="mission-heading" className={styles.sectionTitle}>
            The first stop for grassroots football
          </h2>
          <p className={styles.sectionText}>
            Right now, local sports information in Kajiado is scattered. Fixture dates
            get buried in group chats. Venue changes are announced too late. Results
            are shared inconsistently. Fans miss matches they care about.
          </p>
          <p className={styles.sectionText}>
            ARENABASE fixes that. Every fixture, every result, every tournament
            announcement — published in one place, available instantly to anyone with
            a phone. Our goal is habit formation: <em>&ldquo;Let me check Arenabase.&rdquo;</em>
          </p>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────── */}
      <div className={styles.statsStrip}>
        <div className={`${styles.statsInner} container`}>
          {[
            { value: 'Kajiado', label: 'County, Kenya' },
            { value: '2025',    label: 'Founded' },
            { value: 'Free',    label: 'Always free for fans' },
          ].map(stat => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── What we cover ─────────────────────────────── */}
      <section className={`${styles.section} container`} aria-labelledby="cover-heading">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel} aria-hidden="true">What We Cover</div>
          <h2 id="cover-heading" className={styles.sectionTitle}>Everything on one page</h2>

          <div className={styles.featureGrid}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                ),
                title: 'Fixtures',
                desc: 'Every upcoming match — kick-off times, venues and tournament context. Filter by date or competition.',
                href: '/fixtures',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                ),
                title: 'Results',
                desc: 'Full-time scores published as soon as matches end. Winner highlighting, draw recognition, penalty notes.',
                href: '/results',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
                    <path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
                  </svg>
                ),
                title: 'Tournaments',
                desc: 'Ongoing and upcoming competitions. Each tournament has its own fixtures, results and team list.',
                href: '/tournaments',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M3 11v2a1 1 0 0 0 1 1h1l2 4h2l-1-4h7l3 4h1v-4a2 2 0 0 0 0-4V6a2 2 0 0 0 0-4H8L5 6H4a1 1 0 0 0-1 1v2"/>
                  </svg>
                ),
                title: 'Announcements',
                desc: 'Venue changes, registration deadlines, referee notices and general updates — all in one feed.',
                href: '/announcements',
              },
            ].map(f => (
              <Link key={f.title} href={f.href} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <span className={styles.featureLink} aria-hidden="true">View {f.title} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Submit info ───────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="submit-heading">
        <div className={`${styles.sectionInner} container`}>
          <div className={styles.sectionLabel} aria-hidden="true">Tournament Organisers</div>
          <h2 id="submit-heading" className={styles.sectionTitle}>
            Want your tournament on ARENABASE?
          </h2>
          <p className={styles.sectionText}>
            If you organise a local football competition in Kajiado and want your
            fixtures, results and announcements published here, get in touch. We publish
            for free — this platform exists to serve the community.
          </p>
          <p className={styles.sectionText}>
            Reach us on any of our social media pages below, or send a message directly.
            We typically respond within 24 hours.
          </p>

          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label={`Follow ARENABASE on ${label}`}
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}