import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import { GET_ADMIN_PRODUCTS, GET_CATEGORIES } from '@/graphql/queries/products.queries';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '@/graphql/mutations/products.mutations';
import DataTable, { type Column } from '@/components/common/DataTable';
import type { Product, ProductsResult } from '@/types';

const PAGE_SIZE = 10;

const ProductsTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modal & Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  // Queries
  const { data, loading, error } = useQuery<ProductsResult>(GET_ADMIN_PRODUCTS, {
    variables: { filters: search ? { search } : {}, page, pageSize: PAGE_SIZE },
  });

  const { data: catData } = useQuery(GET_CATEGORIES);
  const categories = catData?.categories ?? [];

  // Mutations
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_ADMIN_PRODUCTS, variables: { filters: search ? { search } : {}, page, pageSize: PAGE_SIZE } }],
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_ADMIN_PRODUCTS, variables: { filters: search ? { search } : {}, page, pageSize: PAGE_SIZE } }],
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_ADMIN_PRODUCTS, variables: { filters: search ? { search } : {}, page, pageSize: PAGE_SIZE } }],
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice(0);
    setCompareAtPrice('');
    setSku('');
    setBrand('');
    setCategoryId(categories[0]?.id ?? '');
    setStock(0);
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = useCallback((p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description ?? '');
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice ?? '');
    setSku(p.sku ?? '');
    setBrand(p.brand ?? '');
    setCategoryId(p.category.id);
    setStock(p.inventory.quantity);
    setImageUrl(p.images[0]?.url ?? '');
    setIsModalOpen(true);
  }, [categories]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct({ variables: { id } });
      } catch (err: any) {
        alert('Error al eliminar producto: ' + err.message);
      }
    }
  }, [deleteProduct]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !categoryId) {
      alert('Por favor completa los campos requeridos (Nombre, Slug, Categoría).');
      return;
    }

    const input = {
      name,
      slug,
      description: description || null,
      price: parseFloat(price.toString()),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice.toString()) : null,
      sku: sku || null,
      brand: brand.toLowerCase() || null,
      categoryId,
      images: imageUrl ? [{ url: imageUrl, alt: name }] : [],
      attributes: [],
      inventory: { quantity: parseInt(stock.toString()) },
    };

    try {
      if (editingProduct) {
        await updateProduct({
          variables: {
            id: editingProduct.id,
            input: {
              name: input.name,
              slug: input.slug,
              description: input.description,
              price: input.price,
              compareAtPrice: input.compareAtPrice,
              sku: input.sku,
              brand: input.brand,
              categoryId: input.categoryId,
              images: input.images,
              attributes: input.attributes,
              inventory: input.inventory,
            },
          },
        });
      } else {
        await createProduct({ variables: { input } });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error al guardar producto: ' + err.message);
    }
  };

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: 'product',
        header: 'Producto',
        render: (p) => (
          <div className="flex items-center gap-3">
            <img
              src={p.images[0]?.url ?? '/placeholder.webp'}
              alt={p.images[0]?.alt ?? p.name}
              className="h-10 w-10 flex-shrink-0 object-cover"
              style={{ border: '1px solid var(--border)', borderRadius: '8px' }}
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <p className="text-xs font-semibold max-w-xs truncate" style={{ color: 'var(--ink)' }}>
                {p.name}
              </p>
              <p className="mono-tag" style={{ fontSize: '0.6rem' }}>{p.sku ?? '—'}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Categoría',
        render: (p) => (
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--red-pale)',
              color: 'var(--red)',
              border: '1px solid var(--red-border)',
              borderRadius: '6px',
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {p.category.name}
          </span>
        ),
      },
      {
        key: 'price',
        header: 'Precio',
        render: (p) => (
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--red)' }}
            >
              {p.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
            </span>
            {p.compareAtPrice && (
              <span className="mono-tag line-through" style={{ fontSize: '0.6rem' }}>
                {p.compareAtPrice.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'stock',
        header: 'Stock',
        render: (p) => {
          const qty = p.inventory.quantity;
          const [color, bg, bd] = qty === 0
            ? ['var(--fail)', 'var(--fail-pale)', 'var(--fail-border)']
            : qty <= 5
              ? ['var(--warn)', 'var(--warn-pale)', 'var(--warn-border)']
              : ['var(--ok)', 'var(--ok-pale)', 'var(--ok-border)'];
          return (
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                color, background: bg, border: `1px solid ${bd}`,
                borderRadius: '6px',
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
            >
              {qty === 0 ? 'Agotado' : `${qty} uds`}
            </span>
          );
        },
      },
      {
        key: 'actions',
        header: '',
        render: (p) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(p)}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 transition-all"
              style={{
                color: 'var(--muted)',
                border: '1.5px solid var(--border)',
                background: 'var(--panel)',
                cursor: 'pointer',
                borderRadius: '8px',
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--red)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--red-border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--red-pale)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--panel)';
              }}
            >
              <Pencil size={11} strokeWidth={2.5} />
              Editar
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 transition-all"
              style={{
                color: 'var(--fail)',
                border: '1.5px solid var(--fail-border)',
                background: 'var(--fail-pale)',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--red)';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--fail-pale)';
                (e.currentTarget as HTMLElement).style.color = 'var(--fail)';
              }}
            >
              <Trash2 size={11} strokeWidth={2.5} />
            </button>
          </div>
        ),
      },
    ],
    [openEditModal, handleDelete]
  );

  const products = data?.products.items ?? [];
  const pagination = data?.products.pagination;

  return (
    <div className="flex flex-col gap-4">
      {/* Style overrides for premium, rounded feel */}
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .premium-input {
          width: 100%;
          background: var(--panel) !important;
          border: 1.5px solid var(--border) !important;
          color: var(--ink) !important;
          padding: 0.6rem 0.85rem !important;
          font-size: 0.875rem !important;
          font-family: 'DM Sans', sans-serif !important;
          outline: none !important;
          border-radius: 10px !important;
          transition: all 0.2s ease !important;
        }
        .premium-input:focus {
          border-color: var(--red) !important;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.08) !important;
        }
        .premium-input:hover:not(:focus) {
          border-color: var(--faint) !important;
        }
        .premium-btn-primary {
          background: linear-gradient(135deg, var(--red) 0%, #EF4444 100%) !important;
          color: #fff !important;
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.85rem !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          padding: 0.6rem 1.5rem !important;
          border: none !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.15) !important;
          transition: all 0.2s ease !important;
        }
        .premium-btn-primary:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 12px -2px rgba(220, 38, 38, 0.25) !important;
          filter: brightness(1.05) !important;
        }
        .premium-btn-secondary {
          background: var(--panel) !important;
          color: var(--muted) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          padding: 0.55rem 1.1rem !important;
          border: 1.5px solid var(--border) !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.35rem !important;
          transition: all 0.2s ease !important;
        }
        .premium-btn-secondary:hover {
          border-color: var(--red) !important;
          color: var(--red) !important;
          background: var(--red-pale) !important;
        }
        .premium-btn-secondary:disabled {
          opacity: 0.4 !important;
          cursor: not-allowed !important;
        }
        /* Make overall table rounded */
        .cmd-card {
          border-radius: 12px !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative" style={{ maxWidth: '18rem', width: '100%' }}>
          <Search
            size={14} strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--faint)' }}
          />
          <input
            type="search"
            placeholder="Buscar por nombre, SKU..."
            value={search}
            onChange={handleSearch}
            className="premium-input"
            style={{ paddingLeft: '2.25rem' }}
            aria-label="Buscar productos"
          />
        </div>
        <button className="premium-btn-primary" onClick={openCreateModal}>
          <Plus size={13} strokeWidth={2.5} />
          <span>Nuevo producto</span>
        </button>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-3 text-sm"
          style={{ background: 'var(--fail-pale)', border: '1px solid var(--fail-border)', color: 'var(--fail)', borderRadius: '10px' }}
        >
          Error: {error.message}
        </div>
      )}

      <DataTable<Product>
        columns={columns}
        rows={products}
        keyExtractor={(p) => p.id}
        loading={loading && products.length === 0}
        emptyTitle="Sin productos"
        emptyDescription="Crea tu primer producto con el botón de arriba."
      />

      {pagination && pagination.total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <span className="mono-tag">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} de {pagination.total} productos
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="premium-btn-secondary">
              ← Anterior
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.hasNextPage} className="premium-btn-secondary">
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: 16
        }}>
          <div style={{
            width: '100%', maxWidth: '32.5rem',
            maxHeight: 'calc(100vh - 48px)', overflowY: 'auto',
            background: 'var(--panel)',
            border: '1px solid rgba(229, 231, 235, 0.9)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            borderRadius: '16px', padding: '28px', position: 'relative',
            animation: 'scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}>
            {/* Glowing top line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              background: 'linear-gradient(90deg, var(--red) 0%, #F43F5E 50%, var(--red) 100%)',
              borderTopLeftRadius: '16px', borderTopRightRadius: '16px'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)', letterSpacing: '0.04em' }}>
                {editingProduct ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <div>
                <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Nombre *</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  value={name} 
                  onChange={(e) => handleNameChange(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Slug *</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>SKU</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={sku} 
                    onChange={(e) => setSku(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Marca</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={brand} 
                    placeholder="Ej: Kraft, Voltra..."
                    onChange={(e) => setBrand(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Categoría *</label>
                  <select 
                    className="premium-input" 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    style={{ background: 'var(--panel)', cursor: 'pointer' }}
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Precio (RD$) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="premium-input" 
                    value={price} 
                    onChange={(e) => setPrice(Number(e.target.value))} 
                    required 
                  />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>P. Comparar</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="premium-input" 
                    value={compareAtPrice} 
                    onChange={(e) => setCompareAtPrice(e.target.value !== '' ? Number(e.target.value) : '')} 
                  />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Stock *</label>
                  <input 
                    type="number" 
                    className="premium-input" 
                    value={stock} 
                    onChange={(e) => setStock(Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>URL de la Imagen</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  value={imageUrl} 
                  placeholder="https://example.com/imagen.jpg"
                  onChange={(e) => setImageUrl(e.target.value)} 
                />
              </div>

              <div>
                <label className="section-label" style={{ display: 'block', marginBottom: 6, fontSize: '0.6875rem' }}>Descripción</label>
                <textarea 
                  className="premium-input" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button 
                  type="button" 
                  className="premium-btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={creating || updating}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="premium-btn-primary"
                  disabled={creating || updating}
                >
                  <span>{creating || updating ? 'Guardando...' : 'Guardar'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
