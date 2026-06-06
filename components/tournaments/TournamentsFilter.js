'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import styles from './TournamentsFilter.module.css';

const STATUS_TABS = [
  { label: 'All',       value: 'all' },
  { label: 'Ongoing',   value: 'ongoing' },
  { label: 'Upcoming',  value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
];

export default function TournamentsFilter() {
  const router                       = useRouter();
  const searchParams                 = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeStatus = searchParams.get('status') || 'all';

  function navigate(status) {
    const params = new URLSearchParams(searchParams.toString());
    if (!status || status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    const qs = params.toString();
    startTransition(() => router.push(`/tournaments${qs ? `?${qs}` : ''}`));
  }

  return (
    <div
      className={`${styles.filterBar} ${isPending ? styles.pending : ''}`}
      aria-busy={isPending}
    >
      <div className={styles.tabRow} role="tablist" aria-label="Filter by tournament status">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeStatus === tab.value}
            className={`${styles.tab} ${activeStatus === tab.value ? styles.tabActive : ''}`}
            onClick={() => navigate(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isPending && (
        <span className={styles.loadingHint} aria-live="polite">Updating…</span>
      )}
    </div>
  );
}
