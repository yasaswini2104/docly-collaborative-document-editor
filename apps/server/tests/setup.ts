/**
 * tests/setup.ts — Global test environment setup.
 *
 * IMPORTANT: Do NOT import anything here that transitively loads Prisma or
 * any other module that individual test files need to mock.  setupFiles run
 * before each test file in the same module context, so a transitive Prisma
 * import here would cache the real client before vi.mock() in auth.test.ts
 * could intercept it.
 *
 * This file is intentionally minimal — only environment variables.
 */
import 'dotenv/config';
import { beforeAll } from 'vitest';

beforeAll(() => {
  process.env['NODE_ENV'] ??= 'test';
  process.env['JWT_SECRET'] ??= 'test-jwt-secret-do-not-use-in-production';
  process.env['DATABASE_URL'] ??= 'mysql://root:root@localhost:3306/doceditor_test';
});
