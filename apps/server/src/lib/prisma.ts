/**
 * lib/prisma.ts — Prisma Client singleton.
 *
 * In development, Vite/tsx hot-reload can cause new PrismaClient instances to
 * be created on every module reload, exhausting the connection pool. The
 * globalThis trick prevents that by reusing the same instance across reloads.
 *
 * In production there is no hot-reload, so the module is only evaluated once
 * and a fresh instance is always created.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
