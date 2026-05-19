import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '@/features/catalog/components/ProductList';

/* ── Icon primitives ── */
const I = ({ d, w = 20 }: { d: string; w?: number }) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IconArrow    = ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
const IconTruck    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
const IconShield   = () => <I d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z"/>;
const IconPackage  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10l9 4 9-4V7l-9-4zM3 7l9 4M21 7l-9 4M12 11v10"/></svg>;
const IconPhone    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;

/* WhatsApp SVG */
const IconWA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const IconIG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

/* ── Category art (geometric, not figurative) ── */
const CatArt: React.FC<{ id: string }> = ({ id }) => {
  const acc = 'var(--accent)';
  const ink = 'var(--ink)';
  switch (id) {
    case 'herramientas-electricas': return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <rect x="20" y="40" width="55" height="22" rx="3" fill={ink}/>
        <rect x="65" y="32" width="20" height="10" fill={acc}/>
        <rect x="28" y="62" width="18" height="20" rx="2" fill={ink}/>
        <circle cx="85" cy="51" r="3" fill="#fff"/>
      </svg>
    );
    case 'herramientas-manuales': return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <rect x="38" y="18" width="24" height="14" rx="2" fill={ink}/>
        <rect x="46" y="32" width="8" height="60" fill={ink}/>
        <rect x="40" y="32" width="20" height="10" fill={acc}/>
      </svg>
    );
    case 'fijaciones-tornilleria': return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <polygon points="35,18 65,18 70,28 50,90 30,28" fill={ink}/>
        <line x1="38" y1="38" x2="62" y2="38" stroke="#fff" strokeWidth="1.5"/>
        <line x1="40" y1="48" x2="60" y2="48" stroke="#fff" strokeWidth="1.5"/>
        <line x1="42" y1="58" x2="58" y2="58" stroke="#fff" strokeWidth="1.5"/>
        <rect x="30" y="14" width="40" height="6" fill={acc}/>
      </svg>
    );
    case 'materiales-construccion': return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <rect x="16" y="30" width="68" height="55" fill={ink}/>
        <line x1="16" y1="48" x2="84" y2="48" stroke="#fff" strokeOpacity=".25"/>
        <line x1="16" y1="66" x2="84" y2="66" stroke="#fff" strokeOpacity=".25"/>
        <line x1="38" y1="30" x2="38" y2="85" stroke="#fff" strokeOpacity=".25"/>
        <line x1="62" y1="30" x2="62" y2="85" stroke="#fff" strokeOpacity=".25"/>
        <rect x="16" y="30" width="22" height="18" fill={acc}/>
      </svg>
    );
    case 'plomeria': return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <circle cx="50" cy="50" r="30" fill={ink}/>
        <circle cx="50" cy="50" r="14" fill="#fff"/>
        <circle cx="50" cy="50" r="8" fill={acc}/>
        <rect x="6" y="46" width="14" height="8" fill={ink}/>
        <rect x="80" y="46" width="14" height="8" fill={ink}/>
      </svg>
    );
    case 'seguridad-industrial': return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <path d="M50 14 L78 26 L78 52 Q78 76 50 88 Q22 76 22 52 L22 26 Z" fill={ink}/>
        <path d="M50 28 L66 36 L66 52 Q66 68 50 76 Q34 68 34 52 L34 36 Z" fill={acc}/>
      </svg>
    );
    default: return (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <rect x="16" y="30" width="68" height="40" fill={ink}/>
        <rect x="16" y="30" width="20" height="20" fill={acc}/>
      </svg>
    );
  }
};

