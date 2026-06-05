import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { formatRelativeDate, truncate } from '@/lib/utils';
import styles from './LatestAnnouncements.module.css';

function MegaphoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 11v2a1 1 0 0 0 1 1h1l2 4h2l-1-4h7l3 4h1v-4a2 2 0 0 0 0-4V6a2 2 0 0 0 0-4H8L5 6H4a1 1 0 0 0-1 1v2"/>
    </svg>
  );
}

export default function LatestAnnouncements({ announcements = [] }) {
  return (
    <section className={styles.section} aria-labelledby="announcements-heading">
      <SectionHeader
        title="Latest Announcements"
        icon={<MegaphoneIcon />}
        viewAllHref="/announcements"
        viewAllLabel="View all"
      />

      {announcements.length === 0 ? (
        <div className={styles.empty}>No announcements yet.</div>
      ) : (
        <ul className={styles.list} role="list">
          {announcements.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.body}>
                <div className={styles.topRow}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.date}>
                    {formatRelativeDate(item.published_at)}
                  </span>
                </div>
                {item.body && (
                  <p className={styles.excerpt}>{truncate(item.body, 100)}</p>
                )}
                {item.tournament?.name && (
                  <span className={styles.tournamentTag}>{item.tournament.name}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link href="/announcements" className={styles.viewAllBtn}>
        View all announcements
      </Link>
    </section>
  );
}
