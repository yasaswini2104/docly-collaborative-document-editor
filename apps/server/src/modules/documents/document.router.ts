import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireDocumentAccess } from '../../middleware/require-document-access.js';
import {
  createDocumentController,
  listDocumentsController,
  getDocumentController,
  updateDocumentController,
  deleteDocumentController,
  shareDocumentController,
  listPermissionsController,
  updatePermissionController,
  revokePermissionController,
  uploadScaffoldController,
} from './document.controller.js';

export const documentsRouter = Router();

// All document routes require a valid JWT
documentsRouter.use(authenticate);

// ─── Collection routes (no document middleware — document doesn't exist yet) ──
documentsRouter.get('/', listDocumentsController);
documentsRouter.post('/', createDocumentController);

// ─── Single-document routes ───────────────────────────────────────────────────
documentsRouter.get('/:id', requireDocumentAccess('any'), getDocumentController);
documentsRouter.patch('/:id', requireDocumentAccess('editor'), updateDocumentController);
documentsRouter.delete('/:id', requireDocumentAccess('owner'), deleteDocumentController);

// ─── Upload scaffold (editor or owner) ───────────────────────────────────────
documentsRouter.post('/:id/upload', requireDocumentAccess('editor'), uploadScaffoldController);

// ─── Permission / sharing routes (owner only) ─────────────────────────────────
documentsRouter.get('/:id/permissions', requireDocumentAccess('any'), listPermissionsController);
documentsRouter.post('/:id/permissions', requireDocumentAccess('owner'), shareDocumentController);
documentsRouter.patch(
  '/:id/permissions/:userId',
  requireDocumentAccess('owner'),
  updatePermissionController,
);
documentsRouter.delete(
  '/:id/permissions/:userId',
  requireDocumentAccess('owner'),
  revokePermissionController,
);
