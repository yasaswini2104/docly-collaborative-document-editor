import { z } from 'zod';

/**
 * Request body schema for POST /api/auth/login.
 */
export const loginSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
