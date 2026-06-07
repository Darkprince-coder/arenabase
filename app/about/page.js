import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import FadeIn from '@/components/ui/FadeIn';
import styles from './page.module.css';

export const metadata = {
  title: 'About',
  description:
    'Learn about ARENABASE — the platform bringing local football fixtures, results and tournaments in Kajiado onto one fast, reliable website.',
  openGraph: {
    title: 'About | ARENABASE',
    description: "ARENABASE is Kajiado's home for local football. Fixtures, results, tournaments and announcements — all in one place.",
  },
};

/* ── Contact details ────────────────────────────────── */
/*
  Phone: 0717834780  (update if the digit below is wrong)
  International: +254717834780
*/
const PHONE_DISPLAY    = '0717 813 478';
const PHONE_TEL        = 'tel:+254717813478';
const PHONE_WHATSAPP   = 'https://wa.me/254717813478';

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="about-heading">
        <div className={`${styles.heroInner} container`}>
          <FadeIn variant="up" delay={0}>
            <div className={styles.logoWrap} aria-hidden="true">
              <Logo size="xl" />
            </div>
          </FadeIn>

          <FadeIn variant="up" delay={80}>
            <h1 id="about-heading" className={styles.heroTitle}>
              Local Sports.<br />
              <span className={styles.accent}>One Platform.</span>
            </h1>
          </FadeIn>

          <FadeIn variant="up" delay={160}>
            <p className={styles.heroSub}>
              ARENABASE is the digital home for grassroots football in Kajiado, Kenya —
              bringing fixtures, results, tournaments and announcements out of WhatsApp
              groups and Facebook pages, onto a fast, reliable platform anyone can visit.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────── */}
      <section className={`${styles.section} container`} aria-labelledby="mission-heading">
        <FadeIn variant="left">
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
        </FadeIn>
      </section>

      {/* ── Stats strip ───────────────────────────────── */}
      <div className={styles.statsStrip}>
        <div className={`${styles.statsInner} container`}>
          {[
            { value: 'Kajiado', label: 'County, Kenya' },
            { value: '2025',    label: 'Founded' },
            { value: 'Free',    label: 'Always free for fans' },
          ].map((stat, i) => (
            <FadeIn key={stat.label} variant="up" delay={i * 80} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── What we cover ─────────────────────────────── */}
      <section className={`${styles.section} container`} aria-labelledby="cover-heading">
        <div className={styles.sectionInner}>
          <FadeIn variant="left">
            <div className={styles.sectionLabel} aria-hidden="true">What We Cover</div>
            <h2 id="cover-heading" className={styles.sectionTitle}>Everything on one page</h2>
          </FadeIn>

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
            ].map((f, i) => (
              <FadeIn key={f.title} variant="up" delay={i * 70}>
                <Link href={f.href} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                  <span className={styles.featureLink} aria-hidden="true">View {f.title} →</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="contact-heading">
        <FadeIn variant="up">
          <div className={`${styles.sectionInner} container`}>
            <div className={styles.sectionLabel} aria-hidden="true">Tournament Organisers</div>
            <h2 id="contact-heading" className={styles.sectionTitle}>
              Want your tournament on ARENABASE?
            </h2>
            <p className={styles.sectionText}>
              If you organise a local football competition in Kajiado and want your
              fixtures, results and announcements published here, get in touch. We publish
              for free — this platform exists to serve the community.
            </p>
            <p className={styles.sectionText}>
              Reach us directly via WhatsApp or call. We typically respond within a few hours.
            </p>

            <div className={styles.contactRow}>
              {/* WhatsApp */}
              <a
                href={PHONE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactBtn} ${styles.contactBtnWhatsApp}`}
                aria-label={`Message us on WhatsApp at ${PHONE_DISPLAY}`}
              >
                {/* WhatsApp icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>
                  WhatsApp Us
                  <small>{PHONE_DISPLAY}</small>
                </span>
              </a>

              {/* Call */}
              <a
                href={PHONE_TEL}
                className={`${styles.contactBtn} ${styles.contactBtnCall}`}
                aria-label={`Call us at ${PHONE_DISPLAY}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17z"/>
                </svg>
                <span>
                  Call Us
                  <small>{PHONE_DISPLAY}</small>
                </span>
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
