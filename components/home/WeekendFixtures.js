import Link from 'next/link';
import TeamLogo from '@/components/ui/TeamLogo';
import SectionHeader from '@/components/ui/SectionHeader';
import FadeIn from '@/components/ui/FadeIn';
import { formatMatchDate, formatKickoffTime, getFixturesSectionLabel } from '@/lib/utils';
import styles from './WeekendFixtures.module.css';

/* ── Icons ─────────────────────────────────────────── */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

/* ── Single match card ──────────────────────────────── */
function MatchCard({ fixture }) {
  const { home_team, away_team, venue, tournament, kickoff_time, status } = fixture;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.tournamentTag}>
          {tournament?.name ?? 'Friendly'}
        </span>
        <span className={`${styles.timeBadge} ${status === 'live' ? styles.live : ''}`}>
          {status === 'live' ? (
            <>
              <span className={styles.liveDot} aria-hidden="true" />
              LIVE
            </>
          ) : (
            formatKickoffTime(kickoff_time)
          )}
        </span>
      </div>

      <div className={styles.match}>
        <div className={styles.team}>
          <TeamLogo team={home_team} size={52} />
          <span className={styles.teamName}>{home_team?.name ?? '—'}</span>
        </div>
        <div className={styles.vsBadge} aria-hidden="true">VS</div>
        <div className={`${styles.team} ${styles.teamRight}`}>
          <TeamLogo team={away_team} size={52} />
          <span className={styles.teamName}>{away_team?.name ?? '—'}</span>
        </div>
      </div>

      {venue?.name && (
        <footer className={styles.cardFooter}>
          <LocationIcon />
          <span>{venue.name}</span>
        </footer>
      )}
    </article>
  );
}

/* ── Group fixtures by calendar date ─────────────────── */
function groupByDate(fixtures) {
  return fixtures.reduce((acc, f) => {
    const key = new Date(f.kickoff_time).toDateString();
    (acc[key] ??= []).push(f);
    return acc;
  }, {});
}

/* ── Section ────────────────────────────────────────── */
export default function WeekendFixtures({ fixtures = [] }) {
  const label  = getFixturesSectionLabel(fixtures);
  const groups = groupByDate(fixtures);

  return (
    <section className={styles.section} aria-labelledby="fixtures-heading">
      <div className="container">
        <FadeIn variant="left">
          <SectionHeader
            title={label}
            icon={<CalendarIcon />}
            viewAllHref="/fixtures"
            viewAllLabel="View all fixtures"
          />
        </FadeIn>

        {fixtures.length === 0 ? (
          <div className={styles.empty}>
            <p>No upcoming fixtures scheduled yet.</p>
            <p className={styles.emptyHint}>
              Check back soon — fixtures will appear here when published.
            </p>
          </div>
        ) : (
          Object.entries(groups).map(([dateKey, dayFixtures]) => (
            <div key={dateKey} className={styles.dateGroup}>
              <h3 className={styles.dateLabel}>
                {formatMatchDate(dayFixtures[0].kickoff_time)}
              </h3>
              <div className={styles.cardsTrack} role="list">
                {dayFixtures.map((f, i) => (
                  <div key={f.id} role="listitem" className={styles.cardWrap}>
                    <FadeIn variant="up" delay={i * 80}>
                      <MatchCard fixture={f} />
                    </FadeIn>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
