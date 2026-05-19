import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useUIStore } from '@/store/ui.store';
import { GET_PRODUCTS } from '@/graphql/queries/catalog.queries';

/* ── Icons ── */
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18"/>
  </svg>
);
const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IconTag = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>
  </svg>
);

const fmt = (n: number) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const QUICK_LINKS = [
  { label: 'Herramientas manuales',   to: '/catalogo/herramientas-manuales' },
  { label: 'Herramientas eléctricas', to: '/catalogo/herramientas-electricas' },
  { label: 'Seguridad industrial',    to: '/catalogo/seguridad-industrial' },
  { label: 'Materiales construcción', to: '/catalogo/materiales-construccion' },
];

const SearchModal: React.FC = () => {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* Focus input when opens */
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setDebounced('');
      setSelected(0);
    }
  }, [searchOpen]);

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSearch]);

  /* ⌘K / Ctrl+K global shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().openSearch();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Debounce */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    setSelected(0);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(v), 280);
  };

  /* Query */
  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: { filters: { search: debounced }, page: 1, pageSize: 6 },
    skip: debounced.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  const results = data?.products.items ?? [];
  const total   = data?.products.pagination.total ?? 0;

  /* Keyboard navigation */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) {
      closeSearch();
      window.location.href = `/producto/${results[selected].slug}`;
    }
  }, [results, selected, closeSearch]);

  if (!searchOpen) return null;

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeSearch}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(4px)',
          animation: 'fadeIn .15s ease',
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Buscar productos"
        aria-modal="true"
        style={{
          position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 201, width: '100%', maxWidth: 640,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-md)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
          animation: 'slideUp .2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ color: 'var(--ink-3)', flexShrink: 0 }}><IconSearch /></span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos, SKUs, marcas..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.005em',
            }}
            aria-label="Buscar"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setDebounced(''); inputRef.current?.focus(); }}
              style={{ color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            >
              <IconX />
            </button>
          )}
          <kbd style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            padding: '2px 6px', border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--ink-4)', flexShrink: 0,
            background: 'var(--bg-soft)',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results or quick links */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>

          {/* Loading shimmer */}
          {loading && debounced.length >= 2 && (
            <div style={{ padding: '8px 0' }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '10px 16px', alignItems: 'center',
                }}>
                  <div className="shimmer" style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--r-xs)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="shimmer" style={{ height: 11, width: '60%', borderRadius: 2 }} />
                    <div className="shimmer" style={{ height: 11, width: '35%', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div>
              <div style={{
                padding: '8px 16px 4px',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {total} resultado{total !== 1 ? 's' : ''}{query ? ` para "${debounced}"` : ''}
              </div>
              {results.map((p: any, i: number) => (
                <Link
                  key={p.id}
                  to={`/producto/${p.slug}`}
                  onClick={closeSearch}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', textDecoration: 'none',
                    background: i === selected ? 'var(--bg-soft)' : 'transparent',
                    transition: 'background .1s',
                    borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  {/* Thumb */}
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    background: 'var(--bg-soft)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-xs)', overflow: 'hidden',
                  }}>
                    <img
                      src={p.images[0]?.url ?? '/placeholder.webp'}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
                      letterSpacing: '-0.005em', lineHeight: 1.3,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      marginBottom: 3,
                    }}>
                      {p.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {p.sku && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          color: 'var(--ink-4)', letterSpacing: '0.06em',
                        }}>
                          {p.sku}
                        </span>
                      )}
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        color: 'var(--ink-3)',
                      }}>
                        {p.category.name}
                      </span>
                    </div>
                  </div>

                  {/* Price + arrow */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                      {fmt(p.price)}
                    </p>
                    <span style={{ color: 'var(--ink-4)' }}><IconArrow /></span>
                  </div>
                </Link>
              ))}

              {/* View all link */}
              {total > 6 && (
                <Link
                  to={`/catalogo?q=${encodeURIComponent(debounced)}`}
                  onClick={closeSearch}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '12px 16px', fontSize: 12.5,
                    color: 'var(--accent)', fontWeight: 500,
                    borderTop: '1px solid var(--border)', textDecoration: 'none',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  Ver los {total} resultados para "{debounced}" <IconArrow />
                </Link>
              )}
            </div>
          )}

          {/* No results */}
          {!loading && debounced.length >= 2 && results.length === 0 && (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                Sin resultados para "{debounced}"
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
                Intenta con otro término o navega por categorías
              </p>
            </div>
          )}

          {/* Quick links (when no query) */}
          {debounced.length < 2 && !loading && (
            <div>
              <div style={{
                padding: '10px 16px 4px',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Acceso rápido
              </div>
              {QUICK_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeSearch}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 16px', textDecoration: 'none',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background .1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--ink-4)' }}><IconTag /></span>
                    <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{label}</span>
                  </div>
                  <span style={{ color: 'var(--ink-4)' }}><IconArrow /></span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 16px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          {[['↑↓', 'navegar'], ['↵', 'abrir'], ['esc', 'cerrar']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                padding: '1px 5px', border: '1px solid var(--border)',
                borderRadius: 3, color: 'var(--ink-4)', background: 'var(--bg-soft)',
              }}>
                {key}
              </kbd>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchModal;
