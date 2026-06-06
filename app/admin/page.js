import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'
import StatCard from '@/components/admin/StatCard'
import TeamLogo from '@/components/ui/TeamLogo'
import { formatMatchDate, formatKickoffTime, formatRelativeDate } from '@/lib/utils'
import styles from './page.module.css'

export const metadata = { title: 'Dashboard' }
export const dynamic  = 'force-dynamic'

/* ── Icons ──────────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function WarnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

/* ── Data ───────────────────────────────────────────── */
async function getDashboardData() {
  const admin = createAdminClient()
  const now   = new Date().toISOString()

  const [
    { count: upcomingCount },
    { count: tournamentsCount },
    { count: resultsCount },
    { count: announcementsCount },
    { count: completedCount },
    { data: nextFixtures },
    { data: recentAnnouncements },
    { data: allTeams },
  ] = await Promise.all([
    // Upcoming + live fixtures
    admin.from('fixtures')
      .select('*', { count: 'exact', head: true })
      .in('status', ['scheduled', 'live'])
      .gte('kickoff_time', now),

    // Ongoing tournaments
    admin.from('tournaments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ongoing'),

    // Results published
    admin.from('results')
      .select('*', { count: 'exact', head: true }),

    // Published announcements
    admin.from('announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),

    // Completed fixtures (to calculate pending results)
    admin.from('fixtures')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),

    // Next 6 fixtures
    admin.from('fixtures')
      .select(`
        id, kickoff_time, round, status,
        home_team:home_team_id(id, name, slug, logo_public_id),
        away_team:away_team_id(id, name, slug, logo_public_id),
        tournament:tournament_id(name, slug)
      `)
      .in('status', ['scheduled', 'live'])
      .gte('kickoff_time', now)
      .order('kickoff_time')
      .limit(6),

    // Last 5 announcements (published + draft)
    admin.from('announcements')
      .select('id, title, is_published, published_at, tournament:tournament_id(name)')
      .order('created_at', { ascending: false })
      .limit(5),

    // Active team count (for stats)
    admin.from('teams')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
  ])

  const pendingResults = Math.max(0, (completedCount ?? 0) - (resultsCount ?? 0))

  return {
    stats: {
      upcomingFixtures:   upcomingCount    ?? 0,
      ongoingTournaments: tournamentsCount ?? 0,
      resultsPublished:   resultsCount     ?? 0,
      announcements:      announcementsCount ?? 0,
      pendingResults,
    },
    nextFixtures:        nextFixtures        ?? [],
    recentAnnouncements: recentAnnouncements ?? [],
  }
}

