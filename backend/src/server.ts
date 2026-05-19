import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { buildContext, type AppContext } from './context/index.js';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

export const createServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // ─── Apollo Server ──────────────────────────────────────────────────────────
  const server = new ApolloServer<AppContext>({
    typeDefs,
    resolvers,
    plugins: [
      // Graceful shutdown: espera que las requests en vuelo terminen
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Sandbox de Apollo en http://localhost:4000/graphql (solo dev)
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
    // Formatea errores para no filtrar stack traces en producción
    formatError: (formattedError, error) => {
      if (process.env.NODE_ENV === 'production') {
        // En producción: no exponer detalles internos
        return { message: formattedError.message, extensions: { code: formattedError.extensions?.code } };
      }
      return formattedError;
    },
  });

  await server.start();

  // ─── Express Middleware ─────────────────────────────────────────────────────
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ALLOWED_ORIGINS,
      credentials: true,
    }),
    express.json({ limit: '1mb' }),
    expressMiddleware(server, {
      context: buildContext,
    })
  );

  // Health check para monitores / load balancers
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return { app, httpServer, server };
};
