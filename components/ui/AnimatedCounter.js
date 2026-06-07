'use client';

import { useEffect, useRef, useState } from 'react';
import useInView from '@/hooks/useInView';

/**
 * AnimatedCounter
 *
 * Counts from 0 to `target` with an ease-out curve when the element
 * enters the viewport. Respects prefers-reduced-motion.
 *
 * Props:
 *   target   – the final number to count to
 *   suffix   – string appended after the number, e.g. '+'
 *   duration – animation duration in ms (default 1400)
 */
export default function AnimatedCounter({ target, suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0);
  const [ref, visible]    = useInView(0.5);
  const animated          = useRef(false);

  useEffect(() => {
    if (!visible || animated.current) return;

    // Skip animation if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    animated.current = true;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out cubic: decelerates toward the target
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [visible, target, duration]);

  return (
    <span ref={ref} aria-label={`${target}${suffix}`} aria-live="polite">
      {count}{suffix}
    </span>
  );
}
