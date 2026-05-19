import { productResolvers } from './product.resolver.js';
import { authResolvers } from './auth.resolver.js';
import { orderResolvers } from './order.resolver.js';

/**
 * Merge de todos los resolvers.
 * Agregar un nuevo dominio = importar y añadir aquí.
 */
export const resolvers = [
  productResolvers,
  authResolvers,
  orderResolvers,
];
