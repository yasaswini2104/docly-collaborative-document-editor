import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'How it Works', id: 'how-it-works' },
    { name: 'Preview', id: 'preview' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-surface-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-xl font-bold text-transparent cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
              Docly
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-surface px-4 py-6 shadow-lg animate-fade-in-up">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-base font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.name}
              </button>
            ))}
            
            <div className="h-px w-full bg-surface-border my-2" />
            
            <Link
              to="/login"
              className="text-base font-semibold text-text-primary hover:text-primary-500 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="flex w-full justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
