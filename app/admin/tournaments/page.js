import { createAdminClient } from '@/lib/supabase'
import AdminSection, {
  AdminTable, AdminTableRow, AdminTd, AdminActions,
  AdminActionLink, EmptyRow, StatusBadge,
} from '@/components/admin/AdminSection'

export const metadata = { title: 'Tournaments' }
export const dynamic  = 'force-dynamic'

const FORMAT_LABELS = {
  knockout:    'Knockout',
  league:      'League',
  group_stage: 'Group Stage',
  mixed:       'Mixed',
}

async function getTournaments() {
  const admin = createAdminClient()
  const { data, count } = await admin
    .from('tournaments')
    .select('id, name, slug, status, format, total_teams, start_date, end_date', { count: 'exact' })
    .order('created_at', { ascending: false })

  return { tournaments: data ?? [], count: count ?? 0 }
}

export default async function AdminTournamentsPage() {
  const { tournaments, count } = await getTournaments()

  return (
    <AdminSection
      title="Tournaments"
      subtitle="Create and manage football tournaments."
      count={count}
      actionLabel="+ New Tournament"
      actionHref="/admin/tournaments/new"
    >
      <AdminTable
        headers={['Name', 'Status', 'Format', 'Teams', 'Start Date', '']}
      >
        {tournaments.length === 0 ? (
          <EmptyRow colSpan={6} message="No tournaments yet. Create the first one above." />
        ) : (
          tournaments.map(t => (
            <AdminTableRow key={t.id}>
              {/* Name */}
              <AdminTd>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', display: 'block' }}>
                  {t.name}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  /{t.slug}
                </span>
              </AdminTd>

              {/* Status */}
              <AdminTd nowrap>
                <StatusBadge status={t.status} />
              </AdminTd>

              {/* Format */}
              <AdminTd nowrap>
                {FORMAT_LABELS[t.format] ?? t.format ?? '—'}
              </AdminTd>

              {/* Teams */}
              <AdminTd align="center">
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
                  {t.total_teams ?? '—'}
                </span>
              </AdminTd>

              {/* Start date */}
              <AdminTd nowrap>
                {t.start_date
                  ? new Date(t.start_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
                  : <span style={{ color: 'var(--color-text-muted)' }}>Not set</span>
                }
              </AdminTd>

              {/* Actions */}
              <AdminActions>
                <AdminActionLink href={`/tournaments/${t.slug}`}>
                  View
                </AdminActionLink>
                <AdminActionLink href={`/admin/tournaments/${t.id}/edit`}>
                  Edit
                </AdminActionLink>
              </AdminActions>
            </AdminTableRow>
          ))
        )}
      </AdminTable>
    </AdminSection>
  )
}
