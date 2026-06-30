import { useDocuments } from '../hooks/useDocuments';
import { DocumentList } from '../components/documents/DocumentList';

export default function SharedDocumentsPage() {
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

  const shared = data?.shared ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Shared Documents</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Documents shared with you by other users.
          </p>
        </div>
      </div>

      <DocumentList
        documents={shared}
        emptyMessage="No documents have been shared with you yet."
      />
    </div>
  );
}
