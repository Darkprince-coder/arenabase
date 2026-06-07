'use client'

import { useState, useEffect, useActionState } from 'react'
import { slugify } from '@/lib/utils'
import styles from './AnnouncementForm.module.css'

/* ── Icons ──────────────────────────────────────────── */
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" className={styles.chevron} aria-hidden="true">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function SpinnerIcon() {
  return <span className={styles.spinner} aria-hidden="true" />
}

/* ── Helpers ────────────────────────────────────────── */

/** Convert a UTC ISO timestamp → datetime-local string in EAT (UTC+3) */
function toDatetimeLocal(utcIso) {
  if (!utcIso) return ''
  try {
    const d = new Date(utcIso)
    if (isNaN(d.getTime())) return ''
    const eatMs = d.getTime() + 3 * 60 * 60 * 1000
    return new Date(eatMs).toISOString().slice(0, 16)
  } catch {
    return ''
  }
}

/* ── Field wrapper ──────────────────────────────────── */
function Field({ label, htmlFor, required, hint, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-label="required">*</span>}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   AnnouncementForm

   Props:
     action       – createAnnouncement or updateAnnouncement.bind(null, id)
     initialData  – existing announcement row (for edit mode)
     tournaments  – [{ id, name }]
   ══════════════════════════════════════════════════════ */
export default function AnnouncementForm({
  action,
  initialData   = null,
  tournaments   = [],
}) {
  const [state, formAction, isPending] = useActionState(action, null)

  /* ── Controlled fields ──────────────────────────── */
  const [title,       setTitle]       = useState(initialData?.title       ?? '')
  const [slug,        setSlug]        = useState(initialData?.slug        ?? '')
  const [slugEdited,  setSlugEdited]  = useState(Boolean(initialData?.slug))
  const [body,        setBody]        = useState(initialData?.body        ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false)

  /* Auto-generate slug from title until user manually edits it */
  useEffect(() => {
    if (!slugEdited && title) setSlug(slugify(title))
  }, [title, slugEdited])

  const isEdit    = Boolean(initialData)
  const charCount = body.length
  const charOver  = charCount > 2000

  /* Default publish date: existing value or now */
  const defaultPublishDate = toDatetimeLocal(
    initialData?.published_at ?? new Date().toISOString()
  )

  return (
    <form action={formAction} className={styles.form} noValidate>

      {/* ── Hidden publish flag ──────────────────── */}
      <input type="hidden" name="is_published" value={isPublished ? '1' : '0'} />

      {/* ── Error banner ─────────────────────────── */}
      {state?.error && (
        <div className={styles.errorBanner} role="alert">
          <ErrorIcon />
          {state.error}
        </div>
      )}

      <div className={styles.grid}>

        {/* ════════════════════════════════════
            LEFT — content
            ════════════════════════════════════ */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Content</h2>

            {/* Title */}
            <Field label="Title" htmlFor="a-title" required>
              <input
                id="a-title"
                name="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={styles.input}
                placeholder="e.g. Fixtures Released for Round 1"
                required
                disabled={isPending}
                autoFocus={!isEdit}
              />
            </Field>

            {/* Slug */}
            <Field
              label="URL Slug"
              htmlFor="a-slug"
              required
              hint={
                <span>
                  arenabase.co.ke/announcements/
                  <strong className={styles.slugPreview}>{slug || '…'}</strong>
                </span>
              }
            >
              <input
                id="a-slug"
                name="slug"
                type="text"
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
                onBlur={e => setSlug(slugify(e.target.value))}
                className={styles.input}
                placeholder="fixtures-released-round-1"
                required
                disabled={isPending}
              />
            </Field>

            {/* Body */}
            <Field label="Body" htmlFor="a-body" required>
              <textarea
                id="a-body"
                name="body"
                value={body}
                onChange={e => setBody(e.target.value)}
                className={`${styles.input} ${styles.bodyTextarea}`}
                placeholder="Write the full announcement here. Keep it clear and concise — readers see this on the public site."
                rows={12}
                required
                disabled={isPending}
              />
              {/* Character counter */}
              <div className={styles.charRow}>
                <span className={`${styles.charCount} ${charOver ? styles.charOver : ''}`}>
                  {charCount.toLocaleString()} character{charCount !== 1 ? 's' : ''}
                </span>
                {charOver && (
                  <span className={styles.charWarning}>
                    Consider splitting into multiple announcements.
                  </span>
                )}
              </div>
            </Field>
          </div>
        </div>

        {/* ════════════════════════════════════
            RIGHT — settings
            ════════════════════════════════════ */}
        <div className={styles.metaCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Settings</h2>

            {/* Tournament */}
            <Field label="Tournament" htmlFor="a-tournament">
              <div className={styles.selectWrapper}>
                <select
                  id="a-tournament"
                  name="tournament_id"
                  defaultValue={initialData?.tournament_id ?? ''}
                  className={styles.select}
                  disabled={isPending}
                >
                  <option value="">— General (no tournament) —</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </Field>

            {/* Status toggle */}
            <div className={styles.field}>
              <span className={styles.label}>Status</span>
              <div className={styles.statusToggle} role="group" aria-label="Publication status">
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!isPublished ? styles.toggleDraft : ''}`}
                  onClick={() => setIsPublished(false)}
                  aria-pressed={!isPublished}
                  disabled={isPending}
                >
                  Draft
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${isPublished ? styles.togglePublished : ''}`}
                  onClick={() => setIsPublished(true)}
                  aria-pressed={isPublished}
                  disabled={isPending}
                >
                  Published
                </button>
              </div>
              <p className={styles.statusDesc}>
                {isPublished
                  ? 'Visible to everyone on the public site.'
                  : 'Only visible here in the admin panel.'}
              </p>
            </div>

            {/* Publish date */}
            <Field
              label="Publish Date"
              htmlFor="a-pub-date"
              hint="EAT (UTC+3) — can be backdated or forward-dated"
            >
              <input
                id="a-pub-date"
                name="published_at"
                type="datetime-local"
                className={styles.input}
                defaultValue={defaultPublishDate}
                disabled={isPending}
              />
            </Field>
          </div>

          {/* ── Submit ─────────────────────────── */}
          <button
            type="submit"
            className={`${styles.submitBtn} ${isPublished ? styles.submitPublish : styles.submitDraft}`}
            disabled={isPending}
          >
            {isPending ? (
              <><SpinnerIcon /> Saving…</>
            ) : isPublished ? (
              isEdit ? 'Save & Publish' : 'Create & Publish'
            ) : (
              isEdit ? 'Save Draft' : 'Create Draft'
            )}
          </button>
        </div>

      </div>
    </form>
  )
}
