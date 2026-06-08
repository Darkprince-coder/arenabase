import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import TeamForm from '@/components/admin/TeamForm'
import DeleteButton from '@/components/admin/DeleteButton'
import { updateTeam, deleteTeam } from '../../actions'
import styles from './page.module.css'

export const metadata = { title: 'Edit Team' }
export const dynamic  = 'force-dynamic'

export default async function EditTeamPage({ params }) {
  const { id } = await params

  const admin = createAdminClient()

  /* Also count how many fixtures this team is in, for the danger zone warning */
  const [
    { data: team },
    { count: fixtureCount },
  ] = await Promise.all([
    admin
      .from('teams')
      .select('id, name, slug, logo_public_id, is_active')
      .eq('id', id)
      .single(),
    admin
      .from('fixtures')
      .select('*', { count: 'exact', head: true })
      .or(`home_team_id.eq.${id},away_team_id.eq.${id}`)
      .in('status', ['scheduled', 'live']),
  ])

  if (!team) notFound()

  const updateAction = updateTeam.bind(null, id)
  const deleteAction = deleteTeam.bind(null, id)

  return (
    <AdminFormLayout
      title={`Edit: ${team.name}`}
      subtitle={team.is_active ? 'Active — appears in fixture creation.' : 'Inactive — hidden from fixture selectors.'}
      backHref="/admin/teams"
      backLabel="Back to Teams"
    >
      <TeamForm action={updateAction} initialData={team} />

      {/* ── Danger zone ─────────────────────── */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerInfo}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerDesc}>
            Deleting this team removes them from all tournament rosters.
            {fixtureCount > 0 && (
              <strong>
                {' '}Warning: this team has {fixtureCount} upcoming fixture{fixtureCount !== 1 ? 's' : ''} — those matches will lose their team reference.
              </strong>
            )}
            {' '}Consider marking the team as <em>Inactive</em> instead.
          </p>
        </div>
        <DeleteButton
          action={deleteAction}
          itemName={team.name}
          label="Delete Team"
        />
      </div>
    </AdminFormLayout>
  )
}
