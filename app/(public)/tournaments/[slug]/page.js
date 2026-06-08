import { Suspense }  from 'react';
import { notFound }  from 'next/navigation';
import Link          from 'next/link';
import { supabase }  from '@/lib/supabase';
import { img }       from '@/lib/cloudinary';
import TournamentTabs     from '@/components/tournaments/TournamentTabs';
import TournamentFixtures from '@/components/tournaments/TournamentFixtures';
import TournamentResults  from '@/components/tournaments/TournamentResults';
import TournamentTeams    from '@/components/tournaments/TournamentTeams';
import styles from './page.module.css';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase.from('tournaments').select('slug');
  return (data ?? []).map(t => ({ slug: t.slug }));
}

/* ── Dynamic metadata ───────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('name, description, banner_public_id')
    .eq('slug', slug)
    .single();

  if (!tournament) return { title: 'Tournament Not Found' };

  const desc = tournament.description
    || `${tournament.name} — fixtures, results and teams in Kajiado.`;

  return {
    title: tournament.name,
    description: desc,
    openGraph: {
      title: `${tournament.name} | ARENABASE`,
      description: desc,
      ...(tournament.banner_public_id && {
        images: [{ url: img.ogImage(tournament.banner_public_id), width: 1200, height: 630, alt: tournament.name }],
      }),
    },
  };
}

/* ── Helpers ────────────────────────────────────────── */
function formatStatus(status) {
  return { ongoing: 'ONGOING', upcoming: 'UPCOMING', completed: 'COMPLETED' }[status] ?? status.toUpperCase();
}

function formatFormat(format) {
  return {
    knockout:    'Knockout',
    league:      'League',
    group_stage: 'Group Stage',
    mixed:       'Mixed Format',
  }[format] ?? format;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ── Gradient fallback for hero ─────────────────────── */
const GRADIENTS = [
  'linear-gradient(160deg, #071200 0%, #1A3000 100%)',
  'linear-gradient(160deg, #00101A 0%, #002140 100%)',
  'linear-gradient(160deg, #150600 0%, #331200 100%)',
];

function getGradient(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = slug.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

/* ── Tab-specific data fetching ─────────────────────── */
async function getTabData(tournament, activeTab) {
  if (activeTab === 'fixtures') {
    const { data } = await supabase
      .from('fixtures')
      .select(`
        id, kickoff_time, round, status,
        home_team:home_team_id(id, name, slug, logo_public_id),
        away_team:away_team_id(id, name, slug, logo_public_id),
        venue:venue_id(name)
      `)
      .eq('tournament_id', tournament.id)
      .order('kickoff_time');
    return { fixtures: data ?? [] };
  }

  if (activeTab === 'results') {
    const { data: completedFixtures } = await supabase
      .from('fixtures')
      .select('id')
      .eq('tournament_id', tournament.id)
      .eq('status', 'completed');

    const fixtureIds = (completedFixtures ?? []).map(f => f.id);
    if (fixtureIds.length === 0) return { results: [] };

    const { data } = await supabase
      .from('results')
      .select(`
        id, home_score, away_score, published_at, notes,
        fixture:fixture_id(
          id, kickoff_time, round,
          home_team:home_team_id(id, name, slug, logo_public_id),
          away_team:away_team_id(id, name, slug, logo_public_id)
        )
      `)
      .in('fixture_id', fixtureIds)
      .order('published_at', { ascending: false });
    return { results: data ?? [] };
  }

  if (activeTab === 'teams') {
    const { data } = await supabase
      .from('tournament_teams')
      .select('team:team_id(id, name, slug, logo_public_id)')
      .eq('tournament_id', tournament.id);
    return { teams: (data ?? []).map(row => row.team).filter(Boolean) };
  }

  return {};
}

/* ── JSON-LD: SportsEvent per fixture ───────────────── */
function buildFixturesJsonLd(tournament, fixtures = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': fixtures.map(f => ({
      '@type':    'SportsEvent',
      name:       `${f.home_team?.name ?? 'TBD'} vs ${f.away_team?.name ?? 'TBD'}`,
      startDate:  f.kickoff_time,
      sport:      'Football',
      location:   f.venue?.name
        ? { '@type': 'Place', name: f.venue.name, address: { '@type': 'PostalAddress', addressLocality: 'Kajiado', addressCountry: 'KE' } }
        : undefined,
      competitor: [
        { '@type': 'SportsTeam', name: f.home_team?.name ?? 'TBD' },
        { '@type': 'SportsTeam', name: f.away_team?.name ?? 'TBD' },
      ],
      superEvent: { '@type': 'SportsEvent', name: tournament.name },
    })),
  };
}

