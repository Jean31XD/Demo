import { productTypeDefs } from './product.schema.js';
import { authTypeDefs } from './auth.schema.js';
import { orderTypeDefs } from './order.schema.js';

/**
 * Schema raíz — define los tipos base Query y Mutation.
 * Los demás schemas los extienden con `extend type Query/Mutation`.
 */
const rootTypeDefs = /* GraphQL */ `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [rootTypeDefs, productTypeDefs, authTypeDefs, orderTypeDefs];
