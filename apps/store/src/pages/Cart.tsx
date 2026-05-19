import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cart.store';
import type { CartItem } from '@/types';

/* ── Icons ── */
const IconMinus = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>
);
const IconPlus = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
);
const IconCart = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.5 12h11l2.5-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>
  </svg>
);
const IconTruck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

const fmt = (n: number) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ── Cart item row ── */
const ItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const [val, setVal] = React.useState(String(item.quantity));
  React.useEffect(() => setVal(String(item.quantity)), [item.quantity]);

  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1) updateQuantity(item.productId, n);
    else setVal(String(item.quantity));
  };

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '80px 1fr auto',
      gap: 20, padding: '20px 0', borderBottom: '1px solid var(--border)',
      alignItems: 'start',
    }}>
      {/* Image */}
      <Link to={`/producto/${item.slug ?? '#'}`} style={{ display: 'block' }}>
        <div style={{
          aspectRatio: '1/1', overflow: 'hidden',
          background: 'var(--bg-soft)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-xs)',
        }}>
          <img
            src={item.image.url} alt={item.image.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Link
          to={`/producto/${item.slug ?? '#'}`}
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.005em', lineHeight: 1.35, textDecoration: 'none' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
        >
          {item.name}
        </Link>
        {item.sku && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {item.sku}
          </span>
        )}
        {item.attributes?.slice(0, 2).map((a) => (
          <span key={a.name} style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {a.name}: {a.value}
          </span>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <div className="qty qty--sm" style={{ borderRadius: 0 }}>
            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Reducir"><IconMinus /></button>
            <span
              contentEditable suppressContentEditableWarning
              onBlur={(e) => commit(e.currentTarget.textContent || '1')}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(e.currentTarget.textContent || '1'); } }}
              style={{ outline: 'none', minWidth: 24, textAlign: 'center', userSelect: 'all' }}
            >
              {val}
            </span>
            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Aumentar"><IconPlus /></button>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            {fmt(item.price * item.quantity)}
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
            c/u {fmt(item.price)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.productId)}
        className="icon-btn"
        aria-label={`Eliminar ${item.name}`}
        style={{ transition: 'color .15s' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-4)'; }}
      >
        <IconX />
      </button>
    </div>
  );
};

/* ── Cart page ── */
const CartPage: React.FC = () => {
  const { items, total, count, clearCart } = useCartStore();
  const itemCount = count();
  const cartTotal = total();
  const FREE_AT = 2000;
  const shipping = cartTotal >= FREE_AT ? 0 : 150;
  const pct = Math.min(100, Math.round((cartTotal / FREE_AT) * 100));

  if (items.length === 0) return (
    <div style={{
      maxWidth: 520, margin: '0 auto', paddingTop: 80,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 16, textAlign: 'center', animation: 'slideUp .3s ease',
    }}>
      <div style={{
        width: 80, height: 80, display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border)',
        color: 'var(--border-strong)', borderRadius: 'var(--r-md)',
      }}>
        <IconCart />
      </div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Tu carrito está vacío</p>
        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Agrega herramientas desde el catálogo</p>
      </div>
      <Link to="/catalogo" className="btn btn--primary btn--lg" style={{ marginTop: 8 }}>
        Explorar catálogo
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'slideUp .3s ease' }}>
      <nav className="crumbs" style={{ marginBottom: 24 }}>
        <Link to="/">Inicio</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Carrito</span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Mi carrito <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink-3)', marginLeft: 6 }}>({itemCount} artículos)</span>
        </h1>
        <button
          onClick={clearCart}
          style={{ fontSize: 12, color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color .15s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-4)'; }}
        >
          Vaciar carrito
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

        {/* Items */}
        <div>
          {items.map((item) => <ItemRow key={item.productId} item={item} />)}

          <div style={{ marginTop: 20 }}>
            <Link to="/catalogo" style={{
              fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'color .15s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)'; }}
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
          overflow: 'hidden', position: 'sticky', top: 96,
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-soft)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.005em' }}>Resumen del pedido</p>
          </div>

          {/* Shipping progress */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ color: shipping === 0 ? 'var(--ok)' : 'var(--ink-3)' }}><IconTruck /></span>
              <p style={{ fontSize: 12, color: shipping === 0 ? 'var(--ok)' : 'var(--ink-2)' }}>
                {shipping === 0
                  ? '¡Envío gratis desbloqueado!'
                  : <>Agrega <strong style={{ color: 'var(--ink)' }}>{fmt(FREE_AT - cartTotal)}</strong> para envío gratis</>
                }
              </p>
            </div>
            <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: 2,
                background: shipping === 0 ? 'var(--ok)' : 'var(--accent)',
                transition: 'width .4s ease',
              }} />
            </div>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              [`Subtotal (${itemCount} art.)`, fmt(cartTotal)],
              ['Envío', shipping === 0 ? 'GRATIS' : fmt(shipping)],
              ['IVA (incluido)', ''],
            ].map(([label, val]) => val && (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
                <span>{label}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: label === 'Envío' && shipping === 0 ? 'var(--ok)' : 'inherit',
                  fontWeight: label === 'Envío' && shipping === 0 ? 600 : 400,
                }}>
                  {val}
                </span>
              </div>
            ))}

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 2,
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                {fmt(cartTotal + shipping)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="btn btn--primary btn--block btn--lg"
              style={{ marginTop: 4, justifyContent: 'center', gap: 8 }}
            >
              Proceder al pago <IconArrow />
            </Link>

            <p style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'center', marginTop: 4 }}>
              Pago seguro · SSL encriptado
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
