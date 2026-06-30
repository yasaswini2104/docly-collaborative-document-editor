import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { signToken } from '../../lib/jwt.js';
import type { LoginInput } from './auth.schema.js';

// ─── Domain error ────────────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 401,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ─── Response shape ──────────────────────────────────────────────────────────

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Validate credentials and return a signed JWT + public user data.
 * Always throws the same generic message to prevent email enumeration.
 */
export async function authenticateUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true, email: true, name: true, passwordHash: true },
  });

  // Run compare even when user is not found to keep constant-time behaviour.
  // The result is discarded when user === null.
  const DUMMY_HASH = '$2b$12$invalidhashfortimingprotection000000000000000000000000';
  const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
  const isMatch = await bcrypt.compare(input.password, hashToCompare);

  if (!user || !isMatch) {
    throw new AuthError('Invalid email or password.');
  }

  const token = signToken({ sub: user.id, email: user.email, name: user.name });

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
}
