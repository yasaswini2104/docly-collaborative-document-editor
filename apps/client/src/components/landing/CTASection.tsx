import { Link } from 'react-router';

export function CTASection() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
        <div className="rounded-3xl bg-surface-elevated border border-surface-border p-8 sm:p-16 shadow-xl relative overflow-hidden">
          {/* Subtle gradient background element */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Start writing today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
              Join thousands of users who have already upgraded their document workflow with Docly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-primary-500 transition-all hover:-translate-y-0.5"
              >
                Sign Up for Free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto rounded-lg border border-surface-border bg-surface px-8 py-3.5 text-base font-semibold text-text-primary shadow-sm hover:bg-surface-hover transition-all hover:-translate-y-0.5"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
