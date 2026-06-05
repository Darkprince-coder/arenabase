import Link from 'next/link';
import styles from './SectionHeader.module.css';

/**
 * SectionHeader
 *
 * Props:
 *   title        – section heading text
 *   icon         – inline SVG node (optional)
 *   viewAllHref  – if provided, renders a "View all →" link
 *   viewAllLabel – custom link label (default "View all")
 *   as           – heading element, 'h2' (default) or 'h3'
 */
export default function SectionHeader({
  title,
  icon,
  viewAllHref,
  viewAllLabel = 'View all',
  as: Tag = 'h2',
}) {
  return (
    <div className={styles.header}>
      <Tag className={styles.title}>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        {title}
      </Tag>

      {viewAllHref && (
        <Link href={viewAllHref} className={styles.viewAll}>
          {viewAllLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  );
}
