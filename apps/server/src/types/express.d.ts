/**
 * Augment Express's Request interface to include the authenticated user
 * object attached by the `authenticate` middleware.
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
    }
  }
}

export {};
