import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '@/store/auth.store';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql',
  credentials: 'include',
});

/**
 * Auth Link — inyecta el JWT Bearer en cada request automáticamente.
 * Lee el token desde Zustand (fuera de React, sin hooks).
 */
const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  graphQLErrors?.forEach(({ message, extensions }) => {
    // Si el token expiró, forzar logout
    if (extensions?.code === 'UNAUTHENTICATED') {
      useAuthStore.getState().logout();
    }
    console.error(`[GraphQL] ${operation.operationName}: ${message}`);
  });
  if (networkError) console.error('[Red]', networkError);
});

const cache = new InMemoryCache({
  typePolicies: {
    Product:  { keyFields: ['id'] },
    Order:    { keyFields: ['id'] },
    Customer: { keyFields: ['id'] },
    Query: {
      fields: {
        products: {
          keyArgs: ['filters'],
          merge(existing = { items: [] }, incoming) {
            return { ...incoming, items: [...(existing.items ?? []), ...incoming.items] };
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  // El orden importa: authLink → errorLink → httpLink
  link: from([authLink, errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
  connectToDevTools: import.meta.env.DEV,
});
