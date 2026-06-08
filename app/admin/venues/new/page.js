import AdminFormLayout from '@/components/admin/AdminFormLayout'
import VenueForm from '@/components/admin/VenueForm'
import { createVenue } from '../actions'

export const metadata = { title: 'Add Venue' }

export default function NewVenuePage() {
  return (
    <AdminFormLayout
      title="Add Venue"
      subtitle="Register a ground or stadium used for matches."
      backHref="/admin/venues"
      backLabel="Back to Venues"
    >
      <VenueForm action={createVenue} />
    </AdminFormLayout>
  )
}
