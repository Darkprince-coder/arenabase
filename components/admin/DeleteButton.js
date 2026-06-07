'use client'

import styles from './DeleteButton.module.css'

/**
 * DeleteButton — reusable client component for destructive actions.
 *
 * Wraps the server action in a <form> so it works without JS,
 * and adds a browser confirm() dialog on the client side.
 *
 * Props:
 *   action    – bound server action  e.g. deleteFixture.bind(null, id)
 *   itemName  – shown in the confirm prompt  e.g. "Kajiado Super Cup"
 *   label     – button text (default: "Delete")
 */
export default function DeleteButton({
  action,
  itemName,
  label = 'Delete',
}) {
  return (
    <form
      action={action}
      onSubmit={e => {
        if (!confirm(`Delete "${itemName}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <button type="submit" className={styles.btn}>
        {label}
      </button>
    </form>
  )
}
