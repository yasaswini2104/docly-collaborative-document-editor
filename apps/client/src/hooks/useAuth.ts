/**
 * hooks/useAuth.ts — Public hook for consuming auth state.
 *
 * All components should import from here, not from AuthContext directly.
 * This decouples components from the context implementation.
 */
import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = useAuthContext;
