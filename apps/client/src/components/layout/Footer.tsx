export function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="border-t border-surface-border px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-text-primary">
            Docly — Collaborative Document Editor
          </div>
          <div className="text-sm text-text-secondary">
            &copy; 2026 Docly
          </div>
        </div>
      </div>
      <div className="border-t border-surface-border py-6 px-6">
        <div className="flex justify-center items-center gap-4 text-sm text-text-muted">
          <span>Implemented by Yasaswini</span>
          <span className="text-surface-border">•</span>
          <a
            href="https://github.com/yasaswini2104"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
