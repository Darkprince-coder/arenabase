'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'

/* ── Parser ─────────────────────────────────────────── */
function parseFormData(formData) {
  const name     = formData.get('name')?.toString().trim()             ?? ''
  const slug     = formData.get('slug')?.toString().trim()             || slugify(name)
  const logoId   = formData.get('logo_public_id')?.toString().trim()  || null
  const isActive = formData.get('is_active')?.toString() === '1'

  if (!name) return { data: null, error: 'Team name is required.' }
  if (!slug) return { data: null, error: 'URL slug is required.' }

  return {
    error: null,
    data: { name, slug, logo_public_id: logoId, is_active: isActive },
  }
}

/* ── CREATE ─────────────────────────────────────────── */
export async function createTeam(prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()

  /* Always associate with football for now */
  const { data: sport } = await admin
    .from('sports')
    .select('id')
    .eq('slug', 'football')
    .maybeSingle()

  const { error: dbError } = await admin
    .from('teams')
    .insert({ ...data, sport_id: sport?.id ?? null })

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `A team with slug "${data.slug}" already exists.` }
    }
    return { error: dbError.message }
  }

  revalidatePath('/admin/teams')
  revalidatePath('/')
  redirect('/admin/teams')
}

/* ── UPDATE ─────────────────────────────────────────── */
export async function updateTeam(id, prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()

  const { error: dbError } = await admin
    .from('teams')
    .update(data)
    .eq('id', id)

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `A team with slug "${data.slug}" already exists.` }
    }
    return { error: dbError.message }
  }

  revalidatePath('/admin/teams')
  revalidatePath('/fixtures')
  revalidatePath('/results')
  revalidatePath('/')
  redirect('/admin/teams')
}

/* ── DELETE ─────────────────────────────────────────── */
export async function deleteTeam(id) {
  const admin = createAdminClient()

  /* Fixtures referencing this team will have their team_id set to NULL
   * (ON DELETE SET NULL in schema). The team's tournament entries cascade-delete. */
  const { error } = await admin.from('teams').delete().eq('id', id)

  if (error) {
    console.error('[deleteTeam]', error.message)
    return
  }

  revalidatePath('/admin/teams')
  revalidatePath('/')
  redirect('/admin/teams')
}
