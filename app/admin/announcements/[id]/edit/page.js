import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import AnnouncementForm from '@/components/admin/AnnouncementForm'
import DeleteButton from '@/components/admin/DeleteButton'
import { updateAnnouncement, deleteAnnouncement } from '../../actions'
import styles from './page.module.css'

export const metadata = { title: 'Edit Announcement' }
export const dynamic  = 'force-dynamic'

export default async function EditAnnouncementPage({ params }) {
  const { id } = await params

  const admin = createAdminClient()

  const [
    { data: announcement },
    { data: tournaments },
  ] = await Promise.all([
    admin
      .from('announcements')
      .select('id, title, slug, body, tournament_id, is_published, published_at')
      .eq('id', id)
      .single(),
    admin
      .from('tournaments')
      .select('id, name')
      .order('name'),
  ])

  if (!announcement) notFound()

  const updateAction = updateAnnouncement.bind(null, id)
  const deleteAction = deleteAnnouncement.bind(null, id)

  return (
    <AdminFormLayout
      title="Edit Announcement"
      subtitle={announcement.is_published ? 'Currently published on the public site.' : 'Currently saved as a draft.'}
      backHref="/admin/announcements"
      backLabel="Back to Announcements"
    >
      {/* ── Edit form ───────────────────────── */}
      <AnnouncementForm
        action={updateAction}
        initialData={announcement}
        tournaments={tournaments ?? []}
      />

      {/* ── Danger zone ─────────────────────── */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerInfo}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerDesc}>
            Deleting this announcement permanently removes it from the public
            site. This cannot be undone.
          </p>
        </div>
        <DeleteButton
          action={deleteAction}
          itemName={announcement.title}
          label="Delete Announcement"
        />
      </div>
    </AdminFormLayout>
  )
}
