import { NavLink } from 'react-router';
import { LayoutDashboard, FileText, Users, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const navItems = [
    { label: 'Dashboard', path: '/documents', icon: LayoutDashboard },
    { label: 'Owned Documents', path: '/documents/owned', icon: FileText },
    { label: 'Shared Documents', path: '/documents/shared', icon: Users },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform flex flex-col border-r border-surface-border bg-surface-elevated transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-surface-border lg:justify-center">
          <h1 className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-2xl font-bold text-transparent">
            DocEditor
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/documents'}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
