import Image from 'next/image';
import { img } from '@/lib/cloudinary';
import { getTeamInitials, getTeamColorIndex } from '@/lib/utils';
import styles from './TeamLogo.module.css';

/* 12 distinct muted colours — one assigned per team via name hash */
const FALLBACK_COLORS = [
  '#C0392B','#E67E22','#F1C40F','#27AE60',
  '#16A085','#2980B9','#8E44AD','#C0392B',
  '#D35400','#1ABC9C','#2C3E50','#7F8C8D',
];

/**
 * TeamLogo
 *
 * Props:
 *   team    – { name, logo_public_id }
 *   size    – pixel size for the square (default 48)
 *   className – extra class forwarded to the wrapper
 */
export default function TeamLogo({ team, size = 48, className = '' }) {
  if (!team) {
    return (
      <span
        className={`${styles.logo} ${styles.placeholder} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.33 }}
        aria-hidden="true"
      >
        ?
      </span>
    );
  }

  if (team.logo_public_id) {
    return (
      <span
        className={`${styles.logo} ${styles.image} ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={img.teamLogo(team.logo_public_id)}
          alt={team.name}
          width={size}
          height={size}
          unoptimized
          className={styles.img}
        />
      </span>
    );
  }

  /* Initials fallback */
  const initials    = getTeamInitials(team.name);
  const colorIndex  = getTeamColorIndex(team.name);
  const bgColor     = FALLBACK_COLORS[colorIndex];

  return (
    <span
      className={`${styles.logo} ${styles.initials} ${className}`}
      style={{
        width:      size,
        height:     size,
        fontSize:   Math.max(size * 0.3, 10),
        background: bgColor,
      }}
      aria-label={team.name}
      title={team.name}
    >
      {initials}
    </span>
  );
}
