import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cart.store';
import type { ProductCardData } from '@/types';

/* ── Inline icons (matching the design system) ── */
const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IconMinus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 12h14"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4 12 5 5L20 6"/>
  </svg>
);
const IconCart = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.5 12h11l2.5-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>
  </svg>
);

const fmt = (n: number) =>
  '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

interface Props { product: ProductCardData; }

const ProductCard: React.FC<Props> = memo(({ product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [inputVal, setInputVal] = useState('1');
  const [added, setAdded] = useState(false);

  const img = product.images[0];
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const inStock = product.inventory.available;
  const discount = isOnSale
    ? Math.round(100 - (product.price / product.compareAtPrice!) * 100)
    : 0;

  const stockLevel = product.inventory.quantity;
  const stockClass = stockLevel === 0 ? 'out' : stockLevel > 30 ? 'high' : stockLevel > 10 ? 'mid' : 'low';
  const stockLabel = stockLevel === 0 ? 'Agotado' : stockLevel > 30 ? 'En stock' : stockLevel > 10 ? 'Disponible' : `Quedan ${stockLevel}`;

  const commitQty = (raw: string) => {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1 && n <= product.inventory.quantity) {
      setQty(n); setInputVal(String(n));
    } else {
      setInputVal(String(qty));
    }
  };

  const decrement = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setQty((q) => { const n = Math.max(1, q - 1); setInputVal(String(n)); return n; });
  }, []);

  const increment = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setQty((q) => { const n = Math.min(product.inventory.quantity, q + 1); setInputVal(String(n)); return n; });
  }, [product.inventory.quantity]);

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: qty,
        image: img ?? { url: '/placeholder.webp', alt: product.name },
        sku: product.sku ?? undefined,
        attributes: product.attributes ?? [],
      });
      setAdded(true);
      setQty(1); setInputVal('1');
      setTimeout(() => setAdded(false), 1800);
    },
    [product, img, addItem, qty]
  );

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="product-card"
      aria-label={`Ver ${product.name}`}
      style={{ textDecoration: 'none' }}
    >
      {/* Media */}
      <div
        className="pc__media"
        style={{ position: 'relative', aspectRatio: '5/4', overflow: 'hidden', borderBottom: '1px solid var(--border)', background: 'var(--bg-soft)' }}
      >
        <img
          src={img?.url ?? '/placeholder.webp'}
          alt={img?.alt ?? product.name}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = ''; }}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = 'none';
            const p = el.parentElement;
            if (p && !p.querySelector('.img-fallback')) {
              const fb = document.createElement('div');
              fb.className = 'img-fallback';
              fb.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--bg-soft)';
              fb.innerHTML = `<span style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-3)">${product.sku ?? product.category.name}</span>`;
              p.appendChild(fb);
            }
          }}
        />

        {/* Badges */}
        {product.sku && (
          <div
            style={{
              position: 'absolute', top: 10, left: 10,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '3px 7px',
              background: 'var(--ink)',
              color: 'var(--ink-on-dark)',
              borderRadius: 'var(--r-xs)',
            }}
          >
            {product.sku}
          </div>
        )}
        {isOnSale && (
          <div
            style={{
              position: 'absolute', top: 10, right: 10,
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              padding: '3px 7px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: 'var(--r-xs)',
            }}
          >
            -{discount}%
          </div>
        )}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(250,250,249,0.85)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--ink-3)',
              padding: '4px 10px', border: '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}>
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pc__body" style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="mono mono--xs mono--dim">{product.category.name}</span>
        </div>
        <h3 style={{
          fontSize: 14, fontWeight: 500, lineHeight: 1.35,
          letterSpacing: '-0.005em', color: 'var(--ink)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '2.7em',
        }}>
          {product.name}
        </h3>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            {fmt(product.price)}
            {isOnSale && (
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-4)', textDecoration: 'line-through' }}>
                {fmt(product.compareAtPrice!)}
              </span>
            )}
          </div>
          <span className={`stock-pill stock-pill--${stockClass}`}>
            <span className="stock-pill__dot" />
            {stockLabel}
          </span>
        </div>
      </div>

      {/* Qty + Add controls */}
      {inStock && (
        <div
          style={{ borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'stretch' }}
          onClick={(e) => e.preventDefault()}
        >
          <div className="qty qty--sm pc__qty-selector" style={{ flex: '0 0 auto', borderRight: '1px solid var(--border)', borderRadius: 0 }}>
            <button onClick={decrement} aria-label="Reducir">
              <IconMinus />
            </button>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => commitQty(e.currentTarget.textContent || '1')}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitQty(e.currentTarget.textContent || '1'); } }}
              style={{ outline: 'none', minWidth: 28, textAlign: 'center', userSelect: 'all' }}
            >
              {inputVal}
            </span>
            <button onClick={increment} aria-label="Aumentar">
              <IconPlus />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="pc__add pc__add-btn"
            style={{
              flex: 1,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '6px 10px',
              fontSize: 12, fontWeight: 500,
              background: 'var(--ink)', color: 'var(--ink-on-dark)',
              borderRadius: 0,
              opacity: 1, transform: 'none',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ink)'; }}
            aria-label={`Agregar ${product.name}`}
          >
            {added ? (
              <span className="check-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <IconCheck /> Agregado
              </span>
            ) : (
              <>
                <IconCart /> Agregar
              </>
            )}
          </button>
        </div>
      )}
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
