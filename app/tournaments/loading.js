export default function TournamentsLoading() {
  return (
    <>
      <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingBlock: 'var(--sp-12) var(--sp-10)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div className="skeleton" style={{ height: 64, width: 280, borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: 18, width: 380, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>
      <div style={{ paddingTop: 'var(--sp-2)', paddingBottom: 'var(--sp-16)' }} className="container">
        <div style={{ paddingBlock: 'var(--sp-6) var(--sp-5)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--sp-8)' }}>
          <div className="skeleton" style={{ height: 36, width: 340, maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '16 / 9', borderRadius: 'var(--radius-xl)', opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      </div>
    </>
  );
}
