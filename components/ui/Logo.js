/**
 * ARENABASE Logo Component
 *
 * Renders the full brand mark:
 *   [Hex badge with A] + ARENA (white) BASE (green) .
 *
 * Uses inline SVG for the icon so it inherits the Anton font
 * and scales perfectly at all sizes.
 *
 * Props:
 *   size  – 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
 */

import styles from './Logo.module.css';

export default function Logo({ size = 'md', className = '' }) {
  return (
    <span
      className={`${styles.logo} ${styles[size]} ${className}`}
      role="img"
      aria-label="ARENABASE"
    >
      {/* ── Hexagonal badge mark ──────────────────────── */}
      <svg
        className={styles.mark}
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Outer hexagon – lime green badge */}
        <polygon
          points="27,2 50,15 50,39 27,52 4,39 4,15"
          fill="#B6FF00"
        />

        {/* Subtle inner shadow ring for depth */}
        <polygon
          points="27,5.5 47,16.75 47,37.25 27,48.5 7,37.25 7,16.75"
          fill="none"
          stroke="#0A0A0A"
          strokeWidth="1.2"
          opacity="0.12"
        />

        {/* Bold A letterform
            Apex: (27, 14)  |  Base-L: (15, 42)  |  Base-R: (39, 42)
            Crossbar at y = 30, intersecting each leg */}
        <path
          d="M15,42 L27,14 L39,42"
          stroke="#0A0A0A"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line
          x1="19.5"
          y1="30"
          x2="34.5"
          y2="30"
          stroke="#0A0A0A"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Two micro speed bars at the bottom – arena turf / motion mark */}
        <line
          x1="18"
          y1="45.5"
          x2="36"
          y2="45.5"
          stroke="#0A0A0A"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.25"
        />
        <line
          x1="21.5"
          y1="48.5"
          x2="32.5"
          y2="48.5"
          stroke="#0A0A0A"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.18"
        />
      </svg>

      {/* ── Wordmark ──────────────────────────────────── */}
      <span className={styles.wordmark}>
        <span className={styles.arena}>ARENA</span>
        <span className={styles.base}>BASE</span>
        <span className={styles.dot} aria-hidden="true">.</span>
      </span>
    </span>
  );
}
