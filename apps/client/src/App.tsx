/**
 * App.tsx — Root application shell (scaffold only).
 *
 * Router, QueryClientProvider, and AuthContext will be wired here
 * in subsequent modules. For now this renders a minimal placeholder
 * so the dev server starts cleanly.
 */
export default function App() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-text-secondary text-sm">DocEditor — scaffold ready.</p>
    </div>
  );
}
