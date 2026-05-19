import type { AppContext } from '../../context/index.js';
import { AuthenticationError } from '../../utils/errors.js';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.currentCustomer) throw AuthenticationError();
      return ctx.services.auth.getById(ctx.currentCustomer.customerId);
    },
  },

  Mutation: {
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string },
      ctx: AppContext
    ) => ctx.services.auth.login(email, password),

    register: async (
      _: unknown,
      { input }: { input: { email: string; name: string; password: string } },
      ctx: AppContext
    ) => ctx.services.auth.register(input.email, input.name, input.password),
  },

  Customer: {
    orders: (customer: { id: string }, _: unknown, ctx: AppContext) =>
      ctx.services.order.getOrdersByCustomer(customer.id),

    createdAt: (customer: any) =>
      customer.createdAt instanceof Date
        ? customer.createdAt.toISOString()
        : customer.createdAt,
  },
};
