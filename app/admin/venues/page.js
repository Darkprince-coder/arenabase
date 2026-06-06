import { createAdminClient } from '@/lib/supabase'
import AdminSection, {
  AdminTable, AdminTableRow, AdminTd, AdminActions,
  AdminActionLink, EmptyRow,
} from '@/components/admin/AdminSection'

export const metadata = { title: 'Venues' }
export const dynamic  = 'force-dynamic'

async function getVenues() {
  const admin = createAdminClient()
  const { data, count } = await admin
    .from('venues')
    .select('id, name, location, created_at', { count: 'exact' })
    .order('name')

  return { venues: data ?? [], count: count ?? 0 }
}

export default async function AdminVenuesPage() {
  const { venues, count } = await getVenues()

  return (
    <AdminSection
      title="Venues"
      subtitle="Manage match venues and grounds used across fixtures."
      count={count}
      actionLabel="+ Add Venue"
      actionHref="/admin/venues/new"
    >
      <AdminTable headers={['#', 'Venue Name', 'Location / Area', 'Added', '']}>
        {venues.length === 0 ? (
          <EmptyRow colSpan={5} message="No venues added yet." />
        ) : (
          venues.map((v, i) => (
            <AdminTableRow key={v.id}>
              {/* Number */}
              <AdminTd nowrap>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </AdminTd>

              {/* Name */}
              <AdminTd>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                  {v.name}
                </span>
              </AdminTd>

              {/* Location */}
              <AdminTd>
                {v.location ? (
                  <span style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {v.location}
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>—</span>
                )}
              </AdminTd>

              {/* Added date */}
              <AdminTd nowrap>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {new Date(v.created_at).toLocaleDateString('en-KE', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </AdminTd>

              {/* Actions */}
              <AdminActions>
                <AdminActionLink href={`/admin/venues/${v.id}/edit`}>
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
