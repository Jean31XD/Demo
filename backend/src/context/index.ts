import type { Request } from 'express';
import { verifyToken, extractToken } from '../utils/jwt.js';
import { ProductService } from '../modules/products/product.service.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { OrderService } from '../modules/orders/order.service.js';
import { PrismaProductRepository } from '../adapters/prisma/product.repository.js';
import { PrismaCustomerRepository } from '../adapters/prisma/customer.repository.js';
import { PrismaOrderRepository } from '../adapters/prisma/order.repository.js';
import { createDataLoaders, type DataLoaders } from '../graphql/dataloaders/index.js';

/**
 * Inyección de dependencias centralizada.
 *
 * Aquí se construye el árbol de dependencias completo en cada request.
 * Para conectar el ERP: reemplazar PrismaXRepository por ERPXAdapter.
 * Cero cambios en resolvers ni servicios.
 */

// ─── Repositorios (Adapters) ─────────────────────────────────────────────────
const productRepo  = new PrismaProductRepository();
const customerRepo = new PrismaCustomerRepository();
const orderRepo    = new PrismaOrderRepository();

// ─── Servicios ────────────────────────────────────────────────────────────────
const productService = new ProductService(productRepo);
const authService    = new AuthService(customerRepo);
const orderService   = new OrderService(orderRepo, productRepo);

// ─── Tipo del Context de Apollo ───────────────────────────────────────────────
export interface AppContext {
  services: {
    product: ProductService;
    auth: AuthService;
    order: OrderService;
  };
  loaders: DataLoaders;
  currentCustomer: { customerId: string; email: string } | null;
}

/**
 * Factory de contexto — se ejecuta en cada request HTTP.
 * DataLoaders se crean aquí para que su caché sea por-request.
 */
export const buildContext = async ({ req }: { req: Request }): Promise<AppContext> => {
  const token = extractToken(req.headers.authorization);
  const currentCustomer = token ? verifyToken(token) : null;

  // DataLoaders se instancian una vez por request
  const loaders = createDataLoaders(productService);

  return {
    services: { product: productService, auth: authService, order: orderService },
    loaders,
    currentCustomer,
  };
};
