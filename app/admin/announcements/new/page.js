import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import AnnouncementForm from '@/components/admin/AnnouncementForm'
import { createAnnouncement } from '../actions'

export const metadata = { title: 'New Announcement' }

export default async function NewAnnouncementPage() {
  const admin = createAdminClient()

  const { data: tournaments } = await admin
    .from('tournaments')
    .select('id, name')
    .order('name')

  return (
    <AdminFormLayout
      title="New Announcement"
      subtitle="Write an announcement for the public site. Save as draft or publish immediately."
      backHref="/admin/announcements"
      backLabel="Back to Announcements"
    >
      <AnnouncementForm
        action={createAnnouncement}
        tournaments={tournaments ?? []}
      />
    </AdminFormLayout>
  )
}
