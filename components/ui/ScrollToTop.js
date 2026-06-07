'use client';

import { useEffect, useState } from 'react';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      className={`${styles.btn} ${visible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
    >
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}
