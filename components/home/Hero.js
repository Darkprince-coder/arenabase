import Link from 'next/link';
import TeamLogo from '@/components/ui/TeamLogo';
import { formatMatchDate, formatKickoffTime } from '@/lib/utils';
import styles from './Hero.module.css';

/* ── Icons ────────────────────────────────────────────── */
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
      <path d="M12 17v4"/><path d="M8 21h8"/>
      <path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

/* ── Featured Match card (hero right panel) ──────────── */
function FeaturedMatchCard({ fixture }) {
  const { home_team, away_team, venue, tournament, kickoff_time } = fixture;

  return (
    <article className={styles.featuredCard}>
      {/* Accent top border */}
      <div className={styles.featuredAccent} aria-hidden="true" />

      <header className={styles.featuredHeader}>
        <span className={styles.nextBadge}>
          <span className={styles.nextDot} aria-hidden="true" />
          NEXT MATCH
        </span>
        {tournament?.name && (
          <span className={styles.tournamentBadge}>{tournament.name}</span>
        )}
      </header>

      {/* Teams */}
      <div className={styles.featuredTeams}>
        <div className={styles.featuredTeam}>
          <TeamLogo team={home_team} size={56} />
          <span className={styles.featuredTeamName}>{home_team?.name}</span>
        </div>
        <div className={styles.featuredVs}>VS</div>
        <div className={`${styles.featuredTeam} ${styles.featuredTeamRight}`}>
          <TeamLogo team={away_team} size={56} />
          <span className={styles.featuredTeamName}>{away_team?.name}</span>
        </div>
      </div>

      {/* Match info */}
      <footer className={styles.featuredInfo}>
        <span className={styles.featuredDate}>
          {formatMatchDate(kickoff_time)}
        </span>
        <span className={styles.featuredTime}>
          {formatKickoffTime(kickoff_time)}
        </span>
        {venue?.name && (
          <span className={styles.featuredVenue}>
            <LocationIcon />{venue.name}
          </span>
        )}
      </footer>
    </article>
  );
}

/* ── Hero ─────────────────────────────────────────────── */
export default function Hero({ stats, nextFixture }) {
  const { fixturesCount = 0, tournamentsCount = 0, teamsCount = 0 } = stats;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* ── Content row ─────────────────────────────── */}
      <div className={`${styles.heroInner} container`}>

        {/* Left: text content */}
        <div className={styles.content}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowDot} />
            Kajiado · Kenya
          </p>

          <h1 id="hero-heading" className={styles.headline}>
            <span className={styles.lineWhite}>LOCAL SPORTS.</span>
            <span className={styles.lineGreen}>ONE PLATFORM.</span>
          </h1>

          <p className={styles.subtext}>
            Fixtures, results, tournaments and announcements from your local
            sports community. Never miss a match again.
          </p>

          <div className={styles.ctas}>
            <Link href="/fixtures" className={styles.ctaPrimary}>
              <CalendarIcon />
              View Fixtures
            </Link>
            <Link href="/tournaments" className={styles.ctaOutline}>
              <TrophyIcon />
              Explore Tournaments
            </Link>
          </div>
        </div>

        {/* Right: featured match card — hidden on mobile */}
        {nextFixture && (
          <div className={styles.visual}>
            <FeaturedMatchCard fixture={nextFixture} />
          </div>
        )}
      </div>

      {/* ── Stats strip ─────────────────────────────── */}
      <div className={`${styles.statsStrip} container`} aria-label="Platform statistics">
        <div className={styles.statItem}>
          <span className={styles.statValue}>{fixturesCount}+</span>
          <span className={styles.statLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Fixtures Published
          </span>
        </div>

        <div className={styles.statDivider} aria-hidden="true" />

        <div className={styles.statItem}>
          <span className={styles.statValue}>{tournamentsCount}</span>
          <span className={styles.statLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
              <path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
            </svg>
            Active Tournaments
          </span>
        </div>

        <div className={styles.statDivider} aria-hidden="true" />

        <div className={styles.statItem}>
          <span className={styles.statValue}>{teamsCount}+</span>
          <span className={styles.statLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Teams &amp; Growing
          </span>
        </div>
      </div>
    </section>
  );
}
