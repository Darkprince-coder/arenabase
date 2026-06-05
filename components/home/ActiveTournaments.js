import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { img } from '@/lib/cloudinary';
import styles from './ActiveTournaments.module.css';

/* CSS-only gradient backgrounds — used when no Cloudinary banner is set */
const CARD_GRADIENTS = [
  { from: '#071200', to: '#1A3000' },  // Forest green
  { from: '#00101A', to: '#002140' },  // Deep navy
  { from: '#150600', to: '#331200' },  // Dark amber
];

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
      <path d="M12 17v4"/><path d="M8 21h8"/>
      <path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
    </svg>
  );
}

function formatStatus(status) {
  const MAP = { ongoing: 'ONGOING', upcoming: 'UPCOMING', completed: 'COMPLETED' };
  return MAP[status] ?? status.toUpperCase();
}

function formatFormat(format) {
  const MAP = {
    knockout:    'Knockout',
    league:      'League',
    group_stage: 'Group Stage',
    mixed:       'Mixed Format',
  };
  return MAP[format] ?? format;
}

function TournamentCard({ tournament, index }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  const bgStyle = tournament.banner_public_id
    ? {
        backgroundImage: `url(${img.tournamentCard(tournament.banner_public_id)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: `linear-gradient(145deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      };

  return (
    <Link
      href={`/tournaments/${tournament.slug}`}
      className={styles.card}
      aria-label={`${tournament.name} — ${formatStatus(tournament.status)}`}
    >
      {/* Background */}
      <div className={styles.cardBg} style={bgStyle} aria-hidden="true" />

      {/* Gradient overlay for text readability */}
      <div className={styles.cardOverlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.cardContent}>
        {/* Top: team count + status */}
        <div className={styles.cardTop}>
          {tournament.total_teams > 0 && (
            <span className={styles.teamsTag}>
              {tournament.total_teams} TEAMS
            </span>
          )}
          <span className={`${styles.statusBadge} ${styles[tournament.status]}`}>
            {formatStatus(tournament.status)}
          </span>
        </div>

        {/* Bottom: name + meta */}
        <div className={styles.cardBottom}>
          <h3 className={styles.cardName}>{tournament.name}</h3>
          <div className={styles.cardMeta}>
            {tournament.format && (
              <span className={styles.format}>{formatFormat(tournament.format)}</span>
            )}
            {tournament.start_date && (
              <span className={styles.startDate}>
                Started{' '}
                {new Date(tournament.start_date).toLocaleDateString('en-KE', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            )}
          </div>
          <span className={styles.viewLink}>View Tournament →</span>
        </div>
      </div>
    </Link>
  );
}

export default function ActiveTournaments({ tournaments = [] }) {
  return (
    <section className={styles.section} aria-labelledby="tournaments-heading">
      <div className="container">
        <SectionHeader
          title="Active Tournaments"
          icon={<TrophyIcon />}
          viewAllHref="/tournaments"
          viewAllLabel="View all tournaments"
        />

        {tournaments.length === 0 ? (
          <div className={styles.empty}>No active tournaments at the moment.</div>
        ) : (
          <div className={styles.grid}>
            {tournaments.map((t, i) => (
              <TournamentCard key={t.id} tournament={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
