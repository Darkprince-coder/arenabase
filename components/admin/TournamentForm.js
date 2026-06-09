'use client'

import { useState, useEffect, useActionState } from 'react'
import { slugify } from '@/lib/utils'
import styles from './TournamentForm.module.css'
import ImageUpload from './ImageUpload'

/* ── Inline icons ───────────────────────────────────── */
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" className={styles.chevron} aria-hidden="true">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

function SpinnerIcon() {
  return <span className={styles.spinner} aria-hidden="true" />
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

/* ── Options ────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'ongoing',   label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
]

const FORMAT_OPTIONS = [
  { value: 'knockout',    label: 'Knockout' },
  { value: 'league',      label: 'League' },
  { value: 'group_stage', label: 'Group Stage' },
  { value: 'mixed',       label: 'Mixed Format' },
]

/* ── Field component ────────────────────────────────── */
function Field({ label, htmlFor, required, hint, children, error }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-label="required">*</span>}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      {children}
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  )
}

/* ── Main form ──────────────────────────────────────── */
/**
 * TournamentForm
 *
 * Props:
 *   action      – server action (createTournament or updateTournament.bind(null, id))
 *   initialData – tournament row from DB, provided when editing
 */
export default function TournamentForm({ action, initialData = null }) {
  const [state, formAction, isPending] = useActionState(action, null)

  /* Controlled slug — auto-generated from name until user edits it */
  const [name,        setName]        = useState(initialData?.name        ?? '')
  const [slug,        setSlug]        = useState(initialData?.slug        ?? '')
  const [slugEdited,  setSlugEdited]  = useState(Boolean(initialData?.slug))

  useEffect(() => {
    if (!slugEdited && name) setSlug(slugify(name))
  }, [name, slugEdited])

  const isEdit = Boolean(initialData)

  return (
    <form action={formAction} className={styles.form} noValidate>
      {/* ── Global error banner ──────────────── */}
      {state?.error && (
        <div className={styles.errorBanner} role="alert">
          <ErrorIcon />
          {state.error}
        </div>
      )}

      <div className={styles.grid}>
        {/* ════════════════════════════════════
            LEFT — main details
            ════════════════════════════════════ */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Details</h2>

            {/* Name */}
            <Field
              label="Tournament Name"
              htmlFor="t-name"
              required
            >
              <input
                id="t-name"
                name="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={styles.input}
                placeholder="e.g. Kajiado Super Cup 2025"
                required
                disabled={isPending}
                autoFocus={!isEdit}
              />
            </Field>

            {/* Slug */}
            <Field
              label="URL Slug"
              htmlFor="t-slug"
              required
              hint={
                <span>
                  arenabase.co.ke/tournaments/
                  <strong className={styles.slugPreview}>{slug || '…'}</strong>
                </span>
              }
            >
              <input
                id="t-slug"
                name="slug"
                type="text"
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
                onBlur={e => setSlug(slugify(e.target.value))}
                className={styles.input}
                placeholder="kajiado-super-cup-2025"
                required
                disabled={isPending}
              />
            </Field>

            {/* Description */}
            <Field
              label="Description"
              htmlFor="t-desc"
            >
              <textarea
                id="t-desc"
                name="description"
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Brief description of the tournament, its purpose and participating teams…"
                defaultValue={initialData?.description ?? ''}
                rows={4}
                disabled={isPending}
              />
            </Field>

            {/* Banner */}
            <Field
              label="Banner Image"
              htmlFor="t-banner"
              hint="Cloudinary public ID (optional)"
            >
              <ImageUpload
                name="banner_public_id"
                folder={slug ? `tournaments/${slug}` : 'tournaments'}
                initial={initialData?.banner_public_id}
              />
              {initialData?.banner_public_id && !initialData?.banner_public_id.startsWith('arenabase') && (
                <p className={styles.bannerNote}>
                  Current ID: <code>{initialData.banner_public_id}</code>
                </p>
              )}
            </Field>
          </div>
        </div>

        {/* ════════════════════════════════════
            RIGHT — settings + submit
            ════════════════════════════════════ */}
        <div className={styles.metaCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Settings</h2>

            {/* Status */}
            <Field label="Status" htmlFor="t-status" required>
              <div className={styles.selectWrapper}>
                <select
                  id="t-status"
                  name="status"
                  className={styles.select}
                  defaultValue={initialData?.status ?? 'upcoming'}
                  disabled={isPending}
                >
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </Field>

            {/* Format */}
            <Field label="Format" htmlFor="t-format">
              <div className={styles.selectWrapper}>
                <select
                  id="t-format"
                  name="format"
                  className={styles.select}
                  defaultValue={initialData?.format ?? ''}
                  disabled={isPending}
                >
                  <option value="">— Select format —</option>
                  {FORMAT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </Field>

            {/* Team count */}
            <Field label="Number of Teams" htmlFor="t-teams">
              <input
                id="t-teams"
                name="total_teams"
                type="number"
                min={2}
                max={128}
                className={styles.input}
                placeholder="e.g. 12"
                defaultValue={initialData?.total_teams ?? ''}
                disabled={isPending}
              />
            </Field>

            {/* Start date */}
            <Field label="Start Date" htmlFor="t-start">
              <input
                id="t-start"
                name="start_date"
                type="date"
                className={styles.input}
                defaultValue={initialData?.start_date ?? ''}
                disabled={isPending}
              />
            </Field>

            {/* End date */}
            <Field label="End Date" htmlFor="t-end">
              <input
                id="t-end"
                name="end_date"
                type="date"
                className={styles.input}
                defaultValue={initialData?.end_date ?? ''}
                disabled={isPending}
              />
            </Field>
          </div>

          {/* ── Submit ─────────────────────── */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isPending}
          >
            {isPending ? (
              <><SpinnerIcon /> Saving…</>
            ) : (
              isEdit ? 'Save Changes' : 'Create Tournament'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
