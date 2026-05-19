import React, { memo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import logoSrc from '@/assets/logo.png';

/* ── Minimal icon set matching the design ── */
const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.5 12h11l2.5-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
);
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18"/>
  </svg>
);
const IconTruck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
  </svg>
);
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z"/>
  </svg>
);
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
  </svg>
);

const NAV_LINKS = [
  { to: '/catalogo',  label: 'Catálogo'  },
  { to: '/marcas',    label: 'Marcas'    },
  { to: '/ofertas',   label: 'Ofertas', badge: true },
  { to: '/soporte',   label: 'Soporte'   },
];

const Header: React.FC = memo(() => {
  const { count, openCart } = useCartStore();
  const openSearch = useUIStore((s) => s.openSearch);
  const itemCount = count();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="hdr">
      <div className="hdr__inner">
        {/* Left: logo + nav */}
        <div className="hdr__left">
          <Link to="/" className="logo">
            <img src={logoSrc} alt="La Tremenda Ferretería & Hogar" style={{ height: 36, width: 'auto', display: 'block' }} />
          </Link>
          <nav className="hdr__nav">
            {NAV_LINKS.map(({ to, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/catalogo'}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {label}{badge && <span className="dot-accent" />}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: search + account + cart */}
        <div className="hdr__right">
          <button className="hdr__search" onClick={openSearch} aria-label="Buscar">
            <IconSearch />
            <span>Buscar productos, SKUs, marcas</span>
            <kbd>⌘K</kbd>
          </button>

          <Link to="/cuenta" className="hdr__btn" aria-label="Mi cuenta">
            <IconUser />
            <span className="hdr__btn-label">Cuenta</span>
          </Link>

          <button
            className="hdr__btn hdr__btn--cart"
            onClick={openCart}
            aria-label={`Carrito, ${itemCount} artículos`}
          >
            <IconCart />
            <span>Carrito</span>
            {itemCount > 0 && (
              <span className="hdr__count hdr__count--accent" key={itemCount}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            className="icon-btn"
            style={{ display: 'none' }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
            id="mobile-toggle"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Info strip */}
      <div className="hdr__strip">
        <div><IconTruck /> Envío gratis &gt; RD$2,000 · 24-48hrs</div>
        <div className="hdr__strip-dim">·</div>
        <div><IconShield /> Garantía directa de fabricante</div>
        <div className="hdr__strip-dim">·</div>
        <div><IconPhone /> Asesoría técnica: (809) 801-1234</div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          style={{
            padding: '8px 16px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {NAV_LINKS.map(({ to, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/catalogo'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
            >
              {label}{badge && <span className="dot-accent" style={{ marginLeft: 5 }} />}
            </NavLink>
          ))}
        </nav>
      )}

      <style>{`
        @media (max-width: 980px) {
          .hdr__nav { display: none !important; }
          .hdr__search { min-width: 0 !important; flex: 1; }
          .hdr__search span, .hdr__search kbd { display: none !important; }
          .hdr__btn-label { display: none !important; }
          .hdr__strip { display: none !important; }
          #mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
