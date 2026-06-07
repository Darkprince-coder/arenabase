import AdminFormLayout from '@/components/admin/AdminFormLayout'
import TournamentForm from '@/components/admin/TournamentForm'
import { createTournament } from '../actions'

export const metadata = { title: 'New Tournament' }

export default function NewTournamentPage() {
  return (
    <AdminFormLayout
      title="New Tournament"
      subtitle="Create a new football tournament. The URL slug is auto-generated from the name."
      backHref="/admin/tournaments"
      backLabel="Back to Tournaments"
    >
      <TournamentForm action={createTournament} />
    </AdminFormLayout>
  )
}
