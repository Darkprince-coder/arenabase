import { createAdminClient } from '@/lib/supabase'
import AdminSection, {
  AdminTable, AdminTableRow, AdminTd, AdminActions,
  AdminActionLink, EmptyRow, StatusBadge,
} from '@/components/admin/AdminSection'
import { formatMatchDate, formatKickoffTime } from '@/lib/utils'

export const metadata = { title: 'Fixtures' }
export const dynamic  = 'force-dynamic'

async function getFixtures() {
  const admin = createAdminClient()

  const { data, count } = await admin
    .from('fixtures')
    .select(`
      id, kickoff_time, round, status,
      home_team:home_team_id(name),
      away_team:away_team_id(name),
      venue:venue_id(name),
      tournament:tournament_id(name, slug)
    `, { count: 'exact' })
    .order('kickoff_time', { ascending: false })
    .limit(80)

  return { fixtures: data ?? [], count: count ?? 0 }
}

export default async function AdminFixturesPage() {
  const { fixtures, count } = await getFixtures()

  return (
    <AdminSection
      title="Fixtures"
      subtitle="Manage all scheduled, live, and completed matches."
      count={count}
      actionLabel="+ New Fixture"
      actionHref="/admin/fixtures/new"
    >
      <AdminTable
        headers={['Kickoff', 'Match', 'Tournament', 'Round', 'Venue', 'Status', '']}
      >
        {fixtures.length === 0 ? (
          <EmptyRow colSpan={7} message="No fixtures yet. Add the first one above." />
        ) : (
          fixtures.map(f => (
            <AdminTableRow
              key={f.id}
              muted={f.status === 'cancelled' || f.status === 'postponed'}
            >
              {/* Kickoff */}
              <AdminTd nowrap>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {formatMatchDate(f.kickoff_time)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', fontSize: 'var(--text-md)', lineHeight: 1 }}>
                    {formatKickoffTime(f.kickoff_time)}
                  </span>
                </div>
              </AdminTd>

              {/* Match */}
              <AdminTd>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                  {f.home_team?.name ?? '—'} vs {f.away_team?.name ?? '—'}
                </span>
              </AdminTd>

              {/* Tournament */}
              <AdminTd nowrap>
                {f.tournament?.name ?? <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
              </AdminTd>

              {/* Round */}
              <AdminTd nowrap>
                {f.round ?? <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
              </AdminTd>

              {/* Venue */}
              <AdminTd nowrap>
                {f.venue?.name ?? <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
              </AdminTd>

              {/* Status */}
              <AdminTd>
                <StatusBadge status={f.status} />
              </AdminTd>

              {/* Actions */}
              <AdminActions>
                <AdminActionLink href={`/admin/fixtures/${f.id}/edit`}>
                  Edit
                </AdminActionLink>
                {f.status === 'completed' && (
                  <AdminActionLink
                    href={`/admin/results/${f.id}/publish`}
                    variant="success"
                  >
                    Result
                  </AdminActionLink>
                )}
              </AdminActions>
            </AdminTableRow>
          ))
        )}
      </AdminTable>
    </AdminSection>
  )
}
