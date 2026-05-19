/* global React, fmt, Icon, ProductArt, CategoryArt, Stars, StockBadge, Tag, SectionHead, CATEGORIES, BRANDS, PRODUCTS, REVIEWS, useTweaks, TweaksPanel, TweakSection, TweakColor */

const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// HEADER
// ============================================================
function Header({ nav, onNav, cartCount, onOpenCart, onOpenSearch, compareCount, onOpenCompare }) {
  return (
    <header className="hdr">
      <div className="hdr__inner">
        <div className="hdr__left">
          <button className="logo" onClick={() => onNav('home')}>
            <Icon name="logo" size={22}/>
            <span className="logo__name">Ferretería <span className="logo__dim">Industrial</span></span>
          </button>
          <nav className="hdr__nav">
            <button className={nav==='catalog'?'is-active':''} onClick={()=>onNav('catalog')}>Catálogo</button>
            <button className={nav==='brands'?'is-active':''} onClick={()=>onNav('brands')}>Marcas</button>
            <button className={nav==='catalog' ? 'is-active' : ''} onClick={()=>onNav('catalog', { onlyOffer: true })}>Ofertas <span className="dot-accent"/></button>
            <button className={nav==='support'?'is-active':''} onClick={()=>onNav('support')}>Soporte</button>
          </nav>
        </div>
        <div className="hdr__right">
          <button className="hdr__search" onClick={onOpenSearch}>
            <Icon name="search" size={15}/>
            <span>Buscar productos, SKUs, marcas</span>
            <kbd>⌘K</kbd>
          </button>
          {compareCount > 0 && (
            <button className="hdr__btn" onClick={onOpenCompare}>
              <Icon name="compare" size={16}/>
              <span className="hdr__btn-label">Comparar</span>
              <span className="hdr__count">{compareCount}</span>
            </button>
          )}
          <button className="hdr__btn" onClick={()=>onNav('account')}>
            <Icon name="user" size={16}/>
            <span className="hdr__btn-label">Cuenta</span>
          </button>
          <button className="hdr__btn hdr__btn--cart" onClick={onOpenCart}>
            <Icon name="cart" size={16}/>
            <span>Carrito</span>
            {cartCount > 0 && <span className="hdr__count hdr__count--accent">{cartCount}</span>}
          </button>
        </div>
      </div>
      <div className="hdr__strip">
        <div><Icon name="truck" size={13}/> Envío gratis &gt; $2,000 MXN · 24-48hrs</div>
        <div className="hdr__strip-dim">·</div>
        <div><Icon name="shield" size={13}/> Garantía directa de fabricante</div>
        <div className="hdr__strip-dim">·</div>
        <div><Icon name="phone" size={13}/> Asesoría técnica: 800 123 4567</div>
      </div>
    </header>
  );
}

