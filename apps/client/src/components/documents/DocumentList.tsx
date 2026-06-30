import { FilePlus } from 'lucide-react';
import type { DocumentListItem } from '../../types/document';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: DocumentListItem[];
  emptyMessage?: string;
}

export function DocumentList({
  documents,
  emptyMessage = 'No documents found.',
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-elevated/50 p-8 text-center animate-fade-in-up">
        <div className="mb-4 rounded-full bg-surface-border p-3 text-text-muted">
          <FilePlus className="h-8 w-8" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-text-primary">It's empty here</h3>
        <p className="max-w-sm text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
