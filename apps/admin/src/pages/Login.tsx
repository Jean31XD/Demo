import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

const Login: React.FC = () => (
  <div
    className="flex min-h-screen items-center justify-center"
    style={{ background: 'var(--bg)' }}
  >
    {/* Subtle grid */}
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.4,
      }}
    />

    <div className="relative w-full max-w-sm px-4 fade-in">
      {/* Card */}
      <div
        className="overflow-hidden"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Red top bar */}
        <div style={{ height: 4, background: 'var(--red)' }} />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="inline-flex h-12 w-12 items-center justify-center font-black text-sm mb-5"
              style={{
                background: 'var(--red)',
                color: '#fff',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1rem',
              }}
            >
              FI
            </div>
            <p
              className="font-black uppercase leading-none mb-1"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                color: 'var(--ink)',
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
              }}
            >
              Panel de Control
            </p>
            <p className="mono-tag">Sistema de gestión interno</p>
          </div>

          <LoginForm />
        </div>
      </div>

      <p className="mt-4 text-center mono-tag">
        Acceso restringido · Solo personal autorizado
      </p>
    </div>
  </div>
);

export default Login;
