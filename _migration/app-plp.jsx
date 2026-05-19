/* global React, fmt, Icon, ProductArt, Stars, StockBadge, Tag, CATEGORIES, BRANDS, PRODUCTS, REVIEWS, ProductCard */

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

// ============================================================
// PLP — Catálogo
// ============================================================
function PLP({ filter, onOpenProduct, onAddToCart, onQuickView, compareIds, onCompareToggle }) {
  const [cat, setCat] = useStateP(filter?.category || 'all');
  const [view, setView] = useStateP('grid');
  const [sort, setSort] = useStateP('relevance');
  const [search, setSearch] = useStateP('');
  const [priceMax, setPriceMax] = useStateP(5000);
  const [selBrands, setSelBrands] = useStateP([]);
  const [onlyStock, setOnlyStock] = useStateP(false);
  const [onlyOffer, setOnlyOffer] = useStateP(filter?.onlyOffer || false);

  useEffectP(() => {
    if (filter?.category) setCat(filter.category);
    if (filter?.onlyOffer !== undefined) setOnlyOffer(!!filter.onlyOffer);
    if (filter?.brand) setSelBrands([filter.brand]);
  }, [filter]);

  const filtered = useMemoP(() => {
    let r = PRODUCTS.slice();
    if (cat !== 'all') r = r.filter(p => p.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    r = r.filter(p => p.price <= priceMax);
    if (selBrands.length) r = r.filter(p => selBrands.includes(p.brand));
    if (onlyStock) r = r.filter(p => p.stock > 0);
    if (onlyOffer) r = r.filter(p => p.was);
    if (sort === 'price-asc') r.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') r.sort((a,b) => b.price - a.price);
    if (sort === 'rating') r.sort((a,b) => b.rating - a.rating);
    if (sort === 'new') r.reverse();
    return r;
  }, [cat, search, priceMax, selBrands, onlyStock, onlyOffer, sort]);

  const toggleBrand = (b) => setSelBrands(s => s.includes(b) ? s.filter(x=>x!==b) : [...s, b]);
  const clearAll = () => { setCat('all'); setSearch(''); setPriceMax(5000); setSelBrands([]); setOnlyStock(false); setOnlyOffer(false); };
  const activeChips = [
    cat !== 'all' && { key:'cat', label: CATEGORIES.find(c=>c.id===cat)?.name, on: () => setCat('all') },
    onlyStock && { key:'stock', label: 'Solo en stock', on: () => setOnlyStock(false) },
    onlyOffer && { key:'offer', label: 'En oferta', on: () => setOnlyOffer(false) },
    ...selBrands.map(b => ({ key:'b-'+b, label: b, on: () => toggleBrand(b) })),
    priceMax < 5000 && { key:'price', label: 'Hasta ' + fmt(priceMax), on: () => setPriceMax(5000) },
  ].filter(Boolean);

  return (
    <div className="page page--plp">
      <div className="crumbs">
        <span>Inicio</span><Icon name="chevron" size={11}/>
        <span>Catálogo</span>
        {cat !== 'all' && <>
          <Icon name="chevron" size={11}/>
          <span className="crumbs__here">{CATEGORIES.find(c=>c.id===cat)?.name}</span>
        </>}
      </div>

      <div className="plp__head">
        <div>
          <h1 className="plp__title">{onlyOffer ? 'Ofertas activas' : cat === 'all' ? 'Catálogo completo' : CATEGORIES.find(c=>c.id===cat)?.name}</h1>
          <p className="plp__sub">{filtered.length} productos · {filtered.reduce((s,p)=>s+p.stock,0).toLocaleString()} unidades disponibles{onlyOffer && ' · ahorro promedio 12%'}</p>
        </div>
        <div className="plp__head-actions">
          <div className="plp__search">
            <Icon name="search" size={14}/>
            <input placeholder="Buscar por nombre, SKU o marca…" value={search} onChange={(e)=>setSearch(e.target.value)}/>
          </div>
          <div className="seg">
            <button className={view==='grid'?'is-active':''} onClick={()=>setView('grid')}><Icon name="grid" size={14}/></button>
            <button className={view==='list'?'is-active':''} onClick={()=>setView('list')}><Icon name="rows" size={14}/></button>
          </div>
          <div className="sort">
            <span className="mono mono--xs mono--dim">ORDENAR</span>
            <select value={sort} onChange={(e)=>setSort(e.target.value)}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor</option>
              <option value="price-desc">Precio: mayor</option>
              <option value="rating">Mejor valorados</option>
              <option value="new">Más nuevos</option>
            </select>
            <Icon name="chevron-down" size={12}/>
          </div>
        </div>
      </div>

      <div className="plp__layout">
        {/* SIDEBAR */}
        <aside className="filters">
          <div className="filters__head">
            <span className="mono mono--xs mono--dim">FILTROS</span>
            <button className="link-cta link-cta--sm" onClick={clearAll}>Limpiar</button>
          </div>

          <FilterBlock title="Categoría">
            <button className={`filter-row ${cat==='all'?'is-active':''}`} onClick={()=>setCat('all')}>
              <span>Todas</span>
              <span className="mono mono--xs mono--dim">{PRODUCTS.length}</span>
            </button>
            {CATEGORIES.map(c => (
              <button key={c.id} className={`filter-row ${cat===c.id?'is-active':''}`} onClick={()=>setCat(c.id)}>
                <span>{c.name}</span>
                <span className="mono mono--xs mono--dim">{c.count}</span>
              </button>
            ))}
          </FilterBlock>

          <FilterBlock title="Precio">
            <div className="filter-price">
              <div className="filter-price__values">
                <span className="mono mono--xs">$0</span>
                <span className="mono mono--xs">{fmt(priceMax)}</span>
              </div>
              <input type="range" min="100" max="5000" step="50" value={priceMax} onChange={(e)=>setPriceMax(+e.target.value)}/>
              <div className="filter-price__hist">
                {[8,14,22,38,46,42,30,18,12,6].map((h,i)=>(
                  <span key={i} className="filter-price__bar" style={{height: h+'px', background: (i/10)*5000 < priceMax ? 'var(--accent)' : 'var(--border-strong)'}}/>
                ))}
              </div>
            </div>
          </FilterBlock>

          <FilterBlock title="Marca">
            <div className="filter-brands">
              {BRANDS.map(b => (
                <button key={b} className={`check ${selBrands.includes(b)?'is-active':''}`} onClick={()=>toggleBrand(b)}>
                  <span className="check__box">{selBrands.includes(b) && <Icon name="check" size={10}/>}</span>
                  <span>{b}</span>
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Disponibilidad">
            <button className={`check ${onlyStock?'is-active':''}`} onClick={()=>setOnlyStock(!onlyStock)}>
              <span className="check__box">{onlyStock && <Icon name="check" size={10}/>}</span>
              <span>Solo en stock</span>
            </button>
            <button className={`check ${onlyOffer?'is-active':''}`} onClick={()=>setOnlyOffer(!onlyOffer)}>
              <span className="check__box">{onlyOffer && <Icon name="check" size={10}/>}</span>
              <span>En oferta</span>
            </button>
          </FilterBlock>

          <FilterBlock title="Calificación">
            {[4,3].map(min => (
              <button key={min} className="filter-row"><span><Stars value={min} size={11}/></span><span className="mono mono--xs mono--dim">{min}+</span></button>
            ))}
          </FilterBlock>
        </aside>

        {/* GRID */}
        <section className="plp__main">
          {activeChips.length > 0 && (
            <div className="chips">
              {activeChips.map(c => (
                <button key={c.key} className="chip" onClick={c.on}>{c.label} <Icon name="close" size={11}/></button>
              ))}
              <button className="chips__clear" onClick={clearAll}>Limpiar todo</button>
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="empty">
              <Icon name="search" size={28}/>
              <h3>Sin resultados</h3>
              <p>Probá quitar filtros o buscar otro término.</p>
              <button className="btn btn--ghost" onClick={clearAll}>Limpiar filtros</button>
            </div>
          ) : view === 'grid' ? (
            <div className="prod-grid prod-grid--3">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onOpen={()=>onOpenProduct(p.id)} onQuick={()=>onQuickView(p.id)} onAdd={()=>onAddToCart(p.id)} onCompareToggle={()=>onCompareToggle(p.id)} isCompared={compareIds.includes(p.id)}/>
              ))}
            </div>
          ) : (
            <div className="plp__list">
              {filtered.map(p => (
                <PListRow key={p.id} product={p} onOpen={()=>onOpenProduct(p.id)} onQuick={()=>onQuickView(p.id)} onAdd={()=>onAddToCart(p.id)} onCompareToggle={()=>onCompareToggle(p.id)} isCompared={compareIds.includes(p.id)}/>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }) {
  const [open, setOpen] = useStateP(true);
  return (
    <div className="filter-block">
      <button className="filter-block__head" onClick={()=>setOpen(!open)}>
        <span>{title}</span>
        <Icon name="chevron-down" size={12} className={open?'rotated':''}/>
      </button>
      {open && <div className="filter-block__body">{children}</div>}
    </div>
  );
}

function PListRow({ product, onOpen, onQuick, onAdd, onCompareToggle, isCompared }) {
  const cat = CATEGORIES.find(c => c.id === product.category);
  return (
    <article className="plist">
      <div className="plist__media" onClick={onOpen}><ProductArt product={product} size="sm"/></div>
      <div className="plist__body">
        <div className="plist__meta">
          <span className="mono mono--xs mono--dim">{product.sku}</span>
          <span className="mono mono--xs mono--dim">·</span>
          <span className="mono mono--xs mono--dim">{product.brand}</span>
          <span className="mono mono--xs mono--dim">·</span>
          <span className="mono mono--xs mono--dim">{cat?.short}</span>
          {product.badge && <Tag kind="accent">{product.badge}</Tag>}
        </div>
        <h3 className="plist__name" onClick={onOpen}>{product.name}</h3>
        <div className="plist__specs">
          {Object.entries(product.specs).slice(0,3).map(([k,v]) => (
            <span key={k} className="plist__spec"><span className="mono mono--xs mono--dim">{k}:</span> {v}</span>
          ))}
        </div>
        <div className="plist__foot">
          <Stars value={product.rating} size={11}/>
          <span className="mono mono--xs mono--dim">{product.rating} · {product.reviews} reseñas</span>
          <span className="plist__sep">·</span>
          <StockBadge stock={product.stock}/>
        </div>
      </div>
      <div className="plist__right">
        <div className="plist__price">
          {fmt(product.price)}
          {product.was && <span className="plist__was">{fmt(product.was)}</span>}
        </div>
        <div className="plist__actions">
          <button className="btn btn--ghost btn--sm" onClick={onQuick}><Icon name="eye" size={13}/> Vista</button>
          <button className={`btn btn--ghost btn--sm ${isCompared?'is-on':''}`} onClick={onCompareToggle}><Icon name="compare" size={13}/></button>
          <button className="btn btn--primary btn--sm" onClick={onAdd}><Icon name="plus" size={13}/> Agregar</button>
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { PLP });
