/**
 * document.controller.ts
 *
 * Handles HTTP request/response concerns for the documents feature.
 * All handlers delegate business logic to document.service.ts.
 *
 * Access control is enforced by middleware upstream — controllers
 * can safely assert req.user and req.document are defined.
 */
import type { Request, Response } from 'express';
import {
  createDocumentSchema,
  updateDocumentSchema,
  shareDocumentSchema,
  updatePermissionSchema,
} from './document.schema.js';
import { parseTextToTipTapJSON, tipTapDocumentSchema } from './upload.service.js';
import {
  createDocument,
  listDocuments,
  updateDocument,
  deleteDocument,
  shareDocument,
  listPermissions,
  updatePermission,
  revokePermission,
  DocumentError,
} from './document.service.js';

// ─── Utility ──────────────────────────────────────────────────────────────────

function zodError(res: Response, issues: { path: (string | number | symbol)[]; message: string }[]) {
  res.status(400).json({
    error: 'Validation failed',
    details: issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
  });
}

function handleDocumentError(res: Response, err: unknown) {
  if (err instanceof DocumentError) {
    res.status(err.statusCode).json({ error: err.message });
    return true;
  }
  return false;
}

// ─── Document CRUD ────────────────────────────────────────────────────────────

export async function createDocumentController(req: Request, res: Response) {
  const parsed = createDocumentSchema.safeParse(req.body);
  if (!parsed.success) {
    zodError(res, parsed.error.issues);
    return;
  }
  const doc = await createDocument(req.user!.id, parsed.data);
  res.status(201).json(doc);
}

export async function listDocumentsController(req: Request, res: Response) {
  const result = await listDocuments(req.user!.id);
  res.json(result);
}

export function getDocumentController(req: Request, res: Response) {
  // Document already loaded and access-checked by requireDocumentAccess middleware
  res.json(req.document);
}

export async function updateDocumentController(req: Request, res: Response) {
  const parsed = updateDocumentSchema.safeParse(req.body);
  if (!parsed.success) {
    zodError(res, parsed.error.issues);
    return;
  }
  try {
    const doc = await updateDocument(req.document!.id, parsed.data);
    res.json(doc);
  } catch (err) {
    if (!handleDocumentError(res, err)) throw err;
  }
}

export async function deleteDocumentController(req: Request, res: Response) {
  try {
    await deleteDocument(req.document!.id);
    res.status(204).send();
  } catch (err) {
    if (!handleDocumentError(res, err)) throw err;
  }
}

// ─── Permissions / Sharing ────────────────────────────────────────────────────

export async function shareDocumentController(req: Request, res: Response) {
  const parsed = shareDocumentSchema.safeParse(req.body);
  if (!parsed.success) {
    zodError(res, parsed.error.issues);
    return;
  }
  try {
    const permission = await shareDocument(
      req.document!.id,
      req.user!.id,
      parsed.data.userId,
      parsed.data.role,
    );
    res.status(201).json(permission);
  } catch (err) {
    if (!handleDocumentError(res, err)) throw err;
  }
}

export async function listPermissionsController(req: Request, res: Response) {
  const permissions = await listPermissions(req.document!.id);
  res.json(permissions);
}

export async function updatePermissionController(req: Request, res: Response) {
  const parsed = updatePermissionSchema.safeParse(req.body);
  if (!parsed.success) {
    zodError(res, parsed.error.issues);
    return;
  }
  const { userId } = req.params as { userId: string };
  try {
    const permission = await updatePermission(req.document!.id, userId, parsed.data.role);
    res.json(permission);
  } catch (err) {
    if (!handleDocumentError(res, err)) throw err;
  }
}

export async function revokePermissionController(req: Request, res: Response) {
  const { userId } = req.params as { userId: string };
  try {
    await revokePermission(req.document!.id, userId);
    res.status(204).send();
  } catch (err) {
    if (!handleDocumentError(res, err)) throw err;
  }
}

// ─── Upload implementation ────────────────────────────────────────────────────

export async function uploadDocumentController(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  // Validate extension
  const fileName = req.file.originalname.toLowerCase();
  if (!fileName.endsWith('.txt') && !fileName.endsWith('.md')) {
    res.status(400).json({ error: 'Only .txt and .md files are supported.' });
    return;
  }

  // Validate MIME (Multer gets this from the client, so it's a basic check, we don't do magic-bytes)
  const mime = req.file.mimetype;
  if (!mime.includes('text/plain') && !mime.includes('markdown') && !mime.includes('octet-stream')) {
    res.status(400).json({ error: 'Invalid file type. Must be plain text or markdown.' });
    return;
  }

  try {
    const textContent = req.file.buffer.toString('utf-8');
    const tiptapJson = parseTextToTipTapJSON(textContent);
    
    // Validate resulting structure
    const parsedTipTap = tipTapDocumentSchema.safeParse(tiptapJson);
    if (!parsedTipTap.success) {
      zodError(res, parsedTipTap.error.issues);
      return;
    }

    // Update document
    const doc = await updateDocument(req.document!.id, {
      content: parsedTipTap.data,
    });

    res.json(doc);
  } catch (err) {
    if (!handleDocumentError(res, err)) throw err;
  }
}
