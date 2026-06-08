import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import VenueForm from '@/components/admin/VenueForm'
import DeleteButton from '@/components/admin/DeleteButton'
import { updateVenue, deleteVenue } from '../../actions'
import styles from './page.module.css'

export const metadata = { title: 'Edit Venue' }
export const dynamic  = 'force-dynamic'

export default async function EditVenuePage({ params }) {
  const { id } = await params

  const admin = createAdminClient()

  /* Count upcoming fixtures at this venue for the danger zone warning */
  const [
    { data: venue },
    { count: upcomingCount },
  ] = await Promise.all([
    admin
      .from('venues')
      .select('id, name, location')
      .eq('id', id)
      .single(),
    admin
      .from('fixtures')
      .select('*', { count: 'exact', head: true })
      .eq('venue_id', id)
      .in('status', ['scheduled', 'live']),
  ])

  if (!venue) notFound()

  const updateAction = updateVenue.bind(null, id)
  const deleteAction = deleteVenue.bind(null, id)

  return (
    <AdminFormLayout
      title={`Edit: ${venue.name}`}
      subtitle={venue.location ?? 'No location set'}
      backHref="/admin/venues"
      backLabel="Back to Venues"
    >
      <VenueForm action={updateAction} initialData={venue} />

      {/* ── Danger zone ─────────────────────── */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerInfo}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerDesc}>
            Deleting this venue will remove it from the system.
            {upcomingCount > 0 ? (
              <strong>
                {' '}{upcomingCount} upcoming fixture{upcomingCount !== 1 ? 's' : ''} reference
                {upcomingCount === 1 ? 's' : ''} this venue — those fixtures will show no venue.
              </strong>
            ) : (
              ' No upcoming fixtures are using this venue.'
            )}
          </p>
        </div>
        <DeleteButton
          action={deleteAction}
          itemName={venue.name}
          label="Delete Venue"
        />
      </div>
    </AdminFormLayout>
  )
}
