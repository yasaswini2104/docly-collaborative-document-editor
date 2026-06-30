/**
 * pages/LoginPage.tsx — Sign-in page.
 *
 * Uses TanStack Query's useMutation for the login API call.
 * On success the token + user are stored in AuthContext (memory only)
 * and the user is redirected to the page they originally tried to reach.
 */
import { type FormEvent, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, FileText, User } from 'lucide-react';
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

// ─── Demo Accounts ────────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  { role: 'Owner', email: 'owner@demo.com', password: 'password123', icon: FileText },
  { role: 'Collaborator', email: 'user@demo.com', password: 'password123', icon: User },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect back to the originally requested page after login
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/documents';

  if (user) {
    return <Navigate to="/documents" replace />;
  }

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
    <div className="flex min-h-dvh bg-surface">
      {/* ── Left Column (Form) ───────────────────────────────────────────────── */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-[45%] lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo & Header */}
          <div className="mb-10">
            <h1 className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-4xl font-bold text-transparent mb-2">
              Docly
            </h1>
            <h2 className="text-2xl font-bold text-text-primary mt-6">Log in to Docly</h2>
            <p className="mt-2 text-text-secondary">Welcome back. Sign in to continue.</p>
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
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="owner@demo.com"
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
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  className={`${inputClass} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-0.5 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              id="login-submit"
              type="submit"
              disabled={loginMutation.isPending || !email.trim() || !password}
              className={[
                'mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                'bg-primary-600 font-semibold text-white shadow-sm',
                'transition-all duration-150',
                'hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-600',
              ].join(' ')}
            >
              {loginMutation.isPending ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-10 pt-8 border-t border-surface-border">
            <h3 className="text-sm font-medium text-text-primary mb-4">Demo Accounts</h3>
            <div className="flex flex-col gap-3">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword(acc.password);
                    }}
                    className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface px-4 py-3 text-left transition-all hover:border-primary-500 hover:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-primary-500 group"
                  >
                    <div className="rounded-md bg-primary-500/10 p-2 text-primary-500">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary group-hover:text-primary-500 transition-colors">{acc.role}</div>
                      <div className="text-xs text-text-secondary">{acc.email}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Column (Illustration) ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center bg-primary-900 overflow-hidden">
        {/* Subtle geometric pattern / glow behind the illustration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-800/40 via-primary-900 to-primary-900"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Abstract SVG Illustration */}
          <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-10 text-white opacity-90">
            {/* Document 1 (Background) */}
            <rect x="60" y="40" width="200" height="220" rx="8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary-300 opacity-50" />
            
            {/* Document 2 (Foreground) */}
            <rect x="120" y="70" width="220" height="240" rx="8" stroke="currentColor" strokeWidth="3" fill="#1e1b4b" className="fill-primary-900" />
            <rect x="120" y="70" width="220" height="240" rx="8" stroke="currentColor" strokeWidth="3" />
            
            {/* Content Lines */}
            <line x1="160" y1="120" x2="300" y2="120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="160" y1="150" x2="280" y2="150" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="160" y1="180" x2="310" y2="180" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Highlighted Line / Cursor block */}
            <rect x="160" y="210" width="100" height="12" rx="4" fill="currentColor" className="text-primary-400" />
            
            {/* Floating geometric elements (Collaboration cursors/nodes) */}
            <circle cx="280" cy="216" r="6" fill="currentColor" className="text-success" />
            <path d="M280 216 L290 230 L275 228 Z" fill="currentColor" className="text-success" />

            <circle cx="100" cy="110" r="6" fill="currentColor" className="text-primary-300" />
            <path d="M100 110 L110 124 L95 122 Z" fill="currentColor" className="text-primary-300" />
            
            {/* Grid subtle decor */}
            <g className="text-primary-500 opacity-20">
              <circle cx="340" cy="50" r="2" fill="currentColor" />
              <circle cx="360" cy="50" r="2" fill="currentColor" />
              <circle cx="380" cy="50" r="2" fill="currentColor" />
              <circle cx="340" cy="70" r="2" fill="currentColor" />
              <circle cx="360" cy="70" r="2" fill="currentColor" />
              <circle cx="380" cy="70" r="2" fill="currentColor" />
            </g>
          </svg>

          <p className="text-lg text-primary-100 font-medium tracking-wide">
            Create, edit, and share documents — together.
          </p>
        </div>
      </div>
    </div>
  );
}
