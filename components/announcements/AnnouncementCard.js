import Link from 'next/link';
import { formatRelativeDate, truncate } from '@/lib/utils';
import styles from './AnnouncementCard.module.css';

function MegaphoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 11v2a1 1 0 0 0 1 1h1l2 4h2l-1-4h7l3 4h1v-4a2 2 0 0 0 0-4V6a2 2 0 0 0 0-4H8L5 6H4a1 1 0 0 0-1 1v2"/>
    </svg>
  );
}

/**
 * AnnouncementCard
 *
 * Full-width row card with a left accent bar.
 * Links to the full announcement detail page.
 *
 * Props:
 *   announcement – { id, title, slug, body, published_at, tournament }
 */
export default function AnnouncementCard({ announcement }) {
  const { title, slug, body, published_at, tournament } = announcement;

  return (
    <Link
      href={`/announcements/${slug}`}
      className={styles.card}
      aria-label={title}
    >
      {/* Left accent bar */}
      <div className={styles.accentBar} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Top row: icon + tournament tag + date */}
        <div className={styles.topRow}>
          <span className={styles.iconWrap} aria-hidden="true">
            <MegaphoneIcon />
          </span>

          <div className={styles.topMeta}>
            {tournament?.name && (
              <span className={styles.tournamentTag}>{tournament.name}</span>
            )}
            <time
              className={styles.date}
              dateTime={published_at}
              aria-label={`Published ${formatRelativeDate(published_at)}`}
            >
              {formatRelativeDate(published_at)}
            </time>
          </div>
        </div>

        {/* Title */}
        <h2 className={styles.title}>{title}</h2>

        {/* Excerpt */}
        {body && (
          <p className={styles.excerpt}>{truncate(body, 160)}</p>
        )}

        {/* Read more */}
        <span className={styles.readMore} aria-hidden="true">
          Read announcement →
        </span>
      </div>
    </Link>
  );
}
