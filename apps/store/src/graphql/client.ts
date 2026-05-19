import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// ─── HTTP Link ───────────────────────────────────────────────────────────────
const httpLink = createHttpLink({
  // Lee el endpoint desde variable de entorno; fallback a localhost para dev
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql',
  // Envía cookies de sesión automáticamente (para auth con cookies httpOnly)
  credentials: 'include',
});

// ─── Auth Link (Auto-login para cliente demo) ──────────────────────────────────
const authLink = setContext(async (_, { headers }) => {
  let token = localStorage.getItem('customer_token');
  if (!token) {
    try {
      const res = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
              }
            }
          `,
          variables: {
            email: 'demo@ferreteria.com',
            password: 'demo1234',
          },
        }),
      });
      const json = await res.json();
      token = json?.data?.login?.token || null;
      if (token) {
        localStorage.setItem('customer_token', token);
      }
    } catch (e) {
      console.error('Error in auto-login:', e);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// ─── Error Link ──────────────────────────────────────────────────────────────
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      console.error(
        `[GraphQL] Operación: ${operation.operationName} | Error: ${message} | Path: ${path?.join('.')}`
      );
    });
  }
  if (networkError) {
    console.error(`[Red] ${networkError.message}`);
  }
});

// ─── Cache Configuration ─────────────────────────────────────────────────────
const cache = new InMemoryCache({
  typePolicies: {
    // Normalización por defecto usando 'id' como clave
    Product: { keyFields: ['id'] },
    Category: { keyFields: ['id'] },
    Order: { keyFields: ['id'] },

    Query: {
      fields: {
        // Paginación por offset: acumula páginas en un solo array
        products: {
          // Re-fetch cuando cambia el objeto filters completo (incluye search y categoryId)
          keyArgs: ['filters'],
          // Merge para paginación progresiva; resetea en página 1 (nueva búsqueda/filtro)
          merge(existing = { items: [] }, incoming, { args }) {
            if (!args || (args as any).page === 1) return incoming;
            return {
              ...incoming,
              items: [...(existing.items ?? []), ...incoming.items],
            };
          },
        },
      },
    },
  },
});

// ─── Apollo Client ────────────────────────────────────────────────────────────
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      // Muestra datos en caché inmediatamente y actualiza en background
      fetchPolicy: 'cache-and-network',
    },
    query: {
      // Para queries puntuales: prefiere caché y evita round-trips innecesarios
      fetchPolicy: 'cache-first',
    },
  },
  // Útil para debugging en la demo
  connectToDevTools: import.meta.env.DEV,
});
