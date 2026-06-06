import TeamLogo from '@/components/ui/TeamLogo';
import { formatMatchDate, formatKickoffTime } from '@/lib/utils';
import styles from './TournamentFixtures.module.css';

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function StatusCell({ fixture }) {
  const { status, kickoff_time } = fixture;
  if (status === 'live') return (
    <div className={styles.statusCell}>
      <span className={styles.liveTag}><span className={styles.liveDot} aria-hidden="true" />LIVE</span>
    </div>
  );
  if (status === 'completed') return (
    <div className={styles.statusCell}>
      <span className={styles.ftTag}>FT</span>
      <time className={styles.dateSub} dateTime={kickoff_time}>{formatMatchDate(kickoff_time)}</time>
    </div>
  );
  if (status === 'postponed') return <div className={styles.statusCell}><span className={styles.postponedTag}>PPD</span></div>;
  if (status === 'cancelled') return <div className={styles.statusCell}><span className={styles.cancelledTag}>CANC</span></div>;
  return (
    <div className={styles.statusCell}>
      <time className={styles.time} dateTime={kickoff_time}>{formatKickoffTime(kickoff_time)}</time>
      <time className={styles.dateSub} dateTime={kickoff_time}>{formatMatchDate(kickoff_time)}</time>
    </div>
  );
}

function FixtureRow({ fixture }) {
  const { home_team, away_team, venue, status } = fixture;
  const isCompleted = status === 'completed';
  return (
    <article className={`${styles.row} ${isCompleted ? styles.rowCompleted : ''}`} aria-label={`${home_team?.name ?? '?'} vs ${away_team?.name ?? '?'}`}>
      <div className={styles.accentBar} aria-hidden="true" />
      <StatusCell fixture={fixture} />
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
        {venue?.name && <span className={styles.venue}><PinIcon />{venue.name}</span>}
        {isCompleted && <span className={styles.completedHint}>See Results tab →</span>}
      </div>
    </article>
  );
}

function groupByRound(fixtures) {
  return fixtures.reduce((acc, f) => {
    const key = f.round ?? 'Fixtures';
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key).push(f);
    return acc;
  }, new Map());
}

function EmptyFixtures() {
  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={styles.emptyIcon} aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 15h.01M12 15h.01M16 15h.01"/>
      </svg>
      <p className={styles.emptyMsg}>No fixtures scheduled yet.</p>
      <p className={styles.emptyHint}>Fixtures will appear here once they are published by the admin.</p>
    </div>
  );
}

export default function TournamentFixtures({ fixtures = [] }) {
  if (fixtures.length === 0) return <EmptyFixtures />;
  const groups = groupByRound(fixtures);
  return (
    <div className={styles.list}>
      {[...groups.entries()].map(([round, roundFixtures]) => (
        <section key={round} className={styles.roundGroup} aria-label={round}>
          <h3 className={styles.roundLabel}>
            {round}
            <span className={styles.roundCount}>{roundFixtures.length} match{roundFixtures.length !== 1 ? 'es' : ''}</span>
          </h3>
          <div className={styles.rows} role="list">
            {roundFixtures.map(f => <div key={f.id} role="listitem"><FixtureRow fixture={f} /></div>)}
          </div>
        </section>
      ))}
    </div>
  );
}
