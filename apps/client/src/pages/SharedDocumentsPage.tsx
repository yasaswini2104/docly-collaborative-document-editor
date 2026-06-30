import { useDocuments } from '../hooks/useDocuments';
import { DocumentList } from '../components/documents/DocumentList';

export default function SharedDocumentsPage() {
  const { data, isLoading, isError } = useDocuments();

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Shared with me</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Documents that others have shared with you.
        </p>
      </div>

      <DocumentList 
        documents={shared} 
        isLoading={isLoading} 
        emptyMessage="No documents have been shared with you." 
      />
    </div>
  );
}
