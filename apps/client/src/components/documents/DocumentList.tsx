import { FilePlus } from 'lucide-react';
import type { DocumentListItem } from '../../types/document';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: DocumentListItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DocumentList({
  documents,
  isLoading,
  emptyMessage = 'No documents found.',
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex h-[140px] flex-col justify-between rounded-xl border border-surface-border bg-surface-elevated p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-surface-hover" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-surface-hover" />
              </div>
            </div>
            <div className="flex justify-between border-t border-surface-border/50 pt-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-surface-hover" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border bg-surface-hover/30 p-8 text-center animate-fade-in">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-border text-text-muted">
          <FilePlus className="h-6 w-6" />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-text-primary">No documents</h3>
        <p className="text-sm text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
