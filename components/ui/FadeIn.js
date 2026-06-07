'use client';

import useInView from '@/hooks/useInView';
import styles from './FadeIn.module.css';

/**
 * FadeIn
 *
 * Wraps children with a scroll-triggered entrance animation.
 * Respects prefers-reduced-motion via CSS.
 *
 * Props:
 *   variant  – 'up' | 'left' | 'right' | 'scale'  (default 'up')
 *   delay    – animation-delay in ms                (default 0)
 *   duration – transition duration in ms            (default 550)
 *   className – forwarded to the wrapper div
 *   as       – HTML tag to render as                (default 'div')
 */
export default function FadeIn({
  children,
  variant   = 'up',
  delay     = 0,
  duration  = 550,
  className = '',
  as: Tag   = 'div',
}) {
  const [ref, visible] = useInView(0.12);

  return (
    <Tag
      ref={ref}
      className={`${styles.base} ${styles[variant]} ${visible ? styles.visible : ''} ${className}`}
      style={{
        transitionDuration:  `${duration}ms`,
        transitionDelay:     delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
