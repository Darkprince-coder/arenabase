import TeamLogo from '@/components/ui/TeamLogo';
import { formatMatchDate, formatKickoffTime } from '@/lib/utils';
import styles from './FixturesList.module.css';

/* ── Location pin icon ──────────────────────────────── */
function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

/* ── Single fixture row ─────────────────────────────── */
function FixtureRow({ fixture }) {
  const { kickoff_time, status, home_team, away_team, venue, tournament } = fixture;

  return (
    <article className={styles.row} aria-label={`${home_team?.name ?? '?'} vs ${away_team?.name ?? '?'}`}>
      {/* Accent hover bar */}
      <div className={styles.accentBar} aria-hidden="true" />

      {/* Time */}
      <div className={styles.timeCol}>
        {status === 'live' ? (
          <span className={styles.liveTag}>
            <span className={styles.liveDot} aria-hidden="true" />
            LIVE
          </span>
        ) : (
          <time
            className={styles.time}
            dateTime={kickoff_time}
            aria-label={`Kick-off at ${formatKickoffTime(kickoff_time)}`}
          >
            {formatKickoffTime(kickoff_time)}
          </time>
        )}
      </div>

      {/* Home team */}
      <div className={styles.homeTeam}>
        <span className={styles.teamName}>{home_team?.name ?? '—'}</span>
        <TeamLogo team={home_team} size={32} />
      </div>

      {/* VS separator */}
      <div className={styles.vs} aria-hidden="true">VS</div>

      {/* Away team */}
      <div className={styles.awayTeam}>
        <TeamLogo team={away_team} size={32} />
        <span className={styles.teamName}>{away_team?.name ?? '—'}</span>
      </div>

      {/* Tournament + Venue meta */}
      <div className={styles.meta}>
        {tournament?.name && (
          <span className={styles.tournament}>{tournament.name}</span>
        )}
        {venue?.name && (
          <span className={styles.venue}>
            <PinIcon />{venue.name}
          </span>
        )}
      </div>
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

/* ── Empty state ────────────────────────────────────── */
function EmptyFixtures({ dateFilter }) {
  const MSG = {
    'today':        'No fixtures scheduled for today.',
    'this-week':    'No fixtures scheduled this week.',
    'this-weekend': 'No fixtures this weekend.',
    'this-month':   'No fixtures scheduled this month.',
  };
  const message = MSG[dateFilter] ?? 'No upcoming fixtures match your filters.';

  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        className={styles.emptyIcon} aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 15h.01M12 15h.01M16 15h.01"/>
      </svg>
      <p className={styles.emptyMsg}>{message}</p>
      <p className={styles.emptyHint}>
        Fixtures will appear here once they are published by the admin.
      </p>
    </div>
  );
}

/* ── FixturesList ────────────────────────────────────── */
export default function FixturesList({ fixtures = [], dateFilter = 'all' }) {
  if (fixtures.length === 0) {
    return <EmptyFixtures dateFilter={dateFilter} />;
  }

  const groups = groupByDate(fixtures);

  return (
    <div className={styles.list}>
      {Object.entries(groups).map(([dateKey, dayFixtures]) => (
        <section key={dateKey} className={styles.dateGroup} aria-label={formatMatchDate(dayFixtures[0].kickoff_time)}>
          <h2 className={styles.dateLabel}>
            {formatMatchDate(dayFixtures[0].kickoff_time)}
            <span className={styles.dateCount}>{dayFixtures.length} match{dayFixtures.length !== 1 ? 'es' : ''}</span>
          </h2>

          <div className={styles.rows} role="list">
            {dayFixtures.map(f => (
              <div key={f.id} role="listitem">
                <FixtureRow fixture={f} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
