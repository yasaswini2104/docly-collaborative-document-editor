/**
 * tests/setup.ts — Backend test setup utilities.
 *
 * - Loads environment variables from the root .env file (test-safe defaults).
 * - Re-exports a `buildApp` helper for Supertest so individual test files
 *   don't have to call createApp() themselves.
 * - Exports a `req` helper that wraps supertest for a fluent request API.
 *
 * Referenced by vitest.config.ts → test.setupFiles.
 */
import 'dotenv/config';
import { beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import type { Express } from 'express';
import { createApp } from '../src/app.js';

// ── Module-level app instance shared across a test suite ──────────────────
let app: Express;

beforeAll(() => {
  // Ensure we have safe test defaults for env vars that may not be set
  process.env['NODE_ENV'] ??= 'test';
  process.env['JWT_SECRET'] ??= 'test-jwt-secret-do-not-use-in-production';
  process.env['DATABASE_URL'] ??= 'mysql://root:root@localhost:3306/doceditor_test';

  app = createApp();
});

afterAll(() => {
  // Nothing to tear down at scaffold level.
  // Database disconnection (Prisma) will be added in subsequent modules.
});

/**
 * Returns a configured Supertest agent for the shared app instance.
 * Usage:
 *   const res = await getAgent().get('/health');
 */
export function getAgent() {
  if (!app) throw new Error('Test app has not been initialised yet.');
  return supertest(app);
}
