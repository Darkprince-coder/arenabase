import Link from 'next/link';
import { img } from '@/lib/cloudinary';
import styles from './TournamentCard.module.css';

const CARD_GRADIENTS = [
  { from: '#071200', to: '#1A3000' },
  { from: '#00101A', to: '#002140' },
  { from: '#150600', to: '#331200' },
  { from: '#0A0014', to: '#1E0033' },
  { from: '#001A10', to: '#003020' },
  { from: '#140800', to: '#2E1500' },
];

function formatStatus(status) {
  const MAP = { ongoing: 'ONGOING', upcoming: 'UPCOMING', completed: 'COMPLETED' };
  return MAP[status] ?? status.toUpperCase();
}

function formatFormat(format) {
  const MAP = { knockout: 'Knockout', league: 'League', group_stage: 'Group Stage', mixed: 'Mixed Format' };
  return MAP[format] ?? format;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TournamentCard({ tournament, index = 0 }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const isCompleted = tournament.status === 'completed';

  const bgStyle = tournament.banner_public_id
    ? { backgroundImage: `url(${img.tournamentCard(tournament.banner_public_id)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(145deg, ${gradient.from} 0%, ${gradient.to} 100%)` };

  return (
    <Link
      href={`/tournaments/${tournament.slug}`}
      className={`${styles.card} ${isCompleted ? styles.cardCompleted : ''}`}
      aria-label={`${tournament.name} — ${formatStatus(tournament.status)}`}
    >
      <div className={styles.cardBg} style={bgStyle} aria-hidden="true" />
      <div className={styles.cardOverlay} aria-hidden="true" />
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          {tournament.total_teams > 0 && (
            <span className={styles.teamsTag}>{tournament.total_teams} TEAMS</span>
          )}
          <span className={`${styles.statusBadge} ${styles[`status_${tournament.status}`]}`}>
            {formatStatus(tournament.status)}
          </span>
        </div>
        <div className={styles.cardBottom}>
          <h2 className={styles.cardName}>{tournament.name}</h2>
          <div className={styles.cardMeta}>
            {tournament.format && <span className={styles.format}>{formatFormat(tournament.format)}</span>}
            {tournament.start_date && (
              <span className={styles.date}>
                {isCompleted ? 'Ran' : 'Started'} {formatDate(tournament.start_date)}
                {isCompleted && tournament.end_date ? ` – ${formatDate(tournament.end_date)}` : ''}
              </span>
            )}
          </div>
          <span className={styles.viewLink} aria-hidden="true">View Tournament →</span>
        </div>
      </div>
    </Link>
  );
}
