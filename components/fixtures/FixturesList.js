import TeamLogo from '@/components/ui/TeamLogo';
import { formatMatchDate, formatKickoffTime } from '@/lib/utils';
import styles from './FixturesList.module.css';

/* ── Icons ──────────────────────────────────────────── */
function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function CancelledIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  );
}

/* ── Single fixture row ─────────────────────────────── */
function FixtureRow({ fixture }) {
  const { kickoff_time, status, home_team, away_team, venue, tournament } = fixture;

  const cardClass = [styles.rowCard];
  if (status === 'postponed') cardClass.push(styles.postponed);
  if (status === 'cancelled') cardClass.push(styles.cancelled);

  return (
    <article className={cardClass.join(' ')} aria-label={`${home_team?.name ?? '?'} vs ${away_team?.name ?? '?'}`}>
      
      {/* 1. TOP STATUS BANNERS */}
      {status === 'postponed' && (
        <div className={styles.statusBanner} aria-hidden>
          <WarningIcon /> MATCH POSTPONED
        </div>
      )}
      {status === 'cancelled' && (
        <div className={styles.statusBanner} aria-hidden>
          <CancelledIcon /> MATCH CANCELLED
        </div>
      )}

      {/* 2. CORE MATCH CONTENT ROW */}
      <div className={styles.matchContent}>
        
        {/* Accent hover bar (Only active on standard matches) */}
        {!['postponed', 'cancelled'].includes(status) && (
          <div className={styles.accentBar} aria-hidden="true" />
        )}

        {/* Status watermark */}
        {status === 'postponed' && <div className={styles.statusWatermark} aria-hidden>POSTPONED</div>}
        {status === 'cancelled' && <div className={styles.statusWatermark} aria-hidden>CANCELLED</div>}

        {/* Time / Status Pill Column */}
        <div className={styles.timeCol}>
          {status === 'live' ? (
            <span className={styles.liveTag}>
              <span className={styles.liveDot} aria-hidden="true" /> LIVE
            </span>
          ) : status === 'postponed' ? (
            <div className={styles.statusPill}>PPD</div>
          ) : (
            <time className={styles.time} dateTime={kickoff_time}>
              {formatKickoffTime(kickoff_time)}
            </time>
          )}
        </div>

        {/* Home team */}
        <div className={styles.homeTeam}>
          <span className={styles.teamName}>{home_team?.name ?? '—'}</span>
          <TeamLogo team={home_team} size={36} />
        </div>

        {/* VS separator */}
        <div className={`${styles.vs} ${status ? styles[status + 'Vs'] : ''}`} aria-hidden="true">vs</div>

        {/* Away team */}
        <div className={styles.awayTeam}>
          <TeamLogo team={away_team} size={36} />
          <span className={styles.teamName}>{away_team?.name ?? '—'}</span>
        </div>

        {/* Tournament + Venue meta */}
        <div className={styles.meta}>
          {tournament?.name && <span className={styles.tournament}>{tournament.name}</span>}
          {venue?.name && (
            <span className={styles.venue}>
              <PinIcon />{venue.name}
            </span>
          )}
        </div>
      </div>

      {/* 3. BOTTOM FOOTER INFO TEXT */}
      {status === 'postponed' && (
        <div className={styles.statusInfo}>
          <div className={styles.infoText}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <span>New date will be announced soon. Stay tuned.</span>
          </div>
          {venue?.name && <span className={styles.footerVenue}><PinIcon />{venue.name}</span>}
        </div>
      )}
      
      {status === 'cancelled' && (
        <div className={styles.statusInfo}>
          <div className={styles.infoText}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            <span>This match has been cancelled.</span>
          </div>
          {venue?.name && <span className={styles.footerVenue}><PinIcon />{venue.name}</span>}
        </div>
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

/* ── Empty State Component ───────────────────────────── */
function EmptyFixtures({ dateFilter }) {
  const MSG = {
    'today':        'No fixtures scheduled for today.',
    'this-week':    'No fixtures scheduled this week.',
    'this-weekend': 'No fixtures this weekend.',
    'this-month':   'No fixtures scheduled this month.',
  };
  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon} aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
      <p className={styles.emptyMsg}>{MSG[dateFilter] ?? 'No upcoming fixtures match your filters.'}</p>
    </div>
  );
}

/* ── Main FixturesList Component ─────────────────────── */
export default function FixturesList({ fixtures = [], dateFilter = 'all' }) {
  if (fixtures.length === 0) return <EmptyFixtures dateFilter={dateFilter} />;
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