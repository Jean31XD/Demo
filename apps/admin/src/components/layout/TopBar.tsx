import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, Menu } from 'lucide-react';

const TITLES: Record<string, { label: string; desc: string }> = {
  '/':          { label: 'Dashboard',  desc: 'Resumen operativo' },
  '/products':  { label: 'Productos',  desc: 'Catálogo e inventario' },
  '/orders':    { label: 'Órdenes',    desc: 'Gestión de pedidos' },
  '/customers': { label: 'Clientes',   desc: 'Directorio de compradores' },
};

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = memo(({ onToggleSidebar }) => {
  const { pathname } = useLocation();
  const page = TITLES[pathname] ?? { label: 'Admin', desc: '' };
  const now = new Date().toLocaleDateString('es-MX', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-3.5 flex-shrink-0"
      style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md border-none bg-transparent cursor-pointer flex items-center justify-center mr-1"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1
            className="font-black uppercase leading-none"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: 'var(--ink)',
              fontSize: '1.15rem',
              letterSpacing: '0.04em',
            }}
          >
            {page.label}
          </h1>
          <p className="mono-tag mt-0.5" style={{ fontSize: '0.625rem' }}>{page.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="mono-tag hidden sm:block">{now}</span>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1"
          style={{
            background: 'var(--ok-pale)',
            border: '1px solid var(--ok-border)',
          }}
        >
          <Activity size={11} strokeWidth={2} style={{ color: 'var(--ok)' }} />
          <span className="mono-tag" style={{ color: 'var(--ok)' }}>API :4000</span>
        </div>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
