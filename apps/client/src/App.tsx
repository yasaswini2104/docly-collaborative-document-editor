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
import { AppLayout } from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import OwnedDocumentsPage from './pages/OwnedDocumentsPage';
import SharedDocumentsPage from './pages/SharedDocumentsPage';
import { queryClient } from './lib/query-client';

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
        element: <AppLayout />,
        children: [
          {
            // Redirect bare root to /documents
            index: true,
            element: <Navigate to="/documents" replace />,
          },
          {
            path: '/documents',
            element: <DashboardPage />,
          },
          {
            path: '/documents/owned',
            element: <OwnedDocumentsPage />,
          },
          {
            path: '/documents/shared',
            element: <SharedDocumentsPage />,
          },
        ],
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
