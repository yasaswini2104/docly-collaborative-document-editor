import { describe, it, expect } from 'vitest';
import { buildAgent } from './test-utils.js';

// No mocks needed — health and 404 tests make no Prisma queries
const agent = buildAgent();

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await agent.get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(typeof res.body.timestamp).toBe('string');
  });
});

describe('Unknown route', () => {
  it('returns 404 for unregistered paths', async () => {
    const res = await agent.get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Not found' });
  });
});
