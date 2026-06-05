/**
 * app/fixtures/loading.js
 *
 * Next.js automatically shows this while the fixtures page server component
 * is fetching new data (e.g. when the user changes a filter).
 * Uses the global .skeleton shimmer class from globals.css.
 */

import styles from './page.module.css'; // reuse page spacing

export default function FixturesLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        paddingBlock: 'var(--sp-12) var(--sp-10)',
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div className="skeleton" style={{ height: 64, width: 240, borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: 18, width: 320, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>

      {/* Body skeleton */}
      <div className={`${styles.body} container`}>
        {/* Filter area */}
        <div style={{ paddingBlock: 'var(--sp-6) var(--sp-5)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--sp-8)' }}>
          <div className="skeleton" style={{ height: 40, width: 200, borderRadius: 'var(--radius-md)', marginBottom: 'var(--sp-5)' }} />
          <div className="skeleton" style={{ height: 36, width: 380, maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>

        {/* Row skeletons */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: 72,
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--sp-2)',
              opacity: 1 - i * 0.12,
            }}
          />
        ))}
      </div>
    </>
  );
}
