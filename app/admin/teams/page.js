import { createAdminClient } from '@/lib/supabase'
import AdminSection, {
  AdminTable, AdminTableRow, AdminTd, AdminActions,
  AdminActionLink, EmptyRow, StatusBadge,
} from '@/components/admin/AdminSection'
import TeamLogo from '@/components/ui/TeamLogo'

export const metadata = { title: 'Teams' }
export const dynamic  = 'force-dynamic'

async function getTeams() {
  const admin = createAdminClient()
  const { data, count } = await admin
    .from('teams')
    .select('id, name, slug, logo_public_id, is_active, sport_id', { count: 'exact' })
    .order('name')

  return { teams: data ?? [], count: count ?? 0 }
}

export default async function AdminTeamsPage() {
  const { teams, count } = await getTeams()

  const activeCount = teams.filter(t => t.is_active).length

  return (
    <AdminSection
      title="Teams"
      subtitle={`${activeCount} active · ${count - activeCount} inactive`}
      count={count}
      actionLabel="+ Add Team"
      actionHref="/admin/teams/new"
    >
      <AdminTable headers={['', 'Team Name', 'Slug', 'Logo', 'Status', '']}>
        {teams.length === 0 ? (
          <EmptyRow colSpan={6} message="No teams found." />
        ) : (
          teams.map((t, i) => (
            <AdminTableRow key={t.id} muted={!t.is_active}>
              {/* Row number */}
              <AdminTd nowrap>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </AdminTd>

              {/* Name + Logo */}
              <AdminTd>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <TeamLogo team={t} size={32} />
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                    {t.name}
                  </span>
                </div>
              </AdminTd>

              {/* Slug */}
              <AdminTd nowrap>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {t.slug}
                </span>
              </AdminTd>

              {/* Logo status */}
              <AdminTd>
                {t.logo_public_id ? (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 600 }}>
                    ✓ Uploaded
                  </span>
                ) : (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Initials fallback
                  </span>
                )}
              </AdminTd>

              {/* Active status */}
              <AdminTd>
                <StatusBadge status={t.is_active ? 'completed' : 'cancelled'} />
              </AdminTd>

              {/* Actions */}
              <AdminActions>
                <AdminActionLink href={`/admin/teams/${t.id}/edit`}>
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
