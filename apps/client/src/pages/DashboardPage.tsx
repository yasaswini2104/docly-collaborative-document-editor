import { Plus, ArrowRight, Loader2, Clock, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useDocuments } from '../hooks/useDocuments';
import { useCreateDocument } from '../hooks/useDocument';
import { DocumentList } from '../components/documents/DocumentList';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useDocuments();
  const { mutate: createDocument, isPending: isCreating } = useCreateDocument();

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

  const handleCreateDocument = () => {
    createDocument('Untitled Document', {
      onSuccess: (newDoc) => {
        toast.success('Document created');
        navigate(`/documents/${newDoc.id}`);
      },
      onError: () => {
        toast.error('Failed to create document');
      }
    });
  };

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
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-400 hover:to-primary-500 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          New Document
        </button>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-500" />
            Recent Documents
          </h2>
          <Link
            to="/documents/owned"
            className="group flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <DocumentList 
          documents={recentOwned} 
          isLoading={isLoading} 
          emptyMessage="You haven't created any documents yet. Click 'New Document' to get started." 
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary-500" />
            Shared with me
          </h2>
          <Link
            to="/documents/shared"
            className="group flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <DocumentList 
          documents={recentShared} 
          isLoading={isLoading} 
          emptyMessage="No documents have been shared with you." 
        />
      </section>
    </div>
  );
}
