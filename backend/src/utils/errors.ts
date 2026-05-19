import { GraphQLError } from 'graphql';

// ─── Errores tipados para Apollo ──────────────────────────────────────────────
// Apollo Client puede discriminar por `extensions.code` en el frontend.

export const AuthenticationError = (message = 'No autenticado') =>
  new GraphQLError(message, {
    extensions: { code: 'UNAUTHENTICATED' },
  });

export const ForbiddenError = (message = 'Acceso denegado') =>
  new GraphQLError(message, {
    extensions: { code: 'FORBIDDEN' },
  });

export const NotFoundError = (entity: string, id?: string) =>
  new GraphQLError(`${entity}${id ? ` con id "${id}"` : ''} no encontrado`, {
    extensions: { code: 'NOT_FOUND' },
  });

export const ValidationError = (message: string) =>
  new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT' },
  });

export const ConflictError = (message: string) =>
  new GraphQLError(message, {
    extensions: { code: 'CONFLICT' },
  });
