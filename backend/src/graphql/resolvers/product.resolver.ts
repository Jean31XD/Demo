import type { AppContext } from '../../context/index.js';
import prisma from '../../adapters/prisma/prisma.client.js';

export const productResolvers = {
  Query: {
    products: async (
      _: unknown,
      args: { filters?: any; page?: number; pageSize?: number },
      ctx: AppContext
    ) => {
      const result = await ctx.services.product.getProducts(
        args.filters ?? {},
        args.page ?? 1,
        args.pageSize ?? 12
      );
      return {
        items: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          hasNextPage: result.hasNextPage,
        },
      };
    },

    productBySlug: async (_: unknown, { slug }: { slug: string }, ctx: AppContext) =>
      ctx.services.product.getProductBySlug(slug),

    productById: async (_: unknown, { id }: { id: string }, ctx: AppContext) =>
      ctx.services.product.getProductById(id),

    categories: async () =>
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
  },

  Mutation: {
    createProduct: async (_: unknown, { input }: { input: any }, ctx: AppContext) =>
      ctx.services.product.createProduct(input),

    updateProduct: async (_: unknown, { id, input }: { id: string; input: any }, ctx: AppContext) =>
      ctx.services.product.updateProduct(id, input),

    deleteProduct: async (_: unknown, { id }: { id: string }, ctx: AppContext) =>
      ctx.services.product.deleteProduct(id),
  },

  // ─── Field Resolvers ─────────────────────────────────────────────────────────

  Product: {
    /** Resuelve la categoría desde caché de Prisma — no genera query extra si
     *  el producto fue cargado con `include: { category: true }`. */
    category: async (product: any) => {
      if (product.category) return product.category;
      return prisma.category.findUnique({ where: { id: product.categoryId } });
    },

    inventory: (product: any) => ({
      available: (product.inventory?.quantity ?? 0) > 0,
      quantity: product.inventory?.quantity ?? 0,
    }),

    /** Productos relacionados: misma categoría, excluyendo el actual, máx 4 */
    relatedProducts: async (product: any) =>
      prisma.product.findMany({
        where: { categoryId: product.categoryId, id: { not: product.id } },
        include: { inventory: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
      }).then(rows => rows.map((p: any) => ({
        ...p,
        images: (() => { try { return JSON.parse(p.images); } catch { return []; } })(),
        attributes: (() => { try { return JSON.parse(p.attributes); } catch { return []; } })(),
      }))),

    createdAt: (product: any) => product.createdAt.toISOString(),
    updatedAt: (product: any) => product.updatedAt.toISOString(),
  },

  Category: {
    /** productCount viene del _count de Prisma */
    productCount: (category: any) => category._count?.products ?? null,
  },
};
