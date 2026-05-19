import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/graphql/client';
import AppRouter from '@/router';

/**
 * Raíz de la app.
 * ApolloProvider + Router. El AuthStore (Zustand) se inicializa automáticamente
 * desde localStorage al importar el módulo — sin Provider adicional.
 */
const App: React.FC = () => (
  <ApolloProvider client={client}>
    <AppRouter />
  </ApolloProvider>
);

export default App;
