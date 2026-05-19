import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/graphql/client';
import AppRouter from '@/router';

/**
 * Punto de entrada de la aplicación.
 * ApolloProvider envuelve todo para que cualquier componente
 * pueda acceder al cliente GraphQL mediante hooks de Apollo.
 */
const App: React.FC = () => (
  <ApolloProvider client={client}>
    <AppRouter />
  </ApolloProvider>
);

export default App;
