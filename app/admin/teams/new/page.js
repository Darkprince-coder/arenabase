import AdminFormLayout from '@/components/admin/AdminFormLayout'
import TeamForm from '@/components/admin/TeamForm'
import { createTeam } from '../actions'

export const metadata = { title: 'Add Team' }

export default function NewTeamPage() {
  return (
    <AdminFormLayout
      title="Add Team"
      subtitle="Register a new team. They will immediately appear in fixture creation."
      backHref="/admin/teams"
      backLabel="Back to Teams"
    >
      <TeamForm action={createTeam} />
    </AdminFormLayout>
  )
}
