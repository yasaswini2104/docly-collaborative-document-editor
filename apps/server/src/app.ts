/**
 * app.ts — Express application factory (scaffold only).
 *
 * Exports a factory function `createApp()` so tests can spin up a fresh
 * Express instance without binding to a port. Business-logic routers will
 * be registered here in subsequent modules.
 */
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';

export function createApp(): Express {
  const app = express();

  // ── Global middleware ──────────────────────────────────────────────────
  app.use(
    cors({
      origin: process.env['VITE_API_BASE_URL'] ?? 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Health check ───────────────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── Feature routers ────────────────────────────────────────────────────
  // Mounted here in subsequent modules, e.g.:
  //   app.use('/api/auth', authRouter);
  //   app.use('/api/documents', documentsRouter);

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
