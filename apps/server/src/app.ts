/**
 * app.ts — Express application factory (scaffold only).
 *
 * Exports a factory function `createApp()` so tests can spin up a fresh
 * Express instance without binding to a port. Business-logic routers will
 * be registered here in subsequent modules.
 */
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.router.js';
import { authenticate } from './middleware/authenticate.js';
import { documentsRouter } from './modules/documents/document.router.js';
import { usersRouter } from './modules/users/users.router.js';

export function createApp(): Express {
  const app = express();

  // ── Global middleware ──────────────────────────────────────────────────
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Health check ───────────────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Root endpoint to prevent 404 confusion
  app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Docly API is running smoothly!' });
  });

  // ── Feature routers ────────────────────────────────────────────────────────
  app.use('/api/auth', authRouter);
  app.use('/api/documents', documentsRouter);
  app.use('/api/users', usersRouter);

  // Protected smoke-test endpoint — returns the authenticated user's profile.
  // Real document routes will be added in subsequent modules.
  app.get('/api/me', authenticate, (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  // ── 404 handler ───────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // ── Global error handler ───────────────────────────────────────────────
  // Express 5 no longer requires the 4-argument signature to be recognised as
  // an error handler, but we keep it for explicitness and ESLint compatibility.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  });

  return app;
}
