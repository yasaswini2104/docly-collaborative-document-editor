export function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-xl font-bold text-transparent mb-1">
              Docly
            </span>
            <p className="text-sm text-text-muted">
              Collaborative Document Editor
            </p>
          </div>
          
          <nav className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              License
            </a>
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Docly Inc. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Implemented by Yasaswini
          </p>
        </div>
      </div>
    </footer>
  );
}
