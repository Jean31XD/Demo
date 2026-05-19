import React, { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/graphql/queries/catalog.queries';
import type { ProductsResult, ProductFilters } from '@/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const IconEmpty = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6M8 11h6"/>
  </svg>
);

interface ProductListProps {
  filters?: ProductFilters;
  pageSize?: number;
  /** "catalog" (default): muestra contador, load-more y grid de 3 col.
   *  "preview": grid de 4 col, sin contador ni load-more — para secciones de home. */
  variant?: 'catalog' | 'preview';
}

const ProductList: React.FC<ProductListProps> = ({ filters, pageSize = 12, variant = 'catalog' }) => {
  const isPreview = variant === 'preview';

  const { data, loading, error, fetchMore } = useQuery<ProductsResult>(GET_PRODUCTS, {
    variables: { filters: filters ?? {}, page: 1, pageSize },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const handleLoadMore = useCallback(() => {
    if (!data?.products.pagination.hasNextPage) return;
    fetchMore({
      variables: { filters: filters ?? {}, page: data.products.pagination.page + 1, pageSize },
    });
  }, [data, fetchMore, filters, pageSize]);

  if (error && !data) return (
    <div className="empty">
      <IconEmpty />
      <h3>Error cargando productos</h3>
      <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{error.message}</p>
      <button onClick={() => window.location.reload()} className="btn btn--primary btn--sm" style={{ marginTop: 8 }}>
        Reintentar
      </button>
    </div>
  );

  const products = data?.products.items ?? [];
  const hasNextPage = data?.products.pagination.hasNextPage ?? false;
  const total = data?.products.pagination.total;
  const isFirstLoad = loading && products.length === 0;

  return (
    <section aria-label="Catálogo de herramientas">
      {!isPreview && total !== undefined && (
        <p style={{ marginBottom: 16, fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
          {total} {total === 1 ? 'producto' : 'productos'} encontrados
        </p>
      )}

      <div className={`prod-grid ${isPreview ? 'prod-grid--4' : 'prod-grid--3'} stagger`}>
        {isFirstLoad
          ? Array.from({ length: pageSize }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {!isPreview && hasNextPage && (
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="btn btn--ghost btn--lg"
            style={{ minWidth: 200 }}
          >
            {loading ? 'Cargando...' : 'Cargar más productos'}
          </button>
        </div>
      )}

      {!isFirstLoad && products.length === 0 && (
        <div className="empty">
          <IconEmpty />
          <h3>Sin resultados</h3>
          <p>Intenta con otros términos o cambia la categoría</p>
        </div>
      )}
    </section>
  );
};

export default ProductList;
