import type { AppContext } from '../../context/index.js';
import { AuthenticationError } from '../../utils/errors.js';
import type { OrderStatus } from '../../adapters/interfaces/IOrderRepository.js';
import prisma from '../../adapters/prisma/prisma.client.js';

export const orderResolvers = {
  Query: {
    myOrders: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      return ctx.services.order.getOrdersByCustomer(ctx.currentCustomer.customerId);
    },

    order: async (_: unknown, { id }: { id: string }, ctx: AppContext) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      return ctx.services.order.getOrderById(id);
    },

    // ── Admin: todas las órdenes con paginación y filtro de estado ──────────
    allOrders: async (
      _: unknown,
      { page = 1, pageSize = 20, status }: { page?: number; pageSize?: number; status?: OrderStatus },
      ctx: AppContext
    ) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      const where = status ? { status } : {};
      const skip = (page - 1) * pageSize;

      const [rows, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: { items: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.order.count({ where }),
      ]);

      // Ingreso total de órdenes no canceladas
      const revenueAgg = await prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { total: true },
      });

      return {
        items: rows.map((o: any) => ({ ...o, status: o.status as OrderStatus })),
        pagination: {
          total,
          page,
          pageSize,
          hasNextPage: page * pageSize < total,
        },
        totalRevenue: revenueAgg._sum.total ?? 0,
      };
    },

    // ── Admin: clientes con paginación ──────────────────────────────────────
    allCustomers: async (
      _: unknown,
      { page = 1, pageSize = 20 }: { page?: number; pageSize?: number },
      ctx: AppContext
    ) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      const skip = (page - 1) * pageSize;

      const [rows, total] = await Promise.all([
        prisma.customer.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.customer.count(),
      ]);

      return {
        items: rows,
        pagination: { total, page, pageSize, hasNextPage: page * pageSize < total },
      };
    },

    // ── Admin: métricas del dashboard ───────────────────────────────────────
    dashboardStats: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.currentCustomer) throw AuthenticationError();

      const [
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        totalCustomers,
        revenueAgg,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.inventory.count({ where: { quantity: { gt: 0, lte: 10 } } }),
        prisma.inventory.count({ where: { quantity: 0 } }),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.customer.count(),
        prisma.order.aggregate({
          where: { status: { not: 'CANCELLED' } },
          _sum: { total: true },
        }),
      ]);

      return {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        totalRevenue: revenueAgg._sum.total ?? 0,
        totalCustomers,
      };
    },
  },

  Mutation: {
    placeOrder: async (
      _: unknown,
      { input }: { input: { items: Array<{ productId: string; quantity: number }>; shippingAddr?: string; notes?: string } },
      ctx: AppContext
    ) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      return ctx.services.order.placeOrder({ customerId: ctx.currentCustomer.customerId, ...input });
    },

    updateOrderStatus: async (
      _: unknown,
      { id, status }: { id: string; status: OrderStatus },
      ctx: AppContext
    ) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      return ctx.services.order.updateStatus(id, status);
    },
  },

  Order: {
    customer: async (order: any, _: unknown, ctx: AppContext) => {
      const customer = await ctx.services.auth.getById(order.customerId);
      return customer ?? { id: order.customerId, email: '—', name: 'Desconocido', orders: [], createdAt: new Date().toISOString() };
    },
    items: (order: any) => order.items ?? [],
    status: (order: any) => order.status,
    createdAt: (order: any) =>
      order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
  },

  OrderItem: {
    product: (item: any, _: unknown, ctx: AppContext) =>
      ctx.loaders.productLoader.load(item.productId),
    subtotal: (item: any) => item.unitPrice * item.quantity,
  },
};
