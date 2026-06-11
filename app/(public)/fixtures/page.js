import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/ui/PageHeader';
import FixturesFilter from '@/components/fixtures/FixturesFilter';
import FixturesList from '@/components/fixtures/FixturesList';
import styles from './page.module.css';

export const revalidate = 60;

/* ── Metadata ───────────────────────────────────────── */
export const metadata = {
  title: 'Fixtures',
  description:
    'All upcoming football fixtures and match schedules across tournaments in Kajiado. Find kick-off times, venues, and more.',
  openGraph: {
    title: 'Fixtures | ARENABASE',
    description: 'Upcoming football fixtures in Kajiado.',
  },
};

/* ── All non-completed statuses ─────────────────────── */
const ACTIVE_STATUSES = ['scheduled', 'live', 'postponed', 'cancelled'];

/* ── Date bound helpers ─────────────────────────────── */
function getDateBounds(dateParam) {
  const now        = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateParam) {
    case 'today': {
      const end = new Date(todayStart);
      end.setDate(end.getDate() + 1);
      return { gte: todayStart.toISOString(), lt: end.toISOString() };
    }
    case 'this-week': {
      const dow    = todayStart.getDay();
      const monday = new Date(todayStart);
      monday.setDate(todayStart.getDate() - (dow === 0 ? 6 : dow - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 7);
      return { gte: now.toISOString(), lt: sunday.toISOString() };
    }
    case 'this-weekend': {
      const dow      = todayStart.getDay();
      const saturday = new Date(todayStart);
      saturday.setDate(todayStart.getDate() + (dow === 6 ? 0 : 6 - dow));
      const monday = new Date(saturday);
      monday.setDate(saturday.getDate() + 2);
      return { gte: saturday.toISOString(), lt: monday.toISOString() };
    }
    case 'this-month': {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { gte: now.toISOString(), lt: nextMonth.toISOString() };
    }
    default:
      return { gte: now.toISOString(), lt: null };
  }
}

/* ── Data fetching ──────────────────────────────────── */
async function getPageData(tournamentSlug, dateParam) {
  const bounds = getDateBounds(dateParam);

  const [{ data: tournamentsData }, { count: upcomingCount }] = await Promise.all([
    supabase.from('tournaments').select('id, name, slug').order('name'),
    /* Badge shows truly upcoming only (scheduled + live) */
    supabase
      .from('fixtures')
      .select('*', { count: 'exact', head: true })
      .in('status', ['scheduled', 'live'])
      .gte('kickoff_time', bounds.gte),
  ]);

  const tournaments        = tournamentsData ?? [];
  const selectedTournament =
    tournamentSlug && tournamentSlug !== 'all'
      ? tournaments.find(t => t.slug === tournamentSlug) ?? null
      : null;

  /* Fetch all active statuses so postponed/cancelled cards appear */
  let q = supabase
    .from('fixtures')
    .select(`
      id, kickoff_time, round, status,
      home_team:home_team_id(id, name, slug, logo_public_id),
      away_team:away_team_id(id, name, slug, logo_public_id),
      venue:venue_id(name),
      tournament:tournament_id(id, name, slug)
    `)
    .in('status', ACTIVE_STATUSES)
    .gte('kickoff_time', bounds.gte)
    .order('kickoff_time')
    .limit(60);

  if (bounds.lt)          q = q.lt('kickoff_time', bounds.lt);
  if (selectedTournament) q = q.eq('tournament_id', selectedTournament.id);

  const { data: fixturesData } = await q;

  return {
    fixtures:      fixturesData ?? [],
    tournaments,
    upcomingCount: upcomingCount ?? 0,
  };
}

/* ── Filter skeleton ────────────────────────────────── */
function FilterSkeleton() {
  return (
    <div className={styles.filterSkeleton} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonBar}`} />
      <div className={`skeleton ${styles.skeletonTabs}`} />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default async function FixturesPage(props) {
  const searchParams   = await props.searchParams;
  const tournamentSlug = searchParams?.tournament ?? 'all';
  const dateParam      = searchParams?.date       ?? 'all';

  const { fixtures, tournaments, upcomingCount } = await getPageData(tournamentSlug, dateParam);

  return (
    <>
      <PageHeader
        title="FIXTURES"
        subtitle="Find all upcoming matches across tournaments."
      >
        {upcomingCount > 0 && (
          <span className={styles.totalBadge}>
            {upcomingCount} upcoming
          </span>
        )}
      </PageHeader>

      <div className={`${styles.body} container`}>
        <Suspense fallback={<FilterSkeleton />}>
          <FixturesFilter tournaments={tournaments} />
        </Suspense>

        <FixturesList fixtures={fixtures} dateFilter={dateParam} />
      </div>
    </>
  );
}
