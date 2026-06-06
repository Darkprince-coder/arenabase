import TeamLogo from '@/components/ui/TeamLogo';
import { formatMatchDate, getOutcome } from '@/lib/utils';
import styles from './TournamentResults.module.css';

function ResultRow({ result }) {
  const { home_score, away_score, notes, published_at, fixture } = result;
  if (!fixture) return null;
  const { home_team, away_team } = fixture;
  const { homeWon, awayWon } = getOutcome(home_score, away_score);
  return (
    <article className={styles.row} aria-label={`${home_team?.name ?? '?'} ${home_score}–${away_score} ${away_team?.name ?? '?'}`}>
      <div className={styles.accentBar} aria-hidden="true" />
      <div className={styles.metaCell}>
        <span className={styles.ftTag} aria-label="Full time">FT</span>
        <time className={styles.dateSub} dateTime={published_at}>{formatMatchDate(fixture.kickoff_time)}</time>
      </div>
      <div className={styles.homeTeam}>
        <span className={`${styles.teamName} ${homeWon ? styles.winner : awayWon ? styles.loser : ''}`}>{home_team?.name ?? '—'}</span>
        <TeamLogo team={home_team} size={32} />
      </div>
      <div className={styles.scoreBlock} aria-hidden="true">
        <span className={`${styles.scoreNum} ${homeWon ? styles.scoreWin : awayWon ? styles.scoreLose : ''}`}>{home_score}</span>
        <span className={styles.scoreDash}>–</span>
        <span className={`${styles.scoreNum} ${awayWon ? styles.scoreWin : homeWon ? styles.scoreLose : ''}`}>{away_score}</span>
        {notes && <span className={styles.notes}>{notes}</span>}
      </div>
      <div className={styles.awayTeam}>
        <TeamLogo team={away_team} size={32} />
        <span className={`${styles.teamName} ${awayWon ? styles.winner : homeWon ? styles.loser : ''}`}>{away_team?.name ?? '—'}</span>
      </div>
    </article>
  );
}

function groupByRound(results) {
  return results.reduce((acc, r) => {
    const key = r.fixture?.round ?? 'Results';
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key).push(r);
    return acc;
  }, new Map());
}

function EmptyResults() {
  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={styles.emptyIcon} aria-hidden="true">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      <p className={styles.emptyMsg}>No results yet.</p>
      <p className={styles.emptyHint}>Results will appear here after matches are played and published.</p>
    </div>
  );
}

export default function TournamentResults({ results = [] }) {
  if (results.length === 0) return <EmptyResults />;
  const groups = groupByRound(results);
  return (
    <div className={styles.list}>
      {[...groups.entries()].map(([round, roundResults]) => (
        <section key={round} className={styles.roundGroup} aria-label={round}>
          <h3 className={styles.roundLabel}>
            {round}
            <span className={styles.roundCount}>{roundResults.length} result{roundResults.length !== 1 ? 's' : ''}</span>
          </h3>
          <div className={styles.rows} role="list">
            {roundResults.map(r => <div key={r.id} role="listitem"><ResultRow result={r} /></div>)}
          </div>
        </section>
      ))}
    </div>
  );
}
