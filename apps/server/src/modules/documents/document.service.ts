import { prisma } from '../../lib/prisma.js';
import { DEFAULT_TIPTAP_CONTENT } from './document.schema.js';
import type { CreateDocumentInput, UpdateDocumentInput, Role } from './document.schema.js';

// ─── Domain error ─────────────────────────────────────────────────────────────

export class DocumentError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DocumentError';
  }
}

// ─── Reusable select shapes ───────────────────────────────────────────────────

const documentListSelect = {
  id: true,
  title: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
} as const;

const documentFullSelect = {
  id: true,
  title: true,
  content: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
} as const;

const permissionSelect = {
  id: true,
  documentId: true,
  userId: true,
  role: true,
  createdAt: true,
} as const;

// ─── Document CRUD ────────────────────────────────────────────────────────────

/**
 * Create a new document owned by the given user.
 * Content defaults to an empty TipTap document if not supplied.
 */
export async function createDocument(ownerId: string, data: CreateDocumentInput) {
  return prisma.document.create({
    data: {
      title: data.title,
      content: data.content ?? DEFAULT_TIPTAP_CONTENT,
      ownerId,
    },
    select: documentFullSelect,
  });
}

/**
 * Return all documents owned by the user AND all documents shared with them,
 * without the heavy `content` JSON column (list view only).
 */
export async function listDocuments(userId: string) {
  const [owned, shared] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: userId },
      select: documentListSelect,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.document.findMany({
      where: { permissions: { some: { userId } } },
      select: documentListSelect,
      orderBy: { updatedAt: 'desc' },
    }),
  ]);
  return { owned, shared };
}

/**
 * Fetch a single document by ID (full payload including content).
 * Access control is enforced by the requireDocumentAccess middleware
 * before this is called; no second check here.
 */
export async function getDocumentById(id: string) {
  const doc = await prisma.document.findUnique({
    where: { id },
    select: documentFullSelect,
  });
  if (!doc) throw new DocumentError('Document not found', 404);
  return doc;
}

/**
 * Update a document's title and/or content.
 * Partial update — only provided fields are written.
 */
export async function updateDocument(id: string, data: UpdateDocumentInput) {
  return prisma.document.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
    },
    select: documentFullSelect,
  });
}

/**
 * Permanently delete a document.
 * All associated DocumentPermission rows are cascade-deleted by the DB.
 */
export async function deleteDocument(id: string) {
  await prisma.document.delete({ where: { id } });
}

// ─── Permissions / Sharing ────────────────────────────────────────────────────

/**
 * Grant (or update) access for `targetUserId` on the given document.
 * Uses upsert so calling this again just updates the role.
 * Throws if:
 *   - targetUserId is the document owner (implicit full access, no row needed)
 *   - targetUserId does not exist in the users table
 */
export async function shareDocument(
  documentId: string,
  ownerId: string,
  targetUserId: string,
  role: Role,
) {
  if (targetUserId === ownerId) {
    throw new DocumentError('Cannot grant a permission to the document owner.', 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true },
  });
  if (!targetUser) {
    throw new DocumentError('User not found.', 404);
  }

  return prisma.documentPermission.upsert({
    where: { documentId_userId: { documentId, userId: targetUserId } },
    create: { documentId, userId: targetUserId, role },
    update: { role },
    select: permissionSelect,
  });
}

/**
 * List all permission rows for a document (excludes the owner, who has no row).
 */
export async function listPermissions(documentId: string) {
  return prisma.documentPermission.findMany({
    where: { documentId },
    select: permissionSelect,
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Change the role on an existing permission row.
 */
export async function updatePermission(
  documentId: string,
  targetUserId: string,
  role: Role,
) {
  const existing = await prisma.documentPermission.findUnique({
    where: { documentId_userId: { documentId, userId: targetUserId } },
  });
  if (!existing) {
    throw new DocumentError('Permission not found.', 404);
  }

  return prisma.documentPermission.update({
    where: { documentId_userId: { documentId, userId: targetUserId } },
    data: { role },
    select: permissionSelect,
  });
}

/**
 * Remove a user's access to a document entirely.
 */
export async function revokePermission(documentId: string, targetUserId: string) {
  const existing = await prisma.documentPermission.findUnique({
    where: { documentId_userId: { documentId, userId: targetUserId } },
  });
  if (!existing) {
    throw new DocumentError('Permission not found.', 404);
  }

  await prisma.documentPermission.delete({
    where: { documentId_userId: { documentId, userId: targetUserId } },
  });
}
