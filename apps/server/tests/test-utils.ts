/**
 * tests/test-utils.ts — Shared supertest helper.
 *
 * Each test file imports buildAgent() AFTER its own vi.mock() declarations.
 * Because Vitest hoists vi.mock() before all static imports, by the time
 * buildAgent() runs in a test file the module registry already has the mock
 * in place for any module that would be transitively loaded.
 */
import supertest from 'supertest';
import { createApp } from '../src/app.js';

/** Returns a fresh Supertest agent backed by a new Express app instance. */
export function buildAgent() {
  return supertest(createApp());
}
