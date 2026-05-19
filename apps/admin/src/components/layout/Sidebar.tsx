import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut, X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { client } from '@/graphql/client';

const NAV = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products',  label: 'Productos',  icon: Package         },
  { to: '/orders',    label: 'Órdenes',    icon: ShoppingBag     },
  { to: '/customers', label: 'Clientes',   icon: Users           },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    await client.clearStore();
    navigate('/login', { replace: true });
  };

  const initials = (user?.name ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sidebarContent = (
    <aside
      className="flex h-full w-56 flex-col"
      style={{
        background: 'var(--bg-deep)',
        borderRight: 'none',
        boxShadow: '2px 0 20px rgba(13,27,62,0.15)',
        color: '#FFFFFF',
      }}
    >
      {/* Brand */}
      <div className="px-4 py-5 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 flex items-center justify-center font-black text-xs flex-shrink-0"
            style={{
              background: 'var(--grad-accent)',
              color: '#fff',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.85rem',
              borderRadius: 'var(--r-xs)',
              boxShadow: 'var(--shadow-red)',
            }}
          >
            LT
          </div>
          <div>
            <p
              className="font-black uppercase leading-none"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: '#FFFFFF',
                fontSize: '1rem',
                letterSpacing: '0.05em',
              }}
            >
              La Tremenda
            </p>
            <p className="mono-tag" style={{ letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>Panel de control</p>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 text-white hover:text-red-400 border-none bg-transparent cursor-pointer flex items-center"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Navegación principal">
        <p className="section-label px-3 mb-3">Módulos</p>
        <ul className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <Icon size={16} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User strip */}
      <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          className="flex items-center gap-2.5 p-2.5 mb-2"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-sm)' }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center font-black text-xs"
            style={{
              background: 'var(--grad-accent)',
              color: '#fff',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.8rem',
              borderRadius: 'var(--r-pill)',
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-xs font-semibold leading-tight"
              style={{ color: '#fff', fontFamily: "'Poppins', sans-serif" }}
            >
              {user?.name ?? 'Admin'}
            </p>
            <p className="mono-tag truncate" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-white transition-colors hover:text-red-400"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-56 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile drawer sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" style={{ position: 'fixed', inset: 0 }}>
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 50
            }}
            onClick={onClose}
          />
          {/* Sidebar panel */}
          <div 
            className="relative flex h-full w-56 flex-col"
            style={{
              position: 'relative',
              height: '100%',
              width: '14rem',
              zIndex: 55,
              animation: 'slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) both'
            }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
