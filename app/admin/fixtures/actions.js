'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* ── Timezone note ──────────────────────────────────────
 * The <input type="datetime-local"> submits a string like
 * "2025-05-24T15:00" with no timezone. We append +03:00
 * (East Africa Time) so Supabase stores the correct UTC value.
 * Adjust the offset if your server timezone differs.
 * ──────────────────────────────────────────────────────── */
function toTimestamptz(datetimeLocal) {
  if (!datetimeLocal) return null
  return `${datetimeLocal}:00+03:00`
}

/* ── Shared parser ──────────────────────────────────── */
function parseFormData(formData) {
  const tournamentId = formData.get('tournament_id')?.toString() || null
  const homeTeamId   = formData.get('home_team_id')?.toString()  || null
  const awayTeamId   = formData.get('away_team_id')?.toString()  || null
  const venueId      = formData.get('venue_id')?.toString()      || null
  const kickoffRaw   = formData.get('kickoff_time')?.toString()  || null
  const round        = formData.get('round')?.toString().trim()  || null
  const status       = formData.get('status')?.toString()        || 'scheduled'

  if (!tournamentId)               return { data: null, error: 'Tournament is required.' }
  if (!homeTeamId)                 return { data: null, error: 'Home team is required.' }
  if (!awayTeamId)                 return { data: null, error: 'Away team is required.' }
  if (homeTeamId === awayTeamId)   return { data: null, error: 'Home and away teams must be different.' }
  if (!kickoffRaw)                 return { data: null, error: 'Kickoff date and time is required.' }

  return {
    error: null,
    data: {
      tournament_id: tournamentId,
      home_team_id:  homeTeamId,
      away_team_id:  awayTeamId,
      venue_id:      venueId || null,
      kickoff_time:  toTimestamptz(kickoffRaw),
      round,
      status,
    },
  }
}

/* ── CREATE ─────────────────────────────────────────── */
export async function createFixture(prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()
  const { error: dbError } = await admin.from('fixtures').insert(data)

  if (dbError) return { error: dbError.message }

  revalidatePath('/admin/fixtures')
  revalidatePath('/fixtures')
  revalidatePath('/')
  redirect('/admin/fixtures')
}

/* ── UPDATE ─────────────────────────────────────────── */
export async function updateFixture(id, prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()
  const { error: dbError } = await admin
    .from('fixtures')
    .update(data)
    .eq('id', id)

  if (dbError) return { error: dbError.message }

  revalidatePath('/admin/fixtures')
  revalidatePath('/fixtures')
  revalidatePath('/')
  redirect('/admin/fixtures')
}

/* ── DELETE ─────────────────────────────────────────── */
export async function deleteFixture(id) {
  const admin = createAdminClient()

  /* Also delete any associated result (FK is ON DELETE CASCADE,
   * but being explicit here makes the intent clear.) */
  const { error } = await admin
    .from('fixtures')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteFixture]', error.message)
    return
  }

  revalidatePath('/admin/fixtures')
  revalidatePath('/fixtures')
  revalidatePath('/')
  redirect('/admin/fixtures')
}
