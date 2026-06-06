import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/ui/PageHeader';
import TournamentsFilter from '@/components/tournaments/TournamentsFilter';
import TournamentCard from '@/components/tournaments/TournamentCard';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'Tournaments',
  description: 'Browse all football tournaments in Kajiado — ongoing, upcoming and completed competitions.',
  openGraph: { title: 'Tournaments | ARENABASE', description: 'All football tournaments in Kajiado.' },
};

async function getPageData(statusFilter) {
  let q = supabase
    .from('tournaments')
    .select('id, name, slug, description, banner_public_id, status, format, total_teams, start_date, end_date')
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') q = q.eq('status', statusFilter);

  const [{ data: tournamentsData }, { count: total }] = await Promise.all([
    q,
    supabase.from('tournaments').select('*', { count: 'exact', head: true }),
  ]);

  return { tournaments: tournamentsData ?? [], total: total ?? 0 };
}

function FilterSkeleton() {
  return (
    <div className={styles.filterSkeleton} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonTabs}`} />
    </div>
  );
}

export default async function TournamentsPage(props) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams?.status ?? 'all';
  const { tournaments, total } = await getPageData(statusFilter);

  return (
    <>
      <PageHeader
        title="TOURNAMENTS"
        subtitle="Browse ongoing, upcoming, and completed football competitions in Kajiado."
      >
        {total > 0 && (
          <span className={styles.totalBadge}>{total} tournament{total !== 1 ? 's' : ''}</span>
        )}
      </PageHeader>

      <div className={`${styles.body} container`}>
        <Suspense fallback={<FilterSkeleton />}>
          <TournamentsFilter />
        </Suspense>

        {tournaments.length === 0 ? (
          <div className={styles.empty}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={styles.emptyIcon} aria-hidden="true">
              <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
              <path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/>
            </svg>
            <p className={styles.emptyTitle}>{statusFilter !== 'all' ? `No ${statusFilter} tournaments at the moment.` : 'No tournaments yet.'}</p>
            <p className={styles.emptyHint}>Competitions will appear here once they are published by the admin.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {tournaments.map((t, i) => <TournamentCard key={t.id} tournament={t} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
}
