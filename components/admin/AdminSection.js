import Link from 'next/link'
import styles from './AdminSection.module.css'

/**
 * AdminSection — standard wrapper for admin list/management pages.
 *
 * Renders:
 *   - Page heading with count badge
 *   - Optional primary action button (e.g. "+ Add Fixture")
 *   - Children (the table / list content)
 *
 * Props:
 *   title       – page title e.g. "Fixtures"
 *   count       – optional row count shown in badge
 *   actionLabel – primary CTA text e.g. "+ New Fixture"
 *   actionHref  – href for primary CTA
 *   children    – page content (tables, cards, empty state)
 *   subtitle    – optional description below title
 */
export default function AdminSection({
  title,
  subtitle,
  count,
  actionLabel,
  actionHref,
  children,
}) {
  return (
    <div className={styles.section}>
      {/* ── Page header ─────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
            {count != null && (
              <span className={styles.countBadge}>{count}</span>
            )}
          </div>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>

        {actionLabel && actionHref && (
          <Link href={actionHref} className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {actionLabel}
          </Link>
        )}
      </div>

      {/* ── Page content ────────────────────────── */}
      <div className={styles.body}>
        {children}
      </div>
    </div>
  )
}

/* ── Table helpers ─────────────────────────────────── */

/**
 * AdminTable — a styled table wrapper for consistent admin data tables.
 */
export function AdminTable({ headers = [], children }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

/**
 * AdminTableRow — styled table row.
 */
export function AdminTableRow({ children, muted = false }) {
  return (
    <tr className={`${styles.tr} ${muted ? styles.trMuted : ''}`}>
      {children}
    </tr>
  )
}

/**
 * AdminTd — table data cell.
 */
export function AdminTd({ children, align = 'left', nowrap = false }) {
  return (
    <td
      className={`${styles.td} ${nowrap ? styles.tdNowrap : ''}`}
      style={{ textAlign: align }}
    >
      {children}
    </td>
  )
}

/**
 * AdminActions — right-aligned action link group in a table row.
 */
export function AdminActions({ children }) {
  return (
    <td className={`${styles.td} ${styles.tdActions}`}>
      <div className={styles.actionsRow}>{children}</div>
    </td>
  )
}

/**
 * AdminActionLink — small link inside AdminActions.
 */
export function AdminActionLink({ href, children, variant = 'default' }) {
  return (
    <Link href={href} className={`${styles.actionLink} ${styles[`actionLink_${variant}`]}`}>
      {children}
    </Link>
  )
}

/**
 * EmptyRow — shown when a table has no data.
 */
export function EmptyRow({ colSpan = 5, message = 'No records found.' }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.emptyRow}>
        {message}
      </td>
    </tr>
  )
}

/**
 * StatusBadge — coloured pill for status fields.
 */
export function StatusBadge({ status }) {
  const MAP = {
    scheduled:  { label: 'Scheduled',  cls: 'scheduled' },
    live:       { label: 'Live',        cls: 'live' },
    completed:  { label: 'Completed',  cls: 'completed' },
    postponed:  { label: 'Postponed',  cls: 'postponed' },
    cancelled:  { label: 'Cancelled',  cls: 'cancelled' },
    ongoing:    { label: 'Ongoing',    cls: 'ongoing' },
    upcoming:   { label: 'Upcoming',   cls: 'upcoming' },
    published:  { label: 'Published',  cls: 'published' },
    draft:      { label: 'Draft',      cls: 'draft' },
  }
  const entry = MAP[status] ?? { label: status, cls: 'default' }

  return (
    <span className={`${styles.badge} ${styles[`badge_${entry.cls}`]}`}>
      {entry.label}
    </span>
  )
}
