import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, isDeleting, title }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-elevated p-6 shadow-xl border border-surface-border animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Delete Document</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-6">
          Are you sure you want to delete <span className="font-medium text-text-primary">"{title}"</span>? This action cannot be undone and will remove access for all collaborators.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
