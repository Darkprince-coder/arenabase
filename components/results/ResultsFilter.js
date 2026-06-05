'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import styles from './ResultsFilter.module.css';

const DATE_TABS = [
  { label: 'All Results', value: 'all' },
  { label: 'Today',       value: 'today' },
  { label: 'This Week',   value: 'this-week' },
  { label: 'This Month',  value: 'this-month' },
];

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
 * ResultsFilter
 * Must be wrapped in <Suspense> — uses useSearchParams().
 * Props: tournaments – [{ id, name, slug }]
 */
export default function ResultsFilter({ tournaments = [] }) {
  const router                       = useRouter();
  const searchParams                 = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTournament = searchParams.get('tournament') || 'all';
  const activeDate       = searchParams.get('date')       || 'all';

  function buildUrl(overrides) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (!v || v === 'all') params.delete(k);
      else params.set(k, v);
    });
    const qs = params.toString();
    return `/results${qs ? `?${qs}` : ''}`;
  }

  function navigate(overrides) {
    startTransition(() => router.push(buildUrl(overrides)));
  }

  return (
    <div
      className={`${styles.filterBar} ${isPending ? styles.pending : ''}`}
      aria-busy={isPending}
    >
      {/* Dropdown row */}
      <div className={styles.dropdownRow}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={activeTournament}
            onChange={e => navigate({ tournament: e.target.value })}
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

      {/* Date tabs */}
      <div className={styles.tabRow} role="tablist" aria-label="Filter by time period">
        {DATE_TABS.map(tab => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeDate === tab.value}
            className={`${styles.tab} ${activeDate === tab.value ? styles.tabActive : ''}`}
            onClick={() => navigate({ date: tab.value })}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
