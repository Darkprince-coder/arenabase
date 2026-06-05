import TeamLogo from '@/components/ui/TeamLogo';
import { formatShortDate, getOutcome } from '@/lib/utils';
import styles from './ResultsList.module.css';

/* ── Group results by calendar month ─────────────────── */
function groupByMonth(results) {
  const groups = {};
  results.forEach(r => {
    const d   = new Date(r.published_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) {
      groups[key] = {
        label:   d.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }).toUpperCase(),
        results: [],
      };
    }
    groups[key].results.push(r);
  });
  return groups;                   // naturally sorted desc from query order
}

/* ── Single result row ──────────────────────────────── */
function ResultRow({ result }) {
  const { home_score, away_score, published_at, notes, fixture } = result;
  if (!fixture) return null;       // guard against orphaned results

  const { home_team, away_team, tournament, round } = fixture;
  const { homeWon, awayWon, isDraw } = getOutcome(home_score, away_score);

  return (
    <article
      className={styles.row}
      aria-label={`${home_team?.name ?? '?'} ${home_score}–${away_score} ${away_team?.name ?? '?'}`}
    >
      <div className={styles.accentBar} aria-hidden="true" />

      {/* FT badge */}
      <div className={styles.ftCol}>
        <span className={styles.ftBadge} aria-label="Full time">FT</span>
      </div>

      {/* Home team — right-aligned */}
      <div className={styles.homeTeam}>
        <span className={`${styles.teamName} ${homeWon ? styles.teamWinner : awayWon ? styles.teamLoser : ''}`}>
          {home_team?.name ?? '—'}
        </span>
        <TeamLogo team={home_team} size={30} />
      </div>

      {/* Score */}
      <div className={styles.scoreBlock} aria-hidden="true">
        <span className={`${styles.scoreDigit} ${homeWon ? styles.scoreWin : isDraw ? styles.scoreDraw : styles.scoreLoss}`}>
          {home_score}
        </span>
        <span className={styles.scoreSep}>–</span>
        <span className={`${styles.scoreDigit} ${awayWon ? styles.scoreWin : isDraw ? styles.scoreDraw : styles.scoreLoss}`}>
          {away_score}
        </span>
      </div>

      {/* Away team — left-aligned */}
      <div className={styles.awayTeam}>
        <TeamLogo team={away_team} size={30} />
        <span className={`${styles.teamName} ${awayWon ? styles.teamWinner : homeWon ? styles.teamLoser : ''}`}>
          {away_team?.name ?? '—'}
        </span>
      </div>

      {/* Meta: tournament + round + date */}
      <div className={styles.meta}>
        {tournament?.name && (
          <span className={styles.tournament}>{tournament.name}</span>
        )}
        <span className={styles.date}>
          {round && <span className={styles.round}>{round} · </span>}
          {formatShortDate(published_at)}
        </span>
      </div>

      {/* Optional notes row (e.g. "Won on penalties") */}
      {notes && (
        <div className={styles.notesRow}>
          <span className={styles.notes}>{notes}</span>
        </div>
      )}
    </article>
  );
}

/* ── Empty state ────────────────────────────────────── */
function EmptyResults({ dateFilter }) {
  const MSG = {
    today:         'No results published today.',
    'this-week':   'No results this week.',
    'this-month':  'No results this month.',
  };
  const message = MSG[dateFilter] ?? 'No results published yet.';

  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        className={styles.emptyIcon} aria-hidden="true">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      <p className={styles.emptyMsg}>{message}</p>
      <p className={styles.emptyHint}>
        Results will appear here once published by the admin.
      </p>
    </div>
  );
}

/* ── ResultsList ─────────────────────────────────────── */
export default function ResultsList({ results = [], dateFilter = 'all' }) {
  if (results.length === 0) {
    return <EmptyResults dateFilter={dateFilter} />;
  }

  const groups = groupByMonth(results);

  return (
    <div className={styles.list}>
      {Object.entries(groups).map(([key, { label, results: groupResults }]) => (
        <section key={key} className={styles.monthGroup} aria-label={label}>
          <h2 className={styles.monthLabel}>
            {label}
            <span className={styles.monthCount}>
              {groupResults.length} result{groupResults.length !== 1 ? 's' : ''}
            </span>
          </h2>

          <div className={styles.rows} role="list">
            {groupResults.map(r => (
              <div key={r.id} role="listitem">
                <ResultRow result={r} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
