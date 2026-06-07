'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'

/* ── Shared parser ──────────────────────────────────── */
function parseFormData(formData) {
  const title         = formData.get('title')?.toString().trim()         ?? ''
  const slug          = formData.get('slug')?.toString().trim()          || slugify(title)
  const body          = formData.get('body')?.toString().trim()          ?? ''
  const tournamentId  = formData.get('tournament_id')?.toString()        || null
  const isPublished   = formData.get('is_published')?.toString() === '1'
  const publishedAtRaw = formData.get('published_at')?.toString()        || null

  if (!title) return { data: null, error: 'Title is required.' }
  if (!slug)  return { data: null, error: 'URL slug is required.' }
  if (!body)  return { data: null, error: 'Announcement body cannot be empty.' }

  /* Convert datetime-local (EAT/UTC+3) → proper timestamptz.
   * Falls back to now() if the field was left empty. */
  const publishedAt = publishedAtRaw
    ? `${publishedAtRaw}:00+03:00`
    : new Date().toISOString()

  return {
    error: null,
    data: {
      title,
      slug,
      body,
      tournament_id: tournamentId,
      is_published:  isPublished,
      published_at:  publishedAt,
    },
  }
}

/* ── CREATE ─────────────────────────────────────────── */
export async function createAnnouncement(prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()
  const { error: dbError } = await admin.from('announcements').insert(data)

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `An announcement with slug "${data.slug}" already exists. Edit the title or slug.` }
    }
    return { error: dbError.message }
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/announcements')
  revalidatePath('/')
  redirect('/admin/announcements')
}

/* ── UPDATE ─────────────────────────────────────────── */
export async function updateAnnouncement(id, prevState, formData) {
  const { data, error } = parseFormData(formData)
  if (error) return { error }

  const admin = createAdminClient()
  const { error: dbError } = await admin
    .from('announcements')
    .update(data)
    .eq('id', id)

  if (dbError) {
    if (dbError.code === '23505') {
      return { error: `An announcement with slug "${data.slug}" already exists.` }
    }
    return { error: dbError.message }
  }

  revalidatePath('/admin/announcements')
  revalidatePath(`/announcements/${data.slug}`)
  revalidatePath('/announcements')
  revalidatePath('/')
  redirect('/admin/announcements')
}

/* ── DELETE ─────────────────────────────────────────── */
export async function deleteAnnouncement(id) {
  const admin = createAdminClient()

  const { error } = await admin
    .from('announcements')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteAnnouncement]', error.message)
    return
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/announcements')
  revalidatePath('/')
  redirect('/admin/announcements')
}