// ============================================================
// HOME
// ============================================================
function Home({ onNav, onOpenProduct, onAddToCart, onQuickView }) {
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 4);
  const newArrivals = PRODUCTS.slice(8, 12);

  return (
    <div className="page page--home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__left">
            <div className="eyebrow"><span className="eyebrow__dot"/> ABIERTO · 8:00 — 19:00 · LUN-SAB</div>
            <h1 className="hero__title">
              Todo lo que tu obra<br/>
              necesita, en stock,<br/>
              <span className="hero__title-em">a 24 horas.</span>
            </h1>
            <p className="hero__lead">
              Más de 1,800 SKUs en herramientas, fijación, materiales y EPP.
              Para profesionales que no pueden parar y proyectos que no pueden esperar.
            </p>
            <div className="hero__cta">
              <button className="btn btn--primary" onClick={()=>onNav('catalog')}>
                Ver catálogo completo <Icon name="arrow" size={15}/>
              </button>
              <button className="btn btn--ghost" onClick={()=>onNav('catalog')}>
                Productos en oferta
              </button>
            </div>
            <dl className="hero__stats">
              <div><dt>SKUs activos</dt><dd>1,803</dd></div>
              <div><dt>Marcas</dt><dd>42</dd></div>
              <div><dt>Pedidos al mes</dt><dd>12k+</dd></div>
              <div><dt>Sucursales</dt><dd>6</dd></div>
            </dl>
          </div>
          <div className="hero__right">
            <div className="hero__photo">
              <img src={HERO_IMG} alt="Herramienta profesional" loading="eager" onError={(e)=>{e.currentTarget.style.display='none';}}/>
              <div className="hero__photo-overlay">
                <div className="mono mono--xs">EN OBRA — JEFATURA POLANCO · 11:42 AM</div>
                <div className="hero__photo-meta">
                  <span><Icon name="package" size={12}/> 38 entregas hoy</span>
                  <span><Icon name="truck" size={12}/> 12 rutas activas</span>
                </div>
              </div>
            </div>
            <div className="hero__panel">
              <div className="hero__panel-head">
                <span className="mono mono--dim">// STATUS</span>
                <span className="hero__panel-live"><span className="pulse"/> Inventario en vivo</span>
              </div>
              <div className="hero__panel-rows">
                {[
                  { sku: 'EL-DRL-018', name: 'Taladro percutor 18V',     stock: 24, eta: 'Mañana 10am' },
                  { sku: 'HM-WRN-SET', name: 'Set llaves combinadas',     stock: 32, eta: 'Mañana 10am' },
                  { sku: 'MT-CMT-050', name: 'Cemento gris 50kg',         stock: 320, eta: 'Hoy 18:00' },
                ].map(r => (
                  <div className="hero__panel-row" key={r.sku}>
                    <div className="hero__panel-row-left">
                      <span className="mono mono--xs">{r.sku}</span>
                      <span>{r.name}</span>
                    </div>
                    <div className="hero__panel-row-right">
                      <span className="mono mono--xs mono--dim">{r.stock} u.</span>
                      <span className="hero__panel-eta">{r.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hero__panel-foot">
                <span className="mono mono--xs mono--dim">Actualizado hace 12s</span>
                <button className="link-cta" onClick={()=>onNav('catalog')}>Ver inventario <Icon name="arrow" size={12}/></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="block">
        <SectionHead eyebrow="01 / CATEGORÍAS" title="Compra por departamento" cta="Ver todo el catálogo" onCta={()=>onNav('catalog')}/>
        <div className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <button key={c.id} className="cat-card" onClick={()=>onNav('catalog', { category: c.id })}>
              <div className="cat-card__media">
                <img src={c.img} alt={c.name} loading="lazy" onError={(e)=>{ e.currentTarget.style.display='none'; e.currentTarget.parentElement.classList.add('cat-card__media--fallback'); }}/>
                <div className="cat-card__overlay"/>
                <div className="cat-card__art-fallback"><CategoryArt id={c.id}/></div>
                <div className="cat-card__media-num">0{i+1}</div>
                <div className="cat-card__media-arrow"><Icon name="arrow-up-right" size={14}/></div>
              </div>
              <div className="cat-card__foot">
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
                <span className="mono mono--xs mono--dim">{c.count} productos →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="block block--values">
        <div className="values">
          {[
            { icon: 'truck',   title: 'Entrega 24-48h',   body: 'En 32 ciudades. Envío gratis en pedidos > $2,000 MXN.' },
            { icon: 'shield',  title: 'Garantía real',     body: 'Directa de fabricante. Reposición sin trámites largos.' },
            { icon: 'package', title: 'Crédito empresa',   body: '30 días para constructoras y contratistas verificados.' },
            { icon: 'phone',   title: 'Asesoría técnica',  body: 'Ingenieros en línea para cotizar tu proyecto completo.' },
          ].map(v => (
            <div className="values__item" key={v.title}>
              <Icon name={v.icon} size={20}/>
              <h4>{v.title}</h4>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="block">
        <SectionHead eyebrow="02 / DESTACADOS" title="Top de la semana" cta="Ver más" onCta={()=>onNav('catalog')}/>
        <div className="prod-grid prod-grid--4">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onOpen={()=>onOpenProduct(p.id)} onQuick={()=>onQuickView(p.id)} onAdd={()=>onAddToCart(p.id)}/>
          ))}
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="block">
        <div className="brand-strip">
          <span className="mono mono--xs mono--dim">MARCAS QUE TRABAJAMOS  ·  42 EN TOTAL</span>
          <div className="brand-strip__row">
            {BRANDS.map(b => <span key={b} className="brand-strip__item">{b}</span>)}
          </div>
        </div>
      </section>

      {/* NEW */}
      <section className="block">
        <SectionHead eyebrow="03 / NUEVOS" title="Recién llegados" cta="Ver más" onCta={()=>onNav('catalog')}/>
        <div className="prod-grid prod-grid--4">
          {newArrivals.map(p => (
            <ProductCard key={p.id} product={p} onOpen={()=>onOpenProduct(p.id)} onQuick={()=>onQuickView(p.id)} onAdd={()=>onAddToCart(p.id)}/>
          ))}
        </div>
      </section>

      {/* PRO PROGRAM CTA */}
      <section className="block">
        <div className="pro-cta">
          <div>
            <div className="eyebrow">PROGRAMA PROFESIONAL</div>
            <h2>Precios de mayorista, factura electrónica<br/>y crédito a 30 días.</h2>
            <p>Para constructoras, contratistas, talleres y profesionales independientes verificados.</p>
            <button className="btn btn--primary">Solicitar cuenta Pro <Icon name="arrow" size={15}/></button>
          </div>
          <div className="pro-cta__meta">
            <div><span className="mono mono--xs mono--dim">DESCUENTO PROMEDIO</span><strong>-18%</strong></div>
            <div><span className="mono mono--xs mono--dim">CRÉDITO</span><strong>30 días</strong></div>
            <div><span className="mono mono--xs mono--dim">FACTURA</span><strong>Automática</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product, onOpen, onQuick, onAdd, onCompareToggle, isCompared }) {
  const cat = CATEGORIES.find(c => c.id === product.category);
  return (
    <article className="pc">
      <div className="pc__media" onClick={onOpen}>
        <ProductArt product={product}/>
        {product.badge && <span className="pc__badge">{product.badge}</span>}
        {product.was && <span className="pc__discount">-{Math.round((1 - product.price/product.was)*100)}%</span>}
        <div className="pc__hover">
          <button className="pc__icon-btn" onClick={(e)=>{e.stopPropagation(); onQuick();}} title="Vista rápida"><Icon name="eye" size={14}/></button>
          {onCompareToggle && (
            <button className={`pc__icon-btn ${isCompared?'is-active':''}`} onClick={(e)=>{e.stopPropagation(); onCompareToggle();}} title="Comparar"><Icon name="compare" size={14}/></button>
          )}
        </div>
      </div>
      <div className="pc__body" onClick={onOpen}>
        <div className="pc__meta">
          <span className="mono mono--xs mono--dim">{product.brand}</span>
          <span className="mono mono--xs mono--dim">·</span>
          <span className="mono mono--xs mono--dim">{cat?.short}</span>
        </div>
        <h3 className="pc__name">{product.name}</h3>
        <div className="pc__rating">
          <Stars value={product.rating} size={11}/>
          <span className="mono mono--xs mono--dim">{product.rating} · {product.reviews}</span>
        </div>
        <div className="pc__price-row">
          <div className="pc__price">
            {fmt(product.price)}
            {product.was && <span className="pc__was">{fmt(product.was)}</span>}
          </div>
          <StockBadge stock={product.stock}/>
        </div>
      </div>
      <button className="pc__add" onClick={(e)=>{e.stopPropagation(); onAdd();}}>
        <Icon name="plus" size={14}/> Agregar
      </button>
    </article>
  );
}

Object.assign(window, { Header, Home, ProductCard });
