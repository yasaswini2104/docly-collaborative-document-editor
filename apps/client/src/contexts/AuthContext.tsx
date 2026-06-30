/**
 * contexts/AuthContext.tsx — In-memory authentication state.
 *
 * ARCHITECTURE CONSTRAINT: The JWT token is stored ONLY in React state.
 * It is never written to localStorage, sessionStorage, or any cookie.
 * A page refresh will clear the token (the user must log in again).
 *
 * The tokenStore module-level ref is kept in sync so the Axios singleton
 * can read the latest token without depending on React internals.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { tokenStore } from '../lib/token-store';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  /** Call after a successful login API response. */
  login: (token: string, user: AuthUser) => void;
  /** Clears all auth state from memory. */
  logout: () => void;
  /** True while the initial auth state is being determined. */
  isAuthenticated: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
  });

  const logout = useCallback(() => {
    setAuthState({ token: null, user: null });
  }, []);

  const login = useCallback((token: string, user: AuthUser) => {
    setAuthState({ token, user });
  }, []);

  // Keep the module-level token store in sync with React state.
  // This runs synchronously after every render where token changed,
  // ensuring the Axios interceptor always has the current value.
  useEffect(() => {
    tokenStore.setToken(authState.token);
    // Register the logout callback so a 401 from any API call clears the session
    tokenStore.setOnUnauthorized(authState.token ? logout : null);
  }, [authState.token, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      isAuthenticated: authState.token !== null,
      login,
      logout,
    }),
    [authState, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuthContext — low-level hook that returns the raw context value.
 * Prefer `useAuth` (the public hook in hooks/useAuth.ts).
 */
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
