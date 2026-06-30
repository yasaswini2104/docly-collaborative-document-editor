import { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useUploadDocument } from '../../hooks/useDocument';

interface UploadModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newContent: any) => void;
}

export function UploadModal({ documentId, isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadDocument, isPending } = useUploadDocument();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
      return;
    }
    
    if (!selected.name.endsWith('.txt') && !selected.name.endsWith('.md')) {
      setError('Only .txt and .md files are supported.');
      return;
    }

    setFile(selected);
  };

  const handleUpload = () => {
    if (!file) return;

    uploadDocument(
      { id: documentId, file },
      {
        onSuccess: (data) => {
          onUploadSuccess(data.content);
          setFile(null);
          onClose();
        },
        onError: (err: any) => {
          setError(err.response?.data?.error || 'Upload failed. Please try again.');
        },
      }
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-elevated p-6 shadow-xl border border-surface-border animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Import Document</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Upload a <span className="font-medium text-text-primary">.txt</span> or <span className="font-medium text-text-primary">.md</span> file to overwrite this document's content. Max size: 2MB.
          </p>

          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              file ? 'border-primary-500 bg-primary-500/5' : 'border-surface-border hover:border-text-muted hover:bg-surface-hover/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,text/plain,text/markdown"
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-primary-500/10 p-2 text-primary-500">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="text-sm font-medium text-text-primary">{file.name}</div>
                <div className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</div>
                <button
                  onClick={() => setFile(null)}
                  className="mt-2 text-xs font-medium text-danger hover:text-danger-hover"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-surface-border p-3 text-text-secondary">
                  <Upload className="h-6 w-6" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-primary-500 hover:text-primary-400"
                >
                  Click to select file
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Import
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
