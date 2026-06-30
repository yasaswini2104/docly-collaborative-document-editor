import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentList } from '../components/documents/DocumentList';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDocuments();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-border border-t-primary-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">
        Failed to load documents. Please try again later.
      </div>
    );
  }

  const owned = data?.owned ?? [];
  const shared = data?.shared ?? [];
  const recentOwned = owned.slice(0, 4);
  const recentShared = shared.slice(0, 4);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Overview of your recent activity and documents.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-400 hover:to-primary-500 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          New Document
        </button>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Recent Owned Documents</h2>
          {owned.length > 4 && (
            <Link
              to="/documents/owned"
              className="group flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-400"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <DocumentList
          documents={recentOwned}
          emptyMessage="You haven't created any documents yet."
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Recently Shared With You</h2>
          {shared.length > 4 && (
            <Link
              to="/documents/shared"
              className="group flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-400"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <DocumentList
          documents={recentShared}
          emptyMessage="No documents have been shared with you yet."
        />
      </section>
    </div>
  );
}
