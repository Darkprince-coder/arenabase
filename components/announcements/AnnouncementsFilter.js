'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import styles from './AnnouncementsFilter.module.css';

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

/**
 * AnnouncementsFilter
 *
 * Single tournament dropdown — updates URL, triggers server re-render.
 * Must be wrapped in <Suspense> in its parent.
 *
 * Props:
 *   tournaments – [{ id, name, slug }] from the server
 */
export default function AnnouncementsFilter({ tournaments = [] }) {
  const router                       = useRouter();
  const searchParams                 = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTournament = searchParams.get('tournament') || 'all';

  function navigate(tournamentSlug) {
    const params = new URLSearchParams(searchParams.toString());
    if (!tournamentSlug || tournamentSlug === 'all') {
      params.delete('tournament');
    } else {
      params.set('tournament', tournamentSlug);
    }
    const qs = params.toString();
    startTransition(() => router.push(`/announcements${qs ? `?${qs}` : ''}`));
  }

  return (
    <div
      className={`${styles.filterBar} ${isPending ? styles.pending : ''}`}
      aria-busy={isPending}
    >
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={activeTournament}
          onChange={e => navigate(e.target.value)}
          aria-label="Filter by tournament"
        >
          <option value="all">All Tournaments</option>
          {tournaments.map(t => (
            <option key={t.id} value={t.slug}>{t.name}</option>
          ))}
        </select>
        <span className={styles.selectArrow}><ChevronDown /></span>
      </div>

      {isPending && (
        <span className={styles.loadingHint} aria-live="polite">Updating…</span>
      )}
    </div>
  );
}
