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
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import OwnedDocumentsPage from './pages/OwnedDocumentsPage';
import SharedDocumentsPage from './pages/SharedDocumentsPage';
import EditorPage from './pages/EditorPage';
import { queryClient } from './lib/query-client';

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // Protected routes — ProtectedRoute redirects to /login when unauthenticated
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
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
      {
        // Editor page is outside the sidebar layout for a full-screen feel
        path: '/documents/:id',
        element: (
          <div className="min-h-dvh bg-surface p-4 sm:p-6 lg:p-8">
            <EditorPage />
          </div>
        ),
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

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-surface-elevated text-text-primary border border-surface-border shadow-lg',
              duration: 4000,
            }}
          />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
