/**
 * pages/LoginPage.tsx — Sign-in page.
 *
 * Uses TanStack Query's useMutation for the login API call.
 * On success the token + user are stored in AuthContext (memory only)
 * and the user is redirected to the page they originally tried to reach.
 */
import { type FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { useAuth } from '../hooks/useAuth';
import type { AuthUser } from '../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface LocationState {
  from?: { pathname: string };
}

// ─── Spinner icon ─────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect back to the originally requested page after login
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/documents';

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient
        .post<LoginResponse>('/api/auth/login', credentials)
        .then((r) => r.data),
    onSuccess: (data) => {
      login(data.token, data.user);
      void navigate(from, { replace: true });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    loginMutation.mutate({ email: email.trim(), password });
  };

  // Extract a human-readable error message from the mutation error
  const errorMessage = (() => {
    if (!loginMutation.isError) return null;
    const err = loginMutation.error;
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error ===
        'string'
    ) {
      return (err as { response: { data: { error: string } } }).response.data.error;
    }
    return 'Something went wrong. Please try again.';
  })();

  const inputClass =
    'w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm ' +
    'text-text-primary placeholder:text-text-muted ' +
    'transition-colors duration-150 ' +
    'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-surface p-4">
      {/* ── Ambient gradient orbs ────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary-700/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary-500/10 blur-3xl"
      />

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div className="animate-fade-in-up w-full max-w-sm">
        <div className="rounded-2xl border border-surface-border bg-surface-elevated/80 p-8 shadow-lg backdrop-blur-xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-3xl font-bold text-transparent">
              DocEditor
            </h1>
            <p className="mt-2 text-sm text-text-muted">Sign in to your workspace</p>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                className={inputClass}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className={inputClass}
                required
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loginMutation.isPending || !email.trim() || !password}
              className={[
                'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                'bg-gradient-to-r from-primary-500 to-primary-600 font-semibold text-white',
                'transition-all duration-150',
                'hover:-translate-y-px hover:from-primary-400 hover:to-primary-500 hover:shadow-md',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none',
              ].join(' ')}
            >
              {loginMutation.isPending ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-text-muted">
          DocEditor &mdash; secure, collaborative editing
        </p>
      </div>
    </div>
  );
}
