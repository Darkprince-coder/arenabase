import { supabase } from '@/lib/supabase';
import Hero from '@/components/home/Hero';
import WeekendFixtures from '@/components/home/WeekendFixtures';
import LatestAnnouncements from '@/components/home/LatestAnnouncements';
import LatestResults from '@/components/home/LatestResults';
import ActiveTournaments from '@/components/home/ActiveTournaments';
import ForOrganisers from '@/components/home/ForOrganisers';
/* import NewsletterBanner from '@/components/ui/NewsletterBanner'; */
import styles from './page.module.css';

/* ISR: revalidate this page every 60 seconds */
export const revalidate = 60;

/* ── JSON-LD structured data for Google ─────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.arenabase.co.ke/#website',
      url: 'https://www.arenabase.co.ke',
      name: 'ARENABASE',
      description: 'Fixtures, results, tournaments and announcements from your local sports community in Kajiado.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.arenabase.co.ke/fixtures?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SportsOrganization',
      name: 'ARENABASE',
      url: 'https://www.arenabase.co.ke',
      sport: 'Football',
      location: {
        '@type': 'Place',
        name: 'Kajiado, Kenya',
        address: { '@type': 'PostalAddress', addressLocality: 'Kajiado', addressCountry: 'KE' },
      },
    },
  ],
};

/* ── Data fetching ──────────────────────────────────── */
async function getPageData() {
  const now = new Date().toISOString();

  const [
    { data: fixturesData },
    { data: resultsData },
    { data: announcementsData },
    { data: tournamentsData },
    { count: fixturesCount },
    { count: tournamentsCount },
    { count: teamsCount },
  ] = await Promise.all([

    /* Upcoming fixtures */
    supabase
      .from('fixtures')
      .select(`
        id, kickoff_time, round, status,
        home_team:home_team_id(id, name, slug, logo_public_id),
        away_team:away_team_id(id, name, slug, logo_public_id),
        venue:venue_id(name),
        tournament:tournament_id(name, slug)
      `)
      .in('status', ['scheduled', 'live'])
      .gte('kickoff_time', now)
      .order('kickoff_time')
      .limit(6),

    /* Latest results */
    supabase
      .from('results')
      .select(`
        id, home_score, away_score, published_at,
        fixture:fixture_id(
          id, kickoff_time,
          home_team:home_team_id(id, name, slug, logo_public_id),
          away_team:away_team_id(id, name, slug, logo_public_id),
          tournament:tournament_id(name, slug)
        )
      `)
      .order('published_at', { ascending: false })
      .limit(5),

    /* Announcements */
    supabase
      .from('announcements')
      .select('id, title, slug, body, published_at, tournament:tournament_id(name, slug)')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(4),

    /* Active tournaments */
    supabase
      .from('tournaments')
      .select('id, name, slug, description, banner_public_id, status, format, total_teams, start_date')
      .eq('status', 'ongoing')
      .order('created_at', { ascending: false })
      .limit(3),

    /* Stats counts */
    supabase.from('fixtures').select('*', { count: 'exact', head: true }),
    supabase.from('tournaments').select('*', { count: 'exact', head: true }).eq('status', 'ongoing'),
    supabase.from('teams').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  return {
    fixtures:      fixturesData      ?? [],
    results:       resultsData       ?? [],
    announcements: announcementsData ?? [],
    tournaments:   tournamentsData   ?? [],
    stats: {
      fixturesCount:    fixturesCount    ?? 0,
      tournamentsCount: tournamentsCount ?? 0,
      teamsCount:       teamsCount       ?? 0,
    },
  };
}

/* ── Page ───────────────────────────────────────────── */
export default async function HomePage() {
  const { fixtures, results, announcements, tournaments, stats } = await getPageData();

  /* First upcoming fixture shown in the hero right panel */
  const nextFixture = fixtures[0] ?? null;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────── */}
      <Hero stats={stats} nextFixture={nextFixture} />

      {/* ── Fixtures ──────────────────────────────── */}
      <WeekendFixtures fixtures={fixtures} />

      {/* ── Announcements + Results ───────────────── */}
      <div className={`${styles.twoCol} container`}>
        <LatestAnnouncements announcements={announcements} />
        <LatestResults       results={results} />
      </div>

      {/* ── Active Tournaments ────────────────────── */}
      <ActiveTournaments tournaments={tournaments} />

      {/* ── For Organisers ────────────────────────── */}
      <ForOrganisers />

      {/* ── Newsletter ────────────────────────────── */}
      {/* <NewsletterBanner /> */}
    </>
  );
}
