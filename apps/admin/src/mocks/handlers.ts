import { graphql, HttpResponse } from 'msw';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS, MOCK_CUSTOMERS } from './data';

export const handlers = [
  // ── Products ────────────────────────────────────────────────────────────────
  graphql.query('GetAdminProducts', ({ variables }) => {
    const { filters = {}, page = 1, pageSize = 20 } = variables as { filters?: Record<string, unknown>; page?: number; pageSize?: number };
    let items = [...MOCK_PRODUCTS];
    if ((filters as { search?: string }).search) {
      const q = ((filters as { search?: string }).search ?? '').toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q) || p.sku.includes(q));
    }
    const total = items.length;
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: {
        products: {
          items: items.slice(start, start + pageSize),
          pagination: { total, page, pageSize, hasNextPage: start + pageSize < total },
        },
      },
    });
  }),

  graphql.query('GetAdminProduct', ({ variables }) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === variables.id) ?? null;
    return HttpResponse.json({
      data: {
        productById: product
          ? { ...product, description: `Descripción de ${product.name}.`, attributes: [] }
          : null,
      },
    });
  }),

  graphql.query('GetCategories', () => {
    return HttpResponse.json({ data: { categories: MOCK_CATEGORIES } });
  }),

  // ── Dashboard ───────────────────────────────────────────────────────────────
  graphql.query('GetDashboardStats', () => {
    return HttpResponse.json({
      data: {
        dashboardStats: {
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

  // ── Orders ──────────────────────────────────────────────────────────────────
  graphql.query('GetAllOrders', ({ variables }) => {
    const { page = 1, pageSize = 20, status } = variables as { page?: number; pageSize?: number; status?: string };
    let items = [...MOCK_ORDERS];
    if (status) items = items.filter((o) => o.status === status);
    const total = items.length;
    const start = (page - 1) * pageSize;
    const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0);
    return HttpResponse.json({
      data: {
        allOrders: {
          items: items.slice(start, start + pageSize),
          pagination: { total, page, pageSize, hasNextPage: start + pageSize < total },
          totalRevenue,
        },
      },
    });
  }),

  graphql.query('GetOrder', ({ variables }) => {
    const order = MOCK_ORDERS.find((o) => o.id === variables.id) ?? null;
    return HttpResponse.json({ data: { order } });
  }),

  graphql.query('GetMyOrders', () => {
    return HttpResponse.json({ data: { myOrders: MOCK_ORDERS.slice(0, 2) } });
  }),

  // ── Customers ───────────────────────────────────────────────────────────────
  graphql.query('GetAllCustomers', ({ variables }) => {
    const { page = 1, pageSize = 20 } = variables as { page?: number; pageSize?: number };
    const total = MOCK_CUSTOMERS.length;
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: {
        allCustomers: {
          items: MOCK_CUSTOMERS.slice(start, start + pageSize),
          pagination: { total, page, pageSize, hasNextPage: start + pageSize < total },
        },
      },
    });
  }),

  // ── Auth ────────────────────────────────────────────────────────────────────
  graphql.mutation('Login', ({ variables }) => {
    const { email, password } = variables as { email: string; password: string };
    if (email && password) {
      return HttpResponse.json({
        data: {
          login: {
            token: 'mock-jwt-token-for-demo',
            customer: { id: 'admin-1', name: 'Admin Demo', email },
          },
        },
      });
    }
    return HttpResponse.json({ errors: [{ message: 'Credenciales incorrectas' }] });
  }),
];
