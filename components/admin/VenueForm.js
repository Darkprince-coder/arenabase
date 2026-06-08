'use client'

import { useActionState } from 'react'
import styles from './VenueForm.module.css'

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

/* ── Field ──────────────────────────────────────────── */
function Field({ label, htmlFor, required, hint, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   VenueForm

   Props:
     action      – createVenue or updateVenue.bind(null, id)
     initialData – existing venue row (edit mode)
   ══════════════════════════════════════════════════════ */
export default function VenueForm({ action, initialData = null }) {
  const [state, formAction, isPending] = useActionState(action, null)

  const isEdit = Boolean(initialData)

  return (
    <form action={formAction} className={styles.form} noValidate>

      {/* Error */}
      {state?.error && (
        <div className={styles.errorBanner} role="alert">
          <ErrorIcon /> {state.error}
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Venue Details</h2>

        {/* Name */}
        <Field label="Venue Name" htmlFor="v-name" required>
          <input
            id="v-name"
            name="name"
            type="text"
            className={styles.input}
            placeholder="e.g. CTK Ground"
            defaultValue={initialData?.name ?? ''}
            required
            disabled={isPending}
            autoFocus={!isEdit}
          />
        </Field>

        {/* Location */}
        <Field
          label="Location / Area"
          htmlFor="v-location"
          hint="Town or area where the ground is based"
        >
          <input
            id="v-location"
            name="location"
            type="text"
            className={styles.input}
            placeholder="e.g. Kimana, Loitoktok"
            defaultValue={initialData?.location ?? ''}
            disabled={isPending}
          />
        </Field>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? (
          <><SpinnerIcon /> Saving…</>
        ) : (
          isEdit ? 'Save Changes' : 'Add Venue'
        )}
      </button>
    </form>
  )
}
