import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client.
 * Created once at module level so it's reused across the whole app.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on 4xx — these are client errors and retrying won't help
      retry: (failureCount, error) => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { status?: number } }).response?.status === 'number'
        ) {
          const status = (error as { response: { status: number } }).response.status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
