import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import TournamentForm from '@/components/admin/TournamentForm'
import DeleteTournamentButton from '@/components/admin/DeleteTournamentButton'
import { updateTournament, deleteTournament } from '../../actions'
import styles from './page.module.css'

export const metadata = { title: 'Edit Tournament' }
export const dynamic  = 'force-dynamic'

export default async function EditTournamentPage({ params }) {
  const { id } = await params

  const admin = createAdminClient()
  const { data: tournament, error } = await admin
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single()

  if (!tournament || error) notFound()

  const updateAction = updateTournament.bind(null, id)
  const deleteAction = deleteTournament.bind(null, id)

  return (
    <AdminFormLayout
      title={`Edit: ${tournament.name}`}
      subtitle="Changes are saved immediately and revalidate the public tournament pages."
      backHref="/admin/tournaments"
      backLabel="Back to Tournaments"
    >
      <TournamentForm
        action={updateAction}
        initialData={tournament}
      />

      {/* Danger zone */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerDesc}>
            Deleting a tournament permanently removes it along with all linked
            fixture and result associations. This cannot be undone.
          </p>
        </div>

        {/* Client component handles the confirm dialog */}
        <DeleteTournamentButton
          action={deleteAction}
          tournamentName={tournament.name}
        />
      </div>
    </AdminFormLayout>
  )
}