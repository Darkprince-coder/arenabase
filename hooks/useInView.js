import { useEffect, useRef, useState } from 'react';

/**
 * useInView
 *
 * Returns [ref, isVisible]. Attach ref to any DOM element;
 * isVisible flips to true once the element enters the viewport
 * and stays true (fires once — no re-hiding on scroll out).
 *
 * @param {number} threshold  – 0–1, how much of element must be visible (default 0.12)
 * @param {string} rootMargin – CSS margin to expand/shrink the viewport (default '0px')
 */
export default function useInView(threshold = 0.12, rootMargin = '0px') {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // animate once only
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}
