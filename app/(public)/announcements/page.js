import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/ui/PageHeader';
import AnnouncementsFilter from '@/components/announcements/AnnouncementsFilter';
import AnnouncementCard from '@/components/announcements/AnnouncementCard';
import styles from './page.module.css';

export const revalidate = 60;

/* ── Metadata ───────────────────────────────────────── */
export const metadata = {
  title: 'Announcements',
  description:
    'Latest news, updates and announcements from tournaments and the ARENABASE team in Kajiado.',
  openGraph: {
    title: 'Announcements | ARENABASE',
    description: 'Latest news and updates from Kajiado football.',
  },
};

/* ── Data fetching ──────────────────────────────────── */
async function getPageData(tournamentSlug) {
  /* Fetch tournament list for dropdown + total count in parallel */
  const [{ data: tournamentsData }, { count: total }] = await Promise.all([
    supabase.from('tournaments').select('id, name, slug').order('name'),
    supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
  ]);

  const tournaments       = tournamentsData ?? [];
  const selectedTournament =
    tournamentSlug && tournamentSlug !== 'all'
      ? tournaments.find(t => t.slug === tournamentSlug) ?? null
      : null;

  /* Build announcements query */
  let q = supabase
    .from('announcements')
    .select('id, title, slug, body, published_at, tournament:tournament_id(id, name, slug)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(30);

  if (selectedTournament) q = q.eq('tournament_id', selectedTournament.id);

  const { data: announcementsData } = await q;

  return {
    announcements: announcementsData ?? [],
    tournaments,
    total:         total ?? 0,
  };
}

/* ── Filter skeleton ────────────────────────────────── */
function FilterSkeleton() {
  return (
    <div className={styles.filterSkeleton} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonSelect}`} />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default async function AnnouncementsPage(props) {
  /* Next.js 15: searchParams is a Promise */
  const searchParams   = await props.searchParams;
  const tournamentSlug = searchParams?.tournament ?? 'all';

  const { announcements, tournaments, total } = await getPageData(tournamentSlug);

  return (
    <>
      {/* ── Page header ─────────────────────────── */}
      <PageHeader
        title="ANNOUNCEMENTS"
        subtitle="Latest news, match updates and official notices from the ARENABASE team."
      >
        {total > 0 && (
          <span className={styles.totalBadge}>
            {total} announcement{total !== 1 ? 's' : ''}
          </span>
        )}
      </PageHeader>

      {/* ── Filter + List ───────────────────────── */}
      <div className={`${styles.body} container`}>
        {/* AnnouncementsFilter uses useSearchParams — must be in Suspense */}
        <Suspense fallback={<FilterSkeleton />}>
          <AnnouncementsFilter tournaments={tournaments} />
        </Suspense>

        {announcements.length === 0 ? (
          <div className={styles.empty}>
            <svg
              width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              className={styles.emptyIcon} aria-hidden="true"
            >
              <path d="M3 11v2a1 1 0 0 0 1 1h1l2 4h2l-1-4h7l3 4h1v-4a2 2 0 0 0 0-4V6a2 2 0 0 0 0-4H8L5 6H4a1 1 0 0 0-1 1v2"/>
            </svg>
            <p className={styles.emptyTitle}>No announcements found.</p>
            <p className={styles.emptyHint}>
              {tournamentSlug !== 'all'
                ? 'No announcements for this tournament yet.'
                : 'Announcements will appear here once they are published.'}
            </p>
          </div>
        ) : (
          <ul className={styles.list} role="list">
            {announcements.map(a => (
              <li key={a.id} role="listitem">
                <AnnouncementCard announcement={a} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
