/* global React, fmt, Icon, ProductArt, Stars, StockBadge, Tag, CATEGORIES, PRODUCTS */

const { useState: useStateC, useEffect: useEffectC, useMemo: useMemoC } = React;

// ============================================================
// MINI CART (slide-over)
// ============================================================
function CartDrawer({ open, onClose, cart, onUpdateQty, onRemove, onCheckout, onOpenProduct }) {
  useEffectC(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const items = cart.map(c => ({ ...PRODUCTS.find(p => p.id === c.id), qty: c.qty }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const freeShip = subtotal >= 2000;
  const shipping = freeShip ? 0 : 99;
  const total = subtotal + shipping;
  const progress = Math.min(100, (subtotal / 2000) * 100);

  return (
    <>
      <div className={`scrim ${open?'is-open':''}`} onClick={onClose}/>
      <aside className={`drawer ${open?'is-open':''}`} role="dialog" aria-label="Carrito">
        <header className="drawer__head">
          <div>
            <h3>Carrito</h3>
            <span className="mono mono--xs mono--dim">{items.length} producto{items.length!==1?'s':''} · {items.reduce((s,i)=>s+i.qty,0)} unidades</span>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={16}/></button>
        </header>

        {/* Free ship progress */}
        {items.length > 0 && (
          <div className="drawer__progress">
            {freeShip ? (
              <div className="drawer__progress-ok"><Icon name="check" size={13}/> Tu pedido califica para envío gratis</div>
            ) : (
              <>
                <div className="drawer__progress-text">
                  Te faltan <strong>{fmt(2000 - subtotal)}</strong> para envío gratis
                </div>
                <div className="drawer__progress-bar"><div style={{width: progress+'%'}}/></div>
              </>
            )}
          </div>
        )}

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <Icon name="cart" size={32}/>
              <h4>Tu carrito está vacío</h4>
              <p>Agrega productos del catálogo para verlos aquí.</p>
              <button className="btn btn--primary" onClick={onClose}>Seguir comprando</button>
            </div>
          ) : items.map(it => (
            <div key={it.id} className="cart-row">
              <button className="cart-row__media" onClick={()=>{onClose(); onOpenProduct(it.id);}}>
                <ProductArt product={it} size="sm"/>
              </button>
              <div className="cart-row__body">
                <div className="mono mono--xs mono--dim">{it.brand} · {it.sku}</div>
                <button className="cart-row__name" onClick={()=>{onClose(); onOpenProduct(it.id);}}>{it.name}</button>
                <div className="cart-row__price-row">
                  <div className="qty qty--sm">
                    <button onClick={()=>onUpdateQty(it.id, Math.max(1, it.qty-1))}><Icon name="minus" size={11}/></button>
                    <span>{it.qty}</span>
                    <button onClick={()=>onUpdateQty(it.id, it.qty+1)}><Icon name="plus" size={11}/></button>
                  </div>
                  <div className="cart-row__price">{fmt(it.price * it.qty)}</div>
                </div>
              </div>
              <button className="cart-row__remove" onClick={()=>onRemove(it.id)}><Icon name="close" size={13}/></button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <footer className="drawer__foot">
            <div className="drawer__sum">
              <div><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div><span>Envío</span><span>{shipping === 0 ? 'Gratis' : fmt(shipping)}</span></div>
              <div className="drawer__sum-total"><span>Total</span><span>{fmt(total)}</span></div>
            </div>
            <button className="btn btn--primary btn--lg btn--block" onClick={onCheckout}>
              Ir a checkout <Icon name="arrow" size={15}/>
            </button>
            <button className="btn btn--ghost btn--block" onClick={onClose}>Seguir comprando</button>
          </footer>
        )}
      </aside>
    </>
  );
}

// ============================================================
// QUICK VIEW MODAL
// ============================================================
function QuickView({ productId, onClose, onAddToCart, onOpenProduct, onCompareToggle, compareIds }) {
  const product = productId ? PRODUCTS.find(p => p.id === productId) : null;
  const [qty, setQty] = useStateC(1);

  useEffectC(() => { setQty(1); }, [productId]);
  useEffectC(() => {
    if (!productId) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [productId, onClose]);

  if (!product) return null;
  const cat = CATEGORIES.find(c => c.id === product.category);

  return (
    <>
      <div className="scrim is-open" onClick={onClose}/>
      <div className="qv">
        <button className="qv__close" onClick={onClose}><Icon name="close" size={16}/></button>
        <div className="qv__media">
          <ProductArt product={product}/>
        </div>
        <div className="qv__body">
          <div className="qv__meta">
            <span className="mono mono--xs">{product.sku}</span>
            <span className="mono mono--xs mono--dim">·</span>
            <span className="mono mono--xs">{product.brand}</span>
            <span className="mono mono--xs mono--dim">·</span>
            <span className="mono mono--xs">{cat?.short}</span>
          </div>
          <h2 className="qv__title">{product.name}</h2>
          <div className="qv__rating">
            <Stars value={product.rating} size={12}/>
            <span className="mono mono--xs mono--dim">{product.rating} · {product.reviews} reseñas</span>
          </div>
          <div className="qv__price">{fmt(product.price)} {product.was && <span className="qv__was">{fmt(product.was)}</span>}</div>
          <StockBadge stock={product.stock}/>

          <div className="qv__specs">
            {Object.entries(product.specs).slice(0,4).map(([k,v])=>(
              <div key={k} className="qv__spec"><span className="mono mono--xs mono--dim">{k}</span><span>{v}</span></div>
            ))}
          </div>

          <div className="qv__actions">
            <div className="qty">
              <button onClick={()=>setQty(Math.max(1, qty-1))}><Icon name="minus" size={13}/></button>
              <input type="number" value={qty} onChange={(e)=>setQty(Math.max(1, +e.target.value || 1))}/>
              <button onClick={()=>setQty(qty+1)}><Icon name="plus" size={13}/></button>
            </div>
            <button className="btn btn--primary btn--lg" onClick={()=>{onAddToCart(product.id, qty); onClose();}}>
              Agregar — {fmt(product.price * qty)}
            </button>
          </div>

          <div className="qv__foot">
            <button className="link-cta" onClick={()=>{onClose(); onOpenProduct(product.id);}}>Ver página completa <Icon name="arrow" size={13}/></button>
            <button className={`link-cta ${compareIds.includes(product.id)?'is-on':''}`} onClick={()=>onCompareToggle(product.id)}>
              <Icon name="compare" size={13}/> {compareIds.includes(product.id) ? 'Quitar de comparación' : 'Agregar a comparación'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// COMPARE BAR + MODAL
// ============================================================
function CompareBar({ compareIds, onOpen, onClear, onRemove }) {
  if (compareIds.length === 0) return null;
  const items = compareIds.map(id => PRODUCTS.find(p => p.id === id));
  return (
    <div className="cmp-bar">
      <div className="cmp-bar__inner">
        <div className="cmp-bar__left">
          <span className="mono mono--xs mono--dim">COMPARAR · {compareIds.length}/4</span>
          <div className="cmp-bar__chips">
            {items.map(p => (
              <button key={p.id} className="cmp-bar__chip" onClick={()=>onRemove(p.id)}>
                <ProductArt product={p} size="sm"/>
                <span>{p.name}</span>
                <Icon name="close" size={11}/>
              </button>
            ))}
          </div>
        </div>
        <div className="cmp-bar__right">
          <button className="link-cta link-cta--sm" onClick={onClear}>Limpiar</button>
          <button className="btn btn--primary btn--sm" onClick={onOpen} disabled={compareIds.length<2}>
            Comparar ({compareIds.length}) <Icon name="arrow" size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareModal({ compareIds, onClose, onAddToCart, onOpenProduct, onRemove }) {
  useEffectC(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const items = compareIds.map(id => PRODUCTS.find(p => p.id === id));
  if (items.length === 0) return null;
  const allKeys = Array.from(new Set(items.flatMap(p => Object.keys(p.specs))));

  return (
    <>
      <div className="scrim is-open" onClick={onClose}/>
      <div className="cmp-modal">
        <header className="cmp-modal__head">
          <div>
            <h3>Comparación de productos</h3>
            <span className="mono mono--xs mono--dim">{items.length} productos · {allKeys.length+4} atributos</span>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={16}/></button>
        </header>
        <div className="cmp-modal__body">
          <table className="cmp-tbl">
            <thead>
              <tr>
                <th></th>
                {items.map(p => (
                  <th key={p.id}>
                    <div className="cmp-tbl__head">
                      <div className="cmp-tbl__media" onClick={()=>{onClose(); onOpenProduct(p.id);}}><ProductArt product={p} size="sm"/></div>
                      <div className="mono mono--xs mono--dim">{p.brand} · {p.sku}</div>
                      <button className="cmp-tbl__name" onClick={()=>{onClose(); onOpenProduct(p.id);}}>{p.name}</button>
                      <button className="cmp-tbl__rm" onClick={()=>onRemove(p.id)}><Icon name="close" size={11}/> Quitar</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cmp-tbl__k">Precio</td>
                {items.map(p => <td key={p.id} className="cmp-tbl__big">{fmt(p.price)}{p.was && <span className="cmp-tbl__was">{fmt(p.was)}</span>}</td>)}
              </tr>
              <tr>
                <td className="cmp-tbl__k">Calificación</td>
                {items.map(p => <td key={p.id}><Stars value={p.rating} size={11}/> <span className="mono mono--xs mono--dim">{p.rating}</span></td>)}
              </tr>
              <tr>
                <td className="cmp-tbl__k">Stock</td>
                {items.map(p => <td key={p.id}><StockBadge stock={p.stock}/></td>)}
              </tr>
              <tr>
                <td className="cmp-tbl__k">Categoría</td>
                {items.map(p => <td key={p.id}>{CATEGORIES.find(c=>c.id===p.category)?.name}</td>)}
              </tr>
              {allKeys.map(k => (
                <tr key={k}>
                  <td className="cmp-tbl__k">{k}</td>
                  {items.map(p => <td key={p.id}>{p.specs[k] || <span className="mono mono--xs mono--dim">—</span>}</td>)}
                </tr>
              ))}
              <tr>
                <td></td>
                {items.map(p => (
                  <td key={p.id}>
                    <button className="btn btn--primary btn--sm btn--block" onClick={()=>onAddToCart(p.id, 1)}>
                      <Icon name="plus" size={13}/> Agregar
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ============================================================
// SEARCH (command palette)
// ============================================================
function SearchModal({ open, onClose, onOpenProduct, onNav }) {
  const [q, setQ] = useStateC('');
  const inputRef = React.useRef(null);
  useEffectC(() => { if (open) setTimeout(()=>inputRef.current?.focus(), 30); }, [open]);
  useEffectC(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (!open) onClose(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const results = q.trim() ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())).slice(0,8) : [];
  const trending = ['Taladro 18V', 'Cinta métrica', 'Cemento gris', 'Casco dieléctrico'];

  return (
    <>
      <div className="scrim is-open" onClick={onClose}/>
      <div className="cmdk">
        <div className="cmdk__head">
          <Icon name="search" size={16}/>
          <input ref={inputRef} placeholder="Buscar productos, SKUs, marcas, categorías…" value={q} onChange={(e)=>setQ(e.target.value)}/>
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk__body">
          {q.trim() === '' ? (
            <>
              <div className="cmdk__section">
                <div className="cmdk__section-head mono mono--xs mono--dim">TENDENCIAS</div>
                <div className="cmdk__chips">
                  {trending.map(t => <button key={t} className="cmdk__chip" onClick={()=>setQ(t)}>{t}</button>)}
                </div>
              </div>
              <div className="cmdk__section">
                <div className="cmdk__section-head mono mono--xs mono--dim">EXPLORAR</div>
                {CATEGORIES.map(c => (
                  <button key={c.id} className="cmdk__row" onClick={()=>{onClose(); onNav('catalog', { category: c.id });}}>
                    <Icon name="box" size={14}/>
                    <span>{c.name}</span>
                    <span className="mono mono--xs mono--dim">{c.count} productos</span>
                    <Icon name="arrow" size={13} className="cmdk__row-arrow"/>
                  </button>
                ))}
              </div>
            </>
          ) : results.length === 0 ? (
            <div className="cmdk__empty">Sin resultados para "{q}"</div>
          ) : (
            <div className="cmdk__section">
              <div className="cmdk__section-head mono mono--xs mono--dim">PRODUCTOS · {results.length}</div>
              {results.map(p => (
                <button key={p.id} className="cmdk__row cmdk__row--prod" onClick={()=>{onClose(); onOpenProduct(p.id);}}>
                  <div className="cmdk__row-media"><ProductArt product={p} size="sm"/></div>
                  <div className="cmdk__row-info">
                    <div className="cmdk__row-name">{p.name}</div>
                    <div className="mono mono--xs mono--dim">{p.brand} · {p.sku}</div>
                  </div>
                  <div className="cmdk__row-price">{fmt(p.price)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="cmdk__foot">
          <span className="mono mono--xs mono--dim">↑↓ navegar</span>
          <span className="mono mono--xs mono--dim">↵ abrir</span>
          <span className="mono mono--xs mono--dim">ESC cerrar</span>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { CartDrawer, QuickView, CompareBar, CompareModal, SearchModal });
