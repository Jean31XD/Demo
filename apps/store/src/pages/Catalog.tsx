import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/graphql/queries/catalog.queries';
import ProductList from '@/features/catalog/components/ProductList';

/* ── Inline icons ── */
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18"/>
  </svg>
);
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

const BRANDS_LIST = [
  { id: 'kraft',    name: 'KRAFT' },
  { id: 'voltra',   name: 'VOLTRA' },
  { id: 'ironhaus', name: 'IRONHAUS' },
  { id: 'strike',   name: 'STRIKE' },
  { id: 'proforge', name: 'PROFORGE' },
  { id: 'armor',    name: 'ARMOR' },
  { id: 'norde',    name: 'NORDE' },
  { id: 'axis',     name: 'AXIS' },
];

const HISTOGRAM_DATA = [
  { height: 25 },
  { height: 35 },
  { height: 50 },
  { height: 75 },
  { height: 95 },
  { height: 85 },
  { height: 60 },
  { height: 40 },
  { height: 30 },
  { height: 20 },
];

const Catalog: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const brandParam = searchParams.get('marca') ?? undefined;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(5000);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data } = useQuery(GET_CATEGORIES);
  const categories = data?.categories ?? [];
  const currentCat = categories.find((c: any) => c.slug === category);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 350);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
  }, []);

  const handlePriceChange = useCallback((val: number) => {
    setMaxPrice(val);
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      setDebouncedMaxPrice(val);
    }, 350);
  }, []);

  const clearPriceFilter = useCallback(() => {
    setMaxPrice(5000);
    setDebouncedMaxPrice(5000);
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
  }, []);

  const handleBrandToggle = useCallback((brandId: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get('marca') === brandId) {
      params.delete('marca');
    } else {
      params.set('marca', brandId);
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setSearch('');
    setDebouncedSearch('');
    setMaxPrice(5000);
    setDebouncedMaxPrice(5000);
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
  }, [category]);

  return (
    <div style={{ animation: 'slideUp .3s ease' }}>

      {/* Breadcrumb */}
      <nav className="crumbs">
        <Link to="/">Inicio</Link>
        <span>/</span>
        {currentCat ? (
          <>
            <Link to="/catalogo">Catálogo</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{currentCat.name}</span>
          </>
        ) : (
          <span style={{ color: 'var(--ink)' }}>Catálogo</span>
        )}
      </nav>

      {/* Page header */}
      <div className="section-head" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600,
            letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1,
          }}>
            {currentCat ? currentCat.name : 'Catálogo completo'}
          </h1>
          {currentCat?.description && (
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6, maxWidth: '60ch' }}>
              {currentCat.description}
            </p>
          )}
        </div>
      </div>

      <div className="plp__layout">

        {/* Sidebar / Filters */}
        <aside className="filters">
          <div className="filter-block">
            <p className="filter-block__head">Categorías</p>
            <div className="filter-block__body">
              <NavLink
                to="/catalogo"
                end
                className={({ isActive }) =>
                  `filter-row${isActive ? ' filter-row--active' : ''}`
                }
              >
                <span>Todo el catálogo</span>
                {!category && <IconChevron />}
              </NavLink>
              {categories.map((cat: any) => (
                <NavLink
                  key={cat.id}
                  to={`/catalogo/${cat.slug}`}
                  className={({ isActive }) =>
                    `filter-row${isActive ? ' filter-row--active' : ''}`
                  }
                >
                  <span>{cat.name}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    padding: '1px 5px',
                    background: category === cat.slug ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-soft)',
                    color: category === cat.slug ? 'var(--accent)' : 'var(--ink-4)',
                    borderRadius: 3,
                  }}>
                    {cat.productCount}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Presupuesto / Precio Block */}
          <div className="filter-block">
            <div className="filter-block__head">
              <span>Precio</span>
              {maxPrice < 5000 && (
                <button
                  onClick={clearPriceFilter}
                  style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="filter-block__body" style={{ padding: '4px 0 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 12 }}>
                <span>RD$0</span>
                <span>RD${maxPrice.toLocaleString()}</span>
              </div>
              
              {/* Histogram bars */}
              <div style={{ display: 'flex', alignItems: 'end', gap: 3, height: 48, marginBottom: 14, padding: '0 4px' }}>
                {HISTOGRAM_DATA.map((bar, idx) => {
                  const barMaxPrice = (idx + 1) * 500;
                  const isActive = barMaxPrice <= maxPrice;
                  return (
                    <div 
                      key={idx}
                      style={{
                        flex: 1,
                        height: `${bar.height}%`,
                        backgroundColor: isActive ? 'var(--accent)' : 'var(--border-strong)',
                        borderRadius: '2px 2px 0 0',
                        transition: 'background-color 0.2s ease',
                      }}
                      title={`Rango: RD$${barMaxPrice - 500} - RD$${barMaxPrice}`}
                    />
                  );
                })}
              </div>
              
              {/* Range slider */}
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="250"
                value={maxPrice} 
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent)',
                  cursor: 'pointer',
                  height: 6,
                  borderRadius: 3,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Marca Block */}
          <div className="filter-block">
            <div className="filter-block__head">
              <span>Marca</span>
              {brandParam && (
                <button
                  onClick={() => handleBrandToggle(brandParam)}
                  style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="filter-block__body" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0 0' }}>
              {BRANDS_LIST.map((b) => {
                const isChecked = brandParam === b.id;
                return (
                  <button 
                    key={b.id} 
                    onClick={() => handleBrandToggle(b.id)}
                    className={`check${isChecked ? ' is-active' : ''}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', textAlign: 'left', width: '100%', outline: 'none' }}
                  >
                    <span className="check__box" style={{ marginRight: 8 }}>
                      {isChecked && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span>{b.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product area */}
        <div className="plp__main">

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--ink-4)', pointerEvents: 'none',
            }}>
              <IconSearch />
            </span>
            <input
              type="search"
              placeholder="Buscar por nombre, SKU o descripción..."
              value={search}
              onChange={handleSearch}
              className="input"
              style={{ paddingLeft: 36, paddingRight: search ? 36 : 12 }}
              aria-label="Buscar herramientas"
            />
            {search && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--ink-4)', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  transition: 'color .15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-4)'; }}
                aria-label="Limpiar búsqueda"
              >
                <IconX />
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {(debouncedSearch || currentCat || brandParam || debouncedMaxPrice < 5000) && (
            <div className="chips" style={{ marginBottom: 16 }}>
              {currentCat && (
                <Link to={`/catalogo${brandParam ? `?marca=${brandParam}` : ''}`} className="chip chip--active">
                  {currentCat.name} <IconX />
                </Link>
              )}
              {brandParam && (
                <button 
                  className="chip chip--active"
                  onClick={() => handleBrandToggle(brandParam)}
                >
                  Marca: {brandParam.toUpperCase()} <IconX />
                </button>
              )}
              {debouncedMaxPrice < 5000 && (
                <button className="chip chip--active" onClick={clearPriceFilter}>
                  Presupuesto: ≤ RD${debouncedMaxPrice.toLocaleString()} <IconX />
                </button>
              )}
              {debouncedSearch && (
                <button className="chip chip--active" onClick={clearSearch}>
                  "{debouncedSearch}" <IconX />
                </button>
              )}
            </div>
          )}

          <ProductList
            key={`${currentCat?.id ?? 'all'}-${brandParam ?? ''}-${debouncedSearch}`}
            filters={{
              categoryId: currentCat?.id ?? undefined,
              brand: brandParam,
              search: debouncedSearch || undefined,
              maxPrice: debouncedMaxPrice < 5000 ? debouncedMaxPrice : undefined,
            }}
            pageSize={12}
          />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
