import 'dotenv/config';
import { createServer } from './server.js';
import prisma from './adapters/prisma/prisma.client.js';

const PORT = parseInt(process.env.PORT ?? '4000', 10);

const main = async () => {
  const { httpServer } = await createServer();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`\n🚀 GraphQL API corriendo en http://localhost:${PORT}/graphql`);
  console.log(`🔍 Apollo Sandbox en      http://localhost:${PORT}/graphql`);
  console.log(`❤️  Health check en        http://localhost:${PORT}/health\n`);
};

// Cierre graceful al recibir señal de terminar
const shutdown = async (signal: string) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

main().catch((err) => {
  console.error('Error fatal al iniciar el servidor:', err);
  process.exit(1);
});
