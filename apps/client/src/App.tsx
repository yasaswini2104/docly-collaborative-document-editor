/**
 * App.tsx — Root application shell.
 *
 * Wires together:
 *  - QueryClientProvider (TanStack Query v5)
 *  - AuthProvider        (in-memory JWT, never localStorage)
 *  - createBrowserRouter (React Router v7)
 *
 * Placeholder routes for modules not yet implemented will be replaced
 * in subsequent development modules.
 */
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import { queryClient } from './lib/query-client';
import { useAuth } from './hooks/useAuth';

// ─── Placeholder — replaced by the Documents module ──────────────────────────

function DocumentsPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-surface">
      <div className="text-center">
        <h1 className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-3xl font-bold text-transparent">
          DocEditor
        </h1>
        <p className="mt-2 text-text-secondary">
          Welcome, <span className="font-semibold text-text-primary">{user?.name}</span>!
        </p>
        <p className="mt-1 text-sm text-text-muted">
          Documents module coming soon.
        </p>
      </div>
      <button
        onClick={logout}
        className="rounded-lg border border-surface-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-danger/50 hover:text-danger"
      >
        Sign out
      </button>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected routes — ProtectedRoute redirects to /login when unauthenticated
  {
    element: <ProtectedRoute />,
    children: [
      {
        // Redirect bare root to /documents
        index: true,
        element: <Navigate to="/documents" replace />,
      },
      {
        path: '/documents',
        element: <DocumentsPlaceholder />,
      },
    ],
  },

  // Fallback for unmatched paths
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </AuthProvider>
    </QueryClientProvider>
  );
}
