/**
 * Augment Express's Request interface to include:
 *  - user   — attached by the `authenticate` middleware
 *  - document — attached by the `requireDocumentAccess` middleware
 *
 * The trailing `export {}` makes this a module so global augmentation compiles
 * correctly under TypeScript's NodeNext module resolution.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };

      document?: {
        id: string;
        title: string;
        content: unknown;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        /** True when the authenticated user is the document owner. */
        isOwner: boolean;
        /** The caller's effective role on this document. */
        effectiveRole: 'OWNER' | 'VIEWER' | 'EDITOR';
      };
    }
  }
}

export {};
