import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cart.store';
import type { CartItem } from '@/types';

/* ── Inline icons ── */
const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18"/>
  </svg>
);
const IconMinus = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14"/>
  </svg>
);
const IconPlus = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.5 12h11l2.5-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>
  </svg>
);
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
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

const fmt = (n: number) =>
  '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ── Item row ── */
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const [inputVal, setInputVal] = React.useState(String(item.quantity));

  React.useEffect(() => { setInputVal(String(item.quantity)); }, [item.quantity]);

  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1) updateQuantity(item.productId, n);
    else setInputVal(String(item.quantity));
  };

  return (
    <div className="cart-row">
      {/* Image */}
      <div style={{
        flexShrink: 0, width: 56, height: 56, overflow: 'hidden',
        background: 'var(--bg-soft)', border: '1px solid var(--border)',
      }}>
        <img
          src={item.image.url}
          alt={item.image.alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 500, lineHeight: 1.3,
          color: 'var(--ink)', letterSpacing: '-0.005em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: 2,
        }}>
          {item.name}
        </p>
        {item.sku && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em', marginBottom: 6 }}>
            {item.sku}
          </p>
        )}

        {/* Qty + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div className="qty qty--sm" style={{ borderRadius: 0 }}>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Reducir"
            >
              <IconMinus />
            </button>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => commit(e.currentTarget.textContent || '1')}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(e.currentTarget.textContent || '1'); } }}
              style={{ outline: 'none', minWidth: 24, textAlign: 'center', userSelect: 'all' }}
            >
              {inputVal}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Aumentar"
            >
              <IconPlus />
            </button>
          </div>

          <span style={{
            fontSize: 14, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)',
          }}>
            {fmt(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.productId)}
        style={{
          alignSelf: 'flex-start', padding: 4, color: 'var(--ink-4)',
          background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
          transition: 'color .15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-4)'; }}
        aria-label={`Eliminar ${item.name}`}
      >
        <IconX />
      </button>
    </div>
  );
};

/* ── Cart drawer ── */
const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, total, count, clearCart } = useCartStore();
  const itemCount = count();
  const cartTotal = total();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const FREE_SHIPPING_AT = 2000;
  const pct = Math.min(100, Math.round((cartTotal / FREE_SHIPPING_AT) * 100));
  const remaining = FREE_SHIPPING_AT - cartTotal;
  const hasShipping = cartTotal >= FREE_SHIPPING_AT;

  return (
    <>
      {/* Scrim */}
      <div
        className="scrim"
        onClick={closeCart}
        aria-hidden="true"
        style={{ animation: 'fadeIn .2s ease' }}
      />

      {/* Drawer panel */}
      <aside
        className="drawer"
        aria-label="Carrito de compras"
        role="dialog"
        aria-modal="true"
        style={{ transform: 'none', animation: 'slideRight .25s ease' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--ink)' }}><IconCart /></span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                Mi Carrito
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="icon-btn"
            aria-label="Cerrar carrito"
          >
            <IconX />
          </button>
        </div>

        {/* Free-shipping progress */}
        {items.length > 0 && (
          <div style={{
            padding: '10px 20px',
            background: hasShipping ? 'color-mix(in srgb, var(--ok) 8%, transparent)' : 'var(--bg-soft)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
            }}>
              <span style={{ color: hasShipping ? 'var(--ok)' : 'var(--ink-3)' }}><IconTruck /></span>
              <p style={{ fontSize: 11, color: hasShipping ? 'var(--ok)' : 'var(--ink-2)', fontWeight: 500 }}>
                {hasShipping
                  ? '¡Envío gratis desbloqueado!'
                  : <>Agrega <strong style={{ color: 'var(--ink)' }}>{fmt(remaining)}</strong> más para envío gratis</>
                }
              </p>
            </div>
            <div style={{
              height: 3, background: 'var(--border)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: hasShipping ? 'var(--ok)' : 'var(--accent)',
                transition: 'width .4s ease',
                borderRadius: 2,
              }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: 16, textAlign: 'center',
              padding: '40px 0',
            }}>
              <div style={{
                width: 64, height: 64, display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '1px solid var(--border)',
                color: 'var(--ink-4)',
              }}>
                <IconCart />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>
                  Carrito vacío
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                  Agrega herramientas desde el catálogo
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn btn--primary"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="drawer__foot">
            {/* Subtotal rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Subtotal ({itemCount} art.)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>
                  {fmt(cartTotal)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Envío</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: hasShipping ? 'var(--ok)' : 'var(--ink-2)',
                  fontWeight: hasShipping ? 600 : 400,
                }}>
                  {hasShipping ? 'GRATIS' : '$150'}
                </span>
              </div>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              paddingTop: 10, marginBottom: 4,
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Total estimado</span>
              <span className="drawer__sum-total">
                {fmt(cartTotal + (hasShipping ? 0 : 150))}
              </span>
            </div>

            {/* CTA */}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn btn--primary btn--block"
              style={{ marginBottom: 8 }}
            >
              Proceder al pago <IconArrow />
            </Link>
            <button
              onClick={clearCart}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 5, padding: '6px 0', fontSize: 11, color: 'var(--ink-4)',
                background: 'none', border: 'none', cursor: 'pointer', transition: 'color .15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-4)'; }}
            >
              <IconTrash /> Vaciar carrito
            </button>
          </div>
        )}
      </aside>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