/* ── JSON-LD: BreadcrumbList ────────────────────────── */
function buildBreadcrumbJsonLd(tournament) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Tournaments',
        item: 'https://www.arenabase.co.ke/tournaments',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tournament.name,
        item: `https://www.arenabase.co.ke/tournaments/${tournament.slug}`,
      },
    ],
  };
}

/* ── Tab skeleton ───────────────────────────────────── */
function TabsSkeleton() {
  return (
    <div style={{
      height: 53,
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--sp-1)',
      paddingInline: 'var(--page-padding)',
    }} aria-hidden="true">
      {['Fixtures', 'Results', 'Teams'].map(label => (
        <div key={label} className="skeleton"
          style={{ height: 20, width: label.length * 8 + 12, borderRadius: 'var(--radius-sm)' }} />
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default async function TournamentDetailPage(props) {
  const { slug }     = await props.params;
  const searchParams = await props.searchParams;
  const activeTab    = searchParams?.tab ?? 'fixtures';

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('id, name, slug, description, banner_public_id, status, format, total_teams, start_date, end_date')
    .eq('slug', slug)
    .single();

  if (!tournament) notFound();

  const tabData = await getTabData(tournament, activeTab);

  const heroBg = tournament.banner_public_id
    ? { backgroundImage: `url(${img.tournamentBanner(tournament.banner_public_id)})` }
    : { background: getGradient(slug) };

  return (
    <>
      {/* BreadcrumbList — always present, helps Google show path in search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(tournament)) }}
      />

      {/* SportsEvent — only when fixtures tab is active and fixtures exist */}
      {activeTab === 'fixtures' && tabData.fixtures?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFixturesJsonLd(tournament, tabData.fixtures)) }}
        />
      )}

      {/* ── Hero ────────────────────────────────────── */}
      <section className={styles.hero} aria-label={`${tournament.name} hero`}>
        <div className={styles.heroBg} style={heroBg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={`${styles.heroContent} container`}>

          {/* ── Breadcrumb — back to tournaments ── */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/tournaments" className={styles.backLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              All Tournaments
            </Link>
          </nav>

          <div className={styles.heroMeta}>
            <span className={`${styles.statusBadge} ${styles[`status_${tournament.status}`]}`}>
              {formatStatus(tournament.status)}
            </span>
            {tournament.format && (
              <span className={styles.formatBadge}>{formatFormat(tournament.format)}</span>
            )}
          </div>

          <h1 className={styles.heroTitle}>{tournament.name}</h1>

          {tournament.description && (
            <p className={styles.heroDesc}>{tournament.description}</p>
          )}

          <div className={styles.heroStats} role="list">
            {tournament.total_teams > 0 && (
              <div className={styles.stat} role="listitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {tournament.total_teams} Teams
              </div>
            )}
            {tournament.start_date && (
              <div className={styles.stat} role="listitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                Started {formatDate(tournament.start_date)}
              </div>
            )}
            {tournament.end_date && (
              <div className={styles.stat} role="listitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Ends {formatDate(tournament.end_date)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Tabs ────────────────────────────────────── */}
      <div className={styles.tabsWrapper}>
        <div className="container" style={{ padding: 0 }}>
          <Suspense fallback={<TabsSkeleton />}>
            <TournamentTabs slug={tournament.slug} />
          </Suspense>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────── */}
      <div className={`${styles.tabContent} container`}>
        {activeTab === 'fixtures' && (
          <TournamentFixtures fixtures={tabData.fixtures ?? []} />
        )}
        {activeTab === 'results' && (
          <TournamentResults results={tabData.results ?? []} />
        )}
        {activeTab === 'teams' && (
          <TournamentTeams
            teams={tabData.teams ?? []}
            totalTeams={tournament.total_teams}
          />
        )}
      </div>
    </>
  );
}
