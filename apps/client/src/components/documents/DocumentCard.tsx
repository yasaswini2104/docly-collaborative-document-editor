import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Clock, Users, ArrowRight } from 'lucide-react';
import type { DocumentListItem } from '../../types/document';
import { useAuth } from '../../hooks/useAuth';

interface DocumentCardProps {
  document: DocumentListItem;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === document.ownerId;

  return (
    <Link
      to={`/documents/${document.id}`}
      className="group relative flex flex-col justify-between rounded-xl border border-surface-border bg-surface-elevated p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/50 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary line-clamp-1 group-hover:text-primary-400 transition-colors">
              {document.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
              {isOwner ? (
                <span className="rounded-full bg-surface-border px-2 py-0.5 font-medium text-text-secondary">
                  Owned
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-secondary-500/10 px-2 py-0.5 font-medium text-secondary-600 dark:text-secondary-400">
                  <Users className="h-3 w-3" /> Shared
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-surface-border/50 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated {formatDistanceToNow(new Date(document.updatedAt))} ago</span>
        </div>
        <ArrowRight className="h-4 w-4 text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-500 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
