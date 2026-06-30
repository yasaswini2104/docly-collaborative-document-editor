import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router';
import { Sun, Moon, Type, Share2, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/documents', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null; // Don't flash the landing page while redirecting
  }

  return (
    <div className="min-h-dvh flex flex-col bg-surface font-sans text-text-primary">
      {/* 1. Navbar */}
      <header className="flex h-16 items-center justify-between border-b border-surface-border px-6 sm:px-8">
        <div className="text-xl font-bold text-text-primary">
          Docly
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            to="/login"
            className="text-sm font-semibold text-text-primary hover:text-primary-500 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero */}
        <section className="px-6 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:px-12 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Write and share documents, together.
          </h1>
          <p className="mt-6 text-lg text-text-secondary">
            A simple, fast document editor with rich-text formatting and easy sharing — built for small teams.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-lg border border-surface-border bg-surface px-8 py-3 text-base font-semibold text-text-primary shadow-sm hover:bg-surface-hover transition-colors"
            >
              Log In
            </Link>
          </div>
        </section>

        {/* 3. Feature strip */}
        <section className="px-6 pb-24 pt-0 sm:px-8 sm:pb-32 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-surface-elevated border border-surface-border rounded-xl p-6 flex flex-col">
              <Type className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Rich Text Editing</h3>
              <p className="text-text-secondary">
                Bold, italic, headings, and lists in a clean writing surface.
              </p>
            </div>
            <div className="bg-surface-elevated border border-surface-border rounded-xl p-6 flex flex-col">
              <Share2 className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Easy Sharing</h3>
              <p className="text-text-secondary">
                Share documents with teammates and control view or edit access.
              </p>
            </div>
            <div className="bg-surface-elevated border border-surface-border rounded-xl p-6 flex flex-col">
              <Upload className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">File Import</h3>
              <p className="text-text-secondary">
                Upload .txt or .md files and start editing instantly.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="mt-auto">
        <div className="border-t border-surface-border px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-text-primary">
              Docly — Collaborative Document Editor
            </div>
            <a
              href="https://github.com/yasaswini2104"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              GitHub
            </a>
            <div className="text-sm text-text-secondary">
              &copy; 2026 Docly
            </div>
          </div>
        </div>
        <div className="border-t border-surface-border py-6 px-6">
          <div className="text-center text-sm text-text-muted">
            Implemented by Yasaswini
          </div>
        </div>
      </footer>
    </div>
  );
}
