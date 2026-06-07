import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import FixtureForm from '@/components/admin/FixtureForm'
import { createFixture } from '../actions'

export const metadata = { title: 'New Fixture' }

export default async function NewFixturePage() {
  const admin = createAdminClient()

  const [
    { data: tournaments },
    { data: teams },
    { data: venues },
  ] = await Promise.all([
    admin.from('tournaments').select('id, name').order('name'),
    admin.from('teams').select('id, name').eq('is_active', true).order('name'),
    admin.from('venues').select('id, name').order('name'),
  ])

  return (
    <AdminFormLayout
      title="New Fixture"
      subtitle="Schedule a match between two teams. Times are in East Africa Time (UTC+3)."
      backHref="/admin/fixtures"
      backLabel="Back to Fixtures"
    >
      <FixtureForm
        action={createFixture}
        tournaments={tournaments ?? []}
        teams={teams         ?? []}
        venues={venues        ?? []}
      />
    </AdminFormLayout>
  )
}
