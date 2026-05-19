import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/graphql/queries/catalog.queries';
import type { ProductsResult } from '@/types';

const BRANDS = [
  { id: 'kraft',    name: 'KRAFT',    tag: 'Herramientas eléctricas',      origin: 'Alemania', since: 1947, pro: true,  color: '#1A1A2E', blurb: 'Precisión alemana en sierras y herramientas de corte. Estándar industrial.' },
  { id: 'voltra',   name: 'VOLTRA',   tag: 'Inalámbricas profesionales',    origin: 'Japón',    since: 1962, pro: true,  color: '#DC2B31', blurb: 'Plataforma de batería de 18V/40V con más de 60 herramientas compatibles.' },
  { id: 'ironhaus', name: 'IRONHAUS', tag: 'Rotomartillos & demolición',    origin: 'EE.UU.',   since: 1924, pro: true,  color: '#2E3293', blurb: 'Especialistas en herramientas para obra pesada y demolición.' },
  { id: 'strike',   name: 'STRIKE',   tag: 'Herramientas manuales',         origin: 'México',   since: 1985, pro: false, color: '#0A0A0A', blurb: 'Martillos y destornilladores forjados en Monterrey. Calidad nacional.' },
  { id: 'proforge', name: 'PROFORGE', tag: 'Llaves & juegos profesionales',  origin: 'Taiwán',   since: 1972, pro: true,  color: '#5C3D11', blurb: 'Cromo-vanadio para uso diario en taller, certificación DIN.' },
  { id: 'armor',    name: 'ARMOR',    tag: 'Equipo de protección',          origin: 'EE.UU.',   since: 1968, pro: false, color: '#0E4D2E', blurb: 'EPP certificado ANSI/CE para industria pesada y construcción.' },
  { id: 'norde',    name: 'NORDE',    tag: 'Tubería & fijación',            origin: 'México',   since: 1994, pro: false, color: '#1B4F72', blurb: 'PVC sanitario e hidráulico, conexiones y fijadores a granel.' },
  { id: 'axis',     name: 'AXIS',     tag: 'Anclajes & válvulas',           origin: 'Italia',   since: 1958, pro: true,  color: '#2C2C2C', blurb: 'Anclas químicas, válvulas de latón y conexiones de alta presión.' },
];

const STATS = [
  { label: 'MARCAS',       value: '42'    },
  { label: 'PAÍSES',       value: '14'    },
  { label: 'SKUs',         value: '1,803' },
  { label: 'CERTIFICADAS', value: '100%'  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

/* ── Icons ──────────────────────────────────────────────────────────────────── */
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IconBadge = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

/* ── BrandCard ──────────────────────────────────────────────────────────────── */
interface BrandCardProps {
  brand: typeof BRANDS[0];
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand: b, isOpen, onToggle }) => {
  const [fetchProducts, { data, loading }] = useLazyQuery<ProductsResult>(GET_PRODUCTS, {
    fetchPolicy: 'cache-first',
  });

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      fetchProducts({ variables: { filters: { brand: b.id }, page: 1, pageSize: 4 } });
    }
    onToggle(b.id);
  }, [isOpen, b.id, fetchProducts, onToggle]);

  const products = data?.products.items ?? [];

  return (
    <div style={{
      background: 'var(--bg-card)',
      outline: isOpen ? '2px solid var(--accent)' : 'none',
      outlineOffset: -1,
      transition: 'background .15s',
    }}>
      {/* Card header — clickable */}
      <button
        onClick={handleToggle}
        style={{
          width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12,
          padding: 24, background: 'transparent', cursor: 'pointer',
          transition: 'background .15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        {/* Logo */}
        <div style={{
          width: '100%', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: b.color, borderRadius: 'var(--r-xs)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            {b.name}
          </span>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{b.name}</p>
            {b.pro && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '1px 6px', borderRadius: 99,
                background: 'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                color: 'var(--accent-2)', fontSize: 9.5, fontWeight: 600,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
              }}>
                <IconBadge /> PRO
              </span>
            )}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.04em', marginBottom: 8 }}>
            {b.tag.toUpperCase()}
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 10 }}>{b.blurb}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.04em' }}>
              {b.origin} · desde {b.since}
            </span>
            <IconChevron open={isOpen} />
          </div>
        </div>
      </button>

      {/* Expanded product panel */}
      {isOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px 20px' }}>
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ height: 120, borderRadius: 'var(--r-sm)', background: 'var(--bg-soft)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', padding: '16px 0' }}>
              Sin productos disponibles
            </p>
          )}

          {!loading && products.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
              {products.slice(0, 4).map(p => (
                <Link
                  key={p.id}
                  to={`/catalogo/${p.slug}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  {/* Product image */}
                  <div style={{
                    width: '100%', aspectRatio: '1', borderRadius: 'var(--r-xs)',
                    overflow: 'hidden', background: 'var(--bg-soft)',
                  }}>
                    {p.images[0] ? (
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .2s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: b.color, opacity: 0.15 }} />
                    )}
                  </div>
                  {/* Product info */}
                  <div>
                    {p.sku && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-4)', letterSpacing: '0.04em', marginBottom: 2 }}>
                        {p.sku}
                      </div>
                    )}
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 2 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      {fmt(p.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            to={`/catalogo?marca=${b.id}`}
            className="link-cta"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}
          >
            Ver catálogo completo <IconArrow />
          </Link>
        </div>
      )}
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────────────────────────── */
const Brands: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId(prev => prev === id ? null : id);
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'slideUp .3s ease' }}>
      <nav className="crumbs" style={{ marginBottom: 24 }}>
        <Link to="/">Inicio</Link><span>/</span>
        <span style={{ color: 'var(--ink)' }}>Marcas</span>
      </nav>

      {/* Header + Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow">DIRECTORIO · 42 MARCAS</div>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 8 }}>
            Las marcas que respaldan tu obra
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: '52ch' }}>
            Trabajamos solo con marcas verificadas, con garantía directa de fabricante y soporte técnico en español.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
          {STATS.map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 2 }}>
                {label}
              </div>
              <strong style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                {value}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Brand grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 1, background: 'var(--border)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
        overflow: 'hidden', marginBottom: 48,
      }}>
        {BRANDS.map((b) => (
          <BrandCard
            key={b.id}
            brand={b}
            isOpen={openId === b.id}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: 'var(--bg-deep)', borderRadius: 'var(--r-md)',
        padding: '40px 48px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 40,
      }}>
        <div>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)' }}>CATÁLOGO EXTENDIDO</p>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', marginBottom: 8 }}>
            ¿Buscas una marca específica?
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', maxWidth: '42ch' }}>
            Tenemos 34 marcas adicionales en bodega. Pídela en cotización y la conseguimos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="mailto:ventas@ferreteriai.com" className="btn btn--ghost" style={{ color: 'rgba(255,255,255,.7)', borderColor: 'rgba(255,255,255,.2)' }}>
            Contactar ventas
          </a>
          <Link to="/catalogo" className="btn btn--primary">
            Ver catálogo <IconArrow />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>
    </div>
  );
};

export default Brands;