const U = (id: string) => `https://images.unsplash.com/photo-${id}?fm=jpg&q=70&w=800&auto=format&fit=crop`;
const P = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=800`;

const CATEGORIES = [
  { id: 'herramientas-electricas', name: 'Eléctricas',    blurb: 'Taladros, sierras, rotomartillos. Batería e inalámbricas.', count: 142, img: U('1567507145544-da3fe1b4f8f9') },
  { id: 'herramientas-manuales',   name: 'Manuales',      blurb: 'Martillos, llaves, destornilladores, escuadras.',            count: 318, img: U('1426927308491-6380b6a9936f') },
  { id: 'fijaciones-tornilleria',  name: 'Fijación',      blurb: 'Tornillos, anclas, tarugos, abrazaderas a granel.',          count: 904, img: P(5691641) },
  { id: 'materiales-construccion', name: 'Construcción',  blurb: 'Cemento, agregados, perfiles, láminas.',                     count: 256, img: U('1531834685032-c34bf0d84c77') },
  { id: 'plomeria',                name: 'Plomería',      blurb: 'Tuberías PVC/CPVC, conexiones, válvulas, llaves.',           count: 187, img: P(6444256) },
  { id: 'seguridad-industrial',    name: 'Seguridad',     blurb: 'EPP, cascos, guantes, gafas, arneses.',                      count: 96,  img: P(1216589) },
];

const VALUES = [
  { icon: <IconTruck />,   title: 'Entrega 24-48h',  body: 'Envío gratis en La Romana y zonas aledañas en compras > RD$2,000.' },
  { icon: <IconShield />,  title: 'Garantía real',    body: 'Garantía certificada por fabricante y cambio rápido de piezas.' },
  { icon: <IconPackage />, title: 'Crédito empresa',  body: 'Facilidades de pago a 30 días para ingenieros y constructoras.' },
  { icon: <IconPhone />,   title: 'Asesoría experta', body: 'Personal capacitado para recomendarte la herramienta ideal.' },
];

const BRANDS = ['EMTOP', 'DEWALT', 'MAKITA', 'STANLEY', 'MILWAUKEE', 'TRUPER', 'LUSTOQ', 'BOSCH'];

const Home: React.FC = () => (
  <div className="page" style={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0, maxWidth: '100%' }}>

    {/* ── HERO ───────────────────────────────────────────────── */}
    <section className="hero slide-up" style={{
      background: 'var(--grad-hero)',
      color: '#fff',
      padding: '80px 28px 140px',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '-28px'
    }}>
      {/* Pattern texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      {/* Ambient gradient glow */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(211,47,47,0.3) 0%, transparent 70%)',
        top: '-100px', right: '-100px', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1320, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 'var(--r-pill)', display: 'inline-flex' }}>
          <span className="eyebrow__dot" />
          Villa Hermosa · La Romana · Abierto 8:00 AM — 7:00 PM
        </div>
        <h1 className="hero__title" style={{ color: '#fff', marginTop: 24, fontSize: 'clamp(38px, 6vw, 68px)', lineHeight: 1.05 }}>
          El aliado de tu obra,<br />
          el soporte de tu hogar.<br />
          <span style={{
            background: 'linear-gradient(90deg, #FF8A80, #FF5252)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900
          }}>La Tremenda Ferretería.</span>
        </h1>
        <p className="hero__lead" style={{ color: 'rgba(245,247,251,0.8)', fontSize: 18, marginTop: 24, marginBottom: 36, maxWidth: 640 }}>
          Materiales de construcción, herramientas de las mejores marcas como EMTOP y todo lo necesario para tu proyecto de remodelación en un solo lugar.
        </p>
        <div className="hero__cta" style={{ display: 'flex', gap: 16 }}>
          <Link to="/catalogo" className="btn btn--accent btn--lg" style={{ boxShadow: 'var(--shadow-red)' }}>
            Ver catálogo <IconArrow size={16} />
          </Link>
          <a href="https://wa.me/18098011234" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg" style={{
            background: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#fff'
          }}>
            Cotizar por WhatsApp
          </a>
        </div>
        
        <dl className="hero__stats" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 56, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
          <div><dt style={{ color: 'rgba(255,255,255,0.5)' }}>SKUs activos</dt><dd style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>2,500+</dd></div>
          <div><dt style={{ color: 'rgba(255,255,255,0.5)' }}>Marcas Líderes</dt><dd style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>35+</dd></div>
          <div><dt style={{ color: 'rgba(255,255,255,0.5)' }}>Ubicación</dt><dd style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>La Romana</dd></div>
          <div><dt style={{ color: 'rgba(255,255,255,0.5)' }}>Soporte B2C/B2B</dt><dd style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>100%</dd></div>
        </dl>
      </div>

      {/* SVG Wave separator bottom */}
      <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(130% + 1.3px)', height: '80px' }} fill="var(--bg)">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </section>

    {/* Layout wrapper for non-hero content */}
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>

      {/* ── CATEGORÍAS ─────────────────────────────────────────── */}
      <section className="block">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>01 / CATEGORÍAS</div>
            <h2 className="section-head__title">Compra por departamento</h2>
          </div>
          <Link to="/catalogo" className="link-cta" style={{ color: 'var(--accent-2)' }}>
            Ver todo el catálogo <IconArrow size={14} />
          </Link>
        </div>
        <div className="cat-grid stagger">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.id}
              to={`/catalogo/${c.id}`}
              className="cat-card cat-card--photo"
            >
              <div className="cat-card__media">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="cat-card__overlay" />
                {/* Fallback art if image fails */}
                <div className="cat-card__art-fallback">
                  <CatArt id={c.id} />
                </div>
                <span className="cat-card__media-num mono mono--xs">0{i + 1}</span>
                <svg className="cat-card__media-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M9 7h8v8"/>
                </svg>
              </div>
              <div className="cat-card__foot">
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
                <span className="mono mono--xs mono--dim" style={{ color: '#FF8A80' }}>{c.count} productos →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS ────────────────────────────────────────── */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="values">
          {VALUES.map((v) => (
            <div className="values__item" key={v.title}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--accent-2-soft)', color: 'var(--accent-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 8
              }}>
                {v.icon}
              </div>
              <h4>{v.title}</h4>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTACADOS ─────────────────────────────────────────── */}
      <section className="block">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>02 / DESTACADOS</div>
            <h2 className="section-head__title">Productos Destacados</h2>
          </div>
          <Link to="/catalogo" className="link-cta" style={{ color: 'var(--accent-2)' }}>
            Ver más <IconArrow size={14} />
          </Link>
        </div>
        <ProductList filters={{ sort: 'price_desc', inStock: true }} pageSize={4} variant="preview" />
      </section>

      {/* ── BRAND STRIP ────────────────────────────────────────── */}
      <section className="block">
        <div className="brand-strip" style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-soft) 100%)',
          borderRadius: 'var(--r-xl)'
        }}>
          <span className="mono mono--xs mono--dim">MARCAS DE CONFIANZA</span>
          <div className="brand-strip__row" style={{ justifyContent: 'space-around' }}>
            {BRANDS.map((b) => (
              <span key={b} className="brand-strip__item" style={{
                fontSize: 18, color: 'var(--accent-2)', textShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUEVOS ─────────────────────────────────────────────── */}
      <section className="block">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>03 / NUEVOS</div>
            <h2 className="section-head__title">Recién llegados</h2>
          </div>
          <Link to="/catalogo" className="link-cta" style={{ color: 'var(--accent-2)' }}>
            Ver más <IconArrow size={14} />
          </Link>
        </div>
        <ProductList filters={{ sort: 'newest' }} pageSize={4} variant="preview" />
      </section>

      {/* ── CONÓCENOS ──────────────────────────────────────────── */}
      <section className="block">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>NUESTRA HISTORIA</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16, color: 'var(--accent-2)' }}>
              Compromiso y Servicio en La Romana
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 12 }}>
              Nacimos para brindar soluciones reales a los constructores y familias de Villa Hermosa. Creemos que la calidad no tiene por qué ser inalcanzable.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 28 }}>
              Por eso seleccionamos cuidadosamente cada producto en stock y capacitamos a nuestro equipo para guiarte en cada paso. Con La Tremenda, tu obra está en buenas manos.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[
                { n: '10+', label: 'Años' }, { n: '2.5K+', label: 'SKUs' },
                { n: '8K+', label: 'Clientes' }, { n: '99%', label: 'Garantía' },
              ].map(({ n, label }) => (
                <div key={label} style={{ borderTop: '3px solid var(--accent)', paddingTop: 12 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--accent-2)' }}>{n}</div>
                  <div className="mono mono--xs mono--dim" style={{ marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative dark panel */}
          <div style={{
            background: 'var(--grad-hero)', borderRadius: 'var(--r-xl)',
            padding: 40, minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Grid texture */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1,
              backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mono mono--xs" style={{ color: '#FF8A80', marginBottom: 12 }}>NUESTRO COMPROMISO</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, color: '#fff' }}>
                100%<span style={{ color: 'var(--accent)' }}>+</span>
              </div>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 48, height: 3, background: 'var(--accent)', marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', lineHeight: 1.65, maxWidth: '24rem' }}>
                Nos aseguramos de que ningún proyecto se detenga por falta de materiales. Inventario completo y entrega puntual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ───────────────────────────────────────────── */}
      <section className="block">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>CONTACTO</div>
            <h2 className="section-head__title">Visítanos o escríbenos</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Info */}
          <div style={{ background: 'var(--bg-card)', padding: 28, borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div className="mono mono--xs mono--dim" style={{ marginBottom: 16 }}>INFORMACIÓN</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Teléfono',  val: '(809) 801-1234',         href: 'tel:18098011234' },
                { label: 'Correo',    val: 'ventas@latremendaferreteria.com',  href: 'mailto:ventas@latremendaferreteria.com' },
                { label: 'Dirección', val: 'Av. Prof. Juan Bosch casi Esq. C/ Juan Pablo Duarte, Villa Hermosa, LR', href: 'https://maps.google.com' },
              ].map(({ label, val, href }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ display: 'flex', flexDirection: 'column', gap: 2, textDecoration: 'none' }}
                >
                  <span className="mono mono--xs mono--dim">{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-2)', transition: 'color .15s' }}>{val}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Horario */}
          <div style={{ background: 'var(--bg-card)', padding: 28, borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div className="mono mono--xs mono--dim" style={{ marginBottom: 16 }}>HORARIO DE ATENCIÓN</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DCFCE7', border: '1px solid #86EFAC', padding: '4px 12px', borderRadius: 'var(--r-pill)', marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#15803D' }}>Abierto ahora</span>
            </div>
            {[
              { day: 'Lunes – Viernes', hours: '8:00 AM – 7:00 PM', open: true  },
              { day: 'Sábado',          hours: '8:00 AM – 3:00 PM', open: true  },
              { day: 'Domingo',         hours: 'Cerrado',           open: false },
            ].map(({ day, hours, open }) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{day}</span>
                <span className="mono mono--xs" style={{ color: open ? 'var(--ink)' : 'var(--danger)', fontWeight: 700 }}>{hours}</span>
              </div>
            ))}
          </div>

          {/* Redes */}
          <div style={{ background: 'var(--bg-card)', padding: 28, borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div className="mono mono--xs mono--dim" style={{ marginBottom: 16 }}>SÍGUENOS EN REDES</div>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 20 }}>
              Mantente al tanto de ofertas especiales, nuevos productos y tips de mantenimiento.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'WhatsApp',  sub: 'Asistencia y pedidos', href: 'https://wa.me/18098011234', Icon: IconWA,  bg: '#DCFCE7', border: '#86EFAC', color: '#15803D' },
                { label: 'Instagram', sub: '@latremendaferreterialr', href: 'https://instagram.com/latremendaferreterialr', Icon: IconIG, bg: '#FCE7F3', border: '#F9A8D4', color: '#9D174D' },
              ].map(({ label, sub, href, Icon, bg, border, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', background: bg, border: `1px solid ${border}`,
                    borderRadius: 'var(--r-md)', textDecoration: 'none',
                    transition: 'transform .2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                >
                  <span style={{ color }}><Icon /></span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{label}</div>
                    <div className="mono mono--xs mono--dim" style={{ color }}>{sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA Banner */}
        <a
          href="https://wa.me/18098011234?text=Hola,%20quisiera%20cotizar%20unos%20materiales"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 28px', background: '#15803D', borderRadius: 'var(--r-lg)',
            color: '#fff', textDecoration: 'none', transition: 'background .2s',
            boxShadow: 'var(--shadow-md)', flexWrap: 'wrap', gap: 16
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#166534'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#15803D'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: '280px' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconWA />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>¿Necesitas una cotización express?</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>Escríbenos por WhatsApp y te enviamos presupuesto en minutos</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
            Cotizar ahora <IconArrow size={16} />
          </div>
        </a>
      </section>

      {/* ── PRO CTA ────────────────────────────────────────────── */}
      <section className="block" style={{ paddingBottom: 64 }}>
        <div className="pro-cta">
          <div>
            <div className="eyebrow">PROGRAMA PROFESIONAL</div>
            <h2>Descuentos especiales para constructores e ingenieros.</h2>
            <p>Obtén precios de mayorista, cotizaciones personalizadas y entregas directas en obra en La Romana.</p>
            <button className="btn btn--accent btn--lg" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}>
              Inscribirme al Programa Pro <IconArrow />
            </button>
          </div>
          <div className="pro-cta__meta">
            <div><span className="mono mono--xs mono--dim">DESCUENTOS</span><strong>PRO</strong></div>
            <div><span className="mono mono--xs mono--dim">ENTREGAS</span><strong>En Obra</strong></div>
            <div><span className="mono mono--xs mono--dim">ATENCIÓN</span><strong>Prioritaria</strong></div>
          </div>
        </div>
      </section>

    </div>
  </div>
);

export default Home;
