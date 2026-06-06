'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import styles from './TournamentTabs.module.css';

const TABS = [
  { label: 'Fixtures', value: 'fixtures' },
  { label: 'Results',  value: 'results' },
  { label: 'Teams',    value: 'teams' },
];

export default function TournamentTabs({ slug }) {
  const router                       = useRouter();
  const searchParams                 = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeTab = searchParams.get('tab') || 'fixtures';

  function navigate(tab) {
    const qs = tab !== 'fixtures' ? `?tab=${tab}` : '';
    startTransition(() => router.push(`/tournaments/${slug}${qs}`));
  }

  return (
    <nav className={`${styles.tabs} ${isPending ? styles.pending : ''}`} role="tablist" aria-label="Tournament sections">
      {TABS.map(tab => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
          onClick={() => navigate(tab.value)}
        >
          {tab.label}
          {activeTab === tab.value && <span className={styles.activeBar} aria-hidden="true" />}
        </button>
      ))}
    </nav>
  );
}
