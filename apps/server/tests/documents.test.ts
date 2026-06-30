/**
 * tests/documents.test.ts — Create Document API integration test
 *
 * Tests POST /api/documents with a mocked Prisma client.
 *
 * WHY THIS FILE WORKS WITHOUT A DATABASE
 * ----------------------------------------
 * vi.mock is statically hoisted by Vitest before any import is evaluated.
 * By the time buildAgent() transitively loads document.service.ts →
 * lib/prisma.ts, the prisma module is already intercepted and returns
 * the mock object defined below.  No real MySQL connection is needed.
 */
import { vi, describe, it, expect, beforeAll, afterEach } from 'vitest';

// ── Mock must be declared before transitive prisma imports ────────────────────
vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    document: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    documentPermission: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// ── Imports run AFTER mock is registered (Vitest hoists vi.mock) ──────────────
import { prisma } from '../src/lib/prisma.js';
import { buildAgent } from './test-utils.js';
import { signToken } from '../src/lib/jwt.js';
import { DEFAULT_TIPTAP_CONTENT } from '../src/modules/documents/document.schema.js';

const agent = buildAgent();

// ── Test fixtures ─────────────────────────────────────────────────────────────

let aliceToken: string;
let authHeader: string;

// signToken needs JWT_SECRET — set by setup.ts beforeAll (via dotenv)
beforeAll(() => {
  aliceToken = signToken({
    sub: 'usr_alice001',
    email: 'alice@example.com',
    name: 'Alice',
  });
  authHeader = `Bearer ${aliceToken}`;
});

const NOW = new Date('2026-01-01T00:00:00Z');

const mockDocument = {
  id: 'doc_abc123',
  title: 'My First Document',
  content: DEFAULT_TIPTAP_CONTENT,
  ownerId: 'usr_alice001',
  createdAt: NOW,
  updatedAt: NOW,
};

afterEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/documents — Create Document
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/documents', () => {
  // ── Happy path ──────────────────────────────────────────────────────────────

  it('creates a document and returns 201 with the new document', async () => {
    vi.mocked(prisma.document.create).mockResolvedValue(mockDocument as never);

    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'My First Document' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: mockDocument.id,
      title: 'My First Document',
      ownerId: 'usr_alice001',
    });
    expect(res.body.content).toBeDefined();
  });

  it('calls prisma.document.create with correct ownerId and title', async () => {
    vi.mocked(prisma.document.create).mockResolvedValue(mockDocument as never);

    await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'My First Document' });

    expect(prisma.document.create).toHaveBeenCalledOnce();
    expect(prisma.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'My First Document',
          ownerId: 'usr_alice001',
        }),
      }),
    );
  });

  it('uses the default TipTap content when content is not supplied', async () => {
    vi.mocked(prisma.document.create).mockResolvedValue(mockDocument as never);

    await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'No Content Supplied' });

    expect(prisma.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: DEFAULT_TIPTAP_CONTENT,
        }),
      }),
    );
  });

  it('accepts custom content and passes it to Prisma', async () => {
    const customContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
    };

    vi.mocked(prisma.document.create).mockResolvedValue({
      ...mockDocument,
      content: customContent,
    } as never);

    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'With Custom Content', content: customContent });

    expect(res.status).toBe(201);
    expect(prisma.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: customContent }),
      }),
    );
  });

  // ── Auth guard ──────────────────────────────────────────────────────────────

  it('returns 401 when the Authorization header is absent', async () => {
    const res = await agent.post('/api/documents').send({ title: 'No Auth' });

    expect(res.status).toBe(401);
    expect(prisma.document.create).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is malformed', async () => {
    const res = await agent
      .post('/api/documents')
      .set('Authorization', 'Bearer this.is.garbage')
      .send({ title: 'Bad Token' });

    expect(res.status).toBe(401);
    expect(prisma.document.create).not.toHaveBeenCalled();
  });

  // ── Validation ──────────────────────────────────────────────────────────────

  it('returns 400 when the title is missing', async () => {
    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(prisma.document.create).not.toHaveBeenCalled();
  });

  it('returns 400 when the title is an empty string', async () => {
    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.details[0].field).toBe('title');
    expect(prisma.document.create).not.toHaveBeenCalled();
  });

  it('returns 400 when the title exceeds 255 characters', async () => {
    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'a'.repeat(256) });

    expect(res.status).toBe(400);
    expect(prisma.document.create).not.toHaveBeenCalled();
  });

  it('returns 400 when content is not a JSON object', async () => {
    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'Valid Title', content: ['invalid', 'array'] });

    expect(res.status).toBe(400);
    expect(prisma.document.create).not.toHaveBeenCalled();
  });

  // ── Response shape ──────────────────────────────────────────────────────────

  it('never exposes internal Prisma error details in the response body', async () => {
    vi.mocked(prisma.document.create).mockRejectedValue(
      new Error('Unexpected database error'),
    );

    const res = await agent
      .post('/api/documents')
      .set('Authorization', authHeader)
      .send({ title: 'DB Error Test' });

    // Global error handler returns 500 with a generic message
    expect(res.status).toBe(500);
    // Raw stack traces must not appear in the response
    expect(JSON.stringify(res.body)).not.toContain('at ');
  });
});
