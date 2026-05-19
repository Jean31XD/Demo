import React, { useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_SLUG } from '@/graphql/queries/catalog.queries';
import { useCartStore } from '@/store/cart.store';
import ProductCard from '@/features/catalog/components/ProductCard';

/* ── Icons ── */
const IconMinus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
);
const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.5 12h11l2.5-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
);
const IconChevron = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
);
const IconTruck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z"/>
  </svg>
);
const IconReturn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const IconShare = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
  </svg>
);

const fmt = (n: number) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const TABS = ['Descripción', 'Especificaciones', 'Envío y garantía'] as const;
type Tab = typeof TABS[number];

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [inputVal, setInputVal] = useState('1');
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<Tab>('Descripción');

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const product = data?.productBySlug;

  const commitQty = (raw: string, max: number) => {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1 && n <= max) { setQty(n); setInputVal(String(n)); }
    else setInputVal(String(qty));
  };

  const handleAdd = useCallback(() => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: qty,
      image: product.images[0] ?? { url: '/placeholder.webp', alt: product.name },
      sku: product.sku,
      attributes: product.attributes ?? [],
    });
    setAdded(true);
    setQty(1); setInputVal('1');
    setTimeout(() => setAdded(false), 2200);
  }, [product, addItem, qty]);

  /* ── Loading skeleton ── */
  if (loading) return (
    <div style={{ maxWidth: 1160, margin: '0 auto', animation: 'fadeIn .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div className="shimmer" style={{ aspectRatio: '1/1', borderRadius: 'var(--r-md)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          {[80, 220, 60, 140, 100, 180, 260].map((w, i) => (
            <div key={i} className="shimmer" style={{ height: 14, width: w, borderRadius: 3 }} />
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (error || !product) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '80px 20px', textAlign: 'center', animation: 'slideUp .3s ease' }}>
      <p style={{ fontSize: 96, fontWeight: 700, color: 'var(--border)', lineHeight: 1, letterSpacing: '-0.04em' }}>404</p>
      <p style={{ fontSize: 16, color: 'var(--ink-2)' }}>Producto no encontrado</p>
      <Link to="/catalogo" className="btn btn--primary" style={{ marginTop: 8 }}>Volver al catálogo</Link>
    </div>
  );

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = isOnSale ? Math.round(100 - (product.price / product.compareAtPrice) * 100) : 0;
  const inStock = product.inventory.available;
  const stockQty = product.inventory.quantity;
  const imgs: { url: string; alt: string }[] = product.images?.length ? product.images : [{ url: '/placeholder.webp', alt: product.name }];

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', animation: 'slideUp .3s ease' }}>

      {/* Breadcrumb */}
      <nav className="crumbs" style={{ marginBottom: 28 }}>
        <Link to="/">Inicio</Link>
        <IconChevron />
        <Link to="/catalogo">Catálogo</Link>
        <IconChevron />
        <Link to={`/catalogo/${product.category.slug}`}>{product.category.name}</Link>
        <IconChevron />
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="pdp__grid">

        {/* ── Gallery ── */}
        <div className="pdp__gallery">
          {/* Main image */}
          <div style={{
            border: '1px solid var(--border)', background: 'var(--bg-soft)',
            aspectRatio: '1/1', overflow: 'hidden', position: 'relative',
            borderRadius: 'var(--r-sm)',
          }}>
            <img
              src={imgs[activeImg]?.url ?? '/placeholder.webp'}
              alt={imgs[activeImg]?.alt ?? product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = ''; }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            {isOnSale && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                padding: '3px 8px', borderRadius: 'var(--r-xs)',
              }}>
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 64, height: 64, padding: 0, overflow: 'hidden',
                    border: `2px solid ${i === activeImg ? 'var(--ink)' : 'var(--border)'}`,
                    borderRadius: 'var(--r-xs)', background: 'var(--bg-soft)',
                    cursor: 'pointer', transition: 'border-color .15s', flexShrink: 0,
                  }}
                >
                  <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="pdp__info">

          {/* Category + name */}
          <div>
            <span className="mono mono--xs mono--dim">{product.category.name}</span>
            <h1 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 600,
              letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)',
              marginTop: 8, marginBottom: 6,
            }}>
              {product.name}
            </h1>
            {product.sku && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                SKU: {product.sku}
              </p>
            )}
          </div>

          {/* Price block */}
          <div style={{
            padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'baseline', gap: 12,
          }}>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
              {fmt(product.price)}
            </span>
            {isOnSale && (
              <span style={{ fontSize: 14, color: 'var(--ink-4)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                {fmt(product.compareAtPrice)}
              </span>
            )}
            {isOnSale && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--accent)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
              }}>
                Ahorras {fmt(product.compareAtPrice - product.price)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: inStock ? 'var(--ok)' : 'var(--danger)',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 12.5, color: inStock ? 'var(--ok)' : 'var(--danger)', fontWeight: 500 }}>
              {inStock
                ? stockQty > 30 ? 'En stock' : stockQty > 0 ? `Solo quedan ${stockQty} unidades` : 'Agotado'
                : 'Agotado — próximo reabastecimiento en 5-7 días'}
            </span>
          </div>

          {/* Qty + Add */}
          {inStock ? (
            <div className="pdp__actions-container">
              <div className="qty pdp__qty-selector">
                <button
                  onClick={() => { const n = Math.max(1, qty - 1); setQty(n); setInputVal(String(n)); }}
                  aria-label="Reducir"
                >
                  <IconMinus />
                </button>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => commitQty(e.currentTarget.textContent || '1', stockQty)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitQty(e.currentTarget.textContent || '1', stockQty); } }}
                  style={{ outline: 'none', minWidth: 36, textAlign: 'center', userSelect: 'all', fontSize: 14 }}
                >
                  {inputVal}
                </span>
                <button
                  onClick={() => { const n = Math.min(stockQty, qty + 1); setQty(n); setInputVal(String(n)); }}
                  aria-label="Aumentar"
                >
                  <IconPlus />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn btn--primary pdp__add-btn"
              >
                {added ? (
                  <span className="check-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IconCheck /> Agregado al carrito
                  </span>
                ) : (
                  <>
                    <IconCart /> Agregar al carrito
                  </>
                )}
              </button>

              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href }).catch(() => {})}
                className="icon-btn pdp__share-btn"
                aria-label="Compartir"
                title="Compartir"
              >
                <IconShare />
              </button>
            </div>
          ) : (
            <button disabled className="btn btn--primary btn--block" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
              Sin existencias
            </button>
          )}

          {/* Promises */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {([
              [IconShield, 'Garantía', '12 meses'],
              [IconTruck,  'Envío',    '24–48 hrs'],
              [IconReturn, 'Devol.',   '30 días'],
            ] as const).map(([Icon, label, sub]) => (
              <div key={label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                padding: '10px 8px', background: 'var(--bg-soft)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', textAlign: 'center',
              }}>
                <span style={{ color: 'var(--accent)' }}><Icon /></span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>{sub}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ marginTop: 48, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 20px',
                fontSize: 13, fontWeight: tab === t ? 600 : 400,
                color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: tab === t ? '2px solid var(--ink)' : '2px solid transparent',
                marginBottom: -1,
                background: 'none', border: 'none',
                cursor: 'pointer', transition: 'color .15s',
                letterSpacing: '-0.005em',
                flexShrink: 0,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ padding: '28px 4px' }}>
          {tab === 'Descripción' && (
            <div style={{ maxWidth: '72ch' }}>
              {product.description ? (
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--ink-2)' }}>{product.description}</p>
              ) : (
                <p style={{ fontSize: 14, color: 'var(--ink-4)' }}>Sin descripción disponible.</p>
              )}
            </div>
          )}

          {tab === 'Especificaciones' && (
            <div>
              {product.attributes?.length > 0 ? (
                <table className="specs-table" style={{ width: '100%', maxWidth: 640 }}>
                  <tbody>
                    {product.attributes.map((attr: any) => (
                      <tr key={attr.name}>
                        <td style={{
                          padding: '9px 14px', fontSize: 12.5, color: 'var(--ink-3)',
                          background: 'var(--bg-soft)', fontWeight: 500,
                          borderBottom: '1px solid var(--border)', width: '40%',
                        }}>
                          {attr.name}
                        </td>
                        <td style={{
                          padding: '9px 14px', fontFamily: 'var(--font-mono)',
                          fontSize: 12, color: 'var(--ink)',
                          borderBottom: '1px solid var(--border)',
                        }}>
                          {attr.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: 14, color: 'var(--ink-4)' }}>Sin especificaciones registradas.</p>
              )}
            </div>
          )}

          {tab === 'Envío y garantía' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '64ch' }}>
              {([
                ['Envío estándar', '24-48 hrs en CDMX y zona metropolitana. 3-5 días en el interior de la república. Gratis en pedidos mayores a $2,000 MXN.'],
                ['Envío express', 'Disponible para CDMX con costo adicional. Entrega el mismo día en órdenes antes de las 13:00 hrs.'],
                ['Garantía', 'Todos nuestros productos cuentan con garantía directa de fabricante por 12 meses contra defectos de fabricación.'],
                ['Devoluciones', 'Aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en su empaque original y sin uso.'],
              ] as const).map(([title, text]) => (
                <div key={title}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 5 }}>{title}</p>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65 }}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Related products ── */}
      {product.relatedProducts?.length > 0 && (
        <section style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
          <div className="section-head" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              También te puede interesar
            </h2>
          </div>
          <div className="prod-grid prod-grid--4">
            {product.relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetail;
