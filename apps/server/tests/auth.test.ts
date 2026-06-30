/**
 * tests/auth.test.ts — Auth API endpoint tests.
 *
 * HOW THE MOCK WORKS
 * ------------------
 * Vitest statically hoists vi.mock() calls to the top of the compiled file,
 * before any import statement.  This means the prisma module is intercepted
 * BEFORE app.ts (and its transitive dependencies) are loaded.  Any module
 * that later does `import { prisma } from '../../lib/prisma.js'` will receive
 * the mock object, not the real PrismaClient.
 *
 * Do NOT move vi.mock() below the imports — Vitest hoists it anyway, but
 * keeping it visually at the top makes the intent clear.
 */
import { vi, describe, it, expect, afterEach } from 'vitest';

// ── Mock MUST be declared before the transitive import of prisma ──────────────
vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// ── All other imports — loaded AFTER mock registration ────────────────────────
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';  // receives the mock
import { buildAgent } from './test-utils.js';   // createApp() runs with mock in registry

// One app instance per test file; shared across all describe blocks
const agent = buildAgent();

// ── Test fixtures ─────────────────────────────────────────────────────────────

const TEST_PASSWORD = 'alice-password-123';
// 1 bcrypt round for fast tests
const TEST_HASH = bcrypt.hashSync(TEST_PASSWORD, 1);

const mockUser = {
  id: 'usr_alice001',
  email: 'alice@example.com',
  name: 'Alice',
  passwordHash: TEST_HASH,
  createdAt: new Date(),
  updatedAt: new Date(),
};

afterEach(() => {
  vi.clearAllMocks();
});

// ── Login ─────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('returns 200 with token and user on valid credentials', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

    const res = await agent
      .post('/api/auth/login')
      .send({ email: mockUser.email, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(20);
    expect(res.body.user).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
    // Sensitive field must never appear in the response
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('returns 401 on wrong password', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

    const res = await agent
      .post('/api/auth/login')
      .send({ email: mockUser.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  it('returns 401 when user does not exist', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await agent
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'any-password' });

    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid request body', async () => {
    const res = await agent
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('returns 400 when body is empty', async () => {
    const res = await agent.post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('returns 200 with a message (stateless)', async () => {
    const res = await agent.post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: expect.any(String) });
  });
});

// ── Protected route ───────────────────────────────────────────────────────────

describe('GET /api/me', () => {
  it('returns 401 without a token', async () => {
    const res = await agent.get('/api/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with a malformed Authorization header', async () => {
    const res = await agent
      .get('/api/me')
      .set('Authorization', 'InvalidScheme token123');

    expect(res.status).toBe(401);
  });

  it('returns 200 with user data for a valid token', async () => {
    // First, get a real token through the login endpoint
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

    const loginRes = await agent
      .post('/api/auth/login')
      .send({ email: mockUser.email, password: TEST_PASSWORD });

    const token = loginRes.body.token as string;
    expect(typeof token).toBe('string');

    // Then use that token on the protected route
    const meRes = await agent
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
  });
});
