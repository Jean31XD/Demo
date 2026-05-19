import React from 'react';

/**
 * Spinner de pantalla completa para Suspense boundaries.
 * Se muestra mientras React carga un chunk lazy por primera vez.
 */
const PageLoader: React.FC = () => (
  <div
    className="flex min-h-screen items-center justify-center"
    role="status"
    aria-label="Cargando página"
  >
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
  </div>
);

export default PageLoader;
