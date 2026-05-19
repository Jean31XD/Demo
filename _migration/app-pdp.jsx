/* global React, fmt, Icon, ProductArt, Stars, StockBadge, Tag, CATEGORIES, BRANDS, PRODUCTS, REVIEWS, ProductCard */

const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;

// ============================================================
// PDP
// ============================================================
function PDP({ productId, onNav, onAddToCart, onOpenProduct, onCompareToggle, compareIds }) {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const cat = CATEGORIES.find(c => c.id === product.category);
  const [qty, setQty] = useStateD(1);
  const [tab, setTab] = useStateD('specs');
  const [view, setView] = useStateD(0);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const productReviews = REVIEWS.filter(r => r.product === product.id);

  const handleAdd = () => onAddToCart(product.id, qty);

  return (
    <div className="page page--pdp">
      <div className="crumbs">
        <button onClick={()=>onNav('home')}>Inicio</button><Icon name="chevron" size={11}/>
        <button onClick={()=>onNav('catalog')}>Catálogo</button><Icon name="chevron" size={11}/>
        <button onClick={()=>onNav('catalog', { category: cat.id })}>{cat?.name}</button><Icon name="chevron" size={11}/>
        <span className="crumbs__here">{product.name}</span>
      </div>

      <div className="pdp">
        {/* GALLERY */}
        <div className="pdp__gallery">
          <div className="pdp__main-art">
            <ProductArt product={product}/>
            {product.badge && <span className="pdp__badge">{product.badge}</span>}
          </div>
          <div className="pdp__thumbs">
            {[0,1,2,3].map(i => (
              <button key={i} className={`pdp__thumb ${view===i?'is-active':''}`} onClick={()=>setView(i)}>
                <ProductArt product={product} size="sm"/>
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="pdp__info">
          <div className="pdp__meta">
            <span className="mono mono--xs">{product.sku}</span>
            <span className="mono mono--xs mono--dim">·</span>
            <span className="mono mono--xs">{product.brand}</span>
            <span className="mono mono--xs mono--dim">·</span>
            <button className="mono mono--xs link" onClick={()=>onNav('catalog', { category: cat.id })}>{cat?.name}</button>
          </div>
          <h1 className="pdp__title">{product.name}</h1>
          <div className="pdp__rating">
            <Stars value={product.rating} size={13}/>
            <span className="pdp__rating-num">{product.rating}</span>
            <span className="mono mono--xs mono--dim">{product.reviews} reseñas verificadas</span>
          </div>

          <div className="pdp__price-card">
            <div className="pdp__price-row">
              <div>
                <div className="pdp__price">{fmt(product.price)}</div>
                {product.was && <div className="pdp__was">Antes <s>{fmt(product.was)}</s> · Ahorra {fmt(product.was - product.price)}</div>}
              </div>
              <div className="pdp__price-meta">
                <span className="mono mono--xs mono--dim">PRECIO PRO</span>
                <span className="pdp__pro-price">{fmt(Math.round(product.price * 0.82))}</span>
                <button className="link-cta link-cta--sm">Solicitar →</button>
              </div>
            </div>
            <div className="pdp__stock-row">
              <StockBadge stock={product.stock}/>
              <span className="mono mono--xs mono--dim">SKU {product.sku}</span>
              <span className="mono mono--xs mono--dim">·</span>
              <span className="mono mono--xs mono--dim">{product.stock} unidades en CDMX</span>
            </div>
          </div>

          {/* color/variant placeholder */}
          <div className="pdp__opt">
            <div className="pdp__opt-head">
              <span className="mono mono--xs mono--dim">PRESENTACIÓN</span>
              <span className="mono mono--xs">Unitario</span>
            </div>
            <div className="seg seg--block">
              <button className="is-active">Unitario</button>
              <button>Pack 5u <span className="mono mono--xs mono--dim">-8%</span></button>
              <button>Pack 25u <span className="mono mono--xs mono--dim">-15%</span></button>
            </div>
          </div>

          <div className="pdp__qty-row">
            <div className="qty">
              <button onClick={()=>setQty(Math.max(1, qty-1))}><Icon name="minus" size={13}/></button>
              <input type="number" value={qty} onChange={(e)=>setQty(Math.max(1, +e.target.value || 1))}/>
              <button onClick={()=>setQty(qty+1)}><Icon name="plus" size={13}/></button>
            </div>
            <button className="btn btn--primary btn--lg" onClick={handleAdd}>
              Agregar — {fmt(product.price * qty)}
            </button>
            <button className={`btn btn--ghost btn--lg btn--icon ${compareIds.includes(product.id)?'is-on':''}`} onClick={()=>onCompareToggle(product.id)} title="Comparar">
              <Icon name="compare" size={16}/>
            </button>
          </div>

          <div className="pdp__benefits">
            <div className="pdp__benefit">
              <Icon name="truck" size={16}/>
              <div>
                <strong>Entrega Mañana 10am</strong>
                <span>CDMX y área metropolitana · Gratis &gt; $2,000</span>
              </div>
            </div>
            <div className="pdp__benefit">
              <Icon name="shield" size={16}/>
              <div>
                <strong>Garantía 12 meses</strong>
                <span>Directa con {product.brand} · Reposición sin trámite</span>
              </div>
            </div>
            <div className="pdp__benefit">
              <Icon name="pin" size={16}/>
              <div>
                <strong>Recoge en sucursal</strong>
                <span>Disponible en 4 de 6 sucursales — listo en 2hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="pdp__tabs">
        <div className="pdp__tabs-bar">
          {['specs', 'description', 'reviews', 'shipping', 'qa'].map(t => (
            <button key={t} className={tab===t?'is-active':''} onClick={()=>setTab(t)}>
              {{specs:'Especificaciones', description:'Descripción', reviews:`Reseñas (${product.reviews})`, shipping:'Envío e instalación', qa:'Preguntas'}[t]}
            </button>
          ))}
        </div>
        <div className="pdp__tabs-body">
          {tab === 'specs' && (
            <div className="specs-table">
              {Object.entries(product.specs).map(([k,v]) => (
                <div className="specs-table__row" key={k}>
                  <div className="specs-table__k mono mono--xs mono--dim">{k.toUpperCase()}</div>
                  <div className="specs-table__v">{v}</div>
                </div>
              ))}
              <div className="specs-table__row">
                <div className="specs-table__k mono mono--xs mono--dim">SKU</div>
                <div className="specs-table__v mono">{product.sku}</div>
              </div>
              <div className="specs-table__row">
                <div className="specs-table__k mono mono--xs mono--dim">MARCA</div>
                <div className="specs-table__v">{product.brand}</div>
              </div>
            </div>
          )}
          {tab === 'description' && (
            <div className="prose">
              <p>El <strong>{product.name}</strong> de {product.brand} está diseñado para profesionales y proyectos serios. Combina durabilidad, precisión y un acabado pensado para el uso diario en obra.</p>
              <p>Cada unidad pasa por inspección de calidad antes de salir de nuestro almacén central. Si por cualquier motivo no estás satisfecho, tienes 30 días para devolución completa.</p>
              <ul>
                <li>Garantía directa del fabricante por 12 meses</li>
                <li>Empaque de exportación, llega intacto a tu obra</li>
                <li>Soporte técnico en español de lunes a sábado</li>
              </ul>
            </div>
          )}
          {tab === 'reviews' && (
            <div className="reviews">
              <div className="reviews__summary">
                <div className="reviews__big">
                  <div className="reviews__big-num">{product.rating}</div>
                  <Stars value={product.rating} size={14}/>
                  <div className="mono mono--xs mono--dim">basado en {product.reviews} reseñas</div>
                </div>
                <div className="reviews__bars">
                  {[5,4,3,2,1].map(r => {
                    const pct = r===5?72:r===4?20:r===3?5:r===2?2:1;
                    return <div key={r} className="reviews__bar"><span className="mono mono--xs">{r}★</span><div className="reviews__bar-track"><div className="reviews__bar-fill" style={{width: pct+'%'}}/></div><span className="mono mono--xs mono--dim">{pct}%</span></div>;
                  })}
                </div>
              </div>
              <div className="reviews__list">
                {productReviews.length === 0 ? (
                  <div className="empty empty--inline">Aún no hay reseñas para este SKU.</div>
                ) : productReviews.map((r, i) => (
                  <div key={i} className="review">
                    <div className="review__head">
                      <strong>{r.author}</strong>
                      <span className="mono mono--xs mono--dim">{r.role}</span>
                      {r.verified && <Tag kind="ok"><Icon name="check" size={10}/> Compra verificada</Tag>}
                      <span className="mono mono--xs mono--dim">{r.date}</span>
                    </div>
                    <Stars value={r.rating} size={12}/>
                    <p>{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'shipping' && (
            <div className="ship-grid">
              <div className="ship-card">
                <Icon name="truck" size={18}/>
                <h4>Envío estándar</h4>
                <p>24-48hrs · 32 ciudades. Gratis en pedidos &gt; $2,000 MXN.</p>
              </div>
              <div className="ship-card">
                <Icon name="package" size={18}/>
                <h4>Envío exprés</h4>
                <p>Mismo día en CDMX (pedidos antes de 14:00). $99 fijo.</p>
              </div>
              <div className="ship-card">
                <Icon name="pin" size={18}/>
                <h4>Recoge en sucursal</h4>
                <p>Listo en 2 horas. Sin costo. 6 sucursales en CDMX y EdoMex.</p>
              </div>
            </div>
          )}
          {tab === 'qa' && (
            <div className="qa">
              {[
                { q: '¿Incluye batería y cargador?', a: 'Sí, viene con 2 baterías de 4.0 Ah y cargador rápido.' },
                { q: '¿Compatible con accesorios de otra marca?', a: 'El mandril es estándar, acepta brocas de cualquier marca de hasta 13mm.' },
                { q: '¿Aplica garantía si lo uso en obra?', a: 'Sí, la garantía cubre uso profesional moderado por 12 meses.' },
              ].map((it, i) => (
                <details key={i} className="qa__item">
                  <summary>{it.q}</summary>
                  <p>{it.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RELATED */}
      <div className="block">
        <div className="section-head">
          <div>
            <div className="eyebrow">PRODUCTOS RELACIONADOS</div>
            <h2 className="section-head__title">Otros en {cat?.name}</h2>
          </div>
        </div>
        <div className="prod-grid prod-grid--4">
          {related.map(p => (
            <ProductCard key={p.id} product={p} onOpen={()=>onOpenProduct(p.id)} onAdd={()=>onAddToCart(p.id, 1)} onQuick={()=>onOpenProduct(p.id)} onCompareToggle={()=>onCompareToggle(p.id)} isCompared={compareIds.includes(p.id)}/>
          ))}
        </div>
      </div>

      {/* MOBILE STICKY ADD-TO-CART */}
      <div className="pdp__sticky">
        <div className="pdp__sticky-info">
          <div className="pdp__sticky-name">{product.name}</div>
          <div className="pdp__sticky-price">{fmt(product.price * qty)} <span className="mono mono--xs mono--dim">· {qty} u.</span></div>
        </div>
        <button className="btn btn--primary" onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </div>
  );
}

Object.assign(window, { PDP });
