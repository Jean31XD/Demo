import { graphql, HttpResponse } from 'msw';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from './data';

type Filters = {
  categoryId?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
};

function applyFilters(filters: Filters = {}) {
  let items = [...MOCK_PRODUCTS];

  if (filters.categoryId) {
    items = items.filter((p) => p.category.id === filters.categoryId);
  }
  if (filters.brand) {
    items = items.filter((p) => p.brand?.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
  }
  if (filters.minPrice != null) {
    items = items.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.inStock) {
    items = items.filter((p) => p.inventory.available);
  }

  switch (filters.sort) {
    case 'price_asc':  items.sort((a, b) => a.price - b.price); break;
    case 'price_desc': items.sort((a, b) => b.price - a.price); break;
    case 'oldest':     items.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
    case 'newest':
    default:           items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
  }

  return items;
}

export const handlers = [
  graphql.query('GetProducts', ({ variables }) => {
    const { filters = {}, page = 1, pageSize = 12 } = variables as { filters?: Filters; page?: number; pageSize?: number };
    const filtered = applyFilters(filters);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return HttpResponse.json({
      data: {
        products: {
          items,
          pagination: { total, page, pageSize, hasNextPage: start + pageSize < total },
        },
      },
    });
  }),

  graphql.query('GetProductBySlug', ({ variables }) => {
    const product = MOCK_PRODUCTS.find((p) => p.slug === variables.slug) ?? null;
    return HttpResponse.json({
      data: {
        productBySlug: product
          ? { ...product, description: `Descripción de ${product.name}. Producto de alta calidad para profesionales.`, relatedProducts: MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.category.id === product.category.id).slice(0, 4) }
          : null,
      },
    });
  }),

  graphql.query('GetCategories', () => {
    return HttpResponse.json({ data: { categories: MOCK_CATEGORIES } });
  }),
];
