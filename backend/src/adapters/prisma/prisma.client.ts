import { PrismaClient } from '@prisma/client';

/**
 * Singleton de Prisma Client.
 * Un solo pool de conexiones compartido por toda la app.
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

export default prisma;
