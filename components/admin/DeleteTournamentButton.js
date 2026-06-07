'use client'

import styles from './DeleteTournamentButton.module.css'

/**
 * Client component — handles the confirm dialog before deleting.
 * The Server Component can't hold the onSubmit handler directly.
 */
export default function DeleteTournamentButton({ action, tournamentName }) {
  return (
    <form
      action={action}
      onSubmit={e => {
        if (!confirm(`Delete "${tournamentName}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <button type="submit" className={styles.btn}>
        Delete Tournament
      </button>
    </form>
  )
}