import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-5 py-32 text-center">
    <span
      className="font-display font-black"
      style={{ fontSize: '6rem', color: 'var(--border)', lineHeight: 1 }}
    >
      404
    </span>
    <div className="amber-rule" style={{ width: '40px', margin: '0 auto' }} />
    <p
      className="font-display font-bold uppercase tracking-widest"
      style={{ color: 'var(--muted)', fontSize: '0.875rem' }}
    >
      Pagina no encontrada
    </p>
    <Link to="/" className="btn-primary px-8 py-3 mt-2">
      ← Ir al dashboard
    </Link>
  </div>
);

export default NotFound;
