import { Router } from 'express';
import { loginSchema, registerSchema } from './auth.schema.js';
import { authenticateUser, registerUser, AuthError } from './auth.service.js';

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Body: { name: string; email: string; password: string }
 * Returns: { token: string; user: { id, email, name } }
 */
authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  try {
    const result = await registerUser(parsed.data);
    res.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    // Re-throw unexpected errors for the global error handler
    throw err;
  }
});

/**
 * POST /api/auth/login
 * Body: { email: string; password: string }
 * Returns: { token: string; user: { id, email, name } }
 */
authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  try {
    const result = await authenticateUser(parsed.data);
    res.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    // Re-throw unexpected errors for the global error handler
    throw err;
  }
});

/**
 * POST /api/auth/logout
 * JWT is stateless — no server-side session to invalidate.
 * The client is responsible for dropping the token from memory.
 */
authRouter.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});
