'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* ── PUBLISH (create or update) ─────────────────────
 * Uses upsert on the UNIQUE fixture_id constraint,
 * so the same action handles both first-time publish
 * and editing an existing result.
 * fixtureId is bound via publishResult.bind(null, id).
 * ─────────────────────────────────────────────────── */
export async function publishResult(fixtureId, prevState, formData) {
  const homeScore = parseInt(formData.get('home_score')?.toString() ?? '', 10)
  const awayScore = parseInt(formData.get('away_score')?.toString() ?? '', 10)
  const notes     = formData.get('notes')?.toString().trim() || null

  if (isNaN(homeScore) || homeScore < 0) return { error: 'Home score must be 0 or higher.' }
  if (isNaN(awayScore) || awayScore < 0) return { error: 'Away score must be 0 or higher.' }

  const admin = createAdminClient()

  /* Upsert — inserts on first publish, updates on re-publish */
  const { error: resultError } = await admin
    .from('results')
    .upsert(
      {
        fixture_id:   fixtureId,
        home_score:   homeScore,
        away_score:   awayScore,
        notes,
        published_at: new Date().toISOString(),
      },
      { onConflict: 'fixture_id' }
    )

  if (resultError) return { error: resultError.message }

  /* Sync fixture status → completed (only if not already) */
  await admin
    .from('fixtures')
    .update({ status: 'completed' })
    .eq('id', fixtureId)
    .neq('status', 'completed')

  revalidatePath('/admin/results')
  revalidatePath('/admin/fixtures')
  revalidatePath('/results')
  revalidatePath('/fixtures')
  revalidatePath('/')
  redirect('/admin/results')
}

/* ── DELETE ──────────────────────────────────────────
 * Removes the result row. Fixture stays as completed.
 * resultId is bound via deleteResult.bind(null, id).
 * ─────────────────────────────────────────────────── */
export async function deleteResult(resultId) {
  const admin = createAdminClient()

  const { error } = await admin
    .from('results')
    .delete()
    .eq('id', resultId)

  if (error) {
    console.error('[deleteResult]', error.message)
    return
  }

  revalidatePath('/admin/results')
  revalidatePath('/results')
  revalidatePath('/')
  redirect('/admin/results')
}
