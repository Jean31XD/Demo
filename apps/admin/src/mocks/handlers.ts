import { graphql, HttpResponse } from 'msw';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS, MOCK_CUSTOMERS } from './data';

function tp(p: typeof MOCK_PRODUCTS[number]) {
  return {
    __typename: 'Product',
    ...p,
    images: p.images.map((img) => ({ __typename: 'ProductImage', ...img })),
    inventory: { __typename: 'ProductInventory', ...p.inventory },
    category: { __typename: 'Category', ...p.category },
  };
}

export const handlers = [
  graphql.mutation('Login', ({ variables }) => {
    const { email } = variables as { email: string; password: string };
    return HttpResponse.json({
      data: {
        login: {
          __typename: 'AuthPayload',
          token: 'mock-admin-token',
          customer: { __typename: 'Customer', id: 'admin-1', name: 'Admin Demo', email },
        },
      },
    });
  }),

  graphql.query('GetAdminProducts', ({ variables }) => {
    const { filters = {}, page = 1, pageSize = 20 } = variables as { filters?: Record<string, unknown>; page?: number; pageSize?: number };
    let items = [...MOCK_PRODUCTS];
    const search = (filters as { search?: string }).search;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    const total = items.length;
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: {
        products: {
          __typename: 'ProductsResult',
          items: items.slice(start, start + pageSize).map(tp),
          pagination: { __typename: 'Pagination', total, page, pageSize, hasNextPage: start + pageSize < total },
        },
      },
    });
  }),

  graphql.query('GetAdminProduct', ({ variables }) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === variables.id) ?? null;
    return HttpResponse.json({
      data: {
        productById: product
          ? { ...tp(product), description: `Descripción de ${product.name}.`, attributes: [] }
          : null,
      },
    });
  }),

  graphql.query('GetCategories', () => {
    return HttpResponse.json({
      data: {
        categories: MOCK_CATEGORIES.map((c) => ({ __typename: 'Category', ...c })),
      },
    });
  }),

  graphql.query('GetDashboardStats', () => {
    return HttpResponse.json({
      data: {
        dashboardStats: {
          __typename: 'DashboardStats',
          totalProducts: MOCK_PRODUCTS.length,
          lowStockProducts: MOCK_PRODUCTS.filter((p) => p.inventory.quantity > 0 && p.inventory.quantity < 15).length,
          outOfStockProducts: MOCK_PRODUCTS.filter((p) => !p.inventory.available).length,
          totalOrders: MOCK_ORDERS.length,
          pendingOrders: MOCK_ORDERS.filter((o) => o.status === 'pending').length,
          totalRevenue: MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0),
          totalCustomers: MOCK_CUSTOMERS.length,
        },
      },
    });
  }),

  graphql.query('GetAllOrders', ({ variables }) => {
    const { page = 1, pageSize = 20, status } = variables as { page?: number; pageSize?: number; status?: string };
    let items = [...MOCK_ORDERS];
    if (status) items = items.filter((o) => o.status === status);
    const total = items.length;
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: {
        allOrders: {
          __typename: 'OrdersResult',
          items: items.slice(start, start + pageSize).map((o) => ({ __typename: 'Order', ...o })),
          pagination: { __typename: 'Pagination', total, page, pageSize, hasNextPage: start + pageSize < total },
          totalRevenue: MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0),
        },
      },
    });
  }),

  graphql.query('GetOrder', ({ variables }) => {
    const order = MOCK_ORDERS.find((o) => o.id === variables.id) ?? null;
    return HttpResponse.json({ data: { order: order ? { __typename: 'Order', ...order } : null } });
  }),

  graphql.query('GetMyOrders', () => {
    return HttpResponse.json({
      data: {
        myOrders: MOCK_ORDERS.slice(0, 2).map((o) => ({ __typename: 'Order', ...o })),
      },
    });
  }),

  graphql.query('GetAllCustomers', ({ variables }) => {
    const { page = 1, pageSize = 20 } = variables as { page?: number; pageSize?: number };
    const total = MOCK_CUSTOMERS.length;
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: {
        allCustomers: {
          __typename: 'CustomersResult',
          items: MOCK_CUSTOMERS.slice(start, start + pageSize).map((c) => ({ __typename: 'Customer', ...c })),
          pagination: { __typename: 'Pagination', total, page, pageSize, hasNextPage: start + pageSize < total },
        },
      },
    });
  }),
];
