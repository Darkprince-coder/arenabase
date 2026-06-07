/**
 * app/announcements/loading.js
 *
 * Shown by Next.js while the announcements page server component fetches data.
 */

export default function AnnouncementsLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        paddingBlock: 'var(--sp-12) var(--sp-10)',
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div className="skeleton" style={{ height: 64, width: 300, borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: 18, width: 380, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>

      {/* Body skeleton */}
      <div style={{ paddingTop: 'var(--sp-2)', paddingBottom: 'var(--sp-16)' }} className="container">
        {/* Filter */}
        <div style={{
          paddingBlock: 'var(--sp-6) var(--sp-5)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--sp-8)',
        }}>
          <div className="skeleton" style={{ height: 40, width: 200, borderRadius: 'var(--radius-md)' }} />
        </div>

        {/* Card skeletons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: 130,
                borderRadius: 'var(--radius-lg)',
                opacity: 1 - i * 0.12,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
