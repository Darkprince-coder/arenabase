import { createAdminClient } from '@/lib/supabase'
import AdminSection, {
  AdminTable, AdminTableRow, AdminTd, AdminActions,
  AdminActionLink, EmptyRow,
} from '@/components/admin/AdminSection'
import { formatMatchDate } from '@/lib/utils'

export const metadata = { title: 'Results' }
export const dynamic  = 'force-dynamic'

async function getResultsData() {
  const admin = createAdminClient()

  // Fetch completed fixtures and all results in parallel
  const [{ data: fixtures }, { data: results }] = await Promise.all([
    admin
      .from('fixtures')
      .select(`
        id, kickoff_time, round,
        home_team:home_team_id(name),
        away_team:away_team_id(name),
        tournament:tournament_id(name)
      `)
      .eq('status', 'completed')
      .order('kickoff_time', { ascending: false })
      .limit(80),

    admin
      .from('results')
      .select('fixture_id, home_score, away_score, notes, published_at'),
  ])

  // Index results by fixture_id
  const resultMap = new Map(
    (results ?? []).map(r => [r.fixture_id, r])
  )

  const rows = (fixtures ?? []).map(f => ({
    ...f,
    result: resultMap.get(f.id) ?? null,
  }))

  const pendingCount = rows.filter(r => !r.result).length

  return { rows, total: rows.length, pendingCount }
}

export default async function AdminResultsPage() {
  const { rows, total, pendingCount } = await getResultsData()

  return (
    <AdminSection
      title="Results"
      subtitle={
        pendingCount > 0
          ? `${pendingCount} completed fixture${pendingCount !== 1 ? 's' : ''} still need a result.`
          : 'All completed fixtures have published results.'
      }
      count={total}
    >
      <AdminTable
        headers={['Date', 'Match', 'Tournament', 'Score', 'Notes', '']}
      >
        {rows.length === 0 ? (
          <EmptyRow
            colSpan={6}
            message="No completed fixtures yet. Mark fixtures as completed first."
          />
        ) : (
          rows.map(row => {
            const hasResult = !!row.result
            return (
              <AdminTableRow key={row.id} muted={false}>
                {/* Date */}
                <AdminTd nowrap>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {formatMatchDate(row.kickoff_time)}
                  </span>
                </AdminTd>

                {/* Match */}
                <AdminTd>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                    {row.home_team?.name ?? '—'} vs {row.away_team?.name ?? '—'}
                  </span>
                  {row.round && (
                    <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {row.round}
                    </span>
                  )}
                </AdminTd>

                {/* Tournament */}
                <AdminTd nowrap>
                  {row.tournament?.name ?? '—'}
                </AdminTd>

                {/* Score */}
                <AdminTd nowrap align="center">
                  {hasResult ? (
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>
                      {row.result.home_score} – {row.result.away_score}
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 8px', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 700,
                      background: 'rgba(255,184,0,0.10)',
                      color: 'var(--color-warning)',
                      border: '1px solid rgba(255,184,0,0.25)',
                    }}>
                      Pending
                    </span>
                  )}
                </AdminTd>

                {/* Notes */}
                <AdminTd>
                  {row.result?.notes ? (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      {row.result.notes}
                    </span>
                  ) : '—'}
                </AdminTd>

                {/* Actions */}
                <AdminActions>
                  {hasResult ? (
                    <AdminActionLink href={`/admin/results/${row.id}/publish`}>
                      Edit
                    </AdminActionLink>
                  ) : (
                    <AdminActionLink href={`/admin/results/${row.id}/publish`} variant="success">
                      + Enter Result
                    </AdminActionLink>
                  )}
                </AdminActions>
              </AdminTableRow>
            )
          })
        )}
      </AdminTable>
    </AdminSection>
  )
}
