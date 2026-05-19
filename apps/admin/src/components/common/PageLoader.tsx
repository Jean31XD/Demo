import React from 'react';

const PageLoader: React.FC = () => (
  <div
    className="flex min-h-screen items-center justify-center flex-col gap-4"
    style={{ background: 'var(--cmd)' }}
    role="status"
    aria-label="Cargando"
  >
    <div
      className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
      style={{ borderColor: 'var(--border)', borderTopColor: 'var(--amber)' }}
    />
    <p className="mono-tag" style={{ color: 'var(--muted)' }}>Cargando sistema...</p>
  </div>
);

export default PageLoader;
