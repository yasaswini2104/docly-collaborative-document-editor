import { z } from 'zod';

// ─── Default TipTap document ──────────────────────────────────────────────────

export const DEFAULT_TIPTAP_CONTENT = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
} as const;

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

const roleSchema = z.enum(['VIEWER', 'EDITOR']);

// Accept any JSON object for document content.
// TipTap structure validation is reserved for the Upload module.
const jsonObjectSchema = z.record(z.string(), z.unknown());

// ─── Document schemas ─────────────────────────────────────────────────────────

export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or fewer'),
  content: jsonObjectSchema.optional(),
});

export const updateDocumentSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must be 255 characters or fewer')
      .optional(),
    content: jsonObjectSchema.optional(),
  })
  .refine((d) => d.title !== undefined || d.content !== undefined, {
    message: 'At least one of title or content must be provided',
  });

// ─── Permission schemas ───────────────────────────────────────────────────────

export const shareDocumentSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  role: roleSchema,
});

export const updatePermissionSchema = z.object({
  role: roleSchema,
});

// ─── Inferred TypeScript types ────────────────────────────────────────────────

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
export type Role = z.infer<typeof roleSchema>;
