/**
 * components/ProtectedRoute.tsx — Route guard for authenticated pages.
 *
 * Used as a layout route in the router config.  When the user is not
 * authenticated it redirects to /login, preserving the originally requested
 * URL in `state.from` so LoginPage can redirect back after a successful login.
 */
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
