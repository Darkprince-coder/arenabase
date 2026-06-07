import Link from 'next/link'
import styles from './AdminFormLayout.module.css'

/**
 * AdminFormLayout
 *
 * Standard wrapper used by every admin create/edit page.
 * Provides a consistent page header with back navigation,
 * then renders children (the form itself).
 *
 * Props:
 *   title      – page title  e.g. "New Tournament"
 *   subtitle   – optional descriptor below the title
 *   backHref   – href for the ← back link
 *   backLabel  – back link text (default: "Back")
 *   children   – form content
 */
export default function AdminFormLayout({
  title,
  subtitle,
  backHref,
  backLabel = 'Back',
  children,
}) {
  return (
    <div className={styles.layout}>
      {/* ── Page header ───────────────────────── */}
      <div className={styles.header}>
        {backHref && (
          <Link href={backHref} className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            {backLabel}
          </Link>
        )}

        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* ── Form area ─────────────────────────── */}
      <div className={styles.body}>
        {children}
      </div>
    </div>
  )
}
