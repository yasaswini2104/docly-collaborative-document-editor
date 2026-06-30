import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowLeft, Save, Loader2, CheckCircle2, Upload, Users } from 'lucide-react';
import { useDocument, useUpdateDocument } from '../hooks/useDocument';
import { TipTapEditor } from '../components/editor/TipTapEditor';
import { UploadModal } from '../components/documents/UploadModal';
import { ShareModal } from '../components/documents/ShareModal';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: document, isLoading, isError } = useDocument(id!);
  const { mutate: updateDocument } = useUpdateDocument();

  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0); // Used to force remount of TipTapEditor
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
    }
  }, [document]);

  const isReadOnly = document?.effectiveRole === 'VIEWER';
  const isOwner = document?.effectiveRole === 'OWNER';

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
    
    titleTimeoutRef.current = setTimeout(() => {
      if (document && newTitle !== document.title && newTitle.trim().length > 0) {
        handleSave({ title: newTitle.trim() });
      }
    }, 1000);
  };

  const handleContentSave = (content: any) => {
    handleSave({ content });
  };

  const handleSave = (updates: { title?: string; content?: any } = {}) => {
    if (isReadOnly || !document) return;
    
    setSaveStatus('saving');
    updateDocument(
      { id: document.id, ...updates },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        },
        onError: () => {
          setSaveStatus('error');
        },
      }
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReadOnly, document]);

  const handleUploadSuccess = () => {
    setUploadKey(k => k + 1); // Force TipTapEditor to remount and pick up new content
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-border border-t-primary-500" />
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">
        Failed to load document. It might not exist, or you don't have access.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              readOnly={isReadOnly}
              placeholder="Document Title"
              className="w-full bg-transparent text-2xl font-bold text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-md px-2 py-1 -ml-2 transition-all read-only:focus:ring-0 read-only:cursor-default"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-danger">
                <Save className="h-4 w-4" />
                Save failed
              </span>
            )}
            {saveStatus === 'idle' && (
              <span className="text-text-muted">
                Last updated {format(new Date(document.updatedAt), 'MMM d, h:mm a')}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                <Upload className="h-4 w-4" />
                Import
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
              >
                <Users className="h-4 w-4" />
                Share
              </button>
            )}
          </div>

          {isReadOnly && (
            <span className="rounded-full bg-surface-border px-2.5 py-1 text-xs font-medium text-text-secondary">
              Read Only
            </span>
          )}
        </div>
      </div>

      <TipTapEditor 
        key={uploadKey}
        initialContent={document.content} 
        onSave={handleContentSave} 
        disabled={isReadOnly}
      />

      <UploadModal
        documentId={document.id}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <ShareModal
        documentId={document.id}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
