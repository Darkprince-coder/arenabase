'use client'

import { useState, useEffect, useActionState } from 'react'
import { slugify } from '@/lib/utils'
import { img } from '@/lib/cloudinary'
import styles from './TeamForm.module.css'

/* ── Icons ──────────────────────────────────────────── */
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

function ImageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="m21 15-5-5L5 21"/>
    </svg>
  )
}

/* ── Field ──────────────────────────────────────────── */
function Field({ label, htmlFor, required, hint, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
        {hint  && <span className={styles.hint}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   TeamForm

   Props:
     action      – createTeam or updateTeam.bind(null, id)
     initialData – existing team row (edit mode)
   ══════════════════════════════════════════════════════ */
export default function TeamForm({ action, initialData = null }) {
  const [state, formAction, isPending] = useActionState(action, null)

  const [name,       setName]       = useState(initialData?.name             ?? '')
  const [slug,       setSlug]       = useState(initialData?.slug             ?? '')
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug))
  const [logoId,     setLogoId]     = useState(initialData?.logo_public_id   ?? '')
  const [isActive,   setIsActive]   = useState(initialData?.is_active        ?? true)

  /* Logo preview — only construct the URL when there's a value */
  const [logoError, setLogoError]   = useState(false)
  const logoPreviewUrl = logoId.trim() ? img.teamLogo(logoId.trim()) : null

  /* Reset error flag when logo ID changes */
  useEffect(() => { setLogoError(false) }, [logoId])

  /* Auto-generate slug from name */
  useEffect(() => {
    if (!slugEdited && name) setSlug(slugify(name))
  }, [name, slugEdited])

  const isEdit = Boolean(initialData)

  return (
    <form action={formAction} className={styles.form} noValidate>

      {/* Hidden active flag */}
      <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />

      {/* Error banner */}
      {state?.error && (
        <div className={styles.errorBanner} role="alert">
          <ErrorIcon /> {state.error}
        </div>
      )}

      <div className={styles.grid}>

        {/* ── Left: team details ──────────────────── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Team Details</h2>

          {/* Name */}
          <Field label="Team Name" htmlFor="t-name" required>
            <input
              id="t-name"
              name="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={styles.input}
              placeholder="e.g. Kimana All Stars"
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
                Used in URLs — <strong className={styles.slugPreview}>{slug || '…'}</strong>
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
              placeholder="kimana-all-stars"
              required
              disabled={isPending}
            />
          </Field>

          {/* Logo */}
          <Field
            label="Team Logo"
            htmlFor="t-logo"
            hint="Cloudinary public ID — upload via Cloudinary dashboard first"
          >
            <input
              id="t-logo"
              name="logo_public_id"
              type="text"
              value={logoId}
              onChange={e => setLogoId(e.target.value)}
              className={styles.input}
              placeholder="arenabase/teams/kimana-all-stars"
              disabled={isPending}
            />

            {/* Logo preview */}
            <div className={styles.logoPreview}>
              {logoPreviewUrl && !logoError ? (
                <img
                  src={logoPreviewUrl}
                  alt="Logo preview"
                  className={styles.logoImg}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className={styles.logoPlaceholder}>
                  <ImageIcon />
                  <span>{logoId.trim() && logoError ? 'Image not found' : 'No logo set'}</span>
                </div>
              )}
            </div>
          </Field>
        </div>

        {/* ── Right: status + submit ───────────────── */}
        <div className={styles.metaCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Status</h2>

            <div className={styles.field}>
              <span className={styles.label}>Active in system</span>

              <div className={styles.statusToggle} role="group" aria-label="Team active status">
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${isActive ? styles.toggleActive : ''}`}
                  onClick={() => setIsActive(true)}
                  aria-pressed={isActive}
                  disabled={isPending}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!isActive ? styles.toggleInactive : ''}`}
                  onClick={() => setIsActive(false)}
                  aria-pressed={!isActive}
                  disabled={isPending}
                >
                  Inactive
                </button>
              </div>

              <p className={styles.statusDesc}>
                {isActive
                  ? 'Appears in fixture creation and public listings.'
                  : 'Hidden from fixture selectors and public team lists.'}
              </p>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? (
              <><SpinnerIcon /> Saving…</>
            ) : (
              isEdit ? 'Save Changes' : 'Add Team'
            )}
          </button>
        </div>

      </div>
    </form>
  )
}
