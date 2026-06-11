import TeamLogo from '@/components/ui/TeamLogo';
import { formatMatchDate, formatKickoffTime } from '@/lib/utils';
import styles from './FixturesList.module.css';

/* ── Icons ──────────────────────────────────────────── */
function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function CancelCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

/* ── Postponed fixture card ─────────────────────────── */
function PostponedFixtureCard({ fixture }) {
  const { kickoff_time, home_team, away_team, venue, tournament } = fixture;

  return (
    <article
      className={`${styles.statusCard} ${styles.postponedCard}`}
      aria-label={`Postponed: ${home_team?.name ?? '?'} vs ${away_team?.name ?? '?'}`}
    >
      {/* ── Banner ────────────────────────────────────── */}
      <div className={styles.postponedBanner}>
        <div className={styles.bannerStripes} aria-hidden="true" />
        <div className={styles.bannerLabel}>
          <WarningIcon />
          MATCH POSTPONED
        </div>
      </div>

      {/* ── Stamp watermark ───────────────────────────── */}
      <div className={styles.postponedWatermark} aria-hidden="true">POSTPONED</div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className={styles.statusCardBody}>
        {/* Badge + kickoff */}
        <div className={styles.statusMeta}>
          <span className={styles.ppdBadge}>PPD</span>
          <div className={styles.statusKickoff}>
            <time className={`${styles.statusTime} ${styles.ppdTime}`} dateTime={kickoff_time}>
              {formatKickoffTime(kickoff_time)}
            </time>
            <span className={styles.statusDate}>{formatMatchDate(kickoff_time)}</span>
          </div>
        </div>

        {/* Teams */}
        <div className={styles.statusTeamsRow}>
          <div className={styles.statusHomeTeam}>
            <TeamLogo team={home_team} size={32} />
            <span className={styles.statusTeamName}>{home_team?.name ?? '—'}</span>
          </div>
          <div className={styles.statusVs}>VS</div>
          <div className={styles.statusAwayTeam}>
            <span className={styles.statusTeamName}>{away_team?.name ?? '—'}</span>
            <TeamLogo team={away_team} size={32} />
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div className={styles.statusCardFooter}>
        <span className={`${styles.statusInfo} ${styles.postponedInfo}`}>
          <InfoCircleIcon />
          New date will be announced soon. Stay tuned.
        </span>
        {venue?.name && (
          <span className={styles.statusVenueLabel}>
            <PinIcon />
            {venue.name}
          </span>
        )}
      </div>
    </article>
  );
}

/* ── Cancelled fixture card ─────────────────────────── */
function CancelledFixtureCard({ fixture }) {
  const { kickoff_time, home_team, away_team, venue } = fixture;

  return (
    <article
      className={`${styles.statusCard} ${styles.cancelledCard}`}
      aria-label={`Cancelled: ${home_team?.name ?? '?'} vs ${away_team?.name ?? '?'}`}
    >
      {/* ── Banner ────────────────────────────────────── */}
      <div className={styles.cancelledBanner}>
        <div className={styles.cancelledBannerStripes} aria-hidden="true" />
        <div className={styles.bannerLabel}>
          <CancelCircleIcon />
          MATCH CANCELLED
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className={styles.statusCardBody}>
        {/* Kickoff */}
        <div className={styles.statusMeta}>
          <time className={`${styles.statusTime} ${styles.cancelledTime}`} dateTime={kickoff_time}>
            {formatKickoffTime(kickoff_time)}
          </time>
          <span className={styles.statusDate}>{formatMatchDate(kickoff_time)}</span>
        </div>

        {/* Teams */}
        <div className={styles.statusTeamsRow}>
          <div className={styles.statusHomeTeam}>
            <TeamLogo team={home_team} size={32} />
            <span className={`${styles.statusTeamName} ${styles.cancelledTeamName}`}>
              {home_team?.name ?? '—'}
            </span>
          </div>
          <div className={`${styles.statusVs} ${styles.cancelledVs}`}>VS</div>
          <div className={styles.statusAwayTeam}>
            <span className={`${styles.statusTeamName} ${styles.cancelledTeamName}`}>
              {away_team?.name ?? '—'}
            </span>
            <TeamLogo team={away_team} size={32} />
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div className={`${styles.statusCardFooter} ${styles.cancelledFooter}`}>
        <span className={`${styles.statusInfo} ${styles.cancelledInfo}`}>
          <InfoCircleIcon />
          This match has been cancelled.
        </span>
        {venue?.name && (
          <span className={styles.statusVenueLabel}>
            <PinIcon />
            {venue.name}
          </span>
        )}
      </div>
    </article>
  );
}

/* ── Single fixture row (scheduled / live) ──────────── */
function FixtureRow({ fixture }) {
  const { status } = fixture;

  if (status === 'postponed') return <PostponedFixtureCard fixture={fixture} />;
  if (status === 'cancelled') return <CancelledFixtureCard fixture={fixture} />;

  const { kickoff_time, home_team, away_team, venue, tournament } = fixture;

  return (
    <article className={styles.row} aria-label={`${home_team?.name ?? '?'} vs ${away_team?.name ?? '?'}`}>
      <div className={styles.accentBar} aria-hidden="true" />

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

      <div className={styles.homeTeam}>
        <span className={styles.teamName}>{home_team?.name ?? '—'}</span>
        <TeamLogo team={home_team} size={32} />
      </div>

      <div className={styles.vs} aria-hidden="true">VS</div>

      <div className={styles.awayTeam}>
        <TeamLogo team={away_team} size={32} />
        <span className={styles.teamName}>{away_team?.name ?? '—'}</span>
      </div>

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
