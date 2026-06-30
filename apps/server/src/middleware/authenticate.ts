import type { RequestHandler } from 'express';
import { verifyToken } from '../lib/jwt.js';

/**
 * authenticate — Express middleware that enforces JWT authentication.
 *
 * Reads the Authorization header, verifies the Bearer token, and attaches
 * the decoded user payload to `req.user`.
 *
 * Usage:
 *   router.get('/protected', authenticate, handler);
 */
export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed.' });
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch {
    res.status(401).json({ error: 'Token is invalid or has expired.' });
  }
};
