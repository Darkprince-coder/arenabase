import Link from 'next/link';
import TeamLogo from '@/components/ui/TeamLogo';
import SectionHeader from '@/components/ui/SectionHeader';
import { formatShortDate, getOutcome } from '@/lib/utils';
import styles from './LatestResults.module.css';

function ResultsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}

function ResultRow({ result }) {
  const { home_score, away_score, published_at, fixture } = result;
  if (!fixture) return null;

  const { home_team, away_team, tournament } = fixture;
  const { homeWon, awayWon } = getOutcome(home_score, away_score);

  return (
    <li className={styles.row}>
      {/* FT badge */}
      <span className={styles.ftBadge} aria-label="Full time">FT</span>

      {/* Home team */}
      <div className={styles.teamBlock}>
        <TeamLogo team={home_team} size={28} />
        <span className={`${styles.teamName} ${homeWon ? styles.winner : ''}`}>
          {home_team?.name ?? '—'}
        </span>
      </div>

      {/* Score */}
      <div className={styles.score} aria-label={`${home_score} to ${away_score}`}>
        <span className={homeWon ? styles.scoreWin : ''}>{home_score}</span>
        <span className={styles.scoreDash}>–</span>
        <span className={awayWon ? styles.scoreWin : ''}>{away_score}</span>
      </div>

      {/* Away team */}
      <div className={`${styles.teamBlock} ${styles.teamBlockRight}`}>
        <span className={`${styles.teamName} ${awayWon ? styles.winner : ''}`}>
          {away_team?.name ?? '—'}
        </span>
        <TeamLogo team={away_team} size={28} />
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <span className={styles.date}>{formatShortDate(published_at)}</span>
        {tournament?.name && (
          <span className={styles.tournament}>{tournament.name}</span>
        )}
      </div>
    </li>
  );
}

export default function LatestResults({ results = [] }) {
  return (
    <section className={styles.section} aria-labelledby="results-heading">
      <SectionHeader
        title="Latest Results"
        icon={<ResultsIcon />}
        viewAllHref="/results"
        viewAllLabel="View all"
      />

      {results.length === 0 ? (
        <div className={styles.empty}>No results published yet.</div>
      ) : (
        <ul className={styles.list} role="list">
          {results.map(r => <ResultRow key={r.id} result={r} />)}
        </ul>
      )}

      <Link href="/results" className={styles.viewAllBtn}>
        View all results
      </Link>
    </section>
  );
}
