import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import FixtureForm from '@/components/admin/FixtureForm'
import DeleteButton from '@/components/admin/DeleteButton'
import { updateFixture, deleteFixture } from '../../actions'
import styles from './page.module.css'

export const metadata = { title: 'Edit Fixture' }
export const dynamic  = 'force-dynamic'

export default async function EditFixturePage({ params }) {
  /* Next.js 15: params is a Promise */
  const { id } = await params

  const admin = createAdminClient()

  /* Load fixture + all selector data in one round trip */
  const [
    { data: fixture },
    { data: tournaments },
    { data: teams },
    { data: venues },
  ] = await Promise.all([
    admin
      .from('fixtures')
      .select('id, tournament_id, home_team_id, away_team_id, venue_id, kickoff_time, round, status')
      .eq('id', id)
      .single(),
    admin.from('tournaments').select('id, name').order('name'),
    admin.from('teams').select('id, name').eq('is_active', true).order('name'),
    admin.from('venues').select('id, name').order('name'),
  ])

  if (!fixture) notFound()

  /* Bind the fixture ID to both actions */
  const updateAction = updateFixture.bind(null, id)
  const deleteAction = deleteFixture.bind(null, id)

  /* Build a readable fixture label for the danger-zone confirm */
  const homeTeam = teams?.find(t => t.id === fixture.home_team_id)
  const awayTeam = teams?.find(t => t.id === fixture.away_team_id)
  const fixtureName = homeTeam && awayTeam
    ? `${homeTeam.name} vs ${awayTeam.name}`
    : 'this fixture'

  return (
    <AdminFormLayout
      title="Edit Fixture"
      subtitle="Update match details. Changing status to Completed enables result entry."
      backHref="/admin/fixtures"
      backLabel="Back to Fixtures"
    >
      {/* ── Edit form ───────────────────────── */}
      <FixtureForm
        action={updateAction}
        initialData={fixture}
        tournaments={tournaments ?? []}
        teams={teams         ?? []}
        venues={venues        ?? []}
      />

      {/* ── Danger zone ─────────────────────── */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerDesc}>
            Deleting a fixture permanently removes it and any published result
            associated with it. This cannot be undone.
          </p>
        </div>
        <DeleteButton action={deleteAction} itemName={fixtureName} />
      </div>
    </AdminFormLayout>
  )
}
