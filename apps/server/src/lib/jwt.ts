/**
 * lib/jwt.ts — JWT sign and verify helpers.
 *
 * JWT_SECRET is read lazily (inside each function) so module-load does not
 * throw in test environments where the env var is set inside beforeAll().
 */
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRY = '24h';

export interface TokenPayload {
  sub: string;   // user id
  email: string;
  name: string;
}

function getSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET environment variable is not set.');
  return secret;
}

/**
 * Sign a JWT for the given user data.
 * Returns the signed token string.
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT.
 * Throws if the token is invalid or expired.
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret()) as TokenPayload;
}
