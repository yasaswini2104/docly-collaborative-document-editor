/**
 * lib/axios.ts — Axios singleton with authentication interceptors.
 *
 * Request interceptor:  injects `Authorization: Bearer <token>` from the
 *                       in-memory token store on every outbound request.
 *
 * Response interceptor: calls tokenStore.triggerUnauthorized() on 401 so
 *                       AuthContext can clear the session automatically.
 *                       The login endpoint is excluded to avoid clearing a
 *                       non-existent session on credential failures.
 */
import axios from 'axios';
import { tokenStore } from './token-store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      // Skip the login endpoint — a 401 there just means bad credentials
      error.config?.url !== '/api/auth/login'
    ) {
      tokenStore.triggerUnauthorized();
    }
    return Promise.reject(error);
  },
);
