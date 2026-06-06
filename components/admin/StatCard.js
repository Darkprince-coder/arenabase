import Link from 'next/link'
import styles from './StatCard.module.css'

/**
 * StatCard
 *
 * Props:
 *   label   – metric description e.g. "Upcoming Fixtures"
 *   value   – numeric value
 *   href    – if provided, the whole card is a clickable Link
 *   icon    – inline SVG node
 *   accent  – 'green' | 'yellow' | 'blue' | 'orange'  (default 'green')
 *   note    – optional small label below the value e.g. "(3 pending)"
 */
export default function StatCard({
  label,
  value,
  href,
  icon,
  accent = 'green',
  note,
}) {
  const inner = (
    <div className={`${styles.card} ${styles[accent]}`}>
      {/* Icon */}
      <div className={styles.iconWrap} aria-hidden="true">
        {icon}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <span className={styles.value}>{value.toLocaleString()}</span>
        <span className={styles.label}>{label}</span>
        {note && <span className={styles.note}>{note}</span>}
      </div>

      {/* Arrow hint on hover */}
      {href && (
        <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={styles.linkWrap} aria-label={`${label}: ${value}`}>
        {inner}
      </Link>
    )
  }

  return inner
}
