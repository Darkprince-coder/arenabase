import TeamLogo from '@/components/ui/TeamLogo';
import styles from './TournamentTeams.module.css';

function TeamCard({ team }) {
  return (
    <div className={styles.card} aria-label={team.name}>
      <div className={styles.logoWrap}><TeamLogo team={team} size={64} /></div>
      <span className={styles.teamName}>{team.name}</span>
    </div>
  );
}

function EmptyTeams() {
  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={styles.emptyIcon} aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p className={styles.emptyMsg}>No teams registered yet.</p>
      <p className={styles.emptyHint}>Teams will appear here once they are added by the admin.</p>
    </div>
  );
}

export default function TournamentTeams({ teams = [], totalTeams = 0 }) {
  if (teams.length === 0) return <EmptyTeams />;
  return (
    <div className={styles.wrapper}>
      <p className={styles.summary} aria-live="polite">
        <span className={styles.summaryCount}>{teams.length}</span>{' '}team{teams.length !== 1 ? 's' : ''} registered
        {totalTeams > teams.length && <span className={styles.summaryTotal}>{' '}· {totalTeams} expected</span>}
      </p>
      <ul className={styles.grid} role="list">
        {teams.map(team => <li key={team.id} role="listitem"><TeamCard team={team} /></li>)}
      </ul>
    </div>
  );
}
