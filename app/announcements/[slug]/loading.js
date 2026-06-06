/**
 * app/announcements/[slug]/loading.js
 *
 * Shown while the announcement detail server component fetches its data.
 */

export default function AnnouncementDetailLoading() {
  return (
    <>
      {/* ── Header skeleton ──────────────────────── */}
      <div style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        paddingBlock: 'var(--sp-10)',
      }}>
        <div className="container" style={{
          maxWidth: 760,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)',
        }}>
          {/* Breadcrumb */}
          <div className="skeleton" style={{ height: 16, width: 140, borderRadius: 'var(--radius-sm)' }} />
          {/* Tournament tag */}
          <div className="skeleton" style={{ height: 22, width: 120, borderRadius: 'var(--radius-full)' }} />
          {/* Title — two lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <div className="skeleton" style={{ height: 44, width: '85%', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ height: 44, width: '60%', borderRadius: 'var(--radius-md)' }} />
          </div>
          {/* Date */}
          <div className="skeleton" style={{ height: 14, width: 180, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>

      {/* ── Body skeleton ────────────────────────── */}
      <div className="container" style={{
        paddingTop: 'var(--sp-12)',
        paddingBottom: 'var(--sp-16)',
        maxWidth: 760,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-4)',
      }}>
        {[100, 95, 88, 92, 70].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 18, width: `${w}%`, borderRadius: 'var(--radius-sm)', opacity: 1 - i * 0.08 }}
          />
        ))}

        <div style={{ height: 'var(--sp-4)' }} />

        {[96, 90, 85, 55].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 18, width: `${w}%`, borderRadius: 'var(--radius-sm)', opacity: 0.8 - i * 0.1 }}
          />
        ))}
      </div>
    </>
  );
}
