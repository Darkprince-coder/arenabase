export default function TournamentDetailLoading() {
  return (
    <>
      <div style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'flex-end', overflow: 'hidden', background: 'var(--color-bg-elevated)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-bg-primary) 0%, transparent 100%)', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 'var(--sp-10)', paddingTop: 'var(--sp-16)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 'var(--radius-sm)' }} />
            <div className="skeleton" style={{ height: 24, width: 70, borderRadius: 'var(--radius-sm)' }} />
          </div>
          <div className="skeleton" style={{ height: 72, width: 480, maxWidth: '90%', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: 18, width: 360, maxWidth: '85%', borderRadius: 'var(--radius-sm)' }} />
          <div style={{ display: 'flex', gap: 'var(--sp-6)', marginTop: 'var(--sp-2)' }}>
            <div className="skeleton" style={{ height: 18, width: 100, borderRadius: 'var(--radius-sm)' }} />
            <div className="skeleton" style={{ height: 18, width: 120, borderRadius: 'var(--radius-sm)' }} />
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingInline: 'var(--page-padding)', height: 53, display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        {['Fixtures','Results','Teams'].map(l => <div key={l} className="skeleton" style={{ height: 20, width: l.length * 8 + 12, borderRadius: 'var(--radius-sm)' }} />)}
      </div>
      <div className="container" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        <div className="skeleton" style={{ height: 14, width: 160, borderRadius: 'var(--radius-sm)', marginBottom: 'var(--sp-4)' }} />
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-lg)', opacity: 1 - i * 0.12 }} />)}
      </div>
    </>
  );
}
