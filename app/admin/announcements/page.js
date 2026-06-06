import { createAdminClient } from '@/lib/supabase'
import AdminSection, {
  AdminTable, AdminTableRow, AdminTd, AdminActions,
  AdminActionLink, EmptyRow, StatusBadge,
} from '@/components/admin/AdminSection'
import { formatShortDate, truncate } from '@/lib/utils'

export const metadata = { title: 'Announcements' }
export const dynamic  = 'force-dynamic'

async function getAnnouncements() {
  const admin = createAdminClient()
  const { data, count } = await admin
    .from('announcements')
    .select(`
      id, title, slug, body, is_published, published_at,
      tournament:tournament_id(name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  return { announcements: data ?? [], count: count ?? 0 }
}

export default async function AdminAnnouncementsPage() {
  const { announcements, count } = await getAnnouncements()

  const publishedCount = announcements.filter(a => a.is_published).length
  const draftCount     = count - publishedCount

  return (
    <AdminSection
      title="Announcements"
      subtitle={`${publishedCount} published · ${draftCount} draft${draftCount !== 1 ? 's' : ''}`}
      count={count}
      actionLabel="+ New Announcement"
      actionHref="/admin/announcements/new"
    >
      <AdminTable
        headers={['Title', 'Excerpt', 'Tournament', 'Published', 'Status', '']}
      >
        {announcements.length === 0 ? (
          <EmptyRow colSpan={6} message="No announcements yet." />
        ) : (
          announcements.map(a => (
            <AdminTableRow key={a.id} muted={!a.is_published}>
              {/* Title */}
              <AdminTd>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                  {a.title}
                </span>
              </AdminTd>

              {/* Excerpt */}
              <AdminTd>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  {truncate(a.body ?? '', 60)}
                </span>
              </AdminTd>

              {/* Tournament */}
              <AdminTd nowrap>
                {a.tournament?.name ?? (
                  <span style={{ color: 'var(--color-text-muted)' }}>General</span>
                )}
              </AdminTd>

              {/* Date */}
              <AdminTd nowrap>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {formatShortDate(a.published_at)}
                </span>
              </AdminTd>

              {/* Status */}
              <AdminTd>
                <StatusBadge status={a.is_published ? 'published' : 'draft'} />
              </AdminTd>

              {/* Actions */}
              <AdminActions>
                {a.is_published && (
                  <AdminActionLink href={`/announcements/${a.slug}`}>
                    View
                  </AdminActionLink>
                )}
                <AdminActionLink href={`/admin/announcements/${a.id}/edit`}>
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
