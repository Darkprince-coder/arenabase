'use client'

import { useState, useActionState } from 'react'
import styles from './FixtureForm.module.css'

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

function SpinnerIcon() { return <span className={styles.spinner} aria-hidden="true" /> }

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

/* ── Status options ─────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: 'scheduled',  label: 'Scheduled' },
  { value: 'live',       label: 'Live' },
  { value: 'completed',  label: 'Completed' },
  { value: 'postponed',  label: 'Postponed' },
  { value: 'cancelled',  label: 'Cancelled' },
]

/* ── Round suggestions ──────────────────────────────── */
const ROUND_SUGGESTIONS = [
  'Group Stage',
  'Round of 16',
  'Quarter Finals',
  'Semi Finals',
  '3rd Place Play-off',
  'Final',
]

/* ── Helpers ────────────────────────────────────────── */

/**
 * Converts a UTC ISO timestamp from Supabase into the
 * "YYYY-MM-DDTHH:mm" string expected by datetime-local inputs.
 * Shifts from UTC to EAT (UTC+3) so the displayed time is correct.
 */
function toDatetimeLocal(utcIso) {
  if (!utcIso) return ''
  const utcMs = new Date(utcIso).getTime()
  const eatMs = utcMs + 3 * 60 * 60 * 1000   // shift to UTC+3
  return new Date(eatMs).toISOString().slice(0, 16)
}

/* ── Field wrapper ──────────────────────────────────── */
function Field({ label, htmlFor, required, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-label="required">*</span>}
      </label>
      {children}
    </div>
  )
}

/* ── Select wrapper ─────────────────────────────────── */
function Select({ id, name, value, onChange, children, required, disabled }) {
  return (
    <div className={styles.selectWrapper}>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.select}
        required={required}
        disabled={disabled}
      >
        {children}
      </select>
      <ChevronIcon />
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   FixtureForm
   ══════════════════════════════════════════════════════

   Props:
     action       – server action (createFixture or bound updateFixture)
     initialData  – existing fixture row (for edit mode)
     tournaments  – [{ id, name }]
     teams        – [{ id, name }]  (active teams only)
     venues       – [{ id, name }]
*/
export default function FixtureForm({
  action,
  initialData   = null,
  tournaments   = [],
  teams         = [],
  venues        = [],
}) {
  const [state, formAction, isPending] = useActionState(action, null)

  /* ── Linked team selects ──────────────────────────── */
  const [homeTeamId, setHomeTeamId] = useState(initialData?.home_team_id ?? '')
  const [awayTeamId, setAwayTeamId] = useState(initialData?.away_team_id ?? '')

  function handleHomeChange(e) {
    const val = e.target.value
    setHomeTeamId(val)
    if (val && val === awayTeamId) setAwayTeamId('')
  }

  function handleAwayChange(e) {
    const val = e.target.value
    setAwayTeamId(val)
    if (val && val === homeTeamId) setHomeTeamId('')
  }

  /* ── Kickoff time (pre-filled in EAT for edit mode) ─ */
  const defaultKickoff = toDatetimeLocal(initialData?.kickoff_time)

  const isEdit = Boolean(initialData)

  return (
    <form action={formAction} className={styles.form} noValidate>

      {/* ── Error banner ─────────────────────────────── */}
      {state?.error && (
        <div className={styles.errorBanner} role="alert">
          <ErrorIcon />
          {state.error}
        </div>
      )}

      <div className={styles.grid}>

        {/* ════════════════════════════════════
            LEFT — match details
            ════════════════════════════════════ */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Match Details</h2>

            {/* Tournament */}
            <Field label="Tournament" htmlFor="f-tournament" required>
              <Select
                id="f-tournament"
                name="tournament_id"
                value={initialData?.tournament_id ?? ''}
                required
                disabled={isPending}
              >
                <option value="">— Select tournament —</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Select>
            </Field>

            {/* Home team */}
            <Field label="Home Team" htmlFor="f-home" required>
              <Select
                id="f-home"
                name="home_team_id"
                value={homeTeamId}
                onChange={handleHomeChange}
                required
                disabled={isPending}
              >
                <option value="">— Select home team —</option>
                {teams
                  .filter(t => !awayTeamId || t.id !== awayTeamId)
                  .map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
              </Select>
            </Field>

            {/* Away team */}
            <Field label="Away Team" htmlFor="f-away" required>
              <Select
                id="f-away"
                name="away_team_id"
                value={awayTeamId}
                onChange={handleAwayChange}
                required
                disabled={isPending}
              >
                <option value="">— Select away team —</option>
                {teams
                  .filter(t => !homeTeamId || t.id !== homeTeamId)
                  .map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
              </Select>
            </Field>

            {/* Venue */}
            <Field label="Venue" htmlFor="f-venue">
              <Select
                id="f-venue"
                name="venue_id"
                value={initialData?.venue_id ?? ''}
                disabled={isPending}
              >
                <option value="">— No venue set —</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </Select>
            </Field>
          </div>
        </div>

        {/* ════════════════════════════════════
            RIGHT — schedule & settings
            ════════════════════════════════════ */}
        <div className={styles.metaCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Schedule &amp; Status</h2>

            {/* Kickoff date + time */}
            <Field label="Kickoff Date &amp; Time (EAT)" htmlFor="f-kickoff" required>
              <input
                id="f-kickoff"
                name="kickoff_time"
                type="datetime-local"
                className={styles.input}
                defaultValue={defaultKickoff}
                required
                disabled={isPending}
              />
              <p className={styles.fieldNote}>
                Times are in East Africa Time (UTC+3).
              </p>
            </Field>

            {/* Round */}
            <Field label="Round / Stage" htmlFor="f-round">
              <input
                id="f-round"
                name="round"
                type="text"
                list="round-suggestions"
                className={styles.input}
                placeholder="e.g. Quarter Finals"
                defaultValue={initialData?.round ?? ''}
                disabled={isPending}
              />
              <datalist id="round-suggestions">
                {ROUND_SUGGESTIONS.map(r => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </Field>

            {/* Status */}
            <Field label="Status" htmlFor="f-status" required>
              <Select
                id="f-status"
                name="status"
                value={initialData?.status ?? 'scheduled'}
                required
                disabled={isPending}
              >
                {STATUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isPending}
          >
            {isPending ? (
              <><SpinnerIcon /> Saving…</>
            ) : (
              isEdit ? 'Save Changes' : 'Schedule Fixture'
            )}
          </button>
        </div>

      </div>
    </form>
  )
}
