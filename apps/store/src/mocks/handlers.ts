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

// Attach __typename so Apollo InMemoryCache can normalize correctly
function typedProduct(p: typeof MOCK_PRODUCTS[number]) {
  return {
    __typename: 'Product' as const,
    ...p,
    images: p.images.map((img) => ({ __typename: 'ProductImage' as const, ...img })),
    inventory: { __typename: 'ProductInventory' as const, ...p.inventory },
    category: { __typename: 'Category' as const, ...p.category },
    attributes: (p.attributes ?? []).map((a) => ({ __typename: 'ProductAttribute' as const, ...a })),
  };
}

function typedCategory(c: typeof MOCK_CATEGORIES[number]) {
  return { __typename: 'Category' as const, ...c };
}

function typedPagination(total: number, page: number, pageSize: number) {
  return { __typename: 'Pagination' as const, total, page, pageSize, hasNextPage: page * pageSize < total };
}

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
    items = items.filter((p) => p.name.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q));
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
  // Handle auto-login from authLink (returns a token so Apollo can proceed)
  graphql.mutation('Login', () => {
    return HttpResponse.json({
      data: {
        login: {
          __typename: 'AuthPayload',
          token: 'mock-token',
          customer: { __typename: 'Customer', id: 'demo-1', name: 'Demo', email: 'demo@ferreteria.com' },
        },
      },
    });
  }),

  graphql.query('GetProducts', ({ variables }) => {
    const { filters = {}, page = 1, pageSize = 12 } = variables as { filters?: Filters; page?: number; pageSize?: number };
    const filtered = applyFilters(filters);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize).map(typedProduct);
    return HttpResponse.json({
      data: {
        products: {
          __typename: 'ProductsResult',
          items,
          pagination: typedPagination(total, page, pageSize),
        },
      },
    });
  }),

  graphql.query('GetProductBySlug', ({ variables }) => {
    const found = MOCK_PRODUCTS.find((p) => p.slug === variables.slug);
    if (!found) return HttpResponse.json({ data: { productBySlug: null } });
    const related = MOCK_PRODUCTS
      .filter((p) => p.id !== found.id && p.category.id === found.category.id)
      .slice(0, 4)
      .map(typedProduct);
    return HttpResponse.json({
      data: {
        productBySlug: {
          ...typedProduct(found),
          description: `${found.name}. Producto de alta calidad para profesionales de la construcción.`,
          relatedProducts: related,
        },
      },
    });
  }),

  graphql.query('GetCategories', () => {
    return HttpResponse.json({ data: { categories: MOCK_CATEGORIES.map(typedCategory) } });
  }),
];
