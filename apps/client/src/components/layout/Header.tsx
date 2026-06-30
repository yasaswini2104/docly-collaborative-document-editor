import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-surface-border bg-surface/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-text-secondary hover:text-text-primary lg:hidden transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-surface-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:block lg:text-sm lg:leading-6">
              <span className="text-text-secondary">Logged in as</span>{' '}
              <span className="font-semibold text-text-primary">{user?.name}</span>
            </div>
            
            <div className="h-6 w-px bg-surface-border hidden lg:block" aria-hidden="true" />
            
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors group"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
