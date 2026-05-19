/* global React */
// Componentes compartidos: placeholder de producto, iconos, helpers UI

const { useState, useEffect, useRef, useMemo } = React;

// ----- Formato -----
const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ----- Iconos minimalistas (24x24, stroke 1.5) -----
const Icon = ({ name, size = 18, className = '', strokeWidth = 1.5 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', className };
  switch (name) {
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'cart':     return <svg {...props}><path d="M3 4h2l2.5 12h11l2.5-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>;
    case 'user':     return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>;
    case 'menu':     return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'close':    return <svg {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':    return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'check':    return <svg {...props}><path d="m4 12 5 5L20 6"/></svg>;
    case 'star':     return <svg {...props} fill="currentColor" stroke="none"><path d="m12 2 2.9 6.5L22 9.6l-5 4.9 1.2 7.1L12 18.3l-6.2 3.3L7 14.5 2 9.6l7.1-1.1z"/></svg>;
    case 'truck':    return <svg {...props}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case 'shield':   return <svg {...props}><path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z"/></svg>;
    case 'box':      return <svg {...props}><path d="M3 7 12 3l9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>;
    case 'filter':   return <svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'grid':     return <svg {...props}><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>;
    case 'rows':     return <svg {...props}><path d="M3 5h18M3 12h18M3 19h18"/></svg>;
    case 'arrow':    return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-up-right': return <svg {...props}><path d="M7 17 17 7M9 7h8v8"/></svg>;
    case 'chevron':  return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chevron-down': return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case 'compare':  return <svg {...props}><path d="M9 4 4 9M4 9h11a4 4 0 0 1 4 4M15 20l5-5M20 15H9a4 4 0 0 1-4-4"/></svg>;
    case 'eye':      return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'heart':    return <svg {...props}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case 'spark':    return <svg {...props}><path d="m12 3 1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4z"/></svg>;
    case 'package':  return <svg {...props}><path d="M3 7v10l9 4 9-4V7l-9-4zM3 7l9 4M21 7l-9 4M12 11v10"/></svg>;
    case 'pin':      return <svg {...props}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'phone':    return <svg {...props}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;
    case 'mail':     return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'logo':     return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}><rect x="2" y="2" width="20" height="20" rx="3" fill="var(--accent-2)"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><circle cx="19" cy="19" r="2" fill="var(--accent)"/></svg>;
    default: return null;
  }
};

// ----- Placeholder de producto: foto real con fallback a geometría isométrica abstracta -----
const ProductArt = ({ product, size = 'md' }) => {
  if (!product) return null;
  const [imgFailed, setImgFailed] = useState(false);
  const colors = {
    amber:    { a: '#F4F2EE', b: '#E8E2D5', c: '#1A1A1A', accent: 'var(--accent)' },
    sky:      { a: '#EEF1F4', b: '#DDE3EA', c: '#1A1A1A', accent: 'var(--accent)' },
    red:      { a: '#F4EFEF', b: '#E8DEDE', c: '#1A1A1A', accent: 'var(--accent)' },
    graphite: { a: '#F0F0EE', b: '#E0E0DD', c: '#1A1A1A', accent: 'var(--accent)' },
  };
  const c = colors[product.color || 'graphite'];
  const cat = product.category;

  // distinta composición por categoría — geométrica, no figurativa
  const art = (() => {
    switch (cat) {
      case 'electric': // bloque + cilindro (sugerencia herramienta eléctrica)
        return <>
          <rect x="60" y="120" width="180" height="80" rx="6" fill={c.b}/>
          <rect x="60" y="120" width="180" height="80" rx="6" fill="none" stroke={c.c} strokeOpacity=".15"/>
          <rect x="200" y="100" width="60" height="40" rx="3" fill={c.accent}/>
          <rect x="80" y="200" width="50" height="50" rx="2" fill={c.c}/>
          <circle cx="260" cy="160" r="8" fill={c.c}/>
          <line x1="40" y1="220" x2="320" y2="220" stroke={c.c} strokeOpacity=".25" strokeDasharray="2 4"/>
        </>;
      case 'manual':
        return <>
          <rect x="80" y="80" width="200" height="20" rx="4" fill={c.b}/>
          <rect x="80" y="80" width="200" height="20" rx="4" fill="none" stroke={c.c} strokeOpacity=".15"/>
          <rect x="140" y="100" width="80" height="120" rx="6" fill={c.c}/>
          <rect x="155" y="100" width="50" height="120" fill={c.accent} opacity=".85"/>
          <line x1="40" y1="240" x2="320" y2="240" stroke={c.c} strokeOpacity=".25" strokeDasharray="2 4"/>
        </>;
      case 'fasteners': // grid de puntos = piezas a granel
        return <>
          {Array.from({length: 6}).map((_, r) => Array.from({length: 10}).map((_, k) => (
            <circle key={`${r}-${k}`} cx={70 + k*22} cy={90 + r*22} r={k%3===0&&r%2===0 ? 5 : 4} fill={(k+r)%5===0 ? c.accent : c.c} opacity={(k+r)%5===0 ? 1 : .55}/>
          )))}
        </>;
      case 'materials': // bloque sólido + textura
        return <>
          <rect x="60" y="100" width="220" height="120" rx="4" fill={c.b}/>
          <rect x="60" y="100" width="220" height="120" rx="4" fill="none" stroke={c.c} strokeOpacity=".15"/>
          <line x1="60"  y1="140" x2="280" y2="140" stroke={c.c} strokeOpacity=".15"/>
          <line x1="60"  y1="180" x2="280" y2="180" stroke={c.c} strokeOpacity=".15"/>
          <line x1="130" y1="100" x2="130" y2="220" stroke={c.c} strokeOpacity=".15"/>
          <line x1="210" y1="100" x2="210" y2="220" stroke={c.c} strokeOpacity=".15"/>
          <rect x="60" y="100" width="40" height="30" fill={c.accent} opacity=".9"/>
        </>;
      case 'plumbing': // tubos / circulo concentrico
        return <>
          <circle cx="170" cy="160" r="80" fill={c.b}/>
          <circle cx="170" cy="160" r="80" fill="none" stroke={c.c} strokeOpacity=".15"/>
          <circle cx="170" cy="160" r="55" fill="none" stroke={c.c} strokeOpacity=".25" strokeWidth="2"/>
          <circle cx="170" cy="160" r="30" fill="none" stroke={c.accent} strokeWidth="3"/>
          <rect x="60"  y="155" width="40" height="10" fill={c.c}/>
          <rect x="240" y="155" width="40" height="10" fill={c.c}/>
        </>;
      case 'safety': // forma protectora (escudo geométrico)
        return <>
          <path d="M170 80 L240 110 L240 170 Q240 220 170 240 Q100 220 100 170 L100 110 Z" fill={c.b} stroke={c.c} strokeOpacity=".15"/>
          <path d="M170 110 L215 130 L215 168 Q215 200 170 215 Q125 200 125 168 L125 130 Z" fill={c.accent} opacity=".9"/>
          <path d="m150 165 14 14 26-30" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </>;
      default:
        return <rect x="60" y="80" width="220" height="160" fill={c.b}/>;
    }
  })();

  return (
    <div className={`product-art product-art--${size}`}>
      {product.img && !imgFailed ? (
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="product-art__img"
        />
      ) : (
        <svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
          <defs>
            <pattern id={`grid-${product.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 L0 20" fill="none" stroke={c.c} strokeOpacity=".06" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="340" height="280" fill={c.a}/>
          <rect width="340" height="280" fill={`url(#grid-${product.id})`}/>
          {art}
        </svg>
      )}
      <div className="product-art__sku">{product.sku}</div>
    </div>
  );
};

// ----- Category Icon (estilo más editorial, geométrico) -----
const CategoryArt = ({ id, accent = 'var(--accent)' }) => {
  const ink = 'var(--ink)';
  switch (id) {
    case 'electric':
      return <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="20" y="40" width="55" height="22" rx="3" fill={ink}/>
        <rect x="65" y="32" width="20" height="10" fill={accent}/>
        <rect x="28" y="62" width="18" height="20" rx="2" fill={ink}/>
        <circle cx="85" cy="51" r="3" fill="#fff"/>
      </svg>;
    case 'manual':
      return <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="38" y="18" width="24" height="14" rx="2" fill={ink}/>
        <rect x="46" y="32" width="8" height="60" fill={ink}/>
        <rect x="40" y="32" width="20" height="10" fill={accent}/>
      </svg>;
    case 'fasteners':
      return <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="35,18 65,18 70,28 50,90 30,28" fill={ink}/>
        <line x1="38" y1="38" x2="62" y2="38" stroke="#fff" strokeWidth="1.5"/>
        <line x1="40" y1="48" x2="60" y2="48" stroke="#fff" strokeWidth="1.5"/>
        <line x1="42" y1="58" x2="58" y2="58" stroke="#fff" strokeWidth="1.5"/>
        <line x1="44" y1="68" x2="56" y2="68" stroke="#fff" strokeWidth="1.5"/>
        <rect x="30" y="14" width="40" height="6" fill={accent}/>
      </svg>;
    case 'materials':
      return <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="16" y="30" width="68" height="55" fill={ink}/>
        <line x1="16" y1="48" x2="84" y2="48" stroke="#fff" strokeOpacity=".25"/>
        <line x1="16" y1="66" x2="84" y2="66" stroke="#fff" strokeOpacity=".25"/>
        <line x1="38" y1="30" x2="38" y2="85" stroke="#fff" strokeOpacity=".25"/>
        <line x1="62" y1="30" x2="62" y2="85" stroke="#fff" strokeOpacity=".25"/>
        <rect x="16" y="30" width="22" height="18" fill={accent}/>
      </svg>;
    case 'plumbing':
      return <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="30" fill={ink}/>
        <circle cx="50" cy="50" r="14" fill="#fff"/>
        <circle cx="50" cy="50" r="8" fill={accent}/>
        <rect x="6"  y="46" width="14" height="8" fill={ink}/>
        <rect x="80" y="46" width="14" height="8" fill={ink}/>
      </svg>;
    case 'safety':
      return <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M50 14 L78 26 L78 52 Q78 76 50 88 Q22 76 22 52 L22 26 Z" fill={ink}/>
        <path d="M50 28 L66 36 L66 52 Q66 68 50 76 Q34 68 34 52 L34 36 Z" fill={accent}/>
      </svg>;
    default: return null;
  }
};

// ----- Estrellas -----
const Stars = ({ value = 5, size = 12 }) => (
  <span className="stars" style={{ fontSize: size }}>
    {[1,2,3,4,5].map(i => (
      <Icon key={i} name="star" size={size} className={i <= Math.round(value) ? 'stars__on' : 'stars__off'}/>
    ))}
  </span>
);

// ----- Stock pill -----
const StockBadge = ({ stock }) => {
  const level = stock > 30 ? 'high' : stock > 10 ? 'mid' : stock > 0 ? 'low' : 'out';
  const labels = { high: 'En stock', mid: 'Disponible', low: `Quedan ${stock}`, out: 'Agotado' };
  return <span className={`stock-pill stock-pill--${level}`}>
    <span className="stock-pill__dot"/>{labels[level]}
  </span>;
};

// ----- Tag -----
const Tag = ({ children, kind = 'default' }) => <span className={`tag tag--${kind}`}>{children}</span>;

// ----- Section Header (editorial) -----
const SectionHead = ({ eyebrow, title, cta, onCta }) => (
  <div className="section-head">
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2 className="section-head__title">{title}</h2>
    </div>
    {cta && <button className="link-cta" onClick={onCta}>{cta} <Icon name="arrow" size={14}/></button>}
  </div>
);

Object.assign(window, { fmt, Icon, ProductArt, CategoryArt, Stars, StockBadge, Tag, SectionHead });
