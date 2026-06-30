/**
 * test/render-utils.tsx — Provider wrapper for component tests.
 *
 * Wraps the component under test with:
 *  - a fresh QueryClient (retries disabled for predictable tests)
 *  - AuthProvider
 *  - createMemoryRouter (React Router v7 test-safe router)
 */
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';

/** Create a fresh QueryClient with retries disabled for tests. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

interface RenderOptions {
  /** Initial URL path, defaults to '/' */
  initialPath?: string;
}

/**
 * Render a page component inside all required providers.
 * The component is mounted at `initialPath` inside a MemoryRouter.
 *
 * Usage:
 *   renderPage(<LoginPage />, { initialPath: '/login' });
 */
export function renderPage(ui: ReactElement, options: RenderOptions = {}) {
  const { initialPath = '/' } = options;
  const client = createTestQueryClient();

  // Wrap the component in a single-route memory router
  const router = createMemoryRouter(
    [{ path: '*', element: ui }],
    { initialEntries: [initialPath] },
  );

  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  );
}
