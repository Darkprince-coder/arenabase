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
  const teamIds     = formData.getAll('team_ids[]').map(v => v?.toString()).filter(Boolean)

  if (!name) return { data: null, error: 'Tournament name is required.' }
  if (!slug) return { data: null, error: 'URL slug is required.' }

  return {
    error: null,
    data: { name, slug, description, status, format, total_teams: totalTeams, start_date: startDate, end_date: endDate, banner_public_id: bannerId, team_ids: teamIds },
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

  const { data: inserted, error: dbError } = await admin.from('tournaments').insert({
    name: data.name,
    slug: data.slug,
    description: data.description,
    status: data.status,
    format: data.format,
    total_teams: data.total_teams,
    start_date: data.start_date,
    end_date: data.end_date,
    banner_public_id: data.banner_public_id,
    sport_id: sport?.id ?? null,
  }).select('id, slug').single()

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `A tournament with the slug "${data.slug}" already exists. Choose a different name or edit the slug.` }
    }
    return { error: dbError.message }
  }

  // Insert tournament -> team mappings if any
  try {
    const teamIds = data.team_ids ?? []
    if (teamIds.length > 0) {
      const rows = teamIds.map(tid => ({ tournament_id: inserted.id, team_id: tid }))
      const { error: ttError } = await admin.from('tournament_teams').insert(rows)
      if (ttError) console.error('[createTournament] tournament_teams insert error', ttError.message)
    }
  } catch (e) {
    console.error('[createTournament] sync teams', e)
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
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      status: data.status,
      format: data.format,
      total_teams: data.total_teams,
      start_date: data.start_date,
      end_date: data.end_date,
      banner_public_id: data.banner_public_id,
    })
    .eq('id', id)

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `A tournament with the slug "${data.slug}" already exists.` }
    }
    return { error: dbError.message }
  }

  // Sync tournament_teams: delete current entries then insert new mappings
  try {
    const teamIds = data.team_ids ?? []
    // remove existing
    await admin.from('tournament_teams').delete().eq('tournament_id', id)
    // insert new
    if (teamIds.length > 0) {
      const rows = teamIds.map(tid => ({ tournament_id: id, team_id: tid }))
      const { error: ttError } = await admin.from('tournament_teams').insert(rows)
      if (ttError) console.error('[updateTournament] tournament_teams insert error', ttError.message)
    }
  } catch (e) {
    console.error('[updateTournament] sync teams', e)
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
