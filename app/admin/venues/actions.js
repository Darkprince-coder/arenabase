'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* ── Parser ─────────────────────────────────────────── */
function parseFormData(formData) {
  const name     = formData.get('name')?.toString().trim()     ?? ''
  const location = formData.get('location')?.toString().trim() || null

  if (!name) return { data: null, error: 'Venue name is required.' }

  return { error: null, data: { name, location } }
}

/* ── CREATE ─────────────────────────────────────────── */
export async function createVenue(prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()
  const { error: dbError } = await admin.from('venues').insert(data)

  if (dbError) return { error: dbError.message }

  revalidatePath('/admin/venues')
  revalidatePath('/fixtures')
  redirect('/admin/venues')
}

/* ── UPDATE ─────────────────────────────────────────── */
export async function updateVenue(id, prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()
  const { error: dbError } = await admin
    .from('venues')
    .update(data)
    .eq('id', id)

  if (dbError) return { error: dbError.message }

  revalidatePath('/admin/venues')
  revalidatePath('/fixtures')
  redirect('/admin/venues')
}

/* ── DELETE ─────────────────────────────────────────── */
export async function deleteVenue(id) {
  const admin = createAdminClient()

  /* Fixtures referencing this venue will have venue_id set to NULL
   * (ON DELETE SET NULL in schema) — safe to delete. */
  const { error } = await admin.from('venues').delete().eq('id', id)

  if (error) {
    console.error('[deleteVenue]', error.message)
    return
  }

  revalidatePath('/admin/venues')
  revalidatePath('/fixtures')
  redirect('/admin/venues')
}
