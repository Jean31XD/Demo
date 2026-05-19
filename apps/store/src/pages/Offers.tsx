import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '@/features/catalog/components/ProductList';

const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

const OFFER_CATS = [
  { name: 'Herramientas eléctricas', to: '/catalogo/herramientas-electricas', discount: 'hasta 25%' },
  { name: 'Manuales',                to: '/catalogo/herramientas-manuales',    discount: 'hasta 20%' },
  { name: 'Seguridad industrial',    to: '/catalogo/seguridad-industrial',     discount: 'hasta 30%' },
  { name: 'Fijaciones',              to: '/catalogo/fijaciones-tornilleria',   discount: 'hasta 15%' },
];

const Offers: React.FC = () => (
  <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'slideUp .3s ease' }}>
    <nav className="crumbs" style={{ marginBottom: 24 }}>
      <Link to="/">Inicio</Link><span>/</span>
      <span style={{ color: 'var(--ink)' }}>Ofertas</span>
    </nav>

    {/* Hero banner */}
    <div style={{
      background: 'var(--accent)', borderRadius: 'var(--r-md)',
      padding: '36px 40px', marginBottom: 32,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
      flexWrap: 'wrap',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <IconTag /> OFERTAS ACTIVAS DE LA SEMANA
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
          Hasta 30% de descuento
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)' }}>
          Herramientas y materiales con precio especial. Solo esta semana.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.8)' }}>
        <IconClock />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Termina en 5 días</span>
      </div>
    </div>

    {/* Category shortcuts */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 32 }}>
      {OFFER_CATS.map((cat) => (
        <Link
          key={cat.to} to={cat.to}
          style={{
            padding: '14px 16px', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', background: 'var(--bg-card)',
            textDecoration: 'none', transition: 'border-color .15s, background .15s',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.background = 'var(--accent-soft)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{cat.name}</p>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--accent)', fontWeight: 600,
          }}>
            {cat.discount}
          </span>
        </Link>
      ))}
    </div>

    {/* Product grid — show products with compareAtPrice */}
    <div className="section-head" style={{ marginBottom: 20 }}>
      <div>
        <div className="eyebrow">PRODUCTOS EN OFERTA</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Con descuento activo
        </h2>
      </div>
    </div>

    <ProductList
      filters={{ inStock: true }}
      pageSize={12}
    />
  </div>
);

export default Offers;
