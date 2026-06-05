'use client';

import { useState } from 'react';
import styles from './NewsletterBanner.module.css';

export default function NewsletterBanner() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    /* ── TODO (Session: Admin / Email) ──────────────────────────────────────
       Wire up to your email provider here (e.g. Mailchimp, Brevo, Resend).
       For now we simulate success after a short delay.
    ─────────────────────────────────────────────────────────────────────── */
    await new Promise(r => setTimeout(r, 800));
    setStatus('success');
    setEmail('');
  }

  return (
    <section className={styles.banner} aria-labelledby="newsletter-heading">
      <div className={`${styles.inner} container`}>
        {/* Left: copy */}
        <div className={styles.copy}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true" className={styles.icon}>
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <div>
            <h2 id="newsletter-heading" className={styles.heading}>
              Stay updated with the latest in local sports
            </h2>
            <p className={styles.sub}>
              Subscribe to get the latest fixtures, results and announcements.
            </p>
          </div>
        </div>

        {/* Right: form */}
        {status === 'success' ? (
          <p className={styles.successMsg}>
            ✓ You&apos;re subscribed! We&apos;ll keep you in the loop.
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubscribe} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={styles.input}
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className={styles.btn}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
