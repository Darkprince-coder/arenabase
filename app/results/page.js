import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/ui/PageHeader';
import ResultsFilter from '@/components/results/ResultsFilter';
import ResultsList from '@/components/results/ResultsList';
import styles from './page.module.css';

export const revalidate = 60;

/* ── Metadata ───────────────────────────────────────── */
export const metadata = {
  title: 'Results',
  description:
    'Football match results and final scores from all tournaments in Kajiado. View winners, scorelines and match summaries.',
  openGraph: {
    title: 'Results | ARENABASE',
    description: 'All football match results in Kajiado.',
  },
};

/* ── Date bound helpers (filter on published_at) ─────── */
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
      const nextMonday = new Date(monday);
      nextMonday.setDate(monday.getDate() + 7);
      return { gte: monday.toISOString(), lt: nextMonday.toISOString() };
    }
    case 'this-month': {
      const start     = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { gte: start.toISOString(), lt: nextMonth.toISOString() };
    }
    default: // 'all' — no date filter
      return { gte: null, lt: null };
  }
}

/* ── Data fetching ──────────────────────────────────── */
async function getPageData(tournamentSlug, dateParam) {
  const bounds = getDateBounds(dateParam);

  /* Step 1: Tournaments list for dropdown */
  const { data: tournamentsData } = await supabase
    .from('tournaments')
    .select('id, name, slug')
    .order('name');

  const tournaments = tournamentsData ?? [];

  /* Step 2: Resolve tournament filter → fixture IDs */
  let fixtureIdFilter = null;

  if (tournamentSlug && tournamentSlug !== 'all') {
    const selected = tournaments.find(t => t.slug === tournamentSlug);

    if (selected) {
      const { data: fxData } = await supabase
        .from('fixtures')
        .select('id')
        .eq('tournament_id', selected.id)
        .eq('status', 'completed');

      fixtureIdFilter = fxData?.map(f => f.id) ?? [];

      /* Tournament exists but has no completed fixtures yet */
      if (fixtureIdFilter.length === 0) {
        return { results: [], tournaments, total: 0 };
      }
    }
  }

  /* Step 3: Build results query */
  let q = supabase
    .from('results')
    .select(`
      id, home_score, away_score, published_at, notes,
      fixture:fixture_id(
        id, kickoff_time, round,
        home_team:home_team_id(id, name, slug, logo_public_id),
        away_team:away_team_id(id, name, slug, logo_public_id),
        tournament:tournament_id(id, name, slug)
      )
    `)
    .order('published_at', { ascending: false })
    .limit(60);

  if (bounds.gte)      q = q.gte('published_at', bounds.gte);
  if (bounds.lt)       q = q.lt('published_at', bounds.lt);
  if (fixtureIdFilter) q = q.in('fixture_id', fixtureIdFilter);

  const { data: resultsData } = await q;
  const results = resultsData ?? [];

  return { results, tournaments, total: results.length };
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
export default async function ResultsPage(props) {
  const searchParams   = await props.searchParams;
  const tournamentSlug = searchParams?.tournament ?? 'all';
  const dateParam      = searchParams?.date       ?? 'all';

  const { results, tournaments, total } = await getPageData(tournamentSlug, dateParam);

  return (
    <>
      {/* Page header */}
      <PageHeader
        title="RESULTS"
        subtitle="View all match results and scores."
      >
        {total > 0 && (
          <span className={styles.totalBadge}>
            {total} result{total !== 1 ? 's' : ''}
          </span>
        )}
      </PageHeader>

      {/* Filter + List */}
      <div className={`${styles.body} container`}>
        <Suspense fallback={<FilterSkeleton />}>
          <ResultsFilter tournaments={tournaments} />
        </Suspense>

        <ResultsList results={results} dateFilter={dateParam} />
      </div>
    </>
  );
}