/* ── Page ───────────────────────────────────────────── */
export default async function AdminDashboard() {
  const { stats, nextFixtures, recentAnnouncements } = await getDashboardData()

  return (
    <div className={styles.page}>

      {/* ── Page header ─────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>ARENABASE content overview — Kajiado, Kenya</p>
        </div>
        <div className={styles.quickActions}>
          <Link href="/admin/fixtures/new" className={styles.btnPrimary}>
            <PlusIcon /> New Fixture
          </Link>
          <Link href="/admin/announcements/new" className={styles.btnOutline}>
            <PlusIcon /> Announcement
          </Link>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Upcoming Fixtures"
          value={stats.upcomingFixtures}
          href="/admin/fixtures"
          accent="green"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard
          label="Active Tournaments"
          value={stats.ongoingTournaments}
          href="/admin/tournaments"
          accent="yellow"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/></svg>}
        />
        <StatCard
          label="Results Published"
          value={stats.resultsPublished}
          href="/admin/results"
          accent="blue"
          note={stats.pendingResults > 0 ? `${stats.pendingResults} pending` : undefined}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        />
        <StatCard
          label="Announcements"
          value={stats.announcements}
          href="/admin/announcements"
          accent="orange"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
        />
      </div>

      {/* ── Pending results alert ────────────────── */}
      {stats.pendingResults > 0 && (
        <Link href="/admin/results" className={styles.alertBanner}>
          <WarnIcon />
          <span>
            <strong>{stats.pendingResults} completed fixture{stats.pendingResults !== 1 ? 's' : ''}</strong>
            {' '}without a published result
          </span>
          <span className={styles.alertCta}>
            Publish Results <ArrowIcon />
          </span>
        </Link>
      )}

      {/* ── Two-column lower section ─────────────── */}
      <div className={styles.twoCol}>

        {/* Upcoming fixtures panel */}
        <section className={styles.panel} aria-labelledby="panel-fixtures">
          <div className={styles.panelHeader}>
            <h2 id="panel-fixtures" className={styles.panelTitle}>Next Fixtures</h2>
            <Link href="/admin/fixtures/new" className={styles.panelAction}>
              + Add
            </Link>
          </div>

          {nextFixtures.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No upcoming fixtures.</p>
              <Link href="/admin/fixtures/new" className={styles.emptyLink}>
                Schedule the first fixture →
              </Link>
            </div>
          ) : (
            <div className={styles.fixtureList}>
              {nextFixtures.map(f => (
                <div key={f.id} className={styles.fixtureRow}>
                  {/* Time */}
                  <div className={styles.fixtureTime}>
                    {f.status === 'live' ? (
                      <span className={styles.liveTag}>
                        <span className={styles.liveDot} aria-hidden="true" />
                        LIVE
                      </span>
                    ) : (
                      <>
                        <span className={styles.fixtureDay}>
                          {new Date(f.kickoff_time)
                            .toLocaleDateString('en-KE', { weekday: 'short' })
                            .toUpperCase()}
                        </span>
                        <span className={styles.fixtureKick}>
                          {formatKickoffTime(f.kickoff_time)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Teams */}
                  <div className={styles.fixtureTeams}>
                    <div className={styles.fixtureTeam}>
                      <TeamLogo team={f.home_team} size={22} />
                      <span className={styles.fixtureTeamName}>{f.home_team?.name ?? '—'}</span>
                    </div>
                    <span className={styles.fixtureVs}>vs</span>
                    <div className={styles.fixtureTeam}>
                      <TeamLogo team={f.away_team} size={22} />
                      <span className={styles.fixtureTeamName}>{f.away_team?.name ?? '—'}</span>
                    </div>
                  </div>

                  {/* Tournament */}
                  <span className={styles.fixtureTournament}>
                    {f.tournament?.name ?? ''}
                  </span>

                  {/* Edit link */}
                  <Link href={`/admin/fixtures/${f.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}

          <Link href="/admin/fixtures" className={styles.panelFooterLink}>
            View all fixtures <ArrowIcon />
          </Link>
        </section>

        {/* Recent announcements panel */}
        <section className={styles.panel} aria-labelledby="panel-announcements">
          <div className={styles.panelHeader}>
            <h2 id="panel-announcements" className={styles.panelTitle}>Announcements</h2>
            <Link href="/admin/announcements/new" className={styles.panelAction}>
              + New
            </Link>
          </div>

          {recentAnnouncements.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No announcements yet.</p>
              <Link href="/admin/announcements/new" className={styles.emptyLink}>
                Create the first announcement →
              </Link>
            </div>
          ) : (
            <div className={styles.announcementList}>
              {recentAnnouncements.map(a => (
                <div key={a.id} className={styles.announcementRow}>
                  <div className={styles.announcementMeta}>
                    <span className={`${styles.pubBadge} ${a.is_published ? styles.pubBadgePublished : styles.pubBadgeDraft}`}>
                      {a.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className={styles.announcementDate}>
                      {formatRelativeDate(a.published_at)}
                    </span>
                  </div>
                  <p className={styles.announcementTitle}>{a.title}</p>
                  {a.tournament?.name && (
                    <span className={styles.announcementTournament}>{a.tournament.name}</span>
                  )}
                  <Link href={`/admin/announcements/${a.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}

          <Link href="/admin/announcements" className={styles.panelFooterLink}>
            View all announcements <ArrowIcon />
          </Link>
        </section>

      </div>
    </div>
  )
}
