import styles from './page.module.css';

export default function ResultsLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        paddingBlock: 'var(--sp-12) var(--sp-10)',
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div className="skeleton" style={{ height: 64, width: 200, borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: 18, width: 300, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>

      {/* Body skeleton */}
      <div className={`${styles.body} container`}>
        {/* Filter skeleton */}
        <div style={{
          paddingBlock: 'var(--sp-6) var(--sp-5)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--sp-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-5)',
        }}>
          <div className="skeleton" style={{ height: 40, width: 200, borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: 36, width: 340, maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>

        {/* Month label skeleton */}
        <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 'var(--radius-sm)', marginBottom: 'var(--sp-4)' }} />

        {/* Result row skeletons */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: 68,
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--sp-2)',
              opacity: 1 - i * 0.14,
            }}
          />
        ))}
      </div>
    </>
  );
}
