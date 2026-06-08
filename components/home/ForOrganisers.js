import FadeIn from '@/components/ui/FadeIn';
import styles from './ForOrganisers.module.css';

/* ── Contact details ───────────────────────────────── */
const PHONE_DISPLAY  = '0717 813 478';
const PHONE_TEL      = 'tel:+254717813478';
const PHONE_WHATSAPP = 'https://wa.me/254717813478';

/* ── Icons ──────────────────────────────────────────── */
function TrophyPageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
      <path d="M12 17v4"/><path d="M8 21h8"/>
      <path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
    </svg>
  );
}

function NoiseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 11v2a1 1 0 0 0 1 1h1l2 4h2l-1-4h7l3 4h1v-4a2 2 0 0 0 0-4V6a2 2 0 0 0 0-4H8L5 6H4a1 1 0 0 0-1 1v2"/>
    </svg>
  );
}

function ReachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function FreeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17z"/>
    </svg>
  );
}

/* ── Features ───────────────────────────────────────── */
const FEATURES = [
  {
    Icon: TrophyPageIcon,
    title: 'Dedicated tournament page',
    desc: 'Fixtures, results, standings and team list — all under one shareable URL your fans can bookmark.',
  },
  {
    Icon: NoiseIcon,
    title: 'Replace WhatsApp noise',
    desc: 'Post fixture updates and venue changes once. Every fan sees them instantly — no group chat chaos.',
  },
  {
    Icon: ReachIcon,
    title: 'Reach every local fan',
    desc: 'Fans already visiting ARENABASE find your tournament. Google finds it too — SEO built in from day one.',
  },
  {
    Icon: FreeIcon,
    title: 'Free to get started',
    desc: 'No fees, no contracts. Share your fixture list and we get it live. You focus on running the game.',
  },
];

/* ── Component ──────────────────────────────────────── */
export default function ForOrganisers() {
  return (
    <section className={styles.section} aria-labelledby="organisers-heading">

      {/* Glow divider at top — uses global .glowDivider utility */}
      <div className="glowDivider" aria-hidden="true" />

      <div className={`${styles.inner} container`}>

        {/* ── LEFT: heading, subtitle, CTA ─────────── */}
        <div className={styles.lead}>

          <FadeIn variant="left">
            <p className={styles.eyebrow} aria-hidden="true">
              For Tournament Organisers
            </p>
          </FadeIn>

          <FadeIn variant="up" delay={60}>
            <h2 id="organisers-heading" className={styles.title}>
              Your tournament.<br />
              <span className={styles.accent}>Live on ARENABASE.</span>
            </h2>
          </FadeIn>

          <FadeIn variant="up" delay={120}>
            <p className={styles.subtitle}>
              Get your fixtures, results and announcements in front of every local
              football fan in Kajiado — for free. We handle the setup, you run the tournament.
            </p>
          </FadeIn>

          <FadeIn variant="up" delay={180}>
            <div className={styles.ctaRow}>
              {/* WhatsApp */}
              <a
                href={PHONE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.ctaBtn} ${styles.ctaWhatsApp}`}
                aria-label={`Message us on WhatsApp at ${PHONE_DISPLAY}`}
              >
                <WhatsAppIcon />
                <span>
                  WhatsApp Us
                  <small>{PHONE_DISPLAY}</small>
                </span>
              </a>

              {/* Call */}
              <a
                href={PHONE_TEL}
                className={`${styles.ctaBtn} ${styles.ctaCall}`}
                aria-label={`Call us at ${PHONE_DISPLAY}`}
              >
                <PhoneIcon />
                <span>
                  Call Us
                  <small>{PHONE_DISPLAY}</small>
                </span>
              </a>
            </div>

            <p className={styles.footnote}>Free to get started. No contract.</p>
          </FadeIn>
        </div>

        {/* ── RIGHT: feature grid ───────────────────── */}
        <div className={styles.features} role="list">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <FadeIn
              key={title}
              variant="up"
              delay={i * 75}
              className={styles.featureCard}
              role="listitem"
            >
              <span className={styles.featureIcon}><Icon /></span>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </FadeIn>
          ))}
        </div>

      </div>

      {/* Glow divider at bottom */}
      <div className="glowDivider" aria-hidden="true" />

    </section>
  );
}
