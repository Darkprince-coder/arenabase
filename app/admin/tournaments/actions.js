'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'

/* ── Shared helper: parse & validate form data ──────── */
function parseFormData(formData) {
  const name        = formData.get('name')?.toString().trim() ?? ''
  const slug        = formData.get('slug')?.toString().trim() || slugify(name)
  const description = formData.get('description')?.toString().trim() || null
  const status      = formData.get('status')?.toString()      || 'upcoming'
  const format      = formData.get('format')?.toString()      || null
  const totalTeams  = parseInt(formData.get('total_teams')?.toString() ?? '0') || 0
  const startDate   = formData.get('start_date')?.toString()  || null
  const endDate     = formData.get('end_date')?.toString()    || null
  const bannerId    = formData.get('banner_public_id')?.toString().trim() || null

  if (!name) return { data: null, error: 'Tournament name is required.' }
  if (!slug) return { data: null, error: 'URL slug is required.' }

  return {
    error: null,
    data: { name, slug, description, status, format, total_teams: totalTeams, start_date: startDate, end_date: endDate, banner_public_id: bannerId },
  }
}

/* ── CREATE ─────────────────────────────────────────── */
export async function createTournament(prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()

  // Resolve football sport ID
  const { data: sport } = await admin
    .from('sports')
    .select('id')
    .eq('slug', 'football')
    .maybeSingle()

  const { error: dbError } = await admin.from('tournaments').insert({
    ...data,
    sport_id: sport?.id ?? null,
  })

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `A tournament with the slug "${data.slug}" already exists. Choose a different name or edit the slug.` }
    }
    return { error: dbError.message }
  }

  revalidatePath('/admin/tournaments')
  revalidatePath('/tournaments')
  revalidatePath('/')
  redirect('/admin/tournaments')
}

/* ── UPDATE ─────────────────────────────────────────── */
/**
 * id is bound via updateTournament.bind(null, tournamentId) in the edit page,
 * so the signature seen by useActionState is (prevState, formData).
 */
export async function updateTournament(id, prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()

  const { error: dbError } = await admin
    .from('tournaments')
    .update(data)
    .eq('id', id)

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `A tournament with the slug "${data.slug}" already exists.` }
    }
    return { error: dbError.message }
  }

  revalidatePath('/admin/tournaments')
  revalidatePath(`/tournaments/${data.slug}`)
  revalidatePath('/tournaments')
  revalidatePath('/')
  redirect('/admin/tournaments')
}

/* ── DELETE ─────────────────────────────────────────── */
/**
 * Also bound: deleteTournament.bind(null, tournamentId)
 * Called from a plain <form action={boundAction}> — no useActionState needed.
 */
export async function deleteTournament(id) {
  const admin = createAdminClient()

  const { error } = await admin
    .from('tournaments')
    .delete()
    .eq('id', id)

  if (error) {
    // Can't redirect with an error from a plain form action — log it
    console.error('[deleteTournament]', error.message)
    return
  }

  revalidatePath('/admin/tournaments')
  revalidatePath('/tournaments')
  revalidatePath('/')
  redirect('/admin/tournaments')
}
