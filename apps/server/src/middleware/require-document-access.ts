/**
 * middleware/require-document-access.ts
 *
 * Factory middleware that enforces document-level access control.
 *
 * Access levels:
 *   'any'    — user must be owner OR have any permission row (VIEWER / EDITOR)
 *   'editor' — user must be owner OR have EDITOR permission
 *   'owner'  — user must be the document owner
 *
 * On success the document (plus effective role) is attached to req.document
 * so downstream controllers can use it without re-querying the database.
 *
 * Existence and access failures both return 404 to prevent leaking
 * information about documents the caller has no access to.
 */
import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';

export type AccessLevel = 'any' | 'editor' | 'owner';

export function requireDocumentAccess(level: AccessLevel): RequestHandler {
  return async (req, res, next) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id; // authenticate runs before this middleware

    // ── Load document ──────────────────────────────────────────────────────
    const doc = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!doc) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    const isOwner = doc.ownerId === userId;

    // ── Owner fast-path ────────────────────────────────────────────────────
    if (isOwner) {
      req.document = { ...doc, isOwner: true, effectiveRole: 'OWNER' };
      next();
      return;
    }

    // ── Owner-only routes ──────────────────────────────────────────────────
    if (level === 'owner') {
      res.status(403).json({ error: 'Only the document owner can perform this action.' });
      return;
    }

    // ── Check permission row ───────────────────────────────────────────────
    const permission = await prisma.documentPermission.findUnique({
      where: { documentId_userId: { documentId: id, userId } },
      select: { role: true },
    });

    if (!permission) {
      // 404 intentional — hides document existence from unauthorized callers
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    // ── Editor-only routes ─────────────────────────────────────────────────
    if (level === 'editor' && permission.role !== 'EDITOR') {
      res.status(403).json({ error: 'Editor access is required to perform this action.' });
      return;
    }

    req.document = { ...doc, isOwner: false, effectiveRole: permission.role };
    next();
  };
}
