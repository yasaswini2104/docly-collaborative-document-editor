import { Plus } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentList } from '../components/documents/DocumentList';

export default function OwnedDocumentsPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Owned Documents</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Documents created and managed by you.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-400 hover:to-primary-500 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          New Document
        </button>
      </div>

      <DocumentList
        documents={owned}
        emptyMessage="You haven't created any documents yet. Create one to get started."
      />
    </div>
  );
}
