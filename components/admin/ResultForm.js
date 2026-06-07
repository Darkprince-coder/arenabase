'use client'

import { useState, useActionState } from 'react'
import TeamLogo from '@/components/ui/TeamLogo'
import { formatMatchDate, formatKickoffTime } from '@/lib/utils'
import styles from './ResultForm.module.css'

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

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════
   ResultForm

   Props:
     action         – publishResult.bind(null, fixtureId)
     fixture        – full fixture row with nested teams, tournament, venue
     existingResult – result row if already published (for edit mode)
   ══════════════════════════════════════════════════════ */
export default function ResultForm({ action, fixture, existingResult = null }) {
  const [state, formAction, isPending] = useActionState(action, null)

  /* Controlled score state for live preview */
  const [homeScore, setHomeScore] = useState(
    existingResult != null ? String(existingResult.home_score) : ''
  )
  const [awayScore, setAwayScore] = useState(
    existingResult != null ? String(existingResult.away_score) : ''
  )

  const { home_team, away_team, tournament, venue, kickoff_time, round } = fixture

  /* ── Live outcome derivation ────────────────────── */
  const h         = Number(homeScore)
  const a         = Number(awayScore)
  const hasScores = homeScore !== '' && awayScore !== ''
  const homeWon   = hasScores && h > a
  const awayWon   = hasScores && a > h
  const isDraw    = hasScores && h === a

  const isEdit = Boolean(existingResult)

  return (
    <form action={formAction} className={styles.form} noValidate>

      {/* ── Error banner ─────────────────────────── */}
      {state?.error && (
        <div className={styles.errorBanner} role="alert">
          <ErrorIcon />
          {state.error}
        </div>
      )}

      {/* ── Match info strip ─────────────────────── */}
      <div className={styles.matchInfo}>
        {tournament?.name && (
          <span className={styles.infoChip}>{tournament.name}</span>
        )}
        {round && (
          <span className={styles.infoChip}>{round}</span>
        )}
        <span className={styles.infoDate}>
          {formatMatchDate(kickoff_time)} · {formatKickoffTime(kickoff_time)}
        </span>
        {venue?.name && (
          <span className={styles.infoVenue}>
            <PinIcon />{venue.name}
          </span>
        )}
      </div>

      {/* ════════════════════════════════════════════
          SCOREBOARD
          ════════════════════════════════════════════ */}
      <div className={styles.scoreboardCard}>
        <div className={styles.scoreboard}>

          {/* Home team */}
          <div className={`${styles.teamSide} ${homeWon ? styles.winner : awayWon ? styles.loser : ''}`}>
            <TeamLogo team={home_team} size={56} />
            <span className={styles.teamName}>{home_team?.name ?? '—'}</span>
            <span className={styles.teamLabel}>Home</span>
          </div>

          {/* Score inputs */}
          <div className={styles.scoreCenter}>
            <div className={styles.scoreRow}>
              <input
                name="home_score"
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                value={homeScore}
                onChange={e => setHomeScore(e.target.value)}
                className={`${styles.scoreInput} ${homeWon ? styles.scoreWin : awayWon ? styles.scoreLoss : hasScores ? styles.scoreDraw : ''}`}
                placeholder="0"
                required
                disabled={isPending}
                aria-label={`${home_team?.name ?? 'Home'} score`}
              />

              <span className={styles.scoreSep}>–</span>

              <input
                name="away_score"
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                value={awayScore}
                onChange={e => setAwayScore(e.target.value)}
                className={`${styles.scoreInput} ${awayWon ? styles.scoreWin : homeWon ? styles.scoreLoss : hasScores ? styles.scoreDraw : ''}`}
                placeholder="0"
                required
                disabled={isPending}
                aria-label={`${away_team?.name ?? 'Away'} score`}
              />
            </div>

            {/* FT label */}
            <span className={styles.ftLabel}>FULL TIME</span>
          </div>

          {/* Away team */}
          <div className={`${styles.teamSide} ${styles.teamSideRight} ${awayWon ? styles.winner : homeWon ? styles.loser : ''}`}>
            <TeamLogo team={away_team} size={56} />
            <span className={styles.teamName}>{away_team?.name ?? '—'}</span>
            <span className={styles.teamLabel}>Away</span>
          </div>

        </div>

        {/* ── Live result preview ─────────────────── */}
        <div className={styles.previewRow} aria-live="polite">
          {!hasScores && (
            <span className={styles.previewEmpty}>Enter scores above</span>
          )}
          {hasScores && isDraw && (
            <span className={styles.previewDraw}>
              Draw — {h} – {a}
            </span>
          )}
          {hasScores && !isDraw && (
            <span className={styles.previewWin}>
              <strong>{homeWon ? home_team?.name : away_team?.name}</strong>
              {' '}wins{' '}
              {homeWon ? h : a} – {homeWon ? a : h}
            </span>
          )}
        </div>
      </div>

      {/* ── Notes ───────────────────────────────── */}
      <div className={styles.notesCard}>
        <label htmlFor="r-notes" className={styles.notesLabel}>
          Additional Notes
          <span className={styles.notesHint}>
            Optional — e.g. &quot;Won on penalties (5‑4)&quot;, &quot;Abandoned after 70 mins&quot;
          </span>
        </label>
        <textarea
          id="r-notes"
          name="notes"
          className={styles.notesInput}
          rows={3}
          placeholder="Any additional context about this result…"
          defaultValue={existingResult?.notes ?? ''}
          disabled={isPending}
        />
      </div>

      {/* ── Submit ──────────────────────────────── */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isPending || !hasScores}
      >
        {isPending ? (
          <><SpinnerIcon /> Saving…</>
        ) : (
          isEdit ? 'Update Result' : 'Publish Result'
        )}
      </button>

    </form>
  )
}
